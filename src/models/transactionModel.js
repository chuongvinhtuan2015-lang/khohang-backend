import db from '../config/db.js';

const Transaction = {
  getAll: async ({ type, search, page = 1, limit = 10 } = {}) => {
    let query = `
      SELECT t.*, u.full_name as user_name,
        (SELECT COUNT(*) FROM transaction_details WHERE transaction_id = t.id) as item_count
      FROM inventory_transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (type) {
      query += ' AND t.type = ?';
      params.push(type);
    }

    if (search) {
      query += ' AND t.transaction_code LIKE ?';
      params.push(`%${search}%`);
    }

    // Lấy tổng số bản ghi
    const [countRows] = await db.query(`SELECT COUNT(*) as total FROM (${query}) as t`, params);
    const total = countRows[0].total;

    // Phân trang
    const offset = (Number(page) - 1) * Number(limit);
    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await db.query(query, params);
    return {
      data: rows,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    };
  },

  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT t.*, u.full_name as user_name
      FROM inventory_transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [id]);
    return rows[0];
  },

  getDetails: async (transactionId) => {
    const [rows] = await db.query(`
      SELECT td.*, p.name as product_name, p.sku, p.unit
      FROM transaction_details td
      LEFT JOIN products p ON td.product_id = p.id
      WHERE td.transaction_id = ?
    `, [transactionId]);
    return rows;
  },

  create: async ({ transaction_code, type, user_id, note, items }) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        'INSERT INTO inventory_transactions (transaction_code, type, user_id, note) VALUES (?, ?, ?, ?)',
        [transaction_code, type, user_id || null, note || null]
      );
      const transactionId = result.insertId;

      let totalAmount = 0;
      for (const item of items) {
        await conn.query(
          'INSERT INTO transaction_details (transaction_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
          [transactionId, item.product_id, item.quantity, item.unit_price]
        );
        totalAmount += item.quantity * item.unit_price;
      }

      await conn.query('UPDATE inventory_transactions SET total_amount = ? WHERE id = ?', [totalAmount, transactionId]);

      await conn.commit();
      return transactionId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  getNextCode: async (type) => {
    const prefix = type === 'IN' ? 'PN' : 'PX';
    const [rows] = await db.query(
      `SELECT transaction_code FROM inventory_transactions WHERE type = ? ORDER BY id DESC LIMIT 1`,
      [type]
    );
    if (rows.length === 0) return `${prefix}001`;
    const lastNum = parseInt(rows[0].transaction_code.replace(prefix, '')) || 0;
    return `${prefix}${String(lastNum + 1).padStart(3, '0')}`;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM inventory_transactions WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

export default Transaction;

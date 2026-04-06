import db from '../../../config/db.js';

class ProductRepository {
  async getAll({ search, category_id, page = 1, limit = 10 } = {}) {
    let query = `
      SELECT p.*, c.name as category_name, s.name as supplier_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += " AND (p.name LIKE ? OR p.sku LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category_id) {
      query += " AND p.category_id = ?";
      params.push(category_id);
    }

    const [countRows] = await db.query(`SELECT COUNT(*) as total FROM (${query}) as t`, params);
    const total = countRows[0].total;

    const offset = (Number(page) - 1) * Number(limit);
    query += " ORDER BY p.id DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));

    const [rows] = await db.query(query, params);
    return { data: rows, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  }

  async create(productData) {
    const { sku, name, category_id, supplier_id, unit, price, quantity_in_stock } = productData;
    const [result] = await db.query(
      'INSERT INTO products (sku, name, category_id, supplier_id, unit, price, quantity_in_stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [sku, name, category_id, supplier_id, unit, price, quantity_in_stock || 0]
    );
    return result.insertId;
  }

  async update(id, productData) {
    const { sku, name, category_id, supplier_id, unit, price, quantity_in_stock } = productData;
    const [result] = await db.query(
      'UPDATE products SET sku = ?, name = ?, category_id = ?, supplier_id = ?, unit = ?, price = ?, quantity_in_stock = ? WHERE id = ?',
      [sku, name, category_id, supplier_id, unit, price, quantity_in_stock, id]
    );
    return result.affectedRows;
  }

  async delete(id) {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows;
  }

  async hasTransactions(id) {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM transaction_details WHERE product_id = ?', [id]);
    return rows[0].count > 0;
  }
}

export default new ProductRepository();

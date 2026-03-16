import db from '../config/db.js';

const Supplier = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM suppliers ORDER BY name');
    return rows;
  },
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM suppliers WHERE id = ?', [id]);
    return rows[0];
  },
  create: async ({ name, contact_name, phone, email, address }) => {
    const [result] = await db.query(
      'INSERT INTO suppliers (name, contact_name, phone, email, address) VALUES (?, ?, ?, ?, ?)',
      [name, contact_name || null, phone || null, email || null, address || null]
    );
    return result.insertId;
  },
  update: async (id, { name, contact_name, phone, email, address }) => {
    const [result] = await db.query(
      'UPDATE suppliers SET name = ?, contact_name = ?, phone = ?, email = ?, address = ? WHERE id = ?',
      [name, contact_name, phone, email, address, id]
    );
    return result.affectedRows;
  },
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM suppliers WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

export default Supplier;

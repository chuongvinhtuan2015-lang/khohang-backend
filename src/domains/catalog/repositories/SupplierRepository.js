import db from '../../../config/db.js';

class SupplierRepository {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM suppliers ORDER BY name');
    return rows;
  }

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM suppliers WHERE id = ?', [id]);
    return rows[0];
  }

  async create({ name, contact_name, phone, email, address }) {
    const [result] = await db.query(
      'INSERT INTO suppliers (name, contact_name, phone, email, address) VALUES (?, ?, ?, ?, ?)',
      [name, contact_name || null, phone || null, email || null, address || null]
    );
    return result.insertId;
  }

  async update(id, { name, contact_name, phone, email, address }) {
    const [result] = await db.query(
      'UPDATE suppliers SET name = ?, contact_name = ?, phone = ?, email = ?, address = ? WHERE id = ?',
      [name, contact_name, phone, email, address, id]
    );
    return result.affectedRows;
  }

  async delete(id) {
    const [result] = await db.query('DELETE FROM suppliers WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

export default new SupplierRepository();

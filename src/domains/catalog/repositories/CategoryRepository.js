import db from '../../../config/db.js';

class CategoryRepository {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY name');
    return rows;
  }

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  }

  async create({ name, description }) {
    const [result] = await db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description || null]);
    return result.insertId;
  }

  async update(id, { name, description }) {
    const [result] = await db.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description, id]);
    return result.affectedRows;
  }

  async delete(id) {
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

export default new CategoryRepository();

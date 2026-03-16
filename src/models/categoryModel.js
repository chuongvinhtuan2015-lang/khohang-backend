import db from '../config/db.js';

const Category = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY name');
    return rows;
  },
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  },
  create: async ({ name, description }) => {
    const [result] = await db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description || null]);
    return result.insertId;
  },
  update: async (id, { name, description }) => {
    const [result] = await db.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description, id]);
    return result.affectedRows;
  },
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

export default Category;

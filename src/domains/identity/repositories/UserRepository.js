import db from '../../../config/db.js';

class UserRepository {
  async getAll() {
    const [rows] = await db.query('SELECT id, username, full_name, email, phone, role, status, created_at FROM users ORDER BY id DESC');
    return rows;
  }

  async getById(id) {
    const [rows] = await db.query('SELECT id, username, full_name, email, phone, role, status, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  async getByUsername(username) {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }

  async create({ username, password_hash, full_name, email, phone, role }) {
    const [result] = await db.query(
      'INSERT INTO users (username, password_hash, full_name, email, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, password_hash, full_name || null, email || null, phone || null, role || 'STAFF']
    );
    return result.insertId;
  }

  async update(id, { full_name, email, phone, role, status }) {
    const [result] = await db.query(
      'UPDATE users SET full_name = ?, email = ?, phone = ?, role = ?, status = ? WHERE id = ?',
      [full_name, email, phone, role, status, id]
    );
    return result.affectedRows;
  }

  async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
  }

  async updatePassword(id, password_hash) {
    const [result] = await db.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [password_hash, id]
    );
    return result.affectedRows;
  }
}

export default new UserRepository();

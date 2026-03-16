import db from '../config/db.js';

const Product = {
  // Lấy tất cả sản phẩm kèm tên danh mục và nhà cung cấp
  getAll: async ({ search, category_id, page = 1, limit = 10 } = {}) => {
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

    // Lấy tổng số bản ghi trước khi LIMIT
    const [countRows] = await db.query(`SELECT COUNT(*) as total FROM (${query}) as t`, params);
    const total = countRows[0].total;

    // Thêm phân trang
    const offset = (Number(page) - 1) * Number(limit);
    query += " ORDER BY p.id DESC LIMIT ? OFFSET ?";
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

  // Lấy 1 sản phẩm theo ID
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  },

  // Thêm sản phẩm mới
  create: async (productData) => {
    const { sku, name, category_id, supplier_id, unit, price, quantity_in_stock } = productData;
    const [result] = await db.query(
      'INSERT INTO products (sku, name, category_id, supplier_id, unit, price, quantity_in_stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [sku, name, category_id, supplier_id, unit, price, quantity_in_stock || 0]
    );
    return result.insertId;
  },

  // Cập nhật sản phẩm
  update: async (id, productData) => {
    const { sku, name, category_id, supplier_id, unit, price, quantity_in_stock } = productData;
    const [result] = await db.query(
      'UPDATE products SET sku = ?, name = ?, category_id = ?, supplier_id = ?, unit = ?, price = ?, quantity_in_stock = ? WHERE id = ?',
      [sku, name, category_id, supplier_id, unit, price, quantity_in_stock, id]
    );
    return result.affectedRows;
  },

  // Xóa sản phẩm
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

export default Product;

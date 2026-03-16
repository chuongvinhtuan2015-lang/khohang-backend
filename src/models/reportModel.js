import db from '../config/db.js';

const Report = {
  // Thống kê doanh thu, chi phí theo khoảng thời gian
  getRevenueStats: async (startDate, endDate) => {
    const [rows] = await db.query(`
      SELECT 
        SUM(CASE WHEN type = 'IN' THEN total_amount ELSE 0 END) as total_import,
        SUM(CASE WHEN type = 'OUT' THEN total_amount ELSE 0 END) as total_export,
        COUNT(id) as total_transactions,
        SUM(CASE WHEN type = 'IN' THEN 1 ELSE 0 END) as count_import,
        SUM(CASE WHEN type = 'OUT' THEN 1 ELSE 0 END) as count_export
      FROM inventory_transactions 
      WHERE created_at BETWEEN ? AND ?
    `, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
    return rows[0];
  },

  // Thống kê doanh thu theo danh mục sản phẩm
  getCategoryStats: async (startDate, endDate) => {
    const [rows] = await db.query(`
      SELECT 
        c.name as category_name,
        SUM(td.quantity * td.unit_price) as value,
        SUM(td.quantity) as total_quantity
      FROM transaction_details td
      JOIN inventory_transactions t ON td.transaction_id = t.id
      JOIN products p ON td.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE t.type = 'OUT' AND t.created_at BETWEEN ? AND ?
      GROUP BY c.id, c.name
      ORDER BY value DESC
    `, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
    return rows;
  },

  // Top 10 sản phẩm xuất nhiều nhất
  getTopProducts: async (startDate, endDate) => {
    const [rows] = await db.query(`
      SELECT 
        p.name as product_name,
        p.sku,
        SUM(td.quantity) as total_sold,
        SUM(td.quantity * td.unit_price) as revenue
      FROM transaction_details td
      JOIN inventory_transactions t ON td.transaction_id = t.id
      JOIN products p ON td.product_id = p.id
      WHERE t.type = 'OUT' AND t.created_at BETWEEN ? AND ?
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT 10
    `, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
    return rows;
  },

  // Top 10 sản phẩm khó bán (xuất ít nhất hoặc không xuất, nhưng còn tồn kho)
  getSlowProducts: async (startDate, endDate) => {
    const [rows] = await db.query(`
      SELECT 
        p.name as product_name,
        p.sku,
        p.quantity_in_stock,
        COALESCE(SUM(CASE WHEN t.type = 'OUT' AND t.created_at BETWEEN ? AND ? THEN td.quantity ELSE 0 END), 0) as total_sold,
        (SELECT MAX(created_at) FROM inventory_transactions it 
         JOIN transaction_details itd ON it.id = itd.transaction_id 
         WHERE itd.product_id = p.id AND it.type = 'OUT') as last_sold
      FROM products p
      LEFT JOIN transaction_details td ON p.id = td.product_id
      LEFT JOIN inventory_transactions t ON td.transaction_id = t.id
      GROUP BY p.id
      ORDER BY total_sold ASC, p.quantity_in_stock DESC
      LIMIT 10
    `, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
    return rows;
  },

  // Chi tiết nhập xuất theo thời gian để vẽ biểu đồ
  getDailyStats: async (startDate, endDate) => {
    const [rows] = await db.query(`
      SELECT 
        DATE(created_at) as date,
        SUM(CASE WHEN type = 'IN' THEN total_amount ELSE 0 END) as import_value,
        SUM(CASE WHEN type = 'OUT' THEN total_amount ELSE 0 END) as export_value,
        SUM(CASE WHEN type = 'IN' THEN 1 ELSE 0 END) as count_in,
        SUM(CASE WHEN type = 'OUT' THEN 1 ELSE 0 END) as count_out
      FROM inventory_transactions
      WHERE created_at BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
    return rows;
  },

  // Lấy danh sách tất cả giao dịch chi tiết trong kỳ
  getTransactionsLog: async (startDate, endDate) => {
    const [rows] = await db.query(`
      SELECT 
        t.transaction_code,
        t.type,
        t.created_at,
        t.total_amount,
        t.note,
        u.full_name as user_name
      FROM inventory_transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.created_at BETWEEN ? AND ?
      ORDER BY t.created_at DESC
    `, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
    return rows;
  }
};

export default Report;

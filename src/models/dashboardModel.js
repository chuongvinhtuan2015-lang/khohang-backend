import db from '../config/db.js';

const Dashboard = {
  getStats: async (range = 'week') => {
    let dateFilter = '1=1';
    if (range === 'today') dateFilter = 'created_at >= CURDATE()';
    else if (range === 'week') dateFilter = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
    else if (range === 'month') dateFilter = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
    else if (range === 'quarter') dateFilter = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)';
    else if (range === 'year') dateFilter = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)';

    const [[products]] = await db.query('SELECT COUNT(*) as total FROM products');
    const [[lowStock]] = await db.query('SELECT COUNT(*) as total FROM products WHERE quantity_in_stock <= 10');
    const [[imports]] = await db.query(`SELECT COUNT(*) as count, COALESCE(SUM(total_amount),0) as total FROM inventory_transactions WHERE type = 'IN' AND ${dateFilter}`);
    const [[exports]] = await db.query(`SELECT COUNT(*) as count, COALESCE(SUM(total_amount),0) as total FROM inventory_transactions WHERE type = 'OUT' AND ${dateFilter}`);
    
    return {
      totalProducts: products.total,
      lowStock: lowStock.total,
      totalImports: imports.count,
      totalImportAmount: Number(imports.total),
      totalExports: exports.count,
      totalExportAmount: Number(exports.total),
    };
  },

  getChartData: async (range = 'week') => {
    let dateFilter = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
    let groupBy = 'DATE(created_at)';
    let selectDate = 'DATE(created_at)';

    if (range === 'today') {
      dateFilter = 'created_at >= CURDATE()';
    } else if (range === 'week') {
      dateFilter = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
    } else if (range === 'month') {
      dateFilter = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
    } else if (range === 'quarter') {
      dateFilter = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)';
      groupBy = 'DATE_FORMAT(created_at, "%Y-%u")'; // Group by week for quarter
      selectDate = 'DATE_FORMAT(created_at, "%Y-%u")';
    } else if (range === 'year') {
      dateFilter = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)';
      groupBy = 'DATE_FORMAT(created_at, "%Y-%m")'; // Group by month for year
      selectDate = 'DATE_FORMAT(created_at, "%Y-%m")';
    }

    const [rows] = await db.query(`
      SELECT 
        ${selectDate} as label,
        type,
        COALESCE(SUM(total_amount), 0) as total
      FROM inventory_transactions
      WHERE ${dateFilter}
      GROUP BY label, type
      ORDER BY label ASC
    `);
    return rows;
  },

  getRecentTransactions: async () => {
    const [rows] = await db.query(`
      SELECT t.id, t.transaction_code, t.type, t.total_amount, t.created_at, t.note,
        (SELECT COUNT(*) FROM transaction_details WHERE transaction_id = t.id) as item_count
      FROM inventory_transactions t
      ORDER BY t.created_at DESC
      LIMIT 5
    `);
    return rows;
  }
};

export default Dashboard;

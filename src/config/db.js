import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Tạo kết nối pool để tối ưu hiệu năng
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '', 
  database: process.env.DB_NAME || 'ManagementInventory',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : undefined
});

// Kiểm tra kết nối
const checkConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Kết nối MySQL thành công!');
    connection.release();
  } catch (error) {
    console.error('❌ Kết nối MySQL thất bại:', error.message);
    console.log('👉 Vui lòng kiểm tra lại file .env hoặc đảm bảo MySQL đang chạy.');
  }
};

checkConnection();

export default db;

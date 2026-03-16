import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ManagementInventory',
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : undefined
};

async function seed() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL.');

    // 1. Khởi tạo cấu trúc bảng (Xóa cũ tạo mới cho sạch)
    console.log('--- Reseting Database Structure ---');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    const tables = ['transaction_details', 'inventory_transactions', 'products', 'suppliers', 'categories', 'users'];
    for (const table of tables) {
      await connection.query(`DROP TABLE IF EXISTS ${table}`);
    }
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // Tạo bảng Users
    await connection.query(`
      CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          full_name VARCHAR(100),
          email VARCHAR(100) UNIQUE,
          phone VARCHAR(20),
          role ENUM('ADMIN', 'MANAGER', 'STAFF') NOT NULL DEFAULT 'STAFF',
          status ENUM('active', 'inactive') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Tạo bảng Categories
    await connection.query(`
      CREATE TABLE categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT
      ) ENGINE=InnoDB;
    `);

    // Tạo bảng Suppliers
    await connection.query(`
      CREATE TABLE suppliers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255),
        address TEXT
      ) ENGINE=InnoDB;
    `);

    // Tạo bảng Products
    await connection.query(`
      CREATE TABLE products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sku VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        category_id INT,
        supplier_id INT,
        unit VARCHAR(50),
        price DECIMAL(15, 2),
        quantity_in_stock INT DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
      ) ENGINE=InnoDB;
    `);

    // Tạo bảng Transactions
    await connection.query(`
      CREATE TABLE inventory_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        transaction_code VARCHAR(50) UNIQUE NOT NULL,
        type ENUM('IN', 'OUT') NOT NULL,
        user_id INT,
        note TEXT,
        total_amount DECIMAL(15, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      ) ENGINE=InnoDB;
    `);

    // Tạo bảng Transaction Details
    await connection.query(`
      CREATE TABLE transaction_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        transaction_id INT,
        product_id INT,
        quantity INT NOT NULL,
        unit_price DECIMAL(15, 2) NOT NULL,
        FOREIGN KEY (transaction_id) REFERENCES inventory_transactions(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      ) ENGINE=InnoDB;
    `);

    // 2. Insert Dữ liệu mẫu
    console.log('--- Seeding Data ---');

    // Seeding 10 Users
    const roles = ['ADMIN', 'MANAGER', 'STAFF', 'STAFF', 'STAFF', 'STAFF', 'STAFF', 'STAFF', 'STAFF', 'STAFF'];
    for (let i = 1; i <= 10; i++) {
        const username = i === 1 ? 'admin' : (i === 2 ? 'manager' : `staff${i}`);
        await connection.query(
            'INSERT INTO users (username, password_hash, full_name, email, role) VALUES (?, ?, ?, ?, ?)',
            [username, '123456', `User ${i}`, `${username}@khohang.pro`, roles[i-1]]
        );
    }
    console.log('✅ 10 Users inserted.');

    // Seeding Categories
    const categoriesArr = ['Điện tử', 'Gia dụng', 'Văn phòng phẩm', 'Công cụ', 'Khác'];
    for (const cat of categoriesArr) {
        await connection.query('INSERT INTO categories (name) VALUES (?)', [cat]);
    }

    // Seeding Suppliers
    const suppliersArr = ['Tổng kho Miền Bắc', 'Công ty Thiết bị số', 'Điện máy Xanh', 'Hải Hà Mobile', 'Gia dụng Pro'];
    for (const sup of suppliersArr) {
        await connection.query('INSERT INTO suppliers (name, contact_name, phone) VALUES (?, ?, ?)', [sup, 'Người đại diện', '0912345678']);
    }

    // Seeding 20 Products
    const baseProducts = [
        { sku: 'IP15', name: 'iPhone 15 Pro', unit: 'Cái', price: 25000000 },
        { sku: 'SS24', name: 'Galaxy S24 Ultra', unit: 'Cái', price: 23000000 },
        { sku: 'MACM3', name: 'MacBook Air M3', unit: 'Cái', price: 32000000 },
        { sku: 'DELL7', name: 'Dell Latitude 7490', unit: 'Cái', price: 12000000 },
        { sku: 'SNWF', name: 'Sony WH-1000XM5', unit: 'Cái', price: 8000000 },
        { sku: 'TLG', name: 'Tủ lạnh LG', unit: 'Cái', price: 15000000 },
        { sku: 'MGSH', name: 'Máy giặt Sharp', unit: 'Cái', price: 7000000 },
        { sku: 'LVSM', name: 'Lò vi sóng Samsung', unit: 'Cái', price: 3000000 },
        { sku: 'QDK', name: 'Quạt đứng Kangaroo', unit: 'Cái', price: 1200000 },
        { sku: 'BTHL', name: 'Bút Thiên Long', unit: 'Hộp', price: 100000 },
        { sku: 'GVP', name: 'Giấy A4 Double A', unit: 'Ram', price: 85000 },
        { sku: 'CHM', name: 'Chuột Logitech', unit: 'Cái', price: 500000 },
        { sku: 'BPH', name: 'Bàn phím cơ AKKO', unit: 'Cái', price: 1500000 },
        { sku: 'MHP', name: 'Màn hình Dell 24 inch', unit: 'Cái', price: 4000000 },
        { sku: 'ODC', name: 'Ổ cứng SSD 1TB', unit: 'Cái', price: 2000000 },
        { sku: 'RAM', name: 'Ram 16GB Kingston', unit: 'Cái', price: 1200000 },
        { sku: 'CAS', name: 'Case máy tính', unit: 'Cái', price: 1000000 },
        { sku: 'NGU', name: 'Nguồn Corsair 650W', unit: 'Cái', price: 1800000 },
        { sku: 'TAN', name: 'Tản nhiệt khí', unit: 'Cái', price: 800000 },
        { sku: 'LOA', name: 'Loa Marshall', unit: 'Cái', price: 6000000 }
    ];

    for (const p of baseProducts) {
        const catId = Math.floor(Math.random() * 5) + 1;
        const supId = Math.floor(Math.random() * 5) + 1;
        await connection.query(
            'INSERT INTO products (sku, name, category_id, supplier_id, unit, price, quantity_in_stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [p.sku, p.name, catId, supId, p.unit, p.price, 100] // Mặc định tồn 100 để test xuất kho
        );
    }
    console.log('✅ 20 Products inserted.');

    // Seeding 50 Nhập kho (PN) & 50 Xuất kho (PX)
    console.log('--- Seeding 100 Transactions ---');
    const [dbProducts] = await connection.query('SELECT id, price FROM products');
    const [dbUsers] = await connection.query('SELECT id FROM users');

    // PN001 to PN050
    for (let i = 1; i <= 50; i++) {
        const code = `PN${String(i).padStart(3, '0')}`;
        const userId = dbUsers[Math.floor(Math.random() * dbUsers.length)].id;
        
        // Phân bổ ngày ngẫu nhiên trong 12 tháng qua
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 365));
        const createdAt = date.toISOString().slice(0, 19).replace('T', ' ');

        const [res] = await connection.query(
            'INSERT INTO inventory_transactions (transaction_code, type, user_id, note, created_at) VALUES (?, "IN", ?, ?, ?)',
            [code, userId, `Phiếu nhập tự động số ${i}`, createdAt]
        );
        const tId = res.insertId;
        
        // Random 1-3 items per transaction
        let total = 0;
        const numItems = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numItems; j++) {
            const p = dbProducts[Math.floor(Math.random() * dbProducts.length)];
            const qty = Math.floor(Math.random() * 20) + 1;
            await connection.query(
                'INSERT INTO transaction_details (transaction_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                [tId, p.id, qty, p.price]
            );
            total += qty * p.price;
        }
        await connection.query('UPDATE inventory_transactions SET total_amount = ? WHERE id = ?', [total, tId]);
    }

    // PX001 to PX050
    for (let i = 1; i <= 50; i++) {
        const code = `PX${String(i).padStart(3, '0')}`;
        const userId = dbUsers[Math.floor(Math.random() * dbUsers.length)].id;
        
        // Phân bổ ngày ngẫu nhiên trong 12 tháng qua
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 365));
        const createdAt = date.toISOString().slice(0, 19).replace('T', ' ');

        const [res] = await connection.query(
            'INSERT INTO inventory_transactions (transaction_code, type, user_id, note, created_at) VALUES (?, "OUT", ?, ?, ?)',
            [code, userId, `Phiếu xuất tự động số ${i}`, createdAt]
        );
        const tId = res.insertId;
        
        let total = 0;
        const numItems = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numItems; j++) {
            const p = dbProducts[Math.floor(Math.random() * dbProducts.length)];
            const qty = Math.floor(Math.random() * 5) + 1;
            await connection.query(
                'INSERT INTO transaction_details (transaction_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                [tId, p.id, qty, p.price]
            );
            total += qty * p.price;
        }
        await connection.query('UPDATE inventory_transactions SET total_amount = ? WHERE id = ?', [total, tId]);
    }

    console.log('✅ 100 Transactions (50 IN, 50 OUT) inserted.');
    console.log('⭐ SEEDING SUCCESSFUL!');

  } catch (error) {
    console.error('❌ Error seeding:', error);
  } finally {
    if (connection) await connection.end();
  }
}

seed();

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test DB Connection
import './src/config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Cho phép tất cả các nguồn truy cập (phù hợp cho test/dev)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
import productRoutes from './src/routes/productRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import supplierRoutes from './src/routes/supplierRoutes.js';
import transactionRoutes from './src/routes/transactionRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Inventory Management API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

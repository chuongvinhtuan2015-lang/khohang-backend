import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';

dotenv.config();

import './src/config/db.js';

const app = express();
app.use(compression());
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

import productRoutes from './src/domains/catalog/routes/productRoutes.js';
import categoryRoutes from './src/domains/catalog/routes/categoryRoutes.js';
import supplierRoutes from './src/domains/catalog/routes/supplierRoutes.js';
import transactionRoutes from './src/domains/inventory/routes/transactionRoutes.js';
import userRoutes from './src/domains/identity/routes/userRoutes.js';
import dashboardRoutes from './src/domains/reporting/routes/dashboardRoutes.js';
import authRoutes from './src/domains/identity/routes/authRoutes.js';
import reportRoutes from './src/domains/reporting/routes/reportRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('Inventory Management API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

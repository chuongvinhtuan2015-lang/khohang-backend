import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { wafMiddleware } from './src/middleware/wafMiddleware.js';

dotenv.config();

import './src/config/db.js';

const app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(compression());

// Security headers
app.use(helmet());

// Rate limiting to prevent brute force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút' }
});
app.use('/api/', limiter);

// WAF (Web Application Firewall)
app.use('/api/', wafMiddleware);

const PORT = process.env.PORT || 5000;

import productRoutes from './src/domains/catalog/routes/productRoutes.js';
import categoryRoutes from './src/domains/catalog/routes/categoryRoutes.js';
import supplierRoutes from './src/domains/catalog/routes/supplierRoutes.js';
import transactionRoutes from './src/domains/inventory/routes/transactionRoutes.js';
import userRoutes from './src/domains/identity/routes/userRoutes.js';
import dashboardRoutes from './src/domains/reporting/routes/dashboardRoutes.js';
import authRoutes from './src/domains/identity/routes/authRoutes.js';
import reportRoutes from './src/domains/reporting/routes/reportRoutes.js';
import securityRoutes from './src/domains/identity/routes/securityRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/security', securityRoutes);

app.get('/', (req, res) => {
  res.send('Inventory Management API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

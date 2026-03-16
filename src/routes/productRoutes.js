import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { verifyToken, isManager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getProducts);
router.get('/:id', verifyToken, getProductById);
router.post('/', verifyToken, isManager, createProduct);
router.put('/:id', verifyToken, isManager, updateProduct);
router.delete('/:id', verifyToken, isManager, deleteProduct);

export default router;

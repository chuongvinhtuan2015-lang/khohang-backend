import express from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { verifyToken, isManager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getCategories);
router.get('/:id', verifyToken, getCategoryById);
router.post('/', verifyToken, isManager, createCategory);
router.put('/:id', verifyToken, isManager, updateCategory);
router.delete('/:id', verifyToken, isManager, deleteCategory);

export default router;

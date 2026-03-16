import express from 'express';
import { getTransactions, getTransactionById, createTransaction, deleteTransaction } from '../controllers/transactionController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getTransactions);
router.get('/:id', verifyToken, getTransactionById);
router.post('/', verifyToken, createTransaction);
router.delete('/:id', verifyToken, isAdmin, deleteTransaction);
export default router;

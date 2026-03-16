import express from 'express';
import { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } from '../controllers/supplierController.js';
import { verifyToken, isManager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getSuppliers);
router.get('/:id', verifyToken, getSupplierById);
router.post('/', verifyToken, isManager, createSupplier);
router.put('/:id', verifyToken, isManager, updateSupplier);
router.delete('/:id', verifyToken, isManager, deleteSupplier);

export default router;

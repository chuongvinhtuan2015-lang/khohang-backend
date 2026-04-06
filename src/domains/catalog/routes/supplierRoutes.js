import express from 'express';
import { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } from '../controllers/supplierController.js';
import { verifyToken, isAdmin } from '../../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getSuppliers);
router.get('/:id', verifyToken, getSupplierById);
router.post('/', verifyToken, isAdmin, createSupplier);
router.put('/:id', verifyToken, isAdmin, updateSupplier);
router.delete('/:id', verifyToken, isAdmin, deleteSupplier);

export default router;

import express from 'express';
import { getGeneralReport } from '../controllers/reportController.js';
import { verifyToken, isManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// Chỉ quản lý trở lên mới được xem báo cáo
router.get('/general', verifyToken, isManager, getGeneralReport);

export default router;

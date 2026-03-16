import express from 'express';
import { login } from '../controllers/authController.js';
import { changePassword } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/login', login);
router.post('/change-password', verifyToken, changePassword);
export default router;

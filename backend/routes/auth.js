import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

// Kết nối ví (Web3 login)
router.post('/connect', authController.connectWallet.bind(authController));

// Cập nhật profile
router.put('/profile', authController.updateProfile.bind(authController));

// Lấy thông tin user
router.get('/:address', authController.getUser.bind(authController));

// Lấy danh sách users
router.get('/', authController.getUsers.bind(authController));

export default router;


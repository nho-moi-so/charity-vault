import express from 'express';
import donationController from '../controllers/donationController.js';

const router = express.Router();

// Lấy lịch sử giao dịch của user
router.get('/user/:address', donationController.getUserDonations.bind(donationController));

// Lấy lịch sử giao dịch của quỹ
router.get('/fund/:fundId', donationController.getFundDonations.bind(donationController));

export default router;

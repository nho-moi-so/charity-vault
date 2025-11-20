import express from 'express';
import fundController from '../controllers/fundController.js';

const router = express.Router();

// Tạo quỹ mới
router.post('/create', fundController.createFund.bind(fundController));

// Quyên góp
router.post('/donate', fundController.donate.bind(fundController));

// Rút tiền
router.post('/withdraw', fundController.withdraw.bind(fundController));

// Lấy danh sách quỹ
router.get('/', fundController.getFunds.bind(fundController));

// Lấy thông tin quỹ theo ID
router.get('/:fundId', fundController.getFundById.bind(fundController));

// Lấy tổng số quỹ
router.get('/stats/total', fundController.getTotalFunds.bind(fundController));

// Sync endpoints (cho frontend sau khi user đã ký transaction)
router.post('/sync', fundController.syncFund.bind(fundController));
router.post('/sync-donation', fundController.syncDonation.bind(fundController));

export default router;


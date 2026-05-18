import express from 'express';
import { upsertCoupon, validateCoupon } from '../controllers/couponController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/validate', protect, validateCoupon);
router.post('/', protect, admin, upsertCoupon);

export default router;

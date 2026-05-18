import express from 'express';
import { createOrder, getOrders, invoice, myOrders, updateOrderStatus, verifyPayment } from '../controllers/orderController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/mine', protect, myOrders);
router.get('/', protect, admin, getOrders);
router.get('/:id/invoice', protect, invoice);
router.put('/:id', protect, admin, updateOrderStatus);

export default router;

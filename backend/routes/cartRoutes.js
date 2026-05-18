import express from 'express';
import { addToCart, clearCart, readCart, removeCartItem, updateCartItem } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(readCart).post(addToCart).delete(clearCart);
router.route('/:productId').put(updateCartItem).delete(removeCartItem);

export default router;

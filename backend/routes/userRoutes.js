import express from 'express';
import { dashboardStats, getUsers, getWishlist, toggleWishlist, updateUserRole } from '../controllers/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.get('/', protect, admin, getUsers);
router.get('/stats', protect, admin, dashboardStats);
router.put('/:id/role', protect, admin, updateUserRole);

export default router;

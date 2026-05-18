import express from 'express';
import { forgotPassword, login, loginRules, me, register, registerRules, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, me);
router.put('/profile', protect, updateProfile);

export default router;

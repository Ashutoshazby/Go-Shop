import express from 'express';
import {
  createProduct,
  createReview,
  deleteProduct,
  getProduct,
  getProducts,
  productRules,
  updateProduct
} from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, productRules, validate, createProduct);
router.route('/:id').get(getProduct).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.post('/:id/reviews', protect, createReview);

export default router;

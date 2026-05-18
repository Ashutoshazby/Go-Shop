import Coupon from '../models/Coupon.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const validateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.body.code?.toUpperCase(), active: true });
  if (!coupon || (coupon.expiresAt && coupon.expiresAt <= new Date())) {
    const error = new Error('Invalid or expired coupon');
    error.statusCode = 404;
    throw error;
  }
  res.json(coupon);
});

export const upsertCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOneAndUpdate({ code: req.body.code.toUpperCase() }, req.body, {
    upsert: true,
    new: true,
    runValidators: true
  });
  res.status(201).json(coupon);
});

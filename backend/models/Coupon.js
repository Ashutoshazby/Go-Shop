import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    value: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0 },
    expiresAt: Date,
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Coupon', couponSchema);

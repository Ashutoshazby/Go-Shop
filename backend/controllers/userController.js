import User from '../models/User.js';
import Wishlist from '../models/Wishlist.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getUsers = asyncHandler(async (_req, res) => {
  res.json(await User.find({}).select('-password').sort('-createdAt'));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  res.json(user);
});

export const getWishlist = asyncHandler(async (req, res) => {
  const list = await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: { products: [] } },
    { upsert: true, new: true }
  ).populate('products');
  res.json(list.products);
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const list = await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: { products: [] } },
    { upsert: true, new: true }
  );
  const exists = list.products.some((id) => id.toString() === req.params.productId);
  list.products = exists
    ? list.products.filter((id) => id.toString() !== req.params.productId)
    : [...list.products, req.params.productId];
  await list.save();
  await list.populate('products');
  res.json(list.products);
});

export const dashboardStats = asyncHandler(async (_req, res) => {
  const [users, orders, products, revenue] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([{ $match: { status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }])
  ]);
  res.json({ users, orders, products, revenue: revenue[0]?.total || 0 });
});

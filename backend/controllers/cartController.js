import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const getCart = (userId) => User.findById(userId).select('cart').populate('cart.product');

export const readCart = asyncHandler(async (req, res) => {
  const user = await getCart(req.user._id);
  res.json(user.cart);
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty = 1, selectedVariant } = req.body;
  const user = await User.findById(req.user._id);
  const item = user.cart.find((cartItem) => cartItem.product.toString() === productId);
  if (item) item.qty += Number(qty);
  else user.cart.push({ product: productId, qty, selectedVariant });
  await user.save();
  res.status(201).json((await getCart(req.user._id)).cart);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const item = user.cart.find((cartItem) => cartItem.product.toString() === req.params.productId);
  if (!item) {
    const error = new Error('Cart item not found');
    error.statusCode = 404;
    throw error;
  }
  item.qty = Math.max(1, Number(req.body.qty));
  await user.save();
  res.json((await getCart(req.user._id)).cart);
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((item) => item.product.toString() !== req.params.productId);
  await user.save();
  res.json((await getCart(req.user._id)).cart);
});

export const clearCart = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { cart: [] });
  res.json([]);
});

import { body } from 'express-validator';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const productRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be valid'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be valid')
];

export const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const keyword = req.query.search
    ? { $text: { $search: req.query.search } }
    : {};
  const filter = {
    ...keyword,
    ...(req.query.category ? { category: req.query.category } : {}),
    ...(req.query.featured ? { isFeatured: req.query.featured === 'true' } : {}),
    ...(req.query.trending ? { isTrending: req.query.trending === 'true' } : {}),
    ...(req.query.min || req.query.max
      ? { price: { ...(req.query.min ? { $gte: Number(req.query.min) } : {}), ...(req.query.max ? { $lte: Number(req.query.max) } : {}) } }
      : {})
  };
  const sortMap = {
    newest: '-createdAt',
    priceAsc: 'price',
    priceDesc: '-price',
    rating: '-rating',
    popular: '-sold'
  };
  const sort = sortMap[req.query.sort] || '-createdAt';
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit);
  res.json({ products, page, pages: Math.ceil(total / limit), total });
});

export const getProduct = asyncHandler(async (req, res) => {
  const lookup = mongoose.isValidObjectId(req.params.id)
    ? { $or: [{ _id: req.params.id }, { slug: req.params.id }] }
    : { slug: req.params.id };
  const product = await Product.findOne(lookup);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { recentlyViewed: product._id }
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { recentlyViewed: { $each: [product._id], $position: 0, $slice: 10 } }
    });
  }
  const reviews = await Review.find({ product: product._id }).populate('user', 'name avatar').sort('-createdAt');
  const related = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(4);
  res.json({ product, reviews, related });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  res.json({ message: 'Product removed' });
});

export const createReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  await Review.findOneAndUpdate(
    { product: product._id, user: req.user._id },
    { rating: req.body.rating, title: req.body.title, comment: req.body.comment },
    { upsert: true, new: true, runValidators: true }
  );
  const stats = await Review.aggregate([
    { $match: { product: product._id } },
    { $group: { _id: '$product', rating: { $avg: '$rating' }, numReviews: { $sum: 1 } } }
  ]);
  product.rating = stats[0]?.rating || 0;
  product.numReviews = stats[0]?.numReviews || 0;
  await product.save();
  res.status(201).json({ message: 'Review saved' });
});

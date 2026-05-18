import crypto from 'crypto';
import { body } from 'express-validator';
import User from '../models/User.js';
import Wishlist from '../models/Wishlist.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';

const sendAuth = (res, user, status = 200) => {
  res.status(status).json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
  });
};

export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }
  const user = await User.create({ name, email, password });
  await Wishlist.create({ user: user._id, products: [] });
  sendAuth(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
  sendAuth(res, user);
});

export const me = asyncHandler(async (req, res) => {
  res.json(req.user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;
  user.avatar = req.body.avatar ?? user.avatar;
  user.addresses = req.body.addresses ?? user.addresses;
  if (req.body.password) user.password = req.body.password;
  await user.save();
  sendAuth(res, user);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ message: 'If an account exists, reset instructions were sent.' });

  const token = crypto.randomBytes(24).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your Go Shop password',
    html: `<p>Reset your password here: <a href="${resetUrl}">${resetUrl}</a></p>`
  });
  res.json({ message: 'If an account exists, reset instructions were sent.' });
});

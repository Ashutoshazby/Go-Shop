import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from './asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    const error = new Error('Not authorized, no token');
    error.statusCode = 401;
    throw error;
  }

  const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');
  if (!req.user) {
    const error = new Error('User not found');
    error.statusCode = 401;
    throw error;
  }
  next();
});

export const admin = (req, _res, next) => {
  if (req.user?.role === 'admin') return next();
  const error = new Error('Admin access required');
  error.statusCode = 403;
  next(error);
};

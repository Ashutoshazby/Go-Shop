import { validationResult } from 'express-validator';

export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const error = new Error(errors.array().map((item) => item.msg).join(', '));
  error.statusCode = 422;
  next(error);
};

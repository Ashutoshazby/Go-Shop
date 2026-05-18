import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import razorpay from '../config/razorpay.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { buildInvoiceText } from '../utils/invoice.js';
import { sendEmail } from '../utils/sendEmail.js';

const priceParts = async (items, couponCode) => {
  const itemsPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  let discountPrice = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
    if (coupon && itemsPrice >= coupon.minOrderValue && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
      discountPrice = coupon.discountType === 'percentage' ? (itemsPrice * coupon.value) / 100 : coupon.value;
    }
  }
  const taxable = Math.max(0, itemsPrice - discountPrice);
  const taxPrice = Number((taxable * 0.18).toFixed(2));
  const shippingPrice = taxable > 2999 ? 0 : 99;
  const totalPrice = Number((taxable + taxPrice + shippingPrice).toFixed(2));
  return { itemsPrice, discountPrice, taxPrice, shippingPrice, totalPrice };
};

export const createOrder = asyncHandler(async (req, res) => {
  if (!razorpay) {
    const error = new Error('Razorpay is not configured');
    error.statusCode = 503;
    throw error;
  }
  const products = await Product.find({ _id: { $in: req.body.items.map((item) => item.product) } });
  const orderItems = req.body.items.map((item) => {
    const product = products.find((p) => p._id.toString() === item.product);
    return {
      name: product.name,
      image: product.images?.[0]?.url,
      price: product.price,
      qty: item.qty,
      product: product._id
    };
  });
  const prices = await priceParts(orderItems, req.body.couponCode);
  const receipt = `receipt_${Date.now()}`;
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(prices.totalPrice * 100),
    currency: 'INR',
    receipt
  });
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress: req.body.shippingAddress,
    couponCode: req.body.couponCode,
    ...prices,
    paymentResult: { razorpayOrderId: razorpayOrder.id, status: 'created' }
  });
  res.status(201).json({ order, razorpayOrder });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  const signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  if (signature !== razorpay_signature) {
    const error = new Error('Invalid payment signature');
    error.statusCode = 400;
    throw error;
  }
  const order = await Order.findById(orderId).populate('user', 'email name');
  order.status = 'Paid';
  order.paymentResult = {
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    status: 'paid',
    paidAt: new Date()
  };
  await order.save();
  await sendEmail({ to: order.user.email, subject: 'Go Shop order confirmed', html: `<pre>${buildInvoiceText(order)}</pre>` });
  res.json(order);
});

export const myOrders = asyncHandler(async (req, res) => {
  res.json(await Order.find({ user: req.user._id }).sort('-createdAt'));
});

export const getOrders = asyncHandler(async (_req, res) => {
  res.json(await Order.find({}).populate('user', 'name email').sort('-createdAt'));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }
  res.json(order);
});

export const invoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order || (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }
  res.type('text/plain').send(buildInvoiceText(order));
});

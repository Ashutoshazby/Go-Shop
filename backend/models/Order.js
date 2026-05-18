import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    name: String,
    qty: { type: Number, required: true },
    image: String,
    price: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
  },
  { _id: false }
);

const shippingSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema],
    shippingAddress: shippingSchema,
    paymentMethod: { type: String, default: 'Razorpay' },
    paymentResult: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      status: String,
      paidAt: Date
    },
    couponCode: String,
    discountPrice: { type: Number, default: 0 },
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    invoiceNumber: { type: String, unique: true },
    status: {
      type: String,
      enum: ['Processing', 'Paid', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    deliveredAt: Date
  },
  { timestamps: true }
);

orderSchema.pre('validate', function setInvoice(next) {
  if (!this.invoiceNumber) this.invoiceNumber = `GS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  next();
});

export default mongoose.model('Order', orderSchema);

import mongoose from 'mongoose';
import slugify from 'slugify';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: String,
    alt: String
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    brand: String,
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: Number,
    couponEligible: { type: Boolean, default: true },
    stock: { type: Number, required: true, min: 0 },
    images: [imageSchema],
    tags: [String],
    features: [String],
    variants: [String],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    sold: { type: Number, default: 0 },
    seoTitle: String,
    seoDescription: String
  },
  { timestamps: true }
);

productSchema.pre('validate', function makeSlug(next) {
  if (!this.slug && this.name) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

productSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' });

export default mongoose.model('Product', productSchema);

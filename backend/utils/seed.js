import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';

const products = [
  {
    name: 'AeroFlex Runner Pro',
    brand: 'Go Shop',
    category: 'Footwear',
    price: 7499,
    compareAtPrice: 9999,
    stock: 42,
    isFeatured: true,
    isTrending: true,
    tags: ['running', 'shoe', 'sport'],
    description: 'Responsive daily running shoes with cloud-soft cushioning and breathable knit support.',
    features: ['Energy return foam', 'Featherweight knit upper', 'Road-ready traction'],
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80', alt: 'Red running shoe' }]
  },
  {
    name: 'StudioPods Max',
    brand: 'Soundline',
    category: 'Electronics',
    price: 12999,
    compareAtPrice: 15999,
    stock: 26,
    isFeatured: true,
    isTrending: true,
    tags: ['audio', 'headphones'],
    description: 'Wireless over-ear headphones with deep noise cancellation and a polished studio profile.',
    features: ['40-hour battery', 'ANC', 'Spatial audio'],
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80', alt: 'Premium headphones' }]
  },
  {
    name: 'Minimal Weekender Jacket',
    brand: 'Northform',
    category: 'Fashion',
    price: 4599,
    compareAtPrice: 5999,
    stock: 55,
    isFeatured: false,
    isTrending: true,
    tags: ['jacket', 'fashion'],
    description: 'A clean, water-resistant jacket tailored for city commutes and weekend escapes.',
    features: ['Water resistant', 'Hidden pockets', 'Soft lining'],
    images: [{ url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1200&q=80', alt: 'Modern jacket' }]
  },
  {
    name: 'Arc Home Speaker',
    brand: 'Casa',
    category: 'Home',
    price: 8999,
    stock: 18,
    isFeatured: true,
    tags: ['speaker', 'home'],
    description: 'A compact wireless speaker with room-filling sound and understated furniture-grade design.',
    features: ['Wi-Fi streaming', 'Voice assistant ready', 'Rich bass'],
    images: [{ url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80', alt: 'Home speaker' }]
  },
  {
    name: 'Luxe Smart Watch',
    brand: 'PulseOne',
    category: 'Electronics',
    price: 10999,
    compareAtPrice: 13999,
    stock: 34,
    rating: 4.9,
    numReviews: 143,
    isFeatured: true,
    isTrending: true,
    tags: ['watch', 'fitness', 'smart'],
    description: 'A premium health and productivity watch with an edge-to-edge display and all-day battery.',
    features: ['AMOLED display', 'Sleep tracking', 'GPS workouts'],
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80', alt: 'Smart watch' }]
  },
  {
    name: 'Urban Carry Pack',
    brand: 'Nomad Works',
    category: 'Fashion',
    price: 3299,
    stock: 71,
    rating: 4.4,
    numReviews: 88,
    isFeatured: true,
    tags: ['bag', 'travel'],
    description: 'A structured everyday backpack with laptop protection, matte hardware, and smart pockets.',
    features: ['16-inch laptop sleeve', 'Water-resistant shell', 'Hidden passport pocket'],
    images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80', alt: 'Modern backpack' }]
  },
  {
    name: 'Ceramic Brew Kit',
    brand: 'Casa',
    category: 'Home',
    price: 2499,
    compareAtPrice: 3199,
    stock: 39,
    rating: 4.6,
    numReviews: 37,
    isTrending: true,
    tags: ['coffee', 'kitchen'],
    description: 'A minimal pour-over kit for bright, balanced coffee at home or the office.',
    features: ['Ceramic dripper', 'Heat-safe carafe', 'Reusable filter'],
    images: [{ url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80', alt: 'Coffee brewing kit' }]
  },
  {
    name: 'Sprint Knit Tee',
    brand: 'Go Shop Active',
    category: 'Fashion',
    price: 1499,
    stock: 120,
    rating: 4.3,
    numReviews: 76,
    isTrending: true,
    tags: ['tshirt', 'activewear'],
    description: 'A breathable performance tee with a soft cotton feel and training-ready stretch.',
    features: ['Sweat wicking', 'Four-way stretch', 'Anti-odor finish'],
    images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80', alt: 'White tee shirt' }]
  },
  {
    name: 'Velocity Training Shorts',
    brand: 'Go Shop Active',
    category: 'Fashion',
    price: 1999,
    compareAtPrice: 2499,
    stock: 83,
    rating: 4.5,
    numReviews: 49,
    isFeatured: true,
    tags: ['shorts', 'training'],
    description: 'Lightweight training shorts built for gym sessions, runs, and hot-weather weekends.',
    features: ['Secure zip pocket', 'Quick dry fabric', 'Comfort waistband'],
    images: [{ url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1200&q=80', alt: 'Training shorts' }]
  },
  {
    name: 'Airline Duffel',
    brand: 'Nomad Works',
    category: 'Fashion',
    price: 5299,
    stock: 22,
    rating: 4.7,
    numReviews: 32,
    isTrending: true,
    tags: ['duffel', 'travel'],
    description: 'A carry-on friendly duffel with premium texture, reinforced handles, and separate shoe storage.',
    features: ['Cabin friendly', 'Shoe compartment', 'Reinforced handles'],
    images: [{ url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=80', alt: 'Travel duffel bag' }]
  },
  {
    name: 'Focus Desk Lamp',
    brand: 'Casa',
    category: 'Home',
    price: 3899,
    stock: 47,
    rating: 4.4,
    numReviews: 58,
    isFeatured: true,
    tags: ['lamp', 'desk'],
    description: 'An adjustable LED desk lamp with warm-to-cool light modes and a small footprint.',
    features: ['Touch dimming', 'Adjustable arm', 'USB-C power'],
    images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80', alt: 'Desk lamp' }]
  },
  {
    name: 'Carbon Water Bottle',
    brand: 'Go Shop Active',
    category: 'Home',
    price: 1199,
    stock: 150,
    rating: 4.2,
    numReviews: 101,
    isTrending: true,
    tags: ['bottle', 'fitness'],
    description: 'A double-wall insulated bottle that keeps drinks cold through commutes and workouts.',
    features: ['24-hour cold hold', 'Leakproof cap', 'BPA-free steel'],
    images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80', alt: 'Insulated bottle' }]
  },
  {
    name: 'CloudStep Slip Ons',
    brand: 'Go Shop',
    category: 'Footwear',
    price: 3799,
    compareAtPrice: 4999,
    stock: 64,
    rating: 4.5,
    numReviews: 67,
    isFeatured: true,
    tags: ['sneakers', 'casual'],
    description: 'Easy everyday slip-ons with a cushioned sole and clean streetwear profile.',
    features: ['Memory foam footbed', 'Flexible outsole', 'Machine washable knit'],
    images: [{ url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1200&q=80', alt: 'Casual sneakers' }]
  },
  {
    name: 'Elite Training Mat',
    brand: 'Go Shop Active',
    category: 'Home',
    price: 1799,
    stock: 91,
    rating: 4.4,
    numReviews: 82,
    isTrending: true,
    tags: ['fitness', 'yoga'],
    description: 'A dense, grippy mat for workouts, mobility sessions, and daily stretching.',
    features: ['Non-slip texture', '6 mm support', 'Carry strap included'],
    images: [{ url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=1200&q=80', alt: 'Training mat' }]
  },
  {
    name: 'Nova Tablet Sleeve',
    brand: 'Nomad Works',
    category: 'Electronics',
    price: 2199,
    stock: 58,
    rating: 4.2,
    numReviews: 29,
    isFeatured: true,
    tags: ['tablet', 'accessory'],
    description: 'A padded tablet sleeve with soft lining, magnetic closure, and slim document pocket.',
    features: ['Soft microfiber lining', 'Magnetic flap', 'Slim storage pocket'],
    images: [{ url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', alt: 'Tablet workspace' }]
  },
  {
    name: 'Linen Overshirt',
    brand: 'Northform',
    category: 'Fashion',
    price: 2899,
    compareAtPrice: 3599,
    stock: 44,
    rating: 4.6,
    numReviews: 73,
    isTrending: true,
    tags: ['shirt', 'linen'],
    description: 'A breathable overshirt with relaxed structure for smart casual layering.',
    features: ['Linen blend', 'Relaxed fit', 'Utility chest pockets'],
    images: [{ url: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=1200&q=80', alt: 'Linen shirt' }]
  },
  {
    name: 'Orbit Wireless Charger',
    brand: 'PulseOne',
    category: 'Electronics',
    price: 2699,
    stock: 52,
    rating: 4.3,
    numReviews: 46,
    isFeatured: true,
    isTrending: true,
    tags: ['charger', 'wireless'],
    description: 'A sculpted wireless charging stand for phones, earbuds, and nightstand setups.',
    features: ['15W fast charge', 'Portrait or landscape', 'Heat control'],
    images: [{ url: 'https://images.unsplash.com/photo-1603539444875-76e7684265f6?auto=format&fit=crop&w=1200&q=80', alt: 'Wireless charger' }]
  },
  {
    name: 'Slate Serving Board',
    brand: 'Casa',
    category: 'Home',
    price: 1599,
    stock: 76,
    rating: 4.5,
    numReviews: 41,
    tags: ['kitchen', 'serveware'],
    description: 'A dark stone serving board that makes weekday snacks and dinner spreads look composed.',
    features: ['Natural slate', 'Anti-slip feet', 'Food-safe finish'],
    images: [{ url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', alt: 'Serving board' }]
  },
  {
    name: 'Trail Grip Sandals',
    brand: 'Go Shop',
    category: 'Footwear',
    price: 2999,
    stock: 37,
    rating: 4.1,
    numReviews: 54,
    isTrending: true,
    tags: ['sandals', 'outdoor'],
    description: 'Outdoor-ready sandals with secure straps and textured traction for warm-weather movement.',
    features: ['Adjustable straps', 'Cushioned footbed', 'Trail traction'],
    images: [{ url: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=1200&q=80', alt: 'Outdoor sandals' }]
  },
  {
    name: 'Core Hoodie',
    brand: 'Northform',
    category: 'Fashion',
    price: 3499,
    stock: 68,
    rating: 4.8,
    numReviews: 117,
    isFeatured: true,
    isTrending: true,
    tags: ['hoodie', 'streetwear'],
    description: 'A heavyweight fleece hoodie with a structured hood and soft brushed interior.',
    features: ['Heavyweight fleece', 'Kangaroo pocket', 'Ribbed cuffs'],
    images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80', alt: 'Core hoodie' }]
  }
];

const seed = async () => {
  await connectDB();
  await Product.deleteMany();
  await Coupon.deleteMany();
  await User.deleteMany({ email: /@goshop.dev$/ });
  await Product.insertMany(products);
  await Coupon.create({ code: 'GOGREEN', discountType: 'percentage', value: 12, minOrderValue: 999 });
  await User.create({ name: 'Admin', email: 'admin@goshop.dev', password: 'admin123', role: 'admin' });
  console.log('Seed complete. Admin: admin@goshop.dev / admin123');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

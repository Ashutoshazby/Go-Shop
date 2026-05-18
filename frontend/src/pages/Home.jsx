import { motion } from 'framer-motion';
import { ArrowRight, BadgePercent, PackageCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProductCard } from '../components/ProductCard.jsx';
import { SectionHeader } from '../components/SectionHeader.jsx';
import { ProductSkeleton } from '../components/Loader.jsx';
import { fetchProducts } from '../redux/slices/productSlice.js';
import { addLocalCart } from '../redux/slices/cartSlice.js';
import { useRequireAuthAction } from '../hooks/useRequireAuthAction.js';

const categories = ['Footwear', 'Electronics', 'Fashion', 'Home'];
const heroImage = 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&w=1600&q=80';
const testimonials = [
  ['Aarav Mehta', 'The checkout felt instant, and the product page looks like a premium brand experience.'],
  ['Nisha Rao', 'I found what I wanted in seconds. The mobile layout is genuinely polished.'],
  ['Kabir Singh', 'Clean admin controls, sharp product cards, and enough detail to trust the purchase.']
];

export const Home = () => {
  const dispatch = useDispatch();
  const requireAuthAction = useRequireAuthAction();
  const { items, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 16 }));
  }, [dispatch]);

  const addCart = (product) =>
    requireAuthAction(
      () => dispatch(addLocalCart({ product, qty: 1 })),
      'Login or create an account before adding products to your cart.'
    );

  return (
    <>
      <section className="relative overflow-hidden bg-primary text-white">
        <img src={heroImage} alt="Premium shopping collection" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        <div className="container-padded relative grid min-h-[620px] items-center py-20 md:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-bold backdrop-blur"><Sparkles size={16} /> New season drop is live</p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">Go Shop</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">A premium marketplace for style, tech, and everyday essentials, tuned for fast browsing and confident checkout.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">Shop collection <ArrowRight size={18} /></Link>
              <Link to="/register" className="btn-secondary border-white/30 bg-white/10 text-white hover:border-white">Create account</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container-padded grid gap-4 py-8 md:grid-cols-4">
        {[[Truck, 'Express delivery'], [ShieldCheck, 'Secure payments'], [BadgePercent, 'Smart coupons'], [PackageCheck, 'Easy tracking']].map(([Icon, label]) => (
          <div className="surface rounded-lg p-5" key={label}><Icon className="mb-3 text-accent" /><p className="font-black">{label}</p></div>
        ))}
      </section>

      <section className="container-padded py-10">
        <SectionHeader eyebrow="Curated" title="Featured Products" copy="Sharp essentials with rich imagery, ratings, wishlist actions, and quick cart controls." />
        {loading ? <ProductSkeleton /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{items.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} onCart={addCart} />)}</div>}
      </section>

      <section className="bg-white py-14 dark:bg-slate-900">
        <div className="container-padded">
          <SectionHeader eyebrow="Departments" title="Shop by Category" />
          <div className="grid gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <Link to={`/shop?category=${category}`} key={category} className="group rounded-lg bg-primary p-6 text-white transition hover:-translate-y-1 hover:bg-accent hover:text-primary">
                <p className="text-2xl font-black">{category}</p>
                <p className="mt-10 text-sm font-bold">Explore now</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-padded py-14">
        <div className="overflow-hidden rounded-lg bg-primary text-white">
          <div className="grid items-center gap-8 p-8 md:grid-cols-[1fr_360px] md:p-12">
            <div>
              <p className="text-sm font-black uppercase text-accent">Flash Sale</p>
              <h2 className="mt-2 text-4xl font-black">Up to 40% off performance gear</h2>
              <p className="mt-3 text-slate-300">Use coupon GOGREEN at checkout for selected products.</p>
            </div>
            <Link to="/shop?sort=priceAsc" className="btn-primary justify-self-start md:justify-self-end">View deals</Link>
          </div>
        </div>
      </section>

      <section className="container-padded py-10">
        <SectionHeader eyebrow="Trending" title="Popular Right Now" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{items.slice(8, 16).map((p) => <ProductCard key={p._id} product={p} onCart={addCart} />)}</div>
      </section>

      <section className="container-padded grid gap-5 py-14 md:grid-cols-3">
        {testimonials.map(([name, quote]) => (
          <div key={name} className="surface rounded-lg p-6">
            <p className="text-lg font-bold leading-7">"{quote}"</p>
            <p className="mt-5 text-sm font-black text-accent">{name}</p>
          </div>
        ))}
      </section>

      <section className="container-padded pb-16">
        <div className="surface rounded-lg p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_420px] md:items-center">
            <div>
              <h2 className="text-3xl font-black">Get first access to drops and deals.</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Portfolio-ready newsletter UI with production-friendly structure.</p>
            </div>
            <form className="flex gap-2">
              <input className="input" type="email" placeholder="you@example.com" />
              <button className="btn-primary">Join</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

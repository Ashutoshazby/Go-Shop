import { CreditCard, Headphones, Heart, Instagram, Mail, MapPin, Menu, Moon, RotateCcw, Search, ShieldCheck, ShoppingBag, Sun, Truck, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { syncTheme, toggleDarkMode } from '../redux/slices/uiSlice.js';

const nav = [
  ['Home', '/'],
  ['Shop', '/shop'],
  ['Categories', '/shop?category=Footwear'],
  ['Admin', '/admin']
];

export const MainLayout = () => {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.qty, 0));
  const darkMode = useSelector((state) => state.ui.darkMode);

  useEffect(() => {
    dispatch(syncTheme());
  }, [dispatch]);

  const submit = (event) => {
    event.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(term)}`);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="container-padded flex h-16 items-center gap-4">
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
          <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight">
            <img src="/go-shop-cart.svg" alt="Go Shop" className="h-9 w-9 rounded-md" />
            <span>Go <span className="text-accent">Shop</span></span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map(([label, path]) => label !== 'Admin' || user?.role === 'admin' ? (
              <NavLink key={label} to={path} className={({ isActive }) => `text-sm font-bold ${isActive ? 'text-accent' : 'text-slate-600 dark:text-slate-300'}`}>{label}</NavLink>
            ) : null)}
          </nav>
          <form onSubmit={submit} className="ml-auto hidden min-w-72 max-w-md flex-1 lg:block">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input className="input py-2 pl-12 placeholder:text-slate-400" placeholder="Search sneakers, audio, jackets..." value={term} onChange={(event) => setTerm(event.target.value)} />
            </label>
          </form>
          <button onClick={() => dispatch(toggleDarkMode())} className="rounded-md border border-slate-200 p-2 dark:border-slate-800" aria-label="Toggle dark mode">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/profile" className="rounded-md border border-slate-200 p-2 dark:border-slate-800" aria-label="Profile"><User size={18} /></Link>
          <Link to="/profile" className="rounded-md border border-slate-200 p-2 dark:border-slate-800" aria-label="Wishlist"><Heart size={18} /></Link>
          <Link to="/cart" className="relative rounded-md bg-primary p-2 text-white" aria-label="Cart">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-accent text-xs font-black text-primary">{cartCount}</span>}
          </Link>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 bg-primary/40 md:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-72 bg-white p-5 dark:bg-slate-950" onClick={(event) => event.stopPropagation()}>
            <button className="ml-auto block" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
            <nav className="mt-8 grid gap-4">
              {nav.map(([label, path]) => <Link key={label} to={path} onClick={() => setOpen(false)} className="font-bold">{label}</Link>)}
            </nav>
          </aside>
        </div>
      )}
      <main><Outlet /></main>
      <footer className="border-t border-slate-200 bg-primary text-white dark:border-slate-800">
        <div className="container-padded py-12">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1.15fr]">
            <div>
              <Link to="/" className="flex items-center gap-3 text-2xl font-black">
                <img src="/go-shop-cart.svg" alt="Go Shop" className="h-11 w-11 rounded-md ring-1 ring-white/10" />
                <span>Go <span className="text-accent">Shop</span></span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
                Curated drops, everyday essentials, secure checkout, and fast account-first shopping in one sharp storefront.
              </p>
              <div className="mt-5 flex gap-2">
                {[Instagram, Mail, Headphones].map((Icon, index) => (
                  <a key={index} href={index === 1 ? 'mailto:support@goshop.dev' : '#'} aria-label="Go Shop social link" className="grid h-10 w-10 place-items-center rounded-md border border-white/10 text-slate-200 transition hover:border-accent hover:text-accent">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase text-accent">Shop</h3>
              <nav className="mt-4 grid gap-3 text-sm text-slate-300">
                <Link to="/shop?category=Footwear" className="hover:text-white">Footwear</Link>
                <Link to="/shop?category=Electronics" className="hover:text-white">Electronics</Link>
                <Link to="/shop?category=Fashion" className="hover:text-white">Fashion</Link>
                <Link to="/shop?category=Home" className="hover:text-white">Home essentials</Link>
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase text-accent">Support</h3>
              <nav className="mt-4 grid gap-3 text-sm text-slate-300">
                <Link to="/profile" className="hover:text-white">My account</Link>
                <Link to="/cart" className="hover:text-white">Cart</Link>
                <Link to="/checkout" className="hover:text-white">Checkout</Link>
                <Link to="/forgot-password" className="hover:text-white">Reset password</Link>
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase text-accent">Stay in the loop</h3>
              <p className="mt-4 text-sm leading-6 text-slate-300">Get product drops, flash deals, and early access notes.</p>
              <form className="mt-4 flex gap-2">
                <input className="input border-white/10 bg-white/10 text-white placeholder:text-slate-400" type="email" placeholder="Email address" />
                <button className="btn-primary shrink-0">Join</button>
              </form>
              <div className="mt-5 grid gap-2 text-sm text-slate-300">
                <span className="flex items-center gap-2"><MapPin size={16} className="text-accent" /> Bengaluru, India</span>
                <span className="flex items-center gap-2"><Mail size={16} className="text-accent" /> support@goshop.dev</span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-3 border-t border-white/10 pt-6 text-xs font-bold text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
            {[[Truck, 'Express shipping'], [ShieldCheck, 'Protected checkout'], [RotateCcw, 'Easy returns'], [CreditCard, 'Razorpay ready']].map(([Icon, label]) => (
              <span key={label} className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-3"><Icon size={16} className="text-accent" /> {label}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

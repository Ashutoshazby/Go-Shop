import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard.jsx';
import { ProductSkeleton } from '../components/Loader.jsx';
import { fetchProducts } from '../redux/slices/productSlice.js';
import { addLocalCart } from '../redux/slices/cartSlice.js';
import { toggleWishlist } from '../redux/slices/wishlistSlice.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useRequireAuthAction } from '../hooks/useRequireAuthAction.js';

export const Shop = () => {
  const dispatch = useDispatch();
  const requireAuthAction = useRequireAuthAction();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const debounced = useDebounce(search);
  const { items, loading, page, pages, total } = useSelector((state) => state.products);
  const query = useMemo(() => Object.fromEntries(params.entries()), [params]);

  useEffect(() => {
    const next = { ...query, search: debounced || undefined };
    dispatch(fetchProducts(next));
  }, [dispatch, query.category, query.sort, query.page, debounced]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };

  return (
    <div className="container-padded py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-accent">Catalog</p>
          <h1 className="mt-2 text-4xl font-black">Shop products</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{total} products found</p>
        </div>
        <label className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className="input pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Live search..." />
        </label>
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="surface h-max rounded-lg p-5">
          <div className="mb-5 flex items-center gap-2 font-black"><SlidersHorizontal size={18} /> Filters</div>
          <label className="text-sm font-bold">Category</label>
          <select className="input mt-2" value={params.get('category') || ''} onChange={(event) => update('category', event.target.value)}>
            <option value="">All</option>
            <option>Footwear</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home</option>
          </select>
          <label className="mt-5 block text-sm font-bold">Sort by</label>
          <select className="input mt-2" value={params.get('sort') || 'newest'} onChange={(event) => update('sort', event.target.value)}>
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="rating">Top rated</option>
            <option value="priceAsc">Price low to high</option>
            <option value="priceDesc">Price high to low</option>
          </select>
        </aside>
        <div>
          {loading ? <ProductSkeleton /> : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{items.map((p) => <ProductCard key={p._id} product={p} onCart={(product) => requireAuthAction(() => dispatch(addLocalCart({ product, qty: 1 })), 'Login or create an account before adding products to your cart.')} onWishlist={(product) => requireAuthAction(() => dispatch(toggleWishlist(product._id)), 'Login or create an account to save wishlist items.')} />)}</div>}
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pages || 1 }).map((_, index) => (
              <button key={index} onClick={() => update('page', String(index + 1))} className={`h-10 w-10 rounded-md font-bold ${page === index + 1 ? 'bg-primary text-white' : 'surface'}`}>{index + 1}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

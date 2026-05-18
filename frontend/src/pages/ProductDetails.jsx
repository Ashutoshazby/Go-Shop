import { Heart, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard.jsx';
import { fetchProduct } from '../redux/slices/productSlice.js';
import { addLocalCart } from '../redux/slices/cartSlice.js';
import { toggleWishlist } from '../redux/slices/wishlistSlice.js';
import { useRequireAuthAction } from '../hooks/useRequireAuthAction.js';

const fallbackImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80';

export const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const requireAuthAction = useRequireAuthAction();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const { detail, reviews, related } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  if (!detail) return <div className="container-padded py-16"><div className="skeleton h-96" /></div>;

  const image = detail.images?.[active]?.url || detail.images?.[0]?.url || fallbackImage;

  return (
    <div className="container-padded py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
            <img
              className="aspect-square w-full object-cover"
              src={image}
              alt={detail.name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallbackImage;
              }}
            />
          </div>
          <div className="mt-3 flex gap-3">
            {detail.images?.map((item, index) => (
              <button key={item.url} onClick={() => setActive(index)} className={`h-20 w-20 overflow-hidden rounded-md border-2 ${active === index ? 'border-accent' : 'border-transparent'}`}>
                <img
                  className="h-full w-full object-cover"
                  src={item.url}
                  alt={item.alt || detail.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = fallbackImage;
                  }}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-black uppercase text-accent">{detail.brand || detail.category}</p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">{detail.name}</h1>
          <div className="mt-4 flex items-center gap-2 text-amber-500"><Star fill="currentColor" size={20} /> {Number(detail.rating || 0).toFixed(1)} <span className="text-slate-500">({detail.numReviews || 0} reviews)</span></div>
          <p className="mt-6 text-3xl font-black">Rs. {detail.price.toLocaleString('en-IN')}</p>
          <p className="mt-5 leading-8 text-slate-600 dark:text-slate-300">{detail.description}</p>
          <ul className="mt-5 grid gap-2 text-sm">
            {detail.features?.map((feature) => <li key={feature} className="rounded-md bg-white p-3 font-bold dark:bg-slate-900">{feature}</li>)}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border border-slate-300 dark:border-slate-700">
              <button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button>
              <span className="w-10 text-center font-black">{qty}</span>
              <button className="p-3" onClick={() => setQty(qty + 1)}><Plus size={16} /></button>
            </div>
            <button className="btn-primary" onClick={() => requireAuthAction(() => dispatch(addLocalCart({ product: detail, qty })), 'Login or create an account before adding products to your cart.')}><ShoppingBag size={18} /> Add to cart</button>
            <button className="btn-secondary" onClick={() => requireAuthAction(() => dispatch(toggleWishlist(detail._id)), 'Login or create an account to save wishlist items.')}><Heart size={18} /> Wishlist</button>
          </div>
        </div>
      </div>
      <section className="mt-14">
        <h2 className="text-2xl font-black">Reviews</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {(reviews?.length ? reviews : [{ _id: 'empty', user: { name: 'Go Shop' }, comment: 'No reviews yet. Be the first to share your experience.', rating: 5 }]).map((review) => (
            <div className="surface rounded-lg p-5" key={review._id}>
              <p className="font-black">{review.user?.name}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-14">
        <h2 className="mb-5 text-2xl font-black">Related products</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related?.map((p) => <ProductCard key={p._id} product={p} />)}</div>
      </section>
    </div>
  );
};

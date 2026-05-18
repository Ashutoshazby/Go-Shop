import { Heart, Package, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProductCard } from '../components/ProductCard.jsx';
import { updateProfile } from '../redux/slices/authSlice.js';
import { fetchWishlist } from '../redux/slices/wishlistSlice.js';
import { api } from '../services/api.js';

export const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist.items);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  useEffect(() => {
    dispatch(fetchWishlist());
    api.get('/orders/mine').then((res) => setOrders(res.data)).catch(() => setOrders([]));
  }, [dispatch]);

  return (
    <div className="container-padded py-10">
      <h1 className="text-4xl font-black">My profile</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <section className="surface h-max rounded-lg p-6">
          <UserRound className="text-accent" />
          <h2 className="mt-4 text-xl font-black">Edit profile</h2>
          <div className="mt-5 grid gap-3">
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" value={form.phone} placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <button className="btn-primary" onClick={() => dispatch(updateProfile(form))}>Save changes</button>
          </div>
        </section>
        <div className="grid gap-6">
          <section className="surface rounded-lg p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black"><Package /> Order history</h2>
            <div className="grid gap-3">
              {orders.length === 0 && <p className="text-slate-500">No orders yet.</p>}
              {orders.map((order) => <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-800" key={order._id}><b>{order.invoiceNumber}</b><span className="ml-3">{order.status}</span><span className="float-right">Rs. {order.totalPrice}</span></div>)}
            </div>
          </section>
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black"><Heart /> Wishlist</h2>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{wishlist.map((p) => <ProductCard key={p._id} product={p} />)}</div>
          </section>
        </div>
      </div>
    </div>
  );
};

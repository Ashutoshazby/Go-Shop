import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatsCard } from '../components/StatsCard.jsx';
import { deleteProduct, fetchProducts, saveProduct } from '../redux/slices/productSlice.js';
import { api } from '../services/api.js';

export const AdminOverview = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0, revenue: 0 });
  useEffect(() => {
    api.get('/users/stats').then((res) => setStats(res.data)).catch(() => {});
  }, []);
  return (
    <section>
      <h1 className="text-3xl font-black">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard icon={DollarSign} label="Revenue" value={`Rs. ${stats.revenue.toLocaleString('en-IN')}`} />
        <StatsCard icon={ShoppingCart} label="Orders" value={stats.orders} tone="bg-blue-100 text-blue-700" />
        <StatsCard icon={Package} label="Products" value={stats.products} tone="bg-amber-100 text-amber-700" />
        <StatsCard icon={Users} label="Users" value={stats.users} tone="bg-violet-100 text-violet-700" />
      </div>
      <div className="surface mt-6 rounded-lg p-6">
        <h2 className="text-xl font-black">Analytics snapshot</h2>
        <div className="mt-6 h-64 rounded-md bg-gradient-to-r from-slate-100 via-green-100 to-slate-200 dark:from-slate-800 dark:via-green-950 dark:to-slate-800" />
      </div>
    </section>
  );
};

export const AdminProducts = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);
  const [form, setForm] = useState({ name: '', description: '', category: 'Footwear', price: 0, stock: 0, images: [{ url: '' }] });

  useEffect(() => {
    dispatch(fetchProducts({ limit: 50 }));
  }, [dispatch]);

  const submit = (event) => {
    event.preventDefault();
    dispatch(saveProduct({ ...form, price: Number(form.price), stock: Number(form.stock), images: [{ url: form.images[0].url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80' }] }));
    setForm({ name: '', description: '', category: 'Footwear', price: 0, stock: 0, images: [{ url: '' }] });
  };

  return (
    <section>
      <h1 className="text-3xl font-black">Products</h1>
      <form onSubmit={submit} className="surface mt-6 grid gap-4 rounded-lg p-5 md:grid-cols-2">
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="input" placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="input" placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <input className="input md:col-span-2" placeholder="Image URL" value={form.images[0].url} onChange={(e) => setForm({ ...form, images: [{ url: e.target.value }] })} />
        <textarea className="input md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn-primary md:col-span-2">Save product</button>
      </form>
      <div className="surface mt-6 overflow-hidden rounded-lg">
        {items.map((product) => (
          <div key={product._id} className="grid gap-3 border-b border-slate-200 p-4 last:border-0 md:grid-cols-[1fr_auto] md:items-center dark:border-slate-800">
            <div><p className="font-black">{product.name}</p><p className="text-sm text-slate-500">Rs. {product.price} | {product.stock} in stock</p></div>
            <button className="btn-secondary py-2" onClick={() => dispatch(deleteProduct(product._id))}>Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data)).catch(() => {});
  }, []);
  return <AdminTable title="Orders" rows={orders.map((order) => [order.invoiceNumber, order.user?.email, order.status, `Rs. ${order.totalPrice}`])} />;
};

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    api.get('/users').then((res) => setUsers(res.data)).catch(() => {});
  }, []);
  return <AdminTable title="Users" rows={users.map((user) => [user.name, user.email, user.role, new Date(user.createdAt).toLocaleDateString()])} />;
};

const AdminTable = ({ title, rows }) => (
  <section>
    <h1 className="text-3xl font-black">{title}</h1>
    <div className="surface mt-6 overflow-x-auto rounded-lg">
      <table className="w-full text-left text-sm">
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-slate-200 last:border-0 dark:border-slate-800">
              {row.map((cell) => <td className="p-4" key={cell}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeLocalCart } from '../redux/slices/cartSlice.js';
import { cartTotals } from '../utils/pricing.js';

export const Cart = () => {
  const dispatch = useDispatch();
  const { items, coupon } = useSelector((state) => state.cart);
  const totals = cartTotals(items, coupon);

  return (
    <div className="container-padded py-10">
      <h1 className="text-4xl font-black">Shopping cart</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {items.length === 0 && <div className="surface rounded-lg p-8">Your cart is empty. <Link className="font-bold text-accent" to="/shop">Start shopping</Link></div>}
          {items.map((item) => (
            <div key={item.product._id} className="surface grid gap-4 rounded-lg p-4 sm:grid-cols-[96px_1fr_auto] sm:items-center">
              <img className="h-24 w-24 rounded-md object-cover" src={item.product.images?.[0]?.url} alt={item.product.name} />
              <div>
                <h2 className="font-black">{item.product.name}</h2>
                <p className="mt-1 text-sm text-slate-500">Qty: {item.qty}</p>
                <p className="mt-2 font-bold">Rs. {(item.product.price * item.qty).toLocaleString('en-IN')}</p>
              </div>
              <button className="rounded-md border border-slate-200 p-3 dark:border-slate-700" onClick={() => dispatch(removeLocalCart(item.product._id))}><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
        <Summary totals={totals} cta="/checkout" label="Checkout" />
      </div>
    </div>
  );
};

export const Summary = ({ totals, cta, label = 'Continue' }) => (
  <aside className="surface h-max rounded-lg p-5">
    <h2 className="text-xl font-black">Price summary</h2>
    {[['Subtotal', totals.subtotal], ['Discount', -totals.discount], ['Tax', totals.tax], ['Shipping', totals.shipping]].map(([label, value]) => (
      <div className="mt-4 flex justify-between text-sm" key={label}><span>{label}</span><span>Rs. {value.toLocaleString('en-IN')}</span></div>
    ))}
    <div className="mt-5 flex justify-between border-t border-slate-200 pt-5 text-lg font-black dark:border-slate-800"><span>Total</span><span>Rs. {totals.total.toLocaleString('en-IN')}</span></div>
    {cta && <Link to={cta} className="btn-primary mt-6 w-full">{label}</Link>}
  </aside>
);

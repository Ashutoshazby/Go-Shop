import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Summary } from './Cart.jsx';
import { cartTotals } from '../utils/pricing.js';
import { api } from '../services/api.js';

export const Checkout = () => {
  const { items, coupon } = useSelector((state) => state.cart);
  const totals = cartTotals(items, coupon);
  const [address, setAddress] = useState({ fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'India' });
  const [message, setMessage] = useState('');

  const pay = async () => {
    const payload = { shippingAddress: address, couponCode: coupon?.code, items: items.map((item) => ({ product: item.product._id, qty: item.qty })) };
    const { order, razorpayOrder } = (await api.post('/orders', payload)).data;
    if (!window.Razorpay) {
      setMessage(`Order ${order.invoiceNumber} created. Add Razorpay checkout script in production shell to complete payment.`);
      return;
    }
    const checkout = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: 'INR',
      name: 'Go Shop',
      order_id: razorpayOrder.id,
      handler: async (response) => {
        await api.post('/orders/verify', { orderId: order._id, ...response });
        setMessage('Payment verified. Your order is confirmed.');
      }
    });
    checkout.open();
  };

  return (
    <div className="container-padded py-10">
      <h1 className="text-4xl font-black">Checkout</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="surface rounded-lg p-6">
          <h2 className="text-xl font-black">Shipping address</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {Object.keys(address).map((key) => (
              <input key={key} className="input" placeholder={key.replace(/([A-Z])/g, ' $1')} value={address[key]} onChange={(e) => setAddress({ ...address, [key]: e.target.value })} />
            ))}
          </div>
          <button className="btn-primary mt-6" onClick={pay}>Pay with Razorpay</button>
          {message && <p className="mt-4 rounded-md bg-green-100 p-3 text-sm font-bold text-green-700">{message}</p>}
        </section>
        <Summary totals={totals} />
      </div>
    </div>
  );
};

export const cartTotals = (items, coupon) => {
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || item.price || 0) * item.qty, 0);
  const discount = coupon ? Math.min(subtotal, coupon.discountType === 'fixed' ? coupon.value : subtotal * (coupon.value / 100)) : 0;
  const taxable = subtotal - discount;
  const tax = Number((taxable * 0.18).toFixed(2));
  const shipping = taxable > 2999 || taxable === 0 ? 0 : 99;
  const total = Number((taxable + tax + shipping).toFixed(2));
  return { subtotal, discount, tax, shipping, total };
};

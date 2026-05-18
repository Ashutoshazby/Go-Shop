export const buildInvoiceText = (order) => {
  const lines = [
    'GO SHOP INVOICE',
    `Invoice: ${order.invoiceNumber}`,
    `Order: ${order._id}`,
    `Customer: ${order.user?.name || order.shippingAddress?.fullName}`,
    '',
    ...order.orderItems.map((item) => `${item.name} x ${item.qty} - Rs. ${item.price * item.qty}`),
    '',
    `Subtotal: Rs. ${order.itemsPrice}`,
    `Tax: Rs. ${order.taxPrice}`,
    `Shipping: Rs. ${order.shippingPrice}`,
    `Total: Rs. ${order.totalPrice}`
  ];

  return lines.join('\n');
};

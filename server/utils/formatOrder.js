const formatOrder = (orders) =>
  orders.map((order) => ({
    id: order._id,
    user: order.user,
    status: order.status,
    totalAmount: order.totalAmount,
    shippingAddress: order.shippingAddress,
    items: order.items.map((item) => ({
      book: item.book,
      quantity: item.quantity,
    })),
    user: {
      username: order.user.username,
      email: order.user.email,
      avatar: order.user.avatar,
    },
    date: order.createdAt,
  }));

export default formatOrder;

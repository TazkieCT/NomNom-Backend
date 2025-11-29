import Order from "../models/order.js";

export const createOrder = async (orderData) => {
  const order = await Order.create(orderData);
  return await order.populate(['customerId', 'storeId', 'items.foodId', 'couponId']);
};

export const findAllOrders = async (query) => {
  return await Order.find(query)
    .populate('customerId', 'username email')
    .populate('storeId')
    .populate('items.foodId')
    .populate('couponId')
    .sort({ createdAt: -1 });
};

export const findOrderById = async (id) => {
  return await Order.findById(id)
    .populate('customerId', 'username email')
    .populate('storeId')
    .populate('items.foodId')
    .populate('couponId');
};

export const updateOrderStatus = async (id, status) => {
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  if (order) {
    await order.populate(['customerId', 'storeId', 'items.foodId', 'couponId']);
  }
  return order;
};

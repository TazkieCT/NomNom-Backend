import Order from "../models/order.js";

export const createOrder = async (orderData) => {
  const order = await Order.create(orderData);
  return await order.populate([
    'customerId', 
    'storeId', 
    { path: 'items.foodId', populate: { path: 'categoryId' } },
    'couponId'
  ]);
};

export const findAllOrders = async (query) => {
  return await Order.find(query)
    .populate('customerId', 'username email')
    .populate('storeId')
    .populate({
      path: 'items.foodId',
      populate: { path: 'categoryId' }
    })
    .populate('couponId')
    .sort({ createdAt: -1 });
};

export const findOrderById = async (id) => {
  return await Order.findById(id)
    .populate('customerId', 'username email')
    .populate('storeId')
    .populate({
      path: 'items.foodId',
      populate: { path: 'categoryId' }
    })
    .populate('couponId');
};

export const updateOrderStatus = async (id, status) => {
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  if (order) {
    await order.populate([
      'customerId', 
      'storeId', 
      { path: 'items.foodId', populate: { path: 'categoryId' } },
      'couponId'
    ]);
  }
  return order;
};

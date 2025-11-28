import Order from "../models/order.js";
import Food from "../models/food.js";
import Coupon from "../models/coupon.js";
import Store from "../models/store.js";

export const createOrder = async (req, res) => {
  try {
    const { storeId, items, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res.status(404).json({ message: `Food ${item.foodId} not found` });
      }
      if (food.storeId.toString() !== storeId) {
        return res.status(400).json({ message: "All items must be from the same store" });
      }
      if (!food.isAvailable) {
        return res.status(400).json({ message: `${food.name} is not available` });
      }

      const subtotal = food.price * item.quantity;
      totalPrice += subtotal;

      orderItems.push({
        foodId: food._id,
        quantity: item.quantity,
        priceEach: food.price,
        subtotal
      });
    }

    let finalPrice = totalPrice;
    let couponId = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (!coupon) {
        return res.status(404).json({ message: "Invalid coupon code" });
      }

      if (new Date() > coupon.expiresAt) {
        return res.status(400).json({ message: "Coupon has expired" });
      }

      if (coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ message: "Coupon usage limit reached" });
      }

      if (totalPrice < coupon.minimumOrder) {
        return res.status(400).json({ 
          message: `Minimum order amount is ${coupon.minimumOrder}` 
        });
      }

      let discount = (totalPrice * coupon.discountPercentage) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }

      finalPrice = totalPrice - discount;
      couponId = coupon._id;

      coupon.usedCount += 1;
      await coupon.save();
    }

    const order = await Order.create({
      customerId: req.user.id,
      storeId,
      items: orderItems,
      totalPrice,
      couponId,
      finalPrice,
      status: 'pending'
    });

    await order.populate(['customerId', 'storeId', 'items.foodId', 'couponId']);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'customer') {
      query.customerId = req.user.id;
    } else if (req.user.role === 'seller') {
      const store = await Store.findOne({ userId: req.user.id });
      if (!store) {
        return res.json([]);
      }
      query.storeId = store._id;
    }

    const { status } = req.query;
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('customerId', 'username email')
      .populate('storeId')
      .populate('items.foodId')
      .populate('couponId')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'username email')
      .populate('storeId')
      .populate('items.foodId')
      .populate('couponId');
      
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.user.role === 'customer' && order.customerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.user.role === 'seller') {
      const store = await Store.findOne({ userId: req.user.id, _id: order.storeId });
      if (!store) {
        return res.status(403).json({ message: "Access denied" });
      }
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'paid', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const store = await Store.findOne({ userId: req.user.id, _id: order.storeId });
    if (!store) {
      return res.status(403).json({ message: "Access denied" });
    }

    order.status = status;
    await order.save();
    await order.populate(['customerId', 'storeId', 'items.foodId', 'couponId']);
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: "Can only cancel pending orders" });
    }

    order.status = 'cancelled';
    await order.save();

    if (order.couponId) {
      await Coupon.findByIdAndUpdate(order.couponId, { $inc: { usedCount: -1 } });
    }

    await order.populate(['customerId', 'storeId', 'items.foodId', 'couponId']);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

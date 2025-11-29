import Coupon from "../models/coupon.js";

export const createCoupon = async (couponData) => {
  return await Coupon.create(couponData);
};

export const findAllCoupons = async () => {
  return await Coupon.find().sort({ createdAt: -1 });
};

export const findActiveCoupons = async () => {
  const now = new Date();
  return await Coupon.find({
    expiresAt: { $gt: now },
    $expr: { $lt: ['$usedCount', '$usageLimit'] }
  }).sort({ createdAt: -1 });
};

export const findCouponByCode = async (code) => {
  return await Coupon.findOne({ code: code.toUpperCase() });
};

export const findCouponById = async (id) => {
  return await Coupon.findById(id);
};

export const updateCoupon = async (id, couponData) => {
  return await Coupon.findByIdAndUpdate(
    id,
    couponData,
    { new: true, runValidators: true }
  );
};

export const deleteCoupon = async (id) => {
  return await Coupon.findByIdAndDelete(id);
};

export const incrementCouponUsage = async (id) => {
  return await Coupon.findByIdAndUpdate(
    id,
    { $inc: { usedCount: 1 } },
    { new: true }
  );
};

export const decrementCouponUsage = async (id) => {
  return await Coupon.findByIdAndUpdate(
    id,
    { $inc: { usedCount: -1 } },
    { new: true }
  );
};

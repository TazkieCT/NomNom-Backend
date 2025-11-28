import Coupon from "../models/coupon.js";

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, maxDiscountAmount, expiresAt, usageLimit, minimumOrder } = req.body;
    
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountPercentage,
      maxDiscountAmount,
      expiresAt,
      usageLimit,
      minimumOrder: minimumOrder || 0
    });

    res.status(201).json(coupon);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      expiresAt: { $gt: now },
      $expr: { $lt: ['$usedCount', '$usageLimit'] }
    }).sort({ createdAt: -1 });
    
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (new Date() > coupon.expiresAt) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    if (orderTotal < coupon.minimumOrder) {
      return res.status(400).json({ 
        message: `Minimum order amount is ${coupon.minimumOrder}` 
      });
    }

    let discount = (orderTotal * coupon.discountPercentage) / 100;
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }

    res.json({
      valid: true,
      coupon,
      discount,
      finalPrice: orderTotal - discount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, maxDiscountAmount, expiresAt, usageLimit, minimumOrder } = req.body;
    
    const updateData = {};
    if (code) updateData.code = code.toUpperCase();
    if (discountPercentage !== undefined) updateData.discountPercentage = discountPercentage;
    if (maxDiscountAmount !== undefined) updateData.maxDiscountAmount = maxDiscountAmount;
    if (expiresAt) updateData.expiresAt = expiresAt;
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit;
    if (minimumOrder !== undefined) updateData.minimumOrder = minimumOrder;

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    
    res.json(coupon);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

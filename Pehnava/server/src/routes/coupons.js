import { Router } from "express";
import { getDB } from "../db.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Get all active coupons
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const { category, productId } = req.query;

    let filter = {
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() },
    };

    if (category) {
      filter.$or = [
        { applicableCategories: { $in: [category] } },
        { applicableCategories: { $size: 0 } },
      ];
    }

    if (productId) {
      filter.$or = [
        { applicableProducts: { $in: [productId] } },
        { applicableProducts: { $size: 0 } },
      ];
    }

    const coupons = await db
      .collection("coupons")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ coupons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate coupon
router.post("/validate", async (req, res) => {
  try {
    const db = getDB();
    const { code, userId, orderAmount, productIds = [] } = req.body;

    if (!code || !userId || !orderAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const coupon = await db.collection("coupons").findOne({
      code,
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() },
    });

    if (!coupon) {
      return res.status(400).json({ error: "Invalid or expired coupon" });
    }

    // Check usage limit
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: "Coupon usage limit exceeded" });
    }

    // Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        error: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
      });
    }

    // Check if user has already used this coupon
    const userOrder = await db.collection("orders").findOne({
      userId,
      couponCode: code,
    });

    if (userOrder) {
      return res
        .status(400)
        .json({ error: "Coupon already used by this user" });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === "percentage") {
      discount = Math.min(
        (orderAmount * coupon.value) / 100,
        coupon.maxDiscount || Infinity
      );
    } else {
      discount = Math.min(coupon.value, orderAmount);
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        name: coupon.name,
        type: coupon.type,
        value: coupon.value,
        discount: Math.round(discount),
        description: coupon.description,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create coupon (admin only)
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const {
      code,
      name,
      description,
      type,
      value,
      minOrderAmount = 0,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil,
      applicableCategories = [],
      applicableProducts = [],
    } = req.body;

    if (!code || !name || !type || !value || !validFrom || !validUntil) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if coupon code already exists
    const existing = await db.collection("coupons").findOne({ code });
    if (existing) {
      return res.status(400).json({ error: "Coupon code already exists" });
    }

    const coupon = {
      code,
      name,
      description: description || "",
      type,
      value: parseFloat(value),
      minOrderAmount: parseFloat(minOrderAmount),
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
      usageLimit: parseInt(usageLimit) || 1000,
      usedCount: 0,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      isActive: true,
      applicableCategories,
      applicableProducts,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("coupons").insertOne(coupon);
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update coupon
router.patch("/:couponId", async (req, res) => {
  try {
    const db = getDB();
    const { couponId } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    const result = await db
      .collection("coupons")
      .updateOne({ _id: couponId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.json({ success: true, message: "Coupon updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete coupon
router.delete("/:couponId", async (req, res) => {
  try {
    const db = getDB();
    const { couponId } = req.params;

    const result = await db.collection("coupons").deleteOne({ _id: couponId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import { Router } from "express";
import { getDB } from "../db.js";

const router = Router();

// Add item to wishlist
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if product exists
    const product = await db.collection("products").findOne({ productId });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if already in wishlist
    const existing = await db
      .collection("wishlist")
      .findOne({ userId, productId });
    if (existing) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }

    await db.collection("wishlist").insertOne({
      userId,
      productId,
      addedAt: new Date(),
    });

    res.status(201).json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's wishlist
router.get("/user/:userId", async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;
    const wishlistItems = await db
      .collection("wishlist")
      .find({ userId })
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    // Get product details for each wishlist item
    const products = [];
    for (const item of wishlistItems) {
      const product = await db
        .collection("products")
        .findOne({ productId: item.productId }, { projection: { _id: 0 } });
      if (product) {
        products.push({
          ...product,
          addedAt: item.addedAt,
        });
      }
    }

    const total = await db.collection("wishlist").countDocuments({ userId });

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from wishlist
router.delete("/", async (req, res) => {
  try {
    const db = getDB();
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await db
      .collection("wishlist")
      .deleteOne({ userId, productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Item not found in wishlist" });
    }

    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if product is in wishlist
router.get("/check", async (req, res) => {
  try {
    const db = getDB();
    const { userId, productId } = req.query;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const item = await db.collection("wishlist").findOne({ userId, productId });
    res.json({ inWishlist: !!item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear wishlist
router.delete("/user/:userId", async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.params;

    await db.collection("wishlist").deleteMany({ userId });
    res.json({ success: true, message: "Wishlist cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

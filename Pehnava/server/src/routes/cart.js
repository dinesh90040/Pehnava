import { Router } from "express";
import { getDB } from "../db.js";

const router = Router();

// Get user's cart
router.get("/:userId", async (req, res) => {
  try {
    const db = getDB();
    const cart = await db
      .collection("carts")
      .findOne({ userId: req.params.userId });

    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user's cart
router.post("/:userId", async (req, res) => {
  try {
    const db = getDB();
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Items must be an array" });
    }

    await db.collection("carts").updateOne(
      { userId: req.params.userId },
      {
        $set: {
          userId: req.params.userId,
          items,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    const updated = await db
      .collection("carts")
      .findOne({ userId: req.params.userId });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
router.post("/:userId/add", async (req, res) => {
  try {
    const db = getDB();
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const cart = (await db
      .collection("carts")
      .findOne({ userId: req.params.userId })) || {
      userId: req.params.userId,
      items: [],
    };

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await db.collection("carts").updateOne(
      { userId: req.params.userId },
      {
        $set: {
          userId: req.params.userId,
          items: cart.items,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    const updated = await db
      .collection("carts")
      .findOne({ userId: req.params.userId });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart
router.delete("/:userId/remove", async (req, res) => {
  try {
    const db = getDB();
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const cart = await db
      .collection("carts")
      .findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);

    await db.collection("carts").updateOne(
      { userId: req.params.userId },
      {
        $set: {
          items: cart.items,
          updatedAt: new Date(),
        },
      }
    );

    const updated = await db
      .collection("carts")
      .findOne({ userId: req.params.userId });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.delete("/:userId", async (req, res) => {
  try {
    const db = getDB();
    await db.collection("carts").updateOne(
      { userId: req.params.userId },
      {
        $set: {
          items: [],
          updatedAt: new Date(),
        },
      }
    );

    res.json({ userId: req.params.userId, items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

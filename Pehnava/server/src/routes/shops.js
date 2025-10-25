import { Router } from "express";
import { getDB } from "../db.js";

const router = Router();

// Get all shops
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const { marketId } = req.query;
    const filter = marketId ? { marketId: Number(marketId) } : {};
    
    const shops = await db.collection("shops")
      .find(filter)
      .project({ _id: 0 })
      .limit(1000)
      .toArray();
    res.json(shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get shop by ID
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const shopId = parseInt(req.params.id);
    const shop = await db.collection("shops")
      .findOne({ id: shopId }, { projection: { _id: 0 } });
    
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }
    
    res.json(shop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get products in a shop
router.get("/:id/products", async (req, res) => {
  try {
    const db = getDB();
    const shopId = parseInt(req.params.id);
    const products = await db.collection("products")
      .find({ shopId })
      .project({ _id: 0 })
      .limit(200)
      .toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

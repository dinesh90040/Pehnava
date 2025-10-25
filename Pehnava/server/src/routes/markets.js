import { Router } from "express";
import { getDB } from "../db.js";

const router = Router();

// Get all markets
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const markets = await db.collection("markets")
      .find({})
      .project({ _id: 0 })
      .limit(500)
      .toArray();
    res.json(markets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get market by ID
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const marketId = parseInt(req.params.id);
    const market = await db.collection("markets")
      .findOne({ id: marketId }, { projection: { _id: 0 } });
    
    if (!market) {
      return res.status(404).json({ error: "Market not found" });
    }
    
    res.json(market);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get shops in a market
router.get("/:id/shops", async (req, res) => {
  try {
    const db = getDB();
    const marketId = parseInt(req.params.id);
    const shops = await db.collection("shops")
      .find({ marketId })
      .project({ _id: 0 })
      .limit(1000)
      .toArray();
    res.json(shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

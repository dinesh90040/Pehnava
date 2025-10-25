import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";

// Import route handlers
import authRouter from "./routes/auth.js";
import applicationsRouter from "./routes/applications.js";
import marketsRouter from "./routes/markets.js";
import shopsRouter from "./routes/shops.js";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import ordersRouter from "./routes/orders.js";
import reviewsRouter from "./routes/reviews.js";
import wishlistRouter from "./routes/wishlist.js";
import addressesRouter from "./routes/addresses.js";
import notificationsRouter from "./routes/notifications.js";
import couponsRouter from "./routes/coupons.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/markets", marketsRouter);
app.use("/api/shops", shopsRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/addresses", addressesRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/coupons", couponsRouter);

// Bootstrap DB with markets/shops if empty
async function bootstrapIfNeeded() {
  try {
    const db = await connectDB();
    const marketsCol = db.collection("markets");
    const shopsCol = db.collection("shops");

    const count = await marketsCol.countDocuments();
    if (count === 0) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const marketsPath = path.resolve(
        __dirname,
        "../../src/data/markets.json"
      );

      if (fs.existsSync(marketsPath)) {
        const raw = fs.readFileSync(marketsPath, "utf8");
        const markets = JSON.parse(raw);
        const shopDocs = [];

        for (const m of markets) {
          const { shops = [], ...marketRest } = m;
          await marketsCol.updateOne(
            { id: marketRest.id },
            { $set: marketRest },
            { upsert: true }
          );
          for (const s of shops) {
            shopDocs.push({ ...s, marketId: marketRest.id });
          }
        }

        for (const s of shopDocs) {
          await shopsCol.updateOne({ id: s.id }, { $set: s }, { upsert: true });
        }

        console.log(
          `[bootstrap] Inserted ${markets.length} markets and ${shopDocs.length} shops`
        );
      } else {
        console.warn("[bootstrap] markets.json not found; skipping bootstrap");
      }
    } else {
      console.log(
        `[bootstrap] Database already has ${count} markets; skipping bootstrap`
      );
    }
  } catch (error) {
    console.error("[bootstrap] Error during bootstrap:", error);
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Start server
(async () => {
  try {
    console.log("🚀 Starting Pehenava API Server...");

    // Connect to database
    await connectDB();
    console.log("✅ Database connected successfully");

    // Bootstrap data if needed
    await bootstrapIfNeeded();

    // Start listening
    app.listen(PORT, () => {
      console.log(`🌐 API server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📚 Available routes:`);
      console.log(`   - GET  /api/health`);
      console.log(`   - POST /api/auth/request-otp`);
      console.log(`   - POST /api/auth/verify-otp`);
      console.log(`   - POST /api/applications`);
      console.log(`   - GET  /api/markets`);
      console.log(`   - GET  /api/shops`);
      console.log(`   - GET  /api/products`);
      console.log(`   - GET  /api/cart/:userId`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();

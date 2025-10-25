import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import route handlers
import authRouter from "./routes/auth.js";
import applicationsRouter from "./routes/applications.js";
import marketsRouter from "./routes/markets.js";
import shopsRouter from "./routes/shops.js";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";

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
    message: "Server is running without database connection (test mode)",
  });
});

// Test endpoints that don't require database
app.get("/api/test", (req, res) => {
  res.json({
    message: "Test endpoint working!",
    routes: [
      "GET /api/health",
      "GET /api/test",
      "GET /api/test/markets",
      "GET /api/test/shops",
      "GET /api/test/products",
    ],
  });
});

app.get("/api/test/markets", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Test Market 1",
      location: "Test Location 1",
      description: "This is a test market",
    },
    {
      id: 2,
      name: "Test Market 2",
      location: "Test Location 2",
      description: "This is another test market",
    },
  ]);
});

app.get("/api/test/shops", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Test Shop 1",
      marketId: 1,
      description: "This is a test shop",
    },
    {
      id: 2,
      name: "Test Shop 2",
      marketId: 1,
      description: "This is another test shop",
    },
  ]);
});

app.get("/api/test/products", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Test Product 1",
      price: 100,
      description: "This is a test product",
    },
    {
      id: 2,
      name: "Test Product 2",
      price: 200,
      description: "This is another test product",
    },
  ]);
});

// API Routes (these will fail without database, but structure is correct)
app.use("/api/auth", authRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/markets", marketsRouter);
app.use("/api/shops", shopsRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);

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
app.listen(PORT, () => {
  console.log(`🌐 Test API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoints: http://localhost:${PORT}/api/test`);
  console.log(`📚 Available routes:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/test`);
  console.log(`   - GET  /api/test/markets`);
  console.log(`   - GET  /api/test/shops`);
  console.log(`   - GET  /api/test/products`);
  console.log(`   - POST /api/auth/request-otp`);
  console.log(`   - POST /api/auth/verify-otp`);
  console.log(`   - POST /api/applications`);
  console.log(`   - GET  /api/markets`);
  console.log(`   - GET  /api/shops`);
  console.log(`   - GET  /api/products`);
  console.log(`   - GET  /api/cart/:userId`);
  console.log(
    `\n⚠️  Note: Database routes will fail without MongoDB connection`
  );
});

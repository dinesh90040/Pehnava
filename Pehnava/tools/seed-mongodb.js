/* eslint-disable */
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

dotenv.config({ path: path.resolve("server/.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pehenava";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || process.env.DB_NAME || "pehenava";

async function main() {
  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);

    // Collections
    const collections = {
      markets: db.collection("markets"),
      shops: db.collection("shops"),
      products: db.collection("products"),
      users: db.collection("users"),
      carts: db.collection("carts"),
      wishlists: db.collection("wishlists"),
      orders: db.collection("orders"),
      model_applications: db.collection("model_applications"),
      stylist_requests: db.collection("stylist_requests"),
    };

    // Indexes (idempotent)
    await Promise.all([
      collections.markets.createIndex({ id: 1 }, { unique: true }),
      collections.shops.createIndex({ id: 1 }, { unique: true }),
      collections.shops.createIndex({ marketId: 1 }),
      collections.products.createIndex({ slug: 1 }, { unique: true }),
      collections.users.createIndex({ email: 1 }, { unique: true }),
      collections.orders.createIndex({ userId: 1, createdAt: -1 }),
      collections.carts.createIndex({ userId: 1 }, { unique: true }),
      collections.wishlists.createIndex({ userId: 1 }, { unique: true }),
    ]);

    // Seed markets and shops from src/data/markets.json
    const marketsPath = path.resolve("src/data/markets.json");
    const marketsRaw = fs.readFileSync(marketsPath, "utf8");
    const markets = JSON.parse(marketsRaw);

    // Upsert markets and shops
    const shopDocs = [];
    for (const m of markets) {
      const { shops = [], ...marketRest } = m;
      await collections.markets.updateOne(
        { id: marketRest.id },
        { $set: marketRest },
        { upsert: true }
      );
      for (const s of shops) {
        shopDocs.push({ ...s, marketId: marketRest.id });
      }
    }
    if (shopDocs.length) {
      for (const s of shopDocs) {
        await collections.shops.updateOne(
          { id: s.id },
          { $set: s },
          { upsert: true }
        );
      }
    }

    // Seed a few sample products (based on UI references)
    const sampleProducts = [
      {
        name: "Royal Silk Saree",
        slug: "royal-silk-saree",
        price: 25000,
        images: ["/images/Royal Silk Saree.png"],
        category: "Women's Sarees",
        stock: 100,
        attributes: { fabric: "Silk", color: "Red/Gold" },
        rating: 4.7,
        createdAt: new Date(),
      },
      {
        name: "Embroidered Sherwani",
        slug: "embroidered-sherwani",
        price: 30000,
        images: ["/images/Embroidered Sherwani.png"],
        category: "Sherwanis",
        stock: 50,
        attributes: { fabric: "Brocade", color: "Ivory" },
        rating: 4.6,
        createdAt: new Date(),
      },
    ];

    for (const p of sampleProducts) {
      await collections.products.updateOne(
        { slug: p.slug },
        { $setOnInsert: p },
        { upsert: true }
      );
    }

    // Seed an example user with addresses
    const user = {
      email: "demo@pehenava.com",
      passwordHash: "demo-only-not-for-prod",
      name: "John Doe",
      phone: "+91 98765 43210",
      addresses: [
        {
          id: 1,
          name: "John Doe",
          phone: "+91 98765 43210",
          address: "123, MG Road, Near City Mall",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          isDefault: true,
        },
      ],
      createdAt: new Date(),
    };

    const userResult = await collections.users.updateOne(
      { email: user.email },
      { $setOnInsert: user },
      { upsert: true }
    );
    const ensuredUser = await collections.users.findOne({ email: user.email });

    // Ensure cart and wishlist docs exist
    await collections.carts.updateOne(
      { userId: ensuredUser._id },
      {
        $setOnInsert: {
          userId: ensuredUser._id,
          items: [
            { productSlug: "royal-silk-saree", quantity: 1, price: 25000 },
            { productSlug: "embroidered-sherwani", quantity: 1, price: 30000 },
          ],
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    await collections.wishlists.updateOne(
      { userId: ensuredUser._id },
      {
        $setOnInsert: {
          userId: ensuredUser._id,
          productSlugs: ["royal-silk-saree"],
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Seed a sample order
    await collections.orders.updateOne(
      { userId: ensuredUser._id, "items.productSlug": "royal-silk-saree" },
      {
        $setOnInsert: {
          userId: ensuredUser._id,
          items: [
            { productSlug: "royal-silk-saree", quantity: 1, price: 25000 },
            { productSlug: "embroidered-sherwani", quantity: 1, price: 30000 },
          ],
          subtotal: 55000,
          discount: 10000,
          shipping: 0,
          total: 45000,
          payment: { method: "qr", status: "paid" },
          addressId: 1,
          createdAt: new Date(),
          status: "placed",
        },
      },
      { upsert: true }
    );

    // Seed empty collections for forms
    await collections.model_applications.updateOne(
      { email: "applicant@example.com" },
      {
        $setOnInsert: {
          name: "Jane Model",
          email: "applicant@example.com",
          phone: "+91 90000 00000",
          portfolioUrl: "https://example.com/portfolio",
          status: "pending",
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    await collections.stylist_requests.updateOne(
      { email: "client@example.com" },
      {
        $setOnInsert: {
          name: "Client Name",
          email: "client@example.com",
          preferences: ["Bridal Wear", "Festive Wear"],
          notes: "Looking for consultation next week",
          createdAt: new Date(),
          status: "new",
        },
      },
      { upsert: true }
    );

    // Print summary
    const summary = {};
    for (const [key, col] of Object.entries(collections)) {
      summary[key] = await col.countDocuments();
    }

    console.log("\n=== MongoDB Seed Summary ===");
    console.table(summary);

    // Show a sample document from each key collection
    const sample = {
      market: await collections.markets.findOne({}, { projection: { _id: 0 }, sort: { id: 1 } }),
      shop: await collections.shops.findOne({}, { projection: { _id: 0 }, sort: { id: 1 } }),
      product: await collections.products.findOne({}, { projection: { _id: 0 } }),
      user: await collections.users.findOne({}, { projection: { passwordHash: 0 } }),
      order: await collections.orders.findOne({}, { projection: { } }),
    };

    console.log("\nSample documents:");
    for (const [k, v] of Object.entries(sample)) {
      console.log(`\n[${k}]`);
      console.log(JSON.stringify(v, null, 2));
    }

    console.log("\nSeed completed successfully.");
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  } finally {
    await (async () => { try { await client.close(); } catch {} })();
  }
}

main();

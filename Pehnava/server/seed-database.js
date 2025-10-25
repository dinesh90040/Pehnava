import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uri = "mongodb://127.0.0.1:27017/pehenava";

async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("pehenava");

    // Clear existing data
    await db.collection("markets").deleteMany({});
    await db.collection("shops").deleteMany({});
    await db.collection("products").deleteMany({});
    await db.collection("carts").deleteMany({});
    await db.collection("users").deleteMany({});
    await db.collection("email_otps").deleteMany({});
    await db.collection("applications").deleteMany({});

    console.log("🧹 Cleared existing data");

    // Load markets data
    const marketsPath = path.resolve(__dirname, "../src/data/markets.json");
    const marketsData = JSON.parse(fs.readFileSync(marketsPath, "utf8"));

    // Insert markets and shops
    const shopDocs = [];
    for (const market of marketsData) {
      const { shops = [], ...marketRest } = market;
      await db.collection("markets").insertOne(marketRest);

      for (const shop of shops) {
        shopDocs.push({ ...shop, marketId: market.id });
      }
    }

    if (shopDocs.length > 0) {
      await db.collection("shops").insertMany(shopDocs);
    }

    console.log(
      `📊 Inserted ${marketsData.length} markets and ${shopDocs.length} shops`
    );

    // Create sample products
    const sampleProducts = [
      {
        id: 1,
        name: "Royal Silk Saree",
        slug: "royal-silk-saree",
        price: 15000,
        originalPrice: 18000,
        category: "Sarees",
        description: "Elegant royal silk saree with intricate embroidery work",
        images: ["/images/Royal Silk Saree.png"],
        shopId: 1,
        marketId: 1,
        inStock: true,
        rating: 4.8,
        reviews: 156,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Red", "Blue", "Green", "Gold"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Bridal Lehenga Set",
        slug: "bridal-lehenga-set",
        price: 25000,
        originalPrice: 30000,
        category: "Lehengas",
        description: "Stunning bridal lehenga with matching dupatta and blouse",
        images: ["/images/Bridal Lehenga Set.png"],
        shopId: 2,
        marketId: 1,
        inStock: true,
        rating: 4.9,
        reviews: 89,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Red", "Pink", "Maroon", "Gold"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Embroidered Sherwani",
        slug: "embroidered-sherwani",
        price: 12000,
        originalPrice: 15000,
        category: "Men's Wear",
        description: "Traditional embroidered sherwani for special occasions",
        images: ["/images/Embroidered Sherwani.png"],
        shopId: 3,
        marketId: 1,
        inStock: true,
        rating: 4.7,
        reviews: 67,
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Cream", "Gold", "Silver"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Casual Kurta Pajama",
        slug: "casual-kurta-pajama",
        price: 2500,
        originalPrice: 3000,
        category: "Men's Wear",
        description: "Comfortable casual kurta pajama for daily wear",
        images: ["/images/Casual Kurta Pajama.png"],
        shopId: 4,
        marketId: 1,
        inStock: true,
        rating: 4.5,
        reviews: 123,
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Blue", "Green", "Brown"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: "Festive Anarkali Suit",
        slug: "festive-anarkali-suit",
        price: 8000,
        originalPrice: 10000,
        category: "Women's Wear",
        description: "Beautiful festive anarkali suit with intricate work",
        images: ["/images/Festive Anarkali Suit.png"],
        shopId: 5,
        marketId: 1,
        inStock: true,
        rating: 4.6,
        reviews: 98,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Pink", "Purple", "Blue", "Green"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        name: "Girls Lehenga Choli",
        slug: "girls-lehenga-choli",
        price: 3500,
        originalPrice: 4500,
        category: "Kids Wear",
        description: "Adorable lehenga choli for little girls",
        images: ["/images/Girls Lehenga Choli.png"],
        shopId: 1,
        marketId: 1,
        inStock: true,
        rating: 4.8,
        reviews: 45,
        sizes: ["2-3 Years", "3-4 Years", "4-5 Years", "5-6 Years"],
        colors: ["Pink", "Red", "Blue", "Yellow"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        name: "Boys Sherwani Set",
        slug: "boys-sherwani-set",
        price: 4000,
        originalPrice: 5000,
        category: "Kids Wear",
        description: "Traditional sherwani set for boys",
        images: ["/images/Boys Sherwani Set.png"],
        shopId: 2,
        marketId: 1,
        inStock: true,
        rating: 4.7,
        reviews: 34,
        sizes: ["2-3 Years", "3-4 Years", "4-5 Years", "5-6 Years"],
        colors: ["White", "Cream", "Gold", "Silver"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        name: "Birthday Princess Gown",
        slug: "birthday-princess-gown",
        price: 2800,
        originalPrice: 3500,
        category: "Kids Wear",
        description: "Magical princess gown for special occasions",
        images: ["/images/Birthday Princess Gown.png"],
        shopId: 3,
        marketId: 1,
        inStock: true,
        rating: 4.9,
        reviews: 78,
        sizes: ["2-3 Years", "3-4 Years", "4-5 Years", "5-6 Years"],
        colors: ["Pink", "Purple", "Blue", "White"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        name: "Indo Western Suit",
        slug: "indo-western-suit",
        price: 6000,
        originalPrice: 7500,
        category: "Women's Wear",
        description: "Stylish Indo-Western fusion suit",
        images: ["/images/Indo Western Suit.png"],
        shopId: 4,
        marketId: 1,
        inStock: true,
        rating: 4.4,
        reviews: 56,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Navy", "Maroon", "Brown"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 10,
        name: "Linen Kurta",
        slug: "linen-kurta",
        price: 1800,
        originalPrice: 2200,
        category: "Men's Wear",
        description: "Comfortable linen kurta for summer wear",
        images: ["/images/Linen Kurta.png"],
        shopId: 5,
        marketId: 1,
        inStock: true,
        rating: 4.3,
        reviews: 89,
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Beige", "Light Blue", "Light Green"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection("products").insertMany(sampleProducts);
    console.log(`🛍️ Inserted ${sampleProducts.length} sample products`);

    // Create sample cart
    const sampleCart = {
      userId: "test-user-1",
      items: [
        { productId: 1, quantity: 1 },
        { productId: 3, quantity: 2 },
        { productId: 5, quantity: 1 },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("carts").insertOne(sampleCart);
    console.log("🛒 Created sample cart");

    // Create sample user
    const sampleUser = {
      email: "test@pehenava.com",
      name: "Test User",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("users").insertOne(sampleUser);
    console.log("👤 Created sample user");

    // Show database stats
    const stats = await db.stats();
    console.log("\n📊 Database Statistics:");
    console.log(`Collections: ${Object.keys(stats.collections).length}`);
    console.log(`Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`Storage Size: ${(stats.storageSize / 1024).toFixed(2)} KB`);

    console.log("\n✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();

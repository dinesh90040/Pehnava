import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

const uri = "mongodb://127.0.0.1:27017/pehenava";

async function seedComprehensiveDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("pehenava");

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await db.collection("users").deleteMany({});
    await db.collection("products").deleteMany({});
    await db.collection("orders").deleteMany({});
    await db.collection("order_items").deleteMany({});
    await db.collection("cart").deleteMany({});
    await db.collection("wishlist").deleteMany({});
    await db.collection("reviews").deleteMany({});
    await db.collection("addresses").deleteMany({});
    await db.collection("notifications").deleteMany({});
    await db.collection("coupons").deleteMany({});
    await db.collection("categories").deleteMany({});
    await db.collection("brands").deleteMany({});

    console.log("✅ Cleared existing data");

    // Create categories
    const categories = [
      {
        categoryId: "sarees",
        name: "Sarees",
        slug: "sarees",
        description: "Traditional Indian sarees in various fabrics and designs",
        image: "/images/categories/sarees.jpg",
        level: 0,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: "lehengas",
        name: "Lehengas",
        slug: "lehengas",
        description: "Elegant lehengas for weddings and special occasions",
        image: "/images/categories/lehengas.jpg",
        level: 0,
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: "mens-wear",
        name: "Men's Wear",
        slug: "mens-wear",
        description: "Traditional and contemporary men's ethnic wear",
        image: "/images/categories/mens-wear.jpg",
        level: 0,
        isActive: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: "kids-wear",
        name: "Kids Wear",
        slug: "kids-wear",
        description: "Adorable ethnic wear for children",
        image: "/images/categories/kids-wear.jpg",
        level: 0,
        isActive: true,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: "jewelry",
        name: "Jewelry",
        slug: "jewelry",
        description: "Traditional Indian jewelry and accessories",
        image: "/images/categories/jewelry.jpg",
        level: 0,
        isActive: true,
        sortOrder: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection("categories").insertMany(categories);
    console.log(`📂 Created ${categories.length} categories`);

    // Create brands
    const brands = [
      {
        brandId: "fabindia",
        name: "Fabindia",
        slug: "fabindia",
        description: "Traditional Indian clothing with contemporary designs",
        logo: "/images/brands/fabindia.png",
        website: "https://www.fabindia.com",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        brandId: "w",
        name: "W",
        slug: "w",
        description: "Modern ethnic wear for women",
        logo: "/images/brands/w.png",
        website: "https://www.windia.com",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        brandId: "manyavar",
        name: "Manyavar",
        slug: "manyavar",
        description: "Premium ethnic wear for men",
        logo: "/images/brands/manyavar.png",
        website: "https://www.manyavar.com",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        brandId: "global-desi",
        name: "Global Desi",
        slug: "global-desi",
        description: "Fusion wear for the modern Indian",
        logo: "/images/brands/global-desi.png",
        website: "https://www.globaldesi.in",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection("brands").insertMany(brands);
    console.log(`🏷️ Created ${brands.length} brands`);

    // Create comprehensive product catalog
    const products = [
      // Sarees
      {
        productId: "saree-001",
        name: "Royal Silk Saree",
        slug: "royal-silk-saree",
        description:
          "Elegant royal silk saree with intricate zari work and traditional motifs. Perfect for weddings and special occasions.",
        shortDescription: "Royal silk saree with zari work",
        price: 15000,
        originalPrice: 18000,
        category: "Sarees",
        subcategory: "Silk Sarees",
        brand: "Fabindia",
        sku: "SILK-001",
        images: [
          "/images/Royal Silk Saree.png",
          "/images/sarees/silk-1.jpg",
          "/images/sarees/silk-2.jpg",
        ],
        thumbnail: "/images/Royal Silk Saree.png",
        colors: ["Red", "Maroon", "Gold", "Green"],
        sizes: ["Free Size"],
        materials: ["Pure Silk", "Zari Work"],
        careInstructions: "Dry clean only",
        inStock: true,
        stockQuantity: 25,
        weight: 800,
        dimensions: { length: 550, width: 110, height: 2 },
        tags: ["silk", "zari", "royal", "wedding", "traditional"],
        rating: 4.8,
        reviewCount: 156,
        viewCount: 1250,
        isFeatured: true,
        isNew: false,
        isBestSeller: true,
        isOnSale: true,
        shopId: "1",
        marketId: "1",
        sellerId: "seller-001",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },
      {
        productId: "saree-002",
        name: "Banarasi Silk Saree",
        slug: "banarasi-silk-saree",
        description:
          "Authentic Banarasi silk saree with intricate brocade work. A timeless piece for special occasions.",
        shortDescription: "Authentic Banarasi silk saree",
        price: 22000,
        originalPrice: 28000,
        category: "Sarees",
        subcategory: "Banarasi Sarees",
        brand: "W",
        sku: "BAN-001",
        images: [
          "/images/sarees/banarasi-1.jpg",
          "/images/sarees/banarasi-2.jpg",
        ],
        thumbnail: "/images/sarees/banarasi-1.jpg",
        colors: ["Gold", "Red", "Green", "Blue"],
        sizes: ["Free Size"],
        materials: ["Banarasi Silk", "Brocade"],
        careInstructions: "Dry clean only",
        inStock: true,
        stockQuantity: 15,
        weight: 900,
        tags: ["banarasi", "silk", "brocade", "wedding", "premium"],
        rating: 4.9,
        reviewCount: 89,
        viewCount: 980,
        isFeatured: true,
        isNew: false,
        isBestSeller: true,
        isOnSale: true,
        shopId: "2",
        marketId: "1",
        sellerId: "seller-002",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },
      {
        productId: "saree-003",
        name: "Cotton Saree",
        slug: "cotton-saree",
        description:
          "Comfortable cotton saree with traditional prints. Perfect for daily wear and casual occasions.",
        shortDescription: "Comfortable cotton saree",
        price: 2500,
        originalPrice: 3200,
        category: "Sarees",
        subcategory: "Cotton Sarees",
        brand: "Global Desi",
        sku: "COT-001",
        images: ["/images/sarees/cotton-1.jpg", "/images/sarees/cotton-2.jpg"],
        thumbnail: "/images/sarees/cotton-1.jpg",
        colors: ["Blue", "Green", "Red", "Yellow"],
        sizes: ["Free Size"],
        materials: ["Pure Cotton"],
        careInstructions: "Machine wash cold",
        inStock: true,
        stockQuantity: 50,
        weight: 400,
        tags: ["cotton", "daily-wear", "comfortable", "printed"],
        rating: 4.5,
        reviewCount: 234,
        viewCount: 2100,
        isFeatured: false,
        isNew: true,
        isBestSeller: false,
        isOnSale: true,
        shopId: "3",
        marketId: "1",
        sellerId: "seller-003",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },

      // Lehengas
      {
        productId: "lehenga-001",
        name: "Bridal Lehenga Set",
        slug: "bridal-lehenga-set",
        description:
          "Stunning bridal lehenga with matching dupatta and blouse. Intricate embroidery and zari work make this perfect for your special day.",
        shortDescription: "Stunning bridal lehenga set",
        price: 25000,
        originalPrice: 30000,
        category: "Lehengas",
        subcategory: "Bridal Lehengas",
        brand: "W",
        sku: "LEH-001",
        images: [
          "/images/Bridal Lehenga Set.png",
          "/images/lehengas/bridal-1.jpg",
          "/images/lehengas/bridal-2.jpg",
        ],
        thumbnail: "/images/Bridal Lehenga Set.png",
        colors: ["Red", "Pink", "Maroon", "Gold"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        materials: ["Silk", "Zari", "Sequins"],
        careInstructions: "Dry clean only",
        inStock: true,
        stockQuantity: 12,
        weight: 1200,
        tags: ["bridal", "lehenga", "wedding", "embroidery", "zari"],
        rating: 4.9,
        reviewCount: 89,
        viewCount: 1500,
        isFeatured: true,
        isNew: false,
        isBestSeller: true,
        isOnSale: true,
        shopId: "2",
        marketId: "1",
        sellerId: "seller-002",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },
      {
        productId: "lehenga-002",
        name: "Festive Lehenga Choli",
        slug: "festive-lehenga-choli",
        description:
          "Beautiful festive lehenga choli with mirror work and traditional prints. Perfect for festivals and celebrations.",
        shortDescription: "Festive lehenga choli",
        price: 8500,
        originalPrice: 12000,
        category: "Lehengas",
        subcategory: "Festive Lehengas",
        brand: "Fabindia",
        sku: "LEH-002",
        images: [
          "/images/lehengas/festive-1.jpg",
          "/images/lehengas/festive-2.jpg",
        ],
        thumbnail: "/images/lehengas/festive-1.jpg",
        colors: ["Pink", "Orange", "Green", "Blue"],
        sizes: ["S", "M", "L", "XL"],
        materials: ["Cotton", "Mirror Work"],
        careInstructions: "Dry clean only",
        inStock: true,
        stockQuantity: 30,
        weight: 600,
        tags: ["festive", "lehenga", "mirror-work", "traditional"],
        rating: 4.6,
        reviewCount: 145,
        viewCount: 1800,
        isFeatured: false,
        isNew: true,
        isBestSeller: false,
        isOnSale: true,
        shopId: "1",
        marketId: "1",
        sellerId: "seller-001",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },

      // Men's Wear
      {
        productId: "sherwani-001",
        name: "Embroidered Sherwani",
        slug: "embroidered-sherwani",
        description:
          "Traditional embroidered sherwani with intricate work. Perfect for weddings and special occasions.",
        shortDescription: "Traditional embroidered sherwani",
        price: 12000,
        originalPrice: 15000,
        category: "Men's Wear",
        subcategory: "Sherwanis",
        brand: "Manyavar",
        sku: "SHER-001",
        images: [
          "/images/Embroidered Sherwani.png",
          "/images/mens/sherwani-1.jpg",
        ],
        thumbnail: "/images/Embroidered Sherwani.png",
        colors: ["White", "Cream", "Gold", "Silver"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        materials: ["Silk", "Zari Work"],
        careInstructions: "Dry clean only",
        inStock: true,
        stockQuantity: 20,
        weight: 800,
        tags: ["sherwani", "wedding", "embroidered", "traditional"],
        rating: 4.7,
        reviewCount: 67,
        viewCount: 950,
        isFeatured: true,
        isNew: false,
        isBestSeller: true,
        isOnSale: true,
        shopId: "3",
        marketId: "1",
        sellerId: "seller-003",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },
      {
        productId: "kurta-001",
        name: "Casual Kurta Pajama",
        slug: "casual-kurta-pajama",
        description:
          "Comfortable casual kurta pajama for daily wear. Made from premium cotton fabric.",
        shortDescription: "Comfortable casual kurta pajama",
        price: 2500,
        originalPrice: 3000,
        category: "Men's Wear",
        subcategory: "Kurta Pajama",
        brand: "Global Desi",
        sku: "KUR-001",
        images: ["/images/Casual Kurta Pajama.png", "/images/mens/kurta-1.jpg"],
        thumbnail: "/images/Casual Kurta Pajama.png",
        colors: ["White", "Blue", "Green", "Brown"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        materials: ["Cotton"],
        careInstructions: "Machine wash cold",
        inStock: true,
        stockQuantity: 100,
        weight: 400,
        tags: ["kurta", "pajama", "casual", "cotton", "daily-wear"],
        rating: 4.5,
        reviewCount: 123,
        viewCount: 2100,
        isFeatured: false,
        isNew: false,
        isBestSeller: true,
        isOnSale: true,
        shopId: "4",
        marketId: "1",
        sellerId: "seller-004",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },
      {
        productId: "linen-kurta-001",
        name: "Linen Kurta",
        slug: "linen-kurta",
        description:
          "Comfortable linen kurta for summer wear. Lightweight and breathable fabric.",
        shortDescription: "Comfortable linen kurta",
        price: 1800,
        originalPrice: 2200,
        category: "Men's Wear",
        subcategory: "Kurta",
        brand: "Fabindia",
        sku: "LIN-001",
        images: ["/images/Linen Kurta.png", "/images/mens/linen-1.jpg"],
        thumbnail: "/images/Linen Kurta.png",
        colors: ["White", "Beige", "Light Blue", "Light Green"],
        sizes: ["S", "M", "L", "XL"],
        materials: ["Linen"],
        careInstructions: "Machine wash cold",
        inStock: true,
        stockQuantity: 75,
        weight: 300,
        tags: ["linen", "summer", "lightweight", "breathable"],
        rating: 4.3,
        reviewCount: 89,
        viewCount: 1200,
        isFeatured: false,
        isNew: true,
        isBestSeller: false,
        isOnSale: true,
        shopId: "5",
        marketId: "1",
        sellerId: "seller-005",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },

      // Kids Wear
      {
        productId: "kids-lehenga-001",
        name: "Girls Lehenga Choli",
        slug: "girls-lehenga-choli",
        description:
          "Adorable lehenga choli for little girls. Perfect for festivals and special occasions.",
        shortDescription: "Adorable lehenga choli for girls",
        price: 3500,
        originalPrice: 4500,
        category: "Kids Wear",
        subcategory: "Girls Lehengas",
        brand: "W",
        sku: "KID-LEH-001",
        images: [
          "/images/Girls Lehenga Choli.png",
          "/images/kids/girls-lehenga-1.jpg",
        ],
        thumbnail: "/images/Girls Lehenga Choli.png",
        colors: ["Pink", "Red", "Blue", "Yellow"],
        sizes: ["2-3 Years", "3-4 Years", "4-5 Years", "5-6 Years"],
        materials: ["Silk", "Zari"],
        careInstructions: "Dry clean only",
        inStock: true,
        stockQuantity: 40,
        weight: 200,
        tags: ["kids", "girls", "lehenga", "festive"],
        rating: 4.8,
        reviewCount: 45,
        viewCount: 600,
        isFeatured: false,
        isNew: false,
        isBestSeller: true,
        isOnSale: true,
        shopId: "1",
        marketId: "1",
        sellerId: "seller-001",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },
      {
        productId: "kids-sherwani-001",
        name: "Boys Sherwani Set",
        slug: "boys-sherwani-set",
        description:
          "Traditional sherwani set for boys. Perfect for weddings and special occasions.",
        shortDescription: "Traditional sherwani set for boys",
        price: 4000,
        originalPrice: 5000,
        category: "Kids Wear",
        subcategory: "Boys Sherwanis",
        brand: "Manyavar",
        sku: "KID-SHER-001",
        images: [
          "/images/Boys Sherwani Set.png",
          "/images/kids/boys-sherwani-1.jpg",
        ],
        thumbnail: "/images/Boys Sherwani Set.png",
        colors: ["White", "Cream", "Gold", "Silver"],
        sizes: ["2-3 Years", "3-4 Years", "4-5 Years", "5-6 Years"],
        materials: ["Silk", "Zari Work"],
        careInstructions: "Dry clean only",
        inStock: true,
        stockQuantity: 35,
        weight: 250,
        tags: ["kids", "boys", "sherwani", "wedding"],
        rating: 4.7,
        reviewCount: 34,
        viewCount: 500,
        isFeatured: false,
        isNew: false,
        isBestSeller: true,
        isOnSale: true,
        shopId: "2",
        marketId: "1",
        sellerId: "seller-002",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },
      {
        productId: "kids-gown-001",
        name: "Birthday Princess Gown",
        slug: "birthday-princess-gown",
        description:
          "Magical princess gown for special occasions. Perfect for birthdays and parties.",
        shortDescription: "Magical princess gown",
        price: 2800,
        originalPrice: 3500,
        category: "Kids Wear",
        subcategory: "Girls Gowns",
        brand: "Global Desi",
        sku: "KID-GOWN-001",
        images: [
          "/images/Birthday Princess Gown.png",
          "/images/kids/princess-gown-1.jpg",
        ],
        thumbnail: "/images/Birthday Princess Gown.png",
        colors: ["Pink", "Purple", "Blue", "White"],
        sizes: ["2-3 Years", "3-4 Years", "4-5 Years", "5-6 Years"],
        materials: ["Satin", "Tulle"],
        careInstructions: "Hand wash cold",
        inStock: true,
        stockQuantity: 50,
        weight: 150,
        tags: ["kids", "girls", "princess", "gown", "birthday"],
        rating: 4.9,
        reviewCount: 78,
        viewCount: 800,
        isFeatured: true,
        isNew: false,
        isBestSeller: true,
        isOnSale: true,
        shopId: "3",
        marketId: "1",
        sellerId: "seller-003",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },

      // Women's Wear
      {
        productId: "anarkali-001",
        name: "Festive Anarkali Suit",
        slug: "festive-anarkali-suit",
        description:
          "Beautiful festive anarkali suit with intricate work. Perfect for festivals and celebrations.",
        shortDescription: "Festive anarkali suit",
        price: 8000,
        originalPrice: 10000,
        category: "Women's Wear",
        subcategory: "Anarkali Suits",
        brand: "W",
        sku: "ANA-001",
        images: [
          "/images/Festive Anarkali Suit.png",
          "/images/womens/anarkali-1.jpg",
        ],
        thumbnail: "/images/Festive Anarkali Suit.png",
        colors: ["Pink", "Purple", "Blue", "Green"],
        sizes: ["S", "M", "L", "XL"],
        materials: ["Silk", "Zari Work"],
        careInstructions: "Dry clean only",
        inStock: true,
        stockQuantity: 25,
        weight: 700,
        tags: ["anarkali", "festive", "suit", "traditional"],
        rating: 4.6,
        reviewCount: 98,
        viewCount: 1400,
        isFeatured: false,
        isNew: false,
        isBestSeller: true,
        isOnSale: true,
        shopId: "4",
        marketId: "1",
        sellerId: "seller-004",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },
      {
        productId: "indo-western-001",
        name: "Indo Western Suit",
        slug: "indo-western-suit",
        description:
          "Stylish Indo-Western fusion suit. Perfect blend of traditional and contemporary fashion.",
        shortDescription: "Indo-Western fusion suit",
        price: 6000,
        originalPrice: 7500,
        category: "Women's Wear",
        subcategory: "Indo Western",
        brand: "Global Desi",
        sku: "IND-001",
        images: [
          "/images/Indo Western Suit.png",
          "/images/womens/indo-western-1.jpg",
        ],
        thumbnail: "/images/Indo Western Suit.png",
        colors: ["Black", "Navy", "Maroon", "Brown"],
        sizes: ["S", "M", "L", "XL"],
        materials: ["Cotton", "Polyester"],
        careInstructions: "Machine wash cold",
        inStock: true,
        stockQuantity: 40,
        weight: 500,
        tags: ["indo-western", "fusion", "contemporary", "stylish"],
        rating: 4.4,
        reviewCount: 56,
        viewCount: 1100,
        isFeatured: false,
        isNew: true,
        isBestSeller: false,
        isOnSale: true,
        shopId: "5",
        marketId: "1",
        sellerId: "seller-005",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },
    ];

    await db.collection("products").insertMany(products);
    console.log(`🛍️ Created ${products.length} products`);

    // Create sample users
    const users = [
      {
        userId: "user-001",
        email: "john.doe@example.com",
        name: "John Doe",
        phone: "+91-9876543210",
        emailVerified: true,
        phoneVerified: true,
        isActive: true,
        role: "customer",
        preferences: {
          newsletter: true,
          notifications: true,
          theme: "light",
          language: "en",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      },
      {
        userId: "user-002",
        email: "jane.smith@example.com",
        name: "Jane Smith",
        phone: "+91-9876543211",
        emailVerified: true,
        phoneVerified: true,
        isActive: true,
        role: "customer",
        preferences: {
          newsletter: false,
          notifications: true,
          theme: "dark",
          language: "en",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      },
    ];

    await db.collection("users").insertMany(users);
    console.log(`👤 Created ${users.length} users`);

    // Create sample addresses
    const addresses = [
      {
        _id: uuidv4(),
        userId: "user-001",
        type: "home",
        name: "John Doe",
        phone: "+91-9876543210",
        address: "123, MG Road, Near City Mall",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
        landmark: "Opposite Metro Station",
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4(),
        userId: "user-002",
        type: "home",
        name: "Jane Smith",
        phone: "+91-9876543211",
        address: "456, Park Street, Sector 15",
        city: "Delhi",
        state: "Delhi",
        pincode: "110015",
        country: "India",
        landmark: "Near Central Park",
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection("addresses").insertMany(addresses);
    console.log(`🏠 Created ${addresses.length} addresses`);

    // Create sample coupons
    const coupons = [
      {
        code: "WELCOME10",
        name: "Welcome Discount",
        description: "10% off on your first order",
        type: "percentage",
        value: 10,
        minOrderAmount: 1000,
        maxDiscount: 500,
        usageLimit: 1000,
        usedCount: 0,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
        applicableCategories: [],
        applicableProducts: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "FESTIVE20",
        name: "Festive Special",
        description: "20% off on festive wear",
        type: "percentage",
        value: 20,
        minOrderAmount: 2000,
        maxDiscount: 1000,
        usageLimit: 500,
        usedCount: 0,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        isActive: true,
        applicableCategories: ["Sarees", "Lehengas", "Men's Wear"],
        applicableProducts: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "FLAT500",
        name: "Flat Discount",
        description: "Flat ₹500 off on orders above ₹3000",
        type: "fixed",
        value: 500,
        minOrderAmount: 3000,
        maxDiscount: 500,
        usageLimit: 200,
        usedCount: 0,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        isActive: true,
        applicableCategories: [],
        applicableProducts: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection("coupons").insertMany(coupons);
    console.log(`🎫 Created ${coupons.length} coupons`);

    // Create sample notifications
    const notifications = [
      {
        userId: "user-001",
        type: "order",
        title: "Order Confirmed",
        message:
          "Your order #ORD-123456 has been confirmed and is being processed.",
        data: { orderId: "ORD-123456", status: "confirmed" },
        isRead: false,
        isImportant: true,
        createdAt: new Date(),
      },
      {
        userId: "user-001",
        type: "promotion",
        title: "New Collection Available",
        message:
          "Check out our latest festive collection with amazing discounts!",
        data: { category: "festive", discount: "20%" },
        isRead: false,
        isImportant: false,
        createdAt: new Date(),
      },
    ];

    await db.collection("notifications").insertMany(notifications);
    console.log(`🔔 Created ${notifications.length} notifications`);

    // Create sample reviews
    const reviews = [
      {
        reviewId: uuidv4(),
        userId: "user-001",
        productId: "saree-001",
        orderId: "ORD-123456",
        rating: 5,
        title: "Beautiful saree!",
        comment:
          "The saree is absolutely stunning. The quality is excellent and the delivery was fast. Highly recommended!",
        images: [],
        isVerified: true,
        isHelpful: 12,
        isReported: false,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: uuidv4(),
        userId: "user-002",
        productId: "lehenga-001",
        orderId: "ORD-123457",
        rating: 4,
        title: "Good quality",
        comment:
          "Nice lehenga, good quality fabric. The fit was perfect. Would order again.",
        images: [],
        isVerified: true,
        isHelpful: 8,
        isReported: false,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection("reviews").insertMany(reviews);
    console.log(`⭐ Created ${reviews.length} reviews`);

    // Create sample cart
    const cart = {
      userId: "user-001",
      items: [
        {
          productId: "saree-001",
          quantity: 1,
          size: "Free Size",
          color: "Red",
          addedAt: new Date(),
        },
        {
          productId: "lehenga-001",
          quantity: 1,
          size: "M",
          color: "Red",
          addedAt: new Date(),
        },
      ],
      totalItems: 2,
      subtotal: 40000,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("cart").insertOne(cart);
    console.log("🛒 Created sample cart");

    // Create sample wishlist
    const wishlistItems = [
      { userId: "user-001", productId: "sherwani-001", addedAt: new Date() },
      { userId: "user-001", productId: "anarkali-001", addedAt: new Date() },
      { userId: "user-002", productId: "saree-002", addedAt: new Date() },
    ];

    await db.collection("wishlist").insertMany(wishlistItems);
    console.log(`❤️ Created ${wishlistItems.length} wishlist items`);

    // Show database stats
    const stats = await db.stats();
    console.log("\n📊 Database Statistics:");
    console.log(`Collections: ${Object.keys(stats.collections).length}`);
    console.log(`Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`Storage Size: ${(stats.storageSize / 1024).toFixed(2)} KB`);

    console.log("\n✅ Comprehensive database seeding completed successfully!");
    console.log("\n🎉 Your Pehenava e-commerce platform is ready with:");
    console.log(`   - ${products.length} products across multiple categories`);
    console.log(`   - ${users.length} sample users`);
    console.log(`   - ${addresses.length} addresses`);
    console.log(`   - ${coupons.length} discount coupons`);
    console.log(`   - ${notifications.length} notifications`);
    console.log(`   - ${reviews.length} product reviews`);
    console.log(`   - Sample cart and wishlist data`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seedComprehensiveDatabase();

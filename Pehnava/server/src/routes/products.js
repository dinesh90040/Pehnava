import { Router } from "express";
import { getDB } from "../db.js";

const router = Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const { shopId, category, search, featured, gender, limit, brand, brands, categories, priceMin, priceMax, page, pageSize, sort } = req.query;

    let filter = {};
    if (shopId) filter.shopId = Number(shopId);

    // Gender mapping helper (frontend may send gender or category labels)
    const genderMap = {
      women: "Women's Wear",
      men: "Men's Wear",
      kids: "Kids Wear",
    };

    const resolvedCategory = gender
      ? genderMap[String(gender).toLowerCase()] || category
      : category;

    // Broaden gender to include common related categories/subcategories
    const genderCategoryMap = {
      women: [
        "Women's Wear",
        "Sarees",
        "Lehengas",
        "Anarkali",
        "Anarkali Suits",
        "Indo Western",
        "Salwar Kameez",
        "Kurtis",
        "Tops",
        "Tunics",
      ],
      men: [
        "Men's Wear",
        "Sherwanis",
        "Kurta",
        "Kurta Pajama",
        "Suits",
        "Blazers",
        "Trousers",
        "Shirts",
      ],
      kids: [
        "Kids Wear",
        "Girls Lehengas",
        "Boys Sherwanis",
        "Girls Gowns",
        "Boys Suits",
        "Kids T-Shirts",
        "Kids Trousers",
      ],
    };

    const genderKey = gender ? String(gender).toLowerCase() : null;

    // Build category/subcategory matching
    const categoryOr = [];
    if (resolvedCategory) {
      const rx = { $regex: String(resolvedCategory), $options: "i" };
      categoryOr.push({ category: rx }, { subcategory: rx });
    }
    if (genderKey && genderCategoryMap[genderKey]) {
      const terms = genderCategoryMap[genderKey];
      for (const t of terms) {
        const rx = { $regex: t, $options: "i" };
        categoryOr.push({ category: rx }, { subcategory: rx });
      }
    }
    if (categoryOr.length) {
      filter.$or = (filter.$or || []).concat(categoryOr);
    }

    if (search) {
      const searchOr = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { tags: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
      filter.$or = (filter.$or || []).concat(searchOr);
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    // Brand filter (single or multi)
    const brandList = (brands ? String(brands).split(',') : []).map(s => s.trim()).filter(Boolean);
    if (brandList.length > 0) {
      const brandOr = brandList.map(b => ({ brand: { $regex: b, $options: "i" } }));
      filter.$or = (filter.$or || []).concat(brandOr);
    } else if (brand) {
      filter.brand = { $regex: String(brand), $options: "i" };
    }

    // Price range filter
    const min = priceMin != null ? Number(priceMin) : null;
    const max = priceMax != null ? Number(priceMax) : null;
    if (min != null || max != null) {
      filter.price = {};
      if (min != null && !Number.isNaN(min)) filter.price.$gte = min;
      if (max != null && !Number.isNaN(max)) filter.price.$lte = max;
      if (Object.keys(filter.price).length === 0) delete filter.price;
    }

    // Additional categories from query (comma-separated)
    const cats = (categories ? String(categories).split(',') : []).map(s => s.trim()).filter(Boolean);
    if (cats.length) {
      const catOr = [];
      for (const t of cats) {
        const rx = { $regex: t, $options: "i" };
        catOr.push({ category: rx }, { subcategory: rx });
      }
      filter.$or = (filter.$or || []).concat(catOr);
    }

    let q = db
      .collection("products")
      .find(filter)
      .project({ _id: 0 });

    // Sorting
    const sortMap = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'rating-desc': { rating: -1 },
    };
    if (sort && sortMap[sort]) {
      q = q.sort(sortMap[sort]);
    }

    const pg = Math.max(1, parseInt(page || "1", 10));
    const sz = Math.max(1, Math.min(100, parseInt(pageSize || limit || "24", 10)));
    const skip = (pg - 1) * sz;

    let products = await q.skip(skip).limit(sz).toArray();
    // Server-side fallback: if no products match, return some generic products
    if (!Array.isArray(products) || products.length === 0) {
      products = await db
        .collection("products")
        .find({})
        .project({ _id: 0 })
        .limit(Math.min(sz, 50))
        .toArray();
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by slug
router.get("/:slug", async (req, res) => {
  try {
    const db = getDB();
    const product = await db
      .collection("products")
      .findOne({ slug: req.params.slug }, { projection: { _id: 0 } });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get("/id/:id", async (req, res) => {
  try {
    const db = getDB();
    const productId = parseInt(req.params.id);
    const product = await db
      .collection("products")
      .findOne({ id: productId }, { projection: { _id: 0 } });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get distinct brands (optionally filtered by gender)
router.get("/brands", async (req, res) => {
  try {
    const db = getDB();
    const { gender } = req.query;

    // Reuse gender mapping similar to products listing
    const genderMap = {
      women: "Women's Wear",
      men: "Men's Wear",
      kids: "Kids Wear",
    };
    const resolvedCategory = gender
      ? genderMap[String(gender).toLowerCase()]
      : null;

    const filter = {};
    if (resolvedCategory) {
      filter.$or = [
        { category: { $regex: resolvedCategory, $options: "i" } },
        { subcategory: { $regex: resolvedCategory, $options: "i" } },
      ];
    }

    let brands = await db.collection("products").distinct("brand", filter);
    brands = (brands || []).filter(Boolean).sort();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get distinct categories (optionally filtered by gender)
router.get("/categories", async (req, res) => {
  try {
    const db = getDB();
    const { gender } = req.query;

    const genderMap = {
      women: "Women's Wear",
      men: "Men's Wear",
      kids: "Kids Wear",
    };
    const resolvedCategory = gender
      ? genderMap[String(gender).toLowerCase()]
      : null;

    const filter = {};
    if (resolvedCategory) {
      filter.$or = [
        { category: { $regex: resolvedCategory, $options: "i" } },
        { subcategory: { $regex: resolvedCategory, $options: "i" } },
      ];
    }

    const catSet = new Set();
    const cursor = db.collection("products").find(filter).project({ category: 1, subcategory: 1, _id: 0 });
    for await (const doc of cursor) {
      if (doc.category) catSet.add(doc.category);
      if (doc.subcategory) catSet.add(doc.subcategory);
    }
    const categories = Array.from(catSet).filter(Boolean).sort();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

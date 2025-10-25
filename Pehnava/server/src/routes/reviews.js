import { Router } from "express";
import { getDB } from "../db.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Create a review
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const { userId, productId, orderId, rating, title, comment, images } =
      req.body;

    if (!userId || !productId || !orderId || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if user has purchased this product
    const order = await db.collection("orders").findOne({
      orderId,
      userId,
      status: "delivered",
    });

    if (!order) {
      return res
        .status(400)
        .json({ error: "Order not found or not delivered" });
    }

    const orderItem = await db.collection("order_items").findOne({
      orderId,
      productId,
    });

    if (!orderItem) {
      return res.status(400).json({ error: "Product not found in this order" });
    }

    // Check if review already exists
    const existingReview = await db.collection("reviews").findOne({
      userId,
      productId,
      orderId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ error: "Review already exists for this order" });
    }

    const reviewId = uuidv4();
    const review = {
      reviewId,
      userId,
      productId,
      orderId,
      rating: parseInt(rating),
      title: title || "",
      comment: comment || "",
      images: images || [],
      isVerified: true,
      isHelpful: 0,
      isReported: false,
      status: "approved",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("reviews").insertOne(review);

    // Update product rating and review count
    await updateProductRating(db, productId);

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get reviews for a product
router.get("/product/:productId", async (req, res) => {
  try {
    const db = getDB();
    const { productId } = req.params;
    const { page = 1, limit = 10, rating, sort = "newest" } = req.query;

    let filter = { productId, status: "approved" };
    if (rating) filter.rating = parseInt(rating);

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "highest") sortOption = { rating: -1 };
    if (sort === "lowest") sortOption = { rating: 1 };
    if (sort === "helpful") sortOption = { isHelpful: -1 };

    const skip = (page - 1) * limit;
    const reviews = await db
      .collection("reviews")
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    // Get user details for each review
    for (const review of reviews) {
      const user = await db
        .collection("users")
        .findOne(
          { userId: review.userId },
          { projection: { name: 1, avatar: 1 } }
        );
      review.user = user;
    }

    const total = await db.collection("reviews").countDocuments(filter);

    // Get rating distribution
    const ratingDistribution = await db
      .collection("reviews")
      .aggregate([
        { $match: { productId, status: "approved" } },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
      ])
      .toArray();

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      ratingDistribution,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's reviews
router.get("/user/:userId", async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const reviews = await db
      .collection("reviews")
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    // Get product details for each review
    for (const review of reviews) {
      const product = await db
        .collection("products")
        .findOne(
          { productId: review.productId },
          { projection: { name: 1, images: 1, thumbnail: 1 } }
        );
      review.product = product;
    }

    const total = await db.collection("reviews").countDocuments({ userId });

    res.json({
      reviews,
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

// Update review helpfulness
router.patch("/:reviewId/helpful", async (req, res) => {
  try {
    const db = getDB();
    const { reviewId } = req.params;
    const { userId, isHelpful } = req.body;

    const review = await db.collection("reviews").findOne({ reviewId });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const increment = isHelpful ? 1 : -1;
    await db
      .collection("reviews")
      .updateOne({ reviewId }, { $inc: { isHelpful: increment } });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Report review
router.patch("/:reviewId/report", async (req, res) => {
  try {
    const db = getDB();
    const { reviewId } = req.params;
    const { reason } = req.body;

    await db.collection("reviews").updateOne(
      { reviewId },
      {
        $set: {
          isReported: true,
          reportReason: reason,
          updatedAt: new Date(),
        },
      }
    );

    res.json({ success: true, message: "Review reported successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update review
router.patch("/:reviewId", async (req, res) => {
  try {
    const db = getDB();
    const { reviewId } = req.params;
    const { rating, title, comment, images } = req.body;
    const { userId } = req.body;

    const review = await db.collection("reviews").findOne({ reviewId, userId });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const updateData = { updatedAt: new Date() };
    if (rating !== undefined) updateData.rating = parseInt(rating);
    if (title !== undefined) updateData.title = title;
    if (comment !== undefined) updateData.comment = comment;
    if (images !== undefined) updateData.images = images;

    await db
      .collection("reviews")
      .updateOne({ reviewId }, { $set: updateData });

    // Update product rating if rating changed
    if (rating !== undefined) {
      await updateProductRating(db, review.productId);
    }

    res.json({ success: true, message: "Review updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete review
router.delete("/:reviewId", async (req, res) => {
  try {
    const db = getDB();
    const { reviewId } = req.params;
    const { userId } = req.body;

    const review = await db.collection("reviews").findOne({ reviewId, userId });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    await db.collection("reviews").deleteOne({ reviewId });

    // Update product rating
    await updateProductRating(db, review.productId);

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to update product rating
async function updateProductRating(db, productId) {
  const reviews = await db
    .collection("reviews")
    .find({
      productId,
      status: "approved",
    })
    .toArray();

  if (reviews.length === 0) return;

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  const reviewCount = reviews.length;

  await db.collection("products").updateOne(
    { productId },
    {
      $set: {
        rating: Math.round(averageRating * 10) / 10,
        reviewCount,
      },
    }
  );
}

export default router;

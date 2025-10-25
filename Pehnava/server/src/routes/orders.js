import { Router } from "express";
import { getDB } from "../db.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const {
      userId,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      couponCode,
      notes,
    } = req.body;

    if (!userId || !items || !shippingAddress) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await db
        .collection("products")
        .findOne({ productId: item.productId });
      if (!product) {
        return res
          .status(400)
          .json({ error: `Product ${item.productId} not found` });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        orderId,
        productId: item.productId,
        productName: product.name,
        productImage: product.images?.[0] || product.thumbnail,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
        size: item.size,
        color: item.color,
        sellerId: product.sellerId,
        shopId: product.shopId,
        status: "pending",
        createdAt: new Date(),
      });
    }

    // Apply coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await db.collection("coupons").findOne({
        code: couponCode,
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() },
      });

      if (coupon && coupon.usedCount < coupon.usageLimit) {
        if (coupon.type === "percentage") {
          discount = Math.min(
            (subtotal * coupon.value) / 100,
            coupon.maxDiscount || Infinity
          );
        } else {
          discount = Math.min(coupon.value, subtotal);
        }
      }
    }

    const tax = Math.round(subtotal * 0.18); // 18% GST
    const shipping = subtotal > 1000 ? 0 : 100; // Free shipping above ₹1000
    const total = subtotal + tax + shipping - discount;

    // Create order
    const order = {
      orderId,
      userId,
      status: "pending",
      paymentStatus: "pending",
      shippingStatus: "pending",
      subtotal,
      tax,
      shipping,
      discount,
      total,
      currency: "INR",
      paymentMethod,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      notes,
      couponCode: couponCode || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("orders").insertOne(order);
    await db.collection("order_items").insertMany(orderItems);

    // Update coupon usage if applied
    if (couponCode) {
      await db
        .collection("coupons")
        .updateOne({ code: couponCode }, { $inc: { usedCount: 1 } });
    }

    // Clear user's cart
    await db.collection("cart").deleteOne({ userId });

    res.status(201).json({
      success: true,
      orderId,
      order,
      items: orderItems,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's orders
router.get("/user/:userId", async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    let filter = { userId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const orders = await db
      .collection("orders")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    // Get order items for each order
    for (const order of orders) {
      const items = await db
        .collection("order_items")
        .find({ orderId: order.orderId })
        .toArray();
      order.items = items;
    }

    const total = await db.collection("orders").countDocuments(filter);

    res.json({
      orders,
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

// Get order by ID
router.get("/:orderId", async (req, res) => {
  try {
    const db = getDB();
    const { orderId } = req.params;

    const order = await db.collection("orders").findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const items = await db
      .collection("order_items")
      .find({ orderId })
      .toArray();

    order.items = items;
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.patch("/:orderId/status", async (req, res) => {
  try {
    const db = getDB();
    const { orderId } = req.params;
    const { status, paymentStatus, shippingStatus, trackingNumber } = req.body;

    const updateData = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (shippingStatus) updateData.shippingStatus = shippingStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    if (status === "delivered") {
      updateData.deliveredAt = new Date();
    }

    const result = await db
      .collection("orders")
      .updateOne({ orderId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order items status
    if (status) {
      await db
        .collection("order_items")
        .updateMany({ orderId }, { $set: { status } });
    }

    // Create notification
    const order = await db.collection("orders").findOne({ orderId });
    await db.collection("notifications").insertOne({
      userId: order.userId,
      type: "order",
      title: "Order Status Updated",
      message: `Your order ${orderId} status has been updated to ${status}`,
      data: { orderId, status },
      isRead: false,
      createdAt: new Date(),
    });

    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel order
router.patch("/:orderId/cancel", async (req, res) => {
  try {
    const db = getDB();
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await db.collection("orders").findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === "delivered" || order.status === "cancelled") {
      return res.status(400).json({ error: "Cannot cancel this order" });
    }

    await db.collection("orders").updateOne(
      { orderId },
      {
        $set: {
          status: "cancelled",
          updatedAt: new Date(),
          cancellationReason: reason,
        },
      }
    );

    await db
      .collection("order_items")
      .updateMany({ orderId }, { $set: { status: "cancelled" } });

    // Create notification
    await db.collection("notifications").insertOne({
      userId: order.userId,
      type: "order",
      title: "Order Cancelled",
      message: `Your order ${orderId} has been cancelled`,
      data: { orderId, reason },
      isRead: false,
      createdAt: new Date(),
    });

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track order
router.get("/:orderId/track", async (req, res) => {
  try {
    const db = getDB();
    const { orderId } = req.params;

    const order = await db.collection("orders").findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const trackingInfo = {
      orderId: order.orderId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      shippingStatus: order.shippingStatus,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      deliveredAt: order.deliveredAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    res.json(trackingInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import { Router } from "express";
import { getDB } from "../db.js";

const router = Router();

// Get user's notifications
router.get("/user/:userId", async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.params;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    let filter = { userId };
    if (unreadOnly === "true") filter.isRead = false;

    const skip = (page - 1) * limit;
    const notifications = await db
      .collection("notifications")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection("notifications").countDocuments(filter);
    const unreadCount = await db.collection("notifications").countDocuments({
      userId,
      isRead: false,
    });

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.patch("/:notificationId/read", async (req, res) => {
  try {
    const db = getDB();
    const { notificationId } = req.params;

    await db.collection("notifications").updateOne(
      { _id: notificationId },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read
router.patch("/user/:userId/read-all", async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.params;

    await db.collection("notifications").updateMany(
      { userId, isRead: false },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete notification
router.delete("/:notificationId", async (req, res) => {
  try {
    const db = getDB();
    const { notificationId } = req.params;

    const result = await db
      .collection("notifications")
      .deleteOne({ _id: notificationId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all notifications
router.delete("/user/:userId", async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.params;

    await db.collection("notifications").deleteMany({ userId });
    res.json({ success: true, message: "All notifications cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

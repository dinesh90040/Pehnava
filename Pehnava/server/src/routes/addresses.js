import { Router } from "express";
import { getDB } from "../db.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Add address
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const {
      userId,
      type,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      country = "India",
      landmark,
      isDefault = false,
    } = req.body;

    if (!userId || !name || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await db
        .collection("addresses")
        .updateMany(
          { userId, isDefault: true },
          { $set: { isDefault: false } }
        );
    }

    const addressDoc = {
      _id: uuidv4(),
      userId,
      type: type || "home",
      name,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      landmark: landmark || "",
      isDefault,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("addresses").insertOne(addressDoc);
    res.status(201).json({ success: true, address: addressDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's addresses
router.get("/user/:userId", async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.params;

    const addresses = await db
      .collection("addresses")
      .find({ userId })
      .sort({ isDefault: -1, createdAt: -1 })
      .toArray();

    res.json({ addresses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update address
router.patch("/:addressId", async (req, res) => {
  try {
    const db = getDB();
    const { addressId } = req.params;
    const {
      type,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      landmark,
      isDefault,
    } = req.body;

    const updateData = { updatedAt: new Date() };
    if (type !== undefined) updateData.type = type;
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (pincode !== undefined) updateData.pincode = pincode;
    if (country !== undefined) updateData.country = country;
    if (landmark !== undefined) updateData.landmark = landmark;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    // If this is set as default, unset other default addresses
    if (isDefault) {
      const address = await db
        .collection("addresses")
        .findOne({ _id: addressId });
      if (address) {
        await db
          .collection("addresses")
          .updateMany(
            {
              userId: address.userId,
              _id: { $ne: addressId },
              isDefault: true,
            },
            { $set: { isDefault: false } }
          );
      }
    }

    const result = await db
      .collection("addresses")
      .updateOne({ _id: addressId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json({ success: true, message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete address
router.delete("/:addressId", async (req, res) => {
  try {
    const db = getDB();
    const { addressId } = req.params;

    const result = await db
      .collection("addresses")
      .deleteOne({ _id: addressId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set default address
router.patch("/:addressId/default", async (req, res) => {
  try {
    const db = getDB();
    const { addressId } = req.params;

    const address = await db
      .collection("addresses")
      .findOne({ _id: addressId });
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    // Unset other default addresses
    await db
      .collection("addresses")
      .updateMany(
        { userId: address.userId, _id: { $ne: addressId }, isDefault: true },
        { $set: { isDefault: false } }
      );

    // Set this address as default
    await db
      .collection("addresses")
      .updateOne(
        { _id: addressId },
        { $set: { isDefault: true, updatedAt: new Date() } }
      );

    res.json({ success: true, message: "Default address updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

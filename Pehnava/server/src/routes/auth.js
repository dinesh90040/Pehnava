import { Router } from "express";
import { getDB } from "../db.js";
import { sendEmail } from "../utils/email.js";
import { generateOtp, hashOtp, expiryFromNow } from "../utils/otp.js";

const router = Router();

// Create a new user and send OTP for verification
router.post("/signup", async (req, res) => {
  try {
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ error: "email is required" });
    const normalizedEmail = String(email).trim().toLowerCase();

    const db = getDB();

    // Upsert user record with emailVerified = false until OTP verified
    const now = new Date();
    await db.collection("users").updateOne(
      { email: normalizedEmail },
      {
        $set: {
          email: normalizedEmail,
          name: name ? String(name).trim() : undefined,
          emailVerified: false,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    // Generate and store OTP
    const otp = generateOtp();
    const otpHash = hashOtp(normalizedEmail, otp);
    const expiresAt = expiryFromNow();
    await db.collection("email_otps").updateOne(
      { email: normalizedEmail },
      { $set: { email: normalizedEmail, otpHash, expiresAt, attempts: 0, verified: false, createdAt: now } },
      { upsert: true }
    );

    // Send welcome email with OTP
    const displayName = name ? String(name).trim() : "";
    const greeting = displayName ? `Hi ${displayName},` : "Hi,";
    const subject = "Welcome to Pehenava - Verify your email";
    const html = `
      <p>${greeting}</p>
      <p>Welcome to Pehenava! We're excited to have you with us.</p>
      <p>Your verification code is <b>${otp}</b>. This code expires in 10 minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `;
    const text = `${greeting} Welcome to Pehenava! Your verification code is ${otp}. It expires in 10 minutes.`;
    await sendEmail({ to: normalizedEmail, subject, html, text });

    res.json({ ok: true, message: "Signup initiated. Check your email for OTP to verify.", email: normalizedEmail });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/request-otp", async (req, res) => {
  try {
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ error: "email is required" });
    const normalizedEmail = String(email).trim().toLowerCase();

    const otp = generateOtp();
    const otpHash = hashOtp(normalizedEmail, otp);
    const expiresAt = expiryFromNow();

    const db = getDB();
    await db.collection("email_otps").updateOne(
      { email: normalizedEmail },
      { $set: { email: normalizedEmail, otpHash, expiresAt, attempts: 0, verified: false, createdAt: new Date() } },
      { upsert: true }
    );

    const subject = "Your OTP Code";
    const displayName = name ? String(name).trim() : "";
    const greeting = displayName ? `Hi ${displayName},` : "Hi,";
    const html = `<p>${greeting}</p><p>Your verification code is <b>${otp}</b>.</p><p>This code expires in 10 minutes.</p>`;
    const text = `${greeting}\nYour verification code is ${otp}. It expires in 10 minutes.`;
    await sendEmail({ to: normalizedEmail, subject, html, text });

    res.json({ ok: true, message: "OTP sent" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) return res.status(400).json({ error: "email and otp are required" });
    const normalizedEmail = String(email).trim().toLowerCase();

    const db = getDB();
    const rec = await db.collection("email_otps").findOne({ email: normalizedEmail });
    if (!rec) return res.status(400).json({ error: "OTP not requested" });
    if (rec.expiresAt && new Date(rec.expiresAt).getTime() < Date.now()) return res.status(400).json({ error: "OTP expired" });

    const candidate = hashOtp(normalizedEmail, String(otp));
    if (candidate !== rec.otpHash) {
      await db.collection("email_otps").updateOne({ email: normalizedEmail }, { $inc: { attempts: 1 } });
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await db.collection("email_otps").updateOne(
      { email: normalizedEmail },
      { $set: { verified: true, verifiedAt: new Date() }, $unset: { otpHash: "" } }
    );

    await db.collection("users").updateOne(
      { email: normalizedEmail },
      { $set: { email: normalizedEmail, emailVerified: true, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );

    res.json({ ok: true, email: normalizedEmail, verified: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

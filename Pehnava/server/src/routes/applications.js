import { Router } from "express";
import { getDB } from "../db.js";
import { sendEmail } from "../utils/email.js";

const router = Router();

function isEmailVerifiedRecord(rec) {
  return !!(rec && (rec.emailVerified || rec.verified));
}

router.post("/", async (req, res) => {
  try {
    const { email, name, ...payload } = req.body || {};
    if (!email) return res.status(400).json({ error: "email is required" });
    const normalizedEmail = String(email).trim().toLowerCase();

    const db = getDB();

    const [userRec, otpRec] = await Promise.all([
      db.collection("users").findOne({ email: normalizedEmail }),
      db.collection("email_otps").findOne({ email: normalizedEmail }),
    ]);

    const verified = isEmailVerifiedRecord(userRec) || isEmailVerifiedRecord(otpRec);
    if (!verified) return res.status(403).json({ error: "Email not verified" });

    const application = {
      email: normalizedEmail,
      name: name ? String(name).trim() : undefined,
      data: payload,
      status: "submitted",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("applications").insertOne(application);

    const subject = "Application Received";
    const displayName = name ? String(name).trim() : "";
    const greeting = displayName ? `Hi ${displayName},` : "Hi,";
    const html = `<p>${greeting}</p><p>We have received your application. Your reference ID is <b>${result.insertedId}</b>.</p>`;
    const text = `${greeting}\nWe have received your application. Your reference ID is ${result.insertedId}.`;

    await sendEmail({ to: normalizedEmail, subject, html, text });

    const adminTo = process.env.ADMIN_EMAIL;
    if (adminTo) {
      await sendEmail({
        to: adminTo,
        subject: "New Application Submitted",
        html: `<p>New application from ${normalizedEmail} (${displayName || "Unnamed"}).</p><pre>${JSON.stringify(payload, null, 2)}</pre>`,
        text: `New application from ${normalizedEmail} (${displayName || "Unnamed"}).\n${JSON.stringify(payload, null, 2)}`,
      });
    }

    res.json({ ok: true, id: String(result.insertedId) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

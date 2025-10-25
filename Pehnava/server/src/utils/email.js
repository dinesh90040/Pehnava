import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Boolean(process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465),
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

export async function sendEmail({ to, subject, html, text }) {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  if (!from) throw new Error("EMAIL_FROM or SMTP_USER must be set");
  const info = await transporter.sendMail({ from, to, subject, html, text });
  return info;
}

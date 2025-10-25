import crypto from "crypto";

const OTP_TTL_MS = Number(process.env.OTP_TTL_MS || 10 * 60 * 1000); // default 10 minutes
const OTP_LENGTH = Number(process.env.OTP_LENGTH || 6);
const OTP_SECRET = process.env.OTP_SECRET || "change-me-otp-secret";

export function generateOtp(length = OTP_LENGTH) {
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) code += digits[Math.floor(Math.random() * 10)];
  return code;
}

export function hashOtp(email, otp) {
  return crypto.createHmac("sha256", OTP_SECRET).update(`${email}:${otp}`).digest("hex");
}

export function expiryFromNow(ms = OTP_TTL_MS) {
  return new Date(Date.now() + ms);
}

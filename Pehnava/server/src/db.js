import { MongoClient } from "mongodb";

let client;
let db;

export async function connectDB() {
  if (db) return db;
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pehenava";
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const dbName = process.env.MONGODB_DB_NAME || process.env.DB_NAME || "pehenava";
  db = client.db(dbName);
  return db;
}

export function getDB() {
  if (!db) throw new Error("DB not connected. Call connectDB() first.");
  return db;
}

export async function closeDB() {
  try { await client?.close(); } catch {}
  db = undefined;
  client = undefined;
}

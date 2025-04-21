import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// For Vercel serverless environment, you need to handle connections differently
// const MONGODB_URI = process.env.MONGO_URL;
const MONGODB_URI = `${process.env.MONGO_URL}?maxPoolSize=10&connectTimeoutMS=10000&socketTimeoutMS=45000`;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGO_URL environment variable inside .env.local or in your Vercel project settings",
  );
}

// Connection caching for serverless functions
let cachedClient = null;
let cachedDb = null;

let collections = {
  recipes: null,
  mealPlans: null,
  suggestions: null,
};

export async function connectToDatabase() {
  // If we have a cached connection, use that
  if (cachedClient && cachedDb) {
    collections.recipes = cachedDb.collection("recipes");
    collections.mealPlans = cachedDb.collection("mealPlans");
    collections.suggestions = cachedDb.collection("suggestions");
    return cachedDb;
  }

  // If no cached connection exists, create new connection
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    // console.log("Successfully connected to MongoDB");

    const db = client.db("CookBook");

    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    // Set up collections
    collections.recipes = db.collection("recipes");
    collections.mealPlans = db.collection("mealPlans");
    collections.suggestions = db.collection("suggestions");

    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }
}

export async function closeConnections() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log("Database connection closed");
  }
}

export { collections };
export function getDb() {
  return cachedDb;
}

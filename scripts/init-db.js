import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local FIRST
config({ path: resolve(__dirname, "../.env.local") });

// Debug: Check if environment variables are loaded
console.log("🔍 Environment variables loaded:");
console.log(
  "DATABASE_URL:",
  process.env.DATABASE_URL ? "✅ Set" : "❌ Not set"
);
console.log(
  "CLOUDINARY_CLOUD_NAME:",
  process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Not set"
);

if (!process.env.DATABASE_URL) {
  console.error(
    "❌ DATABASE_URL is not set. Please check your .env.local file."
  );
  process.exit(1);
}

// Now import the database functions AFTER environment is loaded
const { initDB } = await import("../lib/db.js");

async function initialize() {
  try {
    await initDB();
    console.log("Database setup completed!");
  } catch (error) {
    process.exit(1);
  }
}

initialize();

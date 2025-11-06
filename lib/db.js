import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Only load .env.local in development
if (process.env.NODE_ENV !== "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  config({ path: resolve(__dirname, "../.env.local") });
}

// In-memory storage for build time and when no database
let memoryPosts = [];
let memoryUsers = [];

export async function query(text, params) {
  // If no database URL, use in-memory storage (for build time)
  if (
    !process.env.DATABASE_URL ||
    (process.env.NODE_ENV === "production" &&
      !process.env.DATABASE_URL.includes("neon"))
  ) {
    console.log("Using in-memory storage (no database connection)");

    // Mock database operations for build
    if (text.includes("SELECT")) {
      if (text.includes("posts")) {
        return { rows: memoryPosts };
      } else if (text.includes("users")) {
        return { rows: memoryUsers };
      } else if (text.includes("version()")) {
        return { rows: [{ version: "PostgreSQL (mock for build)" }] };
      }
    } else if (text.includes("INSERT")) {
      const newItem = {
        id: Date.now(),
        ...params,
        created_at: new Date().toISOString(),
      };
      if (text.includes("posts")) {
        memoryPosts.push(newItem);
        return { rows: [newItem] };
      } else if (text.includes("users")) {
        memoryUsers.push(newItem);
        return { rows: [newItem] };
      }
    }

    return { rows: [] };
  }

  // Use real PostgreSQL when DATABASE_URL is available
  const { Pool } = await import("pg");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function initDB() {
  // Skip database initialization during build
  if (
    !process.env.DATABASE_URL ||
    (process.env.NODE_ENV === "production" &&
      !process.env.DATABASE_URL.includes("neon"))
  ) {
    console.log(
      "Skipping database initialization (build time or no DATABASE_URL)"
    );
    return;
  }

  try {
    const { Pool } = await import("pg");
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        avatar_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
  }
}

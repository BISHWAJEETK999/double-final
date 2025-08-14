import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Use environment variable for database URL, fallback to in-memory for development
const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  console.log("Using PostgreSQL database");
  const sql = neon(databaseUrl);
  export const db = drizzle(sql, { schema });
  export const pool = sql;
} else {
  console.log("Using in-memory storage for development environment");
  export const db = null;
  export const pool = null;
}

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Use environment variable for database URL, fallback to in-memory for development
const databaseUrl = process.env.DATABASE_URL;

let db: any = null;
let pool: any = null;

if (databaseUrl) {
  console.log("Using PostgreSQL database");
  const sql = neon(databaseUrl);
  db = drizzle(sql, { schema });
  pool = sql;
} else {
  console.log("Using in-memory storage for development environment");
}

export { db, pool };

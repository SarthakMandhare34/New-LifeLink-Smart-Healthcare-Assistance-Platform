/**
 * ============================================================================
 * LifeLink Smart Healthcare Assistance Platform
 * Relational Database Schema & Drizzle Kit Configuration (v1.3.2)
 * ============================================================================
 * 
 * Configures Drizzle ORM migration generation, schema push, and introspection.
 * Connects directly to MySQL 8.0 / TiDB Cloud instance specified via DATABASE_URL.
 */
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands. Check your .env file.");
}

export default defineConfig({
  schema: "./database/schema.ts",
  out: "./database/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
  verbose: false,
  strict: true,
});



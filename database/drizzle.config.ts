/**
 * ============================================================================
 * DRIZZLE KIT CONFIGURATION (database/drizzle.config.ts)
 * ============================================================================
 * 
 * HOW TO RUN:
 * Command: `npm run db:push` (applies schema changes to MySQL)
 * Command: `npm run db:studio` (opens visual web interface for database)
 * 
 * WHAT THIS FILE DOES:
 * Tells Drizzle Kit where to find our TypeScript schema (`./database/schema.ts`),
 * where to store versioned SQL migration files (`./database/migrations`), and
 * which database dialect (MySQL) and connection string to use.
 */
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./database/schema.ts",
  out: "./database/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
});


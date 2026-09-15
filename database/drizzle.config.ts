/**
 * ============================================================================
 * RELATIONAL DATABASE SCHEMA (DRIZZLE ORM)
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This file is the absolute blueprint of how data is stored permanently.
 * We use a tool called Drizzle ORM. It prevents SQL Injection attacks (hackers typing malicious code).
 * It guarantees that if we expect a 'number' for an Age, nobody can accidentally save a 'string'.
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


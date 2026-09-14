/**
 * ============================================================================
 * SHARED TYPES & SCHEMA RE-EXPORTS (shared/types.ts)
 * ============================================================================
 * 
 * WHAT THIS FILE DOES:
 * Serves as the isomorphic bridge re-exporting all database entity models,
 * Drizzle ORM inferred types, and common error classes across the entire application.
 */
export type * from "../database/schema";                                                         // Re-export all database table schemas and Zod inferred types
export * from "./_core/errors";                                                                 // Re-export common HTTP error definitions

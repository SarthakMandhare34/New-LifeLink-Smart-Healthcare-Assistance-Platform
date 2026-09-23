/**
 * ============================================================================
 * SHARED ISOMORPHIC LOGIC
 * ============================================================================
 *
 * WHY THIS FILE IS SPECIAL:
 * The code in this folder is executed by BOTH the front-end browser and the back-end server.
 * This ensures that when we calculate things (like the distance between clinics),
 * both the server and the phone agree on the exact same mathematical rules.
 */
export type * from "../database/schema";                                                         // Re-export all database table schemas and Zod inferred types
export * from "./_core/errors";                                                                 // Re-export common HTTP error definitions

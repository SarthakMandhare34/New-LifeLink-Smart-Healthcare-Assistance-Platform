/**
 * ============================================================================
 * LifeLink Smart Healthcare Assistance Platform
 * Isomorphic Type Contracts & Schema Re-Exports (v1.3.0)
 * ============================================================================
 *
 * Cross-boundary type safety:
 * - Re-exports database schema models and Zod inferred validation types.
 * - Isomorphic error hierarchy shared between Express API and React client.
 * - Guarantees full end-to-end compile-time type safety across network borders.
 * ============================================================================
 */
export type * from "../database/schema";                                                         // Re-export all database table schemas and Zod inferred types
export * from "./_core/errors";                                                                 // Re-export common HTTP error definitions



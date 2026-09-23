/**
 * ============================================================================
 * FRONTEND REACT CORE
 * ============================================================================
 *
 * WHY THIS FILE IS SPECIAL:
 * This is the root configuration of the React application.
 * It sets up the Routing (which URL goes to which page) and global Theme Contexts.
 */
import { createTRPCReact } from "@trpc/react-query";                                    // React Query hooks adapter for tRPC
import type { AppRouter } from "../../../backend/routers";                                  // Backend router type definition

// Export fully typed React hooks (e.g. trpc.patientAuth.login.useMutation)
// High-performance type-safe RPC client bridging React frontend with Express backend
export const trpc = createTRPCReact<AppRouter>();

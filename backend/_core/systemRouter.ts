/**
 * ============================================================================
 * SYSTEM CORE & INFRASTRUCTURE
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * These are the foundational building blocks of the backend server.
 * It sets up the Express framework, cookie parsing, and environment variables.
 * Without this core infrastructure, the application cannot boot or talk to the internet securely.
 */
import { z } from "zod";
import { publicProcedure, router } from "./trpc";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z
        .object({
          timestamp: z.number().min(0, "timestamp cannot be negative").optional(),
        })
        .optional()
    )
    .query(() => ({
      ok: true,
    })),
});

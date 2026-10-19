/**
 * ============================================================================
 * ADMIN PORTAL BACKEND ROUTER (backend/routers/admin.ts)
 * ============================================================================
 *
 * Core administration endpoints:
 * - Administrative authorization & session authentication
 * - System-wide platform metrics (users, doctors, appointments, prescriptions)
 * - User management & audit operations
 * - Booking conflict & error audit log management (Table 14: bookingErrors)
 * - Mumbai specialist clinician roster review
 * ============================================================================
 */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  clearBookingErrorsAudit,
  deleteUserById,
  ensureAdminUser,
  getAdminBookingErrors,
  getAdminDashboardMetrics,
  getAdminUsersList,
  getUserById,
} from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { authSession } from "../auth/authUtil";
import { getSessionCookieOptions } from "../_core/cookies";
import { COOKIE_NAME, ADMIN_COOKIE_NAME } from "../../shared/const";
import { ENV } from "../_core/env";
import { mockDoctorDirectory } from "../discovery/mockDoctorDirectory";
import { timingSafeEqual } from "node:crypto";

function verifyAdminAccessCode(code: string): boolean {
  const masterKey =
    process.env.ADMIN_SECRET_KEY ||
    ENV.demoDoctorAccessCode ||
    "lifelink-admin-master-key-2026";
  const trimmedCode = (code || "").trim();
  const trimmedKey = masterKey.trim();

  if (trimmedCode.length !== trimmedKey.length || trimmedCode.length < 8) {
    return false;
  }
  return timingSafeEqual(Buffer.from(trimmedCode), Buffer.from(trimmedKey));
}

export const adminRouter = router({
  login: publicProcedure
    .input(
      z.object({
        accessCode: z.string().min(1, "Administrator key is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isValid = verifyAdminAccessCode(input.accessCode);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid administrator key.",
        });
      }

      const adminUser = await ensureAdminUser();
      const token = await authSession.createSessionToken(adminUser.openId, {
        name: adminUser.name || "System Administrator",
      });

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(ADMIN_COOKIE_NAME, token, cookieOptions);
      ctx.res.cookie(COOKIE_NAME, token, cookieOptions);

      return {
        success: true,
        user: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
        },
      };
    }),

  me: publicProcedure.query(async ({ ctx }) => {
    const adminUser = ctx.adminUser || (ctx.user?.role === "admin" ? ctx.user : null);
    if (!adminUser || adminUser.role !== "admin") {
      return null;
    }
    const freshUser = await getUserById(adminUser.id);
    if (!freshUser || freshUser.role !== "admin") {
      return null;
    }
    return {
      id: freshUser.id,
      name: freshUser.name,
      email: freshUser.email,
      role: freshUser.role,
      lastSignedIn: freshUser.lastSignedIn,
    };
  }),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    const { maxAge: _, ...clearOptions } = cookieOptions as any;
    ctx.res.clearCookie(ADMIN_COOKIE_NAME, clearOptions);
    ctx.res.clearCookie(COOKIE_NAME, clearOptions);
    return { success: true };
  }),

  metrics: adminProcedure.query(async () => {
    const metrics = await getAdminDashboardMetrics();
    const errors = await getAdminBookingErrors({ limit: 1000 });
    return {
      ...metrics,
      bookingErrorCount: errors.length,
      totalDoctorsDirectory: mockDoctorDirectory.length,
    };
  }),

  users: router({
    list: adminProcedure.query(async () => {
      return getAdminUsersList({ limit: 200 });
    }),
    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.id === input.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot delete the active administrator account.",
          });
        }
        return deleteUserById(input.id);
      }),
  }),

  bookingErrors: router({
    list: adminProcedure
      .input(
        z
          .object({
            limit: z.number().int().min(1).max(200).optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        return getAdminBookingErrors({ limit: input?.limit ?? 100 });
      }),
    clear: adminProcedure.mutation(async () => {
      return clearBookingErrorsAudit();
    }),
  }),

  doctors: router({
    list: adminProcedure.query(() => {
      return mockDoctorDirectory.map(doc => ({
        id: doc.id,
        name: doc.name,
        specialty: doc.specialty,
        railLine: doc.railLine,
        station: doc.station,
        workEmail: `${doc.specialty.toLowerCase().replace(/[^a-z0-9]/g, "")}@lifelink.com`,
        status: "Active & Verified",
      }));
    }),
  }),
});

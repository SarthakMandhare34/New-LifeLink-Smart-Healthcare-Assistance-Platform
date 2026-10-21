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
 * - Doctor account management (provision, reset password, delete)
 * ============================================================================
 */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  clearBookingErrorsAudit,
  createSyntheticDoctorCredential,
  deleteSyntheticDoctorCredential,
  deleteUserById,
  ensureAdminUser,
  getAdminBookingErrors,
  getAdminDashboardMetrics,
  getAdminUsersList,
  getUserById,
  listSyntheticDoctorCredentialAccounts,
  refreshSyntheticDoctorCredentialByDoctorId,
  updateSyntheticDoctorPasswordByEmail,
} from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { authSession } from "../auth/authUtil";
import { getSessionCookieOptions } from "../_core/cookies";
import { COOKIE_NAME, ADMIN_COOKIE_NAME } from "../../shared/const";
import { ENV } from "../_core/env";
import { mockDoctorDirectory } from "../discovery/mockDoctorDirectory";
import { timingSafeEqual } from "node:crypto";
import { hashPatientPassword } from "../auth/nativePatientAuth";
import {
  doctorDisplayName,
  getSyntheticDoctor,
} from "../syntheticDoctor";

/**
 * Verifies the administrator access code against environment-configured secrets only.
 * SECURITY: No hardcoded fallback passwords. Only ADMIN_SECRET_KEY and ADMIN_PASSWORD
 * environment variables are accepted. This prevents unauthorized access via guessable defaults.
 */
function verifyAdminAccessCode(code: string): boolean {
  const trimmed = (code || "").trim();
  if (!trimmed) return false;

  // Only accept credentials from secure environment variables — never hardcoded strings
  const validKeys = [
    ENV.adminSecretKey,
    ENV.adminPassword,
    process.env.ADMIN_SECRET_KEY,
    process.env.ADMIN_PASSWORD,
  ].filter(Boolean) as string[];

  if (validKeys.length === 0) {
    // No admin credentials configured — reject all logins for safety
    return false;
  }

  return validKeys.some(key => {
    const keyBuf = Buffer.from(key.trim());
    const inputBuf = Buffer.from(trimmed);
    if (keyBuf.length !== inputBuf.length) return false;
    return timingSafeEqual(keyBuf, inputBuf);
  });
}

export const adminRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().optional(),
        password: z.string().optional(),
        accessCode: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const codeOrPassword = (input.password || input.accessCode || "").trim();
      const emailOrUser = (input.email || "").trim().toLowerCase();

      if (!codeOrPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please enter your administrator password.",
        });
      }

      if (emailOrUser && !["admin", "admin@lifelink.com"].includes(emailOrUser)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid administrator email or username.",
        });
      }

      const isValid = verifyAdminAccessCode(codeOrPassword);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid administrator password.",
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
    /**
     * Lists all doctors from the mock directory combined with their
     * provisioning status from the database.
     */
    list: adminProcedure.query(async () => {
      const provisioned = await listSyntheticDoctorCredentialAccounts();
      const provisionedMap = new Map(
        provisioned.map(p => [p.doctorId, { email: p.email, userId: p.userId }])
      );
      return mockDoctorDirectory.map(doc => {
        const info = provisionedMap.get(doc.id);
        return {
          id: doc.id,
          name: doc.name,
          specialty: doc.specialty,
          railLine: doc.railLine,
          station: doc.station,
          workEmail:
            info?.email ??
            `${doc.specialty.toLowerCase().replace(/[^a-z0-9]/g, "")}@lifelink.com`,
          status: info ? "Provisioned" : "Not Provisioned",
          isProvisioned: Boolean(info),
          userId: info?.userId ?? null,
        };
      });
    }),

    /**
     * Provision a doctor account: create credentials (email + password) for a
     * directory doctor and persist them in the database.
     */
    provision: adminProcedure
      .input(
        z.object({
          doctorId: z.string().trim().min(1).max(80),
          email: z.string().trim().email().max(320),
          password: z.string().min(10).max(128),
        })
      )
      .mutation(async ({ input }) => {
        const doctor = getSyntheticDoctor(input.doctorId);
        if (!doctor) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Selected specialist was not found in the directory.",
          });
        }
        const passwordHash = await hashPatientPassword(input.password);
        const created = await createSyntheticDoctorCredential({
          doctor,
          email: input.email.trim().toLowerCase(),
          passwordHash,
        });
        if (!created) {
          // Account exists — update credentials instead
          const result = await refreshSyntheticDoctorCredentialByDoctorId({
            doctorId: doctor.id,
            email: input.email.trim().toLowerCase(),
            passwordHash,
          });
          if (result === "email-conflict") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "This email is already assigned to another doctor account.",
            });
          }
        }
        return {
          success: true,
          doctorId: doctor.id,
          displayName: doctorDisplayName(doctor),
          email: input.email.trim().toLowerCase(),
        };
      }),

    /**
     * Reset a provisioned doctor's password by their email address.
     * Only admin can perform this operation.
     */
    resetPassword: adminProcedure
      .input(
        z.object({
          email: z.string().trim().email().max(320),
          newPassword: z.string().min(10).max(128),
        })
      )
      .mutation(async ({ input }) => {
        const passwordHash = await hashPatientPassword(input.newPassword);
        const updated = await updateSyntheticDoctorPasswordByEmail(
          input.email.trim().toLowerCase(),
          passwordHash
        );
        if (!updated) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No doctor account found with that email address.",
          });
        }
        return { success: true, email: input.email.trim().toLowerCase() };
      }),

    /**
     * Delete a doctor's credentials and user account from the database.
     * The doctor entry in the mock directory is not affected (directory is static).
     */
    delete: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive().optional(),
          userId: z.number().int().positive().optional(),
          doctorId: z.string().optional(),
          email: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return deleteSyntheticDoctorCredential({
          doctorId: input.doctorId,
          email: input.email,
          userId: input.userId ?? input.id,
        });
      }),
  }),
});

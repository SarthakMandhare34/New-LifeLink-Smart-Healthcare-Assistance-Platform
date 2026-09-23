/**
 * ============================================================================
 * SECURITY AND AUTHENTICATION CORE
 * ============================================================================
 *
 * WHY THIS FILE IS SPECIAL:
 * This file manages how users securely log into the application.
 * Healthcare apps are prime targets for hackers. Instead of basic security,
 * we use strict token management, password hashing (scrypt), and Google OAuth.
 * This prevents account takeovers, brute force attacks, and identity theft.
 * Never modify these security rules without a senior security audit.
 */
import { randomBytes, timingSafeEqual } from "node:crypto";                             // Cryptographic utilities for password generation and timing-safe comparisons
import { TRPCError } from "@trpc/server";                                                  // Standard tRPC error throwing utility
import { z } from "zod";                                                                   // Input schema validation library
import {
  createSyntheticDoctorCredential,
  getSyntheticDoctorCredentialByEmail,
  getSyntheticDoctorCredentialByUserId,
  listSyntheticDoctorCredentialAccounts,
  refreshSyntheticDoctorCredentialByDoctorId,
  updateSyntheticDoctorPasswordByEmail,
  updateSyntheticDoctorPasswordByUserId
} from "../db";                                                                            // Database CRUD operations for synthetic clinician records
import { getSessionCookieOptions } from "../_core/cookies";                                // Secure cookie attribute generator
import { ENV } from "../_core/env";                                                        // Central environment configuration
import { authSession } from "./authUtil";                                                  // JWT session token generator and authenticator
import { doctorProcedure, publicProcedure, router } from "../_core/trpc";                  // Typed tRPC procedure and router constructors
import { DOCTOR_COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const";                       // Doctor cookie name and 1-year lifespan constant
import { hashPatientPassword, verifyPatientPassword } from "./nativePatientAuth";          // Cryptographic password hashing and verification
import { doctorDisplayName, doctorIdFromSyntheticOpenId, getSyntheticDoctor, syntheticDoctorOpenId } from "../syntheticDoctor"; // Doctor catalog lookup helpers
import { mockDoctorDirectory } from "../discovery/mockDoctorDirectory";                    // In-system directory of 12 clinical specialists

// Zod schema validating doctor email and password input
const credentialInput = z.object({
  email: z.string().trim().email("Please enter a valid work email (e.g. cardiology@lifelink.com)").max(320), // Validated email
  password: z.string().min(1).max(128),                                                   // Password string between 1 and 128 characters
});

// Zod schema for manual clinician account provisioning (requires administrative provisioning code)
const provisionInput = credentialInput.extend({
  doctorId: z.string().trim().min(1).max(80),                                              // Identifier of the doctor in mock directory
  provisioningCode: z.string().min(1).max(256),                                            // Admin authorization secret
});

const resetInput = credentialInput.extend({ provisioningCode: z.string().min(1).max(256) }); // Schema for administrative clinician password resets
const changePasswordInput = z.object({                                                     // Schema for clinician self-service password changes
  currentPassword: z.string().min(10).max(128),
  newPassword: z.string().min(10).max(128)
});

// Normalizes email addresses to lowercase without whitespace
function normalizedEmail(email: string) {
  return email.trim().toLowerCase();                                                       // Lowercase and trim for consistent DB queries
}

// Generates standardized internal test email for synthetic clinicians
function controlledClinicianEmail(doctor: (typeof mockDoctorDirectory)[number]) {
  const local = `${doctor.railLine}-${doctor.specialty}-${doctor.station}`.replace(/[^a-z0-9]+/gi, ".").replace(/^\.|\.$/g, "").toLowerCase(); // Clean slug
  return `${local}@accounts.lifelink.test`;                                                // Standardized synthetic email
}

/** The existing secret now protects account provisioning; it is never used for doctor sign-in or returned to clients. */
function matchesProvisioningCode(value: string) {
  const expected = ENV.demoDoctorAccessCode.trim();                                        // Fetch expected secret from environment configuration
  const trimmed = (value || "").trim();                                                    // User-submitted provisioning code
  if (expected.length < 16 || trimmed.length !== expected.length) return false;            // Length check to avoid timing leaks
  return timingSafeEqual(Buffer.from(trimmed), Buffer.from(expected));                     // Timing-safe comparison against brute force
}

// Formats doctor record into client-safe session object (omits passwords or internal keys)
function doctorSessionView(openId: string) {
  const doctorId = doctorIdFromSyntheticOpenId(openId);                                    // Extract doctorId from synthetic openId
  const doctor = doctorId ? getSyntheticDoctor(doctorId) : null;                           // Query synthetic doctor directory
  if (!doctor) return null;                                                                // Clinician not found
  return {
    id: doctor.id,                                                                         // Doctor unique identifier
    displayName: doctorDisplayName(doctor),                                                // Formatted name (e.g. "Dr. Sarah Chen, MD")
    specialty: doctor.specialty,                                                           // Clinical medical specialty
    locality: doctor.locality,                                                             // Medical center / clinic locality
    isSynthetic: true as const,                                                            // Flag marking clinician as platform-controlled
  };
}

// Signs JWT token, sets secure HTTP-only doctor cookie, and returns session view
async function establishDoctorSession(
  ctx: { req: Parameters<typeof getSessionCookieOptions>[0]; res: { cookie: (name: string, value: string, options: Record<string, unknown>) => void } },
  openId: string,
) {
  const session = doctorSessionView(openId);                                               // Build client-safe session view
  if (!session) throw new TRPCError({ code: "FORBIDDEN", message: "Doctor session is not valid." }); // Reject if doctor missing
  const token = await authSession.createSessionToken(openId, { name: session.displayName, expiresInMs: ONE_YEAR_MS }); // Sign doctor JWT
  ctx.res.cookie(DOCTOR_COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: ONE_YEAR_MS }); // Write cookie to client response
  return session;                                                                          // Return session data
}

// Router exposing doctor authentication, directory listing, and credential management
export const doctorAuthRouter = router({
  // Public directory query returning all 12 in-system clinical specialists
  directory: publicProcedure.query(() => mockDoctorDirectory.map((doctor) => ({
    id: doctor.id,                                                                         // Specialist identifier
    displayName: doctorDisplayName(doctor),                                                // Clinician full title and name
    specialty: doctor.specialty,                                                           // Medical specialty domain
    locality: doctor.locality,                                                             // Station locality
    railLine: doctor.railLine,                                                             // Regional transit line
    isSynthetic: true as const,                                                            // Controlled account indicator
  }))),

  // Provision individual doctor account with custom email and password
  provision: publicProcedure.input(provisionInput).mutation(async ({ input }) => {
    if (!matchesProvisioningCode(input.provisioningCode)) {                                // Validate admin access code
      throw new TRPCError({ code: "UNAUTHORIZED", message: "The provisioning code is invalid." });
    }
    const doctor = getSyntheticDoctor(input.doctorId);                                     // Retrieve doctor profile
    if (!doctor) throw new TRPCError({ code: "NOT_FOUND", message: "Selected specialist was not found." });
    const passwordHash = await hashPatientPassword(input.password);                         // Hash entered password with scrypt
    const created = await createSyntheticDoctorCredential({                                // Persist doctor credential in MySQL
      doctor,
      email: normalizedEmail(input.email),
      passwordHash,
    });
    if (!created) {                                                                        // If doctor account exists, refresh email/password
      const refreshed = await refreshSyntheticDoctorCredentialByDoctorId({
        doctorId: doctor.id,
        email: normalizedEmail(input.email),
        passwordHash,
      });
      if (refreshed === "email-conflict") {                                                // Email collision check
        throw new TRPCError({ code: "CONFLICT", message: "This email is already assigned." });
      }
    }
    return { doctorId: doctor.id, email: normalizedEmail(input.email), displayName: doctorDisplayName(doctor) }; // Success output
  }),

  // Batch provision all directory doctors with auto-generated secure credentials
  provisionDirectory: publicProcedure
    .input(z.object({ provisioningCode: z.string().min(1).max(256) }))
    .mutation(async ({ input }) => {
      if (!matchesProvisioningCode(input.provisioningCode)) {                              // Admin secret check
        throw new TRPCError({ code: "UNAUTHORIZED", message: "The provisioning code is invalid." });
      }
      const created: Array<{ doctorId: string; displayName: string; email: string; password: string }> = [];
      for (const doctor of mockDoctorDirectory) {                                          // Loop through all 12 directory doctors
        const email = controlledClinicianEmail(doctor);                                    // Standard email format
        const password = `LL-${randomBytes(14).toString("base64url")}`;                     // Strong random temporary password
        const account = await createSyntheticDoctorCredential({ doctor, email, passwordHash: await hashPatientPassword(password) });
        if (account) created.push({ doctorId: doctor.id, displayName: doctorDisplayName(doctor), email, password });
      }
      return { created, skipped: mockDoctorDirectory.length - created.length };            // Return summary of created credentials
    }),

  // Rotate credentials for all doctors in mock directory
  refreshDirectoryCredentials: publicProcedure
    .input(z.object({ provisioningCode: z.string().min(1).max(256) }))
    .mutation(async ({ input }) => {
      if (!matchesProvisioningCode(input.provisioningCode)) {                              // Admin secret validation
        throw new TRPCError({ code: "UNAUTHORIZED", message: "The provisioning code is invalid." });
      }
      const refreshed: Array<{ doctorId: string; displayName: string; email: string; password: string }> = [];
      for (const doctor of mockDoctorDirectory) {                                          // Iterate over all specialists
        const email = controlledClinicianEmail(doctor);                                    // Standard doctor email
        const password = `LL-${randomBytes(14).toString("base64url")}`;                     // Fresh random password
        const passwordHash = await hashPatientPassword(password);                           // Hash with scrypt
        const rotation = await refreshSyntheticDoctorCredentialByDoctorId({ doctorId: doctor.id, email, passwordHash });
        if (rotation === "email-conflict") {
          throw new TRPCError({ code: "CONFLICT", message: "A refreshed email conflicts with another account." });
        }
        if (rotation === "not-found") {                                                    // Auto-create if not previously existing
          const created = await createSyntheticDoctorCredential({ doctor, email, passwordHash });
          if (!created) throw new TRPCError({ code: "CONFLICT", message: "An account could not be refreshed safely." });
        }
        refreshed.push({ doctorId: doctor.id, displayName: doctorDisplayName(doctor), email, password });
      }
      return { refreshed };
    }),

  // Administrative listing of all provisioned doctor accounts
  ownerAccounts: publicProcedure
    .input(z.object({ provisioningCode: z.string().min(1).max(256) }))
    .mutation(async ({ input }) => {
      if (!matchesProvisioningCode(input.provisioningCode)) {                              // Security gate
        throw new TRPCError({ code: "UNAUTHORIZED", message: "The provisioning code is invalid." });
      }
      const accounts = await listSyntheticDoctorCredentialAccounts();                     // Query database for all doctor credentials
      return accounts.flatMap((account) => {
        const doctor = getSyntheticDoctor(account.doctorId);
        return doctor ? [{ doctorId: account.doctorId, displayName: doctorDisplayName(doctor), email: account.email }] : [];
      });
    }),

  // Replace password for a doctor given their email address
  replacePassword: publicProcedure
    .input(z.object({ email: z.string().trim().email().max(320), provisioningCode: z.string().min(1).max(256) }))
    .mutation(async ({ input }) => {
      if (!matchesProvisioningCode(input.provisioningCode)) {                              // Authorization check
        throw new TRPCError({ code: "UNAUTHORIZED", message: "The provisioning code is invalid." });
      }
      const email = normalizedEmail(input.email);                                          // Normalize email
      const password = `LL-${randomBytes(14).toString("base64url")}`;                     // Generate new random password
      const updated = await updateSyntheticDoctorPasswordByEmail(email, await hashPatientPassword(password)); // Save new hash
      if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "No doctor account found with that email." });
      return { email, password };
    }),

  // Clinician sign-in mutation: authenticates doctor credentials
  login: publicProcedure.input(credentialInput).mutation(async ({ ctx, input }) => {
    const record = await getSyntheticDoctorCredentialByEmail(normalizedEmail(input.email));  // Find doctor by normalized email
    if (!record) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or Password" }); // Authentication failure
    }

    const valid = await verifyPatientPassword(input.password, record.credential.passwordHash); // Verify individual doctor password hash
    const doctorId = doctorIdFromSyntheticOpenId(record.user.openId);      // Extract synthetic doctor ID
    if (!valid || record.user.role !== "doctor" || !doctorId || record.credential.doctorId !== doctorId) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or Password" }); // Authentication failure
    }
    return establishDoctorSession(ctx, record.user.openId);                                // Set cookie and return doctor session
  }),

  // Administrative password reset for clinician accounts
  resetPassword: publicProcedure.input(resetInput).mutation(async ({ input }) => {
    if (!matchesProvisioningCode(input.provisioningCode)) {                                // Check authorization code
      throw new TRPCError({ code: "UNAUTHORIZED", message: "The controlled reset code is invalid." });
    }
    const updated = await updateSyntheticDoctorPasswordByEmail(normalizedEmail(input.email), await hashPatientPassword(input.password));
    if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "No doctor account found with that email." });
    return { success: true } as const;
  }),

  // Doctor self-service password change while authenticated
  changePassword: doctorProcedure.input(changePasswordInput).mutation(async ({ ctx, input }) => {
    const credential = await getSyntheticDoctorCredentialByUserId(ctx.user.id);             // Retrieve current doctor credential
    const valid = credential ? await verifyPatientPassword(input.currentPassword, credential.passwordHash) : false; // Check current password
    if (!credential || !valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is invalid." });
    const updated = await updateSyntheticDoctorPasswordByUserId(ctx.user.id, await hashPatientPassword(input.newPassword)); // Update with new hash
    if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Doctor credentials are unavailable." });
    return { success: true } as const;
  }),

  // Doctor logout: clears the HTTP-only clinician session cookie
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);                                // Fetch base cookie options
    const { maxAge: _, ...clearOptions } = cookieOptions as any;                           // Strip maxAge for cookie deletion
    ctx.res.clearCookie(DOCTOR_COOKIE_NAME, clearOptions);                                 // Instruct browser to delete cookie
    return { success: true } as const;
  }),

  // Query returning currently authenticated clinician profile, or null if guest
  me: publicProcedure.query(({ ctx }) => {
    const doctor = ctx.doctorUser || (ctx.user?.role === "doctor" ? ctx.user : null);      // Identify active clinician session
    if (!doctor) return null;                                                              // No active clinician
    return doctorSessionView(doctor.openId);                                               // Return safe doctor profile
  }),
});

/**
 * ============================================================================
 * AUTOMATED TEST SUITE: AVATAR MAGIC-BYTES VALIDATION (backend/profilePhoto.test.ts)
 * ============================================================================
 * 
 * WHAT THIS TEST VERIFIES:
 * Prevents malicious executable uploads (e.g. .exe disguised as .png).
 * 
 * CRITICAL TEST OBJECTIVES:
 * 1. Valid Binary Signatures: Confirms legitimate PNG binary headers (`89 50 4E 47`) pass validation.
 * 2. Spoof Rejection: Rejects mismatched mime-types (e.g. JPEG header labeled as PNG).
 * 3. DoS Prevention: Rejects files exceeding the strict 2 MB payload boundary.
 */
import { describe, expect, it } from "vitest";                                             // Vitest primitives
import { PROFILE_PHOTO_MAX_BYTES, validateProfilePhotoUpload } from "./profilePhoto";     // Image inspection validator

describe("patient profile photo validation", () => {
  // Scenario 1: Authentic image binary passes
  it("accepts a small PNG body that matches its declared type", () => {
    const result = validateProfilePhotoUpload("image/png", Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x01])); // Authentic PNG magic bytes
    expect(result).toEqual({ ok: true, extension: "png" });                                // Passes validation
  });

  // Scenario 2: Rejection of spoofed or oversized files
  it("rejects unsupported, oversized, and mismatched photo uploads before storage", () => {
    expect(validateProfilePhotoUpload("image/gif", Buffer.from([1]))).toMatchObject({ ok: false }); // Rejects non-whitelisted GIF
    expect(validateProfilePhotoUpload("image/jpeg", Buffer.from([0x89, 0x50, 0x4e, 0x47]))).toMatchObject({ ok: false }); // Rejects PNG bytes labeled as JPEG
    expect(validateProfilePhotoUpload("image/webp", Buffer.alloc(PROFILE_PHOTO_MAX_BYTES + 1))).toMatchObject({ ok: false }); // Rejects > 2 MB payload
  });
});

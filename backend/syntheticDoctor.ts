/**
 * ============================================================================
 * LIFELINK BACKEND: SYNTHETIC CLINICIAN IDENTITY SERVICE (backend/syntheticDoctor.ts)
 * ============================================================================
 * 
 * WHAT THIS MODULE DOES:
 * Bridges the in-memory Mumbai Rail Specialist Directory (`mockDoctorDirectory`) with
 * the database user identity system (`users` & `syntheticDoctorCredentials` tables).
 * 
 * CORE RESPONSIBILITIES:
 * 1. OpenID Formatting: Generates consistent identity strings (`synthetic-doctor:<doctor-id>`)
 *    distinguishing clinician accounts from patient accounts.
 * 2. Directory Resolution: Maps database OpenIDs back to active clinician directory records.
 * 3. Standardized Display Titles: Formats institutional titles for UI display (e.g.,
 *    "Controlled Cardiology Specialist — CSMT").
 * 4. Station Mapping: Anchors clinicians to specific suburban railway stations across
 *    Mumbai's Western, Central, and Harbour corridors.
 */
import { getMockDoctorById, type MockDoctorDirectoryEntry } from "./discovery/mockDoctorDirectory"; // Directory lookups and type definitions

const SYNTHETIC_DOCTOR_OPEN_ID_PREFIX = "synthetic-doctor:";                              // Prefix distinguishing doctor OpenIDs from patient OpenIDs

// Retrieves synthetic doctor directory entry matching given doctor ID
export function getSyntheticDoctor(doctorId: string): MockDoctorDirectoryEntry | null {
  return getMockDoctorById(doctorId);                                                      // Query mock doctor catalog
}

// Formats doctor ID into synthetic openId string (e.g. "synthetic-doctor:mock-central-cardiology-csmt")
export function syntheticDoctorOpenId(doctorId: string) {
  return `${SYNTHETIC_DOCTOR_OPEN_ID_PREFIX}${doctorId}`;                                  // Prefix doctor ID
}

// Extracts original doctor ID from synthetic openId string; returns null if prefix missing
export function doctorIdFromSyntheticOpenId(openId: string) {
  if (!openId.startsWith(SYNTHETIC_DOCTOR_OPEN_ID_PREFIX)) return null;                    // Validate prefix
  const doctorId = openId.slice(SYNTHETIC_DOCTOR_OPEN_ID_PREFIX.length);                  // Strip prefix to get raw doctor ID
  return getSyntheticDoctor(doctorId)?.id ?? null;                                         // Verify doctor actually exists in catalog
}

// Generates standardized professional display title for doctor cards and appointments
export function doctorDisplayName(doctor: MockDoctorDirectoryEntry) {
  return `Controlled ${doctor.specialty} Specialist — ${doctor.station}`;                  // Standardized name format
}

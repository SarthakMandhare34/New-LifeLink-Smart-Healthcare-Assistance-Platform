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
// Shared contract definitions ensuring synchronized state across frontend and backend
// --- Cluster: Session & Cookie Identifiers ---
export const COOKIE_NAME = "app_session_id";                     // Name of the secure HTTP cookie storing patient login sessions
export const DOCTOR_COOKIE_NAME = "doctor_session_id";           // Name of the secure HTTP cookie storing clinician workstation sessions
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;           // One full year in milliseconds (used for persistent session duration)
export const AXIOS_TIMEOUT_MS = 30_000;                          // Maximum 30-second network timeout for external API requests
export const UNAUTHED_ERR_MSG = 'Please login (10001)';          // Error message displayed when an unauthenticated user calls a protected route
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)'; // Error message displayed when a non-admin calls admin endpoints

// --- Cluster: OAuth State & CSRF Protection ---
// The `__Host-` prefix forces the cookie to be host-only (Secure, Path=/, no Domain),
// preventing malicious subdomain cookie hijacking attacks during Google login.
export const OAUTH_STATE_COOKIE = "__Host-oauth_state";          // Name of the anti-CSRF state tracking cookie for OAuth

// Carries the redirect destination plus a random CSRF nonce between Google and LifeLink
export type OAuthState = { redirectUri: string; nonce?: string }; // Structure of the OAuth state payload

// Encodes the redirect URI and CSRF nonce into a URL-safe Base64 string
export const encodeOAuthState = (state: OAuthState): string =>
  btoa(JSON.stringify(state));                                   // Converts state object to Base64 string for URL transport

// Decodes and validates the OAuth state string returned by Google callback
export const decodeOAuthState = (state: string): OAuthState => {
  let decoded: string;                                           // Temporary storage for raw decoded text
  try {
    decoded = atob(state);                                       // Decode Base64 string into plain JSON text
  } catch {
    // If attacker provides malformed Base64, return empty redirect to trigger clean 403 rejection
    return { redirectUri: "" };                                  // Reject invalid Base64 safely without throwing
  }
  try {
    const parsed = JSON.parse(decoded);                          // Parse decoded JSON payload
    if (parsed && typeof parsed.redirectUri === "string") return parsed; // Return structured OAuth state
  } catch {
    // Gracefully handle legacy plain string redirect URIs
  }
  return { redirectUri: decoded };                               // Fallback returning plain redirect URI
};

// --- Cluster: The 12 In-System Doctor Specialties ---
// This is LifeLink's single source of truth for clinical departments.
// Every doctor in our directory and every AI triage recommendation belongs to one of these 12 fields.
export const SYSTEM_DOCTOR_SPECIALTIES = [
  "Cardiology",                                                  // Heart & cardiovascular conditions
  "Dermatology",                                                 // Skin, hair, nail, and rash conditions
  "Endocrinology",                                               // Diabetes, thyroid, and male/female hormone disorders
  "Gastroenterology",                                            // Stomach, digestion, liver, and acid reflux conditions
  "General Practice",                                            // Family medicine, colds/flu, and unlisted fields (ENT/Urology)
  "Gynecology",                                                  // Female reproductive health for adult females (18+)
  "Neurology",                                                   // Brain, headaches, nerves, and neurological conditions
  "Ophthalmology",                                               // Vision, eye health, and ophthalmic conditions
  "Orthopedics",                                                 // Bones, joints, spine, and musculoskeletal injuries
  "Pediatrics",                                                  // Comprehensive medical care for all patients under 18
  "Pulmonology",                                                 // Lungs, asthma, chronic cough, and respiratory care
  "Psychiatry",                                                  // Mental health, anxiety, depression, and emotional wellness
] as const;

export type SystemDoctorSpecialty = (typeof SYSTEM_DOCTOR_SPECIALTIES)[number]; // Strict TypeScript union type of the 12 specialties

// --- Cluster: Clinical Appointment Slots & Timezone Handlers ---
export type ClinicSlotSession = "morning" | "evening";

export type ClinicSlotStatus = "AVAILABLE" | "BOOKED" | "PAST" | "UNAVAILABLE";

export interface ClinicSlotDefinition {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  session: ClinicSlotSession;
}

export interface DoctorSlotAvailability extends ClinicSlotDefinition {
  status: ClinicSlotStatus;
  isAvailable: boolean;
}

export const CLINIC_APPOINTMENT_SLOTS: readonly ClinicSlotDefinition[] = [
  // Morning & Afternoon Clinic: 10:00 AM to 15:00 (3:00 PM) in 30-minute intervals
  { id: "10:00", startTime: "10:00", endTime: "10:30", label: "10:00 – 10:30 AM", session: "morning" },
  { id: "10:30", startTime: "10:30", endTime: "11:00", label: "10:30 – 11:00 AM", session: "morning" },
  { id: "11:00", startTime: "11:00", endTime: "11:30", label: "11:00 – 11:30 AM", session: "morning" },
  { id: "11:30", startTime: "11:30", endTime: "12:00", label: "11:30 AM – 12:00 PM", session: "morning" },
  { id: "12:00", startTime: "12:00", endTime: "12:30", label: "12:00 – 12:30 PM", session: "morning" },
  { id: "12:30", startTime: "12:30", endTime: "13:00", label: "12:30 – 1:00 PM", session: "morning" },
  { id: "13:00", startTime: "13:00", endTime: "13:30", label: "1:00 – 1:30 PM", session: "morning" },
  { id: "13:30", startTime: "13:30", endTime: "14:00", label: "1:30 – 2:00 PM", session: "morning" },
  { id: "14:00", startTime: "14:00", endTime: "14:30", label: "2:00 – 2:30 PM", session: "morning" },
  { id: "14:30", startTime: "14:30", endTime: "15:00", label: "2:30 – 3:00 PM", session: "morning" },

  // Evening Clinic: 19:00 (7:00 PM) to 22:00 (10:00 PM) in 30-minute intervals
  { id: "19:00", startTime: "19:00", endTime: "19:30", label: "7:00 – 7:30 PM", session: "evening" },
  { id: "19:30", startTime: "19:30", endTime: "20:00", label: "7:30 – 8:00 PM", session: "evening" },
  { id: "20:00", startTime: "20:00", endTime: "20:30", label: "8:00 – 8:30 PM", session: "evening" },
  { id: "20:30", startTime: "20:30", endTime: "21:00", label: "8:30 – 9:00 PM", session: "evening" },
  { id: "21:00", startTime: "21:00", endTime: "21:30", label: "9:00 – 9:30 PM", session: "evening" },
  { id: "21:30", startTime: "21:30", endTime: "22:00", label: "9:30 – 10:00 PM", session: "evening" },
] as const;

export const STANDARD_SLOTS = CLINIC_APPOINTMENT_SLOTS.map((s) => s.startTime);

/**
 * Returns canonical start of day and end of day in India Standard Time (+05:30) for a given YYYY-MM-DD date
 */
export function getIndiaDayBounds(dateStr: string): { startOfDay: Date; endOfDay: Date } {
  const baseUtc = new Date(`${dateStr}T00:00:00.000Z`).getTime();
  const startOfDay = new Date(baseUtc - 14 * 60 * 60 * 1000);
  const endOfDay = new Date(baseUtc + 38 * 60 * 60 * 1000);
  return { startOfDay, endOfDay };
}

/**
 * Checks if a given slot start time is valid in clinic schedule
 */
export function isValidClinicSlot(slotStartTime: string): boolean {
  return STANDARD_SLOTS.includes(slotStartTime);
}

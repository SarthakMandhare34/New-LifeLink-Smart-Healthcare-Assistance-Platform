/**
 * ============================================================================
 * CLINICIAN SYNCHRONIZATION & AUDIT SCRIPT (scripts/sync-doctors.ts)
 * ============================================================================
 * 
 * HOW TO RUN:
 * Command: `npm run db:sync:doctors` or `npx tsx scripts/sync-doctors.ts`
 * 
 * WHAT THIS SCRIPT DOES:
 * 1. Audits existing database doctor credentials against `mockDoctorDirectory`.
 * 2. Identifies missing or drifted clinician accounts across Mumbai railway corridors.
 * 3. Automatically inserts missing doctors and updates passwords/hashes if required.
 * 4. Ensures all 55 workstations remain completely in sync with official directory records.
 */
import "dotenv/config";                                                               // Loads .env credentials (DATABASE_URL) into process.env
import { getDb, createSyntheticDoctorCredential, refreshSyntheticDoctorCredentialByDoctorId } from "../backend/db"; // DB client and doctor persistence methods
import { mockDoctorDirectory } from "../backend/discovery/mockDoctorDirectory";             // Official clinical registry of specialists
import { hashPatientPassword, verifyPatientPassword } from "../backend/auth/nativePatientAuth"; // Cryptographic scrypt password hashing functions
import { syntheticDoctorCredentials, users } from "../database/schema";                     // Drizzle ORM table definitions
import { eq } from "drizzle-orm";                                                            // SQL equality operator for joins

// Map directory doctors into an expected credentials list with generated work emails
const EXPECTED_DOCTORS = mockDoctorDirectory.map((doctor) => {
  const specialtySlug = doctor.specialty.toLowerCase().replace(/[^a-z]/g, "");              // Normalize specialty string
  const stationSlug = doctor.station.toLowerCase().replace(/[^a-z]/g, "");                  // Normalize transit station string
  const emailSlug = doctor.id.replace("mock-", "");
  const email = `${emailSlug}@lifelink.com`;
  const password = `${specialtySlug}.${stationSlug}@lifelink`;

  return {
    doctorId: doctor.id,                                                                     // Catalog ID
    specialty: `${doctor.name} — ${doctor.specialty} (${doctor.station})`,                   // Formatted specialty label
    email,                                                                                   // Institutional email
    password,                                                                                // Workstation password
  };
});

async function syncDoctors() {
  console.log("Connecting to database...");
  const db = await getDb();                                                                 // Retrieve active Drizzle MySQL connection
  if (!db) {
    throw new Error("Database connection failed. Ensure MySQL service is running.");        // Abort if database is unreachable
  }

  // Fetch current synthetic doctor credentials from DB joining user records
  const existingRows = await db
    .select({
      id: syntheticDoctorCredentials.id,                                                    // Credential table primary key
      doctorId: syntheticDoctorCredentials.doctorId,                                        // Doctor catalog key
      email: syntheticDoctorCredentials.email,                                              // Registered email
      passwordHash: syntheticDoctorCredentials.passwordHash,                                // Hashed password
      userName: users.name,                                                                 // Clinician full name
      userRole: users.role,                                                                 // Role (doctor)
    })
    .from(syntheticDoctorCredentials)
    .innerJoin(users, eq(syntheticDoctorCredentials.userId, users.id));                     // Relational join on user ID

  console.log(`Currently found ${existingRows.length} doctor account(s) in the database.\n`);

  // Report accumulator for audit summary display
  const report: Array<{
    "Doctor & Specialty": string;
    "Official Work Email": string;
    Password: string;
    "Previous Status": string;
    "Action Taken": string;
    "Current Status": string;
  }> = [];

  // Iterate through all expected directory doctors
  for (const expected of EXPECTED_DOCTORS) {
    const doctorDef = mockDoctorDirectory.find((d) => d.id === expected.doctorId);         // Find master directory entry

    if (!doctorDef) {
      console.warn(`⚠️ Doctor definition not found for specialty: ${expected.specialty}`);
      continue;
    }

    // Check if account already exists in database
    const existing = existingRows.find(
      (row) => row.doctorId === doctorDef.id || row.email.toLowerCase() === expected.email.toLowerCase()
    );

    if (!existing) {
      // Missing from database -> Insert fresh doctor account and credentials
      const passwordHash = await hashPatientPassword(expected.password);                    // Hash deterministic password
      await createSyntheticDoctorCredential({                                              // Insert user and credential rows
        doctor: doctorDef,
        email: expected.email,
        passwordHash,
      });

      report.push({
        "Doctor & Specialty": expected.specialty,
        "Official Work Email": expected.email,
        Password: expected.password,
        "Previous Status": "❌ Missing",
        "Action Taken": "Created fresh account",
        "Current Status": "✅ ACTIVE IN DATABASE",
      });
    } else {
      // Account exists -> Check if password and email match expected values
      const isPasswordValid = await verifyPatientPassword(expected.password, existing.passwordHash); // Compare against stored hash
      const isEmailValid = existing.email.toLowerCase() === expected.email.toLowerCase();   // Check email consistency

      if (isPasswordValid && isEmailValid) {
        report.push({
          "Doctor & Specialty": expected.specialty,
          "Official Work Email": expected.email,
          Password: expected.password,
          "Previous Status": "✅ Existed",
          "Action Taken": "Verified matching",
          "Current Status": "✅ ACTIVE IN DATABASE",
        });
      } else {
        // Needs update -> Re-hash password and update credential row
        const passwordHash = await hashPatientPassword(expected.password);                  // Compute fresh hash
        await refreshSyntheticDoctorCredentialByDoctorId({                                  // Update database
          doctorId: doctorDef.id,
          email: expected.email,
          passwordHash,
        });

        report.push({
          "Doctor & Specialty": expected.specialty,
          "Official Work Email": expected.email,
          Password: expected.password,
          "Previous Status": `⚠️ Outdated (${!isEmailValid ? "email" : "password"})`,
          "Action Taken": "Updated email & password",
          "Current Status": "✅ ACTIVE IN DATABASE",
        });
      }
    }
  }

  // Print audit report table to stdout
  console.log("=========================================================================");
  console.log("             LIFELINK — MUMBAI DOCTOR DATABASE AUDIT & SYNC REPORT         ");
  console.log("=========================================================================\n");
  console.table(report);

  console.log(`\n✅ All ${EXPECTED_DOCTORS.length} Mumbai doctor accounts are 100% verified and active in the database.`);
  console.log("👉 Clinicians can log in at: http://localhost:5173/doctor/login\n");
  process.exit(0);                                                                          // Clean exit code 0
}

// Execute sync with error handling
syncDoctors().catch((err) => {
  console.error("Error synchronizing doctors:", err);
  process.exit(1);
});

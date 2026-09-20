/**
 * ============================================================================
 * CLINICIAN SEEDING & WORKSTATION SETUP SCRIPT (scripts/seed-doctors.ts)
 * ============================================================================
 * 
 * HOW TO RUN:
 * Command: `npx tsx scripts/seed-doctors.ts`
 * 
 * WHAT THIS SCRIPT DOES:
 * 1. Connects to the local MySQL database using Drizzle ORM.
 * 2. Cleans out stale records to avoid duplicate or conflicting accounts.
 * 3. Seeds 55 authentic Indian doctor workstations across 12 specialties & General Practice
 *    located along Mumbai's railway corridors (Western, Central, Harbour).
 * 4. Applies a memorable and consistent credential format for all clinicians:
 *    - Email: <id-slug>@lifelink.com (e.g. central-cardiology-csmt@lifelink.com)
 *    - Password: <specialty>.<station>@lifelink (e.g. cardio.csmt@lifelink)
 * 5. Zero Pre-Stored Patients: Maintains 0 patient records so live user
 *    registration remains 100% dynamic and authentic.
 */
import "dotenv/config";                                                               // Loads .env database connection strings
import { getDb, createSyntheticDoctorCredential } from "../backend/db";                   // Drizzle DB connection and credential creation helper
import { mockDoctorDirectory } from "../backend/discovery/mockDoctorDirectory";             // Standard clinical directory of 55 workstations
import { hashPatientPassword } from "../backend/auth/nativePatientAuth";                   // Password hashing function using scrypt

async function resetAndSeedDatabase() {
  if (process.env.NODE_ENV === "production") {                                             // Safety check preventing accidental production wiping
    throw new Error("DANGER: Database reset script (seed-doctors.ts) is strictly disabled in production (NODE_ENV=production).");
  }

  console.log("Connecting to database...");
  const db = await getDb();                                                                // Connect to MySQL
  if (!db) {
    throw new Error("Database connection failed. Make sure DATABASE_URL is set in .env.");
  }

  console.log("Clearing all existing users and associated tables...");
  await db.execute("SET FOREIGN_KEY_CHECKS = 0;");                                         // Temporarily disable foreign key constraints for bulk truncation
  await db.execute("TRUNCATE TABLE patientPrescriptionItems;");                            // Wipe itemized medicines
  await db.execute("TRUNCATE TABLE patientPrescriptions;");                                 // Wipe prescription headers
  await db.execute("TRUNCATE TABLE patientAppointments;");                                  // Wipe booked appointments
  await db.execute("TRUNCATE TABLE patientMedicines;");                                     // Wipe patient medicine cabinet
  await db.execute("TRUNCATE TABLE patientEmergencyContacts;");                             // Wipe emergency contact records
  await db.execute("TRUNCATE TABLE patientProfiles;");                                     // Wipe patient health passports
  await db.execute("TRUNCATE TABLE patientAssessments;");                                   // Wipe Gemini AI triage logs
  await db.execute("TRUNCATE TABLE patientEvents;");                                        // Wipe patient SSE events
  await db.execute("TRUNCATE TABLE doctorEvents;");                                         // Wipe doctor SSE events
  await db.execute("TRUNCATE TABLE patientProviderIdentities;");                            // Wipe Google OAuth accounts
  await db.execute("TRUNCATE TABLE patientCredentials;");                                   // Wipe native patient passwords
  await db.execute("TRUNCATE TABLE syntheticDoctorCredentials;");                           // Wipe clinician login credentials
  await db.execute("TRUNCATE TABLE users;");                                                // Wipe core user accounts
  await db.execute("SET FOREIGN_KEY_CHECKS = 1;");                                         // Re-enable foreign key constraints
  console.log("✅ All existing users and related data deleted successfully.");

  console.log(`\nSeeding ${mockDoctorDirectory.length} Doctor Accounts with authentic names and Mumbai hospital affiliations...`);

  const seededDoctors: { Doctor: string; Specialty: string; Hospital: string; Station: string; Email: string; Password: string }[] = [];

  for (const doctor of mockDoctorDirectory) {
    const specialtySlug = doctor.specialty.toLowerCase().replace(/[^a-z]/g, "");            // Clean specialty string
    const stationSlug = doctor.station.toLowerCase().replace(/[^a-z]/g, "");                // Clean railway station string
    
    // Clean, unique email and password per workstation
    const emailSlug = doctor.id.replace("mock-", "");
    const doctorEmail = `${emailSlug}@lifelink.com`;
    const doctorPassword = `${specialtySlug}.${stationSlug}@lifelink`;
    const doctorPasswordHash = await hashPatientPassword(doctorPassword);                   // Cryptographically hash password using scrypt

    try {
      // Persist synthetic doctor identity and credential into MySQL
      await createSyntheticDoctorCredential({
        doctor,                                                                             // Doctor profile
        email: doctorEmail,                                                                 // Work email
        passwordHash: doctorPasswordHash,                                                   // Salted password hash
      });

      seededDoctors.push({
        Doctor: doctor.name,
        Specialty: doctor.specialty,
        Hospital: doctor.hospital,
        Station: `${doctor.station} (${doctor.railLine})`,
        Email: doctorEmail,
        Password: doctorPassword,
      });
    } catch (e: any) {
      console.error(`Failed to seed ${doctor.name}: ${e.message}`);
    }
  }

  // Print formatted report table to terminal
  console.log("\n====================================================================================================");
  console.log(`   LIFELINK — MUMBAI DOCTORS SEEDING REPORT (${seededDoctors.length} DOCTORS SEEDED)`);
  console.log("====================================================================================================\n");

  console.log("--- MUMBAI DOCTOR ACCOUNTS ---");
  console.table(seededDoctors);
  console.log("👉 Login at http://localhost:5173/doctor/login using any Doctor Email and Password above.");
  console.log("ℹ️ Zero pre-stored patient accounts. Patients register dynamically in real time.\n");

  process.exit(0);                                                                          // Clean exit code 0
}

// Top-level script execution with failure handling
resetAndSeedDatabase().catch((err) => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});

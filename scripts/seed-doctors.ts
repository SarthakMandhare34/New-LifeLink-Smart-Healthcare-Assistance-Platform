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
 * 3. Seeds exactly 24 verified doctor workstations across 12 specialties 
 *    (Cardiology, Neurology, Orthopedics, Pediatrics, etc.) located along
 *    Mumbai's railway corridors (Western, Central, Harbour).
 * 4. Applies a memorable and consistent credential format for all clinicians:
 *    - Email: <specialty>@lifelink.com (e.g. cardiology@lifelink.com)
 *    - Password: <specialty-prefix>@lifelink (e.g. cardio@lifelink)
 * 5. Zero Pre-Stored Patients: Maintains 0 patient records so live user
 *    registration remains 100% dynamic and authentic.
 */
import "dotenv/config";
import { getDb, createSyntheticDoctorCredential } from "../backend/db";
import { mockDoctorDirectory } from "../backend/discovery/mockDoctorDirectory";
import { hashPatientPassword } from "../backend/auth/nativePatientAuth";

async function resetAndSeedDatabase() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("DANGER: Database reset script (seed-doctors.ts) is strictly disabled in production (NODE_ENV=production).");
  }

  console.log("Connecting to database...");
  const db = await getDb();
  if (!db) {
    throw new Error("Database connection failed. Make sure DATABASE_URL is set in .env.");
  }

  console.log("Clearing all existing users and associated tables...");
  await db.execute("SET FOREIGN_KEY_CHECKS = 0;");
  await db.execute("TRUNCATE TABLE patientPrescriptionItems;");
  await db.execute("TRUNCATE TABLE patientPrescriptions;");
  await db.execute("TRUNCATE TABLE patientAppointments;");
  await db.execute("TRUNCATE TABLE patientMedicines;");
  await db.execute("TRUNCATE TABLE patientEmergencyContacts;");
  await db.execute("TRUNCATE TABLE patientProfiles;");
  await db.execute("TRUNCATE TABLE patientAssessments;");
  await db.execute("TRUNCATE TABLE patientEvents;");
  await db.execute("TRUNCATE TABLE doctorEvents;");
  await db.execute("TRUNCATE TABLE patientProviderIdentities;");
  await db.execute("TRUNCATE TABLE patientCredentials;");
  await db.execute("TRUNCATE TABLE syntheticDoctorCredentials;");
  await db.execute("TRUNCATE TABLE users;");
  await db.execute("SET FOREIGN_KEY_CHECKS = 1;");
  console.log("✅ All existing users and related data deleted successfully.");

  // Doctor Accounts with email and password (dynamic real users will register and sign in live)
  console.log("\nSeeding Doctor Accounts with clean emails and unique passwords...");

  const SPECIALTY_PASSWORDS: Record<string, { short: string; password: string }> = {
    cardiology: { short: "cardio", password: "cardio@lifelink" },
    orthopedics: { short: "ortho", password: "ortho@lifelink" },
    dermatology: { short: "derma", password: "derma@lifelink" },
    neurology: { short: "neuro", password: "neuro@lifelink" },
    pediatrics: { short: "pedia", password: "pedia@lifelink" },
    generalpractice: { short: "general", password: "general@lifelink" },
    ophthalmology: { short: "ophthal", password: "ophthal@lifelink" },
    gastroenterology: { short: "gastro", password: "gastro@lifelink" },
    psychiatry: { short: "psych", password: "psych@lifelink" },
    endocrinology: { short: "endo", password: "endo@lifelink" },
    pulmonology: { short: "pulmo", password: "pulmo@lifelink" },
    gynecology: { short: "gynae", password: "gynae@lifelink" },
  };

  const seededDoctors: { Specialty: string; Email: string; Password: string; "Alias Login": string }[] = [];

  for (const doctor of mockDoctorDirectory) {
    const specialtySlug = doctor.specialty.toLowerCase().replace(/[^a-z]/g, "");
    const stationSlug = doctor.station.toLowerCase().replace(/[^a-z]/g, "");
    const isSharedSpecialty = mockDoctorDirectory.filter((d) => d.specialty === doctor.specialty).length > 1;
    const doctorEmail = isSharedSpecialty
      ? `${specialtySlug}.${stationSlug}@lifelink.com`
      : `${specialtySlug}@lifelink.com`;
    const config = SPECIALTY_PASSWORDS[specialtySlug] || { short: specialtySlug, password: `${specialtySlug}@lifelink` };
    const doctorPassword = isSharedSpecialty ? `${config.short}.${stationSlug}@lifelink` : config.password;
    const doctorPasswordHash = await hashPatientPassword(doctorPassword);

    try {
      await createSyntheticDoctorCredential({
        doctor,
        email: doctorEmail,
        passwordHash: doctorPasswordHash,
      });

      seededDoctors.push({
        Specialty: `${doctor.specialty} (${doctor.station})`,
        Email: doctorEmail,
        Password: doctorPassword,
        "Alias Login": `${config.short}@lifelink.com or ${doctorEmail}`,
      });
    } catch (e: any) {
      console.error(`Failed to seed ${doctor.name}: ${e.message}`);
    }
  }

  console.log("\n========================================================");
  console.log("   LIFELINK — DOCTORS SEEDING REPORT (ZERO PRE-STORED PATIENTS)");
  console.log("========================================================\n");

  console.log("--- DOCTOR ACCOUNTS (Email & Password) ---");
  console.table(seededDoctors);
  console.log("👉 Login at http://localhost:5173/doctor/login using any Doctor Email and Password above.");
  console.log("ℹ️ Zero pre-stored patient accounts. Patients register dynamically in real time.\n");

  process.exit(0);
}

resetAndSeedDatabase().catch((err) => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});

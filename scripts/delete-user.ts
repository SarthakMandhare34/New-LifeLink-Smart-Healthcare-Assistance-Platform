/**
 * ============================================================================
 * SPECIFIC USER & HISTORY DELETION SCRIPT (scripts/delete-user.ts)
 * ============================================================================
 * 
 * HOW TO RUN:
 * Command: `npx tsx scripts/delete-user.ts sarthakmandhare34@gmail.com`
 * 
 * WHAT THIS SCRIPT DOES:
 * 1. Safely finds the user in TiDB / MySQL by email address.
 * 2. Deletes all associated health records, prescriptions, appointments,
 *    medicines, emergency contacts, profile, AI assessments, real-time events,
 *    OAuth identities, and credentials.
 * 3. Deletes the core user account record.
 * 4. Prints a summary of deleted records.
 */
import "dotenv/config";
import { getDb } from "../backend/db";
import {
  users,
  patientCredentials,
  patientProviderIdentities,
  patientProfiles,
  patientEmergencyContacts,
  patientMedicines,
  patientAppointments,
  patientPrescriptions,
  patientPrescriptionItems,
  patientAssessments,
  patientEvents,
  doctorEvents,
  syntheticDoctorCredentials,
} from "../database/schema";
import { eq, inArray, or } from "drizzle-orm";

async function deleteUserByEmail() {
  const targetEmail = (process.argv[2] || "sarthakmandhare34@gmail.com").trim().toLowerCase();

  console.log(`\n🔍 Searching for user: "${targetEmail}" in TiDB / MySQL database...`);
  const db = await getDb();
  if (!db) {
    console.error("❌ Failed to connect to database. Please check your DATABASE_URL in .env");
    process.exit(1);
  }

  // 1. Locate user in users table (case-insensitive)
  const allUsers = await db.select().from(users);
  const matchedUsers = allUsers.filter(
    (u) => u.email && u.email.trim().toLowerCase() === targetEmail
  );

  const allCreds = await db.select().from(patientCredentials);
  const matchedCreds = allCreds.filter(
    (c) => c.email && c.email.trim().toLowerCase() === targetEmail
  );

  const allOAuth = await db.select().from(patientProviderIdentities);
  const matchedOAuth = allOAuth.filter(
    (o) => o.email && o.email.trim().toLowerCase() === targetEmail
  );

  const userIds = new Set<number>();
  matchedUsers.forEach((u) => userIds.add(u.id));
  matchedCreds.forEach((c) => userIds.add(c.userId));
  matchedOAuth.forEach((o) => userIds.add(o.userId));

  if (userIds.size === 0 && matchedUsers.length === 0) {
    console.log(`ℹ️ No exact user found with email "${targetEmail}".`);
    
    // Check for partial match on "sarthak"
    const partialUsers = allUsers.filter((u) => u.email && u.email.toLowerCase().includes("sarthak"));
    const partialCreds = allCreds.filter((c) => c.email && c.email.toLowerCase().includes("sarthak"));
    const partialOAuth = allOAuth.filter((o) => o.email && o.email.toLowerCase().includes("sarthak"));
    
    if (partialUsers.length > 0 || partialCreds.length > 0 || partialOAuth.length > 0) {
      console.log(`\n🔎 Found partial matches for 'sarthak':`);
      partialUsers.forEach((u) => console.log(`   - users table: ID ${u.id}, email: "${u.email}"`));
      partialCreds.forEach((c) => console.log(`   - patientCredentials: userId ${c.userId}, email: "${c.email}"`));
      partialOAuth.forEach((o) => console.log(`   - patientProviderIdentities: userId ${o.userId}, email: "${o.email}"`));
    } else {
      console.log(`🔎 No accounts with 'sarthak' found anywhere in users, credentials, or OAuth identities.`);
    }

    if (allUsers.length > 0) {
      console.log(`\n📋 Current registered users in database (${allUsers.length}):`);
      allUsers.forEach((u) => console.log(`   - ID ${u.id}: "${u.email}" (${u.name || "No name"}, role: ${u.role})`));
    } else {
      console.log(`📋 The database currently has 0 registered users.`);
    }
    process.exit(0);
  }

  const idList = Array.from(userIds);
  console.log(`👤 Found user account(s) with ID(s): [${idList.join(", ")}]`);

  for (const uid of idList) {
    console.log(`\n🗑️  Deleting medical history and records for User ID: ${uid}...`);

    // 1. Prescriptions & items
    const userPrescriptions = await db
      .select({ id: patientPrescriptions.id })
      .from(patientPrescriptions)
      .where(eq(patientPrescriptions.userId, uid));

    const rxIds = userPrescriptions.map((rx) => rx.id);
    if (rxIds.length > 0) {
      await db.delete(patientPrescriptionItems).where(inArray(patientPrescriptionItems.prescriptionId, rxIds));
      console.log(`   ✓ Deleted prescription items for ${rxIds.length} prescription(s)`);
    }

    await db.delete(patientPrescriptions).where(eq(patientPrescriptions.userId, uid));
    console.log(`   ✓ Deleted prescriptions`);

    // 2. Appointments
    await db.delete(patientAppointments).where(eq(patientAppointments.userId, uid));
    console.log(`   ✓ Deleted appointments`);

    // 3. Medicines
    await db.delete(patientMedicines).where(eq(patientMedicines.userId, uid));
    console.log(`   ✓ Deleted medicines`);

    // 4. Emergency contacts
    await db.delete(patientEmergencyContacts).where(eq(patientEmergencyContacts.userId, uid));
    console.log(`   ✓ Deleted emergency contacts`);

    // 5. Patient profile & health passport
    await db.delete(patientProfiles).where(eq(patientProfiles.userId, uid));
    console.log(`   ✓ Deleted patient profile & health passport`);

    // 6. AI symptom assessments
    await db.delete(patientAssessments).where(eq(patientAssessments.userId, uid));
    console.log(`   ✓ Deleted AI assessments`);

    // 7. Real-time events
    await db.delete(patientEvents).where(eq(patientEvents.userId, uid));
    await db.delete(doctorEvents).where(eq(doctorEvents.patientUserId, uid));
    console.log(`   ✓ Deleted patient & doctor real-time events`);

    // 8. Credentials & OAuth identities
    await db.delete(patientProviderIdentities).where(or(eq(patientProviderIdentities.userId, uid), eq(patientProviderIdentities.email, targetEmail)));
    await db.delete(patientCredentials).where(or(eq(patientCredentials.userId, uid), eq(patientCredentials.email, targetEmail)));
    await db.delete(syntheticDoctorCredentials).where(or(eq(syntheticDoctorCredentials.userId, uid), eq(syntheticDoctorCredentials.email, targetEmail)));
    console.log(`   ✓ Deleted credentials & OAuth identities`);

    // 9. Core user row
    await db.delete(users).where(or(eq(users.id, uid), eq(users.email, targetEmail)));
    console.log(`   ✓ Deleted core user account row`);
  }

  // Final cleanup if any orphaned row matches email directly
  await db.delete(users).where(eq(users.email, targetEmail));
  await db.delete(patientCredentials).where(eq(patientCredentials.email, targetEmail));
  await db.delete(patientProviderIdentities).where(eq(patientProviderIdentities.email, targetEmail));

  console.log(`\n✅ Successfully removed user "${targetEmail}" and all related history from TiDB!\n`);
  process.exit(0);
}

deleteUserByEmail().catch((err) => {
  console.error("❌ Error deleting user:", err);
  process.exit(1);
});

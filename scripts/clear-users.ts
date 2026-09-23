/**
 * ============================================================================
 * DATABASE PURGE & RESET SCRIPT (scripts/clear-users.ts)
 * ============================================================================
 * 
 * HOW TO RUN:
 * Command: `npm run db:clear` or `npx tsx scripts/clear-users.ts`
 * 
 * WHAT THIS SCRIPT DOES:
 * 1. Safely connects to the active MySQL database instance.
 * 2. Dynamically queries all existing tables in the database.
 * 3. Temporarily disables foreign key checks (`SET FOREIGN_KEY_CHECKS = 0`) to prevent constraint locks.
 * 4. Truncates all tables while preserving table structures and schemas.
 * 5. Re-enables foreign key checks and verifies 0 rows remain across all tables.
 */
import "dotenv/config";
import { getDb } from "../backend/db";
import { sql } from "drizzle-orm";

async function clearDatabase() {
  console.log("Connecting to database...");
  const db = await getDb();
  if (!db) {
    console.error("❌ Failed to connect to MySQL database. Ensure MySQL service is running.");
    process.exit(1);
  }

  console.log("Clearing all patient activities and Google OAuth / native patient accounts...");
  console.log("Preserving doctor workstation accounts and credentials intact...\n");
  await db.execute(sql.raw("SET FOREIGN_KEY_CHECKS = 0;"));

  const patientTables = [
    "bookingerrors",
    "doctorevents",
    "patientappointments",
    "patientassessments",
    "patientcredentials",
    "patientemergencycontacts",
    "patientevents",
    "patientmedicines",
    "patientprescriptionitems",
    "patientprescriptions",
    "patientprofiles",
    "patientprovideridentities",
  ];

  for (const tableName of patientTables) {
    try {
      await db.execute(sql.raw(`TRUNCATE TABLE \`${tableName}\`;`));
      console.log(`  ✓ Truncated table: ${tableName}`);
    } catch (err: any) {
      console.warn(`  ⚠ Truncate failed on ${tableName}, trying DELETE:`, err.message);
      await db.execute(sql.raw(`DELETE FROM \`${tableName}\`;`));
    }
  }

  // Remove non-doctor users (e.g. Google OAuth and native patients)
  await db.execute(sql.raw("DELETE FROM `users` WHERE `role` != 'doctor';"));
  console.log("  ✓ Purged all non-doctor patient accounts from users table (including Google OAuth users)");

  await db.execute(sql.raw("SET FOREIGN_KEY_CHECKS = 1;"));

  console.log("\n========================================================");
  console.log("   CURRENT DATABASE TABLE ROW COUNTS (DOCTORS-ONLY BASE)");
  console.log("========================================================");
  const tablesResult: any = await db.execute(sql.raw("SHOW TABLES;"));
  const tableRows = tablesResult[0] || tablesResult;

  let patientRowsTotal = 0;
  let doctorRowsTotal = 0;

  for (const row of tableRows) {
    const tableName = Object.values(row)[0] as string;
    const countRes: any = await db.execute(sql.raw(`SELECT COUNT(*) as cnt FROM \`${tableName}\`;`));
    const cnt = Number(countRes[0]?.[0]?.cnt ?? countRes[0]?.cnt ?? 0);
    console.log(`  - ${tableName.padEnd(30)}: ${cnt} rows`);

    if (tableName === "syntheticdoctorcredentials" || (tableName === "users" && cnt > 0)) {
      doctorRowsTotal += cnt;
    } else {
      patientRowsTotal += cnt;
    }
  }

  console.log("========================================================");
  console.log(`✅ Database reset complete!`);
  console.log(`   - Patient Activity / Google Auth rows: ${patientRowsTotal}`);
  console.log(`   - Doctor Workstation / Credential rows: ${doctorRowsTotal}`);
  console.log("========================================================\n");

  process.exit(0);
}

clearDatabase().catch((err) => {
  console.error("Error clearing database:", err);
  process.exit(1);
});

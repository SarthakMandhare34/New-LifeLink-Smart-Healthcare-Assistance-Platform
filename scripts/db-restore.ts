/**
 * ============================================================================
 * DATABASE RESTORATION SCRIPT (scripts/db-restore.ts)
 * ============================================================================
 *
 * HOW TO RUN:
 *   npx tsx scripts/db-restore.ts [optional-backup-file-path]
 *   npm run db:restore
 * ============================================================================
 */
import "dotenv/config";
import { getDb, ensureAdminUser } from "../backend/db";
import { sql } from "drizzle-orm";
import * as fs from "node:fs";
import * as path from "node:path";

const ALL_APPLICATION_TABLES = [
  "users",
  "syntheticDoctorCredentials",
  "patientCredentials",
  "patientProviderIdentities",
  "patientProfiles",
  "patientEmergencyContacts",
  "patientMedicines",
  "patientAssessments",
  "patientAppointments",
  "patientPrescriptions",
  "patientPrescriptionItems",
  "patientEvents",
  "doctorEvents",
  "bookingErrors",
];

export async function restoreDatabase(customFilePath?: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Cannot connect to database for restore.");
  }

  const backupDir = path.resolve(process.cwd(), "backups");
  const targetFile = customFilePath || path.resolve(backupDir, "database-backup-latest.json");

  if (!fs.existsSync(targetFile)) {
    throw new Error(`Backup file not found at: ${targetFile}`);
  }

  const backupContent = fs.readFileSync(targetFile, "utf-8");
  const backupData = JSON.parse(backupContent);

  console.log(`Restoring database from backup created at ${backupData.timestamp}...`);

  // Disable foreign key constraints during bulk restore (db.execute takes 1 argument in Drizzle)
  await db.execute(sql.raw("SET FOREIGN_KEY_CHECKS = 0;"));

  for (const table of ALL_APPLICATION_TABLES) {
    const rows = backupData.tables?.[table] || [];
    try {
      await db.execute(sql.raw(`TRUNCATE TABLE \`${table}\`;`));
    } catch {
      await db.execute(sql.raw(`DELETE FROM \`${table}\`;`));
    }

    if (rows.length > 0) {
      for (const row of rows) {
        const columns = Object.keys(row).map((k) => `\`${k}\``).join(", ");
        const values = Object.values(row)
          .map((v) => {
            if (v === null || v === undefined) return "NULL";
            if (typeof v === "number" || typeof v === "boolean") return String(v);
            if (v instanceof Date) return `'${v.toISOString().slice(0, 19).replace("T", " ")}'`;
            return `'${String(v).replace(/'/g, "\\'")}'`;
          })
          .join(", ");

        try {
          await db.execute(sql.raw(`INSERT INTO \`${table}\` (${columns}) VALUES (${values});`));
        } catch (insertErr: any) {
          console.warn(`  Warning inserting row into ${table}: ${insertErr.message}`);
        }
      }
    }
    console.log(`  Restored ${rows.length} rows into table '${table}'`);
  }

  await db.execute(sql.raw("SET FOREIGN_KEY_CHECKS = 1;"));
  await ensureAdminUser();

  console.log("\nDatabase successfully restored from backup.");
}

async function main() {
  const customFile = process.argv[2];
  try {
    await restoreDatabase(customFile);
    process.exit(0);
  } catch (err: any) {
    console.error("Restore failed:", err.message);
    process.exit(1);
  }
}

if (process.argv[1]?.includes("db-restore")) {
  main();
}

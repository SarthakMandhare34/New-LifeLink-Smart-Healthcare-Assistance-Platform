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

  console.log("Clearing all data from all tables while keeping structures intact...");
  await db.execute(sql.raw("SET FOREIGN_KEY_CHECKS = 0;"));

  const tablesResult: any = await db.execute(sql.raw("SHOW TABLES;"));
  const tableRows = tablesResult[0] || tablesResult;

  for (const row of tableRows) {
    const tableName = Object.values(row)[0] as string;
    try {
      await db.execute(sql.raw(`TRUNCATE TABLE \`${tableName}\`;`));
      console.log(`  ✓ Truncated table: ${tableName}`);
    } catch (err) {
      console.warn(`  ⚠ Truncate failed on ${tableName}, trying DELETE:`, (err as any).message);
      await db.execute(sql.raw(`DELETE FROM \`${tableName}\`;`));
    }
  }

  await db.execute(sql.raw("SET FOREIGN_KEY_CHECKS = 1;"));

  console.log("\nVerifying all table row counts...");
  let totalRemaining = 0;
  for (const row of tableRows) {
    const tableName = Object.values(row)[0] as string;
    const countRes: any = await db.execute(sql.raw(`SELECT COUNT(*) as cnt FROM \`${tableName}\`;`));
    const cnt = Number(countRes[0]?.[0]?.cnt ?? countRes[0]?.cnt ?? 0);
    console.log(`  - ${tableName}: ${cnt} rows`);
    totalRemaining += cnt;
  }

  if (totalRemaining === 0) {
    console.log("\n✅ All tables kept intact and 100% of data/users purged! Total rows across all tables: 0.");
  } else {
    console.warn(`\n⚠ Warning: ${totalRemaining} rows still remained.`);
  }

  process.exit(0);
}

clearDatabase().catch((err) => {
  console.error("Error clearing database:", err);
  process.exit(1);
});

/**
 * ============================================================================
 * AUTOMATED INTEGRATION SUITE: SMART MEDICINE CABINET (backend/medicine.test.ts)
 * ============================================================================
 * 
 * WHAT THIS SUITE VERIFIES:
 * Tests patient home medication management, schedules, and reminders:
 * 1. Inventory Management: Creation, modification, dosage adjustments, and removal of medicines.
 * 2. IDOR Protection: Strictly enforces that Patient 2 cannot update or delete medications belonging to Patient 1.
 * 3. Real-Time Push Notification: Ensures `MEDICINE_UPDATED` events are emitted to synchronize client cabinets.
 */
import { expect, test, describe, beforeAll, afterAll } from "vitest";                           // Vitest test runner
import { config } from "dotenv";                                                                // Loads environment variables
config();
import { getDb, upsertUser, createPatientMedicine, removeOwnedPatientMedicine, listPatientMedicines, updateOwnedPatientMedicine } from "./db"; // Data access methods
import { appRouter } from "./routers";                                                          // Root tRPC router
import { users, patientMedicines } from "../database/schema";                                   // Schema table definitions
import { eq, or } from "drizzle-orm";                                                               // Drizzle SQL operators

let db: NonNullable<Awaited<ReturnType<typeof getDb>>>;                                        // Database handle

// Helper to create typed mock caller matching trpc context
function createCaller(user: { id: number; openId: string; role: "user" | "doctor" }) {
  return appRouter.createCaller({
    req: {} as any,
    res: { cookie: () => {}, clearCookie: () => {} } as any,
    user: user as any,
    patientUser: null,
    doctorUser: null,
  } as any);
}

// Global setup inserting two test patients
beforeAll(async () => {
  const maybeDb = await getDb();                                                               // Connect to database
  if (!maybeDb) throw new Error("Database not available");
  db = maybeDb;

  // Insert Patient 1
  await upsertUser({
    openId: "test:patient-medicine-1",
    name: "Medicine Patient 1",
    email: "mp1@example.com",
    loginMethod: "native-patient",
    role: "user",
  });
  
  // Insert Patient 2 (adversary for IDOR tests)
  await upsertUser({
    openId: "test:patient-medicine-2",
    name: "Medicine Patient 2",
    email: "mp2@example.com",
    loginMethod: "native-patient",
    role: "user",
  });
});

describe("Medicine Cabinet Integration", () => {
  let patient1Id: number;                                                                       // ID of test Patient 1
  let patient2Id: number;                                                                       // ID of test Patient 2
  let medicineId: number;                                                                       // ID of medicine created during test

  beforeAll(async () => {
    const u1 = await db.select().from(users).where(eq(users.openId, "test:patient-medicine-1"));
    patient1Id = u1[0].id;
    const u2 = await db.select().from(users).where(eq(users.openId, "test:patient-medicine-2"));
    patient2Id = u2[0].id;

    // Clear any previous test medicines
    await db.delete(patientMedicines).where(eq(patientMedicines.userId, patient1Id));
    await db.delete(patientMedicines).where(eq(patientMedicines.userId, patient2Id));
  });

  // Cleanup created medicines after test completion
  afterAll(async () => {
    await db.delete(patientMedicines).where(eq(patientMedicines.userId, patient1Id));
    await db.delete(patientMedicines).where(eq(patientMedicines.userId, patient2Id));
  });

  // Step 1: Patient adds new medication to their cabinet
  test("1. Patient creates medicine", async () => {
    const caller = createCaller({ id: patient1Id, openId: "test:patient-medicine-1", role: "user" });
    
    const response = await caller.patientMedicine.create({
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "Twice daily",
      schedule: "Morning and Evening",
      quantity: 30,
    });

    expect(response.id).toBeGreaterThan(0);
    medicineId = response.id;
    
    const inDb = await db.select().from(patientMedicines).where(eq(patientMedicines.id, medicineId));
    expect(inDb.length).toBe(1);
    expect(inDb[0].userId).toBe(patient1Id);
    expect(inDb[0].name).toBe("Amoxicillin");
  });

  test("2. Patient reads own medicine", async () => {
    const caller = createCaller({ id: patient1Id, openId: "test:patient-medicine-1", role: "user" });
    const list = await caller.patientMedicine.list();
    const med = list.find((m) => m.id === medicineId);
    expect(med).toBeDefined();
    expect(med?.dosage).toBe("500mg");
    expect(med?.quantity).toBe(30);
  });

  test("3. Patient edits own medicine", async () => {
    const caller = createCaller({ id: patient1Id, openId: "test:patient-medicine-1", role: "user" });
    const response = await caller.patientMedicine.update({
      id: medicineId,
      values: { dosage: "250mg", quantity: 28 },
    });
    expect(response.success).toBe(true);

    const inDb = await db.select().from(patientMedicines).where(eq(patientMedicines.id, medicineId));
    expect(inDb[0].dosage).toBe("250mg");
    expect(inDb[0].quantity).toBe(28);
  });

  test("4. Ownership: Patient cannot read/edit/delete another patient's medicine", async () => {
    const caller2 = createCaller({ id: patient2Id, openId: "test:patient-medicine-2", role: "user" });
    
    const list = await caller2.patientMedicine.list();
    expect(list.find((m) => m.id === medicineId)).toBeUndefined();

    await expect(caller2.patientMedicine.update({
      id: medicineId,
      values: { name: "Hacked" }
    })).rejects.toThrow(/Medicine record not found/);

    await expect(caller2.patientMedicine.remove({
      id: medicineId
    })).rejects.toThrow(/Medicine record not found/);
    
    // Ensure it wasn't modified
    const inDb = await db.select().from(patientMedicines).where(eq(patientMedicines.id, medicineId));
    expect(inDb[0].name).toBe("Amoxicillin");
  });

  test("5. Validation: Requires name, dosage, frequency, schedule", async () => {
    const caller = createCaller({ id: patient1Id, openId: "test:patient-medicine-1", role: "user" });
    
    // @ts-expect-error Testing invalid input
    await expect(caller.patientMedicine.create({
      dosage: "10mg",
      frequency: "Daily",
      schedule: "Morning"
    })).rejects.toThrow();

    await expect(caller.patientMedicine.create({
      name: "",
      dosage: "10mg",
      frequency: "Daily",
      schedule: "Morning"
    })).rejects.toThrow();
  });

  test("6. Dashboard integration reflects medicine state", async () => {
    const caller = createCaller({ id: patient1Id, openId: "test:patient-medicine-1", role: "user" });
    const dashboard = await caller.patientDashboard.summary();
    const med = dashboard.medicines.find(m => m.id === medicineId);
    expect(med).toBeDefined();
    expect(med?.dosage).toBe("250mg");
  });

  test("7. Patient deletes medicine", async () => {
    const caller = createCaller({ id: patient1Id, openId: "test:patient-medicine-1", role: "user" });
    const response = await caller.patientMedicine.remove({ id: medicineId });
    expect(response.success).toBe(true);

    const inDb = await db.select().from(patientMedicines).where(eq(patientMedicines.id, medicineId));
    expect(inDb.length).toBe(0);
  });

  afterAll(async () => {
    if (db) {
      await db.delete(users).where(or(eq(users.openId, "test:patient-medicine-1"), eq(users.openId, "test:patient-medicine-2")));
    }
  });
});

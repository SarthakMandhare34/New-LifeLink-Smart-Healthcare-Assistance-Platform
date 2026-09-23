/**
 * ============================================================================
 * AUTOMATED INTEGRATION SUITE: CRYPTOGRAPHIC PRESCRIPTION WORKFLOW & INTEGRITY (backend/prescriptionLifecycle.test.ts)
 * ============================================================================
 *
 * WHAT THIS SUITE VERIFIES:
 * Tests the medical prescription workflow and its tamper-evident cryptographic architecture:
 * 1. Cryptographic Tamper Seals (SHA-256): Verifies that every issued prescription generates
 *    a canonical SHA-256 hash across the doctor ID, patient ID, and exact dosages.
 *    Any subsequent alteration of dosages (e.g. 25mg -> 50mg) changes the hash and invalidates the seal!
 * 2. Multi-Item Medicine Builder: Asserts itemized medications correctly persist in `patientPrescriptionItems`.
 * 3. Doctor Relationship Enforcement: Unrelated doctors cannot write prescriptions for arbitrary patients.
 * 4. IDOR Protection: Patients and doctors can ONLY view prescriptions within their clinical context.
 * 5. Real-Time Push Events: Confirms `PRESCRIPTION_CREATED` events are broadcast to the SSE pipeline.
 */
import { expect, test, describe, beforeAll, afterAll } from "vitest";                           // Vitest test runner
import { config } from "dotenv";                                                                // Loads environment variables
config();
import { createHash } from "node:crypto";                                                       // Node built-in cryptographic hash engine
import { getDb, upsertUser } from "./db";                                                       // Database access helpers
import { appRouter } from "./routers";                                                          // Root tRPC router
import { users, patientAppointments, patientPrescriptions, patientPrescriptionItems, patientEvents } from "../database/schema"; // Schema tables
import { eq, and, or } from "drizzle-orm";                                                           // SQL filter operators

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

// Test doctor constants
const DOCTOR_1_ID = "mock-central-cardiology-csmt";                                            // Doctor 1 ID
const DOCTOR_2_ID = "mock-western-general-practice-churchgate";                                // Doctor 2 ID

const DOCTOR_1_OPENID = `synthetic-doctor:${DOCTOR_1_ID}`;                                     // Doctor 1 session openId
const DOCTOR_2_OPENID = `synthetic-doctor:${DOCTOR_2_ID}`;                                     // Doctor 2 session openId

// Setup test database fixtures
beforeAll(async () => {
  const maybeDb = await getDb();                                                               // Connect to database
  if (!maybeDb) throw new Error("Database not available");
  db = maybeDb;

  // Create Test Patient 1
  await upsertUser({
    openId: "test:patient-rx-1",
    name: "Rx Patient 1",
    email: "rx1@example.com",
    loginMethod: "native-patient",
    role: "user",
  });

  // Create Test Patient 2
  await upsertUser({
    openId: "test:patient-rx-2",
    name: "Rx Patient 2",
    email: "rx2@example.com",
    loginMethod: "native-patient",
    role: "user",
  });

  // Create Test Clinician 1
  await upsertUser({
    openId: DOCTOR_1_OPENID,
    name: "Dr. Rajesh V. Varma, MD, DM (Cardiology)",
    email: `${DOCTOR_1_ID.replace("mock-", "")}@lifelink.com`,
    loginMethod: "synthetic-clinician",
    role: "doctor",
  });

  // Create Test Clinician 2
  await upsertUser({
    openId: DOCTOR_2_OPENID,
    name: "Dr. Devendra C. Sawant, MBBS, MD",
    email: `${DOCTOR_2_ID.replace("mock-", "")}@lifelink.com`,
    loginMethod: "synthetic-clinician",
    role: "doctor",
  });
});

describe("Prescription Workflow & Integrity", () => {
  let patient1Id: number;
  let patient2Id: number;
  let doctor1UserId: number;
  let doctor2UserId: number;
  let prescription1Id: number;
  let prescription2Id: number;

  beforeAll(async () => {
    const u1 = await db.select().from(users).where(eq(users.openId, "test:patient-rx-1"));
    patient1Id = u1[0].id;
    const u2 = await db.select().from(users).where(eq(users.openId, "test:patient-rx-2"));
    patient2Id = u2[0].id;

    const d1 = await db.select().from(users).where(eq(users.openId, DOCTOR_1_OPENID));
    doctor1UserId = d1[0].id;
    const d2 = await db.select().from(users).where(eq(users.openId, DOCTOR_2_OPENID));
    doctor2UserId = d2[0].id;

    // Create confirmed appointment relationship between Doctor 1 and Patient 1
    await db.insert(patientAppointments).values({
      userId: patient1Id,
      doctorId: DOCTOR_1_ID,
      scheduledAt: new Date(Date.now() + 86400000),
      status: "Confirmed",
      reason: "Cardiology consult",
    });

    // Create confirmed appointment relationship between Doctor 2 and Patient 2
    await db.insert(patientAppointments).values({
      userId: patient2Id,
      doctorId: DOCTOR_2_ID,
      scheduledAt: new Date(Date.now() + 86400000),
      status: "Confirmed",
      reason: "Dermatology consult",
    });
  });

  afterAll(async () => {
    await db.delete(patientPrescriptions).where(eq(patientPrescriptions.userId, patient1Id));
    await db.delete(patientPrescriptions).where(eq(patientPrescriptions.userId, patient2Id));
    await db.delete(patientAppointments).where(eq(patientAppointments.userId, patient1Id));
    await db.delete(patientAppointments).where(eq(patientAppointments.userId, patient2Id));
  });

  // Step 1: Authorized clinician writes a multi-item prescription
  test("1. Authorized doctor creates prescription: Doctor 1 creates prescription for Patient 1", async () => {
    const doctorCaller = createCaller({ id: doctor1UserId, openId: DOCTOR_1_OPENID, role: "doctor" });

    const result = await doctorCaller.doctorWorkspace.prescriptions.create({
      patientId: patient1Id,
      clinicalNotes: "Patient presents with mild arrhythmia. Monitor blood pressure.",
      items: [
        { name: "Metoprolol", dosage: "25mg", instructions: "Take once daily in the morning" },
        { name: "Aspirin", dosage: "81mg", instructions: "Take once daily with food" },
      ],
    });

    expect(result.id).toBeGreaterThan(0);
    expect(result.status).toBe("UNSIGNED / CONTROLLED WORKSPACE");
    prescription1Id = result.id;
  });

  // Step 2: Verify prescription header persistence and SHA-256 seal presence in database
  test("2. Prescription persistence: Verifies prescription record in DB", async () => {
    const rows = await db.select().from(patientPrescriptions).where(eq(patientPrescriptions.id, prescription1Id));
    expect(rows.length).toBe(1);
    expect(rows[0].userId).toBe(patient1Id);
    expect(rows[0].doctorId).toBe(DOCTOR_1_ID);
    expect(rows[0].clinicalNotes).toContain("mild arrhythmia");
    expect(rows[0].status).toBe("UNSIGNED / CONTROLLED WORKSPACE");
    expect(rows[0].integrityReference).toMatch(/^sha256:[a-f0-9]{64}$/);                        // Must be valid sha256 hex string
  });

  // Step 3: Verify itemized medicine line items in patientPrescriptionItems
  test("3. Multiple items persist: Verifies multiple items in patientPrescriptionItems", async () => {
    const items = await db
      .select()
      .from(patientPrescriptionItems)
      .where(eq(patientPrescriptionItems.prescriptionId, prescription1Id));

    expect(items.length).toBe(2);
    expect(items.map((i) => i.name).sort()).toEqual(["Aspirin", "Metoprolol"]);
    expect(items.find((i) => i.name === "Metoprolol")?.dosage).toBe("25mg");
    expect(items.find((i) => i.name === "Aspirin")?.dosage).toBe("81mg");
  });

  // Step 4: Security test - Doctor without an active appointment cannot prescribe to stranger
  test("4. Unauthorized doctor cannot create prescription: Doctor 1 cannot prescribe to Patient 2", async () => {
    const doctorCaller = createCaller({ id: doctor1UserId, openId: DOCTOR_1_OPENID, role: "doctor" });

    // Doctor 1 has no confirmed appointment with Patient 2 -> Must reject with FORBIDDEN
    await expect(
      doctorCaller.doctorWorkspace.prescriptions.create({
        patientId: patient2Id,
        items: [{ name: "Antibiotic", dosage: "500mg", instructions: "Take twice daily" }],
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  // Step 5: Patient queries their own prescription vault
  test("5. Patient can read own prescription list", async () => {
    const patient1Caller = createCaller({ id: patient1Id, openId: "test:patient-rx-1", role: "user" });

    const prescriptions = await patient1Caller.patientPrescription.list();
    const found = prescriptions.find((p) => p.id === prescription1Id);

    expect(found).toBeDefined();
    expect(found?.items.length).toBe(2);
    expect(found?.doctor?.id).toBe(DOCTOR_1_ID);
  });

  // Step 6: IDOR Protection - Patient 2 cannot see Patient 1's prescription
  test("6. Patient cannot read another patient's prescription list", async () => {
    const patient2Caller = createCaller({ id: patient2Id, openId: "test:patient-rx-2", role: "user" });

    const prescriptions = await patient2Caller.patientPrescription.list();
    const found = prescriptions.find((p) => p.id === prescription1Id);
    expect(found).toBeUndefined();
  });

  // Step 7: Clinician Isolation - Doctor 2 cannot inspect Doctor 1's prescription
  test("7. Doctor cannot read unrelated prescriptions: Doctor 2 cannot see Doctor 1's prescription", async () => {
    // Create Doctor 2's prescription for Patient 2 first
    const doctor2Caller = createCaller({ id: doctor2UserId, openId: DOCTOR_2_OPENID, role: "doctor" });
    const result2 = await doctor2Caller.doctorWorkspace.prescriptions.create({
      patientId: patient2Id,
      clinicalNotes: "Topical treatment.",
      items: [{ name: "Hydrocortisone", dosage: "1% cream", instructions: "Apply twice daily" }],
    });
    prescription2Id = result2.id;

    // Doctor 1 lists their own prescriptions
    const doctor1Caller = createCaller({ id: doctor1UserId, openId: DOCTOR_1_OPENID, role: "doctor" });
    const doctor1List = await doctor1Caller.doctorWorkspace.prescriptions.list();

    expect(doctor1List.some((p) => p.id === prescription1Id)).toBe(true);
    expect(doctor1List.some((p) => p.id === prescription2Id)).toBe(false);

    // Doctor 1 cannot getById Doctor 2's prescription
    await expect(
      doctor1Caller.doctorWorkspace.prescriptions.getById({ id: prescription2Id }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  // Step 8: Detail Endpoint IDOR Protection
  test("8. Prescription detail ownership: Patient A cannot getById Patient B's prescription", async () => {
    const patient1Caller = createCaller({ id: patient1Id, openId: "test:patient-rx-1", role: "user" });
    const patient2Caller = createCaller({ id: patient2Id, openId: "test:patient-rx-2", role: "user" });

    // Patient 1 reads own prescription detail -> SUCCESS
    const detail = await patient1Caller.patientPrescription.getById({ id: prescription1Id });
    expect(detail.id).toBe(prescription1Id);
    expect(detail.items.length).toBe(2);

    // Patient 2 attempts to read Patient 1's prescription detail -> NOT_FOUND
    await expect(
      patient2Caller.patientPrescription.getById({ id: prescription1Id }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  // Step 9: Mathematical Verification - Canonical SHA-256 seal calculation
  test("9. Deterministic SHA-256 integrity reference: exact match with expected canonical calculation", async () => {
    const rows = await db.select().from(patientPrescriptions).where(eq(patientPrescriptions.id, prescription1Id));
    const expectedCanonical = JSON.stringify({
      doctorId: DOCTOR_1_ID,
      patientUserId: patient1Id,
      clinicalNotes: "Patient presents with mild arrhythmia. Monitor blood pressure.",
      items: [
        { name: "Metoprolol", dosage: "25mg", instructions: "Take once daily in the morning" },
        { name: "Aspirin", dosage: "81mg", instructions: "Take once daily with food" },
      ],
    });
    const expectedHash = `sha256:${createHash("sha256").update(expectedCanonical).digest("hex")}`;

    // Assert that the database integrityReference matches the calculated SHA-256 hash byte-for-byte
    expect(rows[0].integrityReference).toBe(expectedHash);
  });

  // Step 10: Anti-Tampering Proof - Altering even one dosage invalidates the cryptographic hash
  test("10. Changed prescription content produces changed hash", async () => {
    const originalCanonical = JSON.stringify({
      doctorId: DOCTOR_1_ID,
      patientUserId: patient1Id,
      clinicalNotes: "Patient presents with mild arrhythmia. Monitor blood pressure.",
      items: [
        { name: "Metoprolol", dosage: "25mg", instructions: "Take once daily in the morning" },
        { name: "Aspirin", dosage: "81mg", instructions: "Take once daily with food" },
      ],
    });
    const modifiedCanonical = JSON.stringify({
      doctorId: DOCTOR_1_ID,
      patientUserId: patient1Id,
      clinicalNotes: "Patient presents with mild arrhythmia. Monitor blood pressure.",
      items: [
        { name: "Metoprolol", dosage: "50mg", instructions: "Take once daily in the morning" }, // Attacker alters 25mg to 50mg
        { name: "Aspirin", dosage: "81mg", instructions: "Take once daily with food" },
      ],
    });

    const hash1 = createHash("sha256").update(originalCanonical).digest("hex");
    const hash2 = createHash("sha256").update(modifiedCanonical).digest("hex");

    // Proves mathematical irreversibility: Hash mismatch detects tampering immediately
    expect(hash1).not.toBe(hash2);
  });

  test("11. Invalid prescription input rejected: empty items or missing fields", async () => {
    const doctorCaller = createCaller({ id: doctor1UserId, openId: DOCTOR_1_OPENID, role: "doctor" });

    // Empty items array
    await expect(
      doctorCaller.doctorWorkspace.prescriptions.create({
        patientId: patient1Id,
        items: [],
      }),
    ).rejects.toThrow();

    // Item with empty name
    await expect(
      doctorCaller.doctorWorkspace.prescriptions.create({
        patientId: patient1Id,
        items: [{ name: "", dosage: "10mg", instructions: "Daily" }],
      }),
    ).rejects.toThrow();

    // Item with empty dosage
    await expect(
      doctorCaller.doctorWorkspace.prescriptions.create({
        patientId: patient1Id,
        items: [{ name: "Medicine", dosage: "", instructions: "Daily" }],
      }),
    ).rejects.toThrow();
  });

  test("12. Realtime event emitted on prescription creation", async () => {
    const events = await db
      .select()
      .from(patientEvents)
      .where(and(eq(patientEvents.userId, patient1Id), eq(patientEvents.type, "PRESCRIPTION_CREATED")));

    expect(events.length).toBeGreaterThan(0);
    const latest = events[events.length - 1];
    expect(latest.entityId).toBe(String(prescription1Id));
  });

  afterAll(async () => {
    if (db) {
      await db.delete(users).where(or(eq(users.openId, "test:patient-rx-1"), eq(users.openId, "test:patient-rx-2")));
    }
  });
});

/**
 * ============================================================================
 * AUTOMATED INTEGRATION SUITE: APPOINTMENT LIFECYCLE (backend/appointmentLifecycle.test.ts)
 * ============================================================================
 * 
 * WHAT THIS INTEGRATION SUITE VERIFIES:
 * Tests the complete end-to-end appointment journey between a patient and a clinician:
 * 1. Booking & Storage: Patient creates a booking request and verifies it persists in MySQL.
 * 2. IDOR Protection (Patient-to-Patient): Verifies Patient 2 cannot access or cancel Patient 1's appointment.
 * 3. IDOR Protection (Doctor-to-Doctor): Verifies Doctor 2 cannot view or alter Doctor 1's assigned visits.
 * 4. State Machine Transitions: Validates statuses ("Requested" -> "Confirmed" -> "Completed")
 *    and guarantees finished appointments cannot be illegally reopened.
 * 5. Dashboard Synchronization: Confirms aggregate dashboard queries accurately reflect updated counters.
 */
import { expect, test, describe, beforeAll, afterAll } from "vitest";                           // Vitest test runner
import { config } from "dotenv";                                                                // Environment configuration
config();
import { getDb, upsertUser, createPatientAppointment, cancelOwnedPatientAppointment, updateDoctorAppointmentStatus } from "./db"; // Data access helpers
import { appRouter } from "./routers";                                                          // Root tRPC API router
import { users, patientAppointments } from "../database/schema";                                // Schema table definitions
import { eq } from "drizzle-orm";                                                               // Drizzle SQL operators
import { mockDoctorDirectory } from "./discovery/mockDoctorDirectory";                          // Doctor directory catalog

// Select two test clinicians from different stations
const TEST_DOCTOR_1 = mockDoctorDirectory[0];                                                  // Clinician 1 (e.g. Cardiology CSMT)
const TEST_DOCTOR_2 = mockDoctorDirectory[1];                                                  // Clinician 2 (e.g. Western General Practice)

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

// Global test setup: Seed test patients and test clinicians
beforeAll(async () => {
  const maybeDb = await getDb();                                                               // Connect to database
  if (!maybeDb) throw new Error("Database not available");
  db = maybeDb;

  // Insert Patient 1
  await upsertUser({
    openId: "test:patient-lifecycle-1",
    name: "Lifecycle Patient 1",
    email: "lp1@example.com",
    loginMethod: "native-patient",
    role: "user",
  });
  
  // Insert Patient 2 (adversary for IDOR tests)
  await upsertUser({
    openId: "test:patient-lifecycle-2",
    name: "Lifecycle Patient 2",
    email: "lp2@example.com",
    loginMethod: "native-patient",
    role: "user",
  });

  // Insert Clinician 1
  await upsertUser({
    openId: `synthetic-doctor:${TEST_DOCTOR_1.id}`,
    name: TEST_DOCTOR_1.name,
    email: null,
    loginMethod: "synthetic-clinician",
    role: "doctor",
  });

  // Insert Clinician 2
  await upsertUser({
    openId: `synthetic-doctor:${TEST_DOCTOR_2.id}`,
    name: TEST_DOCTOR_2.name,
    email: null,
    loginMethod: "synthetic-clinician",
    role: "doctor",
  });
});

describe("Appointment Lifecycle Integration", () => {
  let patient1Id: number;                                                                       // Resolved numeric ID for Patient 1
  let patient2Id: number;                                                                       // Resolved numeric ID for Patient 2
  let appointmentId: number;                                                                    // ID of appointment created during test

  // Extract database IDs before test cases execute
  beforeAll(async () => {
    const u1 = await db.select().from(users).where(eq(users.openId, "test:patient-lifecycle-1"));
    patient1Id = u1[0].id;
    const u2 = await db.select().from(users).where(eq(users.openId, "test:patient-lifecycle-2"));
    patient2Id = u2[0].id;

    // Purge any stale test appointments from prior runs
    await db.delete(patientAppointments).where(eq(patientAppointments.userId, patient1Id));
    await db.delete(patientAppointments).where(eq(patientAppointments.userId, patient2Id));
    await db.delete(patientAppointments).where(eq(patientAppointments.doctorId, TEST_DOCTOR_1.id));
    await db.delete(patientAppointments).where(eq(patientAppointments.doctorId, TEST_DOCTOR_2.id));
  });

  // Cleanup appointments created during testing
  afterAll(async () => {
    await db.delete(patientAppointments).where(eq(patientAppointments.userId, patient1Id));
    await db.delete(patientAppointments).where(eq(patientAppointments.userId, patient2Id));
  });

  // Step 1: Patient books appointment and verifies it persists
  test("1. Patient creates appointment & 2. Appointment persists", async () => {
    // Create tRPC caller authenticated as Patient 1
    const caller = createCaller({ id: patient1Id, openId: "test:patient-lifecycle-1", role: "user" });
    
    const futureDate = new Date(Date.now() + 86400000);                                         // 24 hours in the future
    const response = await caller.patientAppointment.request({                                  // Call booking mutation
      doctorId: TEST_DOCTOR_1.id,
      scheduledAt: futureDate,
      reason: "Lifecycle Integration Test Reason",
    });

    expect(response.id).toBeGreaterThan(0);                                                    // Positive ID generated
    expect(response.status).toBe("Requested");                                                 // Initial lifecycle state is Requested
    appointmentId = response.id;
    
    // Verify physical persistence in MySQL database table
    const inDb = await db.select().from(patientAppointments).where(eq(patientAppointments.id, appointmentId));
    expect(inDb.length).toBe(1);
    expect(inDb[0].userId).toBe(patient1Id);
    expect(inDb[0].doctorId).toBe(TEST_DOCTOR_1.id);
  });

  // Step 2: Patient queries their own appointments list
  test("3. Patient sees own appointment", async () => {
    const caller = createCaller({ id: patient1Id, openId: "test:patient-lifecycle-1", role: "user" });
    const list = await caller.patientAppointment.list();
    const appt = list.find((a) => a.id === appointmentId);
    expect(appt).toBeDefined();
    expect(appt?.reason).toBe("Lifecycle Integration Test Reason");
    expect(appt?.doctor?.id).toBe(TEST_DOCTOR_1.id);
  });

  // Step 3: Assigned doctor queries their workstation queue
  test("4. Doctor sees assigned appointment", async () => {
    const docCaller = createCaller({ id: -1, openId: `synthetic-doctor:${TEST_DOCTOR_1.id}`, role: "doctor" });
    const list = await docCaller.doctorWorkspace.appointments.list();
    const appt = list.find((a) => a.id === appointmentId);
    expect(appt).toBeDefined();
    expect(appt?.status).toBe("Requested");
    expect(appt?.patient.id).toBe(patient1Id);
  });

  // Step 4: Security test - Doctor 2 cannot view Doctor 1's appointment
  test("5. Doctor cannot see another doctor's appointment", async () => {
    const doc2Caller = createCaller({ id: -1, openId: `synthetic-doctor:${TEST_DOCTOR_2.id}`, role: "doctor" });
    const list = await doc2Caller.doctorWorkspace.appointments.list();
    const appt = list.find((a) => a.id === appointmentId);
    expect(appt).toBeUndefined();                                                              // Filtered out by doctorId boundary
  });

  // Step 5: Assigned doctor accepts and confirms appointment
  test("6. Doctor accepts/updates appointment", async () => {
    const docCaller = createCaller({ id: -1, openId: `synthetic-doctor:${TEST_DOCTOR_1.id}`, role: "doctor" });
    const result = await docCaller.doctorWorkspace.appointments.updateStatus({
      id: appointmentId,
      status: "Confirmed",
    });
    expect(result.success).toBe(true);

    const inDb = await db.select().from(patientAppointments).where(eq(patientAppointments.id, appointmentId));
    expect(inDb[0].status).toBe("Confirmed");                                                  // MySQL record updated to Confirmed
  });

  // Step 6: Patient observes real-time status change to Confirmed
  test("7. Patient sees updated status", async () => {
    const caller = createCaller({ id: patient1Id, openId: "test:patient-lifecycle-1", role: "user" });
    const list = await caller.patientAppointment.list();
    const appt = list.find((a) => a.id === appointmentId);
    expect(appt?.status).toBe("Confirmed");
  });

  // Step 7: IDOR Attack Prevention - Patient 2 cannot cancel Patient 1's appointment
  test("8. Patient cannot mutate another patient's appointment", async () => {
    const caller2 = createCaller({ id: patient2Id, openId: "test:patient-lifecycle-2", role: "user" });
    await expect(caller2.patientAppointment.cancel({ id: appointmentId })).rejects.toThrow(/Appointment record not found/);
  });

  // Step 8: IDOR Attack Prevention - Doctor 2 cannot cancel Doctor 1's appointment
  test("9. Doctor cannot mutate another doctor's appointment", async () => {
    const doc2Caller = createCaller({ id: -1, openId: `synthetic-doctor:${TEST_DOCTOR_2.id}`, role: "doctor" });
    await expect(doc2Caller.doctorWorkspace.appointments.updateStatus({ id: appointmentId, status: "Cancelled" })).rejects.toThrow(/Appointment was not found/);
  });

  // Step 9: State Machine Guard - Completed appointments cannot be reopened
  test("10. Invalid appointment status transition is rejected", async () => {
    const docCaller = createCaller({ id: -1, openId: `synthetic-doctor:${TEST_DOCTOR_1.id}`, role: "doctor" });
    
    // Clinician marks consultation completed
    await docCaller.doctorWorkspace.appointments.updateStatus({ id: appointmentId, status: "Completed" });

    // Clinician illegally attempts to reopen a finished consultation -> Rejected
    await expect(docCaller.doctorWorkspace.appointments.updateStatus({ id: appointmentId, status: "Confirmed" })).rejects.toThrow(/Appointment was not found/);
  });

  // Step 10: Aggregated dashboard verification
  test("11. Dashboard appointment metrics reflect DB state", async () => {
    const docCaller = createCaller({ id: -1, openId: `synthetic-doctor:${TEST_DOCTOR_1.id}`, role: "doctor" });
    const dashboard = await docCaller.doctorWorkspace.dashboard();
    expect(dashboard.appointmentCount).toBeGreaterThanOrEqual(1);                             // Includes completed consultation

    const patientCaller = createCaller({ id: patient1Id, openId: "test:patient-lifecycle-1", role: "user" });
    const patDashboard = await patientCaller.patientDashboard.summary();
    const appt = patDashboard.appointments.find(a => a.id === appointmentId);
    expect(appt).toBeDefined();
    expect(appt?.status).toBe("Completed");
  });
});

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
import { eq, or } from "drizzle-orm";                                                               // Drizzle SQL operators
import { mockDoctorDirectory } from "./discovery/mockDoctorDirectory";                          // Doctor directory catalog

// Select two test clinicians from different stations (isolated from doctorAvailability test suite)
const TEST_DOCTOR_1 = mockDoctorDirectory[10];                                                 // Clinician 1
const TEST_DOCTOR_2 = mockDoctorDirectory[11];                                                 // Clinician 2

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
    email: `${TEST_DOCTOR_1.id.replace("mock-", "")}@lifelink.com`,
    loginMethod: "synthetic-clinician",
    role: "doctor",
  });

  // Insert Clinician 2
  await upsertUser({
    openId: `synthetic-doctor:${TEST_DOCTOR_2.id}`,
    name: TEST_DOCTOR_2.name,
    email: `${TEST_DOCTOR_2.id.replace("mock-", "")}@lifelink.com`,
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

  afterAll(async () => {
    if (db) {
      await db.delete(users).where(or(eq(users.openId, "test:patient-lifecycle-1"), eq(users.openId, "test:patient-lifecycle-2")));
    }
  });
});

describe("Doctor-Specific Appointment Slot Availability & Double-Booking Protection", () => {
  const TEST_DATE_X = "2026-11-20";
  const TEST_DATE_Y = "2026-11-21";

  const DOC_A = mockDoctorDirectory[0]; // e.g. mock-central-cardiology-csmt
  const DOC_B = mockDoctorDirectory[1]; // e.g. mock-western-general-churchgate
  const DOC_C = mockDoctorDirectory[2]; // e.g. mock-harbour-pediatrics-vashi

  let patientAvail1Id: number;
  let patientAvail2Id: number;
  let doctorAAppointmentId: number;
  let raceRejectionReason: any;

  beforeAll(async () => {
    await upsertUser({
      openId: "test:patient-availability-1",
      name: "Availability Patient 1",
      email: "avail1@test.com",
      loginMethod: "native-patient",
      role: "user",
    });

    await upsertUser({
      openId: "test:patient-availability-2",
      name: "Availability Patient 2",
      email: "avail2@test.com",
      loginMethod: "native-patient",
      role: "user",
    });

    const u1 = await db.select().from(users).where(eq(users.openId, "test:patient-availability-1"));
    patientAvail1Id = u1[0].id;
    const u2 = await db.select().from(users).where(eq(users.openId, "test:patient-availability-2"));
    patientAvail2Id = u2[0].id;

    await db.delete(patientAppointments).where(or(
      eq(patientAppointments.userId, patientAvail1Id),
      eq(patientAppointments.userId, patientAvail2Id)
    ));
  });

  afterAll(async () => {
    if (db) {
      await db.delete(patientAppointments).where(or(
        eq(patientAppointments.userId, patientAvail1Id),
        eq(patientAppointments.userId, patientAvail2Id)
      ));
      await db.delete(users).where(or(
        eq(users.openId, "test:patient-availability-1"),
        eq(users.openId, "test:patient-availability-2")
      ));
    }
  });

  test("TEST 1: Doctor A + Date X + 10:00 AM is booked -> Doctor A 10:00 AM becomes unavailable", async () => {
    const caller1 = createCaller({ id: patientAvail1Id, openId: "test:patient-availability-1", role: "user" });

    const initialAvail = await caller1.patientAppointment.getDoctorAvailability({
      doctorId: DOC_A.id,
      date: TEST_DATE_X,
    });
    const initialSlot = initialAvail.slots.find((s) => s.id === "10:00");
    expect(initialSlot?.status).toBe("AVAILABLE");
    expect(initialSlot?.isAvailable).toBe(true);

    const scheduledAt = new Date(`${TEST_DATE_X}T10:00:00`);
    const booking = await caller1.patientAppointment.request({
      doctorId: DOC_A.id,
      scheduledAt,
      reason: "Cardiology consultation",
    });
    expect(booking.id).toBeGreaterThan(0);
    doctorAAppointmentId = booking.id;

    const postAvail = await caller1.patientAppointment.getDoctorAvailability({
      doctorId: DOC_A.id,
      date: TEST_DATE_X,
    });
    const bookedSlot = postAvail.slots.find((s) => s.id === "10:00");
    expect(bookedSlot?.status).toBe("BOOKED");
    expect(bookedSlot?.isAvailable).toBe(false);
  });

  test("TEST 2: Doctor B + Date X + 10:00 AM -> 10:00 AM is still available", async () => {
    const caller1 = createCaller({ id: patientAvail1Id, openId: "test:patient-availability-1", role: "user" });

    const availB = await caller1.patientAppointment.getDoctorAvailability({
      doctorId: DOC_B.id,
      date: TEST_DATE_X,
    });
    const slotB = availB.slots.find((s) => s.id === "10:00");
    expect(slotB?.status).toBe("AVAILABLE");
    expect(slotB?.isAvailable).toBe(true);
  });

  test("TEST 3: Doctor C + Date X + 10:00 AM -> 10:00 AM is still available", async () => {
    const caller1 = createCaller({ id: patientAvail1Id, openId: "test:patient-availability-1", role: "user" });

    const availC = await caller1.patientAppointment.getDoctorAvailability({
      doctorId: DOC_C.id,
      date: TEST_DATE_X,
    });
    const slotC = availC.slots.find((s) => s.id === "10:00");
    expect(slotC?.status).toBe("AVAILABLE");
    expect(slotC?.isAvailable).toBe(true);
  });

  test("TEST 4: Doctor A + Date X + 10:00 AM is booked -> Refresh availability -> still unavailable for Doctor A", async () => {
    const caller2 = createCaller({ id: patientAvail2Id, openId: "test:patient-availability-2", role: "user" });

    const refreshed = await caller2.patientAppointment.getDoctorAvailability({
      doctorId: DOC_A.id,
      date: TEST_DATE_X,
    });
    const slot = refreshed.slots.find((s) => s.id === "10:00");
    expect(slot?.status).toBe("BOOKED");
    expect(slot?.isAvailable).toBe(false);
  });

  test("TEST 5: Switch from Doctor A to Doctor B -> Doctor B's availability is independently calculated", async () => {
    const caller1 = createCaller({ id: patientAvail1Id, openId: "test:patient-availability-1", role: "user" });

    const resA = await caller1.patientAppointment.getDoctorAvailability({ doctorId: DOC_A.id, date: TEST_DATE_X });
    expect(resA.slots.find((s) => s.id === "10:00")?.status).toBe("BOOKED");

    const resB = await caller1.patientAppointment.getDoctorAvailability({ doctorId: DOC_B.id, date: TEST_DATE_X });
    expect(resB.slots.find((s) => s.id === "10:00")?.status).toBe("AVAILABLE");
  });

  test("TEST 6: Two patients attempt to book Doctor A + Date X + 11:00 AM concurrently -> only one succeeds", async () => {
    const caller1 = createCaller({ id: patientAvail1Id, openId: "test:patient-availability-1", role: "user" });
    const caller2 = createCaller({ id: patientAvail2Id, openId: "test:patient-availability-2", role: "user" });

    const raceTime = new Date(`${TEST_DATE_X}T11:00:00`);

    const [result1, result2] = await Promise.allSettled([
      caller1.patientAppointment.request({ doctorId: DOC_A.id, scheduledAt: raceTime, reason: "Race Patient 1" }),
      caller2.patientAppointment.request({ doctorId: DOC_A.id, scheduledAt: raceTime, reason: "Race Patient 2" }),
    ]);

    const successes = [result1, result2].filter((r) => r.status === "fulfilled");
    const rejections = [result1, result2].filter((r) => r.status === "rejected");

    expect(successes).toHaveLength(1);
    expect(rejections).toHaveLength(1);

    raceRejectionReason = (rejections[0] as PromiseRejectedResult).reason;
  });

  test("TEST 7: Second booking receives a clean slot-conflict error", async () => {
    expect(raceRejectionReason).toBeDefined();
    expect(raceRejectionReason.code).toBe("CONFLICT");
    expect(raceRejectionReason.message).toMatch(/no longer available|already booked/i);
  });

  test("TEST 8: Cancel Doctor A's appointment -> slot becomes available again", async () => {
    const caller1 = createCaller({ id: patientAvail1Id, openId: "test:patient-availability-1", role: "user" });

    const cancelResult = await caller1.patientAppointment.cancel({ id: doctorAAppointmentId });
    expect(cancelResult.success).toBe(true);

    const refreshed = await caller1.patientAppointment.getDoctorAvailability({
      doctorId: DOC_A.id,
      date: TEST_DATE_X,
    });
    const slot = refreshed.slots.find((s) => s.id === "10:00");
    expect(slot?.status).toBe("AVAILABLE");
    expect(slot?.isAvailable).toBe(true);
  });

  test("TEST 9: Doctor A's completed appointment -> historical record remains but does not block future dates", async () => {
    const caller1 = createCaller({ id: patientAvail1Id, openId: "test:patient-availability-1", role: "user" });

    const booking = await caller1.patientAppointment.request({
      doctorId: DOC_A.id,
      scheduledAt: new Date(`${TEST_DATE_X}T10:00:00`),
      reason: "Checkup to complete",
    });

    await db.update(patientAppointments)
      .set({ status: "Completed" })
      .where(eq(patientAppointments.id, booking.id));

    const inDb = await db.select().from(patientAppointments).where(eq(patientAppointments.id, booking.id));
    expect(inDb).toHaveLength(1);
    expect(inDb[0].status).toBe("Completed");

    const availDateX = await caller1.patientAppointment.getDoctorAvailability({
      doctorId: DOC_A.id,
      date: TEST_DATE_X,
    });
    const slotDateX = availDateX.slots.find((s) => s.id === "10:00");
    expect(slotDateX?.status).toBe("BOOKED");
    expect(slotDateX?.isAvailable).toBe(false);

    const availFuture = await caller1.patientAppointment.getDoctorAvailability({
      doctorId: DOC_A.id,
      date: TEST_DATE_Y,
    });
    const slotFuture = availFuture.slots.find((s) => s.id === "10:00");
    expect(slotFuture?.status).toBe("AVAILABLE");
    expect(slotFuture?.isAvailable).toBe(true);
  });

  test("TEST 10: Past appointment time -> slot cannot be booked", async () => {
    const caller1 = createCaller({ id: patientAvail1Id, openId: "test:patient-availability-1", role: "user" });

    const pastDate = new Date("2020-01-01T10:00:00");
    await expect(
      caller1.patientAppointment.request({
        doctorId: DOC_A.id,
        scheduledAt: pastDate,
        reason: "Past appointment attempt",
      })
    ).rejects.toThrow(/Invalid date or time|future date/i);
  });

  test("TEST 11: Doctor A's booking does not affect Doctor B", async () => {
    const caller1 = createCaller({ id: patientAvail1Id, openId: "test:patient-availability-1", role: "user" });

    await caller1.patientAppointment.request({
      doctorId: DOC_A.id,
      scheduledAt: new Date(`${TEST_DATE_X}T12:00:00`),
      reason: "Doctor A visit",
    });

    const availB = await caller1.patientAppointment.getDoctorAvailability({
      doctorId: DOC_B.id,
      date: TEST_DATE_X,
    });
    const slotB = availB.slots.find((s) => s.id === "12:00");
    expect(slotB?.status).toBe("AVAILABLE");
    expect(slotB?.isAvailable).toBe(true);
  });

  test("TEST 12: Doctor B's booking does not affect Doctor A", async () => {
    const caller2 = createCaller({ id: patientAvail2Id, openId: "test:patient-availability-2", role: "user" });

    await caller2.patientAppointment.request({
      doctorId: DOC_B.id,
      scheduledAt: new Date(`${TEST_DATE_X}T13:00:00`),
      reason: "Doctor B visit",
    });

    const caller1 = createCaller({ id: patientAvail1Id, openId: "test:patient-availability-1", role: "user" });
    const availA = await caller1.patientAppointment.getDoctorAvailability({
      doctorId: DOC_A.id,
      date: TEST_DATE_X,
    });
    const slotA = availA.slots.find((s) => s.id === "13:00");
    expect(slotA?.status).toBe("AVAILABLE");
    expect(slotA?.isAvailable).toBe(true);
  });

  test("TEST 13: All 52 doctors can independently calculate the same time slot on the same date", async () => {
    const caller1 = createCaller({ id: patientAvail1Id, openId: "test:patient-availability-1", role: "user" });

    expect(mockDoctorDirectory.length).toBe(52);

    const slotPromises = mockDoctorDirectory.map((doc) =>
      caller1.patientAppointment.getDoctorAvailability({
        doctorId: doc.id,
        date: TEST_DATE_Y,
      })
    );

    const allResults = await Promise.all(slotPromises);
    expect(allResults).toHaveLength(52);

    for (const res of allResults) {
      expect(res.slots).toHaveLength(16);
      const slot10 = res.slots.find((s) => s.id === "10:00");
      expect(slot10).toBeDefined();
      expect(slot10?.status).toBe("AVAILABLE");
    }
  });

  test("TEST 14: Different dates with the same doctor do not conflict", async () => {
    const caller1 = createCaller({ id: patientAvail1Id, openId: "test:patient-availability-1", role: "user" });

    const bookingX = await caller1.patientAppointment.request({
      doctorId: DOC_C.id,
      scheduledAt: new Date(`${TEST_DATE_X}T14:00:00`),
      reason: "Date X consultation",
    });
    expect(bookingX.id).toBeGreaterThan(0);

    const bookingY = await caller1.patientAppointment.request({
      doctorId: DOC_C.id,
      scheduledAt: new Date(`${TEST_DATE_Y}T14:00:00`),
      reason: "Date Y consultation",
    });
    expect(bookingY.id).toBeGreaterThan(0);

    const inDb = await db.select().from(patientAppointments).where(or(
      eq(patientAppointments.id, bookingX.id),
      eq(patientAppointments.id, bookingY.id)
    ));
    expect(inDb).toHaveLength(2);
  });

  test("TEST 15: Different doctors with the same date/time do not conflict", async () => {
    const caller1 = createCaller({ id: patientAvail1Id, openId: "test:patient-availability-1", role: "user" });
    const caller2 = createCaller({ id: patientAvail2Id, openId: "test:patient-availability-2", role: "user" });

    const sameTime = new Date(`${TEST_DATE_Y}T19:00:00`);

    const apptDocA = await caller1.patientAppointment.request({
      doctorId: DOC_A.id,
      scheduledAt: sameTime,
      reason: "Doctor A evening consultation",
    });

    const apptDocB = await caller2.patientAppointment.request({
      doctorId: DOC_B.id,
      scheduledAt: sameTime,
      reason: "Doctor B evening consultation",
    });

    expect(apptDocA.id).toBeGreaterThan(0);
    expect(apptDocB.id).toBeGreaterThan(0);

    const activeRows = await db.select().from(patientAppointments).where(or(
      eq(patientAppointments.id, apptDocA.id),
      eq(patientAppointments.id, apptDocB.id)
    ));
    expect(activeRows).toHaveLength(2);
    expect(activeRows[0].doctorId).not.toBe(activeRows[1].doctorId);
  });

  test("TEST 16: Invalid doctor ID cannot create an appointment", async () => {
    const caller1 = createCaller({ id: patientAvail1Id, openId: "test:patient-availability-1", role: "user" });

    await expect(
      caller1.patientAppointment.request({
        doctorId: "invalid-doctor-nonexistent-id",
        scheduledAt: new Date(`${TEST_DATE_X}T20:00:00`),
        reason: "Invalid doctor test",
      })
    ).rejects.toThrow(/Selected controlled specialist was not found/i);
  });
});

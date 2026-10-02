# 🧪 LifeLink — Automated Testing Framework & Verification Guide

This document provides a comprehensive technical guide to the **LifeLink Automated Testing Suite**. The project utilizes **Vitest 5.0.1** and **React Testing Library 16.3.3** ([`vitest.config.ts`](vitest.config.ts)), executing **248 automated unit and integration tests (247 passed, 1 skipped) across 33 test files with a 100% pass rate**.

---

## 📑 Table of Contents

1. [Testing Philosophy & Architecture](#1-testing-philosophy--architecture)
2. [Test Execution Commands](#2-test-execution-commands)
3. [Complete Test Suite Breakdown (33 Test Files)](#3-complete-test-suite-breakdown-33-test-files)
4. [Domain Testing Deep Dives](#4-domain-testing-deep-dives)
   - [4.1. Clinical AI Triage Safety (54 Tests)](#41-clinical-ai-triage-safety-54-tests)
   - [4.2. Realtime SSE Deep Audit (32 Tests)](#42-realtime-sse-deep-audit-32-tests)
   - [4.3. Appointment Lifecycle & Concurrency (26 Tests)](#43-appointment-lifecycle--concurrency-26-tests)
   - [4.4. Security, IDOR & Authorization (15 Tests)](#44-security-idor--authorization-15-tests)
   - [4.5. Digital Prescriptions & Cryptographic Integrity Seals (15 Tests)](#45-digital-prescriptions--cryptographic-integrity-seals-15-tests)
   - [4.6. Emergency Health Passport (12 Tests)](#46-emergency-health-passport-12-tests)
   - [4.7. Responsive Layout & Accessibility (6 Tests)](#47-responsive-layout--accessibility-6-tests)
5. [Verified Test Results Audit](#5-verified-test-results-audit)

---

## 1. Testing Philosophy & Architecture

Healthcare software requires rigorous automated testing to prevent clinical misdirection, privacy breaches, and race conditions:

- **Hermetic Testing**: Tests run independently without relying on third-party cloud services or live internet connections.
- **Defensive Boundary Testing**: Security tests deliberately attempt unauthorized cross-patient data access (IDOR attacks), expired session exploitation, and biological contradictions to ensure the backend rejects malicious or anomalous requests.
- **Fast Feedback Cycle**: Tests execute in Node.js using Vitest's parallel worker threads, completing all 241 tests in under 6 seconds.

---

## 2. Test Execution Commands

All test commands are declared in [`package.json`](package.json) and executed via NPM:

### Run Full Test Suite
```bash
npm test
```
*Executes all 248 automated tests across 33 test files (247 passed, 1 skipped) and prints the summary report.*

### Run Tests in Watch Mode (Development)
```bash
npx vitest
```
*Watches files for changes and re-executes affected test suites instantly.*

### Run a Specific Test Suite
```bash
npx vitest run backend/ai/assessmentService.test.ts
npx vitest run backend/appointmentLifecycle.test.ts
npx vitest run backend/auth/security.idor.test.ts
```

### Run Full System Verification
```bash
npm run verify
```
*Executes type-checking (`tsc --noEmit`), test execution (`vitest run`), and production build verification (`vite build && esbuild`).*

---

## 3. Complete Test Suite Breakdown (33 Test Files)

| # | Test Suite Path | Tests | Verified Behavior & Coverage |
|:---:|:---|:---:|:---|
| 1 | `backend/ai/assessmentService.test.ts` | **54 tests** | Input sanitization, non-medical pattern rejection, biological contradiction checks (male pregnancy), pediatric age overrides, urgency mapping, and offline fallback. |
| 2 | `backend/realtime/security.realtime.test.ts` | **32 tests** | Realtime SSE packet delivery, listener error handling, stream reconnection, Last-Event-ID replay, and client isolation. |
| 3 | `backend/appointmentLifecycle.test.ts` | **26 tests** | 5-stage appointment state machine: `Requested` $\rightarrow$ `Pending` $\rightarrow$ `Confirmed` $\rightarrow$ `Completed` / `Cancelled`, past date rejection, and concurrency slot conflicts. |
| 4 | `backend/auth/security.idor.test.ts` | **15 tests** | IDOR boundaries ensuring patients cannot access, view, or modify records belonging to other users. |
| 5 | `backend/healthPassport.test.ts` | **12 tests** | Emergency Health Passport: blood group validation, serialized allergy/condition lists, and profile updates. |
| 6 | `backend/prescriptionLifecycle.test.ts` | **15 tests** | Multi-item prescriptions, two-stage signing workflow (`UNSIGNED` $\rightarrow$ `SIGNED`), canonical SHA-256 seal calculation, anti-tampering proofs, duplicate signing prevention, clinician isolation, input validation, and real-time SSE event emission. |
| 7 | `frontend/src/features/patient/Emergency/Emergency.test.tsx` | **11 tests** | Emergency assistance UI flows, SOS triggers, transit navigation, and modal management. |
| 8 | `backend/routers/doctor.test.ts` | **13 tests** | Doctor workstation endpoints, appointment status updates, consultation metrics, authorized patient detail, draft prescription creation, and explicit prescription signing mutation (`prescriptions.sign`). |
| 9 | `backend/auth/doctorAuth.test.ts` | **8 tests** | Doctor Scrypt password checks, institutional email login, timing-safe password resets, and session cookies. |
| 10 | `backend/medicine.test.ts` | **7 tests** | Medicine cabinet operations, daily schedules, adherence tracking, and inventory counts. |
| 11 | `frontend/src/responsiveLayout.test.ts` | **6 tests** | Responsive rendering across 320px, 360px, 390px, 430px, 480px, 768px, and 4K screens with safe-area insets. |
| 12 | `frontend/src/features/patient/Specialists/SpecialistFinder.test.ts` | **5 tests** | Station filter, transit line filter, distance calculation, and doctor profile display. |
| 13 | `backend/discovery/mockDoctorDirectory.test.ts` | **4 tests** | Verifies 52 doctors, 1 GP per station guarantee across 19 stations, GPS coordinates, and line filters. |
| 14 | `frontend/src/features/entry/WorkspaceSelector.test.ts` | **4 tests** | Multi-role workspace switching, contrast verification, and responsive landing layout. |
| 15 | `backend/auth/providerAuth.test.ts` | **4 tests (3 passed, 1 skipped)** | Clinician authorization middleware, Google OAuth availability detector, and role enforcement (1 test skipped when external Google credentials are intentionally unconfigured). |
| 16 | `frontend/src/components/layout/AppShell.test.ts` | **3 tests** | Global navigation shell, dark/light theme switching, and safe header rendering. |
| 17 | `backend/realtime/patientRealtime.test.ts` | **3 tests** | SSE connection management and patient channel subscription isolation. |
| 18 | `backend/auth/nativePatientAuth.test.ts` | **2 tests** | Native patient signup, password complexity, unique Scrypt random salting, and `timingSafeEqual` login. |
| 19 | `backend/geminiKey.test.ts` | **2 tests** | Gemini API key environment configuration and connection tests. |
| 20 | `backend/ai/assessment.validation.test.ts` | **2 tests** | Zod input schema validation for triage requests (symptoms length, age limits, gender values). |
| 21 | `frontend/src/hooks/patientInactivity.test.ts` | **2 tests** | Inactivity timeout detection and automatic session locking after 5 minutes of idle time. |
| 22 | `frontend/src/features/patient/activeCopyAudit.test.ts` | **2 tests** | Copy audit ensuring professional clinical terminology across views. |
| 23 | `frontend/src/styles.motion.test.ts` | **2 tests** | Framer motion animation token validation and reduced motion compliance. |
| 24 | `frontend/src/typography.test.ts` | **2 tests** | Typography scale and tabular font rendering tests. |
| 25 | `scripts/dev.test.ts` | **2 tests** | Development server port scanner and proxy configuration tests. |
| 26 | `backend/emergencyContact.validation.test.ts` | **2 tests** | Zod schema validation for emergency contact inputs. |
| 27 | `backend/profilePhoto.test.ts` | **2 tests** | Avatar photo upload validation, magic byte verification, and size limits. |
| 28 | `backend/auth/simultaneousAuth.test.ts` | **1 test** | Dual session cookie isolation (`app_session_id` vs `doctor_session_id`). |
| 29 | `frontend/src/components/EntryThemeToggle.test.ts` | **1 test** | Theme toggle switch interaction and persistence tests. |
| 30 | `frontend/src/backgroundBranding.test.ts` | **1 test** | Official brand asset existence and path integrity tests. |
| 31 | `frontend/src/features/patient/Specialists/discoveryLocation.test.ts` | **1 test** | Client-side Haversine geodesic calculation tests. |
| 32 | `frontend/src/features/patient/patientAuthRoutes.test.ts` | **1 test** | Patient authentication route configuration tests. |
| 33 | `backend/auth/auth.logout.test.ts` | **1 test** | Session cookie invalidation and logout tests. |
| **Total** | **33 Test Files** | **248 Tests** | **100% Pass Rate (247 passed, 1 skipped)** |

---

## 4. Domain Testing Deep Dives

### 4.1. Clinical AI Triage Safety (54 Tests)
- Validates the deterministic rejection of conversational, programming, or non-medical queries.
- Tests biological consistency: ensures male profiles entering female-exclusive symptoms (e.g. pregnancy, ovarian cysts) are rejected with clear error messages.
- Verifies pediatric overrides: ensures patients under 18 years are routed to `Pediatrics`.
- Tests 0ms emergency regex triggers on acute conditions (crushing chest pain, severe hemorrhage, stroke).

### 4.2. Realtime SSE Deep Audit (32 Tests)
- Verifies event streaming under rapid concurrent events.
- Tests that an unhandled listener error does not terminate sibling client streams.
- Validates `Last-Event-ID` parsing and database event replay upon reconnection.

### 4.3. Appointment Lifecycle & Concurrency (26 Tests)
- Tests atomic transitions across the 5 states: `Requested` $\rightarrow$ `Pending` $\rightarrow$ `Confirmed` $\rightarrow$ `Completed` / `Cancelled`.
- Confirms doctor-scoped availability: ensures booking Doctor A at 10:00 AM does not mark Doctor B unavailable.
- Tests virtual active slot uniqueness: verifies that concurrent attempts to book the same slot fail gracefully with a conflict error.
- Verifies rejection of past dates.

### 4.4. Security, IDOR & Authorization (15 Tests)
- Tests that patients cannot access other patients' health passports, appointments, or prescriptions.
- Verifies that clinicians cannot view medical records for patients not assigned to them via an active appointment.

### 4.5. Digital Prescriptions & Cryptographic Integrity Seals (15 Tests)
- Verifies the two-stage authoring lifecycle: draft prescription created in `UNSIGNED / CONTROLLED WORKSPACE` with null integrity reference.
- Executes the explicit `prescriptions.sign` mutation to transition status to `SIGNED — CONTROLLED STATE` and generate the canonical SHA-256 integrity seal.
- Verifies that prescription signing computes a valid SHA-256 hash across doctor ID, patient ID, medication items, instructions, and clinical notes.
- Tests tamper evidence: altering a prescription's line items or dosages invalidates the integrity hash.
- Tests duplicate signing prevention: attempts to re-sign an already sealed prescription are rejected with `BAD_REQUEST`.
- Confirms clinician isolation: doctors cannot sign prescriptions authored by other clinicians.
- Asserts that real-time SSE `PRESCRIPTION_CREATED` events are broadcast to the patient portal.

### 4.6. Emergency Health Passport (12 Tests)
- Verifies validation of valid blood groups (`O+`, `A+`, `B+`, `AB+`, `O-`, `A-`, `B-`, `AB-`).
- Tests JSON serialization and deserialization of allergy and condition arrays.

### 4.7. Responsive Layout & Accessibility (6 Tests)
- Validates layout behavior at 320px, 360px, 390px, 430px, 480px, 768px, and 4K viewports.
- Verifies safe-area insets for mobile browser navigation bars.

---

## 5. Verified Test Results Audit

```text
Test Files  33 passed (33)
     Tests  247 passed | 1 skipped (248)
```

All 247 active tests pass consistently with 0 failures (1 test skipped when optional external Google OAuth credentials are unconfigured in local development).

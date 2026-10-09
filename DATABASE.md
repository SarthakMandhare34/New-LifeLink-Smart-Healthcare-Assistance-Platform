# 🗄️ LifeLink — Relational Database Specifications (MySQL 8.0 & Drizzle ORM)

This document provides a comprehensive technical reference for the **LifeLink Relational Database**. The persistence layer is built on **MySQL 8.0** and managed using **Drizzle ORM** ([`database/schema.ts`](database/schema.ts)), delivering compile-time type safety, relational foreign key constraints, and transactional consistency.

---

## 📑 Table of Contents

1. [Database Architecture & Design Principles](#1-database-architecture--design-principles)
2. [Entity-Relationship Diagram](#2-entity-relationship-diagram)
3. [Table Specifications (14 Relational Tables)](#3-table-specifications-14-relational-tables)
   - [3.1. `users`](#31-users)
   - [3.2. `patientAssessments`](#32-patientassessments)
   - [3.3. `patientCredentials`](#33-patientcredentials)
   - [3.4. `syntheticDoctorCredentials`](#34-syntheticdoctorcredentials)
   - [3.5. `patientProviderIdentities`](#35-patientprovideridentities)
   - [3.6. `patientProfiles`](#36-patientprofiles)
   - [3.7. `patientEmergencyContacts`](#37-patientemergencycontacts)
   - [3.8. `patientMedicines`](#38-patientmedicines)
   - [3.9. `patientAppointments`](#39-patientappointments)
   - [3.10. `patientPrescriptions`](#310-patientprescriptions)
   - [3.11. `patientPrescriptionItems`](#311-patientprescriptionitems)
   - [3.12. `patientEvents`](#312-patientevents)
   - [3.13. `doctorEvents`](#313-doctorevents)
   - [3.14. `bookingErrors`](#314-bookingerrors)
4. [Indexing Strategy & Concurrency Protection](#4-indexing-strategy--concurrency-protection)
5. [Database Operations & Maintenance Scripts](#5-database-operations--maintenance-scripts)

---

## 1. Database Architecture & Design Principles

The database design adheres to professional relational database standards:

- **Third Normal Form (3NF)**: Entities are normalized to eliminate data redundancy and anomalies.
- **Referential Integrity with Cascading Deletions**: Foreign keys link child tables (`patientProfiles`, `patientAppointments`, etc.) to the central `users` table with `ON DELETE CASCADE`, ensuring no orphaned records exist upon account deletion.
- **Atomic Concurrency Protection**: Virtual active slot uniqueness keys prevent double-booking collisions at the database engine level.
- **Auditable Security**: Passwords are saved exclusively as salted Scrypt hash strings (`salt:hash`). Plaintext passwords are never persisted.
- **Type-Inferred TypeScript Contracts**: Drizzle ORM exports `$inferSelect` and `$inferInsert` types directly into the TypeScript application code, guaranteeing 100% schema alignment across client and server.

---

## 2. Entity-Relationship Diagram

```text
users (Central Identity & Role Registry)
  │
  ├── 1:1 ──► patientCredentials (Native email/password auth)
  ├── 1:1 ──► syntheticDoctorCredentials (Doctor workstation credentials)
  ├── 1:N ──► patientProviderIdentities (Google OAuth links)
  ├── 1:1 ──► patientProfiles (Health Passport, blood group, avatar)
  │
  ├── 1:N ──► patientAssessments (AI clinical symptom evaluations)
  ├── 1:N ──► patientEmergencyContacts (Emergency phone contacts)
  ├── 1:N ──► patientMedicines (Virtual medicine cabinet)
  ├── 1:N ──► patientAppointments (Doctor consultation bookings)
  │
  ├── 1:N ──► patientPrescriptions (Doctor-authorized prescriptions)
  │             └── 1:N ──► patientPrescriptionItems (Medication items)
  │
  ├── 1:N ──► patientEvents (Real-time SSE event backlog)
  ├── 1:N ──► doctorEvents (Real-time clinician event backlog)
  │
  └── 1:N ──► bookingErrors (Audit log of failed booking attempts)
```

---

## 3. Table Specifications (14 Relational Tables)

### 3.1. `users`
- **Purpose**: Central identity table storing accounts for patients, doctors, and system administrators.
- **Columns**:
  - `id` (`INT`, Primary Key, Auto-increment): Unique user identifier.
  - `openId` (`VARCHAR(64)`, NOT NULL, UNIQUE): Unique session identity key (e.g. `native:42`, `synthetic-doctor:csmt`).
  - `name` (`TEXT`, Nullable): Full legal or preferred name.
  - `email` (`VARCHAR(320)`, Nullable): Contact email address.
  - `loginMethod` (`VARCHAR(64)`, Nullable): Auth method (`native-patient`, `google-oauth`, `synthetic-clinician`).
  - `role` (`ENUM('user', 'doctor', 'admin')`, NOT NULL, Default: `'user'`): Access tier.
  - `createdAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Account registration timestamp.
  - `updatedAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`, ON UPDATE `NOW()`): Last account update timestamp.
  - `lastSignedIn` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Timestamp of last successful login.

---

### 3.2. `patientAssessments`
- **Purpose**: Stores historical AI symptom assessments evaluated by Google Gemini.
- **Columns**:
  - `id` (`INT`, Primary Key, Auto-increment): Unique assessment ID.
  - `userId` (`INT`, NOT NULL, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE): Target patient.
  - `symptoms` (`TEXT`, NOT NULL): Patient symptom description.
  - `age` (`INT`, NOT NULL): Patient age at time of evaluation.
  - `gender` (`VARCHAR(32)`, NOT NULL): Biological sex/gender.
  - `conditions` (`TEXT`, Nullable): Chronic conditions entered by the patient.
  - `duration` (`VARCHAR(64)`, NOT NULL): Symptom duration string (e.g. "3 days").
  - `urgency` (`ENUM('LOW', 'MODERATE', 'EMERGENCY', 'ERROR')`, NOT NULL): Triage urgency level.
  - `reason` (`TEXT`, NOT NULL): Clinical non-diagnostic rationale from Gemini.
  - `specialty` (`VARCHAR(160)`, NOT NULL): Recommended clinical specialty.
  - `guidance` (`TEXT`, NOT NULL): Actionable health guidance.
  - `createdAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Record creation timestamp.

---

### 3.3. `patientCredentials`
- **Purpose**: Stores cryptographic Scrypt password hashes for native email/password patient authentication.
- **Columns**:
  - `id` (`INT`, Primary Key, Auto-increment): Unique credential row ID.
  - `userId` (`INT`, NOT NULL, UNIQUE, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE): Exactly 1 credential per patient.
  - `email` (`VARCHAR(320)`, NOT NULL, UNIQUE): Normalized lowercase login email.
  - `passwordHash` (`VARCHAR(512)`, NOT NULL): Salted Scrypt hash formatted as `salt:hexHash`.
  - `createdAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Creation timestamp.
  - `updatedAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`, ON UPDATE `NOW()`): Password update timestamp.

---

### 3.4. `syntheticDoctorCredentials`
- **Purpose**: Connects the 52 Mumbai railway doctors to authenticated workstation accounts.
- **Columns**:
  - `id` (`INT`, Primary Key, Auto-increment): Unique credential row ID.
  - `userId` (`INT`, NOT NULL, UNIQUE, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE): Linked clinician account.
  - `doctorId` (`VARCHAR(80)`, NOT NULL, UNIQUE): Stable catalog identifier (e.g. `mock-central-cardiology-csmt`).
  - `email` (`VARCHAR(320)`, NOT NULL, UNIQUE): Clinician login email (`cardiology.csmt@lifelink.com`).
  - `passwordHash` (`VARCHAR(512)`, NOT NULL): Salted Scrypt password hash.
  - `createdAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Creation timestamp.
  - `updatedAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`, ON UPDATE `NOW()`): Update timestamp.

---

### 3.5. `patientProviderIdentities`
- **Purpose**: Links external OAuth identity providers (Google) to patient user accounts.
- **Columns**:
  - `id` (`INT`, Primary Key, Auto-increment): Unique link ID.
  - `userId` (`INT`, NOT NULL, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE): Linked patient account.
  - `provider` (`ENUM('google')`, NOT NULL): OAuth provider name.
  - `subject` (`VARCHAR(255)`, NOT NULL): Google unique user ID (`sub` claim).
  - `email` (`VARCHAR(320)`, NOT NULL): Email verified by Google.
  - `createdAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Link creation timestamp.
  - `updatedAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`, ON UPDATE `NOW()`): Link update timestamp.
- **Constraints**: Composite UNIQUE constraint `provider_subject_unique` on `(provider, subject)`.

---

### 3.6. `patientProfiles`
- **Purpose**: Emergency Health Passport storing medical vitals, photo avatar, allergies, and chronic conditions.
- **Columns**:
  - `id` (`INT`, Primary Key, Auto-increment): Unique profile ID.
  - `userId` (`INT`, NOT NULL, UNIQUE, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE): Exactly one profile per user.
  - `bloodGroup` (`VARCHAR(12)`, Nullable): Patient blood type (`O+`, `A+`, `B+`, `AB+`, `O-`, `A-`, `B-`, `AB-`).
  - `phone` (`VARCHAR(32)`, Nullable): Contact phone number.
  - `avatarKey` (`VARCHAR(512)`, Nullable): Filesystem storage key for profile image.
  - `allergiesJson` (`TEXT`, NOT NULL): Serialized JSON array of verified allergies (e.g. `["Penicillin", "Peanuts"]`).
  - `conditionsJson` (`TEXT`, NOT NULL): Serialized JSON array of chronic conditions (e.g. `["Hypertension"]`).
  - `createdAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Record timestamp.
  - `updatedAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`, ON UPDATE `NOW()`): Record update timestamp.

---

### 3.7. `patientEmergencyContacts`
- **Purpose**: Contacts reachable during urgent medical distress.
- **Columns**:
  - `id` (`INT`, Primary Key, Auto-increment): Unique contact ID.
  - `userId` (`INT`, NOT NULL, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE): Linked patient.
  - `name` (`VARCHAR(160)`, NOT NULL): Contact person's name.
  - `relationship` (`VARCHAR(80)`, NOT NULL): Relationship (Spouse, Parent, Sibling, Friend).
  - `phone` (`VARCHAR(32)`, NOT NULL): Contact telephone number.
  - `createdAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Creation timestamp.
  - `updatedAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`, ON UPDATE `NOW()`): Update timestamp.

---

### 3.8. `patientMedicines`
- **Purpose**: Virtual medicine cabinet tracking active medication regimens and refills.
- **Columns**:
  - `id` (`INT`, Primary Key, Auto-increment): Unique medicine ID.
  - `userId` (`INT`, NOT NULL, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE): Linked patient.
  - `name` (`VARCHAR(200)`, NOT NULL): Drug trade or generic name.
  - `dosage` (`VARCHAR(120)`, NOT NULL): Dosage amount (e.g. "500 mg").
  - `frequency` (`VARCHAR(120)`, NOT NULL): Administration frequency (e.g. "Twice daily").
  - `schedule` (`VARCHAR(120)`, NOT NULL): Time schedule (e.g. "Morning & Night after food").
  - `startDate` (`VARCHAR(10)`, Nullable): Regimen start date (`YYYY-MM-DD`).
  - `endDate` (`VARCHAR(10)`, Nullable): Completion date (`YYYY-MM-DD`).
  - `quantity` (`INT`, Nullable): Remaining pill/unit count.
  - `expiry` (`VARCHAR(10)`, Nullable): Package expiration date (`YYYY-MM-DD`).
  - `createdAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Record timestamp.
  - `updatedAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`, ON UPDATE `NOW()`): Record update timestamp.

---

### 3.9. `patientAppointments`
- **Purpose**: Consultation appointments booked between patients and specialists.
- **Columns**:
  - `id` (`INT`, Primary Key, Auto-increment): Unique appointment ID.
  - `userId` (`INT`, NOT NULL, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE): Patient booking the visit.
  - `doctorId` (`VARCHAR(80)`, NOT NULL): Specialist ID chosen from directory.
  - `reason` (`TEXT`, Nullable): Patient's medical reason for visit.
  - `scheduledAt` (`TIMESTAMP`, NOT NULL): Scheduled date and time.
  - `status` (`ENUM('Requested', 'Pending', 'Confirmed', 'Completed', 'Cancelled')`, NOT NULL, Default: `'Requested'`): Current appointment state.
  - `activeSlotKey` (`VARCHAR(160)`, Nullable): Concurrency key `doctorId:scheduledAt`. Set to `NULL` upon cancellation to reopen the slot.
  - `createdAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Booking timestamp.
  - `updatedAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`, ON UPDATE `NOW()`): Update timestamp.
- **Indexes**:
  - `patientAppointments_active_slot_unique` (UNIQUE) on `(activeSlotKey)`.
  - `patientAppointments_doc_sched_idx` on `(doctorId, scheduledAt, status)`.

---

### 3.10. `patientPrescriptions`
- **Purpose**: Official medical prescriptions authorized and digitally signed by clinicians.
- **Columns**:
  - `id` (`INT`, Primary Key, Auto-increment): Unique prescription ID.
  - `userId` (`INT`, NOT NULL, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE): Patient receiving prescription.
  - `doctorId` (`VARCHAR(80)`, NOT NULL): Issuing specialist ID.
  - `issuedAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Issue timestamp.
  - `status` (`ENUM('UNSIGNED / CONTROLLED WORKSPACE', 'SIGNED — CONTROLLED STATE')`, NOT NULL, Default: `'UNSIGNED / CONTROLLED WORKSPACE'`): Signing state.
  - `clinicalNotes` (`TEXT`, Nullable): Clinician examination findings and notes.
  - `integrityReference` (`VARCHAR(255)`, Nullable): Immutable SHA-256 digital signature hash.
  - `createdAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Record timestamp.
  - `updatedAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`, ON UPDATE `NOW()`): Update timestamp.

---

### 3.11. `patientPrescriptionItems`
- **Purpose**: Individual medication line items prescribed within an overarching prescription document.
- **Columns**:
  - `id` (`INT`, Primary Key, Auto-increment): Unique item ID.
  - `prescriptionId` (`INT`, NOT NULL, Foreign Key $\rightarrow$ `patientPrescriptions.id` ON DELETE CASCADE): Parent prescription.
  - `name` (`VARCHAR(200)`, NOT NULL): Prescribed medicine name.
  - `dosage` (`VARCHAR(120)`, NOT NULL): Dosage (e.g. "10mg").
  - `instructions` (`TEXT`, NOT NULL): Doctor's usage directions.

---

### 3.12. `patientEvents`
- **Purpose**: Real-time push notification backlog for patient accounts.
- **Columns**:
  - `id` (`INT`, Primary Key, Auto-increment): Sequence ID.
  - `userId` (`INT`, NOT NULL, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE): Target patient.
  - `type` (`ENUM('PROFILE_UPDATED', 'APPOINTMENT_UPDATED', 'PRESCRIPTION_CREATED', 'ASSESSMENT_COMPLETED', 'MEDICINE_UPDATED')`, NOT NULL): Event category.
  - `entityId` (`VARCHAR(80)`, Nullable): Affected record ID.
  - `createdAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Timestamp.

---

### 3.13. `doctorEvents`
- **Purpose**: Real-time push notification backlog for clinician workstations.
- **Columns**:
  - `id` (`INT`, Primary Key, Auto-increment): Sequence ID.
  - `doctorId` (`VARCHAR(80)`, NOT NULL): Target specialist ID.
  - `patientUserId` (`INT`, NOT NULL, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE): Related patient ID.
  - `type` (`ENUM('APPOINTMENT_UPDATED', 'ASSESSMENT_COMPLETED', 'PATIENT_RELATED_UPDATE')`, NOT NULL): Event category.
  - `entityId` (`VARCHAR(80)`, Nullable): Affected record ID.
  - `createdAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Timestamp.

---

### 3.14. `bookingErrors`
- **Purpose**: Audit log recording failed booking attempts, concurrency conflicts, and validation errors.
- **Columns**:
  - `id` (`INT`, Primary Key, Auto-increment): Sequence ID.
  - `userId` (`INT`, Nullable, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE): Attempting patient ID.
  - `doctorId` (`VARCHAR(80)`, Nullable): Attempted specialist ID.
  - `attemptedAt` (`TIMESTAMP`, Nullable): Attempted appointment timestamp.
  - `errorMessage` (`TEXT`, NOT NULL): Exact error message returned.
  - `errorCode` (`VARCHAR(64)`, NOT NULL): Machine-readable error code (`APPOINTMENT_SLOT_UNAVAILABLE`, `INVALID_PAST_DATE_TIME`, `DOCTOR_NOT_FOUND`).
  - `createdAt` (`TIMESTAMP`, NOT NULL, Default: `NOW()`): Error timestamp.

---

## 4. Indexing Strategy & Concurrency Protection

1. **Active Slot Concurrency Index**:
   ```sql
   CREATE UNIQUE INDEX `patientAppointments_active_slot_unique` 
   ON `patientAppointments` (`activeSlotKey`);
   ```
   Ensures that only one non-cancelled booking can occupy a `(doctorId, scheduledAt)` time slot simultaneously.
2. **Doctor Schedule Composite Index**:
   ```sql
   CREATE INDEX `patientAppointments_doc_sched_idx` 
   ON `patientAppointments` (`doctorId`, `scheduledAt`, `status`);
   ```
   Optimizes doctor queue queries and calendar availability checks.
3. **Session Subject Index**:
   ```sql
   CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);
   ```
   Provides sub-millisecond lookup times for session cookie authentication.

---

## 5. Database Operations & Maintenance Scripts

All database maintenance tasks are performed via NPM scripts:

| Command | Script File | Description |
|:---|:---|:---|
| `npm run db:push` | `drizzle-kit` | Generates schema diffs and applies them directly to MySQL. |
| `npm run db:studio` | `drizzle-kit studio` | Launches interactive browser GUI at `https://local.drizzle.studio`. |
| `npm run db:sync:doctors` | [`scripts/sync-doctors.ts`](scripts/sync-doctors.ts) | Audits MySQL and seeds all 52 Mumbai railway doctors and Scrypt hashes. |
| `npm run db:clear` | [`scripts/clear-users.ts`](scripts/clear-users.ts) | Clears patient test records while keeping all 52 doctor accounts intact. |
| `npx tsx scripts/delete-user.ts <email>` | [`scripts/delete-user.ts`](scripts/delete-user.ts) | Selectively deletes a single user by email with cascading cleanup. |
| `npx tsx scripts/init-db.ts` | [`scripts/init-db.ts`](scripts/init-db.ts) | Creates the `lifelink` database in MySQL if it does not already exist. |
| `npx tsx scripts/generate-sql-seed.ts` | [`scripts/generate-sql-seed.ts`](scripts/generate-sql-seed.ts) | Generates zero-dependency [`database/seed_doctors.sql`](database/seed_doctors.sql). |



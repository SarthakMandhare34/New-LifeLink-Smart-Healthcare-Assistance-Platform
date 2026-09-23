import fs from "fs";
import path from "path";
import { mockDoctorDirectory } from "../backend/discovery/mockDoctorDirectory";
import { hashPatientPassword } from "../backend/auth/nativePatientAuth";

async function generateSql() {
  const patientHash = await hashPatientPassword("patient@lifelink");

  const sqlLines: string[] = [
    "-- ============================================================================",
    "-- LIFELINK COMPLETE DATABASE SETUP & CREDENTIAL SEED FOR MYSQL WORKBENCH",
    "-- ============================================================================",
    "-- Instructions for MySQL Workbench:",
    "-- 1. Start your MySQL Server (in Workbench: Administration -> Startup/Shutdown -> Start Server).",
    "-- 2. Open this file (File -> Open SQL Script -> database/seed_doctors.sql).",
    "-- 3. Click the ⚡ Execute button (or Ctrl + Shift + Enter).",
    "-- 4. The Result Grid at the bottom will display all 52 doctor logins + patient login.",
    "-- ============================================================================",
    "",
    "CREATE DATABASE IF NOT EXISTS `lifelink` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
    "USE `lifelink`;",
    "",
    "-- Table 1: Core Users",
    "CREATE TABLE IF NOT EXISTS `users` (",
    "  `id` int AUTO_INCREMENT NOT NULL,",
    "  `openId` varchar(64) NOT NULL,",
    "  `name` text,",
    "  `email` varchar(320),",
    "  `loginMethod` varchar(64),",
    "  `role` enum('user','doctor','admin') NOT NULL DEFAULT 'user',",
    "  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,",
    "  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  PRIMARY KEY (`id`),",
    "  UNIQUE KEY `users_openId_unique` (`openId`)",
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
    "",
    "-- Table 2: Synthetic Doctor Credentials",
    "CREATE TABLE IF NOT EXISTS `syntheticDoctorCredentials` (",
    "  `id` int AUTO_INCREMENT NOT NULL,",
    "  `userId` int NOT NULL,",
    "  `doctorId` varchar(80) NOT NULL,",
    "  `email` varchar(320) NOT NULL,",
    "  `passwordHash` varchar(512) NOT NULL,",
    "  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,",
    "  PRIMARY KEY (`id`),",
    "  UNIQUE KEY `syntheticDoctorCredentials_userId_unique` (`userId`),",
    "  UNIQUE KEY `syntheticDoctorCredentials_doctorId_unique` (`doctorId`),",
    "  UNIQUE KEY `syntheticDoctorCredentials_email_unique` (`email`),",
    "  CONSTRAINT `fk_doctor_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE",
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
    "",
    "-- Table 3: Native Patient Credentials",
    "CREATE TABLE IF NOT EXISTS `patientCredentials` (",
    "  `id` int AUTO_INCREMENT NOT NULL,",
    "  `userId` int NOT NULL,",
    "  `email` varchar(320) NOT NULL,",
    "  `passwordHash` varchar(512) NOT NULL,",
    "  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,",
    "  PRIMARY KEY (`id`),",
    "  UNIQUE KEY `patientCredentials_userId_unique` (`userId`),",
    "  UNIQUE KEY `patientCredentials_email_unique` (`email`),",
    "  CONSTRAINT `fk_patient_cred_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE",
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
    "",
    "-- Table 4: Patient Profiles",
    "CREATE TABLE IF NOT EXISTS `patientProfiles` (",
    "  `id` int AUTO_INCREMENT NOT NULL,",
    "  `userId` int NOT NULL,",
    "  `bloodGroup` varchar(12),",
    "  `phone` varchar(32),",
    "  `avatarKey` varchar(512),",
    "  `allergiesJson` text NOT NULL,",
    "  `conditionsJson` text NOT NULL,",
    "  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,",
    "  PRIMARY KEY (`id`),",
    "  UNIQUE KEY `patientProfiles_userId_unique` (`userId`),",
    "  CONSTRAINT `fk_patient_prof_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE",
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
    "",
    "-- Table 5: Patient Appointments",
    "CREATE TABLE IF NOT EXISTS `patientAppointments` (",
    "  `id` int AUTO_INCREMENT NOT NULL,",
    "  `userId` int NOT NULL,",
    "  `doctorId` varchar(80) NOT NULL,",
    "  `reason` text,",
    "  `scheduledAt` timestamp NOT NULL,",
    "  `status` enum('Requested','Pending','Confirmed','Completed','Cancelled') NOT NULL DEFAULT 'Requested',",
    "  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,",
    "  PRIMARY KEY (`id`),",
    "  CONSTRAINT `fk_patient_appt_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE",
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
    "",
    "-- Table 6: Patient Assessments",
    "CREATE TABLE IF NOT EXISTS `patientAssessments` (",
    "  `id` int AUTO_INCREMENT NOT NULL,",
    "  `userId` int NOT NULL,",
    "  `symptoms` text NOT NULL,",
    "  `age` int NOT NULL,",
    "  `gender` varchar(32) NOT NULL,",
    "  `conditions` text,",
    "  `duration` varchar(64) NOT NULL,",
    "  `urgency` enum('LOW','MODERATE','EMERGENCY','ERROR') NOT NULL,",
    "  `reason` text NOT NULL,",
    "  `specialty` varchar(160) NOT NULL,",
    "  `guidance` text NOT NULL,",
    "  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  PRIMARY KEY (`id`),",
    "  CONSTRAINT `fk_patient_assess_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE",
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
    "",
    "-- Table 7: Patient Emergency Contacts",
    "CREATE TABLE IF NOT EXISTS `patientEmergencyContacts` (",
    "  `id` int AUTO_INCREMENT NOT NULL,",
    "  `userId` int NOT NULL,",
    "  `name` varchar(160) NOT NULL,",
    "  `relationship` varchar(80) NOT NULL,",
    "  `phone` varchar(32) NOT NULL,",
    "  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,",
    "  PRIMARY KEY (`id`),",
    "  CONSTRAINT `fk_patient_emerg_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE",
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
    "",
    "-- Table 8: Patient Medicines",
    "CREATE TABLE IF NOT EXISTS `patientMedicines` (",
    "  `id` int AUTO_INCREMENT NOT NULL,",
    "  `userId` int NOT NULL,",
    "  `name` varchar(200) NOT NULL,",
    "  `dosage` varchar(120) NOT NULL,",
    "  `frequency` varchar(120) NOT NULL,",
    "  `schedule` varchar(120) NOT NULL,",
    "  `startDate` varchar(10),",
    "  `endDate` varchar(10),",
    "  `quantity` int,",
    "  `expiry` varchar(10),",
    "  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,",
    "  PRIMARY KEY (`id`),",
    "  CONSTRAINT `fk_patient_med_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE",
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
    "",
    "-- Table 9: Patient Prescriptions",
    "CREATE TABLE IF NOT EXISTS `patientPrescriptions` (",
    "  `id` int AUTO_INCREMENT NOT NULL,",
    "  `userId` int NOT NULL,",
    "  `doctorId` varchar(80) NOT NULL,",
    "  `issuedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  `status` enum('UNSIGNED / CONTROLLED WORKSPACE','SIGNED — CONTROLLED STATE') NOT NULL DEFAULT 'UNSIGNED / CONTROLLED WORKSPACE',",
    "  `clinicalNotes` text,",
    "  `integrityReference` varchar(255),",
    "  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,",
    "  PRIMARY KEY (`id`),",
    "  CONSTRAINT `fk_patient_rx_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE",
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
    "",
    "-- Table 10: Patient Prescription Items",
    "CREATE TABLE IF NOT EXISTS `patientPrescriptionItems` (",
    "  `id` int AUTO_INCREMENT NOT NULL,",
    "  `prescriptionId` int NOT NULL,",
    "  `name` varchar(200) NOT NULL,",
    "  `dosage` varchar(120) NOT NULL,",
    "  `instructions` text NOT NULL,",
    "  PRIMARY KEY (`id`),",
    "  CONSTRAINT `fk_rx_item_prescription` FOREIGN KEY (`prescriptionId`) REFERENCES `patientPrescriptions` (`id`) ON DELETE CASCADE",
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
    "",
    "-- Table 11: Patient Events (Realtime SSE)",
    "CREATE TABLE IF NOT EXISTS `patientEvents` (",
    "  `id` int AUTO_INCREMENT NOT NULL,",
    "  `userId` int NOT NULL,",
    "  `type` enum('PROFILE_UPDATED','APPOINTMENT_UPDATED','PRESCRIPTION_CREATED','ASSESSMENT_COMPLETED','MEDICINE_UPDATED') NOT NULL,",
    "  `entityId` varchar(80),",
    "  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  PRIMARY KEY (`id`),",
    "  CONSTRAINT `fk_patient_evt_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE",
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
    "",
    "-- Table 12: Doctor Events (Realtime SSE)",
    "CREATE TABLE IF NOT EXISTS `doctorEvents` (",
    "  `id` int AUTO_INCREMENT NOT NULL,",
    "  `doctorId` varchar(80) NOT NULL,",
    "  `patientUserId` int NOT NULL,",
    "  `type` enum('APPOINTMENT_UPDATED') NOT NULL,",
    "  `entityId` varchar(80),",
    "  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  PRIMARY KEY (`id`),",
    "  CONSTRAINT `fk_doctor_evt_user` FOREIGN KEY (`patientUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE",
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
    "",
    "-- Table 13: Provider Identities (OAuth)",
    "CREATE TABLE IF NOT EXISTS `patientProviderIdentities` (",
    "  `id` int AUTO_INCREMENT NOT NULL,",
    "  `userId` int NOT NULL,",
    "  `provider` enum('google') NOT NULL,",
    "  `subject` varchar(255) NOT NULL,",
    "  `email` varchar(320) NOT NULL,",
    "  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,",
    "  PRIMARY KEY (`id`),",
    "  UNIQUE KEY `provider_subject_unique` (`provider`,`subject`),",
    "  CONSTRAINT `fk_patient_prov_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE",
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
    "",
    "-- ============================================================================",
    "-- SEED 1: DEMO PATIENT ACCOUNT",
    "-- Email: patient@lifelink.com  |  Password: patient@lifelink",
    "-- ============================================================================",
    "INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)",
    "VALUES ('native:patient-demo', 'Aarav Mehta', 'patient@lifelink.com', 'native-patient', 'user', NOW(), NOW(), NOW())",
    "ON DUPLICATE KEY UPDATE name = 'Aarav Mehta', email = 'patient@lifelink.com', role = 'user', updatedAt = NOW();",
    "",
    "INSERT INTO patientCredentials (userId, email, passwordHash, createdAt, updatedAt)",
    `VALUES ((SELECT id FROM users WHERE openId = 'native:patient-demo'), 'patient@lifelink.com', '${patientHash}', NOW(), NOW())`,
    `ON DUPLICATE KEY UPDATE email = 'patient@lifelink.com', passwordHash = '${patientHash}', updatedAt = NOW();`,
    "",
    "INSERT INTO patientProfiles (userId, bloodGroup, phone, allergiesJson, conditionsJson, createdAt, updatedAt)",
    "VALUES ((SELECT id FROM users WHERE openId = 'native:patient-demo'), 'O+', '+91 98765 43210', '[]', '[]', NOW(), NOW())",
    "ON DUPLICATE KEY UPDATE bloodGroup = 'O+', phone = '+91 98765 43210', updatedAt = NOW();",
    "",
    "-- ============================================================================",
    "-- SEED 2: 52 CLINICIAN WORKSTATION ACCOUNTS (100% FICTIONAL & COMPLIANT)",
    "-- ============================================================================",
  ];

  for (const doctor of mockDoctorDirectory) {
    const specialtySlug = doctor.specialty.toLowerCase().replace(/[^a-z]/g, "");
    const stationSlug = doctor.station.toLowerCase().replace(/[^a-z]/g, "");
    const emailSlug = doctor.id.replace("mock-", "");
    const email = `${emailSlug}@lifelink.com`;
    const password = `${specialtySlug}.${stationSlug}@lifelink`;
    const passwordHash = await hashPatientPassword(password);
    const openId = `synthetic-doctor:${doctor.id}`;
    const escapedName = doctor.name.replace(/'/g, "''");

    sqlLines.push(`-- Doctor: ${doctor.name} (${doctor.specialty} - ${doctor.locality})`);
    sqlLines.push(`INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)`);
    sqlLines.push(`VALUES ('${openId}', '${escapedName}', '${email}', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())`);
    sqlLines.push(`ON DUPLICATE KEY UPDATE name = '${escapedName}', email = '${email}', role = 'doctor', updatedAt = NOW();`);
    sqlLines.push("");
    sqlLines.push(`INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)`);
    sqlLines.push(`VALUES ((SELECT id FROM users WHERE openId = '${openId}'), '${doctor.id}', '${email}', '${passwordHash}')`);
    sqlLines.push(`ON DUPLICATE KEY UPDATE email = '${email}', passwordHash = '${passwordHash}';`);
    sqlLines.push("");
  }

  sqlLines.push("-- ============================================================================");
  sqlLines.push("-- VERIFICATION & AUDIT QUERIES (Displays immediately in MySQL Workbench)");
  sqlLines.push("-- ============================================================================");
  sqlLines.push("SELECT '✅ LifeLink database created & populated successfully!' AS Setup_Status;");
  sqlLines.push("");
  sqlLines.push("-- View all Doctor login accounts:");
  sqlLines.push("SELECT u.id AS user_id, u.name AS doctor_name, u.email AS doctor_email, c.doctorId, u.role, u.updatedAt");
  sqlLines.push("FROM users u");
  sqlLines.push("JOIN syntheticDoctorCredentials c ON u.id = c.userId");
  sqlLines.push("ORDER BY u.id ASC;");
  sqlLines.push("");
  sqlLines.push("-- View Patient login accounts:");
  sqlLines.push("SELECT u.id AS user_id, u.name AS patient_name, u.email AS patient_email, u.role, u.createdAt");
  sqlLines.push("FROM users u");
  sqlLines.push("WHERE u.role = 'user';");

  const outPath = path.resolve(process.cwd(), "database/seed_doctors.sql");
  fs.writeFileSync(outPath, sqlLines.join("\n"), "utf8");
  console.log(`Successfully generated SQL seed file: ${outPath}`);
}

generateSql().catch(console.error);

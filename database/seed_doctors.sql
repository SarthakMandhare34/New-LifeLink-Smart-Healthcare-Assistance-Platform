-- ============================================================================
-- LIFELINK COMPLETE DATABASE SETUP & CREDENTIAL SEED FOR MYSQL WORKBENCH
-- ============================================================================
-- Instructions for MySQL Workbench:
-- 1. Start your MySQL Server (in Workbench: Administration -> Startup/Shutdown -> Start Server).
-- 2. Open this file (File -> Open SQL Script -> database/seed_doctors.sql).
-- 3. Click the ⚡ Execute button (or Ctrl + Shift + Enter).
-- 4. The Result Grid at the bottom will display all 52 doctor logins.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `lifelink` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lifelink`;

-- Table 1: Core Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int AUTO_INCREMENT NOT NULL,
  `openId` varchar(64) NOT NULL,
  `name` text,
  `email` varchar(320),
  `loginMethod` varchar(64),
  `role` enum('user','doctor','admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_openId_unique` (`openId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 2: Synthetic Doctor Credentials
CREATE TABLE IF NOT EXISTS `syntheticDoctorCredentials` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `doctorId` varchar(80) NOT NULL,
  `email` varchar(320) NOT NULL,
  `passwordHash` varchar(512) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `syntheticDoctorCredentials_userId_unique` (`userId`),
  UNIQUE KEY `syntheticDoctorCredentials_doctorId_unique` (`doctorId`),
  UNIQUE KEY `syntheticDoctorCredentials_email_unique` (`email`),
  CONSTRAINT `fk_doctor_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 3: Native Patient Credentials
CREATE TABLE IF NOT EXISTS `patientCredentials` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `email` varchar(320) NOT NULL,
  `passwordHash` varchar(512) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patientCredentials_userId_unique` (`userId`),
  UNIQUE KEY `patientCredentials_email_unique` (`email`),
  CONSTRAINT `fk_patient_cred_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 4: Patient Profiles
CREATE TABLE IF NOT EXISTS `patientProfiles` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `bloodGroup` varchar(12),
  `phone` varchar(32),
  `avatarKey` varchar(512),
  `allergiesJson` text NOT NULL,
  `conditionsJson` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patientProfiles_userId_unique` (`userId`),
  CONSTRAINT `fk_patient_prof_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 5: Patient Appointments
CREATE TABLE IF NOT EXISTS `patientAppointments` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `doctorId` varchar(80) NOT NULL,
  `reason` text,
  `scheduledAt` timestamp NOT NULL,
  `status` enum('Requested','Pending','Confirmed','Completed','Cancelled') NOT NULL DEFAULT 'Requested',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_patient_appt_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 6: Patient Assessments
CREATE TABLE IF NOT EXISTS `patientAssessments` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `symptoms` text NOT NULL,
  `age` int NOT NULL,
  `gender` varchar(32) NOT NULL,
  `conditions` text,
  `duration` varchar(64) NOT NULL,
  `urgency` enum('LOW','MODERATE','EMERGENCY','ERROR') NOT NULL,
  `reason` text NOT NULL,
  `specialty` varchar(160) NOT NULL,
  `guidance` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_patient_assess_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 7: Patient Emergency Contacts
CREATE TABLE IF NOT EXISTS `patientEmergencyContacts` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `name` varchar(160) NOT NULL,
  `relationship` varchar(80) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_patient_emerg_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 8: Patient Medicines
CREATE TABLE IF NOT EXISTS `patientMedicines` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `dosage` varchar(120) NOT NULL,
  `frequency` varchar(120) NOT NULL,
  `schedule` varchar(120) NOT NULL,
  `startDate` varchar(10),
  `endDate` varchar(10),
  `quantity` int,
  `expiry` varchar(10),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_patient_med_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 9: Patient Prescriptions
CREATE TABLE IF NOT EXISTS `patientPrescriptions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `doctorId` varchar(80) NOT NULL,
  `issuedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('UNSIGNED / CONTROLLED WORKSPACE','SIGNED — CONTROLLED STATE') NOT NULL DEFAULT 'UNSIGNED / CONTROLLED WORKSPACE',
  `clinicalNotes` text,
  `integrityReference` varchar(255),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_patient_rx_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 10: Patient Prescription Items
CREATE TABLE IF NOT EXISTS `patientPrescriptionItems` (
  `id` int AUTO_INCREMENT NOT NULL,
  `prescriptionId` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `dosage` varchar(120) NOT NULL,
  `instructions` text NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_rx_item_prescription` FOREIGN KEY (`prescriptionId`) REFERENCES `patientPrescriptions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 11: Patient Events (Realtime SSE)
CREATE TABLE IF NOT EXISTS `patientEvents` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `type` enum('PROFILE_UPDATED','APPOINTMENT_UPDATED','PRESCRIPTION_CREATED','ASSESSMENT_COMPLETED','MEDICINE_UPDATED') NOT NULL,
  `entityId` varchar(80),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_patient_evt_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 12: Doctor Events (Realtime SSE)
CREATE TABLE IF NOT EXISTS `doctorEvents` (
  `id` int AUTO_INCREMENT NOT NULL,
  `doctorId` varchar(80) NOT NULL,
  `patientUserId` int NOT NULL,
  `type` enum('APPOINTMENT_UPDATED') NOT NULL,
  `entityId` varchar(80),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_doctor_evt_user` FOREIGN KEY (`patientUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 13: Provider Identities (OAuth)
CREATE TABLE IF NOT EXISTS `patientProviderIdentities` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `provider` enum('google') NOT NULL,
  `subject` varchar(255) NOT NULL,
  `email` varchar(320) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `provider_subject_unique` (`provider`,`subject`),
  CONSTRAINT `fk_patient_prov_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ============================================================================
-- CLEANUP: PURGE RESIDUAL PATIENT DATA & NON-DOCTOR USERS
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `bookingErrors`;
TRUNCATE TABLE `doctorEvents`;
TRUNCATE TABLE `patientAppointments`;
TRUNCATE TABLE `patientAssessments`;
TRUNCATE TABLE `patientCredentials`;
TRUNCATE TABLE `patientEmergencyContacts`;
TRUNCATE TABLE `patientEvents`;
TRUNCATE TABLE `patientMedicines`;
TRUNCATE TABLE `patientPrescriptionItems`;
TRUNCATE TABLE `patientPrescriptions`;
TRUNCATE TABLE `patientProfiles`;
TRUNCATE TABLE `patientProviderIdentities`;
DELETE FROM `users` WHERE `role` != 'doctor';
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SEED: 52 CLINICIAN WORKSTATION ACCOUNTS (MUMBAI MEDICAL DIRECTORY)
-- ============================================================================
-- Doctor: Dr. Aarav N. Kulkarni, MBBS (General Practice - Fort Medical Enclave)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-csmt', 'Dr. Aarav N. Kulkarni, MBBS', 'central-general-practice-csmt@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Aarav N. Kulkarni, MBBS', email = 'central-general-practice-csmt@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-csmt'), 'mock-central-general-practice-csmt', 'central-general-practice-csmt@lifelink.com', '122ae3ffac6876adb12498eb8e20358b:afaa204469019f570f3b0c98093a1599d3dc2297e213ce1a50d45d5b6776884ce83b99a224734c7bf8f64cd66dc3b825e40a2331d1872e1d56165d141dcd75a2')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-csmt@lifelink.com', passwordHash = '122ae3ffac6876adb12498eb8e20358b:afaa204469019f570f3b0c98093a1599d3dc2297e213ce1a50d45d5b6776884ce83b99a224734c7bf8f64cd66dc3b825e40a2331d1872e1d56165d141dcd75a2';

-- Doctor: Dr. Ishaan M. Deshmukh, MBBS (General Practice - Ghatkopar East Health District)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-ghatkopar', 'Dr. Ishaan M. Deshmukh, MBBS', 'central-general-practice-ghatkopar@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Ishaan M. Deshmukh, MBBS', email = 'central-general-practice-ghatkopar@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-ghatkopar'), 'mock-central-general-practice-ghatkopar', 'central-general-practice-ghatkopar@lifelink.com', '380b5f6e3521eca10178b3ffe0bd0c75:9ae75f931bd32fa93594fca32f87c8fda2c542e475bf85731facc71442d89d0e3393a7f015002cfa4b71c21a9a61726827cbfd5de4672e96060c5093820443e7')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-ghatkopar@lifelink.com', passwordHash = '380b5f6e3521eca10178b3ffe0bd0c75:9ae75f931bd32fa93594fca32f87c8fda2c542e475bf85731facc71442d89d0e3393a7f015002cfa4b71c21a9a61726827cbfd5de4672e96060c5093820443e7';

-- Doctor: Dr. Ananya P. Joshi, MBBS (General Practice - Bhandup West Medical Park)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-bhandup', 'Dr. Ananya P. Joshi, MBBS', 'central-general-practice-bhandup@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Ananya P. Joshi, MBBS', email = 'central-general-practice-bhandup@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-bhandup'), 'mock-central-general-practice-bhandup', 'central-general-practice-bhandup@lifelink.com', '930f22e6798ac93703febc3ff3fc4051:7c0991168a49938c6b451fddd230bba636360bb6e93a8c411d1cc5e02651b3562334d6725fbf7b88ede07788a8cd5e6a77a0175efb8c8e23b27e3b4b9bbe7677')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-bhandup@lifelink.com', passwordHash = '930f22e6798ac93703febc3ff3fc4051:7c0991168a49938c6b451fddd230bba636360bb6e93a8c411d1cc5e02651b3562334d6725fbf7b88ede07788a8cd5e6a77a0175efb8c8e23b27e3b4b9bbe7677';

-- Doctor: Dr. Rohan K. Sengupta, MBBS, MD (General Practice - Thane West Civic Medical Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-thane', 'Dr. Rohan K. Sengupta, MBBS, MD', 'central-general-practice-thane@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Rohan K. Sengupta, MBBS, MD', email = 'central-general-practice-thane@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-thane'), 'mock-central-general-practice-thane', 'central-general-practice-thane@lifelink.com', '8b1f4972d3fe6ca1be4c63fdfcaf2502:93014aff8b8702ebe49e355eeedb87c483dd366940f862e3cca2fce775320ec6331ad2895bb5c8a893f45c4c58d9a8b162cb23021c7a4df4c4dfe45f10dbcb5c')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-thane@lifelink.com', passwordHash = '8b1f4972d3fe6ca1be4c63fdfcaf2502:93014aff8b8702ebe49e355eeedb87c483dd366940f862e3cca2fce775320ec6331ad2895bb5c8a893f45c4c58d9a8b162cb23021c7a4df4c4dfe45f10dbcb5c';

-- Doctor: Dr. Tanvi R. Kirloskar, MBBS (General Practice - Mulund West Wellness Corridor)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-mulund', 'Dr. Tanvi R. Kirloskar, MBBS', 'central-general-practice-mulund@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Tanvi R. Kirloskar, MBBS', email = 'central-general-practice-mulund@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-mulund'), 'mock-central-general-practice-mulund', 'central-general-practice-mulund@lifelink.com', 'e2a80e05a3c6a5e5335edb4d90e96db9:a41574fbc3b580c0b2c87a97c373389e96faf5f3c1790e09fdc4594c80baa9f53abf732e5ba8205507cf255ed2167d8d10e6e63156137b42b07f0828695bf9e4')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-mulund@lifelink.com', passwordHash = 'e2a80e05a3c6a5e5335edb4d90e96db9:a41574fbc3b580c0b2c87a97c373389e96faf5f3c1790e09fdc4594c80baa9f53abf732e5ba8205507cf255ed2167d8d10e6e63156137b42b07f0828695bf9e4';

-- Doctor: Dr. Neil P. Somaiya, MBBS (General Practice - Diva Central Health Enclave)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-diva', 'Dr. Neil P. Somaiya, MBBS', 'central-general-practice-diva@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Neil P. Somaiya, MBBS', email = 'central-general-practice-diva@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-diva'), 'mock-central-general-practice-diva', 'central-general-practice-diva@lifelink.com', '6717807e1a184d0edb181da73eaa234a:b9d2fc430aa6c92ce75730501a129748f833dc2eeafb61f26e66b84e88f2abfd40bdbf704e1c2a4956f13b1201143b706c956c5607cd388e9c5a973fc275655e')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-diva@lifelink.com', passwordHash = '6717807e1a184d0edb181da73eaa234a:b9d2fc430aa6c92ce75730501a129748f833dc2eeafb61f26e66b84e88f2abfd40bdbf704e1c2a4956f13b1201143b706c956c5607cd388e9c5a973fc275655e';

-- Doctor: Dr. Avantika B. Deshmukh, MBBS (General Practice - Kopar Civic Care District)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-kopar', 'Dr. Avantika B. Deshmukh, MBBS', 'central-general-practice-kopar@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Avantika B. Deshmukh, MBBS', email = 'central-general-practice-kopar@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-kopar'), 'mock-central-general-practice-kopar', 'central-general-practice-kopar@lifelink.com', '0a9a3532104e046ef55dda0a5294d4c0:0c884eb553422ab73af286ef1c6799a38ea1bc285c58e463dde177be6931692b24137548e048f3a6f68d44bc8a15cbf8e243cb7555890809f998e19d789d127f')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-kopar@lifelink.com', passwordHash = '0a9a3532104e046ef55dda0a5294d4c0:0c884eb553422ab73af286ef1c6799a38ea1bc285c58e463dde177be6931692b24137548e048f3a6f68d44bc8a15cbf8e243cb7555890809f998e19d789d127f';

-- Doctor: Dr. Kabir A. Mahajan, MBBS (General Practice - Dombivli East Healthcare Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-dombivli', 'Dr. Kabir A. Mahajan, MBBS', 'central-general-practice-dombivli@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Kabir A. Mahajan, MBBS', email = 'central-general-practice-dombivli@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-dombivli'), 'mock-central-general-practice-dombivli', 'central-general-practice-dombivli@lifelink.com', '407393b96a64a62c7e33573f27d4ec3f:ce4bd734b9ff49881108705c48edec93ddda615fdfac747b5689753cb7a9ccf03a85fafb182145dc190affdcf9076cc0b890fdd87619e57a41911c43a90c6cee')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-dombivli@lifelink.com', passwordHash = '407393b96a64a62c7e33573f27d4ec3f:ce4bd734b9ff49881108705c48edec93ddda615fdfac747b5689753cb7a9ccf03a85fafb182145dc190affdcf9076cc0b890fdd87619e57a41911c43a90c6cee';

-- Doctor: Dr. Meera K. Nambiar, MBBS (General Practice - Thakurli Township Medical Center)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-thakurli', 'Dr. Meera K. Nambiar, MBBS', 'central-general-practice-thakurli@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Meera K. Nambiar, MBBS', email = 'central-general-practice-thakurli@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-thakurli'), 'mock-central-general-practice-thakurli', 'central-general-practice-thakurli@lifelink.com', '2a81da5ddaa1aff44b3afcfdbdb83e20:1b78fdcd14d5b93f7a4ed218beedd0996afa43d0f48c9f3b71046c70574be80bea7e8ae651b7a5b1bb0a50ba0f57f8d2fcf0cd9a76351af1112378a37278b6e2')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-thakurli@lifelink.com', passwordHash = '2a81da5ddaa1aff44b3afcfdbdb83e20:1b78fdcd14d5b93f7a4ed218beedd0996afa43d0f48c9f3b71046c70574be80bea7e8ae651b7a5b1bb0a50ba0f57f8d2fcf0cd9a76351af1112378a37278b6e2';

-- Doctor: Dr. Devendra C. Sawant, MBBS, MD (General Practice - Marine Lines & Churchgate Boulevard)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-general-practice-churchgate', 'Dr. Devendra C. Sawant, MBBS, MD', 'western-general-practice-churchgate@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Devendra C. Sawant, MBBS, MD', email = 'western-general-practice-churchgate@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-general-practice-churchgate'), 'mock-western-general-practice-churchgate', 'western-general-practice-churchgate@lifelink.com', '71720d9bdbd2546174b8706b6f25d237:058245594d71af4e505f99cd792f67837d4e5067ac89009233b1be0708dd34095733ff96dd38c933c884d752e7a1fb5aed32221bbbbf844c24028222ca59577a')
ON DUPLICATE KEY UPDATE email = 'western-general-practice-churchgate@lifelink.com', passwordHash = '71720d9bdbd2546174b8706b6f25d237:058245594d71af4e505f99cd792f67837d4e5067ac89009233b1be0708dd34095733ff96dd38c933c884d752e7a1fb5aed32221bbbbf844c24028222ca59577a';

-- Doctor: Dr. Shalini K. Pillai, MBBS (General Practice - Dadar West Medical Square)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-general-practice-dadar', 'Dr. Shalini K. Pillai, MBBS', 'western-general-practice-dadar@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Shalini K. Pillai, MBBS', email = 'western-general-practice-dadar@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-general-practice-dadar'), 'mock-western-general-practice-dadar', 'western-general-practice-dadar@lifelink.com', '8b16eea108fc816cee3de1f432f4c723:4027ab38ccc65e17142cc51b2b5be583e90f9ee838d158274035680c4a35ecf1973901a25c94a8c6884de0a92220c360415516f0f5091919c787fdbc9f8b3864')
ON DUPLICATE KEY UPDATE email = 'western-general-practice-dadar@lifelink.com', passwordHash = '8b16eea108fc816cee3de1f432f4c723:4027ab38ccc65e17142cc51b2b5be583e90f9ee838d158274035680c4a35ecf1973901a25c94a8c6884de0a92220c360415516f0f5091919c787fdbc9f8b3864';

-- Doctor: Dr. Prakash J. Menon, MBBS (General Practice - Andheri West Healthcare Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-general-practice-andheri', 'Dr. Prakash J. Menon, MBBS', 'western-general-practice-andheri@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Prakash J. Menon, MBBS', email = 'western-general-practice-andheri@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-general-practice-andheri'), 'mock-western-general-practice-andheri', 'western-general-practice-andheri@lifelink.com', '5a707ab4cca0ffffff70abdcc30a5ccc:6dbb3064f0d8929b9fbaad8c59a3b1d8e6a468b0a87a1836ffd7fd24b9714cce65b3713a4adc1b5d529702d4d3dfbd47ec42989954affb08f7c30c7fb2de033a')
ON DUPLICATE KEY UPDATE email = 'western-general-practice-andheri@lifelink.com', passwordHash = '5a707ab4cca0ffffff70abdcc30a5ccc:6dbb3064f0d8929b9fbaad8c59a3b1d8e6a468b0a87a1836ffd7fd24b9714cce65b3713a4adc1b5d529702d4d3dfbd47ec42989954affb08f7c30c7fb2de033a';

-- Doctor: Dr. Chetan R. Varma, MBBS (General Practice - Goregaon West Medical Enclave)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-general-practice-goregaon', 'Dr. Chetan R. Varma, MBBS', 'western-general-practice-goregaon@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Chetan R. Varma, MBBS', email = 'western-general-practice-goregaon@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-general-practice-goregaon'), 'mock-western-general-practice-goregaon', 'western-general-practice-goregaon@lifelink.com', 'a2b4f5dead36926ec8b14206a69e2f3e:9befde7c51f64510e18c592103d20a4201fb11586f94de2e730a4be194ed70774732b7ad57ab05387860f4d4b648854e30baa4e25c82f9363788d5eff85d5c00')
ON DUPLICATE KEY UPDATE email = 'western-general-practice-goregaon@lifelink.com', passwordHash = 'a2b4f5dead36926ec8b14206a69e2f3e:9befde7c51f64510e18c592103d20a4201fb11586f94de2e730a4be194ed70774732b7ad57ab05387860f4d4b648854e30baa4e25c82f9363788d5eff85d5c00';

-- Doctor: Dr. Sneha R. Kulkarni, MBBS (General Practice - Borivali West Health Corridor)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-general-practice-borivali', 'Dr. Sneha R. Kulkarni, MBBS', 'western-general-practice-borivali@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Sneha R. Kulkarni, MBBS', email = 'western-general-practice-borivali@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-general-practice-borivali'), 'mock-western-general-practice-borivali', 'western-general-practice-borivali@lifelink.com', '5394ec201835731fc8eed155c7170979:e68648dee0a39fb985465d03e83323f3fa2ef981a8ecb014252044c3edf7d762bd6a07344fbe8ad18092ffd5a38d69d55fd48b9c680e6379cb83d0a9f15b3393')
ON DUPLICATE KEY UPDATE email = 'western-general-practice-borivali@lifelink.com', passwordHash = '5394ec201835731fc8eed155c7170979:e68648dee0a39fb985465d03e83323f3fa2ef981a8ecb014252044c3edf7d762bd6a07344fbe8ad18092ffd5a38d69d55fd48b9c680e6379cb83d0a9f15b3393';

-- Doctor: Dr. Pankaj D. Shah, MBBS (General Practice - Sewri Coastal Medical District)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-general-practice-sewri', 'Dr. Pankaj D. Shah, MBBS', 'harbour-general-practice-sewri@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Pankaj D. Shah, MBBS', email = 'harbour-general-practice-sewri@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-general-practice-sewri'), 'mock-harbour-general-practice-sewri', 'harbour-general-practice-sewri@lifelink.com', 'baac243900543733a0f78b92c56962eb:cfb18250a2c5eb41ee54dc1c5c558f18ab3821bef18b26f3d78c524a8e28d309d12daebb0acf47d9dacda7a4e3fa984153b3b59bb79b778cf6c397da7cab93c1')
ON DUPLICATE KEY UPDATE email = 'harbour-general-practice-sewri@lifelink.com', passwordHash = 'baac243900543733a0f78b92c56962eb:cfb18250a2c5eb41ee54dc1c5c558f18ab3821bef18b26f3d78c524a8e28d309d12daebb0acf47d9dacda7a4e3fa984153b3b59bb79b778cf6c397da7cab93c1';

-- Doctor: Dr. Vivek N. Deshpande, MBBS (General Practice - Chembur Diamond Garden Sector)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-general-practice-chembur', 'Dr. Vivek N. Deshpande, MBBS', 'harbour-general-practice-chembur@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Vivek N. Deshpande, MBBS', email = 'harbour-general-practice-chembur@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-general-practice-chembur'), 'mock-harbour-general-practice-chembur', 'harbour-general-practice-chembur@lifelink.com', '5b768f303a6820be4c214d0a9458661b:9bfe5104ff76ba26f81d06c9a47c804b882b022ff446082bcc3d28f1089af7277a9731096a716fc8b1e70efd1c745cebdef7bc8e82e7ff32a41905413281b9f5')
ON DUPLICATE KEY UPDATE email = 'harbour-general-practice-chembur@lifelink.com', passwordHash = '5b768f303a6820be4c214d0a9458661b:9bfe5104ff76ba26f81d06c9a47c804b882b022ff446082bcc3d28f1089af7277a9731096a716fc8b1e70efd1c745cebdef7bc8e82e7ff32a41905413281b9f5';

-- Doctor: Dr. Rohan T. Bapat, MBBS (General Practice - Vashi Sector 15 Medical Park)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-general-practice-vashi', 'Dr. Rohan T. Bapat, MBBS', 'harbour-general-practice-vashi@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Rohan T. Bapat, MBBS', email = 'harbour-general-practice-vashi@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-general-practice-vashi'), 'mock-harbour-general-practice-vashi', 'harbour-general-practice-vashi@lifelink.com', '8ec247c8e3286167b7a4b9386e444608:009acdefa49bac0d7363a9eac2a64e11587ba6e0f53135abc54cd97a2d70adcedae0b481b9d8e59b5f1c51391f682fa9c730db8f0f17f3001c2a1f8289cf140c')
ON DUPLICATE KEY UPDATE email = 'harbour-general-practice-vashi@lifelink.com', passwordHash = '8ec247c8e3286167b7a4b9386e444608:009acdefa49bac0d7363a9eac2a64e11587ba6e0f53135abc54cd97a2d70adcedae0b481b9d8e59b5f1c51391f682fa9c730db8f0f17f3001c2a1f8289cf140c';

-- Doctor: Dr. Preeti S. Saxena, MBBS (General Practice - Nerul Palm Beach Healthcare Zone)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-general-practice-nerul', 'Dr. Preeti S. Saxena, MBBS', 'harbour-general-practice-nerul@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Preeti S. Saxena, MBBS', email = 'harbour-general-practice-nerul@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-general-practice-nerul'), 'mock-harbour-general-practice-nerul', 'harbour-general-practice-nerul@lifelink.com', 'd1dd19d7c242be8033c1ed525bf3c995:33184d62ae269f9f7147e9661450ab4248c617cab6da38a7e516e750f23dcf3bac41d7ba2c666598b5f2e78de68ab75f57eb81dbd0ffadf7cd76b18da8155510')
ON DUPLICATE KEY UPDATE email = 'harbour-general-practice-nerul@lifelink.com', passwordHash = 'd1dd19d7c242be8033c1ed525bf3c995:33184d62ae269f9f7147e9661450ab4248c617cab6da38a7e516e750f23dcf3bac41d7ba2c666598b5f2e78de68ab75f57eb81dbd0ffadf7cd76b18da8155510';

-- Doctor: Dr. Alok M. Pandey, MBBS (General Practice - Panvel City Wellness Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-general-practice-panvel', 'Dr. Alok M. Pandey, MBBS', 'harbour-general-practice-panvel@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Alok M. Pandey, MBBS', email = 'harbour-general-practice-panvel@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-general-practice-panvel'), 'mock-harbour-general-practice-panvel', 'harbour-general-practice-panvel@lifelink.com', '01ae1aaa87183a1d154b99674550006f:d8a2cbabccbf9ddf2058a90bb5aaf7504ceb61b9a70d44ba08d28cdac23d03362769848614465a87f08a8f3d44372d00bcab9d7311da6058bd2e3510ab53eec9')
ON DUPLICATE KEY UPDATE email = 'harbour-general-practice-panvel@lifelink.com', passwordHash = '01ae1aaa87183a1d154b99674550006f:d8a2cbabccbf9ddf2058a90bb5aaf7504ceb61b9a70d44ba08d28cdac23d03362769848614465a87f08a8f3d44372d00bcab9d7311da6058bd2e3510ab53eec9';

-- Doctor: Dr. Rajesh V. Varma, MD, DM (Cardiology) (Cardiology - Fort Medical Enclave)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-cardiology-csmt', 'Dr. Rajesh V. Varma, MD, DM (Cardiology)', 'central-cardiology-csmt@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Rajesh V. Varma, MD, DM (Cardiology)', email = 'central-cardiology-csmt@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-cardiology-csmt'), 'mock-central-cardiology-csmt', 'central-cardiology-csmt@lifelink.com', 'edd122ca87bf5eda985c397a2a6ff50b:a9a79458917e204517d4021e46ac418e8c9fa737a8ecf71dfb1734346f3df7cd1c625b2c77d79ae850efbe9aa1000cba5b1a69033818767a0a1c6ca01c4d3ffd')
ON DUPLICATE KEY UPDATE email = 'central-cardiology-csmt@lifelink.com', passwordHash = 'edd122ca87bf5eda985c397a2a6ff50b:a9a79458917e204517d4021e46ac418e8c9fa737a8ecf71dfb1734346f3df7cd1c625b2c77d79ae850efbe9aa1000cba5b1a69033818767a0a1c6ca01c4d3ffd';

-- Doctor: Dr. Jayant V. Bhatt, MD, DM (Cardiology) (Cardiology - Andheri West Healthcare Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-cardiology-andheri', 'Dr. Jayant V. Bhatt, MD, DM (Cardiology)', 'western-cardiology-andheri@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Jayant V. Bhatt, MD, DM (Cardiology)', email = 'western-cardiology-andheri@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-cardiology-andheri'), 'mock-western-cardiology-andheri', 'western-cardiology-andheri@lifelink.com', 'd8592f55c27a90ee04b1c9c0da7081bd:8dc1e2628b14750fe02b11e824f8a772deebb45caaed7b4a9a46a5a6c3c4741a1a4d1b4f1cdfa78a8be910ef54d1388d7fe3b73791557e9bfbcee67a88e2564c')
ON DUPLICATE KEY UPDATE email = 'western-cardiology-andheri@lifelink.com', passwordHash = 'd8592f55c27a90ee04b1c9c0da7081bd:8dc1e2628b14750fe02b11e824f8a772deebb45caaed7b4a9a46a5a6c3c4741a1a4d1b4f1cdfa78a8be910ef54d1388d7fe3b73791557e9bfbcee67a88e2564c';

-- Doctor: Dr. Reema N. Shetty, MD, DM (Cardiology) (Cardiology - Vashi Sector 15 Medical Park)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-cardiology-vashi', 'Dr. Reema N. Shetty, MD, DM (Cardiology)', 'harbour-cardiology-vashi@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Reema N. Shetty, MD, DM (Cardiology)', email = 'harbour-cardiology-vashi@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-cardiology-vashi'), 'mock-harbour-cardiology-vashi', 'harbour-cardiology-vashi@lifelink.com', '912ea72ef92336330e544bbd306d7726:07cfaf9801f5b688c777a773b9e9e54fb96debceb6235fc6b31196bb98de759281b4aff9ef58c6581c6f43591056bd83a8f8c3023244e21b72e26a4afed8400d')
ON DUPLICATE KEY UPDATE email = 'harbour-cardiology-vashi@lifelink.com', passwordHash = '912ea72ef92336330e544bbd306d7726:07cfaf9801f5b688c777a773b9e9e54fb96debceb6235fc6b31196bb98de759281b4aff9ef58c6581c6f43591056bd83a8f8c3023244e21b72e26a4afed8400d';

-- Doctor: Dr. Rahul E. Tambe, MD (Dermatology, DNB) (Dermatology - Ghatkopar East Health District)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-dermatology-ghatkopar', 'Dr. Rahul E. Tambe, MD (Dermatology, DNB)', 'central-dermatology-ghatkopar@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Rahul E. Tambe, MD (Dermatology, DNB)', email = 'central-dermatology-ghatkopar@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-dermatology-ghatkopar'), 'mock-central-dermatology-ghatkopar', 'central-dermatology-ghatkopar@lifelink.com', 'cc736118425e2de3a6b5b8e5400e30b0:c96b35bda1fd132b8ecd19eb6ac6eb2677d1c035282d17517ffbb093478e254d8271ea2a107bd50eed2c5c15267543d2c5eb70c938412d53f312aeadb5980f00')
ON DUPLICATE KEY UPDATE email = 'central-dermatology-ghatkopar@lifelink.com', passwordHash = 'cc736118425e2de3a6b5b8e5400e30b0:c96b35bda1fd132b8ecd19eb6ac6eb2677d1c035282d17517ffbb093478e254d8271ea2a107bd50eed2c5c15267543d2c5eb70c938412d53f312aeadb5980f00';

-- Doctor: Dr. Veena M. Shinde, MD (Dermatology) (Dermatology - Marine Lines & Churchgate Boulevard)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-dermatology-churchgate', 'Dr. Veena M. Shinde, MD (Dermatology)', 'western-dermatology-churchgate@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Veena M. Shinde, MD (Dermatology)', email = 'western-dermatology-churchgate@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-dermatology-churchgate'), 'mock-western-dermatology-churchgate', 'western-dermatology-churchgate@lifelink.com', '92b5145312d2f98ad4599b4184c0b2c3:d67c2732c2c0e1a53bef2f8ad4affc0afb5adb4d635810b7675c1e6ae0fa2bd647df43cd88e772e9d346651f96802dd27be8c76edf3b11b9e116b9a2bc4fbea5')
ON DUPLICATE KEY UPDATE email = 'western-dermatology-churchgate@lifelink.com', passwordHash = '92b5145312d2f98ad4599b4184c0b2c3:d67c2732c2c0e1a53bef2f8ad4affc0afb5adb4d635810b7675c1e6ae0fa2bd647df43cd88e772e9d346651f96802dd27be8c76edf3b11b9e116b9a2bc4fbea5';

-- Doctor: Dr. Smita K. Patil, MD (Dermatology) (Dermatology - Chembur Diamond Garden Sector)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-dermatology-chembur', 'Dr. Smita K. Patil, MD (Dermatology)', 'harbour-dermatology-chembur@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Smita K. Patil, MD (Dermatology)', email = 'harbour-dermatology-chembur@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-dermatology-chembur'), 'mock-harbour-dermatology-chembur', 'harbour-dermatology-chembur@lifelink.com', '54971642af1ba160c4e06317f3452a77:bbbe4f742becc61582f699844c5667a91616130e23a3811bb46eb1805bbcaf8a1f10f8f4f39bd15c0442fdda5ff400f576355948ec343cd2c7fb61c49fe4c32b')
ON DUPLICATE KEY UPDATE email = 'harbour-dermatology-chembur@lifelink.com', passwordHash = '54971642af1ba160c4e06317f3452a77:bbbe4f742becc61582f699844c5667a91616130e23a3811bb46eb1805bbcaf8a1f10f8f4f39bd15c0442fdda5ff400f576355948ec343cd2c7fb61c49fe4c32b';

-- Doctor: Dr. Arvind N. Shenoy, MS (Orthopedics) (Orthopedics - Bhandup West Medical Park)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-orthopedics-bhandup', 'Dr. Arvind N. Shenoy, MS (Orthopedics)', 'central-orthopedics-bhandup@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Arvind N. Shenoy, MS (Orthopedics)', email = 'central-orthopedics-bhandup@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-orthopedics-bhandup'), 'mock-central-orthopedics-bhandup', 'central-orthopedics-bhandup@lifelink.com', '469fde770e3e66c93493562369187c33:80a9b5ed3ee65d6d77d43ad636d7a72c7fba1d8546fa30f11f0a1ee55e5772b5a19a28f010752e2d62754737790642141c8774cfacffb3d3f46ea67eb637049b')
ON DUPLICATE KEY UPDATE email = 'central-orthopedics-bhandup@lifelink.com', passwordHash = '469fde770e3e66c93493562369187c33:80a9b5ed3ee65d6d77d43ad636d7a72c7fba1d8546fa30f11f0a1ee55e5772b5a19a28f010752e2d62754737790642141c8774cfacffb3d3f46ea67eb637049b';

-- Doctor: Dr. Sunita K. Jagtap, MS (Orthopedics, MCh) (Orthopedics - Dadar West Medical Square)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-orthopedics-dadar', 'Dr. Sunita K. Jagtap, MS (Orthopedics, MCh)', 'western-orthopedics-dadar@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Sunita K. Jagtap, MS (Orthopedics, MCh)', email = 'western-orthopedics-dadar@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-orthopedics-dadar'), 'mock-western-orthopedics-dadar', 'western-orthopedics-dadar@lifelink.com', '742fb278fcfda32c208de99de9d61297:9d011932512eb77edd6da35b4274d311cec1e6fc57b0a855dff78ad27bd988b50b04e0a018fb5459acbdc84a212f3b0bd4e87d9eba6afacbba7f7a7e72383f3d')
ON DUPLICATE KEY UPDATE email = 'western-orthopedics-dadar@lifelink.com', passwordHash = '742fb278fcfda32c208de99de9d61297:9d011932512eb77edd6da35b4274d311cec1e6fc57b0a855dff78ad27bd988b50b04e0a018fb5459acbdc84a212f3b0bd4e87d9eba6afacbba7f7a7e72383f3d';

-- Doctor: Dr. Shrikant R. Gokhale, MS (Orthopedics) (Orthopedics - Panvel City Wellness Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-orthopedics-panvel', 'Dr. Shrikant R. Gokhale, MS (Orthopedics)', 'harbour-orthopedics-panvel@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Shrikant R. Gokhale, MS (Orthopedics)', email = 'harbour-orthopedics-panvel@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-orthopedics-panvel'), 'mock-harbour-orthopedics-panvel', 'harbour-orthopedics-panvel@lifelink.com', '8e59934ba8b0196da9fbadcca8cb0e1a:f41e5c3188902f74258750950cb71f33bba22ca991df694fe36bf1634d9e59e3828a039d2311c565e448353e87d8e621722ed810866d525fdf1e9c9d170d7c0a')
ON DUPLICATE KEY UPDATE email = 'harbour-orthopedics-panvel@lifelink.com', passwordHash = '8e59934ba8b0196da9fbadcca8cb0e1a:f41e5c3188902f74258750950cb71f33bba22ca991df694fe36bf1634d9e59e3828a039d2311c565e448353e87d8e621722ed810866d525fdf1e9c9d170d7c0a';

-- Doctor: Dr. Rameshwar T. Gaikwad, MD, DM (Neurology) (Neurology - Thane West Civic Medical Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-neurology-thane', 'Dr. Rameshwar T. Gaikwad, MD, DM (Neurology)', 'central-neurology-thane@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Rameshwar T. Gaikwad, MD, DM (Neurology)', email = 'central-neurology-thane@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-neurology-thane'), 'mock-central-neurology-thane', 'central-neurology-thane@lifelink.com', '869dcdfff9e997a8ee920cc5f8ae1e94:c62bb955ecb69f1b0405b9927fc39056a8257fb07e24ec3361d45a7a9563cfc3871c4569a92b809b9d3f4dc3ad27a794ab93f337babb6d08cf23fc9d99cf5d9f')
ON DUPLICATE KEY UPDATE email = 'central-neurology-thane@lifelink.com', passwordHash = '869dcdfff9e997a8ee920cc5f8ae1e94:c62bb955ecb69f1b0405b9927fc39056a8257fb07e24ec3361d45a7a9563cfc3871c4569a92b809b9d3f4dc3ad27a794ab93f337babb6d08cf23fc9d99cf5d9f';

-- Doctor: Dr. Kavita M. Joshi, MD, DM (Neurology) (Neurology - Borivali West Health Corridor)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-neurology-borivali', 'Dr. Kavita M. Joshi, MD, DM (Neurology)', 'western-neurology-borivali@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Kavita M. Joshi, MD, DM (Neurology)', email = 'western-neurology-borivali@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-neurology-borivali'), 'mock-western-neurology-borivali', 'western-neurology-borivali@lifelink.com', 'e77196712c1868dcb099b260b01f2224:9eb9097c6a36edd5e6a8d975ec40a34b1356c5f939c50694896067999e3fa9d3c46d63135eef2a9a2b434602d6dc245e1399dc3ddbf59fc1a4545c065832c798')
ON DUPLICATE KEY UPDATE email = 'western-neurology-borivali@lifelink.com', passwordHash = 'e77196712c1868dcb099b260b01f2224:9eb9097c6a36edd5e6a8d975ec40a34b1356c5f939c50694896067999e3fa9d3c46d63135eef2a9a2b434602d6dc245e1399dc3ddbf59fc1a4545c065832c798';

-- Doctor: Dr. Nitin H. Agrawal, MD, DM (Neurology) (Neurology - Nerul Palm Beach Healthcare Zone)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-neurology-nerul', 'Dr. Nitin H. Agrawal, MD, DM (Neurology)', 'harbour-neurology-nerul@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Nitin H. Agrawal, MD, DM (Neurology)', email = 'harbour-neurology-nerul@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-neurology-nerul'), 'mock-harbour-neurology-nerul', 'harbour-neurology-nerul@lifelink.com', 'aa73a33cad00684c7950bd4225fbc873:a2c59ab51f1b45fe76d134f8f75edfb0947ea54062a3c54619e57c3cd27800081c7cce22f0033a21dc6154fcbe25ee772b5f43596cf03671afcc603d290d278c')
ON DUPLICATE KEY UPDATE email = 'harbour-neurology-nerul@lifelink.com', passwordHash = 'aa73a33cad00684c7950bd4225fbc873:a2c59ab51f1b45fe76d134f8f75edfb0947ea54062a3c54619e57c3cd27800081c7cce22f0033a21dc6154fcbe25ee772b5f43596cf03671afcc603d290d278c';

-- Doctor: Dr. Deepa V. Nair, MD (Pediatrics, DCH) (Pediatrics - Andheri West Healthcare Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-pediatrics-andheri', 'Dr. Deepa V. Nair, MD (Pediatrics, DCH)', 'western-pediatrics-andheri@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Deepa V. Nair, MD (Pediatrics, DCH)', email = 'western-pediatrics-andheri@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-pediatrics-andheri'), 'mock-western-pediatrics-andheri', 'western-pediatrics-andheri@lifelink.com', 'c24123afce0a8e416eaa9fdba3141fc3:dab47414b576ae32805e5f410d0ac825ac743e8a1f91a286469ed7b5864dc553caa5420cfb20e760fccb39f95e95b04c0a8ca4bc065b6a979dd2f7f9c5001d86')
ON DUPLICATE KEY UPDATE email = 'western-pediatrics-andheri@lifelink.com', passwordHash = 'c24123afce0a8e416eaa9fdba3141fc3:dab47414b576ae32805e5f410d0ac825ac743e8a1f91a286469ed7b5864dc553caa5420cfb20e760fccb39f95e95b04c0a8ca4bc065b6a979dd2f7f9c5001d86';

-- Doctor: Dr. Farhan K. Mehta, MD (Pediatrics) (Pediatrics - Mulund West Wellness Corridor)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-pediatrics-mulund', 'Dr. Farhan K. Mehta, MD (Pediatrics)', 'central-pediatrics-mulund@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Farhan K. Mehta, MD (Pediatrics)', email = 'central-pediatrics-mulund@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-pediatrics-mulund'), 'mock-central-pediatrics-mulund', 'central-pediatrics-mulund@lifelink.com', '4f90a45484a92298fceb77a6ec4f2bb8:07c7c5cec51fc8e14ae8638f233804e4baae50a52355fc0bf91d8c7f9980f1140d564e7c28155a3860f901320df535bbb41cfec56b448d271d2f908cf96fcd7e')
ON DUPLICATE KEY UPDATE email = 'central-pediatrics-mulund@lifelink.com', passwordHash = '4f90a45484a92298fceb77a6ec4f2bb8:07c7c5cec51fc8e14ae8638f233804e4baae50a52355fc0bf91d8c7f9980f1140d564e7c28155a3860f901320df535bbb41cfec56b448d271d2f908cf96fcd7e';

-- Doctor: Dr. Swati P. Bhosale, MD (Pediatrics) (Pediatrics - Vashi Sector 15 Medical Park)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-pediatrics-vashi', 'Dr. Swati P. Bhosale, MD (Pediatrics)', 'harbour-pediatrics-vashi@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Swati P. Bhosale, MD (Pediatrics)', email = 'harbour-pediatrics-vashi@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-pediatrics-vashi'), 'mock-harbour-pediatrics-vashi', 'harbour-pediatrics-vashi@lifelink.com', '7fbce0814975c5c8e82b38dc54c78d3a:3207886f9f0a4c0b6bd8deb41d844c7b45e0867f00228f73b24afcb2ab99fcbb349b104c378b93164f8989fd6801f9d7c3df0c6cfabe030daa3648e894aa77d9')
ON DUPLICATE KEY UPDATE email = 'harbour-pediatrics-vashi@lifelink.com', passwordHash = '7fbce0814975c5c8e82b38dc54c78d3a:3207886f9f0a4c0b6bd8deb41d844c7b45e0867f00228f73b24afcb2ab99fcbb349b104c378b93164f8989fd6801f9d7c3df0c6cfabe030daa3648e894aa77d9';

-- Doctor: Dr. Milind S. Chitnis, MS (Ophthalmology, FICO) (Ophthalmology - Goregaon West Medical Enclave)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-ophthalmology-goregaon', 'Dr. Milind S. Chitnis, MS (Ophthalmology, FICO)', 'western-ophthalmology-goregaon@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Milind S. Chitnis, MS (Ophthalmology, FICO)', email = 'western-ophthalmology-goregaon@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-ophthalmology-goregaon'), 'mock-western-ophthalmology-goregaon', 'western-ophthalmology-goregaon@lifelink.com', '647a5ef4c7635b2f95353ab1962cead8:9bff8d3422658e77e9e47e0fec6086e4c35d0df1613e1a8d5f20b4225a789f2df08a42b24305c96ec11245859cc54eabeb6918be5d3e517328565fbb506f40b2')
ON DUPLICATE KEY UPDATE email = 'western-ophthalmology-goregaon@lifelink.com', passwordHash = '647a5ef4c7635b2f95353ab1962cead8:9bff8d3422658e77e9e47e0fec6086e4c35d0df1613e1a8d5f20b4225a789f2df08a42b24305c96ec11245859cc54eabeb6918be5d3e517328565fbb506f40b2';

-- Doctor: Dr. Harish D. Salunkhe, MS (Ophthalmology) (Ophthalmology - Fort Medical Enclave)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-ophthalmology-csmt', 'Dr. Harish D. Salunkhe, MS (Ophthalmology)', 'central-ophthalmology-csmt@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Harish D. Salunkhe, MS (Ophthalmology)', email = 'central-ophthalmology-csmt@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-ophthalmology-csmt'), 'mock-central-ophthalmology-csmt', 'central-ophthalmology-csmt@lifelink.com', '0c53138e373eda54f1ae6ed6925b344f:a6e8e2486e282c4a83ba95cae7de2c1cb0209a02a39988357eb94ebe6bdae11c194b05d90b644cdcf07cc2cf76bba7f5bc139e0e0cfe869cb142dd74517697f1')
ON DUPLICATE KEY UPDATE email = 'central-ophthalmology-csmt@lifelink.com', passwordHash = '0c53138e373eda54f1ae6ed6925b344f:a6e8e2486e282c4a83ba95cae7de2c1cb0209a02a39988357eb94ebe6bdae11c194b05d90b644cdcf07cc2cf76bba7f5bc139e0e0cfe869cb142dd74517697f1';

-- Doctor: Dr. Vandana S. Rao, MS (Ophthalmology) (Ophthalmology - Chembur Diamond Garden Sector)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-ophthalmology-chembur', 'Dr. Vandana S. Rao, MS (Ophthalmology)', 'harbour-ophthalmology-chembur@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Vandana S. Rao, MS (Ophthalmology)', email = 'harbour-ophthalmology-chembur@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-ophthalmology-chembur'), 'mock-harbour-ophthalmology-chembur', 'harbour-ophthalmology-chembur@lifelink.com', '377726a48f1dcdad39a27c3278c49ebd:30d71e0e6ec45adc70d8d8b0d6b0b2db94be028c8a142dd46d93cd5fdeb0df0a0520ddf58d8cae5076f8be9afc141917bb4c43d2cb33ff6d71541eb18c6c36b0')
ON DUPLICATE KEY UPDATE email = 'harbour-ophthalmology-chembur@lifelink.com', passwordHash = '377726a48f1dcdad39a27c3278c49ebd:30d71e0e6ec45adc70d8d8b0d6b0b2db94be028c8a142dd46d93cd5fdeb0df0a0520ddf58d8cae5076f8be9afc141917bb4c43d2cb33ff6d71541eb18c6c36b0';

-- Doctor: Dr. Anil M. Kumar, MD, DM (Gastroenterology) (Gastroenterology - Borivali West Health Corridor)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-gastroenterology-borivali', 'Dr. Anil M. Kumar, MD, DM (Gastroenterology)', 'western-gastroenterology-borivali@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Anil M. Kumar, MD, DM (Gastroenterology)', email = 'western-gastroenterology-borivali@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-gastroenterology-borivali'), 'mock-western-gastroenterology-borivali', 'western-gastroenterology-borivali@lifelink.com', '98553250e11fc5dfda6ee9fa21ad311b:3de2891db2d4d4a335e4b6f78289d28fbf76a1aa903111761c7922af7122a1304d18c319411f9413932f93485ad599010da34a6ea5b7b8271ba6d6112cb825a4')
ON DUPLICATE KEY UPDATE email = 'western-gastroenterology-borivali@lifelink.com', passwordHash = '98553250e11fc5dfda6ee9fa21ad311b:3de2891db2d4d4a335e4b6f78289d28fbf76a1aa903111761c7922af7122a1304d18c319411f9413932f93485ad599010da34a6ea5b7b8271ba6d6112cb825a4';

-- Doctor: Dr. Sanjeev B. Kulkarni, MD, DM (Gastroenterology) (Gastroenterology - Thane West Civic Medical Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-gastroenterology-thane', 'Dr. Sanjeev B. Kulkarni, MD, DM (Gastroenterology)', 'central-gastroenterology-thane@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Sanjeev B. Kulkarni, MD, DM (Gastroenterology)', email = 'central-gastroenterology-thane@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-gastroenterology-thane'), 'mock-central-gastroenterology-thane', 'central-gastroenterology-thane@lifelink.com', '495ba6de834735b2eb636b7be4eb1d2c:d46e7181ba2de5069425648d1bc63c1a174093418746d610acb2962fe18da470b6baf0f9922b74e891720038477d80eb9e9b7db135eecda72dd60d5f9445941f')
ON DUPLICATE KEY UPDATE email = 'central-gastroenterology-thane@lifelink.com', passwordHash = '495ba6de834735b2eb636b7be4eb1d2c:d46e7181ba2de5069425648d1bc63c1a174093418746d610acb2962fe18da470b6baf0f9922b74e891720038477d80eb9e9b7db135eecda72dd60d5f9445941f';

-- Doctor: Dr. Ritu G. Kapoor, MD, DM (Gastroenterology) (Gastroenterology - Sewri Coastal Medical District)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-gastroenterology-sewri', 'Dr. Ritu G. Kapoor, MD, DM (Gastroenterology)', 'harbour-gastroenterology-sewri@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Ritu G. Kapoor, MD, DM (Gastroenterology)', email = 'harbour-gastroenterology-sewri@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-gastroenterology-sewri'), 'mock-harbour-gastroenterology-sewri', 'harbour-gastroenterology-sewri@lifelink.com', '199f0551d5a34668c393f31799adfee2:1ddc4fd6af78fcde490dab1a46313f1faefe0285948b61a0cdb5d013fa42eb62b227a345139aca4043e7c692d0847766232d36d2bd32e9c0d32f4f95fe8801e8')
ON DUPLICATE KEY UPDATE email = 'harbour-gastroenterology-sewri@lifelink.com', passwordHash = '199f0551d5a34668c393f31799adfee2:1ddc4fd6af78fcde490dab1a46313f1faefe0285948b61a0cdb5d013fa42eb62b227a345139aca4043e7c692d0847766232d36d2bd32e9c0d32f4f95fe8801e8';

-- Doctor: Dr. Siddharth P. Merchant, MD (Psychiatry, DPM) (Psychiatry - Sewri Coastal Medical District)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-psychiatry-sewri', 'Dr. Siddharth P. Merchant, MD (Psychiatry, DPM)', 'harbour-psychiatry-sewri@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Siddharth P. Merchant, MD (Psychiatry, DPM)', email = 'harbour-psychiatry-sewri@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-psychiatry-sewri'), 'mock-harbour-psychiatry-sewri', 'harbour-psychiatry-sewri@lifelink.com', '8ac345a4cdc79097ad8a17be03c13efd:0544c310f6bf96f6e16b7228c6c8b488f3021449edf6ca37e12787eebb0ec07cc4aa89ec9b41ada6e2e354c3269198a1681d8430d8459fbf522356ce942e2756')
ON DUPLICATE KEY UPDATE email = 'harbour-psychiatry-sewri@lifelink.com', passwordHash = '8ac345a4cdc79097ad8a17be03c13efd:0544c310f6bf96f6e16b7228c6c8b488f3021449edf6ca37e12787eebb0ec07cc4aa89ec9b41ada6e2e354c3269198a1681d8430d8459fbf522356ce942e2756';

-- Doctor: Dr. Mahesh A. Bhide, MD (Psychiatry) (Psychiatry - Dadar West Medical Square)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-psychiatry-dadar', 'Dr. Mahesh A. Bhide, MD (Psychiatry)', 'western-psychiatry-dadar@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Mahesh A. Bhide, MD (Psychiatry)', email = 'western-psychiatry-dadar@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-psychiatry-dadar'), 'mock-western-psychiatry-dadar', 'western-psychiatry-dadar@lifelink.com', '5620e24c636ddb71d5c718ed7e85d0ce:8fdf9b4a03a9e3c907e9cd0be9daa3e512531dbe6489e6ccdd53d02aea700e7e3368ff31546ad333c5a8c902dadc0fc016f2af8839fb4ad406b86e57484911f4')
ON DUPLICATE KEY UPDATE email = 'western-psychiatry-dadar@lifelink.com', passwordHash = '5620e24c636ddb71d5c718ed7e85d0ce:8fdf9b4a03a9e3c907e9cd0be9daa3e512531dbe6489e6ccdd53d02aea700e7e3368ff31546ad333c5a8c902dadc0fc016f2af8839fb4ad406b86e57484911f4';

-- Doctor: Dr. Sanjay D. Varma, MD (Psychiatry) (Psychiatry - Ghatkopar East Health District)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-psychiatry-ghatkopar', 'Dr. Sanjay D. Varma, MD (Psychiatry)', 'central-psychiatry-ghatkopar@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Sanjay D. Varma, MD (Psychiatry)', email = 'central-psychiatry-ghatkopar@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-psychiatry-ghatkopar'), 'mock-central-psychiatry-ghatkopar', 'central-psychiatry-ghatkopar@lifelink.com', '28d0dd0daf1550b5c820472b33322dea:7c52a37b864b8f01a81768fcb712e2c75d74e43ad0fe035fc2c66dc422d9fe46f6e6f8409a01dc10387b14918b1886a4acd115681a14cd31dc03ce470e240e36')
ON DUPLICATE KEY UPDATE email = 'central-psychiatry-ghatkopar@lifelink.com', passwordHash = '28d0dd0daf1550b5c820472b33322dea:7c52a37b864b8f01a81768fcb712e2c75d74e43ad0fe035fc2c66dc422d9fe46f6e6f8409a01dc10387b14918b1886a4acd115681a14cd31dc03ce470e240e36';

-- Doctor: Dr. Pooja S. Chawla, MD, DM (Endocrinology) (Endocrinology - Chembur Diamond Garden Sector)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-endocrinology-chembur', 'Dr. Pooja S. Chawla, MD, DM (Endocrinology)', 'harbour-endocrinology-chembur@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Pooja S. Chawla, MD, DM (Endocrinology)', email = 'harbour-endocrinology-chembur@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-endocrinology-chembur'), 'mock-harbour-endocrinology-chembur', 'harbour-endocrinology-chembur@lifelink.com', 'e3335296e77c643ebed316f537c064ba:e552bfefa690b1a803b3d3f017b3c839d98de81d7e83773d8bb83b62cd9896814e8297d657e51fb7ef8ef8941cee4842e28fbe0fe5e659bf03e800c6704f10d4')
ON DUPLICATE KEY UPDATE email = 'harbour-endocrinology-chembur@lifelink.com', passwordHash = 'e3335296e77c643ebed316f537c064ba:e552bfefa690b1a803b3d3f017b3c839d98de81d7e83773d8bb83b62cd9896814e8297d657e51fb7ef8ef8941cee4842e28fbe0fe5e659bf03e800c6704f10d4';

-- Doctor: Dr. Rohan M. Kirloskar, MD, DM (Endocrinology) (Endocrinology - Marine Lines & Churchgate Boulevard)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-endocrinology-churchgate', 'Dr. Rohan M. Kirloskar, MD, DM (Endocrinology)', 'western-endocrinology-churchgate@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Rohan M. Kirloskar, MD, DM (Endocrinology)', email = 'western-endocrinology-churchgate@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-endocrinology-churchgate'), 'mock-western-endocrinology-churchgate', 'western-endocrinology-churchgate@lifelink.com', '80e9e3eb0b5a8c0831c6e3e1b577320d:e4c89e99236af7f238b9f0bfb50d9065261335e261509ee533e53aca06560a9fa4e92fcaac169203d9d33663277a609c91b14ad35c8bc9a1e16375d541c82ba5')
ON DUPLICATE KEY UPDATE email = 'western-endocrinology-churchgate@lifelink.com', passwordHash = '80e9e3eb0b5a8c0831c6e3e1b577320d:e4c89e99236af7f238b9f0bfb50d9065261335e261509ee533e53aca06560a9fa4e92fcaac169203d9d33663277a609c91b14ad35c8bc9a1e16375d541c82ba5';

-- Doctor: Dr. Neha V. Paranjpe, MD, DM (Endocrinology) (Endocrinology - Bhandup West Medical Park)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-endocrinology-bhandup', 'Dr. Neha V. Paranjpe, MD, DM (Endocrinology)', 'central-endocrinology-bhandup@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Neha V. Paranjpe, MD, DM (Endocrinology)', email = 'central-endocrinology-bhandup@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-endocrinology-bhandup'), 'mock-central-endocrinology-bhandup', 'central-endocrinology-bhandup@lifelink.com', '7a1187aa9ca3c7c634ba2d39971265e7:7ed78abfb8f7f25beeae56a736ba8cfdb647738d498bba891251b9d75a12fda5ee384c2f1e8c1a782f73fa4926d5481cb0c89c30110588a45ba87e0dc625bdad')
ON DUPLICATE KEY UPDATE email = 'central-endocrinology-bhandup@lifelink.com', passwordHash = '7a1187aa9ca3c7c634ba2d39971265e7:7ed78abfb8f7f25beeae56a736ba8cfdb647738d498bba891251b9d75a12fda5ee384c2f1e8c1a782f73fa4926d5481cb0c89c30110588a45ba87e0dc625bdad';

-- Doctor: Dr. Sameer K. Merchant, MD, DM (Pulmonology) (Pulmonology - Vashi Sector 15 Medical Park)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-pulmonology-vashi', 'Dr. Sameer K. Merchant, MD, DM (Pulmonology)', 'harbour-pulmonology-vashi@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Sameer K. Merchant, MD, DM (Pulmonology)', email = 'harbour-pulmonology-vashi@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-pulmonology-vashi'), 'mock-harbour-pulmonology-vashi', 'harbour-pulmonology-vashi@lifelink.com', '26f86fe319ad8818ec651e5fa12fc8cb:6993d27d35cb22ec9e91289097b4053a5713451d994f23db7f9754bc144a740b90801668a1b1d92f37781ef3301b3b5dfd703e04fdc03f033713ed0e6efe985c')
ON DUPLICATE KEY UPDATE email = 'harbour-pulmonology-vashi@lifelink.com', passwordHash = '26f86fe319ad8818ec651e5fa12fc8cb:6993d27d35cb22ec9e91289097b4053a5713451d994f23db7f9754bc144a740b90801668a1b1d92f37781ef3301b3b5dfd703e04fdc03f033713ed0e6efe985c';

-- Doctor: Dr. Malini S. Iyer, MD, DM (Pulmonology) (Pulmonology - Thane West Civic Medical Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-pulmonology-thane', 'Dr. Malini S. Iyer, MD, DM (Pulmonology)', 'central-pulmonology-thane@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Malini S. Iyer, MD, DM (Pulmonology)', email = 'central-pulmonology-thane@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-pulmonology-thane'), 'mock-central-pulmonology-thane', 'central-pulmonology-thane@lifelink.com', '346ea43ab1658ac704675853735d4cbe:260a882e27a8eb7203ec1473c8b783194f03bac63bed27d61b4c73cc8bc3d3215b5a0c6654230eb157f3c9a85b3cecccbf1499be5834c8b6e275eec4b225f7f4')
ON DUPLICATE KEY UPDATE email = 'central-pulmonology-thane@lifelink.com', passwordHash = '346ea43ab1658ac704675853735d4cbe:260a882e27a8eb7203ec1473c8b783194f03bac63bed27d61b4c73cc8bc3d3215b5a0c6654230eb157f3c9a85b3cecccbf1499be5834c8b6e275eec4b225f7f4';

-- Doctor: Dr. Vikramaditya S. Sengupta, MD, FCCP (Pulmonology) (Pulmonology - Andheri West Healthcare Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-pulmonology-andheri', 'Dr. Vikramaditya S. Sengupta, MD, FCCP (Pulmonology)', 'western-pulmonology-andheri@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Vikramaditya S. Sengupta, MD, FCCP (Pulmonology)', email = 'western-pulmonology-andheri@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-pulmonology-andheri'), 'mock-western-pulmonology-andheri', 'western-pulmonology-andheri@lifelink.com', '329425eb838c873c98b6f41030ef2d7d:ee5f5a25d7592a7b95ca6ddd4f7a94a110b421a6e5f78453c251ac2115219b5c1c86f852588db65340c9af841b874628e663f841cf5e7bc5b80b856ca64b5d04')
ON DUPLICATE KEY UPDATE email = 'western-pulmonology-andheri@lifelink.com', passwordHash = '329425eb838c873c98b6f41030ef2d7d:ee5f5a25d7592a7b95ca6ddd4f7a94a110b421a6e5f78453c251ac2115219b5c1c86f852588db65340c9af841b874628e663f841cf5e7bc5b80b856ca64b5d04';

-- Doctor: Dr. Tarun K. Bansal, MD, DGO (Gynecology) (Gynecology - Panvel City Wellness Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-gynecology-panvel', 'Dr. Tarun K. Bansal, MD, DGO (Gynecology)', 'harbour-gynecology-panvel@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Tarun K. Bansal, MD, DGO (Gynecology)', email = 'harbour-gynecology-panvel@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-gynecology-panvel'), 'mock-harbour-gynecology-panvel', 'harbour-gynecology-panvel@lifelink.com', '8238f197aa98ab7c362513eaa21e3c0d:5105010adce711cdd43965cbe5b13e3ddbbea5b6161064a39001157a0c2987d3b291d2db700f0e1b5b577e21c59431f0552bfcbdce8c6132dc8ddd7631f4bac9')
ON DUPLICATE KEY UPDATE email = 'harbour-gynecology-panvel@lifelink.com', passwordHash = '8238f197aa98ab7c362513eaa21e3c0d:5105010adce711cdd43965cbe5b13e3ddbbea5b6161064a39001157a0c2987d3b291d2db700f0e1b5b577e21c59431f0552bfcbdce8c6132dc8ddd7631f4bac9';

-- Doctor: Dr. Gauri N. Tendulkar, MD, DGO (Gynecology) (Gynecology - Goregaon West Medical Enclave)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-gynecology-goregaon', 'Dr. Gauri N. Tendulkar, MD, DGO (Gynecology)', 'western-gynecology-goregaon@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Gauri N. Tendulkar, MD, DGO (Gynecology)', email = 'western-gynecology-goregaon@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-gynecology-goregaon'), 'mock-western-gynecology-goregaon', 'western-gynecology-goregaon@lifelink.com', '8db77fcacf9e76f7c4712a4eea3f5fe6:4b6a3b08d7759d360cfaf924b021afa3bdb39d1f94a0d8438b271f29e051d2a1358793e3b8823c7cd263f76452325fea138a992d448f2b9ba8c543fdcae9f574')
ON DUPLICATE KEY UPDATE email = 'western-gynecology-goregaon@lifelink.com', passwordHash = '8db77fcacf9e76f7c4712a4eea3f5fe6:4b6a3b08d7759d360cfaf924b021afa3bdb39d1f94a0d8438b271f29e051d2a1358793e3b8823c7cd263f76452325fea138a992d448f2b9ba8c543fdcae9f574';

-- Doctor: Dr. Priya R. Nadkarni, MD, DGO (Gynecology) (Gynecology - Dombivli East Healthcare Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-gynecology-dombivli', 'Dr. Priya R. Nadkarni, MD, DGO (Gynecology)', 'central-gynecology-dombivli@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Priya R. Nadkarni, MD, DGO (Gynecology)', email = 'central-gynecology-dombivli@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-gynecology-dombivli'), 'mock-central-gynecology-dombivli', 'central-gynecology-dombivli@lifelink.com', '3d65096a2e4edc5fab4e2b159e964201:a7a5ef675b7e4709b560ec76cbf960b1f1ee765f44af6b897f8bb317d24f0ec7b528bec628e9fd5dfa1dcdbf29a484442fe0eb17689aa3c0d505273c309a3820')
ON DUPLICATE KEY UPDATE email = 'central-gynecology-dombivli@lifelink.com', passwordHash = '3d65096a2e4edc5fab4e2b159e964201:a7a5ef675b7e4709b560ec76cbf960b1f1ee765f44af6b897f8bb317d24f0ec7b528bec628e9fd5dfa1dcdbf29a484442fe0eb17689aa3c0d505273c309a3820';

-- ============================================================================
-- VERIFICATION & AUDIT QUERIES (Displays immediately in MySQL Workbench)
-- ============================================================================
SELECT '✅ LifeLink database created & populated successfully!' AS Setup_Status;

-- View all Doctor login accounts:
SELECT u.id AS user_id, u.name AS doctor_name, u.email AS doctor_email, c.doctorId, u.role, u.updatedAt
FROM users u
JOIN syntheticDoctorCredentials c ON u.id = c.userId
ORDER BY u.id ASC;

-- Confirm 0 non-doctor accounts exist (Clean State):
SELECT COUNT(*) AS total_non_doctor_users FROM users WHERE role != 'doctor';
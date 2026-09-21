-- ============================================================================
-- LIFELINK COMPLETE DATABASE SETUP & CREDENTIAL SEED FOR MYSQL WORKBENCH
-- ============================================================================
-- Instructions for MySQL Workbench:
-- 1. Start your MySQL Server (in Workbench: Administration -> Startup/Shutdown -> Start Server).
-- 2. Open this file (File -> Open SQL Script -> database/seed_doctors.sql).
-- 3. Click the ⚡ Execute button (or Ctrl + Shift + Enter).
-- 4. The Result Grid at the bottom will display all 52 doctor logins + patient login.
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
-- SEED 1: DEMO PATIENT ACCOUNT
-- Email: patient@lifelink.com  |  Password: patient@lifelink
-- ============================================================================
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('native:patient-demo', 'Aarav Mehta', 'patient@lifelink.com', 'native-patient', 'user', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Aarav Mehta', email = 'patient@lifelink.com', role = 'user', updatedAt = NOW();

INSERT INTO patientCredentials (userId, email, passwordHash, createdAt, updatedAt)
VALUES ((SELECT id FROM users WHERE openId = 'native:patient-demo'), 'patient@lifelink.com', '2dc5d260db4b2703563bcd8b42ee58a8:9ba79558a9892c476b631f4174ef5d2c9101fd59fae9206dd53c5d34e0d1c27ebcc18fe2a461beb7f62bcf8df24a8b0969335d870445f82cb6ced65a02e4aae2', NOW(), NOW())
ON DUPLICATE KEY UPDATE email = 'patient@lifelink.com', passwordHash = '2dc5d260db4b2703563bcd8b42ee58a8:9ba79558a9892c476b631f4174ef5d2c9101fd59fae9206dd53c5d34e0d1c27ebcc18fe2a461beb7f62bcf8df24a8b0969335d870445f82cb6ced65a02e4aae2', updatedAt = NOW();

INSERT INTO patientProfiles (userId, bloodGroup, phone, allergiesJson, conditionsJson, createdAt, updatedAt)
VALUES ((SELECT id FROM users WHERE openId = 'native:patient-demo'), 'O+', '+91 98765 43210', '[]', '[]', NOW(), NOW())
ON DUPLICATE KEY UPDATE bloodGroup = 'O+', phone = '+91 98765 43210', updatedAt = NOW();

-- ============================================================================
-- SEED 2: 52 CLINICIAN WORKSTATION ACCOUNTS (100% FICTIONAL & COMPLIANT)
-- ============================================================================
-- Doctor: Dr. Aarav N. Kulkarni, MBBS (General Practice - Fort Medical Enclave)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-csmt', 'Dr. Aarav N. Kulkarni, MBBS', 'central-general-practice-csmt@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Aarav N. Kulkarni, MBBS', email = 'central-general-practice-csmt@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-csmt'), 'mock-central-general-practice-csmt', 'central-general-practice-csmt@lifelink.com', '5c901e5b8a18a188c80835b576ffd3a8:2d9aede434c5814225c6e252128e8cc5274062dcf7968581b37884ad70f7187bdc9e0654096cf87c1e8926d78dc6ef2ec1607c2612bb9ddc1b11439a6930e9aa')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-csmt@lifelink.com', passwordHash = '5c901e5b8a18a188c80835b576ffd3a8:2d9aede434c5814225c6e252128e8cc5274062dcf7968581b37884ad70f7187bdc9e0654096cf87c1e8926d78dc6ef2ec1607c2612bb9ddc1b11439a6930e9aa';

-- Doctor: Dr. Ishaan M. Deshmukh, MBBS (General Practice - Ghatkopar East Health District)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-ghatkopar', 'Dr. Ishaan M. Deshmukh, MBBS', 'central-general-practice-ghatkopar@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Ishaan M. Deshmukh, MBBS', email = 'central-general-practice-ghatkopar@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-ghatkopar'), 'mock-central-general-practice-ghatkopar', 'central-general-practice-ghatkopar@lifelink.com', '141aa914120cea99c1652131a1d9c799:1ec640ad0299af5bd3cef36b7e3bca6ad327cf39e67951d188a40907848e85a54d126465cd4cc1e447152c0d6020769425c53fb997cbce70fddd6a95503d3560')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-ghatkopar@lifelink.com', passwordHash = '141aa914120cea99c1652131a1d9c799:1ec640ad0299af5bd3cef36b7e3bca6ad327cf39e67951d188a40907848e85a54d126465cd4cc1e447152c0d6020769425c53fb997cbce70fddd6a95503d3560';

-- Doctor: Dr. Ananya P. Joshi, MBBS (General Practice - Bhandup West Medical Park)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-bhandup', 'Dr. Ananya P. Joshi, MBBS', 'central-general-practice-bhandup@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Ananya P. Joshi, MBBS', email = 'central-general-practice-bhandup@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-bhandup'), 'mock-central-general-practice-bhandup', 'central-general-practice-bhandup@lifelink.com', '3c268d7d473a43d9190832e1067a8ead:0dbd175b7c57fdc4cfc3aa68551032b90e8278a22840fd6045bb53169a6cc5c59fd4cd4126afb41268568434f4bddbce39ca38dd578098a2b23f11406a08094e')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-bhandup@lifelink.com', passwordHash = '3c268d7d473a43d9190832e1067a8ead:0dbd175b7c57fdc4cfc3aa68551032b90e8278a22840fd6045bb53169a6cc5c59fd4cd4126afb41268568434f4bddbce39ca38dd578098a2b23f11406a08094e';

-- Doctor: Dr. Rohan K. Sengupta, MBBS, MD (General Practice - Thane West Civic Medical Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-thane', 'Dr. Rohan K. Sengupta, MBBS, MD', 'central-general-practice-thane@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Rohan K. Sengupta, MBBS, MD', email = 'central-general-practice-thane@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-thane'), 'mock-central-general-practice-thane', 'central-general-practice-thane@lifelink.com', 'b69fdb6ab64c6ef3affe9625b07c882c:be37b8049fda673c3ae57e76b53f734599fbb204f5bde46488113b86955299b700322a46cde4aaee7cf8a7265521ef679fa47b4081c60ec95225acd42c3d6dec')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-thane@lifelink.com', passwordHash = 'b69fdb6ab64c6ef3affe9625b07c882c:be37b8049fda673c3ae57e76b53f734599fbb204f5bde46488113b86955299b700322a46cde4aaee7cf8a7265521ef679fa47b4081c60ec95225acd42c3d6dec';

-- Doctor: Dr. Tanvi R. Kirloskar, MBBS (General Practice - Mulund West Wellness Corridor)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-mulund', 'Dr. Tanvi R. Kirloskar, MBBS', 'central-general-practice-mulund@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Tanvi R. Kirloskar, MBBS', email = 'central-general-practice-mulund@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-mulund'), 'mock-central-general-practice-mulund', 'central-general-practice-mulund@lifelink.com', 'f8c0c2759aa4eb9b0bac2c207d8ac782:93cd0fba52785f6c3f97bb4b48cce8f028ef9c5f402c7ffd94e6011ad0a05e480c759e0b9b77da36786ea1588a8c9a59b2acc9b832841c002203b8c871df3dd4')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-mulund@lifelink.com', passwordHash = 'f8c0c2759aa4eb9b0bac2c207d8ac782:93cd0fba52785f6c3f97bb4b48cce8f028ef9c5f402c7ffd94e6011ad0a05e480c759e0b9b77da36786ea1588a8c9a59b2acc9b832841c002203b8c871df3dd4';

-- Doctor: Dr. Neil P. Somaiya, MBBS (General Practice - Diva Central Health Enclave)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-diva', 'Dr. Neil P. Somaiya, MBBS', 'central-general-practice-diva@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Neil P. Somaiya, MBBS', email = 'central-general-practice-diva@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-diva'), 'mock-central-general-practice-diva', 'central-general-practice-diva@lifelink.com', '1b08715f64a2d0f15bf7b6594ea7836e:fd81964207a4adf38a4405640691944af25b5c78df6d4a973e6c7f739681d3bad622d583abeeac7f69d7a5ba89a11b50cc029c464db9b19aa51a1ed07d0536f6')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-diva@lifelink.com', passwordHash = '1b08715f64a2d0f15bf7b6594ea7836e:fd81964207a4adf38a4405640691944af25b5c78df6d4a973e6c7f739681d3bad622d583abeeac7f69d7a5ba89a11b50cc029c464db9b19aa51a1ed07d0536f6';

-- Doctor: Dr. Avantika B. Deshmukh, MBBS (General Practice - Kopar Civic Care District)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-kopar', 'Dr. Avantika B. Deshmukh, MBBS', 'central-general-practice-kopar@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Avantika B. Deshmukh, MBBS', email = 'central-general-practice-kopar@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-kopar'), 'mock-central-general-practice-kopar', 'central-general-practice-kopar@lifelink.com', 'fb30e6db79c8c600c17c69272a3d4bdc:0ae79a602c12e3e711284e40e4c2ef4edac32d9e663afc201937fcf2c6d26ff79aa845a52f25283f5745690dd3025a68f9710b9f91a2d5ce1d3a5c6650a2125b')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-kopar@lifelink.com', passwordHash = 'fb30e6db79c8c600c17c69272a3d4bdc:0ae79a602c12e3e711284e40e4c2ef4edac32d9e663afc201937fcf2c6d26ff79aa845a52f25283f5745690dd3025a68f9710b9f91a2d5ce1d3a5c6650a2125b';

-- Doctor: Dr. Kabir A. Mahajan, MBBS (General Practice - Dombivli East Healthcare Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-dombivli', 'Dr. Kabir A. Mahajan, MBBS', 'central-general-practice-dombivli@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Kabir A. Mahajan, MBBS', email = 'central-general-practice-dombivli@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-dombivli'), 'mock-central-general-practice-dombivli', 'central-general-practice-dombivli@lifelink.com', '8da956ead5256bed58d1207ef997c972:5e93cfd0573cfc76a29b231be324f9458516f3a8cefd38c45f68661da89aba4bffb0c8f0537da9e326cb515b89d6eb3c49437c538f93746a785edc9c17e99ff6')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-dombivli@lifelink.com', passwordHash = '8da956ead5256bed58d1207ef997c972:5e93cfd0573cfc76a29b231be324f9458516f3a8cefd38c45f68661da89aba4bffb0c8f0537da9e326cb515b89d6eb3c49437c538f93746a785edc9c17e99ff6';

-- Doctor: Dr. Meera K. Nambiar, MBBS (General Practice - Thakurli Township Medical Center)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-general-practice-thakurli', 'Dr. Meera K. Nambiar, MBBS', 'central-general-practice-thakurli@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Meera K. Nambiar, MBBS', email = 'central-general-practice-thakurli@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-general-practice-thakurli'), 'mock-central-general-practice-thakurli', 'central-general-practice-thakurli@lifelink.com', 'c6a3c6a3da7ee84966407428cd1a872a:f028377a6749a2381207ed50d5d04f138c0fb4e86ef55565ea6b51fbacb1d1fc1566f5abfce39dd1201478d64b7b32a17aedc94e58632e4f053f3f874449c684')
ON DUPLICATE KEY UPDATE email = 'central-general-practice-thakurli@lifelink.com', passwordHash = 'c6a3c6a3da7ee84966407428cd1a872a:f028377a6749a2381207ed50d5d04f138c0fb4e86ef55565ea6b51fbacb1d1fc1566f5abfce39dd1201478d64b7b32a17aedc94e58632e4f053f3f874449c684';

-- Doctor: Dr. Devendra C. Sawant, MBBS, MD (General Practice - Marine Lines & Churchgate Boulevard)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-general-practice-churchgate', 'Dr. Devendra C. Sawant, MBBS, MD', 'western-general-practice-churchgate@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Devendra C. Sawant, MBBS, MD', email = 'western-general-practice-churchgate@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-general-practice-churchgate'), 'mock-western-general-practice-churchgate', 'western-general-practice-churchgate@lifelink.com', '5ddbfe0ce6493c77af67cecf6bb69b8b:316b65e9379bd403e33eaa331d191a64ec2df522718e143cc0bb16ca4a69f6cfff02bc227420e222dcdf0f21941b14c7d506a211176a1d15edec65cb15843d56')
ON DUPLICATE KEY UPDATE email = 'western-general-practice-churchgate@lifelink.com', passwordHash = '5ddbfe0ce6493c77af67cecf6bb69b8b:316b65e9379bd403e33eaa331d191a64ec2df522718e143cc0bb16ca4a69f6cfff02bc227420e222dcdf0f21941b14c7d506a211176a1d15edec65cb15843d56';

-- Doctor: Dr. Shalini K. Pillai, MBBS (General Practice - Dadar West Medical Square)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-general-practice-dadar', 'Dr. Shalini K. Pillai, MBBS', 'western-general-practice-dadar@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Shalini K. Pillai, MBBS', email = 'western-general-practice-dadar@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-general-practice-dadar'), 'mock-western-general-practice-dadar', 'western-general-practice-dadar@lifelink.com', 'b979c426cf019c8570e3a6874859ea75:f7b986c71efc92d6044c101dbaf15ab5bd0b8eb8f736a51d0cc50eec638770431a62ffb6c8912ce9a2d238201266ec3d1029627f01c21d31bc26371ce96e434d')
ON DUPLICATE KEY UPDATE email = 'western-general-practice-dadar@lifelink.com', passwordHash = 'b979c426cf019c8570e3a6874859ea75:f7b986c71efc92d6044c101dbaf15ab5bd0b8eb8f736a51d0cc50eec638770431a62ffb6c8912ce9a2d238201266ec3d1029627f01c21d31bc26371ce96e434d';

-- Doctor: Dr. Prakash J. Menon, MBBS (General Practice - Andheri West Healthcare Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-general-practice-andheri', 'Dr. Prakash J. Menon, MBBS', 'western-general-practice-andheri@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Prakash J. Menon, MBBS', email = 'western-general-practice-andheri@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-general-practice-andheri'), 'mock-western-general-practice-andheri', 'western-general-practice-andheri@lifelink.com', '1dede2a75fbe1097f8ffa842ac5a93e9:69586fb0fc454d396847e043197e936f60da0e252a96ab7d2e2ae914d66c701d8d23c2003ab5d65a89a24c42e149d5f7a25090822ce81e73e06d5d19813e6553')
ON DUPLICATE KEY UPDATE email = 'western-general-practice-andheri@lifelink.com', passwordHash = '1dede2a75fbe1097f8ffa842ac5a93e9:69586fb0fc454d396847e043197e936f60da0e252a96ab7d2e2ae914d66c701d8d23c2003ab5d65a89a24c42e149d5f7a25090822ce81e73e06d5d19813e6553';

-- Doctor: Dr. Chetan R. Varma, MBBS (General Practice - Goregaon West Medical Enclave)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-general-practice-goregaon', 'Dr. Chetan R. Varma, MBBS', 'western-general-practice-goregaon@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Chetan R. Varma, MBBS', email = 'western-general-practice-goregaon@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-general-practice-goregaon'), 'mock-western-general-practice-goregaon', 'western-general-practice-goregaon@lifelink.com', '50a895c945cf63a3e2006db98e09afa6:bf94961016bdabb215fc72045a4d11baa35cc679b6f61607cb798a4f97760379bfc1946dd834cb68be3568a143e560b7ff106439efcab27ed00c3e81a69522b0')
ON DUPLICATE KEY UPDATE email = 'western-general-practice-goregaon@lifelink.com', passwordHash = '50a895c945cf63a3e2006db98e09afa6:bf94961016bdabb215fc72045a4d11baa35cc679b6f61607cb798a4f97760379bfc1946dd834cb68be3568a143e560b7ff106439efcab27ed00c3e81a69522b0';

-- Doctor: Dr. Sneha R. Kulkarni, MBBS (General Practice - Borivali West Health Corridor)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-general-practice-borivali', 'Dr. Sneha R. Kulkarni, MBBS', 'western-general-practice-borivali@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Sneha R. Kulkarni, MBBS', email = 'western-general-practice-borivali@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-general-practice-borivali'), 'mock-western-general-practice-borivali', 'western-general-practice-borivali@lifelink.com', 'a69d98c80700cc9d113a5402433eb73f:f9e5bc728808a70e75eb0cecf8d691795b328d4d315a334a59b076f8473d6c57b9db333c70dd3d449a00679423c5a138be6e11ee0995f4131fc36d0fc2823e93')
ON DUPLICATE KEY UPDATE email = 'western-general-practice-borivali@lifelink.com', passwordHash = 'a69d98c80700cc9d113a5402433eb73f:f9e5bc728808a70e75eb0cecf8d691795b328d4d315a334a59b076f8473d6c57b9db333c70dd3d449a00679423c5a138be6e11ee0995f4131fc36d0fc2823e93';

-- Doctor: Dr. Pankaj D. Shah, MBBS (General Practice - Sewri Coastal Medical District)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-general-practice-sewri', 'Dr. Pankaj D. Shah, MBBS', 'harbour-general-practice-sewri@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Pankaj D. Shah, MBBS', email = 'harbour-general-practice-sewri@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-general-practice-sewri'), 'mock-harbour-general-practice-sewri', 'harbour-general-practice-sewri@lifelink.com', '628c0e7287ec9cc103765e871bfec518:1f47861e795609a47fc2892da261abcb75c51f09493d4a4b3bf9467b4cc9f46e940f0e41197eeffd5773b27d5ce002e25b7b8d1fcca5e41359968a693bf7de75')
ON DUPLICATE KEY UPDATE email = 'harbour-general-practice-sewri@lifelink.com', passwordHash = '628c0e7287ec9cc103765e871bfec518:1f47861e795609a47fc2892da261abcb75c51f09493d4a4b3bf9467b4cc9f46e940f0e41197eeffd5773b27d5ce002e25b7b8d1fcca5e41359968a693bf7de75';

-- Doctor: Dr. Vivek N. Deshpande, MBBS (General Practice - Chembur Diamond Garden Sector)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-general-practice-chembur', 'Dr. Vivek N. Deshpande, MBBS', 'harbour-general-practice-chembur@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Vivek N. Deshpande, MBBS', email = 'harbour-general-practice-chembur@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-general-practice-chembur'), 'mock-harbour-general-practice-chembur', 'harbour-general-practice-chembur@lifelink.com', '01c5c7d84f25211c26e6a367a19dacc7:e7776846ea6ed07ee7965066952de38bda805fb0b1361b8d4bd0320cb438a5c8aa4940df9d85e6eacb7a9dacc24bb4131d3ba01e3d9bd39640395e30f540f72d')
ON DUPLICATE KEY UPDATE email = 'harbour-general-practice-chembur@lifelink.com', passwordHash = '01c5c7d84f25211c26e6a367a19dacc7:e7776846ea6ed07ee7965066952de38bda805fb0b1361b8d4bd0320cb438a5c8aa4940df9d85e6eacb7a9dacc24bb4131d3ba01e3d9bd39640395e30f540f72d';

-- Doctor: Dr. Rohan T. Bapat, MBBS (General Practice - Vashi Sector 15 Medical Park)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-general-practice-vashi', 'Dr. Rohan T. Bapat, MBBS', 'harbour-general-practice-vashi@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Rohan T. Bapat, MBBS', email = 'harbour-general-practice-vashi@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-general-practice-vashi'), 'mock-harbour-general-practice-vashi', 'harbour-general-practice-vashi@lifelink.com', '0e40264b1c12fd71395613a3232c10e6:a647614ae3b44bb66ee71d1f83e7896cfaff5c055a60ffc8c915c9d6f8ea664ed0bb01cadc27127ab07cdd91d4150d8c778c5483712e64682b6dda2e95ed7e0a')
ON DUPLICATE KEY UPDATE email = 'harbour-general-practice-vashi@lifelink.com', passwordHash = '0e40264b1c12fd71395613a3232c10e6:a647614ae3b44bb66ee71d1f83e7896cfaff5c055a60ffc8c915c9d6f8ea664ed0bb01cadc27127ab07cdd91d4150d8c778c5483712e64682b6dda2e95ed7e0a';

-- Doctor: Dr. Preeti S. Saxena, MBBS (General Practice - Nerul Palm Beach Healthcare Zone)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-general-practice-nerul', 'Dr. Preeti S. Saxena, MBBS', 'harbour-general-practice-nerul@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Preeti S. Saxena, MBBS', email = 'harbour-general-practice-nerul@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-general-practice-nerul'), 'mock-harbour-general-practice-nerul', 'harbour-general-practice-nerul@lifelink.com', '662c0aa8b090ee499a55d72219b9a741:795300431efc8947b567360b319353de2ee0a9121f93f6e6c15e7425f26c631462617212e1366727ea3e59866a2289e9953a958c9935d8afd35bfc8b9207769b')
ON DUPLICATE KEY UPDATE email = 'harbour-general-practice-nerul@lifelink.com', passwordHash = '662c0aa8b090ee499a55d72219b9a741:795300431efc8947b567360b319353de2ee0a9121f93f6e6c15e7425f26c631462617212e1366727ea3e59866a2289e9953a958c9935d8afd35bfc8b9207769b';

-- Doctor: Dr. Alok M. Pandey, MBBS (General Practice - Panvel City Wellness Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-general-practice-panvel', 'Dr. Alok M. Pandey, MBBS', 'harbour-general-practice-panvel@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Alok M. Pandey, MBBS', email = 'harbour-general-practice-panvel@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-general-practice-panvel'), 'mock-harbour-general-practice-panvel', 'harbour-general-practice-panvel@lifelink.com', 'aa26775fb8bade14873f47f342940d5a:2d7001972d6e368598a9a29706f7a5f6420a4399cc6b85fd373ee23c23be566e914fab5d0c2d1ad1804ccfdf3f8351f43fcf8862f7ae1c1f8fb9d8fa4563d150')
ON DUPLICATE KEY UPDATE email = 'harbour-general-practice-panvel@lifelink.com', passwordHash = 'aa26775fb8bade14873f47f342940d5a:2d7001972d6e368598a9a29706f7a5f6420a4399cc6b85fd373ee23c23be566e914fab5d0c2d1ad1804ccfdf3f8351f43fcf8862f7ae1c1f8fb9d8fa4563d150';

-- Doctor: Dr. Rajesh V. Varma, MD, DM (Cardiology) (Cardiology - Fort Medical Enclave)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-cardiology-csmt', 'Dr. Rajesh V. Varma, MD, DM (Cardiology)', 'central-cardiology-csmt@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Rajesh V. Varma, MD, DM (Cardiology)', email = 'central-cardiology-csmt@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-cardiology-csmt'), 'mock-central-cardiology-csmt', 'central-cardiology-csmt@lifelink.com', '09e03341c105d9dade7b2f9370617d5c:9a7d44cfdf76511c363fefd48837f5749577deecdfa007d060b75a36c28629b4ec867f61b5166ae18ad172afcfb5104d549cf9abf38776f378fe82a967b21a63')
ON DUPLICATE KEY UPDATE email = 'central-cardiology-csmt@lifelink.com', passwordHash = '09e03341c105d9dade7b2f9370617d5c:9a7d44cfdf76511c363fefd48837f5749577deecdfa007d060b75a36c28629b4ec867f61b5166ae18ad172afcfb5104d549cf9abf38776f378fe82a967b21a63';

-- Doctor: Dr. Jayant V. Bhatt, MD, DM (Cardiology) (Cardiology - Andheri West Healthcare Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-cardiology-andheri', 'Dr. Jayant V. Bhatt, MD, DM (Cardiology)', 'western-cardiology-andheri@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Jayant V. Bhatt, MD, DM (Cardiology)', email = 'western-cardiology-andheri@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-cardiology-andheri'), 'mock-western-cardiology-andheri', 'western-cardiology-andheri@lifelink.com', '5b78e25810e9467191f7de0793ba8969:49ed7129b26eb5aef5a10ce2f2b22f43ddecd05e59c0a1251ebf50dfd19ddca07524def2b6acc120f83c5d6d5a85d13dffacc709b17339c3dfd090561e8c243f')
ON DUPLICATE KEY UPDATE email = 'western-cardiology-andheri@lifelink.com', passwordHash = '5b78e25810e9467191f7de0793ba8969:49ed7129b26eb5aef5a10ce2f2b22f43ddecd05e59c0a1251ebf50dfd19ddca07524def2b6acc120f83c5d6d5a85d13dffacc709b17339c3dfd090561e8c243f';

-- Doctor: Dr. Reema N. Shetty, MD, DM (Cardiology) (Cardiology - Vashi Sector 15 Medical Park)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-cardiology-vashi', 'Dr. Reema N. Shetty, MD, DM (Cardiology)', 'harbour-cardiology-vashi@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Reema N. Shetty, MD, DM (Cardiology)', email = 'harbour-cardiology-vashi@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-cardiology-vashi'), 'mock-harbour-cardiology-vashi', 'harbour-cardiology-vashi@lifelink.com', '481f07c9927200e4a23355771dd99ed6:5709130daa75fd6a855585bb57caa8d9b41233b9fef64f47ff29dc3cc370106838764700b27a335191f12a9eacdca2c73192b3650619fae8aa9a6007e7fd0db8')
ON DUPLICATE KEY UPDATE email = 'harbour-cardiology-vashi@lifelink.com', passwordHash = '481f07c9927200e4a23355771dd99ed6:5709130daa75fd6a855585bb57caa8d9b41233b9fef64f47ff29dc3cc370106838764700b27a335191f12a9eacdca2c73192b3650619fae8aa9a6007e7fd0db8';

-- Doctor: Dr. Rahul E. Tambe, MD (Dermatology, DNB) (Dermatology - Ghatkopar East Health District)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-dermatology-ghatkopar', 'Dr. Rahul E. Tambe, MD (Dermatology, DNB)', 'central-dermatology-ghatkopar@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Rahul E. Tambe, MD (Dermatology, DNB)', email = 'central-dermatology-ghatkopar@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-dermatology-ghatkopar'), 'mock-central-dermatology-ghatkopar', 'central-dermatology-ghatkopar@lifelink.com', '776f50536a93238bc9278c659f4c39f8:cd46509d1b88d2dc6bfb0d93d155d1d16d4a0b73b8937b18ba0b3e86f282b99d811dbb728b2fd26e1bc4ed1b9f8bd16b86835e47c42685e649e662d073253ea3')
ON DUPLICATE KEY UPDATE email = 'central-dermatology-ghatkopar@lifelink.com', passwordHash = '776f50536a93238bc9278c659f4c39f8:cd46509d1b88d2dc6bfb0d93d155d1d16d4a0b73b8937b18ba0b3e86f282b99d811dbb728b2fd26e1bc4ed1b9f8bd16b86835e47c42685e649e662d073253ea3';

-- Doctor: Dr. Veena M. Shinde, MD (Dermatology) (Dermatology - Marine Lines & Churchgate Boulevard)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-dermatology-churchgate', 'Dr. Veena M. Shinde, MD (Dermatology)', 'western-dermatology-churchgate@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Veena M. Shinde, MD (Dermatology)', email = 'western-dermatology-churchgate@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-dermatology-churchgate'), 'mock-western-dermatology-churchgate', 'western-dermatology-churchgate@lifelink.com', '4decfb88bbc31372f7d9d6b535735973:5843cf7362e629f2f69203195f6ec0f2c29a621a7afe8649aef5df5b78e996b01c0af2d2d4429f3b3a5128c2a94fe73128c6d1ef2f8958aca30f5e6a35de61d8')
ON DUPLICATE KEY UPDATE email = 'western-dermatology-churchgate@lifelink.com', passwordHash = '4decfb88bbc31372f7d9d6b535735973:5843cf7362e629f2f69203195f6ec0f2c29a621a7afe8649aef5df5b78e996b01c0af2d2d4429f3b3a5128c2a94fe73128c6d1ef2f8958aca30f5e6a35de61d8';

-- Doctor: Dr. Smita K. Patil, MD (Dermatology) (Dermatology - Chembur Diamond Garden Sector)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-dermatology-chembur', 'Dr. Smita K. Patil, MD (Dermatology)', 'harbour-dermatology-chembur@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Smita K. Patil, MD (Dermatology)', email = 'harbour-dermatology-chembur@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-dermatology-chembur'), 'mock-harbour-dermatology-chembur', 'harbour-dermatology-chembur@lifelink.com', '448a1ff4d6be5a430b8665edad989546:c059b73ceb99144aad331c9e5f83e3e7455e02c48af789431092d294a7a82cd2008a73318daeff29b4effc4131b71ee6e8b3556316a7ba99fbdebc62ebc83008')
ON DUPLICATE KEY UPDATE email = 'harbour-dermatology-chembur@lifelink.com', passwordHash = '448a1ff4d6be5a430b8665edad989546:c059b73ceb99144aad331c9e5f83e3e7455e02c48af789431092d294a7a82cd2008a73318daeff29b4effc4131b71ee6e8b3556316a7ba99fbdebc62ebc83008';

-- Doctor: Dr. Arvind N. Shenoy, MS (Orthopedics) (Orthopedics - Bhandup West Medical Park)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-orthopedics-bhandup', 'Dr. Arvind N. Shenoy, MS (Orthopedics)', 'central-orthopedics-bhandup@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Arvind N. Shenoy, MS (Orthopedics)', email = 'central-orthopedics-bhandup@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-orthopedics-bhandup'), 'mock-central-orthopedics-bhandup', 'central-orthopedics-bhandup@lifelink.com', '767a32ddf28543536bc3fce482516666:e881dedf649d598a1991de2de3424a49869d139a59ccb1f0508509dc6155a74688ab74647dbdba11bd95d6f807d979f95100f4a27141bf77c27141cbd3d13bb0')
ON DUPLICATE KEY UPDATE email = 'central-orthopedics-bhandup@lifelink.com', passwordHash = '767a32ddf28543536bc3fce482516666:e881dedf649d598a1991de2de3424a49869d139a59ccb1f0508509dc6155a74688ab74647dbdba11bd95d6f807d979f95100f4a27141bf77c27141cbd3d13bb0';

-- Doctor: Dr. Sunita K. Jagtap, MS (Orthopedics, MCh) (Orthopedics - Dadar West Medical Square)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-orthopedics-dadar', 'Dr. Sunita K. Jagtap, MS (Orthopedics, MCh)', 'western-orthopedics-dadar@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Sunita K. Jagtap, MS (Orthopedics, MCh)', email = 'western-orthopedics-dadar@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-orthopedics-dadar'), 'mock-western-orthopedics-dadar', 'western-orthopedics-dadar@lifelink.com', '9f5b279401078fd681f0d0471bca77ef:99f125324c1aa175d70ce77d0f2324eacc758179709d54042e38f5bb0743d0cc22ec80ef0a70b62267afd0a439a17d753f8aceafff98bda04b0bfc419a555d33')
ON DUPLICATE KEY UPDATE email = 'western-orthopedics-dadar@lifelink.com', passwordHash = '9f5b279401078fd681f0d0471bca77ef:99f125324c1aa175d70ce77d0f2324eacc758179709d54042e38f5bb0743d0cc22ec80ef0a70b62267afd0a439a17d753f8aceafff98bda04b0bfc419a555d33';

-- Doctor: Dr. Shrikant R. Gokhale, MS (Orthopedics) (Orthopedics - Panvel City Wellness Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-orthopedics-panvel', 'Dr. Shrikant R. Gokhale, MS (Orthopedics)', 'harbour-orthopedics-panvel@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Shrikant R. Gokhale, MS (Orthopedics)', email = 'harbour-orthopedics-panvel@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-orthopedics-panvel'), 'mock-harbour-orthopedics-panvel', 'harbour-orthopedics-panvel@lifelink.com', '7f4fb04aaf4f6bbeec5d9c5e84d14472:9ebdb51265f9d986a4974b794dee4df0fdfbe91abbb90ecfeaf0ac84948db7ef6c89486ca742154497adab1f844d119b48b50d024a67821c4887c743d5a2d724')
ON DUPLICATE KEY UPDATE email = 'harbour-orthopedics-panvel@lifelink.com', passwordHash = '7f4fb04aaf4f6bbeec5d9c5e84d14472:9ebdb51265f9d986a4974b794dee4df0fdfbe91abbb90ecfeaf0ac84948db7ef6c89486ca742154497adab1f844d119b48b50d024a67821c4887c743d5a2d724';

-- Doctor: Dr. Rameshwar T. Gaikwad, MD, DM (Neurology) (Neurology - Thane West Civic Medical Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-neurology-thane', 'Dr. Rameshwar T. Gaikwad, MD, DM (Neurology)', 'central-neurology-thane@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Rameshwar T. Gaikwad, MD, DM (Neurology)', email = 'central-neurology-thane@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-neurology-thane'), 'mock-central-neurology-thane', 'central-neurology-thane@lifelink.com', '8788a1c5ffa95b416cf17da0823a2a2e:693ae0576698ffed66a685e4225b15a8e2f14013c3656448685b5b92f739781e0454d0f7179505f3f488387094494b7dd5753622c86fa29454a9bb6c2cd50a7e')
ON DUPLICATE KEY UPDATE email = 'central-neurology-thane@lifelink.com', passwordHash = '8788a1c5ffa95b416cf17da0823a2a2e:693ae0576698ffed66a685e4225b15a8e2f14013c3656448685b5b92f739781e0454d0f7179505f3f488387094494b7dd5753622c86fa29454a9bb6c2cd50a7e';

-- Doctor: Dr. Kavita M. Joshi, MD, DM (Neurology) (Neurology - Borivali West Health Corridor)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-neurology-borivali', 'Dr. Kavita M. Joshi, MD, DM (Neurology)', 'western-neurology-borivali@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Kavita M. Joshi, MD, DM (Neurology)', email = 'western-neurology-borivali@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-neurology-borivali'), 'mock-western-neurology-borivali', 'western-neurology-borivali@lifelink.com', '39dd9a6f984ff3dc56ec180fe7e64b59:9f68380e243500259e8d0fd7a81e092cca0b470ee08d8bd32a28f07e2517ef1bc0286b400e4d0a750e7f459ebc0b86ef146802ddffbe561582c95786a2239aaf')
ON DUPLICATE KEY UPDATE email = 'western-neurology-borivali@lifelink.com', passwordHash = '39dd9a6f984ff3dc56ec180fe7e64b59:9f68380e243500259e8d0fd7a81e092cca0b470ee08d8bd32a28f07e2517ef1bc0286b400e4d0a750e7f459ebc0b86ef146802ddffbe561582c95786a2239aaf';

-- Doctor: Dr. Nitin H. Agrawal, MD, DM (Neurology) (Neurology - Nerul Palm Beach Healthcare Zone)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-neurology-nerul', 'Dr. Nitin H. Agrawal, MD, DM (Neurology)', 'harbour-neurology-nerul@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Nitin H. Agrawal, MD, DM (Neurology)', email = 'harbour-neurology-nerul@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-neurology-nerul'), 'mock-harbour-neurology-nerul', 'harbour-neurology-nerul@lifelink.com', '1a786f97a4a099261aef292df61e8e6d:b01c20c71c4341c694a056cbabcf3ed7d89f6b386cd05011b8abfb4635260232c2aa3f6d916577a93a5b73bf7843f43afc92d08dfd6256bdf121846ec0735587')
ON DUPLICATE KEY UPDATE email = 'harbour-neurology-nerul@lifelink.com', passwordHash = '1a786f97a4a099261aef292df61e8e6d:b01c20c71c4341c694a056cbabcf3ed7d89f6b386cd05011b8abfb4635260232c2aa3f6d916577a93a5b73bf7843f43afc92d08dfd6256bdf121846ec0735587';

-- Doctor: Dr. Deepa V. Nair, MD (Pediatrics, DCH) (Pediatrics - Andheri West Healthcare Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-pediatrics-andheri', 'Dr. Deepa V. Nair, MD (Pediatrics, DCH)', 'western-pediatrics-andheri@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Deepa V. Nair, MD (Pediatrics, DCH)', email = 'western-pediatrics-andheri@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-pediatrics-andheri'), 'mock-western-pediatrics-andheri', 'western-pediatrics-andheri@lifelink.com', 'a3b4e2207da1dddf60aa0e8a655c3b5e:9386e9b44abffd56f6d27ec42c191c1baa8ec78f88819d888af16876a7a08e6be46f4fc570d0dc4f755e8f4b5041c842e69bf70b6bd4e73c68565ac0e509d860')
ON DUPLICATE KEY UPDATE email = 'western-pediatrics-andheri@lifelink.com', passwordHash = 'a3b4e2207da1dddf60aa0e8a655c3b5e:9386e9b44abffd56f6d27ec42c191c1baa8ec78f88819d888af16876a7a08e6be46f4fc570d0dc4f755e8f4b5041c842e69bf70b6bd4e73c68565ac0e509d860';

-- Doctor: Dr. Farhan K. Mehta, MD (Pediatrics) (Pediatrics - Mulund West Wellness Corridor)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-pediatrics-mulund', 'Dr. Farhan K. Mehta, MD (Pediatrics)', 'central-pediatrics-mulund@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Farhan K. Mehta, MD (Pediatrics)', email = 'central-pediatrics-mulund@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-pediatrics-mulund'), 'mock-central-pediatrics-mulund', 'central-pediatrics-mulund@lifelink.com', 'caacccae61d299422f0827afbaa4b5fd:483330ef0405fb07d7a48c0ed66ff4207c908857ba547d5af4fbdefa071360c5487069261cceb902a1619070d8e8250fd272840e4f517b9eeb9f3cd1b25ddf70')
ON DUPLICATE KEY UPDATE email = 'central-pediatrics-mulund@lifelink.com', passwordHash = 'caacccae61d299422f0827afbaa4b5fd:483330ef0405fb07d7a48c0ed66ff4207c908857ba547d5af4fbdefa071360c5487069261cceb902a1619070d8e8250fd272840e4f517b9eeb9f3cd1b25ddf70';

-- Doctor: Dr. Swati P. Bhosale, MD (Pediatrics) (Pediatrics - Vashi Sector 15 Medical Park)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-pediatrics-vashi', 'Dr. Swati P. Bhosale, MD (Pediatrics)', 'harbour-pediatrics-vashi@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Swati P. Bhosale, MD (Pediatrics)', email = 'harbour-pediatrics-vashi@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-pediatrics-vashi'), 'mock-harbour-pediatrics-vashi', 'harbour-pediatrics-vashi@lifelink.com', 'f4676bbbeb52d9e1435b35de8327d1cb:6e044b340ba28925d2f2a999b965c489d0d1a26700d54d9dd3fef611bfc276956441d12bc1b1969f640cb4b0260f710309169df73af9354039e6815f665ae078')
ON DUPLICATE KEY UPDATE email = 'harbour-pediatrics-vashi@lifelink.com', passwordHash = 'f4676bbbeb52d9e1435b35de8327d1cb:6e044b340ba28925d2f2a999b965c489d0d1a26700d54d9dd3fef611bfc276956441d12bc1b1969f640cb4b0260f710309169df73af9354039e6815f665ae078';

-- Doctor: Dr. Milind S. Chitnis, MS (Ophthalmology, FICO) (Ophthalmology - Goregaon West Medical Enclave)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-ophthalmology-goregaon', 'Dr. Milind S. Chitnis, MS (Ophthalmology, FICO)', 'western-ophthalmology-goregaon@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Milind S. Chitnis, MS (Ophthalmology, FICO)', email = 'western-ophthalmology-goregaon@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-ophthalmology-goregaon'), 'mock-western-ophthalmology-goregaon', 'western-ophthalmology-goregaon@lifelink.com', 'a66e191f5094c99c1a98054654f030d9:58f89a99752a48a27cd96190fc80341a90d5f98da8786dfbdf03a132d90d0202b4be155b0212f26ddcc29d9a2d819c08fe52fdc2b790a521db035a604dfb146a')
ON DUPLICATE KEY UPDATE email = 'western-ophthalmology-goregaon@lifelink.com', passwordHash = 'a66e191f5094c99c1a98054654f030d9:58f89a99752a48a27cd96190fc80341a90d5f98da8786dfbdf03a132d90d0202b4be155b0212f26ddcc29d9a2d819c08fe52fdc2b790a521db035a604dfb146a';

-- Doctor: Dr. Harish D. Salunkhe, MS (Ophthalmology) (Ophthalmology - Fort Medical Enclave)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-ophthalmology-csmt', 'Dr. Harish D. Salunkhe, MS (Ophthalmology)', 'central-ophthalmology-csmt@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Harish D. Salunkhe, MS (Ophthalmology)', email = 'central-ophthalmology-csmt@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-ophthalmology-csmt'), 'mock-central-ophthalmology-csmt', 'central-ophthalmology-csmt@lifelink.com', '7acbc6e113bf19de31cccb4512ab66fc:efaf34e78f1f24561156065e11e00e94d27716344762b382cd5b3ef16c9636a7a6a6cf3864419fd2333a9343eb16dc2a79aa33af8f7f20ded1d375db73184430')
ON DUPLICATE KEY UPDATE email = 'central-ophthalmology-csmt@lifelink.com', passwordHash = '7acbc6e113bf19de31cccb4512ab66fc:efaf34e78f1f24561156065e11e00e94d27716344762b382cd5b3ef16c9636a7a6a6cf3864419fd2333a9343eb16dc2a79aa33af8f7f20ded1d375db73184430';

-- Doctor: Dr. Vandana S. Rao, MS (Ophthalmology) (Ophthalmology - Chembur Diamond Garden Sector)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-ophthalmology-chembur', 'Dr. Vandana S. Rao, MS (Ophthalmology)', 'harbour-ophthalmology-chembur@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Vandana S. Rao, MS (Ophthalmology)', email = 'harbour-ophthalmology-chembur@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-ophthalmology-chembur'), 'mock-harbour-ophthalmology-chembur', 'harbour-ophthalmology-chembur@lifelink.com', 'a39428c75cd731bedfb426f159c5c2ba:1899070f269dcfe91b04a9d986aaea2582e6249218350bd9d78359573673bc9c4575c190f2c6987804715de3c6fb96c62d89b6bfe3acbd4c742ea5dba354c1f0')
ON DUPLICATE KEY UPDATE email = 'harbour-ophthalmology-chembur@lifelink.com', passwordHash = 'a39428c75cd731bedfb426f159c5c2ba:1899070f269dcfe91b04a9d986aaea2582e6249218350bd9d78359573673bc9c4575c190f2c6987804715de3c6fb96c62d89b6bfe3acbd4c742ea5dba354c1f0';

-- Doctor: Dr. Anil M. Kumar, MD, DM (Gastroenterology) (Gastroenterology - Borivali West Health Corridor)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-gastroenterology-borivali', 'Dr. Anil M. Kumar, MD, DM (Gastroenterology)', 'western-gastroenterology-borivali@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Anil M. Kumar, MD, DM (Gastroenterology)', email = 'western-gastroenterology-borivali@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-gastroenterology-borivali'), 'mock-western-gastroenterology-borivali', 'western-gastroenterology-borivali@lifelink.com', '069b3fc4859305f87f72fda0c7dfbaec:39e5fb2435e29b4113e4aa3d5740bb9cd5ed57b023886e66618ee0174e26bb20c12d54c6ae927814fcfdac555ea2e6689b52c29fcc83c28193a37be7fdb59bc5')
ON DUPLICATE KEY UPDATE email = 'western-gastroenterology-borivali@lifelink.com', passwordHash = '069b3fc4859305f87f72fda0c7dfbaec:39e5fb2435e29b4113e4aa3d5740bb9cd5ed57b023886e66618ee0174e26bb20c12d54c6ae927814fcfdac555ea2e6689b52c29fcc83c28193a37be7fdb59bc5';

-- Doctor: Dr. Sanjeev B. Kulkarni, MD, DM (Gastroenterology) (Gastroenterology - Thane West Civic Medical Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-gastroenterology-thane', 'Dr. Sanjeev B. Kulkarni, MD, DM (Gastroenterology)', 'central-gastroenterology-thane@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Sanjeev B. Kulkarni, MD, DM (Gastroenterology)', email = 'central-gastroenterology-thane@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-gastroenterology-thane'), 'mock-central-gastroenterology-thane', 'central-gastroenterology-thane@lifelink.com', 'fd4738da69f85029c834c6f06f5facfc:f58581ebb28e05021e33c975bfd6381e6121bb586588d28dfd6863bb9db4b6ea6b6f256a21911c2218bf99f5403c44c07427f6f549921f33752ec546ac2aa18a')
ON DUPLICATE KEY UPDATE email = 'central-gastroenterology-thane@lifelink.com', passwordHash = 'fd4738da69f85029c834c6f06f5facfc:f58581ebb28e05021e33c975bfd6381e6121bb586588d28dfd6863bb9db4b6ea6b6f256a21911c2218bf99f5403c44c07427f6f549921f33752ec546ac2aa18a';

-- Doctor: Dr. Ritu G. Kapoor, MD, DM (Gastroenterology) (Gastroenterology - Sewri Coastal Medical District)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-gastroenterology-sewri', 'Dr. Ritu G. Kapoor, MD, DM (Gastroenterology)', 'harbour-gastroenterology-sewri@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Ritu G. Kapoor, MD, DM (Gastroenterology)', email = 'harbour-gastroenterology-sewri@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-gastroenterology-sewri'), 'mock-harbour-gastroenterology-sewri', 'harbour-gastroenterology-sewri@lifelink.com', '41cb0e0b493c1a974d1c89d2c42405df:a56f92dac7cb907c52dd1a87102f3adde98451ab19fe623379bce3a68bce7349e34d6ec28f5bad09226f60c48ad9d8dfa977b9d859291b2ebfd005c73abf579b')
ON DUPLICATE KEY UPDATE email = 'harbour-gastroenterology-sewri@lifelink.com', passwordHash = '41cb0e0b493c1a974d1c89d2c42405df:a56f92dac7cb907c52dd1a87102f3adde98451ab19fe623379bce3a68bce7349e34d6ec28f5bad09226f60c48ad9d8dfa977b9d859291b2ebfd005c73abf579b';

-- Doctor: Dr. Siddharth P. Merchant, MD (Psychiatry, DPM) (Psychiatry - Sewri Coastal Medical District)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-psychiatry-sewri', 'Dr. Siddharth P. Merchant, MD (Psychiatry, DPM)', 'harbour-psychiatry-sewri@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Siddharth P. Merchant, MD (Psychiatry, DPM)', email = 'harbour-psychiatry-sewri@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-psychiatry-sewri'), 'mock-harbour-psychiatry-sewri', 'harbour-psychiatry-sewri@lifelink.com', '7a8aedb5ba7190303bc87883253fc25c:27d387758908d2cd3e75b1bf93456fbd22df8d697c4f4540133eec6cdf26421e277dc2cd9afada02b602c57a0a911dda621ff090fbf9f0ca5b0a599a3995f772')
ON DUPLICATE KEY UPDATE email = 'harbour-psychiatry-sewri@lifelink.com', passwordHash = '7a8aedb5ba7190303bc87883253fc25c:27d387758908d2cd3e75b1bf93456fbd22df8d697c4f4540133eec6cdf26421e277dc2cd9afada02b602c57a0a911dda621ff090fbf9f0ca5b0a599a3995f772';

-- Doctor: Dr. Mahesh A. Bhide, MD (Psychiatry) (Psychiatry - Dadar West Medical Square)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-psychiatry-dadar', 'Dr. Mahesh A. Bhide, MD (Psychiatry)', 'western-psychiatry-dadar@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Mahesh A. Bhide, MD (Psychiatry)', email = 'western-psychiatry-dadar@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-psychiatry-dadar'), 'mock-western-psychiatry-dadar', 'western-psychiatry-dadar@lifelink.com', '492139608f7ccb57690048f090701330:2b97064799b1db003bee3925a3a18f83dc57e42dde104a9194c05e74b2356dada16d008ff85dc10cdba122cc1f34ecd3b028645a7e2bcbb083c898d75a1f1629')
ON DUPLICATE KEY UPDATE email = 'western-psychiatry-dadar@lifelink.com', passwordHash = '492139608f7ccb57690048f090701330:2b97064799b1db003bee3925a3a18f83dc57e42dde104a9194c05e74b2356dada16d008ff85dc10cdba122cc1f34ecd3b028645a7e2bcbb083c898d75a1f1629';

-- Doctor: Dr. Sanjay D. Varma, MD (Psychiatry) (Psychiatry - Ghatkopar East Health District)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-psychiatry-ghatkopar', 'Dr. Sanjay D. Varma, MD (Psychiatry)', 'central-psychiatry-ghatkopar@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Sanjay D. Varma, MD (Psychiatry)', email = 'central-psychiatry-ghatkopar@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-psychiatry-ghatkopar'), 'mock-central-psychiatry-ghatkopar', 'central-psychiatry-ghatkopar@lifelink.com', '7ece2090910c34cd7d3dfc6c13cf1e66:28c70beff87f2360e64a03de904a3609c925fe0902e7794eca906fdcbc5adca0179de6697e3fbbc79791e2875c1dd820c2b0ea063e68dd723c59053f040cb99e')
ON DUPLICATE KEY UPDATE email = 'central-psychiatry-ghatkopar@lifelink.com', passwordHash = '7ece2090910c34cd7d3dfc6c13cf1e66:28c70beff87f2360e64a03de904a3609c925fe0902e7794eca906fdcbc5adca0179de6697e3fbbc79791e2875c1dd820c2b0ea063e68dd723c59053f040cb99e';

-- Doctor: Dr. Pooja S. Chawla, MD, DM (Endocrinology) (Endocrinology - Chembur Diamond Garden Sector)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-endocrinology-chembur', 'Dr. Pooja S. Chawla, MD, DM (Endocrinology)', 'harbour-endocrinology-chembur@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Pooja S. Chawla, MD, DM (Endocrinology)', email = 'harbour-endocrinology-chembur@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-endocrinology-chembur'), 'mock-harbour-endocrinology-chembur', 'harbour-endocrinology-chembur@lifelink.com', 'd148877a81e96e6c4788535e5e3b1a98:1e70e0e4bc8b696f2a4e2bac876b730eb2bdb41c42ac7c8e96b961a842e931e9aa3fb98f99a801aa2af53606c2967e2e36fe48d059b2a5e3728e5c10859d5e16')
ON DUPLICATE KEY UPDATE email = 'harbour-endocrinology-chembur@lifelink.com', passwordHash = 'd148877a81e96e6c4788535e5e3b1a98:1e70e0e4bc8b696f2a4e2bac876b730eb2bdb41c42ac7c8e96b961a842e931e9aa3fb98f99a801aa2af53606c2967e2e36fe48d059b2a5e3728e5c10859d5e16';

-- Doctor: Dr. Rohan M. Kirloskar, MD, DM (Endocrinology) (Endocrinology - Marine Lines & Churchgate Boulevard)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-endocrinology-churchgate', 'Dr. Rohan M. Kirloskar, MD, DM (Endocrinology)', 'western-endocrinology-churchgate@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Rohan M. Kirloskar, MD, DM (Endocrinology)', email = 'western-endocrinology-churchgate@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-endocrinology-churchgate'), 'mock-western-endocrinology-churchgate', 'western-endocrinology-churchgate@lifelink.com', 'c920c3210a3ebcc48d235ca4fdaf7d12:3aa0fe4326d898d074f5ebd0e5cbb868669fdc2ce7229036cf7897b3312ec517a90bd00c5301f31438bdd0c81d8a86c477ddd121f21aa3b49c433d1cd89e10e4')
ON DUPLICATE KEY UPDATE email = 'western-endocrinology-churchgate@lifelink.com', passwordHash = 'c920c3210a3ebcc48d235ca4fdaf7d12:3aa0fe4326d898d074f5ebd0e5cbb868669fdc2ce7229036cf7897b3312ec517a90bd00c5301f31438bdd0c81d8a86c477ddd121f21aa3b49c433d1cd89e10e4';

-- Doctor: Dr. Neha V. Paranjpe, MD, DM (Endocrinology) (Endocrinology - Bhandup West Medical Park)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-endocrinology-bhandup', 'Dr. Neha V. Paranjpe, MD, DM (Endocrinology)', 'central-endocrinology-bhandup@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Neha V. Paranjpe, MD, DM (Endocrinology)', email = 'central-endocrinology-bhandup@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-endocrinology-bhandup'), 'mock-central-endocrinology-bhandup', 'central-endocrinology-bhandup@lifelink.com', '354f9e38496833335a0c61676a6df359:90261c8dd6573952f6da1dba921666af291d9927a220957eb013df9a0a5a3f6a720932144d20cd8c6702c566900dda18717a0fe303596c6ebe550e8ffd1a0304')
ON DUPLICATE KEY UPDATE email = 'central-endocrinology-bhandup@lifelink.com', passwordHash = '354f9e38496833335a0c61676a6df359:90261c8dd6573952f6da1dba921666af291d9927a220957eb013df9a0a5a3f6a720932144d20cd8c6702c566900dda18717a0fe303596c6ebe550e8ffd1a0304';

-- Doctor: Dr. Sameer K. Merchant, MD, DM (Pulmonology) (Pulmonology - Vashi Sector 15 Medical Park)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-pulmonology-vashi', 'Dr. Sameer K. Merchant, MD, DM (Pulmonology)', 'harbour-pulmonology-vashi@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Sameer K. Merchant, MD, DM (Pulmonology)', email = 'harbour-pulmonology-vashi@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-pulmonology-vashi'), 'mock-harbour-pulmonology-vashi', 'harbour-pulmonology-vashi@lifelink.com', '3061449eed154def89a79d50b283b388:c9d65f2aa7371fac88afa93964d945ba766214dcf855599f99e7daca99455f3580b19b3e3d7227484fa641d2989ed3155c1e638ff2354fe55c8483b25a191a66')
ON DUPLICATE KEY UPDATE email = 'harbour-pulmonology-vashi@lifelink.com', passwordHash = '3061449eed154def89a79d50b283b388:c9d65f2aa7371fac88afa93964d945ba766214dcf855599f99e7daca99455f3580b19b3e3d7227484fa641d2989ed3155c1e638ff2354fe55c8483b25a191a66';

-- Doctor: Dr. Malini S. Iyer, MD, DM (Pulmonology) (Pulmonology - Thane West Civic Medical Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-pulmonology-thane', 'Dr. Malini S. Iyer, MD, DM (Pulmonology)', 'central-pulmonology-thane@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Malini S. Iyer, MD, DM (Pulmonology)', email = 'central-pulmonology-thane@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-pulmonology-thane'), 'mock-central-pulmonology-thane', 'central-pulmonology-thane@lifelink.com', '30e824d004282457225b2cb94eb30230:77abf7f9ffe8297777e42e966eb4df852547c54e789b8a5a17993af46cd55e503abe05c51f0cde03c334a4e42321a0d8757cc003a9eb029c8f6f37b4a91498ae')
ON DUPLICATE KEY UPDATE email = 'central-pulmonology-thane@lifelink.com', passwordHash = '30e824d004282457225b2cb94eb30230:77abf7f9ffe8297777e42e966eb4df852547c54e789b8a5a17993af46cd55e503abe05c51f0cde03c334a4e42321a0d8757cc003a9eb029c8f6f37b4a91498ae';

-- Doctor: Dr. Vikramaditya S. Sengupta, MD, FCCP (Pulmonology) (Pulmonology - Andheri West Healthcare Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-pulmonology-andheri', 'Dr. Vikramaditya S. Sengupta, MD, FCCP (Pulmonology)', 'western-pulmonology-andheri@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Vikramaditya S. Sengupta, MD, FCCP (Pulmonology)', email = 'western-pulmonology-andheri@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-pulmonology-andheri'), 'mock-western-pulmonology-andheri', 'western-pulmonology-andheri@lifelink.com', 'a9bb4068475c2bfa20375fdbf7da1396:fe2acd5411a430efa6e65c734602625f3cd23a2671e4a9c3f753143812fbec4e2bc39dcf7369e91f3955f97f0fe26df88f2bb2f084c46fe887eae2434c0ea2f2')
ON DUPLICATE KEY UPDATE email = 'western-pulmonology-andheri@lifelink.com', passwordHash = 'a9bb4068475c2bfa20375fdbf7da1396:fe2acd5411a430efa6e65c734602625f3cd23a2671e4a9c3f753143812fbec4e2bc39dcf7369e91f3955f97f0fe26df88f2bb2f084c46fe887eae2434c0ea2f2';

-- Doctor: Dr. Tarun K. Bansal, MD, DGO (Gynecology) (Gynecology - Panvel City Wellness Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-harbour-gynecology-panvel', 'Dr. Tarun K. Bansal, MD, DGO (Gynecology)', 'harbour-gynecology-panvel@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Tarun K. Bansal, MD, DGO (Gynecology)', email = 'harbour-gynecology-panvel@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-harbour-gynecology-panvel'), 'mock-harbour-gynecology-panvel', 'harbour-gynecology-panvel@lifelink.com', '259820b9c82ed0926249248e1145031f:e5b56610546d97df0c4b6ab458b78688e559586d2d660f69e469963c37e650aec5bc0da5052b55f3a627c3bb5d94685f3edd9d71636be2b6751e889a1b092020')
ON DUPLICATE KEY UPDATE email = 'harbour-gynecology-panvel@lifelink.com', passwordHash = '259820b9c82ed0926249248e1145031f:e5b56610546d97df0c4b6ab458b78688e559586d2d660f69e469963c37e650aec5bc0da5052b55f3a627c3bb5d94685f3edd9d71636be2b6751e889a1b092020';

-- Doctor: Dr. Gauri N. Tendulkar, MD, DGO (Gynecology) (Gynecology - Goregaon West Medical Enclave)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-western-gynecology-goregaon', 'Dr. Gauri N. Tendulkar, MD, DGO (Gynecology)', 'western-gynecology-goregaon@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Gauri N. Tendulkar, MD, DGO (Gynecology)', email = 'western-gynecology-goregaon@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-western-gynecology-goregaon'), 'mock-western-gynecology-goregaon', 'western-gynecology-goregaon@lifelink.com', '5f559f33e07f069b69173649fc6c3b70:61ca04942f37e3d098c00ffdb7570b8fa5332611ab4570c02322ecdea2d0d56607cd7035c7d06dff78c186f4dfe0f9912147582dcf574e6785acb092f198a8a0')
ON DUPLICATE KEY UPDATE email = 'western-gynecology-goregaon@lifelink.com', passwordHash = '5f559f33e07f069b69173649fc6c3b70:61ca04942f37e3d098c00ffdb7570b8fa5332611ab4570c02322ecdea2d0d56607cd7035c7d06dff78c186f4dfe0f9912147582dcf574e6785acb092f198a8a0';

-- Doctor: Dr. Priya R. Nadkarni, MD, DGO (Gynecology) (Gynecology - Dombivli East Healthcare Hub)
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('synthetic-doctor:mock-central-gynecology-dombivli', 'Dr. Priya R. Nadkarni, MD, DGO (Gynecology)', 'central-gynecology-dombivli@lifelink.com', 'synthetic-clinician', 'doctor', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Dr. Priya R. Nadkarni, MD, DGO (Gynecology)', email = 'central-gynecology-dombivli@lifelink.com', role = 'doctor', updatedAt = NOW();

INSERT INTO syntheticDoctorCredentials (userId, doctorId, email, passwordHash)
VALUES ((SELECT id FROM users WHERE openId = 'synthetic-doctor:mock-central-gynecology-dombivli'), 'mock-central-gynecology-dombivli', 'central-gynecology-dombivli@lifelink.com', '9defc9e9d1b4a75bcce1d8a95ce878a0:afd783f1a501528c55c41777268c0d5a0c2569678727a41bc65f4211da3c4f052097242119dbff93deb8e9743bd7efc5526306111427d6d4aec562a3f42ff0e9')
ON DUPLICATE KEY UPDATE email = 'central-gynecology-dombivli@lifelink.com', passwordHash = '9defc9e9d1b4a75bcce1d8a95ce878a0:afd783f1a501528c55c41777268c0d5a0c2569678727a41bc65f4211da3c4f052097242119dbff93deb8e9743bd7efc5526306111427d6d4aec562a3f42ff0e9';

-- ============================================================================
-- VERIFICATION & AUDIT QUERIES (Displays immediately in MySQL Workbench)
-- ============================================================================
SELECT '✅ LifeLink database created & populated successfully!' AS Setup_Status;

-- View all Doctor login accounts:
SELECT u.id AS user_id, u.name AS doctor_name, u.email AS doctor_email, c.doctorId, u.role, u.updatedAt
FROM users u
JOIN syntheticDoctorCredentials c ON u.id = c.userId
ORDER BY u.id ASC;

-- View Patient login accounts:
SELECT u.id AS user_id, u.name AS patient_name, u.email AS patient_email, u.role, u.createdAt
FROM users u
WHERE u.role = 'user';
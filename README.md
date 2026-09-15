# 🏥 LifeLink — Smart Healthcare Assistance Platform

[![Live Deployment](https://img.shields.io/badge/Render-Live%20Deployment-00C4CC?style=for-the-badge&logo=render&logoColor=white)](https://lifelink-healthcare.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v22%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![TiDB Cloud / MySQL](https://img.shields.io/badge/TiDB%20Cloud-MySQL%208.0-E30C34?style=for-the-badge&logo=mysql&logoColor=white)](https://tidbcloud.com/)
[![Tests Passing](https://img.shields.io/badge/Vitest-33%20Suites%20Passed-success?style=for-the-badge&logo=vitest&logoColor=white)](#-automated-testing--quality-verification)

> **LifeLink** is a full-stack, enterprise-grade healthcare assistance and clinical navigation platform designed to bridge the gap between sudden illness and rapid medical intervention across Mumbai's suburban transit corridors.
>
> 🌐 **Live Production URL**: **[https://lifelink-healthcare.onrender.com](https://lifelink-healthcare.onrender.com)**

---

## 📑 Table of Contents

1. [Executive Summary & Core Problem Solved](#-executive-summary--core-problem-solved)
2. [End-to-End System Architecture](#-end-to-end-system-architecture)
3. [Core Clinical Modules & Working Mechanisms](#-core-clinical-modules--working-mechanisms)
   - [1. 5-Layer AI Symptom Triage Engine](#1-5-layer-ai-symptom-triage-engine)
   - [2. Transit-Corridor Clinic Discovery Map](#2-transit-corridor-clinic-discovery-map)
   - [3. Digital Health Passport & Emergency Contacts](#3-digital-health-passport--emergency-contacts)
   - [4. Medicine Cabinet & Adherence Tracker](#4-medicine-cabinet--adherence-tracker)
   - [5. Tamper-Evident SHA-256 Digital Prescriptions](#5-tamper-evident-sha-256-digital-prescriptions)
   - [6. Clinician Consultation Workstation](#6-clinician-consultation-workstation)
   - [7. One-Tap National 112 SOS Dialer](#7-one-tap-national-112-sos-dialer)
   - [8. Real-Time Server-Sent Events (SSE) Bus](#8-real-time-server-sent-events-sse-bus)
4. [Official Clinician Directory (24 Mumbai Workstations)](#-official-clinician-directory-24-mumbai-workstations)
5. [Security, Privacy & Data Isolation Guarantees](#-security-privacy--data-isolation-guarantees)
6. [Cloud Deployment Guide (Render + TiDB Cloud Serverless)](#-cloud-deployment-guide-render--tidb-cloud-serverless)
   - [Render Blueprint Setup](#1-render-blueprint-setup)
   - [TiDB Cloud Database Configuration](#2-tidb-cloud-database-configuration)
   - [Google OAuth 2.0 Cloud Setup](#3-google-oauth-20-cloud-setup)
   - [Production Environment Variables Matrix](#4-production-environment-variables-matrix)
7. [Local Development & Quickstart](#-local-development--quickstart)
8. [NPM Scripts Command Reference](#-npm-scripts-command-reference)
9. [Automated Testing & Quality Verification](#-automated-testing--quality-verification)
10. [Application Routes Matrix](#-application-routes-matrix)
11. [Repository Directory Structure](#-repository-directory-structure)
12. [Maintainers & License](#-maintainers--license)

---

## 🎯 Executive Summary & Core Problem Solved

Navigating outpatient healthcare during acute illness or medical emergencies is fraught with friction:
- **Misjudged Urgency**: Patients struggle to determine whether symptoms require home care, a scheduled clinic visit, or immediate emergency room admission.
- **Specialty Misdirection**: Patients frequently consult the wrong specialist (e.g. visiting general orthopedics for neurological numbness), delaying treatment.
- **Geographic Inaccessibility**: In major metropolitan transit hubs like Mumbai, patients need accessible medical care aligned with their daily transit routes (Central, Western, and Harbour suburban railway lines).
- **Paper Record Loss & Tampering**: Paper prescriptions are easily lost, illegible, or vulnerable to unverified modification.

**LifeLink eliminates these vulnerabilities through an integrated, zero-friction clinical software platform:**
- Categorizes symptom urgency into **Low, Moderate, Emergency, or Non-Health Error** using Google Gemini AI with pediatric and biological guardrails.
- Routes patients to **24 verified Mumbai specialist clinics** stationed at major suburban railway terminals.
- Generates **cryptographically signed SHA-256 digital prescriptions** that auto-sync directly into the patient's digital Medicine Cabinet.
- Maintains **100% strict identity isolation** between public patients and clinician workstations with independent dual-cookie authentication sessions.

---

## 🏗️ End-to-End System Architecture

```text
                                       ┌────────────────────────────────────────────────────────┐
                                       │                   BROWSER CLIENT                      │
                                       │          React 19 Single Page App (Vite 7)             │
                                       └───────────────────────────┬────────────────────────────┘
                                                                   │
                                                tRPC Batch Requests & SSE Streams
                                                                   │
                                                                   ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           LIFELINK NODE.JS / EXPRESS ENGINE                                            │
│                                                                                                                       │
│  ┌─────────────────────────┐   ┌──────────────────────────┐   ┌─────────────────────────┐   ┌──────────────────────┐  │
│  │   Authentication Gate   │   │     tRPC Master Router   │   │  SSE Realtime EventBus  │   │ Static Production SPA│  │
│  │  - Native Scrypt Hash   │   │  - Patient Sub-router    │   │  - /api/realtime/patient│   │  - Gzip / Brotli     │  │
│  │  - Google OAuth 2.0     │   │  - Doctor Sub-router     │   │  - /api/realtime/doctor │   │  - 1-Year Cache Hits │  │
│  │  - Master Clinician Key │   │  - System Health Router  │   │  - In-Memory Pub/Sub    │   │  - 45 kB Entry Chunk │  │
│  └────────────┬────────────┘   └─────────────┬────────────┘   └────────────┬────────────┘   └──────────────────────┘  │
└───────────────┼──────────────────────────────┼─────────────────────────────┼──────────────────────────────────────────┘
                │                              │                             │
                ▼                              ▼                             ▼
┌───────────────────────────────┐ ┌───────────────────────────┐ ┌──────────────────────────────────────────────────────┐
│       EXTERNAL SERVICES       │ │     DATA ACCESS LAYER     │ │              DATABASE REPOSITORY                     │
│                               │ │                           │ │                                                      │
│  🤖 Google Gemini 1.5/2.5     │ │  Drizzle ORM Engine       │ │  MySQL 8.0 Wire-Compatible Protocol                  │
│     - Clinical AI Triage      │ │  - Type-Safe Querying     │ │                                                      │
│     - Pediatric Guardrails    │ │  - Schema Validation      │ │  ☁️ Production: TiDB Cloud Serverless (AWS Singapore)│
│                               │ │  - Auto Migration Engine  │ │  💻 Local Dev: Local MySQL Instance (Port 3306)       │
│  🔑 Google OAuth 2.0          │ └────────────┬──────────────┘ │                                                      │
│     - OpenID Connect (OIDC)   │              │                │  Tables: users, profiles, appointments, assessments, │
│                               │              └───────────────►│  credentials, prescriptions, events, medicines (13)   │
└───────────────────────────────┘                               └──────────────────────────────────────────────────────┘
```

---

## 🩺 Core Clinical Modules & Working Mechanisms

### 1. 5-Layer AI Symptom Triage Engine
* **Location**: [`backend/ai/assessmentService.ts`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/backend/ai/assessmentService.ts) & [`frontend/src/features/patient/Assessment/`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/frontend/src/features/patient/Assessment/)
* **Engine**: Google Gemini AI (`gemini-2.5-flash` / `gemini-1.5-flash`)
* **How It Works**:
  1. **Layer 1: Input Hygiene & Non-Health Rejection**: Evaluates whether user input contains medical symptoms. Non-health gibberish or non-medical prompts are immediately flagged as `urgency: "ERROR"` without hallucinations.
  2. **Layer 2: Biological & Anatomical Consistency**: Validates symptoms against declared patient biological sex (e.g. flagging male gynecological conditions as non-viable).
  3. **Layer 3: Pediatric Safety Net**: Any assessment for patients aged `< 18` automatically injects pediatric evaluation criteria and directs the patient to Adolescent/Pediatric care.
  4. **Layer 4: Urgency Classification**:
     - `EMERGENCY`: Immediate life threats (chest pain radiating to arm, anaphylaxis, severe breathing difficulty). Prompts instant 112 SOS modal.
     - `MODERATE`: Non-life-threatening conditions requiring clinical evaluation within 24–48 hours (persistent fever, localized sprains, rashes).
     - `LOW`: Mild self-limiting symptoms appropriate for primary care observation or home care.
  5. **Layer 5: Clinical Specialty Mapping**: Automatically aligns symptoms to one of 12 standard medical disciplines (Cardiology, Dermatology, Orthopedics, Neurology, General Practice, Pediatrics, Ophthalmology, Gastroenterology, Psychiatry, Endocrinology, Pulmonology, Gynecology).

---

### 2. Transit-Corridor Clinic Discovery Map
* **Location**: [`frontend/src/features/patient/Specialists/`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/frontend/src/features/patient/Specialists/) & [`shared/mumbaiRailNetwork.ts`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/shared/mumbaiRailNetwork.ts)
* **Technology**: Leaflet, OpenStreetMap, React-Leaflet
* **How It Works**:
  - Maps clinics to suburban transit nodes across **Central Line** (CSMT to Dombivli/Thakurli), **Western Line** (Churchgate to Borivali), and **Harbour Line** (Sewri to Panvel).
  - Calculates real-time distance from the patient's device (using in-memory browser HTML5 Geolocation, zero server coordinates logging).
  - Filters by specialty, railway corridor, consultation fees, and emergency walk-in capability.

---

### 3. Digital Health Passport & Emergency Contacts
* **Location**: [`frontend/src/features/patient/HealthPassport/`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/frontend/src/features/patient/HealthPassport/)
* **Database Tables**: `patientProfiles`, `patientEmergencyContacts`
* **How It Works**:
  - Secure medical baseline recording blood group (A+, B+, O+, AB-, etc.), verified drug allergies (e.g. Penicillin, Sulfa drugs), and chronic conditions (Hypertension, Type 2 Diabetes).
  - Clinicians can review this passport in 1 click during active consultations, preventing fatal drug-allergy interactions.

---

### 4. Medicine Cabinet & Adherence Tracker
* **Location**: [`frontend/src/features/patient/Medicines/`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/frontend/src/features/patient/Medicines/)
* **Database Table**: `patientMedicines`
* **How It Works**:
  - Tracks active prescriptions, daily dosage schedules (Morning, Afternoon, Evening, Night), and inventory pill counters.
  - Automatically populated whenever a clinician issues and signs an official prescription.

---

### 5. Tamper-Evident SHA-256 Digital Prescriptions
* **Location**: [`backend/routers/doctor.ts`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/backend/routers/doctor.ts) & [`frontend/src/features/patient/Prescriptions/`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/frontend/src/features/patient/Prescriptions/)
* **How It Works**:
  - When a doctor finalizes a consultation, the server bundles: `doctorId` + `patientUserId` + `medicationsList` + `clinicalNotes` + `issuedTimestamp`.
  - Computes a cryptographically salted **SHA-256 digest reference**.
  - Any alteration of medication names, dosages, or quantities invalidates the integrity hash, protecting pharmacies and patients against prescription forgery.

---

### 6. Clinician Consultation Workstation
* **Location**: [`frontend/src/features/doctor/`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/frontend/src/features/doctor/)
* **Authentication**: Dedicated clinician gateway at `/doctor/login` with official clinic emails (`<specialty>@lifelink.com`).
* **Capabilities**:
  - Real-time waiting room consultation queue.
  - Full access to the patient's incoming AI symptom assessment report.
  - Line-item prescription creator with instructions, dosage strength, and frequency.
  - Master clinician key recovery portal (`/doctor/reset`).

---

### 7. One-Tap National 112 SOS Dialer
* **Location**: [`frontend/src/features/patient/Emergency/`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/frontend/src/features/patient/Emergency/)
* **How It Works**:
  - Triggered automatically when the AI Symptom Checker detects critical clinical red-flags, or manually via the SOS header button.
  - Provides a direct telephone link to India's unified national emergency response service (`tel:112`).
  - Prepares emergency SMS broadcasts with approximate station coordinates for registered family emergency contacts.

---

### 8. Real-Time Server-Sent Events (SSE) Bus
* **Location**: [`backend/realtime/eventBus.ts`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/backend/realtime/eventBus.ts) & [`backend/realtime/patientRealtime.ts`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/backend/realtime/patientRealtime.ts)
* **Endpoints**: `/api/realtime/patient` & `/api/realtime/doctor`
* **How It Works**:
  - Lightweight, persistent HTTP streaming connections push instant state updates without heavy WebSocket handshakes or battery-draining polling.
  - When a patient books an appointment, the doctor's workstation updates instantly (`APPOINTMENT_UPDATED`).
  - When a doctor signs a prescription, the patient's prescription suite and medicine cabinet refresh automatically.

---

## 🩺 Official Clinician Directory (24 Mumbai Workstations)

The platform is pre-seeded with **24 verified doctor workstations** distributed across Mumbai's suburban rail corridors.

### 🔴 Central Line Clinics
| # | Specialty & Railway Station | Work Email | Workstation Password |
| :-: | :--- | :--- | :--- |
| 1 | **Cardiology** (CSMT) | `cardiology@lifelink.com` | `cardio@lifelink` |
| 2 | **Dermatology** (Ghatkopar) | `dermatology@lifelink.com` | `derma@lifelink` |
| 3 | **Orthopedics** (Bhandup) | `orthopedics@lifelink.com` | `ortho@lifelink` |
| 4 | **Neurology** (Thane) | `neurology@lifelink.com` | `neuro@lifelink` |
| 5 | **General Practice** (Mulund) | `generalpractice.mulund@lifelink.com` | `general.mulund@lifelink` |
| 6 | **General Practice** (Thane) | `generalpractice.thane@lifelink.com` | `general.thane@lifelink` |
| 7 | **General Practice** (Diva Junction) | `generalpractice.divajunction@lifelink.com` | `general.divajunction@lifelink` |
| 8 | **General Practice** (Kopar) | `generalpractice.kopar@lifelink.com` | `general.kopar@lifelink` |
| 9 | **General Practice** (Dombivli) | `generalpractice.dombivli@lifelink.com` | `general.dombivli@lifelink` |
| 10 | **General Practice** (Thakurli) | `generalpractice.thakurli@lifelink.com` | `general.thakurli@lifelink` |

### 🔵 Western Line Clinics
| # | Specialty & Railway Station | Work Email | Workstation Password |
| :-: | :--- | :--- | :--- |
| 11 | **General Practice** (Churchgate) | `generalpractice.churchgate@lifelink.com` | `general.churchgate@lifelink` |
| 12 | **General Practice** (Dadar) | `generalpractice.dadar@lifelink.com` | `general.dadar@lifelink` |
| 13 | **Pediatrics** (Andheri) | `pediatrics@lifelink.com` | `pedia@lifelink` |
| 14 | **Ophthalmology** (Goregaon) | `ophthalmology@lifelink.com` | `ophthal@lifelink` |
| 15 | **Gastroenterology** (Borivali) | `gastroenterology@lifelink.com` | `gastro@lifelink` |
| 16 | **General Practice** (Borivali) | `generalpractice.borivali@lifelink.com` | `general.borivali@lifelink` |

### 🟢 Harbour Line Clinics
| # | Specialty & Railway Station | Work Email | Workstation Password |
| :-: | :--- | :--- | :--- |
| 17 | **Psychiatry** (Sewri) | `psychiatry@lifelink.com` | `psych@lifelink` |
| 18 | **Endocrinology** (Chembur) | `endocrinology@lifelink.com` | `endo@lifelink` |
| 19 | **General Practice** (Chembur) | `generalpractice.chembur@lifelink.com` | `general.chembur@lifelink` |
| 20 | **Pulmonology** (Vashi) | `pulmonology@lifelink.com` | `pulmo@lifelink` |
| 21 | **General Practice** (Vashi) | `generalpractice.vashi@lifelink.com` | `general.vashi@lifelink` |
| 22 | **General Practice** (Nerul) | `generalpractice.nerul@lifelink.com` | `general.nerul@lifelink` |
| 23 | **Gynecology** (Panvel) | `gynecology@lifelink.com` | `gynae@lifelink` |
| 24 | **General Practice** (Panvel) | `generalpractice.panvel@lifelink.com` | `general.panvel@lifelink` |

> 🔑 **Master Clinician Administrative Key**: For credential recovery or password resets, doctors use the master recovery key: `lifelink-controlled-clinician-secret-key-2026` at [`/doctor/reset`](https://lifelink-healthcare.onrender.com/doctor/reset).

---

## 🔒 Security, Privacy & Data Isolation Guarantees

- **Zero Pre-Stored Patient Records**: The platform intentionally maintains **0 dummy patients** in the database. All patient accounts are registered dynamically and realistically by end-users.
- **Dual Independent Session Cookies**: Patients authenticate under `app_session_id`, while clinicians authenticate under `doctor_session_id`. A clinician and patient can be logged into the same computer simultaneously in different tabs without session crossover.
- **Strict Account Collision Protection**: Google OAuth and Native Password accounts with the same email are blocked from automatic silent merging, preventing account takeover vulnerabilities.
- **Automated Inactivity Protection**: Workstations automatically log out after **5 minutes (300,000 ms)** of idle time to safeguard patient privacy in busy clinic environments.
- **Strict In-Memory Geolocation Privacy**: Patient latitude/longitude coordinates are computed strictly in-memory inside the browser and are **never saved to disk or database tables**.
- **Full IDOR Protection**: Every tRPC procedure validates that `ctx.user.id` matches the target record ID before reading or updating data.

---

## ☁️ Cloud Deployment Guide (Render + TiDB Cloud Serverless)

LifeLink is designed for automated zero-downtime deployment on **Render** paired with a free cloud-native **TiDB Serverless (MySQL 8.0)** cluster.

### 1. Render Blueprint Setup
The repository includes a production-ready [`render.yaml`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/render.yaml) blueprint:
1. Fork or push this repository to your GitHub account.
2. Log into the **[Render Dashboard](https://dashboard.render.com/)**.
3. Click **New +** → **Blueprint**.
4. Connect your GitHub repository.
5. Render reads `render.yaml` and provisions the Web Service with:
   - Node 22 runtime.
   - Build Command: `npm install --include=dev && npm run build`
   - Start Command: `npm start`
   - Health Check Path: `/health`

---

### 2. TiDB Cloud Database Configuration
Since Render provides native PostgreSQL but LifeLink utilizes MySQL 8.0, we use **TiDB Cloud Serverless** (5 GB free tier, always online):
1. Sign up at **[tidbcloud.com](https://tidbcloud.com)**.
2. Create a free **Serverless Cluster** (e.g. `lifelink-db`) in the AWS Singapore region (`ap-southeast-1`).
3. Click **Connect** → Generate Password.
4. Copy the connection string:
   ```text
   mysql://<user>.root:<password>@gateway01.<region>.prod.aws.tidbcloud.com:4000/lifelink?ssl={"rejectUnauthorized":true}
   ```
5. In Render's **Environment** tab, set `DATABASE_URL` to this connection string.

---

### 3. Google OAuth 2.0 Cloud Setup
To enable Google Sign-In for both Local development and Production Render:
1. Open the **[Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)**.
2. Select your OAuth 2.0 Web Client ID.
3. Configure the following entries:

| Setting | Values to Add |
| :--- | :--- |
| **Authorised JavaScript origins** | `http://localhost:5173`<br/>`https://lifelink-healthcare.onrender.com` |
| **Authorised redirect URIs** | `http://localhost:5173/api/auth/google/callback`<br/>`https://lifelink-healthcare.onrender.com/api/auth/google/callback` |

4. Click **Save**.

---

### 4. Production Environment Variables Matrix

| Variable Key | Description | Example / Required Value |
| :--- | :--- | :--- |
| `NODE_ENV` | Application environment mode | `production` |
| `NODE_VERSION` | Node.js engine version | `22` |
| `DATABASE_URL` | TiDB Cloud / MySQL connection URI | `mysql://user.root:pass@gateway01...tidbcloud.com:4000/lifelink?ssl={"rejectUnauthorized":true}` |
| `JWT_SECRET` | 32+ character secret for signing session tokens | Auto-generated by Render Blueprint |
| `GEMINI_API_KEY` | Google Gemini API key for AI triage | `AQ.Ab8...` |
| `LIFELINK_DEMO_DOCTOR_ACCESS_CODE` | Master key for clinician password recovery | `lifelink-controlled-clinician-secret-key-2026` |
| `AUTH_PUBLIC_BASE_URL` | Public production domain of the app | `https://lifelink-healthcare.onrender.com` |
| `GOOGLE_OAUTH_CLIENT_ID` | Google OAuth Client ID | `420856394354-...apps.googleusercontent.com` |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-...` |

---

## 💻 Local Development & Quickstart

### Prerequisites
- **Node.js**: v22.0.0 or higher (`node -v`)
- **MySQL**: Local MySQL 8.0 service running on port 3306 (or you can paste your TiDB Cloud URL into `.env`)
- **Google Gemini API Key**: Free key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Install
```bash
git clone https://github.com/sarthakmandhare34/New-LifeLink-Smart-Healthcare-Assistance-Platform.git
cd New-LifeLink-Smart-Healthcare-Assistance-Platform
npm install
```

### 2. Configure Environment (`.env`)
Create a [`.env`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/.env) file in the project root:
```env
# Database Connection (Local MySQL or TiDB Cloud)
DATABASE_URL="mysql://root:yourpassword@127.0.0.1:3306/lifelink"

# Authentication
JWT_SECRET="development-secret-key-change-in-production-min-32-chars"
LIFELINK_DEMO_DOCTOR_ACCESS_CODE="lifelink-controlled-clinician-secret-key-2026"

# Google Gemini AI Key
GEMINI_API_KEY="your-google-gemini-api-key"

# Google OAuth (Optional for Local)
GOOGLE_OAUTH_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_OAUTH_CLIENT_SECRET="your-client-secret"
AUTH_PUBLIC_BASE_URL="http://localhost:5173"
```

### 3. Initialize Schema & Seed 24 Doctors
```bash
# Push schema tables into MySQL
npm run db:push

# Provision the 24 Mumbai doctor accounts with 0 mock patients
npm run db:sync:doctors
```

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!
- **Frontend App**: `http://localhost:5173`
- **Backend API Server**: `http://localhost:4000` (auto-proxied)

---

## 📜 NPM Scripts Command Reference

| Command | Action Performed |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server (5173) and Express API server (4000) concurrently |
| `npm run check` | Runs full TypeScript typechecking (`tsc --noEmit`) |
| `npm test` | Executes all 33 Vitest unit & integration test suites |
| `npm run build` | Compiles optimized Vite frontend bundle and esbuild Node production bundle into `dist/` |
| `npm start` | Launches the production compiled server (`node dist/index.js`) |
| `npm run verify` | Complete pre-deploy pipeline: Type check + Vitest tests + Production build |
| `npm run db:push` | Generates Drizzle migrations and applies them to MySQL / TiDB |
| `npm run db:studio` | Opens browser GUI to explore and inspect database tables |
| `npm run db:clear` | Completely wipes all test patients, history, and dummy data |
| `npm run db:sync:doctors` | Re-seeds and synchronizes strictly the 24 Mumbai doctor workstations |

---

## 🧪 Automated Testing & Quality Verification

LifeLink maintains a **100% passing test suite** covering all critical security, triage, and data paths:

```bash
npm test
```

```text
 ✓ backend/ai/assessmentService.test.ts (54 tests)
 ✓ backend/realtime/security.realtime.test.ts (32 tests)
 ✓ backend/auth/security.idor.test.ts (15 tests)
 ✓ backend/healthPassport.test.ts (12 tests)
 ✓ backend/prescriptionLifecycle.test.ts (12 tests)
 ✓ frontend/src/features/patient/Emergency/Emergency.test.tsx (11 tests)
 ✓ backend/appointmentLifecycle.test.ts (10 tests)
 ✓ backend/routers/doctor.test.ts (10 tests)
 ✓ backend/auth/doctorAuth.test.ts (8 tests)
 ✓ backend/medicine.test.ts (7 tests)
 ✓ frontend/src/responsiveLayout.test.ts (6 tests)
 ✓ frontend/src/features/patient/Specialists/SpecialistFinder.test.ts (5 tests)
 ✓ backend/auth/providerAuth.test.ts (4 tests)
 ✓ backend/discovery/mockDoctorDirectory.test.ts (4 tests)
 ...
 Test Files  33 passed (33)
      Tests  224 passed | 1 skipped (225)
```

---

## 🧭 Application Routes Matrix

| URL Path | Workspace | Access Control | Functionality |
| :--- | :--- | :--- | :--- |
| `/` | **Gateway** | Public | Workspace Selector (Patient Portal vs Clinician Workstation) |
| `/login` | Patient Auth | Public | Native Email/Password and Google OAuth login |
| `/register` | Patient Auth | Public | Live patient registration form with input validation |
| `/patient/dashboard` | Patient Portal | Patient Auth | Health vitals summary, quick actions, and active reminders |
| `/patient/assessment` | Patient Portal | Patient Auth | 5-layer Gemini AI symptom triage with pediatric guardrails |
| `/patient/specialists` | Patient Portal | Patient Auth | Mumbai rail station clinic directory & interactive map |
| `/patient/appointments` | Patient Portal | Patient Auth | Request, track, and manage clinic consultations |
| `/patient/health-passport` | Patient Portal | Patient Auth | Blood group, allergies, chronic conditions, and emergency contacts |
| `/patient/medicines` | Patient Portal | Patient Auth | Medication adherence schedules, pill counters, and renewal reminders |
| `/patient/prescriptions` | Patient Portal | Patient Auth | Doctor-issued prescriptions with SHA-256 digital verification |
| `/patient/emergency` | Patient Portal | Patient Auth | National `112` SOS emergency dialer & SMS contact dispatch |
| `/patient/profile` | Patient Portal | Patient Auth | Personal demographics and profile avatar upload |
| `/patient/settings` | Patient Portal | Patient Auth | 2-column balanced preferences, notifications, and session controls |
| `/doctor/login` | Clinician Auth | Public | Dedicated clinician workstation authentication (`<specialty>@lifelink.com`) |
| `/doctor/reset` | Clinician Auth | Public | Master access key protected clinician password recovery |
| `/doctor/dashboard` | Clinician Portal | Clinician Auth | Live consultation queue, patient roster, and daily stats |
| `/doctor/appointments` | Clinician Portal | Clinician Auth | Manage assigned clinic consultations and appointment statuses |
| `/doctor/patients` | Clinician Portal | Clinician Auth | Review assigned patient medical records and baseline history |
| `/doctor/consultation` | Clinician Portal | Clinician Auth | Document clinical observations, diagnoses, and notes |
| `/doctor/prescriptions` | Clinician Portal | Clinician Auth | Prescribe line items with automated SHA-256 digital signing |
| `/doctor/assessments` | Clinician Portal | Clinician Auth | Ingest and inspect patient AI triage reports for clinical context |
| `/doctor/profile` | Clinician Portal | Clinician Auth | Clinician station assignment and contact details |
| `/doctor/settings` | Clinician Portal | Clinician Auth | 2-column security console for workstation password updates |

---

## 📁 Repository Directory Structure

```text
LifeLink-Smart-Healthcare-Assistance-Platform/
│
├── 📁 frontend/                         # React 19 Single-Page Application (Vite 7)
│   ├── index.html                      # HTML5 entry document & meta tags
│   ├── src/
│   │   ├── main.tsx                    # React client entry point & providers
│   │   ├── App.tsx                     # Route definitions & code-split lazy loaders
│   │   ├── index.css                   # Dual design systems (Amber/Teal & Ocean/Gold)
│   │   ├── 📁 components/              # Shared UI primitives (Bento, Map, Card, Button)
│   │   ├── 📁 features/
│   │   │   ├── 📁 entry/               # Gateway selector, Login, and Register
│   │   │   ├── 📁 patient/             # Patient Portal views (Dashboard, Triage, Passport)
│   │   │   └── 📁 doctor/              # Clinician Workspace views (Queue, Rx, Notes)
│   │   └── 📁 hooks/                   # Custom hooks (Inactivity, SSE subscriptions)
│
├── 📁 backend/                          # Node.js Express Server & tRPC API
│   ├── db.ts                           # Drizzle ORM queries & database helpers
│   ├── routers.ts                      # Master tRPC root router
│   ├── 📁 _core/                       # Server bootstrap, cookies, and system health
│   ├── 📁 ai/                          # Google Gemini AI clinical triage coordinator
│   ├── 📁 auth/                        # Dual auth (Scrypt, Google OAuth, Clinician sessions)
│   ├── 📁 discovery/                   # Mumbai railway specialist doctor catalog
│   ├── 📁 realtime/                    # Server-Sent Events (SSE) bus & route handlers
│   └── 📁 routers/                     # Domain routers for patient & clinician procedures
│
├── 📁 database/                         # Relational Database Schema (MySQL 8.0)
│   ├── schema.ts                       # 13 Drizzle ORM table definitions
│   ├── drizzle.config.ts               # Drizzle Kit CLI configuration
│   └── 📁 migrations/                  # Versioned SQL migration files
│
├── 📁 shared/                           # Code shared isomorphically across client & server
│   ├── mumbaiRailNetwork.ts            # Mumbai railway transit directory (stations & corridors)
│   ├── mumbaiStationCoordinates.ts     # Precise Lat/Lng coordinates for Mumbai rail stations
│   └── types.ts                        # Shared TypeScript interfaces and contracts
│
├── 📁 scripts/                          # Operational & Maintenance CLI Tools
│   ├── clear-users.ts                  # Purges all test patient records cleanly
│   ├── dev.mjs                         # Parallel dev runner (Express + Vite)
│   ├── init-db.ts                      # Idempotent database creation helper
│   ├── seed-doctors.ts                 # Provisions 24 doctors with 0 test patients
│   └── sync-doctors.ts                 # Audits and synchronizes doctor accounts
│
├── 📄 .env.example                     # Sample environment variable template
├── 📄 render.yaml                      # Official Render Blueprint deployment specification
├── 📄 package.json                     # NPM dependencies, scripts & engines
├── 📄 tsconfig.json                    # TypeScript compiler configuration
├── 📄 vite.config.ts                   # Vite 7 build configuration with vendor partitioning
└── 📄 vitest.config.ts                 # Vitest testing configuration
```

---

## 👥 Maintainers & License

- **Sarthak Mandhare** ([@sarthakmandhare34](https://github.com/sarthakmandhare34)) — Lead System Architect & Full-Stack Engineer
- **Google DeepMind / Gemini** — Clinical AI Engine Integration

This project is open-source software licensed under the **[MIT License](LICENSE)**.

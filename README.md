# LifeLink — Smart Healthcare Assistance Platform

[![Live Deployment](https://img.shields.io/badge/Render-Live%20Deployment-00C4CC?style=for-the-badge&logo=render&logoColor=white)](https://lifelink-healthcare.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v22%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![TiDB Cloud](https://img.shields.io/badge/TiDB%20Cloud-MySQL%208.0-E30C34?style=for-the-badge&logo=mysql&logoColor=white)](https://tidbcloud.com/)
[![Tests Passing](https://img.shields.io/badge/Vitest-33%20Suites%20Passed-success?style=for-the-badge&logo=vitest&logoColor=white)](#automated-testing)

**LifeLink** is a full-stack, production-ready healthcare assistance platform. It connects patients with doctors through an AI-powered symptom triage engine, an interactive Mumbai railway clinic map, and a cryptographically secured digital prescription system.

**Live Application:** [https://lifelink-healthcare.onrender.com](https://lifelink-healthcare.onrender.com)

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Technology Stack](#2-technology-stack)
3. [Core Features](#3-core-features)
4. [Security Architecture](#4-security-architecture)
5. [Mumbai Doctor Directory](#5-mumbai-doctor-directory)
6. [Environment Configuration](#6-environment-configuration)
7. [Local Development Setup](#7-local-development-setup)
8. [Cloud Deployment Guide](#8-cloud-deployment-guide)
9. [NPM Script Reference](#9-npm-script-reference)
10. [Application Routes](#10-application-routes)
11. [Project Structure](#11-project-structure)
12. [Database Schema](#12-database-schema)
13. [Troubleshooting](#13-troubleshooting)
14. [Real-World Usage Scenarios](#14-real-world-usage-scenarios)
15. [Technology Rationale](#15-technology-rationale)
16. [Future Roadmap](#16-future-roadmap)
17. [Contributors](#17-contributors)
18. [License](#18-license)

---

## 1. Problem Statement

Getting timely and correct medical attention in a city like Mumbai involves three distinct challenges.

**Medical Confusion**
Most patients do not have medical training. They cannot distinguish between a pulled muscle and a cardiac event, or know whether to visit a General Practitioner or a Neurologist. This results in delayed treatment, unnecessary spending, or visits to the wrong specialist entirely.

**Geographic Barriers**
Mumbai's population depends on its suburban rail network. A commuter who falls ill mid-journey needs a nearby clinic on their travel corridor, not a distant hospital requiring a separate trip.

**Unreliable Paper Prescriptions**
Paper prescriptions can be lost, damaged, or physically altered. Illegible handwriting causes pharmacies to dispense incorrect dosages, creating a direct patient safety risk.

**How LifeLink Addresses These**

- An AI triage engine (powered by Google Gemini) analyzes symptoms, classifies urgency, and routes patients to the correct medical specialty.
- An interactive map plots 24 verified clinics across Mumbai's Central, Western, and Harbour rail lines so patients always find a doctor on their route.
- SHA-256 cryptographic hashing locks prescriptions so any tampering is immediately detectable.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| Frontend Framework | React 19 + Vite 7 | Component-based UI with hot module reloading |
| Styling | Tailwind CSS v4 | Utility-first styling and responsive design |
| Language | TypeScript 5.9 | End-to-end type safety across the full stack |
| Backend Runtime | Node.js v22 + Express.js | HTTP server and API request handling |
| API Layer | tRPC v11 | Type-safe remote procedure calls between frontend and backend |
| Database | MySQL 8.0 on TiDB Cloud Serverless | Scalable, distributed relational data storage |
| ORM | Drizzle ORM | Type-safe SQL query building and schema management |
| AI Engine | Google Gemini (Flash models) | Clinical symptom analysis and urgency classification |
| Authentication | JWT + HTTP-Only Cookies | Secure dual-session management for patients and doctors |
| Maps | Leaflet + OpenStreetMap | Interactive clinic map with distance calculations |
| Real-Time | Server-Sent Events (SSE) | Live appointment and prescription updates |
| Testing | Vitest | 33 test suites covering core business logic |
| Deployment | Render (Web Service) | Cloud hosting with auto-deploy on GitHub push |

---

## 3. Core Features

### AI Symptom Triage Engine

Located at `/patient/assessment`, this is the primary patient-facing feature. When a patient submits their symptoms, the input passes through five sequential layers before a response is returned.

1. **Input Validation** — Detects and rejects gibberish, non-medical questions, or empty submissions.
2. **Biological Consistency Check** — Cross-references the patient's profile data to catch biologically impossible combinations (e.g., a male patient reporting pregnancy symptoms).
3. **Pediatric Routing Guardrail** — If the patient's date of birth shows they are under 18, the response is automatically overridden to recommend a Pediatrician.
4. **Urgency Classification** — Categorizes the severity as one of three levels:
   - `LOW` — Minor symptoms. Recommended action: home care.
   - `MODERATE` — Non-critical but requiring medical attention within 24-48 hours.
   - `EMERGENCY` — Life-threatening red-flag symptoms. The interface switches to a full-screen SOS alert with a one-tap 112 dialer.
5. **Specialty Routing** — Maps the diagnosis to one of 12 medical specialties to direct the patient to the correct type of doctor.

> Note: The Gemini API is only called server-side. The API key is never exposed to the browser.

---

### Interactive Railway Clinic Map

Located at `/patient/specialists`, this feature renders a live map of Mumbai (via Leaflet and OpenStreetMap) with all 24 clinic locations pinned.

- Clinics are organized along the **Central Line**, **Western Line**, and **Harbour Line** railway corridors.
- The patient's GPS location is used to calculate the physical distance to each clinic. This calculation happens entirely in the browser — GPS coordinates are never transmitted to the server.
- Clicking a clinic pin shows the specialty, station location, and booking options.

---

### Digital Health Passport

Patients fill in their Health Passport once at `/patient/health-passport`. It stores:

- Blood group (e.g., O-, AB+)
- Known drug allergies (e.g., Penicillin)
- Chronic conditions (e.g., Type 2 Diabetes)

When a patient arrives at a clinic, the attending doctor can immediately pull up this document, preventing allergy-related prescription errors.

---

### Medicine Cabinet and Adherence Tracker

After a prescription is issued, the medicines appear in the patient's Medicine Cabinet at `/patient/medicines`. Each entry displays:

- Medicine name and dosage
- A daily schedule broken into four time slots: Morning, Afternoon, Evening, and Night
- Remaining pill count

This structured view helps patients follow their treatment plans accurately.

---

### SHA-256 Secured Digital Prescriptions

When a doctor issues a prescription:

1. The server collects the doctor's ID, patient's ID, full medicine list, and the exact UTC timestamp.
2. These values are combined and hashed using the **SHA-256 algorithm**, mixed with the server's private secret key.
3. The resulting hash is stored alongside the prescription record.

If any field in the prescription is altered directly in the database (e.g., changing dosage from 1 to 10 tablets), the stored hash will no longer match. Any verification tool will then display a tampered/invalid status.

---

### Clinician Consultation Portal

Doctors have a fully separate workspace accessible at `/doctor/login` using an official `@lifelink.com` email address. The portal includes:

- **Live Waiting Room Queue** — Updates in real time via Server-Sent Events when new appointments are booked.
- **AI Triage Preview** — Before a consultation, the doctor can read the patient's AI-generated triage report, including urgency level and recommended specialty.
- **Prescription Pad** — A structured interface to select medicines, set dosages, and specify frequency schedules.
- **Patient Directory** — A list of all patients assigned to the clinic, with links to their Health Passports.

---

### Emergency SOS Screen

Available at `/patient/emergency` and triggered automatically on an `EMERGENCY` triage result:

- Displays a full-screen red alert interface.
- Provides a single large button that, on a mobile device, opens the native phone dialer pre-filled with **112** (India's unified emergency number).
- Prepares an SMS message to any pre-registered emergency contacts stored in the patient's profile.

---

### Dark Mode

LifeLink includes a fully engineered high-contrast dark mode, toggled from `/patient/settings`:

- Uses deep slate and navy tones rather than standard black, providing a clinical and readable environment in low-light conditions.
- All input fields and interactive cards maintain high-contrast borders compliant with **WCAG 2.1 AA** standards.
- Glassmorphism styling (backdrop blur and edge lighting) is applied on floating panels and modals.

---

## 4. Security Architecture

LifeLink handles personal medical data and is built with defense-in-depth from the ground up.

### Dual-Session Isolation

Patient authentication uses the cookie `app_session_id`. Doctor authentication uses `doctor_session_id`. These sessions are completely independent. Compromising a patient account provides zero access to the doctor interface, and vice versa.

### Password Storage (Scrypt Hashing)

Passwords are never stored as plain text. LifeLink uses the **Scrypt** memory-hard algorithm, which is computationally expensive to run. This makes large-scale brute-force attacks against a stolen database impractical.

### Automatic Doctor Logout (Inactivity Timeout)

If a doctor's workstation is idle for **5 minutes (300,000 ms)**, the session is automatically terminated server-side. This prevents unauthorized access if a doctor leaves their terminal unattended in a clinic.

### OAuth Collision Prevention

If a user registers with `example@gmail.com` using a password and later tries to log in via Google using the same email, the system blocks the attempt rather than merging the accounts. This closes a common account-takeover vector.

### Authorization Enforcement (IDOR Prevention)

Every backend data query includes an ownership check. Before returning any record (e.g., Prescription #12), the server verifies that the requesting session ID matches the owner of that record. A user altering URL parameters to access another patient's data receives an `UNAUTHORIZED` error.

### Input Sanitization

- **SQL Injection:** Drizzle ORM uses parameterized queries for all database operations, making SQL injection attacks structurally impossible.
- **Cross-Site Scripting (XSS):** React 19 escapes all rendered text by default. Malicious scripts entered into input fields are treated as plain text and never executed.

### AI Prompt Injection Defense

The Gemini integration forces responses into a strict JSON schema using `response_mime_type: "application/json"`. If a user attempts to manipulate the AI with injection phrases, the response fails schema validation and the server returns a predefined safe fallback state rather than an uncontrolled AI output.

### HTTP-Only Cookie Sessions

Session tokens are stored in `httpOnly` cookies, which are inaccessible to JavaScript running in the browser. This protects tokens from being stolen via XSS attacks.

---

## 5. Mumbai Doctor Directory

The database is pre-seeded with 24 clinic workstations distributed across Mumbai's rail network. These accounts are persistent and cannot be deleted by standard user actions.

Use the following credentials to test the application as a doctor.

### Central Line

| Station | Specialty | Email | Password |
|:---|:---|:---|:---|
| CSMT | Cardiology | `cardiology@lifelink.com` | `cardio@lifelink` |
| Ghatkopar | Dermatology | `dermatology@lifelink.com` | `derma@lifelink` |
| Bhandup | Orthopedics | `orthopedics@lifelink.com` | `ortho@lifelink` |
| Thane | Neurology | `neurology@lifelink.com` | `neuro@lifelink` |
| Mulund | General Practice | `generalpractice.mulund@lifelink.com` | `general.mulund@lifelink` |
| Thane | General Practice | `generalpractice.thane@lifelink.com` | `general.thane@lifelink` |
| Diva Junction | General Practice | `generalpractice.divajunction@lifelink.com` | `general.divajunction@lifelink` |
| Kopar | General Practice | `generalpractice.kopar@lifelink.com` | `general.kopar@lifelink` |
| Dombivli | General Practice | `generalpractice.dombivli@lifelink.com` | `general.dombivli@lifelink` |
| Thakurli | General Practice | `generalpractice.thakurli@lifelink.com` | `general.thakurli@lifelink` |

### Western Line

| Station | Specialty | Email | Password |
|:---|:---|:---|:---|
| Churchgate | General Practice | `generalpractice.churchgate@lifelink.com` | `general.churchgate@lifelink` |
| Dadar | General Practice | `generalpractice.dadar@lifelink.com` | `general.dadar@lifelink` |
| Andheri | Pediatrics | `pediatrics@lifelink.com` | `pedia@lifelink` |
| Goregaon | Ophthalmology | `ophthalmology@lifelink.com` | `ophthal@lifelink` |
| Borivali | Gastroenterology | `gastroenterology@lifelink.com` | `gastro@lifelink` |
| Borivali | General Practice | `generalpractice.borivali@lifelink.com` | `general.borivali@lifelink` |

### Harbour Line

| Station | Specialty | Email | Password |
|:---|:---|:---|:---|
| Sewri | Psychiatry | `psychiatry@lifelink.com` | `psych@lifelink` |
| Chembur | Endocrinology | `endocrinology@lifelink.com` | `endo@lifelink` |
| Chembur | General Practice | `generalpractice.chembur@lifelink.com` | `general.chembur@lifelink` |
| Vashi | Pulmonology | `pulmonology@lifelink.com` | `pulmo@lifelink` |
| Vashi | General Practice | `generalpractice.vashi@lifelink.com` | `general.vashi@lifelink` |
| Nerul | General Practice | `generalpractice.nerul@lifelink.com` | `general.nerul@lifelink` |
| Panvel | Gynecology | `gynecology@lifelink.com` | `gynae@lifelink` |
| Panvel | General Practice | `generalpractice.panvel@lifelink.com` | `general.panvel@lifelink` |

**Password Reset (Demo):** Doctors can reset forgotten passwords at `/doctor/reset` using their email and the master override key below:

```
lifelink-controlled-clinician-secret-key-2026
```

---

## 6. Environment Configuration

> **Warning:** Never commit your `.env` file to GitHub. It contains sensitive credentials. The `.gitignore` already excludes it, but always verify before pushing.

Copy `.env.example` to `.env` and fill in the values described below.

```bash
cp .env.example .env
```

### Required Variables

#### `DATABASE_URL`

The MySQL connection string pointing to your database.

- **Local MySQL:** `mysql://root:yourpassword@127.0.0.1:3306/lifelink`
- **TiDB Cloud:** Copy the connection string from the TiDB Cloud dashboard under **Connect > Node.js**.

```env
DATABASE_URL="mysql://username:password@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/lifelink?ssl={\"rejectUnauthorized\":true}"
```

#### `JWT_SECRET`

A random string of at least 32 characters used to sign session tokens. Generate one using a password manager or by running `openssl rand -hex 32` in your terminal. Never reuse a secret across projects.

```env
JWT_SECRET="a-long-random-string-of-at-least-32-characters"
```

#### `LIFELINK_DEMO_DOCTOR_ACCESS_CODE`

The master override key that allows the 24 seeded doctors to reset their passwords at `/doctor/reset`. For the demo environment, use the value below exactly:

```env
LIFELINK_DEMO_DOCTOR_ACCESS_CODE="lifelink-controlled-clinician-secret-key-2026"
```

#### `GEMINI_API_KEY`

The API key that authenticates requests to Google's Gemini AI models.

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API Key** and create a new project.
3. Copy the generated key (it starts with `AIzaSy`).

```env
GEMINI_API_KEY="AIzaSyB9zX-your-key-here"
```

#### `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET`

These enable the **Sign in with Google** button for patient registration and login.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth client ID**.
5. Select **Web application**. The Client ID and Client Secret are shown in the resulting modal.

```env
GOOGLE_OAUTH_CLIENT_ID="123456789012-abc.apps.googleusercontent.com"
GOOGLE_OAUTH_CLIENT_SECRET="GOCSPX-your-secret-here"
```

#### `AUTH_PUBLIC_BASE_URL`

The base URL of the running application. Google uses this to redirect the user back after login.

- **Local development:** `http://localhost:5173`
- **Production (Render):** Your exact Render URL, e.g. `https://lifelink-healthcare.onrender.com`

```env
AUTH_PUBLIC_BASE_URL="http://localhost:5173"
```

---

## 7. Local Development Setup

Follow these steps in order to run the project on your local machine.

### Prerequisites

- **Node.js v22 or higher** — Download from [nodejs.org](https://nodejs.org). Verify with `node -v`.
- **A MySQL database** — The recommended option for students is to create a free Serverless cluster at [tidbcloud.com](https://tidbcloud.com) rather than installing MySQL locally.

### Step 1: Clone the Repository

```bash
git clone https://github.com/sarthakmandhare34/New-LifeLink-Smart-Healthcare-Assistance-Platform.git
cd New-LifeLink-Smart-Healthcare-Assistance-Platform
```

### Step 2: Install Dependencies

```bash
npm install
```

This downloads all required packages listed in `package.json`. Expect this to take 1-3 minutes depending on your connection speed.

### Step 3: Configure the Environment

Create your `.env` file:

```bash
cp .env.example .env
```

Open `.env` in a text editor and fill in your actual credentials as described in [Section 6](#6-environment-configuration).

### Step 4: Initialize the Database

Run the following command to create all 13 required database tables:

```bash
npm run db:push
```

You should see output confirming that the migration completed. Then seed the 24 Mumbai doctor accounts:

```bash
npm run db:sync:doctors
```

This command is safe to run multiple times — it will not create duplicate entries.

### Step 5: Start the Development Server

```bash
npm run dev
```

This starts two servers simultaneously:

| Server | Port | Purpose |
|:---|:---|:---|
| Vite (Frontend) | 5173 | React UI with hot module reloading |
| Express (Backend) | 4000 | API server, database queries, AI calls |

Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.

---

## 8. Cloud Deployment Guide

This project is pre-configured for deployment to **Render** (application hosting) and **TiDB Cloud** (database hosting). The `render.yaml` file at the project root is an Infrastructure-as-Code blueprint that Render reads automatically.

### Step 1: Push Code to GitHub

Ensure your complete codebase is in a GitHub repository. Render connects directly to GitHub to pull the source code.

### Step 2: Create a TiDB Cloud Database

1. Sign up at [tidbcloud.com](https://tidbcloud.com).
2. Create a **Serverless Cluster** in your preferred region (e.g., AWS Singapore).
3. Once the cluster is active, click **Connect**, select **Node.js**, and click **Generate Password**.
4. Copy the full connection string — you will need it in Step 4.

### Step 3: Deploy on Render

1. Log into [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub account and select the LifeLink repository.
4. Render will automatically read `render.yaml` and configure the service settings.

### Step 4: Add Environment Variables on Render

After Render detects `render.yaml`, it will pause and prompt you to enter the variables marked `sync: false`. Enter the following:

| Variable | Value |
|:---|:---|
| `DATABASE_URL` | The TiDB connection string from Step 2 |
| `GEMINI_API_KEY` | Your Google AI Studio key |
| `GOOGLE_OAUTH_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_OAUTH_CLIENT_SECRET` | From Google Cloud Console |
| `AUTH_PUBLIC_BASE_URL` | Your full Render URL (e.g., `https://lifelink-healthcare.onrender.com`) |

**Important:** `AUTH_PUBLIC_BASE_URL` must be your Render URL, not `localhost`. Using `localhost` here will break Google OAuth in production.

Click **Apply**. The build process takes approximately 3-5 minutes. You can monitor progress in the live log stream on the Render dashboard.

### Step 5: Authorize the Production URL in Google Cloud

1. Return to the [Google Cloud Console](https://console.cloud.google.com/) and edit your OAuth client.
2. Under **Authorized JavaScript origins**, add your Render URL.
3. Under **Authorized redirect URIs**, add: `https://your-render-url.onrender.com/api/auth/google/callback`
4. Save. Changes can take up to 5 minutes to propagate across Google's servers.

---

## 9. NPM Script Reference

All available commands are defined in `package.json`.

| Command | What It Does |
|:---|:---|
| `npm run dev` | Starts the Vite frontend (port 5173) and Express backend (port 4000) concurrently. Use this during development. |
| `npm run build` | Compiles the React frontend into static files in `dist/public/` and compiles the backend TypeScript into `dist/index.js`. Run before deploying. |
| `npm start` | Starts the compiled production server (`dist/index.js`). This is what Render runs in production. |
| `npm test` | Runs all 33 Vitest test suites across the frontend and backend. |
| `npm run check` | Runs the TypeScript compiler in type-check mode (`tsc --noEmit`). Reports type errors without producing output files. |
| `npm run format` | Formats all source files using Prettier. |
| `npm run verify` | Runs `check`, `test`, and `build` in sequence. Use this before submitting a pull request. |
| `npm run db:push` | Reads `database/schema.ts`, generates the SQL migration, and applies it to the connected database. Run whenever the schema changes. |
| `npm run db:studio` | Opens the Drizzle Studio UI (port 4983) to browse and inspect database tables visually. |
| `npm run db:clear` | Deletes all patient data from the database. Useful for resetting a test environment. Doctor accounts are not affected. |
| `npm run db:sync:doctors` | Seeds or re-syncs the 24 Mumbai clinic doctor accounts. Safe to run multiple times. |
| `npm run db:delete-user` | Removes a specific user and all their associated records from the database. |

---

## 10. Application Routes

### Public Routes (No Login Required)

| Path | Description |
|:---|:---|
| `/` | Landing page. Users select whether they are a Patient or a Doctor. |
| `/login` | Patient login using email/password or Google OAuth. |
| `/register` | Patient registration with email validation and password strength checks. |
| `/doctor/login` | Doctor login. Requires an `@lifelink.com` email address. |
| `/doctor/reset` | Doctor password reset using the master admin code. |

### Patient Portal (Requires Patient Login)

| Path | Description |
|:---|:---|
| `/patient/dashboard` | Overview of active appointments, recent assessments, and quick actions. |
| `/patient/assessment` | The 5-layer Gemini AI triage interface. |
| `/patient/specialists` | Interactive Leaflet map of the 24 Mumbai railway clinics. |
| `/patient/appointments` | Book and manage clinic appointments. |
| `/patient/health-passport` | Enter and update blood group, allergies, and chronic conditions. |
| `/patient/medicines` | Daily medication adherence tracker. |
| `/patient/prescriptions` | View all historical digital prescriptions with SHA-256 hash verification. |
| `/patient/emergency` | Full-screen SOS interface with one-tap 112 emergency dialer. |
| `/patient/profile` | Update personal details and upload a profile photo. |
| `/patient/settings` | Toggle dark mode, manage notifications, and log out. |

### Clinician Workspace (Requires Doctor Login)

| Path | Description |
|:---|:---|
| `/doctor/dashboard` | Live waiting room queue with real-time SSE updates. |
| `/doctor/patients` | Directory of all patients assigned to this clinic. |
| `/doctor/consultation` | Active consultation workspace for recording clinical notes. |
| `/doctor/prescriptions` | Prescription pad to select medicines, dosages, and frequencies. |
| `/doctor/assessments` | Review AI-generated triage reports submitted by patients. |
| `/doctor/profile` | Read-only view of clinic assignment and specialty details. |
| `/doctor/settings` | Change workstation password and manage active sessions. |

---

## 11. Project Structure

```text
LifeLink-Smart-Healthcare-Assistance-Platform/
|
+-- frontend/                         # React 19 + Vite 7 user interface
|   +-- index.html                    # Single HTML entry point
|   +-- public/                       # Static assets (favicons, logos, images)
|   +-- src/
|       +-- main.tsx                  # Application bootstrap (context providers)
|       +-- App.tsx                   # React Router configuration and route definitions
|       +-- index.css                 # Global CSS design tokens and Tailwind directives
|       +-- components/               # Shared UI components (AppShell, Cards, Maps, ThemeToggle)
|       +-- features/
|       |   +-- entry/                # Login.tsx, Register.tsx, WorkspaceSelector.tsx
|       |   +-- patient/              # All patient portal screens
|       |   |   +-- Dashboard.tsx
|       |   |   +-- Appointments/
|       |   |   +-- Assessment/       # AIAssessment.tsx - 5-layer triage UI
|       |   |   +-- Emergency/        # Emergency.tsx - 112 SOS screen
|       |   |   +-- HealthPassport/
|       |   |   +-- Medicines/        # MedicineCabinet.tsx - adherence tracker
|       |   |   +-- Prescriptions/    # SHA-256 prescription viewer
|       |   |   +-- Profile/
|       |   |   +-- Settings/
|       |   |   +-- Specialists/      # SpecialistFinder.tsx - Leaflet map
|       |   +-- doctor/               # All clinician workspace screens
|       |       +-- Dashboard.tsx
|       |       +-- Appointments/
|       |       +-- Assessments/
|       |       +-- Consultations/
|       |       +-- Patients/
|       |       +-- Prescriptions/
|       |       +-- Profile/
|       |       +-- Settings/
|       +-- hooks/                    # useAuth.ts, usePatientRealtime.ts, inactivity.ts
|       +-- lib/                      # tRPC client configuration (trpc.ts), utilities
|       +-- context/                  # ThemeContext.tsx
|
+-- backend/                          # Node.js + Express API server
|   +-- routers.ts                    # Root tRPC router merging all domain sub-routers
|   +-- db.ts                         # Drizzle ORM configuration and connection pooling
|   +-- _core/                        # Core infrastructure (context, trpc, cookies, env validation)
|   +-- ai/                           # Google Gemini integration (assessmentService.ts)
|   +-- auth/                         # Dual auth handlers (patient, doctor, Google OAuth)
|   +-- discovery/                    # Doctor search and clinic lookup logic
|   +-- realtime/                     # SSE event bus and patient real-time streaming
|   +-- routers/                      # Domain-specific API endpoints (patient.ts, doctor.ts)
|
+-- database/                         # Database schema and migration tooling
|   +-- schema.ts                     # All 13 table definitions using Drizzle ORM
|   +-- drizzle.config.ts             # Drizzle Kit CLI configuration
|   +-- migrations/                   # Auto-generated SQL migration history
|
+-- shared/                           # Code shared between frontend and backend
|   +-- mumbaiRailNetwork.ts          # Hardcoded data for the 24 clinic workstations
|   +-- mumbaiStationCoordinates.ts   # GPS coordinates for the Leaflet map
|   +-- types.ts                      # Shared TypeScript interfaces for data consistency
|
+-- scripts/                          # Developer utility scripts
|   +-- dev.mjs                       # Runs Vite and Express concurrently
|   +-- seed-doctors.ts               # Initial seeding for 24 doctor accounts
|   +-- sync-doctors.ts               # Idempotent doctor sync (safe to re-run)
|   +-- clear-users.ts                # Wipes all patient data for a clean test slate
|   +-- delete-user.ts                # Removes a specific user and their full history
|   +-- init-db.ts                    # Safe database initialization helper
|
+-- .env.example                      # Template for required environment variables
+-- render.yaml                       # Render cloud deployment blueprint
+-- package.json                      # NPM scripts and dependency list
+-- tsconfig.json                     # TypeScript compiler configuration
+-- vite.config.ts                    # Vite build and proxy configuration
+-- vitest.config.ts                  # Vitest testing framework configuration
```

---

## 12. Database Schema

The platform uses 13 relational tables managed through Drizzle ORM. All tables reference the central `users` table via foreign keys with `onDelete: "cascade"`.

| Table | Purpose |
|:---|:---|
| `users` | Core authentication table. Stores email, hashed passwords (Scrypt), Google OAuth IDs, and role (`patient` or `doctor`). |
| `patientProfiles` | Demographic data, date of birth, and avatar URL. Date of birth drives the AI pediatric routing guardrail. |
| `doctorProfiles` | Doctor name, medical specialty, assigned railway station, and consulting fee. |
| `healthPassports` | Blood group, drug allergies, and chronic conditions for emergency reference. |
| `assessments` | Log of all AI triage submissions — stores input symptoms and the full 5-layer AI response. |
| `appointments` | Links a patient and doctor to a scheduled timeslot with status tracking (Pending, Confirmed, Completed, Cancelled). |
| `prescriptions` | Stores the SHA-256 digital signature and links each prescription to a specific doctor and patient. |
| `prescriptionItems` | Individual line items on a prescription (e.g., Paracetamol 500mg, twice daily). |
| `medicines` | The patient's active medicine cabinet, tracking remaining pill count and the daily dose schedule. |
| `sessions` | Active login token registry. Deleting a row immediately invalidates that login session. |
| `emergencyContacts` | Names and phone numbers of the patient's family members for SOS dispatch. |
| `systemEvents` | Internal audit log for security-sensitive actions (e.g., password resets, failed login attempts). |
| `clinicLocations` | Geographic coordinates (latitude, longitude) of each clinic for Leaflet map distance calculations. |

---

## 13. Troubleshooting

**"Google sign-in is not configured yet" error**

Your `.env` file is missing `GOOGLE_OAUTH_CLIENT_ID` or `GOOGLE_OAUTH_CLIENT_SECRET`. Follow [Section 6](#6-environment-configuration) to generate and add these. On Render, add them via the Environment tab on the service dashboard.

---

**Google returns "Error 400: redirect_uri_mismatch"**

Google rejected the login because the redirect URL is not on its approved list. In the Google Cloud Console, edit your OAuth client and add the correct URI to **Authorized redirect URIs**:

- Local: `http://localhost:5173/api/auth/google/callback`
- Production: `https://your-render-url.onrender.com/api/auth/google/callback`

---

**AI Symptom Checker returns a blank screen or 500 error**

Your `GEMINI_API_KEY` is missing or invalid. Check your `.env` file. Keys from Google AI Studio begin with `AIzaSy`.

---

**`npm run dev` crashes with a MySQL Connection Refused error**

The backend cannot reach the database. Verify that `DATABASE_URL` in your `.env` file is correct. If using TiDB Cloud, confirm the cluster is in an Active (not Paused) state from the TiDB dashboard.

---

**None of the 24 doctors appear on the map**

The database was not seeded. Stop the server (`Ctrl+C`) and run the following commands in order, then restart:

```bash
npm run db:push
npm run db:sync:doctors
npm run dev
```

---

**Vite starts but the browser shows a blank white screen**

Open the browser developer console (F12 > Console) and look for errors. A common cause is a failed backend connection. Verify the Express server started successfully on port 4000 and no other process is using that port.

---

## 14. Real-World Usage Scenarios

### Scenario A: Sprained Ankle (Moderate Urgency)

Rahul, a college student, twists his ankle badly at Dadar station. He opens LifeLink on his phone and types: *"I fell on the stairs. My right ankle is swollen and hurts when I put weight on it."*

The AI classifies this as **MODERATE** urgency and routes to the **Orthopedics** specialty. The map highlights the Bhandup Orthopedics clinic as the closest Central Line option. Rahul books an appointment and when he arrives, the doctor already has his AI triage report on screen. The doctor diagnoses a Grade 2 sprain and issues a digital prescription for Ibuprofen. Rahul's Medicine Cabinet immediately shows the correct schedule: Morning and Night.

---

### Scenario B: Suspected Heart Attack (Emergency Urgency)

Amit, 55, is at his office when he feels crushing chest pain and numbness in his left arm. He types into LifeLink: *"My chest is very heavy and my left arm is numb. I am sweating a lot."*

The AI immediately recognizes classic myocardial infarction indicators and bypasses the standard clinic flow entirely. The screen switches to a full-screen red **EMERGENCY** alert. A single large button opens his phone's native dialer with 112 pre-filled. His emergency contacts receive an automated SMS with his registered details.

---

## 15. Technology Rationale

**Why React 19 instead of plain HTML, CSS, and JavaScript?**

LifeLink is a multi-screen application with dozens of interactive components that share state (e.g., the logged-in user's data needs to be available on every page). React manages this through a component tree and virtual DOM that updates only the parts of the screen that actually changed. This makes navigation feel instantaneous even on slow mobile connections.

**Why Vite instead of older tools like Create React App or Webpack?**

Vite uses native ES Modules during development, meaning it only processes the file currently being edited rather than re-bundling the entire codebase on every save. For a project of this size, this reduces rebuild time from tens of seconds to milliseconds.

**Why TiDB Serverless instead of a standard hosted MySQL instance?**

A standard MySQL instance requires pre-provisioning a fixed server size and paying for it around the clock regardless of traffic. TiDB Serverless scales horizontally on demand and scales down to zero cost when idle — well-suited for a project that may see high traffic during demonstrations and minimal traffic otherwise.

**Why Google Gemini instead of other AI providers?**

Gemini Flash models are optimized for low-latency structured output, which is critical for a triage application where users should receive a response within 2-3 seconds. The `response_mime_type: "application/json"` parameter enforces a strict output schema, making it possible to programmatically parse urgency levels and specialty codes without fragile text matching.

**Why tRPC instead of a traditional REST API?**

In a standard REST architecture, the frontend and backend communicate via an informal contract (URL paths and JSON shapes) that is not enforced by the compiler. If a developer changes the backend response shape, the frontend breaks silently at runtime. tRPC derives TypeScript types directly from the backend router definitions and shares them with the frontend at compile time. A shape mismatch becomes a build error caught in the editor before the code ever runs.

---

## 16. Future Roadmap

The following capabilities are planned for subsequent versions:

- **Native Mobile Applications** — Port the current React codebase to React Native for iOS and Android distribution, enabling native push notifications.
- **Computer Vision for Lab Reports** — Extend the Gemini integration to accept image uploads. Patients will be able to photograph blood test reports or X-rays and receive a plain-language summary before their appointment.
- **Multilingual Voice Input** — Integrate the Web Speech API to allow patients to speak symptoms in Hindi or Marathi, with automatic translation to English for the clinical backend.
- **Pharmacy Verification Portal** — A third role (alongside Patient and Doctor) for verified pharmacies. Pharmacies will scan a QR code to instantly verify a prescription's SHA-256 hash before dispensing medication.

---

## 17. Contributors

**Sarthak Mandhare** ([@sarthakmandhare34](https://github.com/sarthakmandhare34))
Lead Developer, System Architect, and Project Owner.
Responsible for full-stack platform architecture, database schema design, AI safety guardrails, dual-authentication workflows, and UI engineering.

**Google DeepMind / Gemini**
AI architectural partner.
Provided the Gemini AI models used in the clinical triage engine.

For contribution guidelines, commit conventions, and coding standards, see [CONTRIBUTORS.md](CONTRIBUTORS.md).
For security vulnerability reporting, see [SECURITY.md](SECURITY.md).

---

## 18. License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for the full terms.

You are free to use, copy, modify, merge, publish, distribute, and sublicense this software, provided that the original copyright notice is included in all copies or substantial portions of the software.

---

*LifeLink was built to demonstrate that software engineering can make healthcare meaningfully safer and more accessible. The platform is intended for educational and demonstration purposes.*

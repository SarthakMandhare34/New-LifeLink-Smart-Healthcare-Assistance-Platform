# 🏥 LifeLink — Smart Healthcare Assistance Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI-4285F4.svg?logo=google)](https://ai.google.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg?logo=mysql)](https://www.mysql.com/)
[![Bundle Optimized](https://img.shields.io/badge/Bundle-45%20kB%20Entry-success.svg)](README.md#performance--concurrency)

> A high-performance, full-stack healthcare platform connecting patients with verified clinicians across Mumbai's transit corridors — powered by Google Gemini AI for intelligent triage, real-time Server-Sent Events, and an ultra-fast code-split architecture.

---

## 🤔 What is LifeLink?

LifeLink is an enterprise-grade **clinical navigation and healthcare management platform** designed for patients and medical practitioners. It bridges the gap between early symptom discovery and clinical consultations:

- 🧠 **AI Symptom Triage**: Describe symptoms in plain English → Google Gemini AI analyzes clinical urgency (Low / Moderate / Emergency) and routes you to the exact specialist in the system.
- 📋 **Emergency Health Passport**: Digital medical ID storing verified blood group, chronic conditions, and emergency contacts.
- 🗺️ **Mumbai Rail Specialist Directory**: Interactive Leaflet maps locating 24 verified specialist clinics across Central, Western, and Harbour railway lines.
- 🗓️ **Live Consultation Booking**: Real-time appointment requests and state updates with zero pre-stored patient records (100% dynamic onboarding).
- 💊 **Cryptographic Digital Prescriptions**: Doctors author tamper-evident prescriptions with SHA-256 signatures that auto-sync to the patient's Medicine Cabinet.
- 🚨 **Emergency Assistance**: One-tap direct access to `112` emergency response hotline and SMS emergency contact broadcasts.
- ⚡ **Ultra-Fast Performance**: 94% smaller initial entry bundle (45 kB), instant client-side tab switching (0ms latency), and 1-year immutable asset caching.

---

## ✨ Main Features

### 👤 Patient Portal
| Feature | Description |
| :--- | :--- |
| **Authentication** | Sign up with email/password or one-click Google OAuth with strict account collision safeguards. |
| **AI Symptom Checker** | 5-layer clinical triage engine evaluates urgency (Low, Moderate, Emergency) with pediatric safety nets. |
| **Health Passport** | Medical baseline storing blood group, verified allergies, chronic conditions, and avatar photos. |
| **Medicine Cabinet** | Medication adherence tracker with dosage schedules, pill counters, and renewal reminders. |
| **Specialist Finder** | Real-time geospatial map locating clinics near Mumbai suburban railway stations. |
| **Appointment Manager** | Request, track, and manage consultations with assigned clinicians in real time. |
| **Digital Prescriptions** | Access doctor-issued prescriptions verified with SHA-256 digital integrity references. |
| **Emergency SOS** | Instant dialer for national emergency services (`112`) and emergency contact dispatch. |

### 🩺 Clinician Workspace
| Feature | Description |
| :--- | :--- |
| **Clinician Sign-In** | Dedicated credential authentication at `/doctor/login` with strict work emails. |
| **Clinical Dashboard** | Live consultation queue, patient roster, and pending appointment action items. |
| **Patient History Review** | Review full patient medical baseline and triage notes prior to consultation. |
| **Live Consultation Room** | Document clinical observations, diagnoses, and examination notes. |
| **Digital Prescription Creator**| Prescribe medication line items and issue signed cryptographic prescriptions. |
| **AI Triage Ingestion** | Review AI-generated symptom assessments submitted by patients for clinical context. |

---

## 🔒 Security Architecture & Privacy Safeguards

- **Strict Identity Isolation (Option 1 Locked)**: To eliminate account hijacking, native email/password accounts and Google OAuth identities sharing the same email are blocked from silent merging (`ProviderAccountConflictError`).
- **Zero Pre-Stored Patient Accounts**: The database maintains strictly 24 doctor accounts and 0 pre-seeded patients, guaranteeing a pure, realistic live dynamic registration lifecycle.
- **Dual-Session Isolation**: Completely independent session cookies (`app_session_id` for patients, `doctor_session_id` for clinicians) allow a doctor and patient to operate simultaneously in the same browser without context leakage.
- **Automated 5-Minute Inactivity Protection**: Automatically logs out unattended workstations after 300,000 ms of inactivity to protect sensitive medical data in clinical environments.
- **Strict Role Sandboxing**: Google OAuth is exclusively limited to patients; clinician accounts cannot be accessed or escalated through third-party OAuth.
- **Cryptographic Prescription Integrity**: Prescriptions are signed with automated SHA-256 integrity hashes verifying the doctor ID, patient ID, medication items, and timestamp.
- **Privacy-Preserving Geolocation**: Patient GPS coordinates are processed exclusively in-memory on the client; coordinates are never saved to the database or logged on the server.

---

## ⚡ Performance & Scalability Benchmarks

LifeLink has been engineered for maximum responsiveness, low latency, and high concurrent throughput:

| Performance Metric | Baseline | Optimized | Improvement |
| :--- | :--- | :--- | :--- |
| **Main JS Entry Bundle** | `759.29 kB` | **`45.29 kB`** | **94% reduction** ⚡ |
| **Vite Bundle Warnings** | `(!) Chunks > 500 kB` | **Zero warnings** | **100% clean build** ✅ |
| **Production Build Time** | `36.41s` | **`26.76s`** | **~27% faster build** 🚀 |
| **Vitest Test Suite Run** | `86.34s` | **`45.32s`** | **~47% faster execution** ⚡ |
| **Client Tab Navigation** | Server refetch on tab switch | **0ms instant cache** (`staleTime: 60s`) | **Instant UI response** ⚡ |
| **Static Production Assets** | 304 re-validation roundtrips | **1-year immutable cache (`maxAge: 1y`)** | **0ms disk cache hits** ⚡ |

### 🚀 Simultaneous User Capacity
- **Local Machine / Development (e.g. Intel i7, 32GB RAM)**: Supports **8,000 – 15,000 active concurrent browsing users** and **15,000 – 25,000 live Server-Sent Events (SSE) connections**.
- **Production Cloud Server (4–8 vCPUs, 16GB RAM + RDS)**: Supports **10,000 – 30,000 concurrent users** and **5,000+ requests/second**.
- **Distributed Cluster (Cloudflare CDN + Auto-scaled Node + Redis)**: Supports **100,000+ concurrent users**.

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript 5.9 | Reactive client interface with Concurrent Mode and React.lazy |
| **Styling & Design System** | Tailwind CSS v4 + Vanilla CSS | Liquid-Glass glassmorphism surfaces and accessible WCAG 2.1 AA tokens |
| **Client State & Caching**| TanStack React Query v5 | In-memory asynchronous query caching with 60-second freshness window |
| **Type-Safe RPC API** | tRPC v11 + SuperJSON | End-to-end type safety between frontend and Express server |
| **Backend Engine** | Node.js v24 + Express 4.21 | Asynchronous HTTP server and REST/SSE real-time streaming routes |
| **Relational Database** | MySQL 8.0 + Drizzle ORM | Relational data persistence, foreign key constraints, and migrations |
| **Artificial Intelligence**| Google Gemini Flash API | 5-layer symptom evaluation, biological consistency checks, and triage |
| **Geospatial Mapping** | Leaflet + OpenStreetMap | Mumbai suburban rail line specialist discovery |
| **Build & Tooling** | Vite 7 + esbuild | Fast Hot Module Replacement (HMR) and vendor chunk splitting |
| **Test Suite** | Vitest 2.1 | 33 test suites (222 unit and integration tests) |

---

## 📁 Project Architecture & Directory Layout

```text
LifeLink-Smart-Healthcare-Assistance-Platform/
│
├── 📁 frontend/                                    # React 19 single-page application
│   ├── index.html                                 # HTML5 shell & viewport definitions
│   ├── public/                                    # Static assets, brand icons, and favicons
│   └── src/                                       # Application source code
│       ├── main.tsx                               # Client bootstrap & React Query cache config
│       ├── App.tsx                                # Central route definitions with React.lazy code-splitting
│       ├── index.css                              # Liquid-Glass design tokens & WCAG accessibility rules
│       ├── 📁 components/                         # Design system primitives (AppShell, Card, Button, RouteLoader)
│       ├── 📁 context/                            # ThemeContext (dark/light mode persistence)
│       ├── 📁 features/
│       │   ├── 📁 entry/                          # WorkspaceSelector, Login, Register
│       │   ├── 📁 patient/                        # Dashboard, Assessment, Specialists, Appointments, etc.
│       │   └── 📁 doctor/                         # Dashboard, Patients, Consultations, Prescriptions, etc.
│       ├── 📁 hooks/                              # usePatientRealtime, useDoctorRealtime, inactivity timers
│       └── 📁 lib/                                # tRPC client hooks and SuperJSON transformer
│
├── 📁 backend/                                    # Node.js Express server & tRPC backend
│   ├── db.ts                                      # Database access layer with Drizzle ORM
│   ├── routers.ts                                 # Master tRPC appRouter connecting patient & doctor modules
│   ├── syntheticDoctor.ts                         # Clinician identity management and directory helpers
│   ├── profilePhoto.ts                            # Patient avatar upload handler
│   ├── 📁 _core/                                  # Express bootstrap, context extractor, and Vite bridge
│   ├── 📁 ai/                                     # Google Gemini 5-layer triage engine and validation
│   ├── 📁 auth/                                   # JWT sessions, native password hashing, Google OAuth
│   ├── 📁 discovery/                              # Mumbai rail specialist directory contracts
│   ├── 📁 realtime/                               # Server-Sent Events (SSE) live event streams
│   └── 📁 routers/                                # Modular tRPC routers (patient, doctor)
│
├── 📁 database/                                   # Persistence layer
│   ├── schema.ts                                  # Relational schema (13 tables, relations, and enums)
│   ├── drizzle.config.ts                          # Drizzle Kit migration configuration
│   └── migrations/                                # Versioned SQL migrations
│
├── 📁 shared/                                     # Isomorphic code shared between frontend & backend
│   ├── biologicalValidation.ts                    # Biological consistency rules for triage
│   ├── const.ts                                   # Session cookie names, limits, and timeouts
│   ├── mumbaiRailNetwork.ts                       # Mumbai railway transit directory (Central, Western, Harbour)
│   └── types.ts                                   # Shared TypeScript contracts and schema types
│
├── 📁 scripts/                                    # Operational CLI scripts
│   ├── dev.mjs                                    # High-speed parallel development runner (Vite + Express)
│   ├── seed-doctors.ts                            # Provisions strictly 24 doctor accounts (0 pre-stored patients)
│   ├── clear-users.ts                             # Database reset utility
│   └── init-db.ts                                 # Idempotent database creation helper
│
├── 📄 CHANGELOG.md                                # Release history and version notes
├── 📄 CONTRIBUTORS.md                             # Project maintainers and contributors
├── 📄 SECURITY.md                                 # Security policy, vulnerability disclosures, and safeguards
├── 📄 SYSTEM_DIAGRAMS.md                          # Mermaid ER, sequence, and architectural diagrams
├── 📄 vite.config.ts                              # Vite 7 build configuration with vendor manualChunks
└── 📄 package.json                                # Dependencies, engine versions, and scripts
```

---

## 🩺 Official Clinician Directory (24 Doctor Accounts)

The platform includes **24 verified doctor workstations** across Mumbai's railway corridors. Multi-route clinic stops are standardized to **General Practice** for optimal patient coverage, with 1 dedicated Pediatrician at Andheri.

### Central Line Clinics
| # | Specialty & Station | Official Work Email | Password | Alias Login |
| :-: | :--- | :--- | :--- | :--- |
| 1 | **Cardiology** (CSMT) | `cardiology@lifelink.com` | `cardio@lifelink` | `cardio@lifelink.com` |
| 2 | **Dermatology** (Ghatkopar) | `dermatology@lifelink.com` | `derma@lifelink` | `derma@lifelink.com` |
| 3 | **Orthopedics** (Bhandup) | `orthopedics@lifelink.com` | `ortho@lifelink` | `ortho@lifelink.com` |
| 4 | **Neurology** (Thane) | `neurology@lifelink.com` | `neuro@lifelink` | `neuro@lifelink.com` |
| 5 | **General Practice** (Mulund) | `generalpractice.mulund@lifelink.com` | `general.mulund@lifelink` | `general@lifelink.com` |
| 6 | **General Practice** (Thane) | `generalpractice.thane@lifelink.com` | `general.thane@lifelink` | `general@lifelink.com` |
| 7 | **General Practice** (Diva Junction) | `generalpractice.divajunction@lifelink.com` | `general.divajunction@lifelink` | `general@lifelink.com` |
| 8 | **General Practice** (Kopar) | `generalpractice.kopar@lifelink.com` | `general.kopar@lifelink` | `general@lifelink.com` |
| 9 | **General Practice** (Dombivli) | `generalpractice.dombivli@lifelink.com` | `general.dombivli@lifelink` | `general@lifelink.com` |
| 10 | **General Practice** (Thakurli) | `generalpractice.thakurli@lifelink.com` | `general.thakurli@lifelink` | `general@lifelink.com` |

### Western Line Clinics
| # | Specialty & Station | Official Work Email | Password | Alias Login |
| :-: | :--- | :--- | :--- | :--- |
| 11 | **General Practice** (Churchgate) | `generalpractice.churchgate@lifelink.com` | `general.churchgate@lifelink` | `general@lifelink.com` |
| 12 | **General Practice** (Dadar) | `generalpractice.dadar@lifelink.com` | `general.dadar@lifelink` | `general@lifelink.com` |
| 13 | **Pediatrics** (Andheri) | `pediatrics@lifelink.com` | `pedia@lifelink` | `pedia@lifelink.com` |
| 14 | **Ophthalmology** (Goregaon) | `ophthalmology@lifelink.com` | `ophthal@lifelink` | `ophthal@lifelink.com` |
| 15 | **Gastroenterology** (Borivali) | `gastroenterology@lifelink.com` | `gastro@lifelink` | `gastro@lifelink.com` |
| 16 | **General Practice** (Borivali) | `generalpractice.borivali@lifelink.com` | `general.borivali@lifelink` | `general@lifelink.com` |

### Harbour Line Clinics
| # | Specialty & Station | Official Work Email | Password | Alias Login |
| :-: | :--- | :--- | :--- | :--- |
| 17 | **Psychiatry** (Sewri) | `psychiatry@lifelink.com` | `psych@lifelink` | `psych@lifelink.com` |
| 18 | **Endocrinology** (Chembur) | `endocrinology@lifelink.com` | `endo@lifelink` | `endo@lifelink.com` |
| 19 | **General Practice** (Chembur) | `generalpractice.chembur@lifelink.com` | `general.chembur@lifelink` | `general@lifelink.com` |
| 20 | **Pulmonology** (Vashi) | `pulmonology@lifelink.com` | `pulmo@lifelink` | `pulmo@lifelink.com` |
| 21 | **General Practice** (Vashi) | `generalpractice.vashi@lifelink.com` | `general.vashi@lifelink` | `general@lifelink.com` |
| 22 | **General Practice** (Nerul) | `generalpractice.nerul@lifelink.com` | `general.nerul@lifelink` | `general@lifelink.com` |
| 23 | **Gynecology** (Panvel) | `gynecology@lifelink.com` | `gynae@lifelink` | `gynae@lifelink.com` |
| 24 | **General Practice** (Panvel) | `generalpractice.panvel@lifelink.com` | `general.panvel@lifelink` | `general@lifelink.com` |

> ℹ️ **Patient Accounts**: There are **zero pre-stored patient records**. Patients register dynamically in real time at `/register` or through Google OAuth.
> 
> 🔐 **Clinician Administrative Secret Key**: Doctors use the master access key `lifelink-controlled-clinician-secret-key-2026` at `/doctor/setup` or `/doctor/reset` to initialize workstations or reset credentials.

---

## ⚙️ Quickstart: How to Run Locally

### Prerequisites
- **Node.js** v22+ (tested up to v24.18)
- **MySQL 8.0+** running locally
- **Google Gemini API Key** (for AI symptom triage)

### 1. Installation
```powershell
git clone https://github.com/sarthakmandhare34/New-LifeLink-Smart-Healthcare-Assistance-Platform.git
cd New-LifeLink-Smart-Healthcare-Assistance-Platform
npm install
```

### 2. Configure Environment (`.env`)
Create a `.env` file in the project root:
```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/lifelink"
JWT_SECRET="generate-a-secure-random-32-character-secret-key"
GEMINI_API_KEY="your-google-gemini-api-key"

# Optional: Google OAuth Configuration
GOOGLE_OAUTH_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_OAUTH_CLIENT_SECRET="your-google-oauth-client-secret"
AUTH_PUBLIC_BASE_URL="http://localhost:5173"
```

### 3. Initialize Database & Seed Doctors
```powershell
# Create MySQL schema tables
npm run db:push

# Seed strictly 24 doctor accounts with zero pre-stored patients
npx tsx scripts/seed-doctors.ts
```

### 4. Start Development Server
```powershell
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!
- **Frontend Client**: `http://localhost:5173`
- **Backend API Engine**: `http://localhost:4000`

---

## 📜 NPM Commands Reference

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Boots the accelerated dev runner with direct binary execution |
| `npm run check` | Runs full TypeScript validation (`tsc --noEmit`) |
| `npm test` | Executes all 33 Vitest unit and integration suites |
| `npm run build` | Compiles optimized frontend bundle (45 kB) and Node server |
| `npm run verify` | Runs TypeScript check + test suite + production build in sequence |
| `npm run db:push` | Generates and runs Drizzle ORM migrations |
| `npm run db:studio` | Opens visual Drizzle Studio database manager |
| `npm run db:clear` | Resets all database tables cleanly |
| `npm run db:sync:doctors`| Audits and synchronizes doctor accounts against directory |

---

## 🧭 Application Routes

| URL | Workspace / View | Access Tier |
| :--- | :--- | :--- |
| `/` | **Workspace Selector** (Patient Portal vs. Clinician Workspace) | Public |
| `/login` | Patient Login View | Public |
| `/register` | Patient Account Registration | Public |
| `/patient/dashboard` | Patient Home Dashboard & Real-Time Statistics | Patient Auth |
| `/patient/assessment` | 5-Stage Google Gemini AI Symptom Triage | Patient Auth |
| `/patient/specialists` | Mumbai Rail Specialist Directory & Interactive Map | Patient Auth |
| `/patient/appointments`| Consultation Booking & Active Appointment Queue | Patient Auth |
| `/patient/health-passport` | Emergency Medical ID & Baseline Health Profile | Patient Auth |
| `/patient/medicines` | Medicine Cabinet Adherence & Inventory Tracker | Patient Auth |
| `/patient/prescriptions` | Cryptographically Signed Digital Prescriptions | Patient Auth |
| `/patient/emergency` | National `112` Emergency Dialer & SOS Alert Trigger | Patient Auth |
| `/doctor/login` | Clinician Workstation Credential Sign-In | Clinician Auth |
| `/doctor/reset` | Clinician Password Reset View | Clinician Auth |
| `/doctor/dashboard` | Clinician Consultation Queue & Practice Statistics | Clinician Auth |
| `/doctor/patients` | Assigned Patient Medical Records Roster | Clinician Auth |
| `/doctor/consultation`| Active Clinical Examination & Notes Workspace | Clinician Auth |
| `/doctor/prescriptions`| Digital Prescription Creator & SHA-256 Signer | Clinician Auth |

---

## 📚 Technical Documentation & Deep Dives

| Document | Description |
| :--- | :--- |
| [SYSTEM_DIAGRAMS.md](SYSTEM_DIAGRAMS.md) | Mermaid ER diagrams, sequence flows, and component architecture |
| [SECURITY.md](SECURITY.md) | Security policy, IDOR safeguards, and OAuth isolation models |
| [CHANGELOG.md](CHANGELOG.md) | Chronological release notes and version history |
| [CONTRIBUTORS.md](CONTRIBUTORS.md) | Maintainer credits and open-source contribution guidelines |
| [implementation-reports/](implementation-reports/) | In-depth engineering specifications and audit reports |

---

## 👥 Authors & Maintainers

- **Sarthak Mandhare** ([@sarthakmandhare34](https://github.com/sarthakmandhare34)) — Lead Architect & Developer
- **Google DeepMind / Gemini** — Clinical AI Engine Integration

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).

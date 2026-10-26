# 🏥 LifeLink — Smart Healthcare Assistance Platform

> [!IMPORTANT]
> **PROTOTYPE NOTICE:** LifeLink is an academic engineering **prototype** built for testing and demonstration purposes. It is **not** a real medical provider, commercial clinic, or emergency service. All doctor profiles, clinic listings, and appointment schedules are simulated for demonstration (no real doctors or real patients are involved).

🌍 **Live Prototype Demo:** [https://new-lifelink-smart-healthcare-assistance.onrender.com/](https://new-lifelink-smart-healthcare-assistance.onrender.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v22%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.1-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![MySQL / TiDB](https://img.shields.io/badge/Database-MySQL%20%7C%20TiDB-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Vitest](https://img.shields.io/badge/Vitest-253%20Tests%20Passed-success?style=for-the-badge&logo=vitest&logoColor=white)](TESTING.md)

---

## 📖 Overview

**LifeLink** is a full-stack smart healthcare assistance platform prototype designed to bridge the gap between sudden symptom confusion, transit navigation, and clinical workflows. 

Initial demonstration coverage is centered on the **Mumbai Metropolitan Region (MMR)**, anchoring medical discovery around 19 major suburban railway hubs (Western, Central, and Harbour lines). Commuters and residents can quickly evaluate symptoms through AI-assisted triage, locate verified nearby specialists within walking distance of railway stations, book conflict-free appointments, and manage tamper-evident digital health records.

While currently calibrated for Mumbai transit, LifeLink's modular architecture is designed to easily scale across India to any city, district, or PIN code.

> 📚 *For the complete 33-section unabridged specification, visit the [Complete Setup & Architecture Guide](COMPLETE_SETUP_README.md).*

---

## ✨ Key Features

- **🤖 5-Layer AI Clinical Symptom Triage**: Powered by Google Gemini with deterministic red-flag emergency detection, biological plausibility filtering, and safe medical specialty recommendations.
- **🗺️ Transit-Aware Specialist Discovery**: Interactive Leaflet maps mapping 52 verified doctor profiles across 19 Mumbai railway stations with walking distance calculation.
- **📅 Conflict-Free Appointment Scheduling**: Full 5-stage lifecycle (`Requested` $\rightarrow$ `Pending` $\rightarrow$ `Confirmed` $\rightarrow$ `Completed` / `Cancelled`) with doctor-specific slot constraints to eliminate double bookings.
- **🔏 Tamper-Evident Digital Prescriptions**: Clinician signing flow with cryptographic SHA-256 digital verification seals and security verification badges.
- **🪪 Emergency Health Passport & Medicine Cabinet**: Portable digital health profiles (blood group, allergies, chronic conditions, emergency contact) and daily medication dosage tracking.
- **⚡ Real-Time Push Updates**: Live appointment and prescription alerts streamed directly to browsers via Server-Sent Events (SSE).
- **🛡️ Healthcare Security & Dual Workspaces**: Isolated sessions for Patient (`/patient/*`) and Clinician (`/doctor/*`), Scrypt password hashing with individual 16-byte random salts, dual HTTP-only cookies, and IDOR protection.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|:---|:---|
| **Frontend** | React 19, TypeScript 5.9, Vite 6, Tailwind CSS v4, Framer Motion, Lucide Icons |
| **Backend** | Node.js 22, Express, tRPC v11 (end-to-end type safety), SuperJSON |
| **Database & ORM** | MySQL 8.0 / TiDB Serverless Cloud (Production), Drizzle ORM, Drizzle Kit |
| **Artificial Intelligence** | Google Gemini 2.5 Flash API with multi-tiered rule engine fallback |
| **Maps & Transit** | Leaflet, React-Leaflet, OpenStreetMap tiles, transit corridor station mappings |
| **Testing & Quality** | Vitest (253 automated tests), TypeScript Strict Mode, ESLint, Prettier |
| **Cloud Deployment** | Render.com (Web Service), TiDB Serverless Cloud (High Availability Database) |

---

## ⚡ Quick Start (Local Setup)

### 1. Prerequisites
Ensure you have installed:
- **Node.js** `v22.0.0+`
- **NPM** `v10.0.0+`
- **MySQL Server** `v8.0+` (or access to a cloud MySQL/TiDB database)

### 2. Clone & Install
```bash
git clone https://github.com/SarthakMandhare34/New-LifeLink-Smart-Healthcare-Assistance-Platform.git
cd New-LifeLink-Smart-Healthcare-Assistance-Platform
npm install
```

### 3. Environment Setup
Copy the blueprint file and configure your database and API keys:
```bash
cp .env.example .env
```
Key environment variables to review in `.env`:
- `DATABASE_URL`: Your MySQL connection string (e.g., `mysql://user:password@localhost:3306/lifelink`)
- `GEMINI_API_KEY`: Your Google Gemini API key (optional for offline triage, recommended for live AI)
- `JWT_SECRET`: Random 32+ character string for secure session tokens

### 4. Push Database Schema & Seed Doctors
```bash
# Push database schema migrations
npm run db:push

# Synchronize Mumbai medical directory test doctors
npm run db:sync:doctors
```

### 5. Launch the Application
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. The Express server boots on `http://localhost:4000` with automated proxying.

---

## 🧪 Demo Test Credentials

### Patient Portal (`/login`)
- Create a new account at `/register` or sign in with Google OAuth.

### Clinician Workstations (`/doctor/login`)
All 52 simulated doctor profiles follow a deterministic credential schema:
- **Email Formula**: `<corridor>-<specialty-slug>-<station-slug>@lifelink.com`
- **Password Formula**: `<specialty-slug>.<station-slug>@lifelink`

**Sample Quick-Test Logins:**

| Specialty | Station | Corridor | Email | Password |
|:---|:---|:---:|:---|:---|
| **Cardiology** | CSMT | Central | `central-cardiology-csmt@lifelink.com` | `cardiology.csmt@lifelink` |
| **General Practice** | Dadar | Western | `western-general-practice-dadar@lifelink.com` | `generalpractice.dadar@lifelink` |
| **Pediatrics** | Andheri | Western | `western-pediatrics-andheri@lifelink.com` | `pediatrics.andheri@lifelink` |
| **Orthopedics** | Panvel | Harbour | `harbour-orthopedics-panvel@lifelink.com` | `orthopedics.panvel@lifelink` |
| **Dermatology** | Ghatkopar | Central | `central-dermatology-ghatkopar@lifelink.com` | `dermatology.ghatkopar@lifelink` |

> *Master Clinician Reset Key (via `/doctor/reset`): `lifelink-controlled-clinician-secret-key-2026`*

### System Administrator Portal (`/admin/login`)
- **Username / Email**: `admin@lifelink.com` (or `admin`)
- **Password / Access Key**: Value of `ADMIN_PASSWORD` or `ADMIN_SECRET_KEY` in your `.env` (default: `LifeLink@Admin#2026!`)

---

## 📜 Essential NPM Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Launch unified Vite frontend (`:5173`) and Express backend (`:4000`) |
| `npm run build` | Compile frontend bundle and server binary into `dist/` |
| `npm start` | Run production compiled server |
| `npm test` | Run full Vitest automated test suite (253 tests across 33 suites) |
| `npm run check` | Run TypeScript strict type verification (`tsc --noEmit`) |
| `npm run verify` | Full verification pipeline (`check` $\rightarrow$ `test` $\rightarrow$ `build`) |
| `npm run db:push` | Generate and execute Drizzle ORM database migrations |
| `npm run db:sync:doctors` | Synchronize 52 specialist workstation profiles with database |
| `npm run db:studio` | Launch visual Drizzle Studio database browser |

---

## 📚 Complete Documentation Index

For in-depth guides, diagrams, and technical specifications, explore our modular documentation suite:

| Document | Description |
|:---|:---|
| [**`COMPLETE_SETUP_README.md`**](COMPLETE_SETUP_README.md) | **Master Engineering Reference** — Unabridged 33-section comprehensive setup and architecture guide |
| [**`SETUP.md`**](SETUP.md) | **Setup & Deployment Guide** — Step-by-step local install, environment configs, Render.com & TiDB guides |
| [**`ARCHITECTURE.md`**](ARCHITECTURE.md) | **System Architecture** — Dual-workspace routing, tRPC protocol, Scrypt crypto specs, IDOR prevention |
| [**`DATABASE.md`**](DATABASE.md) | **Database Schema** — 14-table relational architecture, field types, constraints, and relationships |
| [**`SYSTEM_DIAGRAMS.md`**](SYSTEM_DIAGRAMS.md) | **Visual System Diagrams** — Mermaid diagrams for triage flow, auth handshake, appointment lifecycle |
| [**`TESTING.md`**](TESTING.md) | **Testing Framework** — Breakdown of all 253 Vitest test cases, security suites, and mock strategies |
| [**`SECURITY.md`**](SECURITY.md) | **Security Policy** — Vulnerability disclosure, cryptographic hashing specifications, session controls |
| [**`CHANGELOG.md`**](CHANGELOG.md) | **Changelog** — Version history and release notes |
| [**`CONTRIBUTORS.md`**](CONTRIBUTORS.md) | **Contributors Guide** — Development workflow, coding conventions, and attribution |

---

## ⚖️ License & Medical Disclaimer

- **License**: Released under the [MIT License](LICENSE).
- **Disclaimer**: LifeLink is strictly an academic software prototype developed for testing, research, and demonstration purposes. It does not provide medical diagnoses, treatment advice, or emergency dispatch services. In a real emergency, call **112** (India) or your local emergency medical service immediately.

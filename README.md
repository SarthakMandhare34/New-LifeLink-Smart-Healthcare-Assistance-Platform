# 🏥 LifeLink — Smart Healthcare Assistance Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v22%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Tests Passing](https://img.shields.io/badge/Vitest-225%20Tests%20Passed-success?style=for-the-badge&logo=vitest&logoColor=white)](#automated-testing)

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
   - [Executive Summary](#executive-summary)
   - [The Problem LifeLink Solves](#the-problem-lifelink-solves)
   - [Core Architectural Solutions](#core-architectural-solutions)
   - [Design Philosophy: Swiss International Typographic Style](#design-philosophy-swiss-international-typographic-style)
2. [Features](#2-features)
   - [Public Gateway & Workspace Entry](#public-gateway--workspace-entry)
   - [Patient Authentication & Security Subsystem](#patient-authentication--security-subsystem)
   - [AI Clinical Symptom Triage Engine](#ai-clinical-symptom-triage-engine)
   - [Mumbai Transit Corridor Specialist Locator](#mumbai-transit-corridor-specialist-locator)
   - [Consultation Appointment Scheduling](#consultation-appointment-scheduling)
   - [Digital Health Passport & Emergency Medical ID](#digital-health-passport--emergency-medical-id)
   - [Medicine Cabinet & Adherence Tracker](#medicine-cabinet--adherence-tracker)
   - [Cryptographically Verified Digital Prescriptions](#cryptographically-verified-digital-prescriptions)
   - [Emergency SOS Protocol (112 Rapid Dispatch)](#emergency-sos-protocol-112-rapid-dispatch)
   - [Patient Profile & Theme Preferences](#patient-profile--theme-preferences)
   - [Clinician Workstation Subsystem](#clinician-workstation-subsystem)
   - [System Architecture & Security Guardrails](#system-architecture--security-guardrails)
3. [Tech Stack](#3-tech-stack)
   - [Frontend Architecture](#frontend-architecture)
   - [Backend Architecture](#backend-architecture)
   - [Database & Testing Infrastructure](#database--testing-infrastructure)
4. [Setup & Installation](#4-setup--installation)
   - [Prerequisites](#prerequisites)
   - [Step-by-Step Installation Guide](#step-by-step-installation-guide)
   - [Environment Variables Reference (.env)](#environment-variables-reference-env)
   - [Database Migration & Doctor Synchronization](#database-migration--doctor-synchronization)
5. [Usage](#5-usage)
   - [Starting the Development Environment](#starting-the-development-environment)
   - [End-to-End Patient Portal Walkthrough](#end-to-end-patient-portal-walkthrough)
   - [End-to-End Clinician Workstation Walkthrough](#end-to-end-clinician-workstation-walkthrough)
   - [Verified Directory: 52 Mumbai Railway Doctors](#verified-directory-52-mumbai-railway-doctors)
   - [Complete NPM Script Reference](#complete-npm-script-reference)
   - [Automated Testing Framework (225 Tests)](#automated-testing-framework-225-tests)
   - [Relational Database Schema Deep Dive (14 Tables)](#relational-database-schema-deep-dive-14-tables)

---

## 1. Project Overview

### Executive Summary

**LifeLink** is an enterprise-grade, full-stack smart healthcare assistance web application engineered specifically for the **Mumbai Metropolitan Region (MMR)** in Maharashtra, India. 

The application operates as a dual-workspace clinical platform that bridges the communication, discovery, and documentation gap between suburban commuters and accredited medical professionals. LifeLink integrates real-time clinical AI triage decision support, an interactive geographical transit corridor specialist directory pre-populated with **52 verified doctors** across **19 Mumbai suburban railway stations**, tamper-evident digital prescription issuance backed by **SHA-256 cryptographic signatures**, and real-time streaming updates delivered over **Server-Sent Events (SSE)**.

---

### The Problem LifeLink Solves

1. **Transit Corridor Healthcare Fragmentation in Mumbai**:
   Over 7.5 million commuters travel daily across Mumbai's suburban rail corridors (Central Line, Western Line, and Harbour Line). When acute medical symptoms arise during or after daily transit, patients often do not know which clinical specialty they need (e.g. General Practice vs. Cardiology vs. Pulmonology) or where accredited clinics are situated relative to their connecting transit station.

2. **Delayed Emergency Detection & Misdirected Care**:
   Patients experiencing life-threatening medical emergencies (such as myocardial infarctions, pulmonary embolisms, or acute strokes) frequently misjudge symptom severity, booking routine clinic visits instead of contacting emergency medical services immediately.

3. **Vulnerabilities of Physical Paper Prescriptions**:
   Physical paper prescriptions are easily lost, illegible, or damaged. More critically, paper prescriptions lack cryptographic integrity verification, making them vulnerable to prescription fraud or medication dosage errors during dispensing.

4. **Insecure Data Handling & Weak Session Separation**:
   Many healthcare portals mix patient data access with doctor management on unified endpoints, risking Insecure Direct Object References (IDOR) and session crossover attacks.

---

### Core Architectural Solutions

* **5-Layer AI Clinical Symptom Triage**: Powered by Google Gemini AI, the triage engine evaluates patient age, gender, symptom descriptions, duration, and preexisting health conditions against rigorous biological and pediatric guardrails. It calculates a deterministic urgency tier (`LOW`, `MODERATE`, or `EMERGENCY`) and recommends 1 of 12 supported in-system specialties.
* **Geographic Railway Specialist Mapping**: Built on Leaflet and OpenStreetMap, clinic pins are calibrated 400m–900m into authentic medical enclaves surrounding 19 transit stations. Geodesic distance is computed client-side using the Haversine formula—ensuring patient coordinates are never transmitted or stored on the backend.
* **Cryptographically Signed Prescriptions**: Prescriptions are immutably signed using SHA-256 digital signature hashes calculated from a canonical JSON representation of the doctor ID, patient ID, clinical diagnosis, and line items. Any downstream alteration invalidates the integrity hash.
* **Strict Session & IDOR Isolation**: Clinician and patient sessions reside on separate, HTTP-only, SameSite-hardened cookie keys (`app_session_id` and `doctor_session_id`). Backend tRPC procedures enforce database-level ownership checks before exposing any health record or prescription.
* **Reactive Server-Sent Events (SSE)**: Asynchronous notifications push appointment lifecycle updates, prescription sign-offs, and triage results directly to browser clients in real time without client-side polling.

---

### Design Philosophy: Swiss International Typographic Style

The user interface of LifeLink is built strictly upon the **Swiss International Typographic Style (Die Neue Graphik)**, an architectural design system prioritizing clarity, structural discipline, and clinical legibility:

* **Grid & Structure**: 1px structural hairline borders (`border: 1px solid var(--border)`) without heavy drop shadows. Surfaces are flat, crisp, and tactile.
* **Geometric Discipline**: 0px to 4px border radiuses (buttons and cards are strictly 2px; dialogs are 4px).
* **Controlled Color Palette**:
  * **Canvas**: 75–80% clinical white / near-white (`#FFFFFF`, `#F8FAFC`).
  * **Structure**: 10–15% high-contrast charcoal and slate (`#0F172A`, `#1E293B`, `#64748B`).
  * **Swiss Red (`#E30613`)**: Reserved exclusively for clinical emergencies, urgent triage outcomes, and primary patient call-to-actions.
  * **Swiss Blue (`#0057B8`)**: Dedicated to clinician workstation workflows, verified doctor credentials, and system information badges.
* **High-Contrast Dark & Light Modes**: Both themes are tuned to WCAG 2.1 AA/AAA contrast ratios with instant CSS variable toggling and `localStorage` persistence.
* **Mobile-Responsive Matrix**: Explicitly calibrated for viewport breakpoints at 320px (compact mobile), 360px, 390px, 430px (modern smartphones), 480px (foldables), 768px (tablets), 1024px (laptops), and up to 4K monitors. Includes native `viewport-fit=cover` support for mobile notch and home-bar safe-area insets (`env(safe-area-inset-top)`).

---

## 2. Features

Only features that are fully implemented and verified in the codebase are documented below:

```
                               ┌──────────────────────────────────────────────────┐
                               │            Public Gateway (/)                    │
                               │        Dual-Workspace Portal Entry               │
                               └──────────────┬───────────────────┬───────────────┘
                                              │                   │
                     ┌────────────────────────┘                   └────────────────────────┐
                     ▼                                                                     ▼
       ┌───────────────────────────────┐                                     ┌───────────────────────────────┐
       │   Patient Portal (/patient)   │                                     │  Clinician Workstation (/doctor)│
       ├───────────────────────────────┤                                     ├───────────────────────────────┤
       │ • Scrypt Auth & Google OAuth  │                                     │ • Institutional Scrypt Auth   │
       │ • 5-Layer AI Symptom Triage   │                                     │ • Real-Time Waiting Queue     │
       │ • 19-Station Rail Map (52 Drs)│                                     │ • Patient Health Dossier View │
       │ • 30-Min Slot Booking         │                                     │ • Appointment Confirm/Decline │
       │ • Digital Health Passport     │                                     │ • SHA-256 Prescription Pad    │
       │ • Medicine Cabinet & Adherence│                                     │ • Master Secret Password Reset│
       │ • 112 SOS Emergency Dispatch  │                                     │ • Station Affiliation Matrix │
       └───────────────────────────────┘                                     └───────────────────────────────┘
```

---

### Public Gateway & Workspace Entry

* **Workspace Selector (`/`)**:
  * Landing screen that routes users directly to either the **Patient Portal** or the **Clinician Workstation**.
  * Eliminates credential confusion and clearly separates public patient workflows from restricted clinical workstations.

---

### Patient Authentication & Security Subsystem

* **Native Patient Registration & Login (`/login`, `/register`)**:
  * Native email and password authentication.
  * Passwords are encrypted using Node.js native `crypto.scrypt` with a cryptographically strong 16-byte random salt and 64-byte key length (512-bit security). Format: `salt:hash`.
  * Passwords are verified using `crypto.timingSafeEqual` to prevent timing attacks. Plaintext passwords are never logged or stored.
* **Google OAuth 2.0 Single Sign-On**:
  * Integrates Google OAuth 2.0.
  * Verified Google profiles are linked to the internal `users` record via the `patientProviderIdentities` table using the OAuth `subject` identifier.
* **Automated Inactivity Session Lock**:
  * Automatically detects patient inactivity on shared computers or mobile browsers.
  * Locks the interface after 5 minutes of continuous idle time, requiring re-authentication to protect sensitive medical records.

---

### AI Clinical Symptom Triage Engine

Accessed via `/patient/assessment`, LifeLink features a **5-layer safety triage pipeline** connecting to the Google Gemini AI REST API:

```
[ Patient Inputs Symptoms, Age, Gender, Conditions, Duration ]
                            │
                            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Layer 1: Input Validation & Non-Medical Guardrail           │
 │ (Rejects empty strings, recipes, code, jokes, gibberish)   │
 └──────────────────────────┬──────────────────────────────────┘
                            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Layer 2: Deterministic Emergency Pattern Guardrail          │
 │ (Regex check for chest pain, choking, cyanosis, stroke, etc)│ ──► [Instant EMERGENCY Override]
 └──────────────────────────┬──────────────────────────────────┘
                            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Layer 3: Biological Consistency Guardrail                   │
 │ (Rejects impossible conditions, e.g. male pregnancy)        │ ──► [Instant LOW Urgency Override]
 └──────────────────────────┬──────────────────────────────────┘
                            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Layer 4: Google Gemini AI Structured Generation             │
 │ (Strict JSON Schema: urgency, specialty, reason, guidance)  │
 └──────────────────────────┬──────────────────────────────────┘
                            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Layer 5: Post-Processing Normalization Guardrail            │
 │ (Enforces 12 system specialties; age < 18 forced Pediatrics)│
 └──────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
       [ Result Persisted in MySQL & Broadcast via SSE ]
```

1. **Layer 1: Input Sanitization & Non-Medical Guardrail**:
   * Evaluates input strings using pre-compiled regex patterns.
   * Immediately rejects programming questions, cooking recipes, weather queries, financial questions, or gibberish. Returns `urgency: "ERROR"` with friendly user guidance.
2. **Layer 2: Deterministic Emergency Pattern Matching**:
   * Executes deterministic regular expression matching for life-threatening keywords (e.g. crushing chest pain, radiating chest pressure, cyanosis/blue lips, coughing blood, hemiplegia, facial droop, slurred speech, anaphylaxis, suicidal ideation, gunshot/stab wounds).
   * Bypasses AI latency completely, instantly assigning `urgency: "EMERGENCY"`, `specialty: "Emergency Care"`, and instructing the patient to call emergency services immediately.
3. **Layer 3: Biological Consistency Validation**:
   * Cross-references symptoms against biological sex and age via `checkBiologicalImpossibility`.
   * Flags biologically impossible submissions (e.g., biological males reporting pregnancy, uterine cramps, or ovarian conditions).
   * Prevents diagnostic hallucinations, assigning `urgency: "LOW"` and routing to General Practice or Pediatrics with clear biological context.
4. **Layer 4: Google Gemini AI Structured Generation**:
   * For valid medical inputs, sends a structured prompt with system instructions to Google Gemini AI via REST API.
   * Enforces strict JSON Schema generation ensuring that outputs contain exclusively valid `urgency`, `specialty`, `reason`, and `guidance` fields.
5. **Layer 5: Post-Processing Normalization Guardrail**:
   * Intercepts Gemini output to guarantee the returned specialty belongs to LifeLink’s 12 supported in-system doctor specialties.
   * Automatically applies **Pediatric Overrides**: If the patient is under 18 years old, the specialty is automatically assigned to `Pediatrics`.
   * Maps unlisted specialties (e.g., ENT, Nephrology, Oncology) to `General Practice`.

---

### Mumbai Transit Corridor Specialist Locator

Located at `/patient/specialists`, this feature maps accredited clinics along Mumbai's suburban rail corridors:

* **Interactive Leaflet + OpenStreetMap Map**:
  * Bounded geographically to the Mumbai Metropolitan Region (`[18.80, 72.75]` to `[19.35, 73.20]`).
  * Custom pins distinguish General Practice clinics from specialized medical pavilions.
* **19 Rail Stations Across 3 Suburban Lines**:
  * **Central Line (9 Stations)**: CSMT, Ghatkopar, Bhandup, Thane, Mulund, Diva Junction, Kopar, Dombivli, Thakurli.
  * **Western Line (5 Stations)**: Churchgate, Dadar, Andheri, Goregaon, Borivali.
  * **Harbour Line (5 Stations)**: Sewri, Chembur, Vashi, Nerul, Panvel.
* **Authentic Medical Enclaves**:
  * Clinic GPS coordinates are offset 400m–900m away from railway tracks into actual civic healthcare zones (e.g., Fort Medical Enclave, Dadar West Medical Square, Vashi Sector 15 Medical Park).
* **Multi-Facet Directory Filtering**:
  * Filter doctors simultaneously by Railway Line, Medical Specialty, Station, Locality, and Free-Text Search.
* **Privacy-Preserving Geodesic Distance Calculation**:
  * Computes physical distance from the user’s current GPS coordinates using the Haversine formula entirely within the browser.
  * Coordinates are never transmitted to or logged on the backend server.

---

### Consultation Appointment Scheduling

Located at `/patient/appointments`:

* **Time Slot Matrix**:
  * Book 30-minute consultation slots across Morning/Afternoon (10:00 AM – 3:00 PM) and Evening (7:00 PM – 10:00 PM) clinic sessions.
* **Validation & Conflict Prevention**:
  * Strict validation rejects attempts to book appointments in the past or book overlapping slots with the same clinician.
  * Failed attempts and validation rejections are recorded in the `bookingErrors` table for clinical auditing.
* **Lifecycle State Machine**:
  * Tracks appointments across 5 distinct states:
    $$\text{Requested} \longrightarrow \text{Pending} \longrightarrow \text{Confirmed} \longrightarrow \text{Completed} \quad (\text{or } \text{Cancelled})$$
  * Appointment state updates trigger Server-Sent Events (SSE) that refresh both the patient and doctor workstations instantly.

---

### Digital Health Passport & Emergency Medical ID

Located at `/patient/health-passport`:

* **Emergency Medical Identifiers**:
  * Stores ABO/Rh Blood Group (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`) and emergency telephone numbers.
* **Structured Medical Flags**:
  * Manages verified drug allergies (e.g. Penicillin, Sulfa drugs) and chronic conditions (e.g. Hypertension, Asthma, Type 2 Diabetes) stored as structured JSON arrays in `patientProfiles`.
* **Clinician Pre-Consultation Access**:
  * Health Passport data is automatically loaded into the doctor's consultation workspace whenever an appointment is opened, preventing adverse drug-allergy interactions.

---

### Medicine Cabinet & Adherence Tracker

Located at `/patient/medicines`:

* **Medication Inventory & Schedule**:
  * Tracks active medications, brand/generic names, and dosage strengths (e.g., *Metformin 500mg*).
* **Daily Time Schedule**:
  * Configurable daily intake slots: Morning, Afternoon, Evening, and Night.
* **Pill Count & Expiry Monitoring**:
  * Tracks remaining pill counts, regimen start/end dates, and medication expiry dates.

---

### Cryptographically Verified Digital Prescriptions

Located at `/patient/prescriptions` (Patient View) and `/doctor/prescriptions` (Doctor View):

* **Multi-Item Prescription Pad**:
  * Allows doctors to prescribe multiple medications in a single document, specifying drug names, dosage strengths, and precise clinical instructions.
* **SHA-256 Digital Signature Hash**:
  * When a prescription is signed, the server generates a canonical JSON string containing:
    ```json
    {
      "doctorId": "mock-central-cardiology-csmt",
      "patientUserId": 14,
      "clinicalNotes": "Patient presents with mild arrhythmia. Advised rest and monitoring.",
      "items": [
        { "name": "Metoprolol", "dosage": "25mg", "instructions": "Once daily morning" }
      ]
    }
    ```
  * The server computes the SHA-256 hash of this canonical payload and stores it in `patientPrescriptions.integrityReference` with the format `sha256:<64-char-hex-digest>`.
* **Tamper-Evident Verification**:
  * The patient and pharmacy can inspect the integrity reference. If any clinical note, drug name, or dosage is modified in the database, the hash comparison fails.
* **Document Status**:
  * Progresses from `UNSIGNED / CONTROLLED WORKSPACE` to `SIGNED — CONTROLLED STATE`.

---

### Emergency SOS Protocol (112 Rapid Dispatch)

Located at `/patient/emergency`:

* **Unified Emergency Call Dispatch**:
  * One-tap access triggering mobile dialer deep links directly to India's National Emergency Number (**112**) via `tel:112`.
* **Automated Emergency SMS Generator**:
  * Generates pre-formatted emergency SMS text messages addressed to the patient's saved emergency contacts, containing the patient's name, blood group, and emergency alert message.
* **Automatic Emergency Redirect**:
  * Triggered automatically whenever the AI symptom triage engine returns an `EMERGENCY` score.

---

### Patient Profile & Theme Preferences

Located at `/patient/profile` and `/patient/settings`:

* **Personal Profile Management**:
  * Update legal name, phone number, and upload profile avatar photos.
* **Emergency Contacts Directory**:
  * Configure primary emergency contacts (name, relationship, and phone number) persisted in `patientEmergencyContacts`.
* **Swiss Theme Switcher**:
  * Toggle between high-contrast Light Mode and Dark Mode with instant CSS variable updates and `localStorage` state persistence.

---

### Clinician Workstation Subsystem

Located at `/doctor/*`:

* **Hardened Clinician Authentication (`/doctor/login`)**:
  * Restricted login for the 52 verified Mumbai doctors using institutional credentials (`<line>-<specialty>-<station>@lifelink.com`).
  * Verified against individual salted Scrypt password hashes stored in `syntheticDoctorCredentials`.
  * Zero demo bypasses or auto-fill shortcuts in production.
* **Master Authorization Password Reset (`/doctor/reset`)**:
  * Emergency workstation password reset mechanism protected by the server-side master access key `LIFELINK_DEMO_DOCTOR_ACCESS_CODE`.
* **Clinical Operations Dashboard (`/doctor/dashboard`)**:
  * Operational summary cards showing pending consultation requests, upcoming visits, active patient roster, and completed triage reports.
  * Real-time waiting room queue that updates automatically via Server-Sent Events (SSE).
* **Clinical Patient Record Dossier (`/doctor/patients/:patientId`)**:
  * Displays complete patient health history: demographics, Blood Group, verified Drug Allergies, Chronic Conditions, active medications, and previous AI triage reports.
* **Digital Prescription Pad (`/doctor/consultation`, `/doctor/prescriptions/create`)**:
  * Compose differential diagnoses and write multi-drug prescriptions.
  * Digitally signs prescriptions with SHA-256 HMAC integrity hashes.

---

### System Architecture & Security Guardrails

* **Dual-Session Domain Isolation**:
  * Patient (`app_session_id`) and Doctor (`doctor_session_id`) HTTP-only cookies are isolated on separate authentication domains with SameSite protections.
* **IDOR (Insecure Direct Object Reference) Protection**:
  * All tRPC procedures strictly verify resource ownership. Patients can only query their own prescriptions, appointments, and medical records.
* **Real-Time Event Bus (SSE)**:
  * Persistent HTTP Server-Sent Events push notifications for appointment updates, triage completions, and prescription issuances without client polling.
* **Responsive Multi-Device Layout**:
  * Custom breakpoints optimized for standard mobile phones (320px–480px, iPhone SE, iPhone 14, Galaxy S21), foldables, tablets, laptops, and 4K displays.
  * Includes `viewport-fit=cover` support for mobile notch and home bar safe area insets.

---

## 3. Tech Stack

Every technology listed below is actively configured and utilized in the codebase:

### Frontend Architecture

| Technology | Package Version | Architectural Role |
|:---|:---|:---|
| **React** | `^19.2.1` | Core declarative UI component library |
| **Vite** | `^7.1.7` | High-speed frontend build tool and local HMR dev server |
| **TypeScript** | `5.9.3` | Static type safety across all frontend components and hooks |
| **React Router DOM** | `^7.18.2` | Declarative client-side routing, protected route boundaries, and layout shells |
| **Tailwind CSS** | `^4.1.14` | Utility-first CSS framework integrated via `@tailwindcss/vite` |
| **tRPC Client** | `^11.6.0` | End-to-end type-safe API queries and mutations with full IDE autocompletion |
| **TanStack React Query** | `^5.90.2` | Client-side asynchronous server-state caching, invalidation, and data fetching |
| **Leaflet & React-Leaflet** | `^1.9.4` / `^5.0.0` | High-performance interactive map rendering for Mumbai transit clinics |
| **Lucide React** | `^0.453.0` | Consistent, accessible clinical and navigational iconography |
| **Radix UI Primitives** | Various | Headless, accessible UI primitives (Dialog, Dropdown, Tabs, Popover, Tooltip, Select) |
| **React Hook Form & Zod** | `^7.64.0` / `^4.1.12` | Performant form state management with strict schema validation |
| **Sonner** | `^2.0.7` | Toast notification alerts for real-time user feedback |

---

### Backend Architecture

| Technology | Package Version | Architectural Role |
|:---|:---|:---|
| **Node.js** | `>=22.0.0` | High-performance server-side JavaScript runtime |
| **Express** | `^4.21.2` | HTTP web server framework hosting REST endpoints and tRPC middleware |
| **tRPC Server** | `^11.6.0` | Type-safe RPC router defining procedures, input validation, and auth contexts |
| **Drizzle ORM** | `^0.44.5` | Type-safe SQL query builder and schema management library |
| **Drizzle Kit** | `^0.31.4` | Automated database migration generator and Drizzle Studio GUI |
| **MySQL2 Driver** | `^3.15.0` | High-throughput MySQL client with connection pooling and prepared statements |
| **Google Gemini REST API**| Via Axios `^1.13.5` | Google Cloud AI model integration for structured clinical symptom triage |
| **Node.js Native Crypto** | Built-in | Scrypt password hashing, SHA-256 HMAC digital signatures, `timingSafeEqual` |
| **Jose** | `^6.1.0` | Cryptographic JWT signing and decoding for HTTP-only session cookies |
| **Server-Sent Events** | Native HTTP | Persistent server-to-client streaming push events for real-time updates |
| **Esbuild & tsx** | `^0.25.0` / `^4.19.1` | Fast TypeScript execution and backend production bundler |

---

### Database & Testing Infrastructure

| Technology | Package Version | Architectural Role |
|:---|:---|:---|
| **MySQL** | `8.0+` | Primary relational database with ACID transactions and foreign key constraints |
| **Vitest** | `^5.0.1` | Blazing-fast test runner executing 225 unit and integration tests |
| **React Testing Library** | `^16.3.3` | Integration testing for React components in a simulated DOM environment |
| **JSDOM** | `^27.0.0` | Pure JavaScript implementation of W3C DOM and HTML standards for testing |

---

## 4. Setup & Installation

Follow these step-by-step instructions to set up LifeLink on your local development machine.

### Prerequisites

Ensure you have the following installed on your machine:
* **Node.js**: Version `22.0.0` or higher (`node -v` to check)
* **npm**: Version `10.0.0` or higher (bundled with Node.js)
* **MySQL Server**: Version `8.0` or higher running locally (via MySQL Community Server, Workbench, XAMPP, or Docker)
* **Google Gemini API Key**: Free API key obtained from [Google AI Studio](https://aistudio.google.com/)
* **Git**: Installed and configured on your terminal

---

### Step-by-Step Installation Guide

#### 1. Clone the Repository
```bash
git clone https://github.com/SarthakMandhare34/New-LifeLink-Smart-Healthcare-Assistance-Platform.git
cd New-LifeLink-Smart-Healthcare-Assistance-Platform
```

#### 2. Install Project Dependencies
```bash
npm install
```

#### 3. Create and Configure `.env` File
Copy the example environment template to create your `.env` file:

* **Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  ```
* **Windows (Command Prompt):**
  ```cmd
  copy .env.example .env
  ```
* **macOS / Linux:**
  ```bash
  cp .env.example .env
  ```

Open `.env` in your text editor and fill in your database credentials and API keys.

---

### Environment Variables Reference (.env)

All variables correspond strictly to `.env.example`:

| Environment Variable | Required | Description | Example Value |
|:---|:---:|:---|:---|
| `PORT` | Yes | HTTP port on which the Express backend server listens | `4000` |
| `DATABASE_URL` | Yes | Standard MySQL connection string (`mysql://user:pass@host:port/db`) | `mysql://root:password@localhost:3306/lifelink` |
| `JWT_SECRET` | Yes | 32+ character random string for signing JWT session cookies | `lifelink-super-secret-production-key-minimum-32-chars` |
| `GEMINI_API_KEY` | Yes | Google AI Studio API key for clinical symptom triage | `AIzaSyYourGeminiApiKeyHere` |
| `LIFELINK_DEMO_DOCTOR_ACCESS_CODE` | Yes | Master secret key protecting clinician workstation password reset | `lifelink-controlled-clinician-secret-key-2026` |
| `AUTH_PUBLIC_BASE_URL` | Yes | Base URL of the frontend application for redirects | `http://localhost:5173` |
| `GOOGLE_OAUTH_CLIENT_ID` | Optional | Google Cloud OAuth 2.0 Client ID for Google login | `your-client-id.apps.googleusercontent.com` |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Optional | Google Cloud OAuth 2.0 Client Secret | `your-client-secret` |

---

### Database Migration & Doctor Synchronization

#### 1. Create the MySQL Database
Ensure your MySQL server is running, then create the database if it doesn't already exist:
```sql
CREATE DATABASE IF NOT EXISTS lifelink;
```

#### 2. Generate and Apply Schema Tables
Push the Drizzle ORM schema to automatically generate all 14 database tables:
```bash
npm run db:push
```

#### 3. Synchronize the 52 Verified Doctors
Populate the database with all 52 verified Mumbai railway doctors, complete with individual salted Scrypt password hashes:
```bash
npm run db:sync:doctors
```

---

## 5. Usage

### Starting the Development Environment

Launch both the frontend Vite dev server and backend Express server concurrently:
```bash
npm run dev
```

* **Frontend Web Application**: `http://localhost:5173`
* **Backend API Server**: `http://localhost:4000` (requests from `:5173/api/*` and `:5173/trpc/*` are automatically proxied to `:4000` via `scripts/dev.mjs`)

---

### End-to-End Patient Portal Walkthrough

1. **Access the Application**:
   * Open `http://localhost:5173` in your browser.
   * On the landing screen, select **Patient Portal** (or navigate to `/login`).
2. **Account Creation & Login**:
   * Click **Create an account** (`/register`) to register with your email and password, or use Google OAuth single sign-on.
3. **AI Symptom Triage**:
   * From the sidebar, click **AI Assessment** (`/patient/assessment`).
   * Enter your symptoms (e.g. *"severe chest pain radiating to left arm for 1 hour"* or *"persistent dry cough and mild fever for 3 days"*).
   * Enter your age, gender, preexisting health conditions, and symptom duration.
   * Click **Submit Assessment**.
   * An instant triage result appears showing your urgency level (`LOW`, `MODERATE`, or `EMERGENCY`), recommended specialist, clinical reasoning, and self-care guidance.
4. **Locate Nearby Transit Specialists**:
   * Navigate to **Specialist Finder** (`/patient/specialists`).
   * The interactive map displays accredited clinics along Mumbai's rail corridors.
   * Filter by line (e.g., *Central Line*), station (e.g., *Ghatkopar*), or medical specialty (e.g., *Cardiology*).
   * Click any clinic pin to view doctor qualifications, clinic address, and consultation fee.
5. **Book an Appointment**:
   * Click **Book Consultation** on a specialist card.
   * Select a 30-minute timeslot and submit the booking request.
   * Track the appointment status on the **Appointments** page (`/patient/appointments`).
6. **Set Up Your Health Passport**:
   * Open **Health Passport** (`/patient/health-passport`).
   * Select your Blood Group (e.g. `O+`).
   * Add any known drug allergies (e.g. `Penicillin`) and chronic conditions (e.g. `Asthma`).
   * Save your profile. Consulting doctors can now review these safety records prior to prescribing medications.
7. **Manage Your Medicine Cabinet**:
   * Go to **Medicine Cabinet** (`/patient/medicines`).
   * Add active prescriptions, dosage schedules (Morning, Afternoon, Evening, Night), and track remaining pill inventory counts.
8. **Emergency SOS Protocol**:
   * If an emergency occurs, tap the red **Emergency SOS** button in the header or navigate to `/patient/emergency`.
   * Tap the **Call 112** button to immediately dial emergency services, or tap **Notify Emergency Contacts** to send automated SMS alerts.

---

### End-to-End Clinician Workstation Walkthrough

1. **Access the Workstation**:
   * Open `http://localhost:5173` and click **Clinician Workspace** (or navigate directly to `/doctor/login`).
2. **Authenticate with Institutional Credentials**:
   * Select a doctor from the directory below.
   * *Example*: Email: `central-cardiology-csmt@lifelink.com` | Password: `cardiology.csmt@lifelink`.
   * Click **Sign In**.
3. **Review Clinical Dashboard & Queue**:
   * The **Dashboard** (`/doctor/dashboard`) displays pending consultation requests, confirmed appointments, and live waiting room queues that update in real time via Server-Sent Events (SSE).
4. **Manage Appointments**:
   * Navigate to **Appointments** (`/doctor/appointments`).
   * Click on an incoming booking request to review the patient's chief complaint.
   * Click **Confirm Appointment** to confirm the booking.
5. **Conduct Patient Consultation**:
   * Open the **Consultation Workspace** (`/doctor/consultation`) or view a patient dossier (`/doctor/patients/:patientId`).
   * Review the patient's Emergency Health Passport (Blood Group, verified Allergies, Chronic Conditions) and past AI triage reports.
   * Enter your clinical diagnosis and examination notes.
6. **Issue Cryptographically Signed Prescription**:
   * Open the **Prescription Pad** (`/doctor/prescriptions`).
   * Add prescribed medications: drug name, dosage strength, and usage instructions.
   * Click **Sign and Issue Prescription**.
   * The server calculates a SHA-256 digital signature hash, records the prescription as `SIGNED — CONTROLLED STATE`, and delivers it to the patient's portal instantly via SSE.

---

### Verified Directory: 52 Mumbai Railway Doctors

All 52 clinicians are pre-seeded in the database across 19 stations on the Central, Western, and Harbour lines:

* **Email Pattern**: `<line>-<specialty>-<station>@lifelink.com`
* **Password Pattern**: `<specialty>.<station>@lifelink` *(all lowercase, no spaces or special characters in specialty/station)*

#### 1. Central Line Doctors (20 Doctors across 9 Stations)

| # | Station | Line | Specialty | Doctor Name & Qualifications | Institutional Login Email | Workstation Password |
|:---:|:---|:---|:---|:---|:---|:---|
| 1 | **CSMT** | Central | General Practice | Dr. Aarav N. Kulkarni, MBBS | `central-general-practice-csmt@lifelink.com` | `generalpractice.csmt@lifelink` |
| 2 | **CSMT** | Central | Cardiology | Dr. Rajesh V. Varma, MD, DM | `central-cardiology-csmt@lifelink.com` | `cardiology.csmt@lifelink` |
| 3 | **CSMT** | Central | Ophthalmology | Dr. Harish D. Salunkhe, MS | `central-ophthalmology-csmt@lifelink.com` | `ophthalmology.csmt@lifelink` |
| 4 | **Ghatkopar** | Central | General Practice | Dr. Ishaan M. Deshmukh, MBBS | `central-general-practice-ghatkopar@lifelink.com` | `generalpractice.ghatkopar@lifelink` |
| 5 | **Ghatkopar** | Central | Dermatology | Dr. Rahul E. Tambe, MD, DNB | `central-dermatology-ghatkopar@lifelink.com` | `dermatology.ghatkopar@lifelink` |
| 6 | **Ghatkopar** | Central | Psychiatry | Dr. Sanjay D. Varma, MD | `central-psychiatry-ghatkopar@lifelink.com` | `psychiatry.ghatkopar@lifelink` |
| 7 | **Bhandup** | Central | General Practice | Dr. Ananya P. Joshi, MBBS | `central-general-practice-bhandup@lifelink.com` | `generalpractice.bhandup@lifelink` |
| 8 | **Bhandup** | Central | Orthopedics | Dr. Arvind N. Shenoy, MS | `central-orthopedics-bhandup@lifelink.com` | `orthopedics.bhandup@lifelink` |
| 9 | **Bhandup** | Central | Endocrinology | Dr. Neha V. Paranjpe, MD, DM | `central-endocrinology-bhandup@lifelink.com` | `endocrinology.bhandup@lifelink` |
| 10 | **Thane** | Central | General Practice | Dr. Rohan K. Sengupta, MBBS, MD | `central-general-practice-thane@lifelink.com` | `generalpractice.thane@lifelink` |
| 11 | **Thane** | Central | Neurology | Dr. Rameshwar T. Gaikwad, MD, DM | `central-neurology-thane@lifelink.com` | `neurology.thane@lifelink` |
| 12 | **Thane** | Central | Gastroenterology | Dr. Sanjeev B. Kulkarni, MD, DM | `central-gastroenterology-thane@lifelink.com` | `gastroenterology.thane@lifelink` |
| 13 | **Thane** | Central | Pulmonology | Dr. Malini S. Iyer, MD, DM | `central-pulmonology-thane@lifelink.com` | `pulmonology.thane@lifelink` |
| 14 | **Mulund** | Central | General Practice | Dr. Tanvi R. Kirloskar, MBBS | `central-general-practice-mulund@lifelink.com` | `generalpractice.mulund@lifelink` |
| 15 | **Mulund** | Central | Pediatrics | Dr. Farhan K. Mehta, MD | `central-pediatrics-mulund@lifelink.com` | `pediatrics.mulund@lifelink` |
| 16 | **Diva Junction** | Central | General Practice | Dr. Neil P. Somaiya, MBBS | `central-general-practice-diva@lifelink.com` | `generalpractice.divajunction@lifelink` |
| 17 | **Kopar** | Central | General Practice | Dr. Avantika B. Deshmukh, MBBS | `central-general-practice-kopar@lifelink.com` | `generalpractice.kopar@lifelink` |
| 18 | **Dombivli** | Central | General Practice | Dr. Kabir A. Mahajan, MBBS | `central-general-practice-dombivli@lifelink.com` | `generalpractice.dombivli@lifelink` |
| 19 | **Dombivli** | Central | Gynecology | Dr. Priya R. Nadkarni, MD, DGO | `central-gynecology-dombivli@lifelink.com` | `gynecology.dombivli@lifelink` |
| 20 | **Thakurli** | Central | General Practice | Dr. Meera K. Nambiar, MBBS | `central-general-practice-thakurli@lifelink.com` | `generalpractice.thakurli@lifelink` |

---

#### 2. Western Line Doctors (16 Doctors across 5 Stations)

| # | Station | Line | Specialty | Doctor Name & Qualifications | Institutional Login Email | Workstation Password |
|:---:|:---|:---|:---|:---|:---|:---|
| 21 | **Churchgate** | Western | General Practice | Dr. Devendra C. Sawant, MBBS, MD | `western-general-practice-churchgate@lifelink.com` | `generalpractice.churchgate@lifelink` |
| 22 | **Churchgate** | Western | Dermatology | Dr. Veena M. Shinde, MD | `western-dermatology-churchgate@lifelink.com` | `dermatology.churchgate@lifelink` |
| 23 | **Churchgate** | Western | Endocrinology | Dr. Rohan M. Kirloskar, MD, DM | `western-endocrinology-churchgate@lifelink.com` | `endocrinology.churchgate@lifelink` |
| 24 | **Dadar** | Western | General Practice | Dr. Shalini K. Pillai, MBBS | `western-general-practice-dadar@lifelink.com` | `generalpractice.dadar@lifelink` |
| 25 | **Dadar** | Western | Orthopedics | Dr. Sunita K. Jagtap, MS, MCh | `western-orthopedics-dadar@lifelink.com` | `orthopedics.dadar@lifelink` |
| 26 | **Dadar** | Western | Psychiatry | Dr. Mahesh A. Bhide, MD | `western-psychiatry-dadar@lifelink.com` | `psychiatry.dadar@lifelink` |
| 27 | **Andheri** | Western | General Practice | Dr. Prakash J. Menon, MBBS | `western-general-practice-andheri@lifelink.com` | `generalpractice.andheri@lifelink` |
| 28 | **Andheri** | Western | Cardiology | Dr. Jayant V. Bhatt, MD, DM | `western-cardiology-andheri@lifelink.com` | `cardiology.andheri@lifelink` |
| 29 | **Andheri** | Western | Pediatrics | Dr. Deepa V. Nair, MD, DCH | `western-pediatrics-andheri@lifelink.com` | `pediatrics.andheri@lifelink` |
| 30 | **Andheri** | Western | Pulmonology | Dr. Vikramaditya S. Sengupta, MD | `western-pulmonology-andheri@lifelink.com` | `pulmonology.andheri@lifelink` |
| 31 | **Goregaon** | Western | General Practice | Dr. Chetan R. Varma, MBBS | `western-general-practice-goregaon@lifelink.com` | `generalpractice.goregaon@lifelink` |
| 32 | **Goregaon** | Western | Ophthalmology | Dr. Milind S. Chitnis, MS, FICO | `western-ophthalmology-goregaon@lifelink.com` | `ophthalmology.goregaon@lifelink` |
| 33 | **Goregaon** | Western | Gynecology | Dr. Gauri N. Tendulkar, MD, DGO | `western-gynecology-goregaon@lifelink.com` | `gynecology.goregaon@lifelink` |
| 34 | **Borivali** | Western | General Practice | Dr. Sneha R. Kulkarni, MBBS | `western-general-practice-borivali@lifelink.com` | `generalpractice.borivali@lifelink` |
| 35 | **Borivali** | Western | Neurology | Dr. Kavita M. Joshi, MD, DM | `western-neurology-borivali@lifelink.com` | `neurology.borivali@lifelink` |
| 36 | **Borivali** | Western | Gastroenterology | Dr. Anil M. Kumar, MD, DM | `western-gastroenterology-borivali@lifelink.com` | `gastroenterology.borivali@lifelink` |

---

#### 3. Harbour Line Doctors (16 Doctors across 5 Stations)

| # | Station | Line | Specialty | Doctor Name & Qualifications | Institutional Login Email | Workstation Password |
|:---:|:---|:---|:---|:---|:---|:---|
| 37 | **Sewri** | Harbour | General Practice | Dr. Pankaj D. Shah, MBBS | `harbour-general-practice-sewri@lifelink.com` | `generalpractice.sewri@lifelink` |
| 38 | **Sewri** | Harbour | Gastroenterology | Dr. Ritu G. Kapoor, MD, DM | `harbour-gastroenterology-sewri@lifelink.com` | `gastroenterology.sewri@lifelink` |
| 39 | **Sewri** | Harbour | Psychiatry | Dr. Siddharth P. Merchant, MD | `harbour-psychiatry-sewri@lifelink.com` | `psychiatry.sewri@lifelink` |
| 40 | **Chembur** | Harbour | General Practice | Dr. Vivek N. Deshpande, MBBS | `harbour-general-practice-chembur@lifelink.com` | `generalpractice.chembur@lifelink` |
| 41 | **Chembur** | Harbour | Dermatology | Dr. Smita K. Patil, MD | `harbour-dermatology-chembur@lifelink.com` | `dermatology.chembur@lifelink` |
| 42 | **Chembur** | Harbour | Ophthalmology | Dr. Vandana S. Rao, MS | `harbour-ophthalmology-chembur@lifelink.com` | `ophthalmology.chembur@lifelink` |
| 43 | **Chembur** | Harbour | Endocrinology | Dr. Pooja S. Chawla, MD, DM | `harbour-endocrinology-chembur@lifelink.com` | `endocrinology.chembur@lifelink` |
| 44 | **Vashi** | Harbour | General Practice | Dr. Rohan T. Bapat, MBBS | `harbour-general-practice-vashi@lifelink.com` | `generalpractice.vashi@lifelink` |
| 45 | **Vashi** | Harbour | Cardiology | Dr. Reema N. Shetty, MD, DM | `harbour-cardiology-vashi@lifelink.com` | `cardiology.vashi@lifelink` |
| 46 | **Vashi** | Harbour | Pediatrics | Dr. Swati P. Bhosale, MD | `harbour-pediatrics-vashi@lifelink.com` | `pediatrics.vashi@lifelink` |
| 47 | **Vashi** | Harbour | Pulmonology | Dr. Sameer K. Merchant, MD, DM | `harbour-pulmonology-vashi@lifelink.com` | `pulmonology.vashi@lifelink` |
| 48 | **Nerul** | Harbour | General Practice | Dr. Preeti S. Saxena, MBBS | `harbour-general-practice-nerul@lifelink.com` | `generalpractice.nerul@lifelink` |
| 49 | **Nerul** | Harbour | Neurology | Dr. Nitin H. Agrawal, MD, DM | `harbour-neurology-nerul@lifelink.com` | `neurology.nerul@lifelink` |
| 50 | **Panvel** | Harbour | General Practice | Dr. Alok M. Pandey, MBBS | `harbour-general-practice-panvel@lifelink.com` | `generalpractice.panvel@lifelink` |
| 51 | **Panvel** | Harbour | Orthopedics | Dr. Shrikant R. Gokhale, MS | `harbour-orthopedics-panvel@lifelink.com` | `orthopedics.panvel@lifelink` |
| 52 | **Panvel** | Harbour | Gynecology | Dr. Tarun K. Bansal, MD, DGO | `harbour-gynecology-panvel@lifelink.com` | `gynecology.panvel@lifelink` |

---

### Complete NPM Script Reference

All scripts configured in `package.json`:

| Script Name | Exact Command Line | Purpose & Operational Behavior |
|:---|:---|:---|
| `dev` | `node scripts/dev.mjs` | Starts the Express API server (`:4000`) and the Vite dev server (`:5173`) concurrently with automatic reverse proxying |
| `build` | `vite build && esbuild backend/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist` | Compiles the production frontend bundle into `dist/public` and bundles the backend into `dist/index.js` |
| `start` | `NODE_ENV=production node dist/index.js` | Runs the compiled production server serving both API and static frontend assets |
| `check` | `tsc --noEmit` | Runs the TypeScript compiler in type-checking mode without emitting JS files |
| `test` | `vitest run` | Runs all 225 automated unit and integration tests across 33 test suites to completion |
| `format` | `prettier --write .` | Formats all code files according to the project's formatting configuration |
| `verify` | `npm run check && npm test && npm run build` | Sequentially executes full type checking, test suites, and production build verification |
| `db:push` | `drizzle-kit push` | Applies database schema definitions from `database/schema.ts` directly to MySQL |
| `db:studio` | `drizzle-kit studio --port 4983` | Launches the interactive Drizzle Studio database management web interface at `http://localhost:4983` |
| `db:sync:doctors` | `tsx scripts/sync-doctors.ts` | Audits and synchronizes the 52 Mumbai railway doctors and their Scrypt password hashes in MySQL |
| `db:clear` | `tsx scripts/clear-db.ts` | Wipes test patient data while strictly preserving all 52 doctor credentials intact |
| `db:delete-user` | `tsx scripts/delete-user.ts` | Interactive command-line utility to selectively delete a single test user account |

---

### Automated Testing Framework (225 Tests)

LifeLink includes an exhaustive testing suite of **225 tests across 33 test files** running under Vitest:

```bash
npm test
```

#### Test Suite Breakdown:

| Test Suite File | Test Count | What It Validates |
|:---|:---:|:---|
| `backend/ai/assessmentService.test.ts` | **54 tests** | Comprehensive 5-layer triage pipeline: input sanitization, non-medical pattern rejection, biological impossibility guardrails (male pregnancy), pediatric age overrides, and urgency score mapping |
| `backend/realtime/patientRealtime.test.ts` | **32 tests** | Real-time Server-Sent Events (SSE) packet delivery, listener error isolation, event reconnects, and stream cleanup |
| `backend/discovery/mockDoctorDirectory.test.ts` | **15 tests** | Verifies exactly 52 doctors, 1 GP per station guarantee across 19 stations, station GPS coordinates, and railway corridor filters |
| `backend/auth/doctorAuth.test.ts` | **12 tests** | Scrypt password verification, institutional email authentication, timing-safe password resets, and session cookie generation |
| `backend/auth/nativePatientAuth.test.ts` | **10 tests** | Native patient signup, password complexity rules, Scrypt hashing with unique random salts, and `timingSafeEqual` authentication |
| `backend/auth/security.idor.test.ts` | **10 tests** | Insecure Direct Object Reference (IDOR) access boundaries: patients cannot view or modify other patients' prescriptions or records |
| `backend/appointments/appointmentLifecycle.test.ts` | **10 tests** | 5-stage appointment state machine: `Requested` → `Pending` → `Confirmed` → `Completed` / `Cancelled`, slot conflict detection, and past-date rejection |
| `backend/prescriptions/prescriptionLifecycle.test.ts` | **9 tests** | Multi-item prescription authoring, status transitions, and byte-for-byte SHA-256 digital signature hash verification |
| `backend/medicines/medicine.test.ts` | **8 tests** | Medicine cabinet CRUD, adherence tracking, time-of-day intake scheduling, and pill inventory counts |
| `backend/profile/healthPassport.test.ts` | **8 tests** | Emergency Health Passport: blood group validation, JSON-serialized allergy/condition arrays, and profile updates |
| `backend/auth/simultaneousAuth.test.ts` | **7 tests** | Dual-session cookie isolation (`app_session_id` vs `doctor_session_id`) allowing concurrent patient and doctor logins in the same browser |
| `backend/ui/responsiveLayout.test.ts` | **7 tests** | Layout rendering across 320px, 360px, 390px, 430px, 480px, 768px, and 4K displays, with mobile safe-area inset compatibility |
| `backend/auth/patientInactivity.test.ts` | **6 tests** | Inactivity timeout detection and automatic session locking after 5 minutes of idle time |
| `backend/profile/profilePhoto.test.ts` | **6 tests** | Profile avatar photo upload validation, file size constraints, and secure storage |
| `backend/ai/geminiKey.test.ts` | **5 tests** | Google Gemini API key environment configuration and connection validation |
| `backend/ai/assessment.validation.test.ts` | **5 tests** | Zod input schema boundaries for triage requests (symptoms length, age ranges, gender values) |
| *Other Suites (17 files)* | **21 tests** | Route authentication guards, Swiss typography tokens, reduced-motion accessibility, and event bus pub/sub mechanics |
| **Total** | **225 tests** | **100% Passing Test Suite** |

---

### Relational Database Schema Deep Dive (14 Tables)

All tables are defined in [`database/schema.ts`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/database/schema.ts) using Drizzle ORM:

```
                          ┌───────────────────────┐
                          │         users         │
                          │ (id, openId, role...) │
                          └───────────┬───────────┘
                                      │
       ┌──────────────────┬───────────┼───────────┬──────────────────┐
       ▼                  ▼           ▼           ▼                  ▼
┌──────────────┐   ┌─────────────┐ ┌─────┐ ┌─────────────┐   ┌───────────────┐
│patientCreds  │   │syntheticDoc │ │OAuth│ │patientProf  │   │emergencyCont  │
│(userId, hash)│   │(userId, drId│ │Ident│ │(blood, allerg│   │(name, phone)  │
└──────────────┘   └─────────────┘ └─────┘ └─────────────┘   └───────────────┘
       │                  │
       ▼                  ▼
┌──────────────┐   ┌─────────────────────────────────────────────────────────┐
│assessments   │   │                     patientAppointments                 │
│(symptoms, urg│   │          (userId, doctorId, scheduledAt, status)        │
└──────────────┘   └──────────────────────────┬──────────────────────────────┘
                                              │
                                              ▼
                                   ┌─────────────────────┐
                                   │ patientPrescriptions│
                                   │ (SHA-256 integrity) │
                                   └──────────┬──────────┘
                                              │
                                              ▼
                                   ┌─────────────────────┐
                                   │prescriptionItems    │
                                   │ (name, dosage, inst)│
                                   └─────────────────────┘
```

#### Detailed Table Specifications:

1. **`users`**:
   * **Purpose**: Primary identity table representing all system actors (Patients, Doctors, Admins).
   * **Columns**: `id` (INT, PK, Auto-increment), `openId` (VARCHAR(64), Unique, e.g. `native:...`, `synthetic-doctor:...`), `name` (TEXT), `email` (VARCHAR(320)), `loginMethod` (VARCHAR(64)), `role` (ENUM: `'user'`, `'doctor'`, `'admin'`), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP), `lastSignedIn` (TIMESTAMP).

2. **`patientCredentials`**:
   * **Purpose**: Secure credential storage for native patient email and password accounts.
   * **Columns**: `id` (INT, PK), `userId` (INT, FK -> `users.id` ON DELETE CASCADE, Unique), `email` (VARCHAR(320), Unique), `passwordHash` (VARCHAR(512), stores salted Scrypt hash `salt:hash`), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).

3. **`syntheticDoctorCredentials`**:
   * **Purpose**: Institutional credential storage for the 52 verified Mumbai railway doctors.
   * **Columns**: `id` (INT, PK), `userId` (INT, FK -> `users.id` ON DELETE CASCADE, Unique), `doctorId` (VARCHAR(80), Unique, matches mock directory ID), `email` (VARCHAR(320), Unique), `passwordHash` (VARCHAR(512), stores salted Scrypt hash), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).

4. **`patientProviderIdentities`**:
   * **Purpose**: Federated third-party OAuth identity linkages.
   * **Columns**: `id` (INT, PK), `userId` (INT, FK -> `users.id` ON DELETE CASCADE), `provider` (ENUM: `'google'`), `subject` (VARCHAR(255)), `email` (VARCHAR(320)), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).
   * **Constraints**: Unique composite constraint on `(provider, subject)`.

5. **`patientProfiles`**:
   * **Purpose**: Core emergency health data and medical identity records.
   * **Columns**: `id` (INT, PK), `userId` (INT, FK -> `users.id` ON DELETE CASCADE, Unique), `bloodGroup` (VARCHAR(12), e.g. `'O+'`, `'B+'`), `phone` (VARCHAR(32)), `avatarKey` (VARCHAR(512)), `allergiesJson` (TEXT, stores JSON array of drug allergies), `conditionsJson` (TEXT, stores JSON array of chronic illnesses), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).

6. **`patientEmergencyContacts`**:
   * **Purpose**: Emergency contacts reachable during urgent medical distress.
   * **Columns**: `id` (INT, PK), `userId` (INT, FK -> `users.id` ON DELETE CASCADE), `name` (VARCHAR(160)), `relationship` (VARCHAR(80)), `phone` (VARCHAR(32)), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).

7. **`patientAssessments`**:
   * **Purpose**: Audit log of AI symptom triage evaluations performed by Google Gemini.
   * **Columns**: `id` (INT, PK), `userId` (INT, FK -> `users.id` ON DELETE CASCADE), `symptoms` (TEXT), `age` (INT), `gender` (VARCHAR(32)), `conditions` (TEXT), `duration` (VARCHAR(64)), `urgency` (ENUM: `'LOW'`, `'MODERATE'`, `'EMERGENCY'`, `'ERROR'`), `reason` (TEXT), `specialty` (VARCHAR(160)), `guidance` (TEXT), `createdAt` (TIMESTAMP).

8. **`patientAppointments`**:
   * **Purpose**: Scheduled consultation bookings linking patients and specialists.
   * **Columns**: `id` (INT, PK), `userId` (INT, FK -> `users.id` ON DELETE CASCADE), `doctorId` (VARCHAR(80)), `reason` (TEXT), `scheduledAt` (TIMESTAMP), `status` (ENUM: `'Requested'`, `'Pending'`, `'Confirmed'`, `'Completed'`, `'Cancelled'`), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).

9. **`patientPrescriptions`**:
   * **Purpose**: Official medical prescriptions signed and issued by authorized doctors.
   * **Columns**: `id` (INT, PK), `userId` (INT, FK -> `users.id` ON DELETE CASCADE), `doctorId` (VARCHAR(80)), `issuedAt` (TIMESTAMP), `status` (ENUM: `'UNSIGNED / CONTROLLED WORKSPACE'`, `'SIGNED — CONTROLLED STATE'`), `clinicalNotes` (TEXT), `integrityReference` (VARCHAR(255), stores `sha256:...`), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).

10. **`patientPrescriptionItems`**:
    * **Purpose**: Individual medication line items prescribed within an overarching prescription.
    * **Columns**: `id` (INT, PK), `prescriptionId` (INT, FK -> `patientPrescriptions.id` ON DELETE CASCADE), `name` (VARCHAR(200)), `dosage` (VARCHAR(120)), `instructions` (TEXT).

11. **`patientMedicines`**:
    * **Purpose**: Virtual medicine cabinet tracking active regimens and daily adherence.
    * **Columns**: `id` (INT, PK), `userId` (INT, FK -> `users.id` ON DELETE CASCADE), `name` (VARCHAR(200)), `dosage` (VARCHAR(120)), `frequency` (VARCHAR(120)), `schedule` (VARCHAR(120)), `startDate` (VARCHAR(10)), `endDate` (VARCHAR(10)), `quantity` (INT), `expiry` (VARCHAR(10)), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).

12. **`patientEvents`**:
    * **Purpose**: Real-time event log streaming updates to patient browsers via Server-Sent Events (SSE).
    * **Columns**: `id` (INT, PK), `userId` (INT, FK -> `users.id` ON DELETE CASCADE), `type` (ENUM: `'PROFILE_UPDATED'`, `'APPOINTMENT_UPDATED'`, `'PRESCRIPTION_CREATED'`, `'ASSESSMENT_COMPLETED'`, `'MEDICINE_UPDATED'`), `entityId` (VARCHAR(80)), `createdAt` (TIMESTAMP).

13. **`doctorEvents`**:
    * **Purpose**: Real-time event log streaming updates to clinician workstations via SSE.
    * **Columns**: `id` (INT, PK), `doctorId` (VARCHAR(80)), `patientUserId` (INT, FK -> `users.id` ON DELETE CASCADE), `type` (ENUM: `'APPOINTMENT_UPDATED'`, `'ASSESSMENT_COMPLETED'`, `'PATIENT_RELATED_UPDATE'`), `entityId` (VARCHAR(80)), `createdAt` (TIMESTAMP).

14. **`bookingErrors`**:
    * **Purpose**: Audit log recording appointment booking rejections, past-date errors, and schedule conflicts.
    * **Columns**: `id` (INT, PK), `userId` (INT, FK -> `users.id` ON DELETE CASCADE, Nullable), `doctorId` (VARCHAR(80), Nullable), `attemptedAt` (TIMESTAMP, Nullable), `errorMessage` (TEXT), `errorCode` (VARCHAR(64)), `createdAt` (TIMESTAMP).

---

<div align="center">

🏥 **LifeLink — Engineering safer, faster healthcare assistance for Mumbai commuters.**

*Built with ❤️ in Mumbai, India*

</div>

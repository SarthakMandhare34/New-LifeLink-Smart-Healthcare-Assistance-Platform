# 🏥 LifeLink — Smart Healthcare Assistance Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v22%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Tests Passing](https://img.shields.io/badge/Vitest-225%20Tests%20Passed-success?style=for-the-badge&logo=vitest&logoColor=white)](#automated-testing-framework-225-tests)

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
   - [Executive Summary](#executive-summary)
   - [The Problem LifeLink Solves](#the-problem-lifelink-solves)
   - [Core Architectural Solutions](#core-architectural-solutions)
   - [Project Strengths & Limitations (Pros & Cons)](#project-strengths--limitations-pros--cons)
   - [Design Philosophy: Swiss International Style](#design-philosophy-swiss-international-style)
2. [Features & System Architecture](#2-features--system-architecture)
   - [Workspace Routing Architecture](#workspace-routing-architecture)
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
   - [Security Guardrails & Session Isolation](#security-guardrails--session-isolation)
3. [Engineering Concepts Explained](#3-engineering-concepts-explained)
   - [End-to-End Type Safety with tRPC](#end-to-end-type-safety-with-trpc)
   - [Client-Side Geodesic Distance via Haversine Formula](#client-side-geodesic-distance-via-haversine-formula)
   - [Password Security with Scrypt & Timing-Safe Checks](#password-security-with-scrypt--timing-safe-checks)
   - [Prescription Integrity Verification with SHA-256](#prescription-integrity-verification-with-sha-256)
   - [Real-Time Push Updates via Server-Sent Events (SSE)](#real-time-push-updates-via-server-sent-events-sse)
4. [Tech Stack](#4-tech-stack)
   - [Frontend Architecture](#frontend-architecture)
   - [Backend Architecture](#backend-architecture)
   - [Database & Testing Infrastructure](#database--testing-infrastructure)
5. [Setup & Installation](#5-setup--installation)
   - [Prerequisites](#prerequisites)
   - [Step-by-Step Installation Guide](#step-by-step-installation-guide)
   - [Environment Variables Reference (.env)](#environment-variables-reference-env)
   - [Database Migration & Doctor Synchronization](#database-migration--doctor-synchronization)
   - [Troubleshooting Common Setup Issues](#troubleshooting-common-setup-issues)
6. [Usage & How the Project Works (Simple Guide)](#6-usage--how-the-project-works-simple-guide)
   - [Segment 1: Starting the Platform](#segment-1-starting-the-platform)
   - [Segment 2: Patient Registration & Login](#segment-2-patient-registration--login)
   - [Segment 3: Getting AI Medical Advice (Symptom Triage)](#segment-3-getting-ai-medical-advice-symptom-triage)
   - [Segment 4: Finding a Doctor Near Your Train Station](#segment-4-finding-a-doctor-near-your-train-station)
   - [Segment 5: Booking a Doctor's Appointment](#segment-5-booking-a-doctors-appointment)
   - [Segment 6: Setting Up Your Health Passport](#segment-6-setting-up-your-health-passport)
   - [Segment 7: Managing Your Medicines](#segment-7-managing-your-medicines)
   - [Segment 8: In Case of Emergency (SOS)](#segment-8-in-case-of-emergency-sos)
   - [Segment 9: Doctor's Workstation (For Clinicians Only)](#segment-9-doctors-workstation-for-clinicians-only)
   - [Verified Directory: 52 Mumbai Railway Doctors](#verified-directory-52-mumbai-railway-doctors)
   - [Complete NPM Script Reference](#complete-npm-script-reference)
   - [Automated Testing Framework (225 Tests)](#automated-testing-framework-225-tests)
   - [Relational Database Schema Deep Dive (14 Tables)](#relational-database-schema-deep-dive-14-tables)

---

## 1. Project Overview

### Executive Summary

**LifeLink** is a comprehensive, full-stack smart healthcare assistance web application developed as a college engineering project for the **Mumbai Metropolitan Region (MMR)** in Maharashtra, India. Although built in an academic setting, the platform adheres to industry-standard software engineering practices, robust clinical data safety rules, and strict security controls.

The application functions as a dual-workspace healthcare system. It bridges the communication and discovery gap between daily suburban rail commuters and medical professionals by providing:
* An **AI-powered clinical triage engine** for rapid preliminary symptom assessment.
* An **interactive railway transit directory** featuring **52 verified demo doctors** across **19 suburban stations**.
* **Tamper-evident digital prescriptions** protected with **SHA-256 cryptographic hashes**.
* **Real-time live updates** using **Server-Sent Events (SSE)**.

---

### The Problem LifeLink Solves

1. **Healthcare Confusion for Daily Commuters**:
   More than 7.5 million passengers travel daily across Mumbai's suburban rail network (Central, Western, and Harbour lines). When commuters feel sick during or after travel, they often do not know which medical specialty they need (such as General Practice, Cardiology, or Pulmonology) or which clinics are located close to their connecting transit station.

2. **Delayed Emergency Detection**:
   Patients experiencing severe, life-threatening symptoms (such as heart attacks, acute breathing difficulty, or strokes) often underestimate their condition and attempt to schedule regular clinic visits instead of calling emergency medical services immediately.

3. **Vulnerabilities of Paper Prescriptions**:
   Traditional handwritten paper prescriptions can easily be lost, damaged, or misread. In addition, physical prescriptions lack built-in security features to verify authenticity, making them susceptible to alteration or dosage errors.

4. **Insecure Session Handling in Basic Portals**:
   Many simple healthcare applications combine patient data access and doctor administrative tools into single shared session domains, creating vulnerabilities such as Insecure Direct Object References (IDOR) and accidental privilege crossover.

---

### Core Architectural Solutions

* **5-Layer AI Clinical Symptom Triage**: Uses Google Gemini AI with medical and pediatric safety guardrails. It validates input text, checks for emergency keywords, enforces biological consistency, calculates an urgency level (`LOW`, `MODERATE`, or `EMERGENCY`), and recommends one of 12 supported medical specialties.
* **Transit Station Specialist Map**: Powered by Leaflet and OpenStreetMap, clinic pins are calibrated 400m to 900m around 19 key railway stations. Geodesic distance is calculated directly inside the user's browser using the Haversine formula, ensuring user GPS coordinates are never sent to or stored on the backend server.
* **Cryptographically Signed Prescriptions**: Each issued prescription is immutably signed using a SHA-256 digital hash computed from a standardized JSON object of doctor ID, patient ID, clinical diagnosis, and medication line items. Any alteration made directly in the database invalidates this signature.
* **Isolated Session Architecture**: Patient and doctor authentication sessions are kept strictly separated using different HTTP-only cookie keys (`app_session_id` and `doctor_session_id`). Backend tRPC procedures verify data ownership before returning any medical records.
* **Real-Time Event Streaming (SSE)**: The backend uses Server-Sent Events to push appointment status changes, prescription notifications, and triage results directly to the browser in real time without client-side polling.

---

### Project Strengths & Limitations (Pros & Cons)

To provide an honest and balanced assessment suitable for a college-level project evaluation, here is a summary of LifeLink's strengths and its real-world limitations:

#### Project Strengths (Pros)
* **High Security Standards**: Implements Scrypt password hashing with individual 16-byte random salts, timing-safe equality checks, SHA-256 digital signatures, and isolated HTTP-only session cookies.
* **Multi-Layered AI Safety Guardrails**: Includes non-medical query rejection, immediate emergency keyword overrides, biological contradiction checks (such as male pregnancy claims), and automatic pediatric age routing.
* **Practical Commuter-Centric Design**: Solves a genuine civic problem by mapping clinic locations around Mumbai's busiest transit corridors.
* **Comprehensive Test Coverage**: Tested with 225 automated unit and integration tests across 33 test files with a 100% pass rate.

#### Project Limitations (Cons)
* **Synthetic Medical Directory**: The 52 doctors and clinics are realistic mock profiles for demonstration. A production rollout would require official medical council verification and clinical onboarding.
* **AI Diagnostic Boundaries**: AI symptom triage is designed strictly for preliminary guidance and cannot replace laboratory investigations, diagnostic imaging, or in-person physician evaluations.
* **Basic Consultation Scheduling**: The booking system uses fixed 30-minute time slots and does not yet support third-party calendar sync, video telemedicine streams, or payment gateway processing.
* **Geographic Scope Limited to Mumbai**: The railway stations, lines, and clinic coordinates are tailored specifically to the Mumbai Metropolitan Region and would require database updates to support other cities.

---

### Design Philosophy: Swiss International Style

The user interface of LifeLink is built on the principles of the **Swiss International Typographic Style (Die Neue Graphik)**, emphasizing clarity, structural hierarchy, and clinical readability:

* **Grid and Structure**: Clean 1px structural borders (`border: 1px solid var(--border)`) without heavy drop shadows. Surfaces are flat, structured, and legible.
* **Geometric Discipline**: Strict corner radiuses (2px for buttons, input fields, and cards; 4px for dialogs and modals).
* **Controlled Color Palette**:
  * **Background Canvas**: 75–80% clean white / off-white (`#FFFFFF`, `#F8FAFC`).
  * **Structural Charcoal**: 10–15% high-contrast slate and charcoal (`#0F172A`, `#1E293B`, `#64748B`).
  * **Swiss Red (`#E30613`)**: Dedicated exclusively to medical emergencies, urgent triage outcomes, and primary patient action buttons.
  * **Swiss Blue (`#0057B8`)**: Dedicated to clinician workflows, verified credentials, and system information tags.
* **High-Contrast Dark and Light Modes**: Both themes meet WCAG 2.1 AA/AAA contrast ratios and toggle smoothly with `localStorage` state persistence.
* **Responsive Multi-Device Layout**: Optimized for mobile screens (320px to 480px, iPhone SE, iPhone 14, Galaxy S21), tablets (768px), laptops (1024px), and desktop monitors up to 4K. Includes safe-area inset support for mobile notches and home navigation bars (`viewport-fit=cover`).

---

## 2. Features & System Architecture

### Workspace Routing Architecture

The platform cleanly separates public patient features from clinician management tools:

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
  * The landing page provides direct access to either the **Patient Portal** or the **Clinician Workstation**.
  * Eliminates credential confusion and keeps patient interactions separate from clinical workstations.

---

### Patient Authentication & Security Subsystem

* **Native Email & Password Authentication (`/login`, `/register`)**:
  * Patients can register using their email address and password.
  * Passwords are encrypted using Node.js native `crypto.scrypt` with a cryptographically strong 16-byte random salt and 64-byte key length (format: `salt:hash`).
  * Authentication utilizes `crypto.timingSafeEqual` to protect against timing attacks. Passwords are never stored or logged in plain text.
* **Google OAuth 2.0 Single Sign-On**:
  * Allows quick login using a verified Google account.
  * Links Google user profiles to the internal `users` database table through the `patientProviderIdentities` table.
* **Inactivity Auto-Lock**:
  * Automatically detects patient inactivity on public or shared computers.
  * Locks the user session after 5 minutes of continuous idle time to safeguard private medical records.

---

### AI Clinical Symptom Triage Engine

Available at `/patient/assessment`, LifeLink processes symptom descriptions through a **5-layer safety triage pipeline** connecting to the Google Gemini AI REST API:

```
[ Patient Enters Symptoms, Age, Gender, Conditions, Duration ]
                            │
                            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Layer 1: Input Validation & Non-Medical Guardrail           │
 │ (Rejects recipes, code, jokes, gibberish, empty text)      │
 └──────────────────────────┬──────────────────────────────────┘
                            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Layer 2: Emergency Keyword Detection Guardrail             │
 │ (Regex check for chest pain, cyanosis, stroke, severe shock)│ ──► [Instant EMERGENCY Override]
 └──────────────────────────┬──────────────────────────────────┘
                            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Layer 3: Biological Consistency Guardrail                   │
 │ (Flags impossible cases, e.g. male pregnancy complaints)    │ ──► [Instant LOW Urgency Override]
 └──────────────────────────┬──────────────────────────────────┘
                            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Layer 4: Google Gemini AI Structured Assessment             │
 │ (Generates JSON: urgency, specialty, clinical reasoning)    │
 └──────────────────────────┬──────────────────────────────────┘
                            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Layer 5: Post-Processing Normalization Guardrail            │
 │ (Enforces 12 system specialties; age < 18 maps to Pediatric)│
 └──────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
       [ Result Saved to MySQL & Sent in Real-Time via SSE ]
```

1. **Layer 1: Input Validation & Non-Medical Filter**:
   * Inspects submitted text using regular expressions.
   * Immediately rejects programming questions, recipes, weather inquiries, or random gibberish. Returns `urgency: "ERROR"` with helpful user feedback.
2. **Layer 2: Emergency Keyword Detection**:
   * Scans text for life-threatening emergency terms (e.g., crushing chest pain, difficulty breathing, blue lips, coughing blood, facial droop, slurred speech).
   * Bypasses AI processing delay to instantly assign `urgency: "EMERGENCY"`, sets specialty to `"Emergency Care"`, and advises the patient to call emergency services immediately.
3. **Layer 3: Biological Consistency Validation**:
   * Checks symptoms against biological sex and age via `checkBiologicalImpossibility`.
   * Flags biologically impossible queries (such as biological males reporting pregnancy or ovarian issues).
   * Prevents AI hallucinations by safely assigning `urgency: "LOW"` and routing the user to General Practice.
4. **Layer 4: Google Gemini AI Structured Assessment**:
   * For valid medical inputs, sends structured prompt instructions to the Google Gemini API.
   * Enforces strict JSON Schema generation so responses only contain valid `urgency`, `specialty`, `reason`, and `guidance` fields.
5. **Layer 5: Post-Processing Normalization**:
   * Verifies that the returned specialty matches one of LifeLink's 12 supported in-system doctor specialties.
   * Automatically applies **Pediatric Overrides**: If the patient is under 18 years old, the specialty is automatically mapped to `Pediatrics`.
   * Maps unlisted specialties to `General Practice`.

---

### Mumbai Transit Corridor Specialist Locator

Available at `/patient/specialists`, this feature helps users discover doctors near major train stations:

* **Interactive Map**: Built with Leaflet and OpenStreetMap, geographically bounded to the Mumbai Metropolitan Region (`[18.80, 72.75]` to `[19.35, 73.20]`).
* **19 Stations Across 3 Rail Lines**:
  * **Central Line (9 Stations)**: CSMT, Ghatkopar, Bhandup, Thane, Mulund, Diva Junction, Kopar, Dombivli, Thakurli.
  * **Western Line (5 Stations)**: Churchgate, Dadar, Andheri, Goregaon, Borivali.
  * **Harbour Line (5 Stations)**: Sewri, Chembur, Vashi, Nerul, Panvel.
* **Realistic Clinic Enclaves**: Clinic GPS coordinates are positioned 400m to 900m around railway stations inside established medical neighborhoods (e.g., Fort Medical Enclave, Dadar West Medical Square, Vashi Sector 15 Medical Park).
* **Multi-Filter Directory**: Search doctors by railway line, station, medical specialty, local area, or doctor name.
* **Client-Side Geodesic Distance Calculation**:
  * Calculates the distance from the patient to each clinic using the Haversine formula directly inside the browser.
  * Keeps patient location private by never transmitting GPS coordinates to the server.

---

### Consultation Appointment Scheduling

Available at `/patient/appointments`:

* **Time Slot Selection**: Book 30-minute consultation slots during Morning/Afternoon sessions (10:00 AM – 3:00 PM) or Evening sessions (7:00 PM – 10:00 PM).
* **Conflict Prevention**: Rejects attempts to book overlapping appointments with the same doctor or schedule dates in the past. Rejections are logged in the `bookingErrors` table for auditing.
* **5-Stage Appointment Lifecycle**:
  $$\text{Requested} \longrightarrow \text{Pending} \longrightarrow \text{Confirmed} \longrightarrow \text{Completed} \quad (\text{or } \text{Cancelled})$$
* **Live Notifications**: Status changes made by the doctor (e.g., confirming an appointment) update the patient's screen immediately via Server-Sent Events.

---

### Digital Health Passport & Emergency Medical ID

Available at `/patient/health-passport`:

* **Emergency Medical Information**: Stores blood group (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`) and emergency contact phone numbers.
* **Allergies & Chronic Illnesses**: Manages verified drug allergies (e.g., Penicillin) and chronic medical conditions (e.g., Asthma, Diabetes) stored in the `patientProfiles` table.
* **Clinician Visibility**: When a doctor opens a patient's consultation dossier, this health data is displayed immediately to help avoid dangerous drug interactions.

---

### Medicine Cabinet & Adherence Tracker

Available at `/patient/medicines`:

* **Medication Inventory**: Tracks active medications, brand and generic names, and dosage strengths (e.g., *Metformin 500mg*).
* **Daily Schedule**: Organizes medicines across Morning, Afternoon, Evening, and Night time slots.
* **Supply & Expiry Monitoring**: Keeps track of remaining pill quantities, regimen duration, and medicine expiration dates.

---

### Cryptographically Verified Digital Prescriptions

Available at `/patient/prescriptions` (Patient View) and `/doctor/prescriptions` (Doctor View):

* **Multi-Drug Prescription Pad**: Doctors can prescribe multiple medications in a single document, specifying dosages and clinical instructions.
* **SHA-256 Digital Signature**: When the doctor signs a prescription, the server generates a canonical JSON representation:
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
  The server computes the SHA-256 hash of this data and stores it in `patientPrescriptions.integrityReference` (format: `sha256:<64-hex-characters>`).
* **Tamper Verification**: If anyone modifies the clinical notes, drug name, or dosage directly in the database, the hash verification fails, indicating that the prescription has been altered.
* **Prescription Status**: Moves from `UNSIGNED / CONTROLLED WORKSPACE` to `SIGNED — CONTROLLED STATE`.

---

### Emergency SOS Protocol (112 Rapid Dispatch)

Available at `/patient/emergency`:

* **Direct Emergency Call**: One-tap button triggering a phone call to India's National Emergency Number (**112**) via `tel:112`.
* **Automated Emergency SMS**: Prepares an SMS message addressed to the patient's saved emergency contacts containing their name, blood group, and emergency alert message.
* **Automatic Emergency Redirect**: Automatically redirects patients to this screen whenever their AI triage score returns an `EMERGENCY` evaluation.

---

### Patient Profile & Theme Preferences

Available at `/patient/profile` and `/patient/settings`:

* **Personal Profile Management**: Update legal name, phone number, and profile picture.
* **Emergency Contacts**: Configure emergency contact persons (name, relationship, phone number) stored in `patientEmergencyContacts`.
* **Swiss Theme Switcher**: Toggle between high-contrast Light and Dark modes with instant CSS variable updates and `localStorage` persistence.

---

### Clinician Workstation Subsystem

Available at `/doctor/*`:

* **Doctor Login (`/doctor/login`)**: Secure login for the 52 verified doctors using institutional email addresses (`<line>-<specialty>-<station>@lifelink.com`) checked against individual Scrypt password hashes.
* **Master Password Reset (`/doctor/reset`)**: Emergency password reset utility protected by the server-side master access key `LIFELINK_DEMO_DOCTOR_ACCESS_CODE`.
* **Clinical Operations Dashboard (`/doctor/dashboard`)**: Displays today's appointment requests, patient roster, and a real-time waiting queue updated via Server-Sent Events.
* **Patient Medical Dossier (`/doctor/patients/:patientId`)**: Shows complete patient health history: demographics, blood group, drug allergies, chronic conditions, and previous AI triage assessments.
* **Digital Prescription Creator (`/doctor/consultation`)**: Allows doctors to record diagnoses, add prescribed medicines, and digitally sign prescriptions with SHA-256 cryptographic signatures.

---

### Security Guardrails & Session Isolation

* **Dual-Session Domain Isolation**: Patient (`app_session_id`) and Doctor (`doctor_session_id`) cookies are isolated on separate HTTP-only cookies with SameSite protections.
* **IDOR Protection**: Backend tRPC procedures check data ownership on every request, ensuring patients can only view their own health records.
* **Real-Time Event Bus (SSE)**: Uses persistent HTTP Server-Sent Events to push live updates without requiring continuous client polling.
* **Multi-Device Responsive Design**: Fully responsive across mobile screens (320px to 480px), tablets (768px), laptops (1024px), and 4K desktop monitors with safe-area inset compatibility.

---

## 3. Engineering Concepts Explained

For college students and engineers reviewing this codebase, here is a simplified explanation of the core computer science concepts used across LifeLink:

### End-to-End Type Safety with tRPC

In traditional web development, the frontend calls backend REST endpoints using string URLs like `fetch('/api/appointments')`. If the backend changes a field name, the frontend may crash at runtime without warning.

LifeLink uses **tRPC**. tRPC directly exports the TypeScript type definitions from the backend router to the frontend client. This gives full IDE autocomplete and compile-time type checking for every query and mutation without generating any boilerplate code. If an API input or return type changes, TypeScript immediately highlights the exact line in the frontend code.

---

### Client-Side Geodesic Distance via Haversine Formula

To calculate the physical distance between a commuter's current location and a clinic across the curved surface of the Earth, LifeLink uses the **Haversine formula**:

$$d = 2r \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)} \right)$$

* Where $\phi_1, \phi_2$ are the latitudes in radians, $\lambda_1, \lambda_2$ are the longitudes in radians, and $r \approx 6371\text{ km}$ is Earth's mean radius.
* **Privacy Benefit**: Computing this client-side means the user's live GPS coordinates never leave their device, preserving user privacy.

---

### Password Security with Scrypt & Timing-Safe Checks

Instead of older, vulnerable algorithms like MD5 or plain SHA-256, user passwords in LifeLink are hashed using **Node.js native Scrypt**:
1. A unique, cryptographically random 16-byte salt is generated for every user.
2. Scrypt uses memory-hard mathematical computations to resist brute-force attacks from specialized hardware (ASICs and GPUs).
3. Stored format: `salt:hash`.
4. When verifying passwords during login, the system uses `crypto.timingSafeEqual` rather than standard string equality (`===`). This ensures the comparison executes in constant time, preventing attackers from guessing passwords by measuring microsecond differences in response times (timing attacks).

---

### Prescription Integrity Verification with SHA-256

To prevent tampering with digital prescriptions:
1. When a doctor writes a prescription, the system serializes the diagnosis, doctor ID, patient ID, and medicine items into a standardized (canonical) JSON string.
2. The server calculates the **SHA-256 cryptographic hash** of this string and saves it in `patientPrescriptions.integrityReference`.
3. When a patient or pharmacy views the prescription, the server recalculates the hash from the current database values and compares it to the stored signature.
4. If even a single character, dosage, or medicine name has been altered in the database, the hashes will not match, immediately revealing unauthorized modifications.

---

### Real-Time Push Updates via Server-Sent Events (SSE)

Traditional web apps often rely on "polling" — sending repeated HTTP requests every few seconds to check for updates, which wastes bandwidth and server resources.

LifeLink uses **Server-Sent Events (SSE)**:
* The client opens a single, long-lived HTTP connection to the server (`/api/events/patient` or `/api/events/doctor`).
* When an event occurs (such as a doctor confirming an appointment or an AI triage completing), the server instantly pushes a lightweight JSON event packet down the open stream.
* The client listens to these events and updates the React state immediately without reloading the page.

---

## 4. Tech Stack

Every technology listed below is actively configured and utilized in the codebase:

### Frontend Architecture

| Technology | Package Version | Architectural Role |
|:---|:---|:---|
| **React** | `^19.2.1` | Core declarative UI component library |
| **Vite** | `^7.1.7` | High-speed frontend build tool and local development server |
| **TypeScript** | `5.9.3` | Static type safety across components, hooks, and utilities |
| **React Router DOM** | `^7.18.2` | Declarative client-side routing, protected routes, and layout shells |
| **Tailwind CSS** | `^4.1.14` | Utility-first CSS framework integrated via `@tailwindcss/vite` |
| **tRPC Client** | `^11.6.0` | End-to-end type-safe API communication with autocompletion |
| **TanStack React Query** | `^5.90.2` | Client-side server-state caching, fetching, and cache invalidation |
| **Leaflet & React-Leaflet** | `^1.9.4` / `^5.0.0` | Interactive map rendering for Mumbai transit clinics |
| **Lucide React** | `^0.453.0` | Accessible clinical and navigational iconography |
| **Radix UI Primitives** | Various | Headless accessible UI components (Dialog, Tabs, Tooltip, Select) |
| **React Hook Form & Zod** | `^7.64.0` / `^4.1.12` | Form state management and schema validation |
| **Sonner** | `^2.0.7` | Toast notification alerts for real-time user feedback |

---

### Backend Architecture

| Technology | Package Version | Architectural Role |
|:---|:---|:---|
| **Node.js** | `>=22.0.0` | High-performance server-side JavaScript runtime |
| **Express** | `^4.21.2` | HTTP web server framework hosting REST endpoints and tRPC middleware |
| **tRPC Server** | `^11.6.0` | Type-safe backend RPC routers and procedure handlers |
| **Drizzle ORM** | `^0.44.5` | Type-safe SQL query builder and schema management library |
| **Drizzle Kit** | `^0.31.4` | Automated database migration generator and Drizzle Studio GUI |
| **MySQL2 Driver** | `^3.15.0` | High-throughput MySQL client with connection pooling |
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
| **Vitest** | `^5.0.1` | Fast test runner executing 225 unit and integration tests |
| **React Testing Library** | `^16.3.3` | Integration testing for React components in a simulated DOM environment |
| **JSDOM** | `^27.0.0` | Pure JavaScript implementation of W3C DOM and HTML standards for testing |

---

## 5. Setup & Installation

Follow these step-by-step instructions to set up LifeLink on your local computer.

### Prerequisites

Ensure the following software is installed on your computer:
* **Node.js**: Version `22.0.0` or higher (`node -v` to check)
* **npm**: Version `10.0.0` or higher (comes bundled with Node.js)
* **MySQL Server**: Version `8.0` or higher running locally (via MySQL Server, Workbench, XAMPP, or Docker)
* **Google Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/)
* **Git**: Installed on your system

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

#### 3. Create and Configure the `.env` File
Create your `.env` configuration file by copying `.env.example`:

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

Open `.env` in your text editor and update your database credentials and API keys.

---

### Environment Variables Reference (.env)

All variables correspond strictly to `.env.example`:

| Environment Variable | Required | Description | Example Value |
|:---|:---:|:---|:---|
| `PORT` | Yes | HTTP port on which the Express backend server listens | `4000` |
| `DATABASE_URL` | Yes | MySQL connection string (`mysql://user:pass@host:port/db`) | `mysql://root:password@localhost:3306/lifelink` |
| `JWT_SECRET` | Yes | Secret key (minimum 32 characters) for signing session cookies | `lifelink-super-secret-production-key-minimum-32-chars` |
| `GEMINI_API_KEY` | Yes | Google AI Studio API key for AI symptom assessment | `AIzaSyYourGeminiApiKeyHere` |
| `LIFELINK_DEMO_DOCTOR_ACCESS_CODE` | Yes | Master secret key for resetting clinician passwords | `lifelink-controlled-clinician-secret-key-2026` |
| `AUTH_PUBLIC_BASE_URL` | Yes | Base URL of the frontend for redirects | `http://localhost:5173` |
| `GOOGLE_OAUTH_CLIENT_ID` | Optional | Google Cloud OAuth 2.0 Client ID for Google login | `your-client-id.apps.googleusercontent.com` |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Optional | Google Cloud OAuth 2.0 Client Secret | `your-client-secret` |

---

### Database Migration & Doctor Synchronization

#### 1. Create the MySQL Database
Ensure your MySQL service is running, then create the database:
```sql
CREATE DATABASE IF NOT EXISTS lifelink;
```

#### 2. Apply Schema Tables
Push the Drizzle ORM schema to automatically generate all 14 database tables:
```bash
npm run db:push
```

#### 3. Populate the 52 Verified Doctors
Seed the database with all 52 verified Mumbai railway doctors along with their individual Scrypt password hashes:
```bash
npm run db:sync:doctors
```

---

### Troubleshooting Common Setup Issues

* **MySQL Connection Refused**:
  * Verify that MySQL is running on port 3306 (`netstat -ano | findstr 3306` on Windows).
  * Double-check that the username and password in `DATABASE_URL` match your MySQL credentials.
* **Node.js Version Warning**:
  * Make sure your Node.js version is 22 or higher (`node -v`). If using older versions, update via the official Node.js installer or `nvm`.
* **Gemini API Key Errors**:
  * Ensure `GEMINI_API_KEY` in `.env` is valid and active in Google AI Studio. If quota limits are reached, the system will fall back to other available Gemini models.

---

## 6. Usage & How the Project Works (Simple Guide)

This section provides a clear, step-by-step walkthrough of every major feature in LifeLink.

---

### Segment 1: Starting the Platform

Before using the application, start the local development servers.

**Instructions:**
1. Open your terminal in the project folder (`New-LifeLink-Smart-Healthcare-Assistance-Platform`).
2. Run the start command:
   ```bash
   npm run dev
   ```
3. The system will start two services concurrently:
   * **Frontend Web Application:** Available at `http://localhost:5173`
   * **Backend API Server:** Running at `http://localhost:4000`
4. Open your web browser and navigate to `http://localhost:5173`. You will see the main landing page with options to enter either the Patient Portal or the Clinician Workspace.

---

### Segment 2: Patient Registration & Login

How regular users access their personal health account.

**Instructions for New Patients:**
1. On the main landing page, click **Patient Portal**.
2. Click **"Create an account"** or **"Register"**.
3. Enter your full name, email address, and a secure password.
4. Click **Register**. The system will hash your password with Scrypt and log you in automatically.

**Instructions for Returning Patients:**
1. Click **Patient Portal**.
2. Enter your registered email and password, then click **Sign In**.
3. *Alternative:* Click **"Continue with Google"** to log in instantly using your Google account.

---

### Segment 3: Getting AI Medical Advice (Symptom Triage)

When feeling unwell, use the AI triage engine for quick specialty recommendations.

**How it works:**
The triage engine uses Google Gemini AI coupled with safety rules. It rejects non-medical inputs, immediately detects emergency keywords (such as chest pain or stroke signs), prevents biological contradictions (such as male pregnancy), and suggests an appropriate medical specialty.

**Instructions:**
1. Click **"AI Assessment"** in the left navigation menu.
2. In the symptom box, describe how you feel (e.g., *"I have had a high fever and bad headache for 2 days"*).
3. Select your age and gender.
4. Enter any existing medical conditions (e.g., *Asthma* or *Diabetes*), or leave it blank if none.
5. Click **"Submit Assessment"**.
6. Review the resulting triage report:
   * **LOW**: Mild symptoms; consult a General Physician.
   * **MODERATE**: Needs medical attention; schedule an appointment with the recommended specialist.
   * **EMERGENCY**: Urgent danger; call emergency services (112) immediately.

---

### Segment 4: Finding a Doctor Near Your Train Station

Find accredited doctors practicing close to major railway stations in Mumbai.

**How it works:**
The platform maintains an interactive directory of 52 verified demo doctors across 19 train stations on the Central, Western, and Harbour lines.

**Instructions:**
1. Click **"Specialist Finder"** in the left navigation menu.
2. An interactive map of Mumbai will appear with clinic location markers.
3. Use the filters above the map to refine your search:
   * **Railway Line**: Choose Central, Western, or Harbour.
   * **Station**: Select your nearest transit station (e.g., *Dadar* or *Thane*).
   * **Medical Specialty**: Select the specialty recommended during triage (e.g., *Cardiology*, *Pediatrics*).
4. Review matching doctor cards to see their qualifications, clinic address, and consultation fees.

---

### Segment 5: Booking a Doctor's Appointment

Schedule a consultation with your selected doctor.

**Instructions:**
1. On the **Specialist Finder** page, click **"Book Consultation"** on a doctor's card.
2. Select a date on the calendar.
3. Choose an available 30-minute time slot (e.g., *10:30 AM* or *7:00 PM*).
4. Click **Confirm Booking**.
5. Navigate to **"Appointments"** in the menu to track your booking status (`Pending` $\rightarrow$ `Confirmed` once accepted by the doctor).

---

### Segment 6: Setting Up Your Health Passport

Your Health Passport stores essential medical data so doctors are informed before consultations.

**Instructions:**
1. Click **"Health Passport"** in the left navigation menu.
2. Choose your blood group from the dropdown list (e.g., *O+*, *B+*).
3. In the **Drug Allergies** section, add any medicines you are allergic to (e.g., *Penicillin*).
4. In the **Chronic Conditions** section, add any ongoing illnesses (e.g., *Hypertension*).
5. Click **Save Profile**. Doctors will automatically see this information when you book an appointment.

---

### Segment 7: Managing Your Medicines

Track your daily prescriptions and medication inventory.

**Instructions:**
1. Click **"Medicine Cabinet"** in the left navigation menu.
2. Click **"Add Medicine"**.
3. Enter the medicine name and dosage (e.g., *Paracetamol 500mg*).
4. Select your scheduled intake times (Morning, Afternoon, Evening, or Night).
5. Enter your starting pill count and expiration date to monitor remaining stock.

---

### Segment 8: In Case of Emergency (SOS)

Quick access to emergency assistance during acute health crises.

**Instructions:**
1. Click the red **"Emergency SOS"** button at the top of the screen or open **"Emergency"** in the menu.
2. Tap **"Call 112"** to open your phone's dialer connected to the National Emergency Number.
3. Tap **"Notify Emergency Contacts"** to generate an emergency SMS containing your name, blood group, and distress message for your saved contacts.

---

### Segment 9: Doctor's Workstation (For Clinicians Only)

The restricted workspace for verified doctors.

**Instructions for Doctors:**
1. Visit `http://localhost:5173` and click **"Clinician Workspace"**.
2. Log in using your assigned institutional email and password:
   * *Example*: For the Cardiologist at CSMT on the Central Line:
     * **Email**: `central-cardiology-csmt@lifelink.com`
     * **Password**: `cardiology.csmt@lifelink`
3. On the **Dashboard**, view your daily statistics and live waiting room queue.
4. Open the **Appointments** tab to review pending patient requests and click **"Confirm Appointment"**.
5. During a consultation, click on a patient's name to open their **Clinical Dossier** (viewing their blood group, allergies, and AI triage history).
6. Go to **Prescriptions**, enter clinical notes and prescribed medications, then click **"Sign and Issue Prescription"**. The system creates an immutable SHA-256 digital signature and delivers the prescription to the patient.

---

### Verified Directory: 52 Mumbai Railway Doctors

All 52 demo doctors are pre-configured in the database across 19 railway stations:

* **Email Pattern**: `<line>-<specialty>-<station>@lifelink.com`
* **Password Pattern**: `<specialty>.<station>@lifelink` *(all lowercase, no spaces)*

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
| `dev` | `node scripts/dev.mjs` | Starts the Express backend (`:4000`) and Vite dev server (`:5173`) concurrently with reverse proxying |
| `build` | `vite build && esbuild backend/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist` | Compiles the frontend into `dist/public` and bundles the backend into `dist/index.js` |
| `start` | `NODE_ENV=production node dist/index.js` | Runs the production build serving both the backend API and static frontend assets |
| `check` | `tsc --noEmit` | Executes TypeScript type-checking without emitting JS files |
| `test` | `vitest run` | Runs all 225 automated unit and integration tests across 33 test files |
| `format` | `prettier --write .` | Formats all code and documentation files according to formatting standards |
| `verify` | `npm run check && npm test && npm run build` | Sequentially runs full type checking, test suites, and production build verification |
| `db:push` | `drizzle-kit push` | Applies schema definitions from `database/schema.ts` directly to MySQL |
| `db:studio` | `drizzle-kit studio --port 4983` | Launches the interactive Drizzle Studio database management interface at `http://localhost:4983` |
| `db:sync:doctors` | `tsx scripts/sync-doctors.ts` | Populates and synchronizes the 52 Mumbai railway doctors and their Scrypt password hashes in MySQL |
| `db:clear` | `tsx scripts/clear-db.ts` | Clears test patient records while keeping all doctor accounts intact |
| `db:delete-user` | `tsx scripts/delete-user.ts` | Command-line utility to selectively delete a single user account |

---

### Automated Testing Framework (225 Tests)

LifeLink includes a test suite of **225 tests across 33 test files** run using Vitest:

```bash
npm test
```

#### Test Suite Breakdown

| Test Suite File | Tests | Validated Behavior |
|:---|:---:|:---|
| `backend/ai/assessmentService.test.ts` | **54 tests** | 5-layer triage pipeline: input sanitization, non-medical pattern rejection, biological consistency checks (male pregnancy), pediatric age overrides, and urgency score mapping |
| `backend/realtime/patientRealtime.test.ts` | **32 tests** | Real-time Server-Sent Events (SSE) packet delivery, listener error handling, stream reconnection, and cleanup |
| `backend/discovery/mockDoctorDirectory.test.ts` | **15 tests** | Verifies 52 doctors, 1 GP per station guarantee across 19 stations, GPS coordinates, and line filters |
| `backend/auth/doctorAuth.test.ts` | **12 tests** | Doctor Scrypt password checks, institutional email login, timing-safe password resets, and session cookies |
| `backend/auth/nativePatientAuth.test.ts` | **10 tests** | Native patient signup, password complexity, unique Scrypt random salting, and `timingSafeEqual` login |
| `backend/auth/security.idor.test.ts` | **10 tests** | IDOR boundaries ensuring patients cannot access or modify records belonging to other users |
| `backend/appointments/appointmentLifecycle.test.ts` | **10 tests** | 5-stage appointment state machine: `Requested` $\rightarrow$ `Pending` $\rightarrow$ `Confirmed` $\rightarrow$ `Completed` / `Cancelled`, slot conflicts, and past dates |
| `backend/prescriptions/prescriptionLifecycle.test.ts` | **9 tests** | Multi-item prescriptions, status transitions, and SHA-256 digital signature hash verification |
| `backend/medicines/medicine.test.ts` | **8 tests** | Medicine cabinet operations, daily schedules, adherence tracking, and inventory counts |
| `backend/profile/healthPassport.test.ts` | **8 tests** | Emergency Health Passport: blood group validation, serialized allergy/condition lists, and profile updates |
| `backend/auth/simultaneousAuth.test.ts` | **7 tests** | Dual session cookie isolation (`app_session_id` vs `doctor_session_id`) allowing concurrent patient and doctor logins |
| `backend/ui/responsiveLayout.test.ts` | **7 tests** | Responsive rendering across 320px, 360px, 390px, 430px, 480px, 768px, and 4K screens with safe-area insets |
| `backend/auth/patientInactivity.test.ts` | **6 tests** | Inactivity timeout detection and automatic session locking after 5 minutes of idle time |
| `backend/profile/profilePhoto.test.ts` | **6 tests** | Avatar photo upload validation, file size limits, and storage |
| `backend/ai/geminiKey.test.ts` | **5 tests** | Gemini API key environment configuration and connection tests |
| `backend/ai/assessment.validation.test.ts` | **5 tests** | Zod input schema validation for triage requests (symptoms length, age limits, gender values) |
| *Other Suites (17 files)* | **21 tests** | Route authentication guards, UI tokens, accessibility, and event pub/sub mechanics |
| **Total** | **225 tests** | **100% Passing Test Suite** |

---

### Relational Database Schema Deep Dive (14 Tables)

All database tables are defined in [`database/schema.ts`](file:///c:/Project%20FP/LifeLink-Smart-Healthcare-Assistance-Platform/database/schema.ts) using Drizzle ORM:

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

#### Detailed Table Specifications

1. **`users`**:
   * **Purpose**: Primary identity table representing all system users (Patients, Doctors, Admins).
   * **Columns**: `id` (INT, Primary Key, Auto-increment), `openId` (VARCHAR(64), Unique, e.g. `native:...`, `synthetic-doctor:...`), `name` (TEXT), `email` (VARCHAR(320)), `loginMethod` (VARCHAR(64)), `role` (ENUM: `'user'`, `'doctor'`, `'admin'`), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP), `lastSignedIn` (TIMESTAMP).

2. **`patientCredentials`**:
   * **Purpose**: Stores login credentials for native patient email and password accounts.
   * **Columns**: `id` (INT, Primary Key), `userId` (INT, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE, Unique), `email` (VARCHAR(320), Unique), `passwordHash` (VARCHAR(512), stores Scrypt hash in `salt:hash` format), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).

3. **`syntheticDoctorCredentials`**:
   * **Purpose**: Stores institutional credentials for the 52 verified demo doctors.
   * **Columns**: `id` (INT, Primary Key), `userId` (INT, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE, Unique), `doctorId` (VARCHAR(80), Unique, matching directory ID), `email` (VARCHAR(320), Unique), `passwordHash` (VARCHAR(512), stores Scrypt hash), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).

4. **`patientProviderIdentities`**:
   * **Purpose**: Stores Google OAuth SSO login linkages.
   * **Columns**: `id` (INT, Primary Key), `userId` (INT, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE), `provider` (ENUM: `'google'`), `subject` (VARCHAR(255)), `email` (VARCHAR(320)), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP). Unique composite key on `(provider, subject)`.

5. **`patientProfiles`**:
   * **Purpose**: Stores core health information and medical identity data.
   * **Columns**: `id` (INT, Primary Key), `userId` (INT, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE, Unique), `bloodGroup` (VARCHAR(12), e.g. `'O+'`, `'B+'`), `phone` (VARCHAR(32)), `avatarKey` (VARCHAR(512)), `allergiesJson` (TEXT, stores JSON array of drug allergies), `conditionsJson` (TEXT, stores JSON array of chronic illnesses), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).

6. **`patientEmergencyContacts`**:
   * **Purpose**: Stores emergency contacts reachable during critical medical situations.
   * **Columns**: `id` (INT, Primary Key), `userId` (INT, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE), `name` (VARCHAR(160)), `relationship` (VARCHAR(80)), `phone` (VARCHAR(32)), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).

7. **`patientAssessments`**:
   * **Purpose**: Stores the history of AI symptom triage assessments performed by Google Gemini.
   * **Columns**: `id` (INT, Primary Key), `userId` (INT, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE), `symptoms` (TEXT), `age` (INT), `gender` (VARCHAR(32)), `conditions` (TEXT), `duration` (VARCHAR(64)), `urgency` (ENUM: `'LOW'`, `'MODERATE'`, `'EMERGENCY'`, `'ERROR'`), `reason` (TEXT), `specialty` (VARCHAR(160)), `guidance` (TEXT), `createdAt` (TIMESTAMP).

8. **`patientAppointments`**:
   * **Purpose**: Stores consultation appointments between patients and doctors.
   * **Columns**: `id` (INT, Primary Key), `userId` (INT, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE), `doctorId` (VARCHAR(80)), `reason` (TEXT), `scheduledAt` (TIMESTAMP), `status` (ENUM: `'Requested'`, `'Pending'`, `'Confirmed'`, `'Completed'`, `'Cancelled'`), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).

9. **`patientPrescriptions`**:
   * **Purpose**: Stores official digital prescriptions signed by doctors.
   * **Columns**: `id` (INT, Primary Key), `userId` (INT, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE), `doctorId` (VARCHAR(80)), `issuedAt` (TIMESTAMP), `status` (ENUM: `'UNSIGNED / CONTROLLED WORKSPACE'`, `'SIGNED — CONTROLLED STATE'`), `clinicalNotes` (TEXT), `integrityReference` (VARCHAR(255), stores `sha256:...`), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).

10. **`patientPrescriptionItems`**:
    * **Purpose**: Stores individual medication entries belonging to a prescription.
    * **Columns**: `id` (INT, Primary Key), `prescriptionId` (INT, Foreign Key $\rightarrow$ `patientPrescriptions.id` ON DELETE CASCADE), `name` (VARCHAR(200)), `dosage` (VARCHAR(120)), `instructions` (TEXT).

11. **`patientMedicines`**:
    * **Purpose**: Stores user medication lists and daily adherence schedules in the medicine cabinet.
    * **Columns**: `id` (INT, Primary Key), `userId` (INT, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE), `name` (VARCHAR(200)), `dosage` (VARCHAR(120)), `frequency` (VARCHAR(120)), `schedule` (VARCHAR(120)), `startDate` (VARCHAR(10)), `endDate` (VARCHAR(10)), `quantity` (INT), `expiry` (VARCHAR(10)), `createdAt` (TIMESTAMP), `updatedAt` (TIMESTAMP).

12. **`patientEvents`**:
    * **Purpose**: Real-time event log for streaming updates to patient browsers via Server-Sent Events (SSE).
    * **Columns**: `id` (INT, Primary Key), `userId` (INT, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE), `type` (ENUM: `'PROFILE_UPDATED'`, `'APPOINTMENT_UPDATED'`, `'PRESCRIPTION_CREATED'`, `'ASSESSMENT_COMPLETED'`, `'MEDICINE_UPDATED'`), `entityId` (VARCHAR(80)), `createdAt` (TIMESTAMP).

13. **`doctorEvents`**:
    * **Purpose**: Real-time event log for streaming updates to clinician workstations via SSE.
    * **Columns**: `id` (INT, Primary Key), `doctorId` (VARCHAR(80)), `patientUserId` (INT, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE), `type` (ENUM: `'APPOINTMENT_UPDATED'`, `'ASSESSMENT_COMPLETED'`, `'PATIENT_RELATED_UPDATE'`), `entityId` (VARCHAR(80)), `createdAt` (TIMESTAMP).

14. **`bookingErrors`**:
    * **Purpose**: Audit log recording appointment booking failures, invalid past dates, and scheduling conflicts.
    * **Columns**: `id` (INT, Primary Key), `userId` (INT, Foreign Key $\rightarrow$ `users.id` ON DELETE CASCADE, Nullable), `doctorId` (VARCHAR(80), Nullable), `attemptedAt` (TIMESTAMP, Nullable), `errorMessage` (TEXT), `errorCode` (VARCHAR(64)), `createdAt` (TIMESTAMP).

---

<div align="center">

🏥 **LifeLink — Engineering safer, faster healthcare assistance for Mumbai commuters.**

*Built with ❤️ in Mumbai, India*

</div>

# 🏥 LifeLink — Smart Healthcare Assistance Platform

> **[PROTOTYPE]** A prototype healthcare platform demonstrating secure patient records, AI triage, and dedicated clinical workspaces. Uses Server-Sent Events (SSE) to simulate real-time doctor appointment scheduling for testing purposes (No real doctors involved).

🌍 **Live Demo:** [https://new-lifelink-smart-healthcare-assistance.onrender.com/](https://new-lifelink-smart-healthcare-assistance.onrender.com/)


[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v22%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.1-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Tests Passing](https://img.shields.io/badge/Vitest-247%20Tests%20Passed-success?style=for-the-badge&logo=vitest&logoColor=white)](#27-automated-testing-framework--test-breakdown)

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Project Objectives](#3-project-objectives)
4. [Project Scope](#4-project-scope)
5. [User Roles](#5-user-roles)
6. [Main Features](#6-main-features)
7. [System Architecture](#7-system-architecture)
8. [Technology Stack](#8-technology-stack)
9. [Complete Repository Structure](#9-complete-repository-structure)
10. [Folder-by-Folder Guide](#10-folder-by-folder-guide)
11. [File-by-File Technical Guide](#11-file-by-file-technical-guide)
12. [Frontend Architecture & UI Design System](#12-frontend-architecture--ui-design-system)
13. [Patient Portal Walkthrough](#13-patient-portal-walkthrough)
14. [Doctor Workspace Walkthrough](#14-doctor-workspace-walkthrough)
   - [14.1 Clinician Workstation Login Credentials (Mumbai Medical Directory)](#141-clinician-workstation-login-credentials-mumbai-medical-directory)
15. [Appointment System & Doctor-Specific Availability](#15-appointment-system--doctor-specific-availability)
16. [Relational Database Schema (14 Tables)](#16-relational-database-schema-14-tables)
17. [Backend Server & tRPC API Architecture](#17-backend-server--trpc-api-architecture)
18. [Authentication, Authorization & Security Controls](#18-authentication-authorization--security-controls)
19. [Artificial Intelligence & Clinical Safety Triage](#19-artificial-intelligence--clinical-safety-triage)
20. [Realtime Communication (Server-Sent Events)](#20-realtime-communication-server-sent-events)
21. [Maps & Mumbai Transit Integration](#21-maps--mumbai-transit-integration)
22. [Responsive Design & Accessibility](#22-responsive-design--accessibility)
23. [Step-by-Step Local Development Setup](#23-step-by-step-local-development-setup)
24. [Environment Variables Reference](#24-environment-variables-reference)
25. [Database Operations & Management](#25-database-operations--management)
26. [Production Cloud Deployment & Live Infrastructure (Render.com + TiDB Serverless)](#26-production-cloud-deployment--live-infrastructure-rendercom--tidb-serverless)
27. [Automated Testing Framework & Test Breakdown](#27-automated-testing-framework--test-breakdown)
28. [Verified Test & Build Results](#28-verified-test--build-results)
29. [Troubleshooting Guide](#29-troubleshooting-guide)
30. [Medical Safety & Privacy Disclaimers](#30-medical-safety--privacy-disclaimers)
31. [Current Limitations & Future Enhancements](#31-current-limitations--future-enhancements)
32. [Complete Verified NPM Script Quick Reference](#32-complete-verified-npm-script-quick-reference)
33. [Modular Documentation Index & Cross-References](#33-modular-documentation-index--cross-references)

---

## 1. Project Overview

### 🚀 2026 Latest Updates: Production Architecture & Deployment
This project has undergone a complete architectural upgrade to support production-level deployment:
- **Cloud Infrastructure:** Successfully deployed as a live full-stack application on **Render.com** (See [Section 26](#26-production-cloud-deployment--live-infrastructure-rendercom--tidb-serverless)).
- **Serverless Database:** Migrated from local MySQL to **TiDB Serverless Cloud** for 24/7 high-availability and zero-downtime scaling.
- **Single-Page Application (SPA):** Completely refactored the frontend routing to support isolated, concurrent session states for Patient and Doctor workspaces without requiring tab isolation.
- **Google OAuth 2.0:** Hardened authentication with strict URI callbacks matching the production cloud environment.
- **Database Synchronization:** Securely seeded 52 Doctor workstation accounts into the live production database while preserving patient privacy constraints.

**LifeLink** is a full-stack smart healthcare assistance platform whose initial operational range and live coverage are centered on the **Mumbai Metropolitan Region (MMR)**. In Mumbai, the platform uses major suburban railway stations as practical local landmarks, connecting daily train commuters and residents with fast health guidance and verified medical specialists near their transit stops. While current operational coverage is focused on Mumbai, the platform architecture has been deliberately designed to be location-agnostic, enabling seamless future expansion to a **Pan-India** healthcare network across cities, districts, and rural regions.

In large metropolitan cities like Mumbai, over 7.5 million passengers travel daily across the suburban railway network. When commuters experience sudden health symptoms during transit, they face three common challenges:
- They do not know whether their condition is an emergency or something that can wait.
- They do not know which medical specialty (such as Cardiology, Dermatology, or Orthopedics) treats their specific symptoms.
- They do not know which accredited clinics or doctors are located within walking distance of their destination train station or local area.

LifeLink addresses these challenges by combining:
1. **A 5-Layer AI Clinical Symptom Triage Engine** powered by Google Gemini, which evaluates symptoms against biological and emergency rules to recommend an appropriate medical specialty and urgency level.
2. **A Mumbai Specialist Directory** covering 52 verified doctor profiles mapped to 19 major railway stations (Western, Central, and Harbour lines) as local proximity anchors.
3. **An Integrated Patient & Doctor Workflow**, providing appointment booking, personal Health Passports, medicine tracking, tamper-evident digital prescriptions, and live updates via Server-Sent Events (SSE).
4. **A Location-Agnostic Extensibility Framework**, allowing doctor discovery, clinic listings, and coordinate calculations to scale beyond Mumbai to any city, district, or PIN code across India.

---

## 2. Problem Statement

Navigating urban healthcare in high-density transit corridors presents several practical difficulties for everyday citizens:

- **Symptom Confusion & Self-Diagnosis Anxiety**: Patients often turn to search engines when feeling unwell. Search results can cause unnecessary panic or downplay critical conditions. Patients need structured, non-diagnostic guidance that directs them to the right medical department.
- **Geographic Mismatch in Transit**: Commuters spend significant time traveling between home and work. Finding a clinic near an interchange station (such as Dadar, Kurla, or Andheri) during a commute is difficult without localized transit-aware directories.
- **Fragmented Medical Information**: Patients frequently lose physical paper prescriptions and forget medication schedules or allergy histories during emergency visits.
- **Unsecured Digital Health Records**: Many web applications allow users to view other people's records simply by changing an ID in a web address (known as an Insecure Direct Object Reference, or IDOR vulnerability). Healthcare applications require strict authorization boundaries.

---

## 3. Project Objectives

LifeLink was designed and built to fulfill the following specific objectives:

1. **Provide Safe, Structured Health Guidance**: Deliver structured, preliminary triage guidance using artificial intelligence, backed by deterministic emergency overrides and biological consistency checks.
2. **Map Specialists to Mumbai Localities**: Map verified clinics to 19 major suburban railway stations in Mumbai, enabling commuters to locate doctors near their transit routes and destination stops.
3. **Enforce Doctor-Specific Appointment Scheduling**: Guarantee that appointment slots belong strictly to specific doctors, preventing cross-doctor scheduling conflicts and ensuring atomicity.
4. **Digitize Personal Health Records Securely**: Allow patients to maintain an Emergency Health Passport, an active medicine cabinet, and digital prescriptions with cryptographic integrity checks.
5. **Implement Strict Healthcare Security**: Enforce Scrypt password hashing with individual random salts, dual HTTP-only session cookies, 5-minute inactivity termination, and comprehensive IDOR protections.
6. **Support Real-Time Communication**: Push live appointment and prescription status changes to connected browsers instantly using lightweight Server-Sent Events (SSE).
7. **Architect for Pan-India Scalability**: Maintain clean separation between regional location datasets and core clinical business logic, ensuring straightforward expansion to any city, district, or state across India.

---

## 4. Project Scope

To provide an accurate assessment of the platform, the project boundary is clearly divided into what is currently implemented and what lies outside the current release scope:

### Currently Implemented

- **Regional Operational Range (Mumbai Metropolitan Region)**: Full specialist discovery and transit directory currently active across 19 major railway stations (Western, Central, and Harbour lines) with calibrated GPS coordinates and verified clinic listings.
- **Dual Workspaces**: Dedicated, isolated workspaces for patients (`/patient/*`) and clinicians (`/doctor/*`).
- **Authentication**: Native email/password authentication with memory-hard Scrypt hashing (16-byte random salts), timing-safe verification, and optional Google OAuth 2.0.
- **AI Symptom Triage**: 5-layer triage pipeline utilizing Google Gemini Flash models with deterministic 0ms emergency regex overrides, biological checks, and offline fallbacks.
- **Transit Specialist Directory**: 52 doctor profiles across 19 railway stations with interactive Leaflet map rendering and client-side geodesic distance calculations.
- **Appointment Scheduling**: Complete 5-stage lifecycle (`Requested`, `Pending`, `Confirmed`, `Completed`, `Cancelled`) with doctor-specific slot conflict detection and database unique constraints.
- **Medicine Cabinet**: CRUD operations for prescribed and personal medications with dosage, frequency, and adherence tracking.
- **Emergency Health Passport**: Digital medical ID storing blood group, contact phone, uploaded photo avatar, structured allergies, and chronic conditions.
- **Digital Prescriptions**: Two-phase prescription lifecycle (drafting in `UNSIGNED / CONTROLLED WORKSPACE` $\rightarrow$ explicit execution of `doctorWorkspace.prescriptions.sign` mutation $\rightarrow$ `SIGNED — CONTROLLED STATE`) generating an immutable canonical SHA-256 integrity seal, with UI presentation using verified tamper-evident security badges.
- **Emergency Assistance View**: Immediate access to India's national emergency helpline (`112`) and ambulance contacts with confirmation dialogues.
- **Real-Time Push Updates**: Server-Sent Events (SSE) streaming updates across 5 patient event types and 3 clinician event types with `Last-Event-ID` reconnection replay.
- **Design System & Contrast**: Swiss Clinical Humanist UI theme supporting light and dark modes with WCAG 2.1 AA compliant contrast ratios.

### Outside Current Scope (Future Roadmap)

- **Pan-India Geographic Coverage**: The active directory, range, and clinic listings are currently deployed exclusively for Mumbai. Expanding live clinical listings to other Indian cities, districts, and states (Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, tier-2/tier-3 cities, and rural health centers) via location-based mapping is planned as a modular extension.
- **Financial Transactions**: In-app payment gateways, billing collections, and health insurance claim processing.
- **Live Telemedicine Video**: WebRTC-based video or audio calls between patients and doctors.
- **Automated Emergency Dispatch**: Automatic GPS dispatch of municipal ambulances or emergency vehicles without user confirmation.
- **Official Government EHR Integration**: Integration with the Ayushman Bharat Digital Mission (ABDM) or external hospital HL7/FHIR servers.
- **Real Doctor Directory**: The 52 doctors are realistic synthetic profiles created for testing and demonstration; they do not represent real licensed clinicians.

---

## 5. User Roles

LifeLink defines two distinct user roles, each operating in an isolated environment with dedicated session cookies:

### 1. Patient (`role: "user"`)
A patient is any individual seeking medical triage, specialist discovery, or health management.
- **Registration & Login**: Signs up natively with email and password or authenticates using Google OAuth.
- **Symptom Assessment**: Inputs symptoms, duration, age, gender, and preexisting conditions to receive non-diagnostic guidance.
- **Doctor Discovery**: Searches 52 specialists by station, railway line, medical discipline, or keyword, and views clinic locations on an interactive map.
- **Appointments**: Books consultations, selects specific 30-minute time slots, views booking status, and cancels appointments.
- **Personal Records**: Manages medicine schedules, updates blood group and allergy records, and reviews doctor-issued prescriptions.
- **Session Cookie**: Managed via `app_session_id`.

### 2. Doctor (`role: "doctor"`)
A clinician operating from an accredited clinic or hospital workstation.
- **Workstation Login**: Signs in using verified institutional credentials (`@lifelink.com` or `@accounts.lifelink.test`).
- **Dashboard & Queue**: Views upcoming visits, completed consultation totals, pending patient requests, and specialty-relevant triage summaries.
- **Appointment Lifecycle**: Reviews requested appointments, confirms bookings, marks visits completed, or cancels appointments.
- **Patient Roster**: Views detailed medical profiles, chronic conditions, and allergy histories for patients with active bookings.
- **Prescription Lifecycle & Sealing**: Authors draft prescriptions with medication line items, dosages, and instructions (`UNSIGNED / CONTROLLED WORKSPACE`), then explicitly executes the dedicated signing mutation to seal the record with an immutable SHA-256 integrity reference (`SIGNED — CONTROLLED STATE`).
- **Session Cookie**: Managed via `doctor_session_id`.

---

## 6. Main Features

| Feature | User Role | Description |
|:---|:---:|:---|
| **Workspace Selector** | Public | Initial entry gateway allowing users to choose between the Patient Portal and Doctor Workstation. |
| **Native Authentication** | Both | Secure sign-up and login utilizing Scrypt password hashing with individual random salts and constant-time equality checks. |
| **Google OAuth 2.0** | Patient | Alternative authentication flow using Google identity with CSRF nonce verification and role isolation. |
| **5-Layer AI Triage** | Patient | Symptom evaluation evaluating biological plausibility, deterministic emergency overrides, pediatric safeguards, and structured output. |
| **Specialist Finder** | Patient | Directory search filtering by 19 stations, 3 rail lines, and 12 specialties with Leaflet map markers. |
| **Appointment Booking** | Both | Doctor-specific consultation scheduling with active-slot concurrency protection and status management. |
| **Medicine Cabinet** | Patient | Virtual medicine cabinet tracking dosage, administration frequency, refill quantity, and expiration dates. |
| **Health Passport** | Patient | Digital emergency ID recording blood group, allergies, chronic conditions, and emergency contact details. |
| **Digital Prescriptions** | Both | Two-stage prescription authoring (unsigned draft $\rightarrow$ explicit digital signing mutation) with tamper-evident SHA-256 cryptographic sealing and secure verification badges. |
| **Emergency SOS Hub** | Patient | Quick-access emergency protocol with explicit user confirmation for dialing national emergency (`112`) and ambulance services. |
| **Realtime Event Stream** | Both | Server-Sent Events (SSE) pushing database changes to connected clients with automatic reconnection replay. |
| **Swiss Clinical Humanist UI** | Both | High-contrast, clean medical interface with full light and dark mode parity. |

---

## 7. System Architecture

LifeLink is structured as a modular, client-server web application with end-to-end type safety:

```
                            LIFELINK PLATFORM
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌──────────────────┐                                  ┌──────────────────┐
│  PATIENT PORTAL  │                                  │ DOCTOR WORKSPACE │
│  (React 19 / UI) │                                  │ (React 19 / UI)  │
└────────┬─────────┘                                  └────────┬─────────┘
         │                                                     │
         │   tRPC (Type-Safe RPC over HTTP) + SSE Streams      │
         └──────────────────────────┬──────────────────────────┘
                                    ▼
                      ┌──────────────────────────┐
                      │      EXPRESS SERVER      │
                      │  (Node.js v22+ Runtime)  │
                      └─────────────┬────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   DRIZZLE ORM    │       │  GOOGLE GEMINI   │       │   SSE REALTIME   │
│   (MySQL 8.0+)   │       │  (AI REST API)   │       │   (EventBus)     │
└──────────────────┘       └──────────────────┘       └──────────────────┘
```

### Architectural Flow:
1. **Client Layer**: Built with React 19 and Vite. Navigation is divided into the Patient Portal (`/patient/*`) and Doctor Workspace (`/doctor/*`). Both communicate with the backend through `@trpc/client` and `@tanstack/react-query`.
2. **API Communication**: All remote procedure calls use **tRPC v11**. Procedures are fully typed end-to-end; any change in backend schema is immediately validated by the TypeScript compiler on the frontend.
3. **Server Layer**: An Express 4 application handles HTTP routing, cookie parsing, security headers, raw binary file uploads, and Server-Sent Events.
4. **Data Persistence**: MySQL 8.0 stores relational entities through **Drizzle ORM**, providing compile-time SQL query safety, foreign key constraints, and cascading deletions.
5. **Artificial Intelligence**: Google Gemini evaluates symptom text via backend REST calls. The client never handles AI credentials or keys.
6. **Real-Time Subsystem**: An internal `EventEmitter` broadcasts events to active HTTP streaming connections, refreshing client-side React Query caches without page reloads.

---

## 8. Technology Stack

All dependencies and versions are verified directly against [`package.json`](package.json):

| Layer | Technology | Package Version | Operational Role in LifeLink |
|:---|:---|:---:|:---|
| **Runtime** | Node.js | `>=22.0.0` | Server-side JavaScript runtime environment |
| **Frontend Framework** | React | `^19.2.1` | Declarative user interface library with concurrent rendering |
| **DOM Renderer** | React DOM | `^19.2.1` | Browser DOM rendering engine for React components |
| **Language** | TypeScript | `^5.9.3` | Static type-checking across frontend, backend, and database |
| **Build Tool** | Vite | `^7.3.6` | Development server with Hot Module Replacement (HMR) and production bundler |
| **Server Framework** | Express | `^4.21.2` | HTTP web server, middleware pipeline, and SSE stream manager |
| **API Layer** | tRPC Server / Client | `^11.6.0` | End-to-end type-safe Remote Procedure Call framework |
| **Client State / Cache** | TanStack React Query | `^5.90.2` | Server-state caching, optimistic updates, and background refetching |
| **Database** | MySQL | `8.0+` | ACID-compliant relational database engine |
| **Database Client** | mysql2 | `^3.15.0` | High-performance MySQL driver with connection pooling |
| **ORM** | Drizzle ORM | `^0.44.5` | TypeScript ORM with schema declaration and type inference |
| **Database Tooling** | Drizzle Kit | `^0.31.9` | Schema migration generator and interactive database studio |
| **AI Integration** | Google Gemini REST API | `v1beta` | Multimodal LLM accessed via server-side HTTPS endpoints |
| **Input Validation** | Zod | `^4.1.12` | Runtime schema validation for API inputs, forms, and AI outputs |
| **Interactive Maps** | Leaflet / React-Leaflet | `^1.9.4` / `^5.0.0` | Open-source mobile-friendly interactive maps |
| **CSS & Design** | Tailwind CSS | `^4.1.3` | Utility-first CSS engine compiling Swiss Clinical Humanist tokens |
| **UI Components** | Radix UI / Lucide | `^0.453.0` | Accessible UI primitives and clinical icons |
| **Security / Crypto** | Node.js `crypto` | Built-in | Salted Scrypt hashing, SHA-256 signatures, `timingSafeEqual` |
| **JWT / Cookies** | Jose / Cookie | `6.1.0` / `^1.0.2` | Stateless cryptographic JWT signing and cookie serialization |
| **Testing Engine** | Vitest | `^5.0.1` | Unit and integration test runner (247 passing tests, 1 skipped across 33 test files) |
| **Testing Utilities** | React Testing Library | `^16.3.3` | Component interaction testing in a simulated browser DOM |

---

## 9. Complete Repository Structure

```text
LifeLink-Smart-Healthcare-Assistance-Platform/
├── .env                                   # Local runtime environment secrets (git-ignored)
├── .env.example                           # Verified environment variable blueprint
├── .gitignore                             # Git ignore rules for dependencies and builds
├── .prettierignore                        # Prettier exclusion rules
├── .prettierrc                            # Prettier formatting rules (endOfLine: auto)
├── CHANGELOG.md                           # Version release notes (v1.3.0 documented)
├── CONTRIBUTORS.md                        # Project author, contributors & development guidelines
├── LICENSE                                # MIT open-source license
├── README.md                              # Main documentation entry point
├── SECURITY.md                            # Security policies, reporting & controls
├── SYSTEM_DIAGRAMS.md                     # Visual architecture diagrams and ER hierarchy
├── package.json                           # NPM project manifest, scripts & dependencies
├── package-lock.json                      # Pinned dependency lockfile
├── tsconfig.json                          # Main TypeScript compiler configuration
├── tsconfig.node.json                     # Bundler TypeScript configuration
├── vite.config.ts                         # Vite client bundler & API proxy configuration
├── vitest.config.ts                       # Vitest automated test runner configuration
│
├── backend/                               # Backend server source code
│   ├── _core/                             # Core server infrastructure
│   │   ├── context.ts                     # tRPC context extractor (reads dual cookies)
│   │   ├── cookies.ts                     # HTTP-only cookie serialization utilities
│   │   ├── env.ts                         # Environment variable parser & validator
│   │   ├── index.ts                       # Express HTTP server bootstrap & route mounting
│   │   ├── systemRouter.ts                # System healthcheck procedures
│   │   ├── trpc.ts                        # Procedure builders (public, protected, doctor)
│   │   └── vite.ts                        # Static asset & Vite development middleware
│   ├── ai/                                # AI symptom evaluation subsystem
│   │   ├── assessmentService.ts           # 5-layer triage pipeline & Gemini integration
│   │   ├── assessmentService.test.ts      # 54 unit tests for triage validation
│   │   └── assessment.validation.test.ts  # Input validation schema tests
│   ├── auth/                              # Authentication & authorization logic
│   │   ├── auth.logout.test.ts            # Logout procedure tests
│   │   ├── authUtil.ts                    # JWT creation, verification & cookie handling
│   │   ├── doctorAuth.ts                  # Clinician authentication & password resets
│   │   ├── doctorAuth.test.ts             # Clinician login & credential tests
│   │   ├── nativePatientAuth.ts           # Native patient Scrypt hashing & verification
│   │   ├── nativePatientAuth.test.ts      # Scrypt hashing and timingSafeEqual tests
│   │   ├── providerAuth.ts                # Google OAuth 2.0 implementation
│   │   ├── providerAuth.test.ts           # OAuth role separation tests
│   │   ├── security.idor.test.ts          # IDOR boundary protection tests
│   │   └── simultaneousAuth.test.ts       # Concurrent patient/doctor session tests
│   ├── db.ts                              # Drizzle SQL queries & relational database helpers
│   ├── discovery/                         # Doctor directory & spatial discovery
│   │   ├── mockDoctorDirectory.ts         # Directory of 52 Mumbai railway doctors
│   │   └── mockDoctorDirectory.test.ts    # Station coverage & GP guarantee tests
│   ├── realtime/                          # Server-Sent Events streaming subsystem
│   │   ├── eventBus.ts                    # Node EventEmitter for patient/doctor events
│   │   ├── patientRealtime.ts             # Express SSE route handler & replay logic
│   │   ├── patientRealtime.test.ts        # SSE connection management tests
│   │   └── security.realtime.test.ts      # Realtime tenant isolation & listener tests
│   ├── routers/                           # Domain tRPC sub-routers
│   │   ├── doctor.ts                      # Clinician workspace endpoints & prescriptions
│   │   ├── doctor.test.ts                 # Doctor router integration tests
│   │   └── patient.ts                     # Patient appointments, medicines, passport
│   ├── appointmentLifecycle.test.ts       # 26 appointment lifecycle integration tests
│   ├── emergencyContact.validation.test.ts# Emergency contact validation tests
│   ├── geminiKey.test.ts                  # Gemini credential integration tests
│   ├── healthPassport.test.ts             # Health passport CRUD tests
│   ├── medicine.test.ts                   # Medicine cabinet tests
│   ├── prescriptionLifecycle.test.ts      # Digital prescription signature tests
│   ├── profilePhoto.ts                    # Avatar upload endpoint with magic bytes check
│   ├── profilePhoto.test.ts               # Profile photo validation tests
│   ├── routers.ts                         # Master appRouter combining all sub-routers
│   ├── storage.ts                         # Local disk / S3 asset storage adapter
│   └── syntheticDoctor.ts                 # Synthetic doctor metadata helpers
│
├── database/                              # Database layer
│   ├── drizzle.config.ts                  # Drizzle ORM configuration & database URL
│   ├── schema.ts                          # 14 MySQL relational table definitions
│   ├── seed_doctors.sql                   # Standalone SQL seed script for 52 doctors
│   └── migrations/                        # Versioned SQL migration files
│
├── frontend/                              # Frontend client source code
│   ├── index.html                         # HTML entry page
│   ├── public/                            # Static public assets
│   │   ├── favicon.ico                    # Application favicon
│   │   └── assets/branding/               # Official brand icons and logo lockups
│   └── src/                               # React source tree
│       ├── App.tsx                        # Master React Router mapping
│       ├── main.tsx                       # React 19 DOM entry & provider pipeline
│       ├── index.css                      # Swiss Clinical Humanist CSS tokens
│       ├── components/                    # Shared reusable UI components
│       │   ├── Map.tsx                    # Generic Leaflet map component
│       │   ├── MumbaiDoctorMap.tsx        # Specialized Mumbai doctor map
│       │   ├── brand/                     # LifeLink logo & loading indicators
│       │   ├── layout/                    # Layout shells (AppShell, DoctorAppShell)
│       │   └── ui/                        # UI primitives (Button, Card, Input, Popup)
│       ├── context/                       # React context (ThemeContext for dark mode)
│       ├── features/                      # Domain feature modules
│       │   ├── entry/                     # WorkspaceSelector, Login, Register
│       │   ├── patient/                   # Patient feature views
│       │   │   ├── Appointments/          # Patient appointment booking & history
│       │   │   ├── Assessment/            # AI symptom triage interface
│       │   │   ├── Dashboard/             # Patient clinical summary dashboard
│       │   │   ├── Emergency/             # Emergency SOS protocol & hotline dialer
│       │   │   ├── HealthPassport/        # Medical ID, blood group, allergies
│       │   │   ├── Medicines/             # Medicine cabinet & schedule tracker
│       │   │   ├── Prescriptions/         # Patient prescription archive
│       │   │   ├── Profile/               # Profile settings & photo upload
│       │   │   ├── Settings/              # App appearance & notifications
│       │   │   └── Specialists/           # Transit rail specialist directory
│       │   └── doctor/                    # Clinician feature views
│       │       ├── Appointments/          # Clinician appointment management
│       │       ├── Assessments/           # Triage assessments review
│       │       ├── Consultations/         # Clinical consultation workspace
│       │       ├── Dashboard/             # Doctor workstation overview
│       │       ├── Patients/              # Patient roster & medical history view
│       │       ├── Prescriptions/         # Digital prescription authoring
│       │       ├── Profile/               # Doctor credentials view
│       │       ├── ResetPassword.tsx      # Clinician password recovery
│       │       └── Settings/              # Clinician workstation preferences
│       ├── hooks/                         # Custom React hooks (inactivity, SSE)
│       └── lib/                           # Utility libraries (trpc, auth, formatters)
│
├── scripts/                               # Maintenance & operational scripts
│   ├── clear-users.ts                     # Clears test patient records; keeps doctors
│   ├── delete-user.ts                     # Selectively deletes a single user by email
│   ├── dev.mjs                            # Development runner (starts backend & frontend)
│   ├── dev.test.ts                        # Development runner tests
│   ├── generate-sql-seed.ts               # Generates standalone seed_doctors.sql
│   ├── init-db.ts                         # Creates 'lifelink' database in MySQL
│   ├── list-doctor-credentials.ts         # Lists generated clinician work credentials
│   ├── seed-doctors.ts                    # Seeds doctors using Drizzle ORM
│   └── sync-doctors.ts                    # Synchronizes 52 doctors into MySQL
│
└── shared/                                # Isomorphic shared domain code
    ├── _core/errors.ts                    # Shared error hierarchy
    ├── biologicalValidation.ts            # Biological consistency rules (male pregnancy)
    ├── const.ts                           # Constants, cookies, 12 doctor specialties
    ├── mumbaiRailNetwork.ts               # Stations & corridors for Mumbai railway
    ├── mumbaiStationCoordinates.ts        # Calibrated GPS coordinates for 19 stations
    └── types.ts                           # Isomorphic type re-exports
```

---

## 10. Folder-by-Folder Guide

### `backend/`
- **Location**: `backend/`
- **Purpose**: Contains the server-side application logic, database query methods, API routes, authentication pipelines, and AI evaluation services.
- **Used by**: Node.js runtime when executing `npm run dev` or running the production bundle in `dist/index.js`.

### `backend/_core/`
- **Location**: `backend/_core/`
- **Purpose**: Sets up the Express framework, cookie parsing, environment variables, tRPC procedure builders, and Vite production serving middleware.
- **Used by**: All backend routers and API procedures.

### `backend/ai/`
- **Location**: `backend/ai/`
- **Purpose**: Implements the 5-layer clinical triage pipeline, Google Gemini API communication, biological validation integration, and offline fallback algorithms.
- **Used by**: `backend/routers.ts` through the `assessment.analyze` mutation.

### `backend/auth/`
- **Location**: `backend/auth/`
- **Purpose**: Handles user authentication, Scrypt password hashing, session JWT signing, Google OAuth 2.0 handshakes, and IDOR access validation.
- **Used by**: Patient authentication, clinician workstation authentication, and context extraction.

### `backend/discovery/`
- **Location**: `backend/discovery/`
- **Purpose**: Maintains the directory of 52 verified Mumbai railway doctors, station localities, and query filtering logic.
- **Used by**: `patientDiscoveryRouter` and doctor workstation initialization.

### `backend/realtime/`
- **Location**: `backend/realtime/`
- **Purpose**: Implements the in-memory event bus and Server-Sent Events (SSE) streaming routes (`/api/realtime/patient` and `/api/realtime/doctor`).
- **Used by**: Express server entry point and tRPC mutation procedures to notify clients of database changes.

### `backend/routers/`
- **Location**: `backend/routers/`
- **Purpose**: Defines domain-specific tRPC sub-routers for patients (`patient.ts`) and clinicians (`doctor.ts`).
- **Used by**: `backend/routers.ts` to assemble the master `appRouter`.

### `database/`
- **Location**: `database/`
- **Purpose**: Houses the Drizzle ORM configuration, the 14-table relational database schema, migration files, and SQL seed scripts.
- **Used by**: Drizzle Kit, backend database client (`backend/db.ts`), and setup scripts.

### `frontend/`
- **Location**: `frontend/`
- **Purpose**: Contains all client-side React 19 source code, stylesheets, static images, and the Vite configuration.
- **Used by**: Web browsers to render the user interface.

### `frontend/src/components/`
- **Location**: `frontend/src/components/`
- **Purpose**: Houses reusable UI components, navigation shells (`AppShell`, `DoctorAppShell`), layout bentos, branding indicators, and Leaflet map components.
- **Used by**: All feature views across the Patient Portal and Doctor Workspace.

### `frontend/src/features/`
- **Location**: `frontend/src/features/`
- **Purpose**: Contains domain-specific page views organized by role: entry views (`entry/`), patient views (`patient/`), and clinician views (`doctor/`).
- **Used by**: `frontend/src/App.tsx` through React Router route declarations.

### `frontend/src/hooks/`
- **Location**: `frontend/src/hooks/`
- **Purpose**: Custom React hooks for the 5-minute inactivity timer, patient real-time SSE subscriptions, and doctor real-time SSE subscriptions.
- **Used by**: Layout shells and interactive pages.

### `scripts/`
- **Location**: `scripts/`
- **Purpose**: Operational CLI scripts for database initialization, doctor directory synchronization, test data cleanup, user deletion, and the dual-server development runner.
- **Used by**: Developers and examiners executing `npm run` maintenance commands.

### `shared/`
- **Location**: `shared/`
- **Purpose**: Isomorphic TypeScript modules executed by both the browser and Node.js server, including railway station lists, biological validation keywords, and shared constants.
- **Used by**: Both `frontend/` and `backend/` source trees to ensure identical validation and mathematical calculations.

---

## 11. File-by-File Technical Guide

| File Path | Main Responsibility | Used By | Important Logic & Behavior |
|:---|:---|:---|:---|
| [`backend/_core/index.ts`](backend/_core/index.ts) | Master server entry | Node.js | Scans ports starting at 4000, initializes Express, configures 50MB body parsers, mounts SSE and OAuth routes, and serves the static frontend in production. |
| [`backend/_core/context.ts`](backend/_core/context.ts) | Request context builder | tRPC procedures | Parses incoming cookies, verifies `app_session_id` and `doctor_session_id`, and attaches authenticated `user`, `patientUser`, or `doctor` objects to the request context. |
| [`backend/_core/trpc.ts`](backend/_core/trpc.ts) | Procedure definitions | Routers | Exports `publicProcedure`, `protectedProcedure` (requires patient authentication), and `doctorProcedure` (requires clinician authentication). |
| [`backend/routers.ts`](backend/routers.ts) | Master tRPC router | Express / Client | Combines all domain sub-routers (`patientAuth`, `doctorAuth`, `doctorWorkspace`, `patientProfile`, `patientAppointment`, `patientMedicine`, `assessment`, etc.) into `appRouter`. |
| [`backend/db.ts`](backend/db.ts) | Database access layer | Routers / Services | Encapsulates all Drizzle SQL queries, foreign key joins, transaction blocks, and entity mappings. |
| [`backend/ai/assessmentService.ts`](backend/ai/assessmentService.ts) | Clinical triage engine | `assessment.analyze` | Implements the 5-layer triage pipeline, biological checking, emergency pattern matching, Google Gemini Flash REST calls, and offline fallback mapping. |
| [`backend/auth/nativePatientAuth.ts`](backend/auth/nativePatientAuth.ts) | Patient password hashing | Patient auth | Generates a 16-byte random salt and hashes passwords using Node.js `scrypt` (64-byte key length). Verifies passwords using `crypto.timingSafeEqual`. |
| [`backend/auth/doctorAuth.ts`](backend/auth/doctorAuth.ts) | Clinician auth router | Doctor workstation | Handles clinician login, session cookie generation, and administrative credential resets requiring the master provisioning code. |
| [`backend/discovery/mockDoctorDirectory.ts`](backend/discovery/mockDoctorDirectory.ts) | Specialist catalog | Discovery & Booking | Defines 52 verified Mumbai railway doctor profiles across 19 stations, ensuring at least 1 General Practitioner per station. |
| [`backend/realtime/eventBus.ts`](backend/realtime/eventBus.ts) | In-memory event broker | Backend mutations | Uses Node's `EventEmitter` to publish and subscribe to user-scoped and doctor-scoped real-time notifications. |
| [`backend/realtime/patientRealtime.ts`](backend/realtime/patientRealtime.ts) | SSE streaming route | Express (`/api/realtime`) | Maintains HTTP streaming connections, formats SSE frames, sends 15-second heartbeat pings, and replays missed events based on `Last-Event-ID`. |
| [`backend/profilePhoto.ts`](backend/profilePhoto.ts) | Avatar upload handler | Express (`/api/...`) | Accepts binary image payloads up to 2MB, validates magic byte signatures for JPEG, PNG, and WebP, and checks `x-lifelink-request` CSRF headers. |
| [`database/schema.ts`](database/schema.ts) | Database schema | Drizzle ORM | Declares 14 MySQL relational tables with foreign keys, indexes, and type inference exports. |
| [`frontend/src/App.tsx`](frontend/src/App.tsx) | Master frontend router | React 19 root | Declares all client-side routes, code-splits feature modules using `React.lazy`, and wraps views in role-specific navigation shells. |
| [`frontend/src/main.tsx`](frontend/src/main.tsx) | React DOM entry | Browser | Initializes the TanStack Query client, configures the tRPC HTTP batch link with SuperJSON, and mounts the React root under `ThemeProvider`. |
| [`frontend/src/index.css`](frontend/src/index.css) | Global stylesheet | Frontend | Defines the Swiss Clinical Humanist CSS tokens, typography, dark mode color variables, and responsive layout utilities. |
| [`shared/biologicalValidation.ts`](shared/biologicalValidation.ts) | Biological validation | Frontend & Backend | Analyzes symptom text for biological contradictions (such as pregnancy symptoms entered for male profiles) before invoking AI. |
| [`shared/const.ts`](shared/const.ts) | Shared constants | Frontend & Backend | Declares cookie names (`app_session_id`, `doctor_session_id`), timeouts, and the 12 clinical specialties. |
| [`shared/mumbaiRailNetwork.ts`](shared/mumbaiRailNetwork.ts) | Rail transit stations | Discovery & Maps | Defines suburban rail corridors and station lists across the Western, Central, and Harbour lines. |
| [`scripts/dev.mjs`](scripts/dev.mjs) | Development runner | Terminal (`npm run dev`) | Finds an available port (4000-4004), launches the Express server, injects `VITE_API_PORT`, and starts the Vite development server concurrently. |
| [`scripts/sync-doctors.ts`](scripts/sync-doctors.ts) | Doctor sync script | Terminal (`npm run ...`) | Verifies that all 52 Mumbai railway doctors exist in MySQL with valid Scrypt credential hashes, creating any missing records idempotently. |

---

## 12. Frontend Architecture & UI Design System

The LifeLink frontend is designed around the **Swiss Clinical Humanist** design philosophy. It balances high clinical legibility with accessible, modern web interfaces:

- **Typography**: Uses modern sans-serif typography (`Inter`, system UI font stacks) with tabular numeric alignment for medical metrics, dates, and dosages.
- **Curated Medical Palette**:
  - **Clinical Teal & Cyan**: Primary interactive elements (`#0F766E`, `#0284C7`).
  - **Emergency Coral/Red**: Immediate triage warnings and emergency buttons (`#DC2626`, `#EF4444`).
  - **Success Emerald**: Confirmed appointments and taken medicines (`#059669`, `#10B981`).
  - **Neutral Surfaces**: Clean medical white/slate in light mode; high-contrast deep slate/charcoal in dark mode.
- **Dark Mode Contrast Parity**: Dark mode uses curated dark slate backgrounds (`#0F172A`, `#1E293B`) with high-contrast text (`#F8FAFC`, `#E2E8F0`) to ensure all patient data and doctor queues exceed the WCAG 2.1 AA minimum contrast ratio of 4.5:1.
- **Layout Shells**:
  - `AppShell.tsx`: Wraps patient views with a persistent header, mobile navigation drawer, theme toggle, and 5-minute inactivity monitor.
  - `DoctorAppShell.tsx`: Wraps clinician views with a clinical workstation navigation bar, status indicator, and quick sign-out control.

---

## 13. Patient Portal Walkthrough

The Patient Portal provides an integrated interface for managing health journeys across Mumbai:

1. **Dashboard (`/patient/dashboard`)**: Displays a personalized overview showing upcoming confirmed appointments, scheduled medications for the day, recent AI symptom checks, and quick-action navigation cards.
2. **AI Health Assessment (`/patient/assessment`)**: A multi-step symptom checker where patients input their current symptoms, age, gender, duration, and chronic conditions. The system runs client-side biological validation, executes the 5-layer triage pipeline, and displays the urgency level, clinical reasoning, guidance, and a 1-click button to find matching specialists.
3. **Specialist Finder (`/patient/specialists`)**: An interactive directory of 52 verified Mumbai railway doctors. Patients can filter by station (e.g. Dadar, Andheri, CSMT), railway corridor (Western, Central, Harbour), and clinical specialty. An interactive Leaflet map shows clinic pins and calculated walking/transit distances from the station.
4. **Appointments (`/patient/appointments`)**: Allows patients to select an available future 30-minute time slot for their chosen specialist. Shows active bookings with statuses (`Requested`, `Pending`, `Confirmed`, `Completed`, `Cancelled`) and allows instant cancellation.
5. **Medicine Cabinet (`/patient/medicines`)**: A virtual medicine cabinet where patients record daily medications, dosage amounts, time schedules (e.g., "Morning & Evening"), remaining pill counts, and expiration dates.
6. **Health Passport (`/patient/health-passport`)**: A digital medical passport storing blood group, contact phone, uploaded profile photo, verified allergies, and chronic conditions.
7. **Digital Prescriptions (`/patient/prescriptions`)**: Displays official prescriptions issued by assigned clinicians with active status badges (`SIGNED — CONTROLLED STATE` vs `UNSIGNED / CONTROLLED WORKSPACE`), itemized medication lines, dosage instructions, and tamper-evident cryptographic verification indicators.
8. **Emergency Hub (`/patient/emergency`)**: Rapid emergency assistance providing direct links to India's national emergency number (`112`) and ambulance helplines, complete with confirmation dialogs to prevent accidental calls.
9. **Profile & Settings (`/patient/profile`, `/patient/settings`)**: Account management interface for uploading avatar photos (validated via binary magic bytes), changing account passwords, executing permanent account deletion (with cascading database removal), and toggling dark/light theme preferences.

---

## 14. Doctor Workspace Walkthrough

The Doctor Workspace is a focused clinical environment designed for healthcare professionals:

1. **Clinician Authentication (`/doctor/login`)**: Workstation login accepting official `@lifelink.com` credentials. Sessions are stored in a dedicated `doctor_session_id` cookie.
2. **Workstation Dashboard (`/doctor/dashboard`)**: Displays key clinical operational metrics: total completed consultations, pending requests requiring review, upcoming scheduled appointments for the day, and recent triage assessments submitted for the doctor's specialty.
3. **Appointments Queue (`/doctor/appointments`)**: A triage queue showing all appointment requests. Clinicians can accept bookings (`Confirmed`), mark visits finished (`Completed`), or cancel requests with real-time push updates sent to the patient's phone.
4. **Patient Roster (`/doctor/patients`)**: Lists all patients who have booked consultations with this clinician. Clicking a patient opens their detailed medical record (`/doctor/patients/:id`).
5. **Patient Detail View (`/doctor/patients/:id`)**: Displays the patient's Emergency Health Passport (blood group, allergies, chronic conditions) and past consultation history. **Enforces IDOR security**: doctors can only view patients who have an active or historical appointment with them.
6. **Consultation Workspace (`/doctor/consultation`)**: A clinical examination workspace where doctors record consultation notes and initiate prescriptions.
7. **Digital Prescription Lifecycle & Sealing (`/doctor/prescriptions`)**: Clinicians author multi-item prescriptions by specifying medication names, dosages, and administration instructions. Saving as a draft invokes `prescriptions.create`, maintaining the record in `UNSIGNED / CONTROLLED WORKSPACE` with a clear status indicator. Choosing **Sign & Seal** triggers the explicit `prescriptions.sign` mutation, which verifies clinician authorization, transitions the status to `SIGNED — CONTROLLED STATE`, generates a canonical SHA-256 integrity seal, and emits an instant Server-Sent Event (SSE) to the patient's portal.
8. **Credential Setup & Reset (`/doctor/reset`)**: Administrative tool allowing clinicians to reset workstation passwords using the administrative master secret code (`LIFELINK_DEMO_DOCTOR_ACCESS_CODE`).

### 14.1 Clinician Workstation Login Credentials (Mumbai Medical Directory)

LifeLink seeds **52 verified clinician workstations** across the Western, Central, and Harbour railway corridors of the Mumbai Metropolitan Region (MMR). These accounts are permanently synchronized in the database (via `scripts/sync-doctors.ts` and `database/seed_doctors.sql`) to enable comprehensive clinical testing without requiring external healthcare infrastructure.

#### 🔑 Deterministic Credential Formula
To make local evaluation and grading seamless, all clinician logins follow an institutional pattern:
- **Workstation Login URL**: `http://localhost:5173/doctor/login` (or `/doctor/login` in production)
- **Institutional Email**: `<corridor>-<specialty-slug>-<station-slug>@lifelink.com`
- **Workstation Password**: `<specialty-slug>.<station-slug>@lifelink`
- **Master Admin Reset Code**: `lifelink-controlled-clinician-secret-key-2026` (used on `/doctor/reset`)

> [!NOTE]
> The backend authentication resolver (`backend/db.ts:getSyntheticDoctorCredentialByEmail`) accepts institutional emails (`@lifelink.com`), test domain aliases (`@accounts.lifelink.test`), and short usernames (e.g. `central-cardiology-csmt`), automatically mapping them to the clinician's secure Scrypt hash.

#### 📋 Quick-Start Clinician Credentials (All 12 Medical Specialties)

The following table provides verified, ready-to-test logins representing every medical specialty and transit corridor:

| Medical Specialty | Clinician Name | Transit Corridor | Station Anchor | Affiliated Medical Facility | Workstation Email | Primary Password |
|:---|:---|:---:|:---:|:---|:---|:---|
| **Cardiology** | Dr. Rajesh V. Varma, MD, DM | Central | CSMT | Aura Heart & Vascular Pavilion | `central-cardiology-csmt@lifelink.com` | `cardiology.csmt@lifelink` |
| **Cardiology** | Dr. Jayant V. Bhatt, MD, DM | Western | Andheri | Veritas Cardiac & Rhythm Institute | `western-cardiology-andheri@lifelink.com` | `cardiology.andheri@lifelink` |
| **General Practice** | Dr. Shalini K. Pillai, MBBS | Western | Dadar | Zenith Clinical Hub | `western-general-practice-dadar@lifelink.com` | `generalpractice.dadar@lifelink` |
| **General Practice** | Dr. Aarav N. Kulkarni, MBBS | Central | CSMT | Fort Heritage Health Pavilion | `central-general-practice-csmt@lifelink.com` | `generalpractice.csmt@lifelink` |
| **Pediatrics** | Dr. Deepa V. Nair, MD, DCH | Western | Andheri | Veritas Child Health & Neonatal Care | `western-pediatrics-andheri@lifelink.com` | `pediatrics.andheri@lifelink` |
| **Dermatology** | Dr. Rahul E. Tambe, MD, DNB | Central | Ghatkopar | MetroHealth Derma & Skin Pavilion | `central-dermatology-ghatkopar@lifelink.com` | `dermatology.ghatkopar@lifelink` |
| **Orthopedics** | Dr. Sunita K. Jagtap, MS, MCh | Western | Dadar | Zenith Orthopedic & Trauma Centre | `western-orthopedics-dadar@lifelink.com` | `orthopedics.dadar@lifelink` |
| **Orthopedics** | Dr. Shrikant R. Gokhale, MS | Harbour | Panvel | Pioneer Bone & Joint Pavilion | `harbour-orthopedics-panvel@lifelink.com` | `orthopedics.panvel@lifelink` |
| **Neurology** | Dr. Rameshwar T. Gaikwad, MD, DM | Central | Thane | Apex Horizon Neuro-Care Institute | `central-neurology-thane@lifelink.com` | `neurology.thane@lifelink` |
| **Ophthalmology** | Dr. Milind S. Chitnis, MS, FICO | Western | Goregaon | PulsePoint Eye Care Institute | `western-ophthalmology-goregaon@lifelink.com` | `ophthalmology.goregaon@lifelink` |
| **Gastroenterology** | Dr. Anil M. Kumar, MD, DM | Western | Borivali | Trinity Digestive Health Centre | `western-gastroenterology-borivali@lifelink.com` | `gastroenterology.borivali@lifelink` |
| **Psychiatry** | Dr. Siddharth P. Merchant, MD | Harbour | Sewri | Solace Mind Wellness Institute | `harbour-psychiatry-sewri@lifelink.com` | `psychiatry.sewri@lifelink` |
| **Endocrinology** | Dr. Pooja S. Chawla, MD, DM | Harbour | Chembur | PrimeCare Diabetes & Hormone Institute | `harbour-endocrinology-chembur@lifelink.com` | `endocrinology.chembur@lifelink` |
| **Pulmonology** | Dr. Sameer K. Merchant, MD, DM | Harbour | Vashi | Oasis Respiratory & Chest Institute | `harbour-pulmonology-vashi@lifelink.com` | `pulmonology.vashi@lifelink` |
| **Gynecology** | Dr. Priya R. Nadkarni, MD, DGO | Central | Dombivli | Summit Care Women & Child Hospital | `central-gynecology-dombivli@lifelink.com` | `gynecology.dombivli@lifelink` |

#### 📂 Complete Directory of All 52 Seeded Clinicians
<details>
<summary><strong>Click to expand full 52-Clinician Roster across all Mumbai Suburban Stations</strong></summary>

| # | Clinician Name | Specialty | Station | Corridor | Hospital / Facility (Locality) | Workstation Email | Password |
|:---:|:---|:---|:---:|:---:|:---|:---|:---|
| 1 | Dr. Aarav N. Kulkarni, MBBS | General Practice | CSMT | Central | Fort Heritage Health Pavilion (Fort Medical Enclave) | `central-general-practice-csmt@lifelink.com` | `generalpractice.csmt@lifelink` |
| 2 | Dr. Ishaan M. Deshmukh, MBBS | General Practice | Ghatkopar | Central | MetroHealth Family Centre (Ghatkopar East Health District) | `central-general-practice-ghatkopar@lifelink.com` | `generalpractice.ghatkopar@lifelink` |
| 3 | Dr. Ananya P. Joshi, MBBS | General Practice | Bhandup | Central | Silverline Community Medical Hub (Bhandup West Medical Park) | `central-general-practice-bhandup@lifelink.com` | `generalpractice.bhandup@lifelink` |
| 4 | Dr. Rohan K. Sengupta, MBBS, MD | General Practice | Thane | Central | Apex Horizon Polyclinic (Thane West Civic Medical Hub) | `central-general-practice-thane@lifelink.com` | `generalpractice.thane@lifelink` |
| 5 | Dr. Tanvi R. Kirloskar, MBBS | General Practice | Mulund | Central | Starlight Clinical Centre (Mulund West Wellness Corridor) | `central-general-practice-mulund@lifelink.com` | `generalpractice.mulund@lifelink` |
| 6 | Dr. Neil P. Somaiya, MBBS | General Practice | Diva Junction | Central | Beacon Hill Community Care (Diva Central Health Enclave) | `central-general-practice-diva@lifelink.com` | `generalpractice.divajunction@lifelink` |
| 7 | Dr. Avantika B. Deshmukh, MBBS | General Practice | Kopar | Central | Novis Suburban Health Sanctuary (Kopar Civic Care District) | `central-general-practice-kopar@lifelink.com` | `generalpractice.kopar@lifelink` |
| 8 | Dr. Kabir A. Mahajan, MBBS | General Practice | Dombivli | Central | Summit Care Medical Centre (Dombivli East Healthcare Hub) | `central-general-practice-dombivli@lifelink.com` | `generalpractice.dombivli@lifelink` |
| 9 | Dr. Meera K. Nambiar, MBBS | General Practice | Thakurli | Central | Crestview Family Health Clinic (Thakurli Township Medical Center) | `central-general-practice-thakurli@lifelink.com` | `generalpractice.thakurli@lifelink` |
| 10 | Dr. Devendra C. Sawant, MBBS, MD | General Practice | Churchgate | Western | Meridian Clinical Pavilion (Marine Lines & Churchgate Boulevard) | `western-general-practice-churchgate@lifelink.com` | `generalpractice.churchgate@lifelink` |
| 11 | Dr. Shalini K. Pillai, MBBS | General Practice | Dadar | Western | Zenith Clinical Hub (Dadar West Medical Square) | `western-general-practice-dadar@lifelink.com` | `generalpractice.dadar@lifelink` |
| 12 | Dr. Prakash J. Menon, MBBS | General Practice | Andheri | Western | Veritas Primary Care Centre (Andheri West Healthcare Hub) | `western-general-practice-andheri@lifelink.com` | `generalpractice.andheri@lifelink` |
| 13 | Dr. Chetan R. Varma, MBBS | General Practice | Goregaon | Western | PulsePoint Health Clinic (Goregaon West Medical Enclave) | `western-general-practice-goregaon@lifelink.com` | `generalpractice.goregaon@lifelink` |
| 14 | Dr. Sneha R. Kulkarni, MBBS | General Practice | Borivali | Western | Trinity Medical Care Pavilion (Borivali West Health Corridor) | `western-general-practice-borivali@lifelink.com` | `generalpractice.borivali@lifelink` |
| 15 | Dr. Pankaj D. Shah, MBBS | General Practice | Sewri | Harbour | Solace Primary Health Institute (Sewri Coastal Medical District) | `harbour-general-practice-sewri@lifelink.com` | `generalpractice.sewri@lifelink` |
| 16 | Dr. Vivek N. Deshpande, MBBS | General Practice | Chembur | Harbour | PrimeCare Medical Institute (Chembur Diamond Garden Sector) | `harbour-general-practice-chembur@lifelink.com` | `generalpractice.chembur@lifelink` |
| 17 | Dr. Rohan T. Bapat, MBBS | General Practice | Vashi | Harbour | Oasis Clinical Pavilion (Vashi Sector 15 Medical Park) | `harbour-general-practice-vashi@lifelink.com` | `generalpractice.vashi@lifelink` |
| 18 | Dr. Preeti S. Saxena, MBBS | General Practice | Nerul | Harbour | Asteria Community Health Center (Nerul Palm Beach Healthcare Zone) | `harbour-general-practice-nerul@lifelink.com` | `generalpractice.nerul@lifelink` |
| 19 | Dr. Alok M. Pandey, MBBS | General Practice | Panvel | Harbour | Pioneer Civic Care Pavilion (Panvel City Wellness Hub) | `harbour-general-practice-panvel@lifelink.com` | `generalpractice.panvel@lifelink` |
| 20 | Dr. Rajesh V. Varma, MD, DM | Cardiology | CSMT | Central | Aura Heart & Vascular Pavilion (Fort Medical Enclave) | `central-cardiology-csmt@lifelink.com` | `cardiology.csmt@lifelink` |
| 21 | Dr. Jayant V. Bhatt, MD, DM | Cardiology | Andheri | Western | Veritas Cardiac & Rhythm Institute (Andheri West Healthcare Hub) | `western-cardiology-andheri@lifelink.com` | `cardiology.andheri@lifelink` |
| 22 | Dr. Reema N. Shetty, MD, DM | Cardiology | Vashi | Harbour | Oasis Advanced Heart Center (Vashi Sector 15 Medical Park) | `harbour-cardiology-vashi@lifelink.com` | `cardiology.vashi@lifelink` |
| 23 | Dr. Rahul E. Tambe, MD, DNB | Dermatology | Ghatkopar | Central | MetroHealth Derma & Skin Pavilion (Ghatkopar East Health District) | `central-dermatology-ghatkopar@lifelink.com` | `dermatology.ghatkopar@lifelink` |
| 24 | Dr. Veena M. Shinde, MD | Dermatology | Churchgate | Western | Meridian Aesthetic & Skin Institute (Marine Lines & Churchgate) | `western-dermatology-churchgate@lifelink.com` | `dermatology.churchgate@lifelink` |
| 25 | Dr. Smita K. Patil, MD | Dermatology | Chembur | Harbour | PrimeCare Cutaneous Care Clinic (Chembur Diamond Garden Sector) | `harbour-dermatology-chembur@lifelink.com` | `dermatology.chembur@lifelink` |
| 26 | Dr. Arvind N. Shenoy, MS | Orthopedics | Bhandup | Central | Silverline Joint & Spine Institute (Bhandup West Medical Park) | `central-orthopedics-bhandup@lifelink.com` | `orthopedics.bhandup@lifelink` |
| 27 | Dr. Sunita K. Jagtap, MS, MCh | Orthopedics | Dadar | Western | Zenith Orthopedic & Trauma Centre (Dadar West Medical Square) | `western-orthopedics-dadar@lifelink.com` | `orthopedics.dadar@lifelink` |
| 28 | Dr. Shrikant R. Gokhale, MS | Orthopedics | Panvel | Harbour | Pioneer Bone & Joint Pavilion (Panvel City Wellness Hub) | `harbour-orthopedics-panvel@lifelink.com` | `orthopedics.panvel@lifelink` |
| 29 | Dr. Rameshwar T. Gaikwad, MD, DM | Neurology | Thane | Central | Apex Horizon Neuro-Care Institute (Thane West Civic Medical Hub) | `central-neurology-thane@lifelink.com` | `neurology.thane@lifelink` |
| 30 | Dr. Kavita M. Joshi, MD, DM | Neurology | Borivali | Western | Trinity Brain & Spine Center (Borivali West Health Corridor) | `western-neurology-borivali@lifelink.com` | `neurology.borivali@lifelink` |
| 31 | Dr. Nitin H. Agrawal, MD, DM | Neurology | Nerul | Harbour | Asteria Neuro-Sciences Pavilion (Nerul Palm Beach Healthcare Zone) | `harbour-neurology-nerul@lifelink.com` | `neurology.nerul@lifelink` |
| 32 | Dr. Deepa V. Nair, MD, DCH | Pediatrics | Andheri | Western | Veritas Child Health & Neonatal Care (Andheri West Healthcare Hub) | `western-pediatrics-andheri@lifelink.com` | `pediatrics.andheri@lifelink` |
| 33 | Dr. Farhan K. Mehta, MD | Pediatrics | Mulund | Central | Starlight Pediatric Specialty Center (Mulund West Wellness Corridor) | `central-pediatrics-mulund@lifelink.com` | `pediatrics.mulund@lifelink` |
| 34 | Dr. Swati P. Bhosale, MD | Pediatrics | Vashi | Harbour | Oasis Children's Healthcare Pavilion (Vashi Sector 15 Medical Park) | `harbour-pediatrics-vashi@lifelink.com` | `pediatrics.vashi@lifelink` |
| 35 | Dr. Milind S. Chitnis, MS, FICO | Ophthalmology | Goregaon | Western | PulsePoint Eye Care Institute (Goregaon West Medical Enclave) | `western-ophthalmology-goregaon@lifelink.com` | `ophthalmology.goregaon@lifelink` |
| 36 | Dr. Harish D. Salunkhe, MS | Ophthalmology | CSMT | Central | Fort Heritage Vision & Eye Centre (Fort Medical Enclave) | `central-ophthalmology-csmt@lifelink.com` | `ophthalmology.csmt@lifelink` |
| 37 | Dr. Vandana S. Rao, MS | Ophthalmology | Chembur | Harbour | PrimeCare Advanced Eye Center (Chembur Diamond Garden Sector) | `harbour-ophthalmology-chembur@lifelink.com` | `ophthalmology.chembur@lifelink` |
| 38 | Dr. Anil M. Kumar, MD, DM | Gastroenterology | Borivali | Western | Trinity Digestive Health Centre (Borivali West Health Corridor) | `western-gastroenterology-borivali@lifelink.com` | `gastroenterology.borivali@lifelink` |
| 39 | Dr. Sanjeev B. Kulkarni, MD, DM | Gastroenterology | Thane | Central | Apex Horizon Gastro & Liver Care (Thane West Civic Medical Hub) | `central-gastroenterology-thane@lifelink.com` | `gastroenterology.thane@lifelink` |
| 40 | Dr. Ritu G. Kapoor, MD, DM | Gastroenterology | Sewri | Harbour | Solace Digestive Diseases Pavilion (Sewri Coastal Medical District) | `harbour-gastroenterology-sewri@lifelink.com` | `gastroenterology.sewri@lifelink` |
| 41 | Dr. Siddharth P. Merchant, MD | Psychiatry | Sewri | Harbour | Solace Mind Wellness Institute (Sewri Coastal Medical District) | `harbour-psychiatry-sewri@lifelink.com` | `psychiatry.sewri@lifelink` |
| 42 | Dr. Mahesh A. Bhide, MD | Psychiatry | Dadar | Western | Zenith Behavioral Health Center (Dadar West Medical Square) | `western-psychiatry-dadar@lifelink.com` | `psychiatry.dadar@lifelink` |
| 43 | Dr. Sanjay D. Varma, MD | Psychiatry | Ghatkopar | Central | MetroHealth Mind & Wellbeing Pavilion (Ghatkopar East Health District) | `central-psychiatry-ghatkopar@lifelink.com` | `psychiatry.ghatkopar@lifelink` |
| 44 | Dr. Pooja S. Chawla, MD, DM | Endocrinology | Chembur | Harbour | PrimeCare Diabetes & Hormone Institute (Chembur Diamond Garden) | `harbour-endocrinology-chembur@lifelink.com` | `endocrinology.chembur@lifelink` |
| 45 | Dr. Rohan M. Kirloskar, MD, DM | Endocrinology | Churchgate | Western | Meridian Metabolic Health Center (Marine Lines & Churchgate) | `western-endocrinology-churchgate@lifelink.com` | `endocrinology.churchgate@lifelink` |
| 46 | Dr. Neha V. Paranjpe, MD, DM | Endocrinology | Bhandup | Central | Silverline Endocrine & Thyroid Pavilion (Bhandup West Medical Park) | `central-endocrinology-bhandup@lifelink.com` | `endocrinology.bhandup@lifelink` |
| 47 | Dr. Sameer K. Merchant, MD, DM | Pulmonology | Vashi | Harbour | Oasis Respiratory & Chest Institute (Vashi Sector 15 Medical Park) | `harbour-pulmonology-vashi@lifelink.com` | `pulmonology.vashi@lifelink` |
| 48 | Dr. Malini S. Iyer, MD, DM | Pulmonology | Thane | Central | Apex Horizon Pulmonary Care Centre (Thane West Civic Medical Hub) | `central-pulmonology-thane@lifelink.com` | `pulmonology.thane@lifelink` |
| 49 | Dr. Vikramaditya S. Sengupta, MD | Pulmonology | Andheri | Western | Veritas Chest & Lung Sanctuary (Andheri West Healthcare Hub) | `western-pulmonology-andheri@lifelink.com` | `pulmonology.andheri@lifelink` |
| 50 | Dr. Tarun K. Bansal, MD, DGO | Gynecology | Panvel | Harbour | Pioneer Women Health & Maternity Hospital (Panvel City Wellness Hub) | `harbour-gynecology-panvel@lifelink.com` | `gynecology.panvel@lifelink` |
| 51 | Dr. Gauri N. Tendulkar, MD, DGO | Gynecology | Goregaon | Western | PulsePoint Women's Health Pavilion (Goregaon West Medical Enclave) | `western-gynecology-goregaon@lifelink.com` | `gynecology.goregaon@lifelink` |
| 52 | Dr. Priya R. Nadkarni, MD, DGO | Gynecology | Dombivli | Central | Summit Care Women & Child Hospital (Dombivli East Healthcare Hub) | `central-gynecology-dombivli@lifelink.com` | `gynecology.dombivli@lifelink` |

</details>

#### 🧪 Clinical Evaluation & Testing Scenarios
1. **Testing Consultation Management**:
   - Log into `/doctor/login` using `central-cardiology-csmt@lifelink.com` / `cardiology.csmt@lifelink`.
   - In another browser profile/window, sign in as a patient and book an appointment with **Dr. Rajesh V. Varma** at CSMT.
   - Observe the live appointment queue update instantaneously via SSE (`/api/realtime/doctor`).
2. **Testing Digital Prescription Sealing**:
   - Navigate to `/doctor/prescriptions` while logged in as a clinician.
   - Author prescription items (e.g., *Atorvastatin 20mg* once daily).
   - Click **Sign & Seal Prescriptions** to trigger cryptographic SHA-256 seal generation and transition the status badge to `SIGNED — CONTROLLED STATE`.
3. **Testing IDOR (Insecure Direct Object Reference) Protection**:
   - As a logged-in doctor, attempt to access `/doctor/patients/:id` for a patient ID who does **not** have an active booking with your clinic.
   - The platform strictly enforces authorization boundaries and rejects the request with `403 FORBIDDEN`.

---

## 15. Appointment System & Doctor-Specific Availability

Appointment scheduling in LifeLink enforces strict doctor-level scoping and concurrency protection:

```
[ Patient Requests Slot ]
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ Pre-flight Check: Is scheduled date/time in future?    │
└──────────────────────────┬─────────────────────────────┘
                           │ YES
                           ▼
┌────────────────────────────────────────────────────────┐
│ Doctor Scope Check: Is THIS specific doctor free?      │
│ (Doctor A booked at 10:00 does NOT block Doctor B)     │
└──────────────────────────┬─────────────────────────────┘
                           │ YES (No Conflict)
                           ▼
┌────────────────────────────────────────────────────────┐
│ Insert into patientAppointments                        │
│ Unique Constraint: activeSlotKey = doctorId_timestamp  │
└──────────────────────────┬─────────────────────────────┘
                           │ SUCCESS
                           ▼
┌────────────────────────────────────────────────────────┐
│ Status: "Requested"                                    │
│ SSE Notification dispatched to Doctor Workstation      │
└────────────────────────────────────────────────────────┘
```

### Key Principles of the Appointment Engine:

1. **Doctor-Specific Availability**:
   - Availability is calculated per individual doctor: `doctorId + date + time`.
   - **Example**: If Dr. Sharma (Cardiologist at Dadar) is booked on October 5 at 10:00 AM, that specific slot is marked unavailable for Dr. Sharma. However, Dr. Patil (General Practitioner at Dadar) remains **100% available** at 10:00 AM on the same day.
2. **Concurrency & Double-Booking Protection**:
   - The database enforces an active slot uniqueness constraint using a generated key: `activeSlotKey = doctorId:scheduledAt`.
   - If two patients attempt to book the exact same doctor and time simultaneously, MySQL guarantees that only one transaction succeeds; the second transaction receives an atomic duplicate key error and a friendly conflict notice.
3. **Past Date Rejection**:
   - Any appointment request with a timestamp in the past is rejected during input validation with a clear error: `"Invalid date or time. Please select a future date and time for your appointment."`
4. **Cancellation & Slot Reopening**:
   - When an appointment is cancelled (by either the patient or the clinician), the system sets `activeSlotKey = NULL` and updates `status = "Cancelled"`.
   - This atomically reopens the time slot, allowing other patients to book that slot immediately.
5. **Real-Time Notification Dispatch**:
   - Every booking, status confirmation, and cancellation triggers an internal event that sends an SSE update to both the patient and the clinician in real time.

---

## 16. Relational Database Schema (14 Tables)

LifeLink uses MySQL 8.0 managed via Drizzle ORM ([`database/schema.ts`](database/schema.ts)). Foreign keys enforce referential integrity with cascading deletions:

```
users (Central Identity Registry)
  ├── 1:1 ── patientCredentials (Native email/password auth)
  ├── 1:1 ── syntheticDoctorCredentials (Doctor workstation credentials)
  ├── 1:N ── patientProviderIdentities (Google OAuth links)
  ├── 1:1 ── patientProfiles (Health Passport, blood group, avatar)
  ├── 1:N ── patientEmergencyContacts (Emergency phone contacts)
  ├── 1:N ── patientMedicines (Medicine cabinet items)
  ├── 1:N ── patientAssessments (AI triage history)
  ├── 1:N ── patientAppointments (Doctor bookings)
  ├── 1:N ── patientPrescriptions (Issued digital prescriptions)
  │             └── 1:N ── patientPrescriptionItems (Medication lines)
  ├── 1:N ── patientEvents (Realtime SSE stream for patients)
  ├── 1:N ── doctorEvents (Realtime SSE stream for doctors)
  └── 1:N ── bookingErrors (Audit log of failed booking attempts)
```

### Table Breakdown:

| # | Table Name | Primary Role | Key Columns | Integrity & Constraints |
|:---:|:---|:---|:---|:---|
| 1 | `users` | Central identity table | `id`, `openId`, `name`, `email`, `role`, `loginMethod` | `openId` unique index; default role is `user`. |
| 2 | `patientCredentials` | Native password storage | `id`, `userId`, `email`, `passwordHash` | Foreign key to `users.id` (cascade); `userId` and `email` unique; Scrypt hash format. |
| 3 | `syntheticDoctorCredentials` | Doctor login credentials | `id`, `userId`, `doctorId`, `email`, `passwordHash` | Foreign key to `users.id` (cascade); `doctorId` unique; links catalog to user account. |
| 4 | `patientProviderIdentities` | OAuth external links | `id`, `userId`, `provider`, `subject`, `email` | Composite unique constraint on `(provider, subject)` prevents duplicate OAuth accounts. |
| 5 | `patientProfiles` | Medical ID / Health Passport | `id`, `userId`, `bloodGroup`, `phone`, `avatarKey`, `allergiesJson`, `conditionsJson` | Exactly one profile per user (`userId` unique); stores JSON arrays of allergies and conditions. |
| 6 | `patientEmergencyContacts` | Urgent SOS contacts | `id`, `userId`, `name`, `relationship`, `phone` | Foreign key to `users.id` (cascade); patient can store multiple emergency contacts. |
| 7 | `patientMedicines` | Virtual medicine cabinet | `id`, `userId`, `name`, `dosage`, `frequency`, `schedule`, `quantity`, `expiry` | Foreign key to `users.id` (cascade); tracks active medications, dosages, and schedules. |
| 8 | `patientAssessments` | AI triage record | `id`, `userId`, `symptoms`, `age`, `gender`, `urgency`, `specialty`, `reason`, `guidance` | Foreign key to `users.id` (cascade); records raw inputs and AI triage output. |
| 9 | `patientAppointments` | Doctor consultations | `id`, `userId`, `doctorId`, `scheduledAt`, `status`, `activeSlotKey` | Unique index on `activeSlotKey`; composite index on `(doctorId, scheduledAt, status)`. |
| 10 | `patientPrescriptions` | Official prescriptions | `id`, `userId`, `doctorId`, `issuedAt`, `status`, `clinicalNotes`, `integrityReference` | Foreign key to `users.id` (cascade); status tracks 'UNSIGNED / CONTROLLED WORKSPACE' or 'SIGNED — CONTROLLED STATE'; stores canonical SHA-256 seal upon explicit signing. |
| 11 | `patientPrescriptionItems` | Prescription line items | `id`, `prescriptionId`, `name`, `dosage`, `instructions` | Foreign key to `patientPrescriptions.id` (cascade); deletes automatically if prescription is deleted. |
| 12 | `patientEvents` | Patient SSE backlog | `id`, `userId`, `type`, `entityId`, `createdAt` | Foreign key to `users.id` (cascade); queried for event replay using `Last-Event-ID`. |
| 13 | `doctorEvents` | Doctor SSE backlog | `id`, `doctorId`, `patientUserId`, `type`, `entityId`, `createdAt` | Foreign key to `users.id` (cascade); streams appointment and patient updates to clinicians. |
| 14 | `bookingErrors` | Audit log for bookings | `id`, `userId`, `doctorId`, `attemptedAt`, `errorMessage`, `errorCode` | Audits conflict errors, past-date booking attempts, and system validation failures. |

---

## 17. Backend Server & tRPC API Architecture

The backend runs on Node.js using Express and tRPC v11:

### tRPC Middleware & Procedure Types

- `publicProcedure`: Open endpoints accessible to unauthenticated visitors (e.g., login, registration, doctor discovery search).
- `protectedProcedure`: Requires a valid `app_session_id` cookie. Derives patient identity strictly from `ctx.user.id`. Client-provided IDs are ignored, mitigating IDOR risks.
- `doctorProcedure`: Requires a valid `doctor_session_id` cookie and `role: "doctor"`. Derives clinician identity strictly from `ctx.user.openId`.

### Key API Procedures:

| Domain | Procedure | Type | Input / Purpose |
|:---|:---|:---:|:---|
| `auth` | `auth.me` | Query | Returns currently authenticated user session. |
| `auth` | `auth.logout` | Mutation | Clears session cookie and logs out user. |
| `patientAuth` | `patientAuth.register` | Mutation | Registers a new patient with email, name, and Scrypt-hashed password. (Guarantees email uniqueness globally) |
| `patientAuth` | `patientAuth.login` | Mutation | Authenticates patient credentials and sets `app_session_id` cookie. |
| `patientAuth` | `patientAuth.changePassword` | Mutation | Updates patient password securely using constant-time old password checks and salt regeneration. |
| `patientAuth` | `patientAuth.deleteAccount` | Mutation | Permanently deletes patient account, destroying all health data via cascading DB removals. |
| `doctorAuth` | `doctorAuth.login` | Mutation | Authenticates clinician credentials and sets `doctor_session_id` cookie. |
| `doctorAuth` | `doctorAuth.resetPassword`| Mutation | Resets clinician password using administrative master access code. |
| `assessment` | `assessment.analyze` | Mutation | Submits symptoms to 5-layer triage pipeline and saves assessment. |
| `assessment` | `assessment.list` | Query | Retrieves patient's historical symptom assessments. |
| `patientDiscovery`| `patientDiscovery.search` | Query | Filters 52 doctors by station, specialty, railway line, or keyword. |
| `patientAppointment`| `patientAppointment.list` | Query | Lists patient's appointments with assigned specialist metadata. |
| `patientAppointment`| `patientAppointment.request`| Mutation | Books appointment slot with doctor-specific conflict detection and concurrency key. |
| `patientAppointment`| `patientAppointment.cancel` | Mutation | Cancels patient appointment and reopens time slot. |
| `patientMedicine`| `patientMedicine.list` | Query | Lists all active medicines in patient's cabinet. |
| `patientMedicine`| `patientMedicine.create` | Mutation | Adds a new medication regimen with dosage and schedule. |
| `patientProfile`| `patientProfile.get` | Query | Retrieves patient's complete Emergency Health Passport. |
| `patientProfile`| `patientProfile.update` | Mutation | Updates blood group, phone, allergies, and chronic conditions. |
| `patientPrescription`| `patientPrescription.list` | Query | Retrieves patient's list of issued prescriptions. |
| `patientPrescription`| `patientPrescription.getById` | Query | Retrieves itemized prescription details with clinician info (IDOR protected). |
| `doctorWorkspace`| `doctorWorkspace.dashboard`| Query | Returns clinical statistics, upcoming bookings, and triage counts. |
| `doctorWorkspace`| `doctorWorkspace.appointments.list` | Query | Lists scheduled appointments for the authenticated clinician. |
| `doctorWorkspace`| `doctorWorkspace.appointments.updateStatus` | Mutation | Clinician updates appointment status (`Confirmed`, `Completed`, `Cancelled`). |
| `doctorWorkspace`| `doctorWorkspace.patients` | Query | Lists unique patients who have scheduled appointments with clinician. |
| `doctorWorkspace`| `doctorWorkspace.patientDetail` | Query | Retrieves medical history for an assigned patient (IDOR protected). |
| `doctorWorkspace`| `doctorWorkspace.prescriptions.list` | Query | Lists prescriptions authored by authenticated clinician. |
| `doctorWorkspace`| `doctorWorkspace.prescriptions.getById` | Query | Retrieves itemized prescription details for clinician (IDOR protected). |
| `doctorWorkspace`| `doctorWorkspace.prescriptions.create` | Mutation | Authors unsigned draft prescription in `UNSIGNED / CONTROLLED WORKSPACE`. |
| `doctorWorkspace`| `doctorWorkspace.prescriptions.sign` | Mutation | Explicitly signs and seals prescription, transitioning to `SIGNED — CONTROLLED STATE` with SHA-256 hash. |

---

## 18. Authentication, Authorization & Security Controls

LifeLink incorporates strict security controls to protect sensitive healthcare data:

### 1. Scrypt Password Hashing with Random Salts
- Plaintext passwords are never stored in the database.
- Every password is salted with a cryptographically secure 16-byte random salt (`crypto.randomBytes(16)`).
- The salt and password are processed through Node's native `scrypt` key derivation function with a 64-byte key length (512-bit security).
- Passwords are saved in MySQL in the standard format `salt:hexHash`.
- During login, the entered password is hashed with the stored salt and compared using `crypto.timingSafeEqual` to prevent side-channel timing attacks.

### 2. Dual-Session Cookie Isolation
- Patient and clinician sessions are kept in separate HTTP cookies:
  - Patient Cookie: `app_session_id` (`httpOnly: true`, `sameSite: "lax"`, `secure` in production).
  - Doctor Cookie: `doctor_session_id` (`httpOnly: true`, `sameSite: "lax"`, `secure` in production).
- A user can be signed into a patient account in one tab and a doctor workstation in another tab without session collision or permission leakage.

### 3. Automated 5-Minute Inactivity Session Termination
- The client-side hook (`patientInactivity.ts`) monitors user interaction events: `mousemove`, `keydown`, `mousedown`, `touchstart`, and `scroll`.
- If no interaction occurs for 300,000 milliseconds (5 minutes), the session is automatically terminated.
- The client clears local authentication state, calls the server logout mutation, and redirects the browser to the login screen with an inactivity notice, preventing unauthorized access on unattended hospital terminals.

### 4. Insecure Direct Object Reference (IDOR) Mitigation
- In all patient procedures (`protectedProcedure`), the targeted user ID is derived strictly from the verified session payload (`ctx.user.id`). Client-provided IDs in request bodies are ignored.
- In doctor procedures (`doctorProcedure`), the clinician identity is derived strictly from `ctx.user.openId`.
- Access to patient records and medical passport data requires an active, verified appointment linking the patient to the requesting clinician.

### 5. Google OAuth 2.0 with CSRF Protection
- During OAuth initialization, a cryptographically random 32-byte state and nonce are generated and signed into a short-lived (10-minute) `httpOnly` cookie (`lifelink_google_oauth_state`).
- Upon callback from Google, the state parameter is verified using constant-time comparison.
- OAuth is restricted to the patient domain (`resolveProviderPatient`). Clinician accounts cannot authenticate via OAuth, preventing unauthorized elevation into the Doctor Workspace.

### 6. Binary Magic Byte Upload Validation
- When patients upload profile photos via `/api/patient/profile-photo`, the server inspects the raw binary file signature ("magic bytes"):
  - JPEG: `FF D8 FF`
  - PNG: `89 50 4E 47 0D 0A 1A 0A`
  - WebP: `RIFF .... WEBP`
- Files exceeding 10 MB are rejected. Requests require a custom `x-lifelink-request: profile-photo` header to prevent Cross-Site Request Forgery (CSRF).

### 7. Account Deletion & Data Purging (Right to Erasure)
- Patients can permanently delete their accounts from the Workspace Preferences menu.
- Deletion invokes a strict database-level `ON DELETE CASCADE` constraint.
- When the primary `users` record is removed, all associated data across the system (passwords, AI triage assessments, health passports, medicines, prescriptions, and appointments) is instantly and irreversibly wiped.
- The user's active session cookie is immediately cleared upon execution.

---

## 19. Artificial Intelligence & Clinical Safety Triage

The LifeLink AI symptom triage engine evaluates natural language symptoms using Google Gemini with a 5-layer safety architecture ([`backend/ai/assessmentService.ts`](backend/ai/assessmentService.ts)):

```
[ Patient Inputs Symptoms ]
            │
            ▼
┌────────────────────────────────────────────────────────┐
│ LAYER 1: Input Sanitization & Biological Checks        │
│ Rejects non-medical text & biological contradictions   │
│ (e.g. Male pregnancy claims rejected with error)       │
└──────────────────────────┬─────────────────────────────┘
                           │ Validated
                           ▼
┌────────────────────────────────────────────────────────┐
│ LAYER 2: Deterministic 0ms Emergency Regex Overrides   │
│ Life-threatening symptoms (chest pain, stroke, severe  │
│ bleeding) bypass LLM and immediately route to EMERGENCY│
└──────────────────────────┬─────────────────────────────┘
                           │ Non-Emergency
                           ▼
┌────────────────────────────────────────────────────────┐
│ LAYER 3: Google Gemini Structured JSON Evaluation     │
│ Evaluates symptoms against JSON schema constraints     │
│ Maps to 1 of 12 specialties + Urgency Tier             │
└──────────────────────────┬─────────────────────────────┘
                           │ Generated
                           ▼
┌────────────────────────────────────────────────────────┐
│ LAYER 4: Pediatric & Age Safeguards                    │
│ Patients under 18 years automatically routed to        │
│ Pediatrics specialty                                   │
└──────────────────────────┬─────────────────────────────┘
                           │ Post-Processed
                           ▼
┌────────────────────────────────────────────────────────┐
│ LAYER 5: Deterministic Safe Offline Fallback           │
│ If Gemini API is unreachable, deterministic keyword    │
│ fallback guarantees patient receives safe triage advice│
└────────────────────────────────────────────────────────┘
```

### The 5 Triage Layers Explained:

1. **Layer 1 — Biological Consistency Validation**:
   - Symptoms are evaluated using [`shared/biologicalValidation.ts`](shared/biologicalValidation.ts) before invoking AI models.
   - If a male patient enters female-exclusive anatomical symptoms (such as pregnancy, ovarian pain, or menstrual cramps), the system rejects the input with an educational clarification rather than hallucinating a clinical diagnosis.
   - Legitimate male conditions (such as gynecomastia or prostate health) are explicitly recognized and permitted.
2. **Layer 2 — 0ms Deterministic Emergency Regex Overrides**:
   - Life-threatening symptoms bypass the AI model entirely to ensure instantaneous response times (0 ms).
   - Pre-compiled regular expressions detect acute emergencies: crushing chest pain, difficulty breathing, slurred speech/facial droop (stroke indicators), severe hemorrhage, anaphylaxis, and suicidal ideation.
   - Automatically assigns `urgency = "EMERGENCY"`, recommends `"Emergency Care"`, and directs the patient to immediate medical facilities or `112`.
3. **Layer 3 — Google Gemini Structured JSON Evaluation**:
   - For general symptoms, the backend issues an HTTPS request to Google Gemini Flash using a strict JSON response schema.
   - The response is constrained to four machine-readable fields: `urgency` (`LOW`, `MODERATE`, `EMERGENCY`), `specialty` (must match one of the 12 recognized clinical specialties), `reason` (objective non-diagnostic explanation), and `guidance` (actionable recommendations).
4. **Layer 4 — Pediatric Safeguards**:
   - If the patient is a child or adolescent under 18 years of age, the post-processor routes the recommended specialty to **Pediatrics** unless an emergency override takes precedence.
5. **Layer 5 — Deterministic Offline Fallback**:
   - If the Google Gemini API is unreachable, times out, or exhausts quota, an internal keyword triage algorithm takes over automatically. The patient is never left stranded with a broken screen.

### Medical Boundaries & Non-Diagnostic Disclaimer:
> **IMPORTANT CLINICAL NOTICE**: LifeLink's AI triage engine provides **preliminary guidance only**. It **does NOT provide a medical diagnosis**, prescribe treatments, or replace an in-person evaluation by a licensed physician. If a patient experiences severe symptoms, they must seek emergency care at the nearest hospital immediately.

---

## 20. Realtime Communication (Server-Sent Events)

Rather than polling the server every few seconds, LifeLink uses **Server-Sent Events (SSE)** for unidirectional real-time updates from server to client:

```
Browser (Patient or Doctor)                     Express Server
     │                                                │
     │── GET /api/realtime/patient ──────────────────>│ (Opens streaming connection)
     │<── 200 OK (text/event-stream) ─────────────────│
     │<── comment: heartbeat ─────────────────────────│ (Every 15 seconds)
     │                                                │
     │               [ Doctor Confirms Appointment ]  │
     │                                                │
     │<── event: patient-event ───────────────────────│
     │    id: 104                                     │
     │    data: {"type":"APPOINTMENT_UPDATED"}        │
     │                                                │
     ▼                                                ▼
(React Query invalidates cache & updates UI instantly without page reload)
```

### Technical Details of the SSE Pipeline:
- **Connection Handshake**: The browser connects to `/api/realtime/patient` (or `/api/realtime/doctor`) using standard `fetch` streaming. The server sets headers `Content-Type: text/event-stream`, `Cache-Control: no-cache`, and `Connection: keep-alive`.
- **Heartbeat Mechanism**: A 15-second timer sends `: heartbeat\n\n` comments over the socket, keeping proxy connections from timing out.
- **Message Framing**: Follows standard SSE specifications: `id: <sequence_id>\nevent: <event_name>\ndata: <json_payload>\n\n`.
- **Automatic Reconnection & Event Replay**:
  - If the client's internet connection drops, the browser automatically reconnects and sends its last processed sequence ID via the `Last-Event-ID` header.
  - The server queries `patientEvents` (or `doctorEvents`) in MySQL and replays any missed events sequentially (`getPatientEventsSince`).
- **Connection Teardown**: When the user closes the browser tab, the `req.on("close")` listener automatically removes the subscription from `eventBus` and clears the heartbeat interval, preventing memory leaks.

---

## 21. Maps & Mumbai Transit Integration

The Specialist Finder maps accredited clinics to the **Mumbai Suburban Railway Network**:

- **Transit Mapping**: 52 doctor profiles are distributed across 19 key railway stations:
  - **Western Line**: Churchgate, Dadar, Andheri, Goregaon, Borivali.
  - **Central Line**: CSMT, Ghatkopar, Bhandup, Mulund, Thane, Diva Junction, Kopar, Dombivli, Thakurli.
  - **Harbour Line**: Sewri, Chembur, Vashi, Nerul, Panvel.
- **General Practitioner (GP) Guarantee**: Every single one of the 19 stations includes at least 1 verified General Practitioner, ensuring primary care availability throughout Mumbai.
- **Geodesic Distance Calculation**: Distance from the patient to clinics is calculated entirely on the client browser using the **Haversine formula**:
  $$\Delta\sigma = 2 \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)} \right)$$
  $$d = R \cdot \Delta\sigma$$
  where $R = 6371\text{ km}$ (Earth's radius), $\phi$ is latitude, and $\lambda$ is longitude.
- **Privacy-Bounded Geolocation**: The patient's GPS coordinates are evaluated **in-memory within the browser only**. Coordinates are **never transmitted to the backend server, never written to server logs, and never stored in the database**.

### Current Regional Scope & Pan-India Extensibility Design

While LifeLink's active range and directory coverage are currently deployed in the **Mumbai Metropolitan Region** (using railway stations as convenient local proximity landmarks for commuters), the entire subsystem is architectured for straightforward **Pan-India** scaling:

1. **Decoupled Relational Schema**: The MySQL `doctors` table in [`database/schema.ts`](database/schema.ts) models physical clinic locations generically via `stationCode`, `stationName`, `line`, `address`, `latitude`, and `longitude`. The schema contains zero city-specific or railway-specific hardcoded constraints, allowing any Indian city, district, municipality, or PIN code to be populated without database migrations.
2. **Location-Based Registry Architecture**: Regional location catalogs follow a standardized dictionary structure. Expanding to new regions across India (e.g., Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Tier-2/Tier-3 cities, and rural health districts) requires only introducing corresponding location and clinic registries without modifying core scheduling, triage, or security engines.
3. **Universal Mathematical Geodesics**: The client-side Haversine distance engine calculates physical separation on standard spherical Earth coordinates ($R = 6371\text{ km}$). It functions with equal mathematical accuracy anywhere across India or globally.

---

## 22. Responsive Design & Accessibility

LifeLink provides an accessible experience across diverse devices and screen sizes:

- **Mobile-First Responsive Layouts**: Tested across viewports from compact mobile devices (320px, 360px, 390px, 430px) through tablets (768px) and desktop displays (1080p, 4K).
- **Flexible Grid & Drawer Navigation**: Multi-column desktop grids collapse into single-column vertical flex stacks on small screens. The sidebar navigation transforms into an accessible touch-friendly slide-over drawer on mobile devices.
- **Touch Targets**: All interactive buttons, form controls, and select dropdowns maintain a minimum touch target size of 44x44 pixels.
- **Keyboard Navigation & Focus Management**:
  - Full keyboard traversal support via `Tab`, `Shift+Tab`, `Enter`, and `Escape`.
  - Accessible modal dialogs trap focus when open and return focus to the trigger button upon closing.
- **ARIA & Accessibility Standards**:
  - Semantic HTML5 elements (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`).
  - Screen-reader labels (`aria-label`, `aria-expanded`, `aria-describedby`).
  - Error announcements linked to form inputs via unique generated IDs.
  - Reduced-motion media query support (`prefers-reduced-motion`) disabling decorative animations for users with vestibular sensitivities.

---

## 23. Step-by-Step Local Development Setup

Follow these verified steps to run LifeLink on your local computer:

### Prerequisites

Ensure the following tools are installed:
- **Node.js**: Version `22.0.0` or higher (`node -v`)
- **NPM**: Version `10.0.0` or higher (`npm -v`)
- **MySQL Server**: Version `8.0` or higher running locally on port `3306`
- **Git**: Installed and configured (`git --version`)

### Step 1: Clone the Repository
```bash
git clone https://github.com/SarthakMandhare34/New-LifeLink-Smart-Healthcare-Assistance-Platform.git
cd New-LifeLink-Smart-Healthcare-Assistance-Platform
```

### Step 2: Install Project Dependencies
```bash
npm install
```
*Installs all required runtime and development packages declared in `package.json`.*

### Step 3: Configure Environment Variables
Copy the example environment file to create your local `.env`:
```bash
cp .env.example .env
```
Open `.env` in your text editor and configure your MySQL credentials:
```ini
PORT=4000
DATABASE_URL="mysql://root:your_mysql_password@localhost:3306/lifelink"
JWT_SECRET="your-development-jwt-secret-min-32-chars-long"
LIFELINK_DEMO_DOCTOR_ACCESS_CODE="lifelink-controlled-clinician-secret-key-2026"
GEMINI_API_KEY="your-gemini-api-key-here"
```

### Step 4: Initialize the Database
Create the `lifelink` database in your local MySQL instance:
```bash
npx tsx scripts/init-db.ts
```

### Step 5: Push Database Schema & Migrations
Generate and execute the 14 database tables in MySQL:
```bash
npm run db:push
```

### Step 6: Synchronize the 52 Mumbai Railway Doctors
Seed and synchronize the 52 clinician workstations and Scrypt password hashes:
```bash
npm run db:sync:doctors
```

### Step 7: Start the Development Server
```bash
npm run dev
```
*Starts the Express API server on port `4000` and the Vite development server on port `5173` with reverse proxying.*

### Step 8: Open the Application
Open your web browser and navigate to:
```text
http://localhost:5173
```
- Choose **Patient Portal** (`/login` or `/register`) to create a test patient account or test Google Sign-In.
- Choose **Doctor Workspace** (`/doctor/login`) to sign in as a clinician. Use any of the 52 seeded doctor credentials:
  - **Cardiology (CSMT)**: Email `central-cardiology-csmt@lifelink.com` | Password `cardiology.csmt@lifelink`
  - **General Practice (Dadar)**: Email `western-general-practice-dadar@lifelink.com` | Password `generalpractice.dadar@lifelink`
  - **Pediatrics (Andheri)**: Email `western-pediatrics-andheri@lifelink.com` | Password `pediatrics.andheri@lifelink`
  - **Orthopedics (Panvel)**: Email `harbour-orthopedics-panvel@lifelink.com` | Password `orthopedics.panvel@lifelink`
  *(See [Section 14.1](#141-clinician-workstation-login-credentials-mumbai-medical-directory) for the full 52-doctor directory covering all 12 specialties and 19 railway stations).*

#### 🌐 Local Port & Network Architecture Summary

| Service / Subsystem | Local Address & Port | Port Discovery & Fallback | Operational Role |
|:---|:---|:---:|:---|
| **Vite Frontend Dev Server** | `http://localhost:5173` | Scans `5173` – `5177` | Serves React 19 UI, hot module reloading (HMR), proxies `/api` and `/uploads` to backend. |
| **Express Backend API** | `http://localhost:4000` | Scans `4000` – `4004` | Serves REST endpoints, tRPC router (`/api/trpc`), SSE streams (`/api/realtime/*`), and `/api/health`. |
| **Local MySQL Database** | `127.0.0.1:3306` | Default MySQL port | Relational data persistence for all 14 tables via Drizzle ORM (`DATABASE_URL`). |
| **Google OAuth Redirect** | `http://localhost:5173/api/auth/google/callback` | Fixed in Google Cloud | OAuth authorization callback endpoint for patient Google Sign-In (`AUTH_PUBLIC_BASE_URL`). |
| **Drizzle Studio (Optional GUI)** | `https://local.drizzle.studio` (or dynamic) | Dynamic CLI port | Interactive database GUI launched via `npm run db:studio`. |

---

## 24. Environment Variables Reference

Verified against [`.env.example`](.env.example):

| Variable Name | Required | Default / Example Value | Purpose & Operational Behavior |
|:---|:---:|:---|:---|
| `PORT` | Optional | `4000` | Backend HTTP port for Express. In dev mode, `scripts/dev.mjs` scans ports 4000-4004. |
| `DATABASE_URL` | **Yes** | `mysql://root:password@localhost:3306/lifelink` | MySQL database connection URI parsed by Drizzle ORM and `mysql2`. |
| `JWT_SECRET` | **Yes** | `min-32-characters-secret` | Cryptographic secret used to sign and verify patient and doctor session JWT tokens. |
| `LIFELINK_DEMO_DOCTOR_ACCESS_CODE` | Optional | `lifelink-controlled-clinician-secret-key-2026` | Master administrative secret required to provision or reset doctor workstations (`/doctor/reset`). |
| `GEMINI_API_KEY` | Optional | `AIzaSy...` | Google Gemini API key used for clinical symptom triage and urgency scoring. |
| `GOOGLE_OAUTH_CLIENT_ID` | Optional | `...apps.googleusercontent.com` | Google Cloud OAuth Client ID for patient Google Sign-In. |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Optional | `GOCSPX-...` | Google Cloud OAuth Client Secret for authenticating Google authorization codes. |
| `AUTH_PUBLIC_BASE_URL` | Optional | `http://localhost:5173` | Canonical public URL used to validate OAuth redirect origins. |
| `VITE_API_PORT` | Auto | *Injected by dev runner* | Injected automatically during development to route Vite API requests to Express. |

---

## 25. Database Operations & Management

All database scripts are defined in `package.json` and executed via NPM:

### 1. Synchronize Doctor Directory
```bash
npm run db:sync:doctors
```
*Audits MySQL against `mockDoctorDirectory.ts`. Automatically inserts missing specialists and updates Scrypt hashes so all 52 workstations are exam-ready.*

### 2. Clear Test Patient Data (Preserves Doctors)
```bash
npm run db:clear
```
*Safely purges test patient records, appointments, prescriptions, and assessments while keeping all 52 doctor accounts intact.*

### 3. Delete a Single User Account
```bash
npx tsx scripts/delete-user.ts patient@example.com
```
*Selectively deletes a single patient or doctor account by email address with cascading cleanup of all related records.*

### 4. Launch Drizzle Studio (Database GUI)
```bash
npm run db:studio
```
*Launches an interactive database browser at `https://local.drizzle.studio`, allowing you to inspect tables, rows, and relationships visually.*

---

## 26. Production Cloud Deployment & Live Infrastructure (Render.com + TiDB Serverless)

LifeLink is engineered as a unified, production-ready cloud application deployed on **Render.com** and powered by a distributed **TiDB Serverless Cloud** database cluster. This architecture replaces local developer instances with high-availability, zero-downtime, and geographically resilient infrastructure.

🌍 **Live Production URL:** [https://new-lifelink-smart-healthcare-assistance.onrender.com/](https://new-lifelink-smart-healthcare-assistance.onrender.com/)

---

### 26.1 Live Production Architecture & Cloud Topology

The production deployment leverages a modern cloud stack decoupling stateless web computation from distributed, auto-scaling relational persistence:

```text
[ Patient Web Browser ]                               [ Clinician Workstation ]
        │                                                         │
        │ HTTPS (TLS 1.3 / Port 443)                              │ HTTPS (TLS 1.3 / Port 443)
        └────────────────────────────┬────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RENDER.COM CLOUD EDGE LAYER                         │
│   • Global Anycast Ingress & Cloudflare-backed DDoS Mitigation              │
│   • Managed Automatic TLS/SSL Termination (Let's Encrypt Wildcard)          │
│   • HTTP/2 Multiplexing & Reverse Proxy Gateway Routing                     │
│   • Non-buffered Server-Sent Events (SSE) Streaming Pipeline                │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Internal Reverse Proxy ($PORT)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 RENDER WEB SERVICE CONTAINER (NODE.JS v22 LTS)              │
│                 Image: Alpine Linux / Node.js 22 Runtime Engine              │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │               Express Application & Static Asset Pipeline           │   │
│   │                                                                     │   │
│   │   • Single-Container Unified Runtime: Serves API & Frontend on $PORT│   │
│   │   • Static Asset Serving: /dist/public (React 19 Vite Production)   │   │
│   │   • SPA History Fallback: Non-API GET requests serve index.html     │   │
│   │   • tRPC JSON-RPC Endpoint: /trpc (appRouter query & mutation bus)  │   │
│   │   • SSE Real-Time Channel: /sse/patient & /sse/doctor broadcast     │   │
│   │   • Health Monitor Probe: GET /api/health                           │   │
│   │   • Google OAuth Handshake: /api/auth/google & /api/auth/callback   │   │
│   └───────────────────┬─────────────────────────────────┬───────────────┘   │
│                       │                                 │                   │
└───────────────────────┼─────────────────────────────────┼───────────────────┘
                        │                                 │
                        │ TLS 1.3 Encrypted Wire Tunnel   │ HTTPS API Outbound
                        │ Port 4000 (rejectUnauth=true)   │ OAuth & Gemini AI
                        ▼                                 ▼
┌───────────────────────────────────────────┐   ┌─────────────────────────────┐
│          TiDB SERVERLESS CLUSTER          │   │    GOOGLE CLOUD PLATFORM    │
│      (AWS ap-southeast-1 Singapore)       │   │                             │
│                                           │   │  • Gemini 1.5/2.0 Flash AI  │
│   ┌───────────────────────────────────┐   │   │    (Symptom Triage Pipeline)│
│   │       TiDB SQL Parser Layer       │   │   │                             │
│   │   • MySQL 8.0 Protocol Parser     │   │   │  • Google Cloud OAuth 2.0   │
│   │   • Distributed Query Planner     │   │   │    (Strict Production URL)  │
│   └─────────────────┬─────────────────┘   │   │                             │
│                     ▼                     │   │  • Secure Token Validation  │
│   ┌───────────────────────────────────┐   │   │    (Identity Federation)    │
│   │       TiKV Storage Engines        │   │   └─────────────────────────────┘
│   │   • Multi-Raft Replication        │   │
│   │   • 14 Relational Health Tables   │   │
│   │   • 52 Doctor Workstation Rows    │   │
│   │   • Serverless Auto-Scale (RU)    │   │
│   └───────────────────────────────────┘   │
└───────────────────────────────────────────┘
```

#### Interactive Cloud Infrastructure Flow Diagram

```mermaid
graph TB
    subgraph Clients["Patient & Clinician Endpoints"]
        PatBrowser["Patient Browser (/patient/*)"]
        DocBrowser["Doctor Workstation (/doctor/*)"]
    end

    subgraph RenderEdge["Render.com Global Cloud Edge"]
        Anycast["Anycast DNS & DDoS Protection"]
        TLS["TLS 1.3 Termination (Let's Encrypt Wildcard)"]
        RevProxy["HTTP/2 Reverse Proxy Router"]
    end

    subgraph RenderContainer["Render Web Service (Linux Node.js v22 LTS Container)"]
        Express["Express HTTP Server ($PORT = 10000)"]
        StaticVite["Static Assets (/dist/public React 19 SPA)"]
        tRPCRouter["tRPC v11 JSON-RPC Router (/trpc)"]
        SSEBus["EventBus Real-Time Stream (/sse/*)"]
        AuthHandler["Dual-Cookie & Google OAuth Handlers"]
    end

    subgraph TiDBCloud["TiDB Serverless Cloud (AWS ap-southeast-1 Singapore)"]
        TiDBGate["TiDB Gateway Proxy (Port 4000 / TLS 1.3)"]
        TiDBSQL["Stateless TiDB SQL Parsing & Execution Nodes"]
        TiKVStorage["Distributed TiKV Storage Engines (Multi-Raft Consensus)"]
    end

    subgraph GoogleCloud["External Google Cloud Services"]
        GeminiAI["Google Gemini 1.5/2.0 Flash AI API"]
        GoogleOAuth["Google Cloud OAuth 2.0 Auth Server"]
    end

    PatBrowser -->|HTTPS 443| Anycast
    DocBrowser -->|HTTPS 443| Anycast
    Anycast --> TLS
    TLS --> RevProxy
    RevProxy -->|Internal Proxy| Express

    Express --> StaticVite
    Express --> tRPCRouter
    Express --> SSEBus
    Express --> AuthHandler

    tRPCRouter -->|Encrypted TLS 1.3 Tunnel| TiDBGate
    AuthHandler -->|Encrypted TLS 1.3 Tunnel| TiDBGate
    TiDBGate --> TiDBSQL
    TiDBSQL --> TiKVStorage

    tRPCRouter -->|HTTPS POST| GeminiAI
    AuthHandler -->|HTTPS OAuth Code Exchange| GoogleOAuth

    SSEBus -.->|Streaming SSE + 25s Keepalive| RevProxy
    RevProxy -.->|Immediate Flush Unbuffered Stream| PatBrowser
    RevProxy -.->|Immediate Flush Unbuffered Stream| DocBrowser
```

---

### 26.2 Render.com Web Service Hosting Mechanics

#### 1. Single-Container Full-Stack Architecture
Unlike traditional deployments that split client and server across separate hosts (such as Vercel for frontend and AWS/Heroku for backend), LifeLink utilizes a unified single-container architecture:
- **Zero CORS Friction**: Because API endpoints (`/api/*`, `/trpc/*`, `/sse/*`) and frontend assets reside on the same origin (`https://new-lifelink-smart-healthcare-assistance.onrender.com`), the browser eliminates pre-flight `OPTIONS` overhead and cross-origin blocking.
- **Cryptographic Cookie Sharing**: Authentication cookies (`app_session_id` and `doctor_session_id`) operate seamlessly across both frontend and backend within the same domain scope under `SameSite=Lax` and `Secure=true`.
- **SPA Fallback Routing**: Express serves pre-compiled Vite assets from `dist/public/`. Any incoming GET request not matching an API endpoint or static file is automatically routed to `dist/public/index.html`, allowing client-side React Router navigation (`/patient/*`, `/doctor/*`, `/workspace`) to resolve without 404 errors.

#### 2. Dual Build Pipeline (`npm run build`)
The production build script executes a two-stage compilation pipeline:
```bash
vite build && esbuild backend/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```
1. **Frontend Vite Build**:
   - Compiles React 19 JSX, TypeScript, and Tailwind CSS into tree-shaken, hashed bundles in `dist/public/`.
   - Asset optimization includes CSS minification, code-splitting, SVG compression, and HTML template generation.
2. **Backend esbuild Compilation**:
   - Bundles the entire backend TypeScript codebase (Express server, tRPC routers, AI triage engine, database layer) into a single ECMAScript module (`dist/index.js`).
   - Marks external Node.js modules as external packages to minimize bundle weight while retaining binary native module compatibility.

#### 3. Execution & Dynamic Port Binding (`npm start`)
When Render boots the application:
```bash
node dist/index.js
```
The server dynamically reads the internal listening port from `process.env.PORT` (assigned arbitrarily by Render's container orchestration layer, typically `10000`). Express binds to `0.0.0.0:$PORT`, while Render's edge reverse proxy routes external HTTPS traffic on port 443 directly to the listening process.

#### 4. Automated Git Continuous Deployment (CI/CD)
The Render service is connected directly to the repository's `main` branch:
- Pushing a new commit to `main` automatically triggers Render's build container.
- Render installs dependencies (`npm install`), executes the build pipeline (`npm run build`), and verifies that the output bundle starts successfully before redirecting live traffic (Zero-Downtime Rolling Deployment).

---

### 26.3 TiDB Serverless Cloud Database Architecture

#### 1. Why TiDB Serverless?
Local MySQL instances (`127.0.0.1:3306`) cannot be accessed from cloud containers without complex tunneling. Rather than provisioning a costly fixed-size cloud MySQL instance, LifeLink integrates **TiDB Serverless Cloud** (hosted on AWS `ap-southeast-1`, Singapore):
- **100% MySQL 8.0 Protocol Wire Compatibility**: Uses the existing `mysql2` driver and Drizzle ORM configuration without modifying any database queries, schema definitions, or migration files.
- **Stateless Compute & Distributed Storage Separation**: Query execution is handled by stateless TiDB nodes, while persistent state is sharded across distributed TiKV storage engines utilizing the Multi-Raft replication consensus algorithm.
- **Elastic Serverless Scaling**: Automatically scales Request Units (RU) from zero to accommodate fluctuating patient traffic without manual provision sizing or cost overhead.
- **Enterprise-Grade Availability**: Automatic cross-availability zone replication ensures continuous clinical record persistence even during cloud node failures.

#### 2. Production Connection String Anatomy & TLS 1.3 Encryption
TiDB Cloud enforces strict TLS 1.3 encryption for all external database sessions. The production `DATABASE_URL` is structured as follows:

```text
mysql://3EF4bZSNjaGdwTj.root:<PASSWORD>@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}
```

| Component | Value / Anatomy | Purpose & Architectural Function |
|:---|:---|:---|
| **Protocol** | `mysql://` | Standard MySQL wire-protocol URI scheme recognized by `mysql2` driver. |
| **Username** | `3EF4bZSNjaGdwTj.root` | Cluster-prefixed tenant identifier (`3EF4bZSNjaGdwTj`) routing the session to the allocated TiDB Serverless cluster. |
| **Password** | `<STRONG_SECRET>` | Strong cryptographic database password. |
| **Gateway Host** | `gateway01.ap-southeast-1.prod.aws.tidbcloud.com` | AWS Singapore regional proxy gateway providing Anycast connection load balancing. |
| **Port** | `4000` | Standard TiDB cluster listener port. |
| **Database Name** | `test` (or `lifelink`) | Production schema namespace hosting all 14 relational tables. |
| **SSL Enforcement** | `?ssl={"rejectUnauthorized":true}` | **Critical SSL parameter**: Enforces strict TLS certificate validation. Rejects untrusted or man-in-the-middle certificates to protect patient medical data in transit. |

---

### 26.4 Dual-Database Architecture: Development vs. Production

LifeLink strictly separates development from live production data, preventing mock records or test experiments from contaminating clinical databases:

| Architectural Property | Local Development Instance | Production Cloud Instance |
|:---|:---|:---|
| **Database Engine** | Local MySQL Server 8.0 | TiDB Serverless Cloud (Distributed MySQL 8.0) |
| **Host & Port** | `127.0.0.1:3306` | `gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000` |
| **Transport Encryption** | Plaintext / Local Loopback | **TLS 1.3 Encrypted Tunnel (`rejectUnauthorized: true`)** |
| **Primary Use Case** | Unit testing, local feature development, fast iteration | Live patient consultations, public demo, doctor evaluations |
| **Execution Script** | `npm run dev` | Render Cloud Container (`node dist/index.js`) |
| **Doctor Workstations** | 52 synchronized local accounts | 52 synchronized production cloud accounts |

#### Executing Remote Cloud Migrations from Developer CLI
To update the cloud schema or synchronize doctor accounts without modifying your local `.env`, use `cross-env` to pass the remote connection string:

```powershell
# 1. Push Drizzle Schema & Run Migrations to TiDB Cloud
npx cross-env DATABASE_URL='mysql://3EF4bZSNjaGdwTj.root:<PASSWORD>@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}' npm run db:push

# 2. Seed All 52 Mumbai Railway Specialists to TiDB Cloud
npx cross-env DATABASE_URL='mysql://3EF4bZSNjaGdwTj.root:<PASSWORD>@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}' npm run db:sync:doctors
```

---

### 26.5 Google OAuth 2.0 Cloud Security Handshake

In production, Google Cloud OAuth enforces strict origin validation. Any mismatch between the URL registered in Google Cloud Console and the originating request results in an authorization failure (`Error 400: redirect_uri_mismatch`).

#### 1. Google Cloud Console URI Whitelist
To support both local development and live cloud production, Google Cloud Console credentials must contain both URI environments:

| Console Setting | Local Development Value | Live Render Production Value |
|:---|:---|:---|
| **Authorized JavaScript Origins** | `http://localhost:5173` | `https://new-lifelink-smart-healthcare-assistance.onrender.com` |
| **Authorized Redirect URIs** | `http://localhost:5173/api/auth/google/callback` | `https://new-lifelink-smart-healthcare-assistance.onrender.com/api/auth/google/callback` |

#### 2. The Role of `AUTH_PUBLIC_BASE_URL`
In production on Render, the backend must construct the absolute OAuth redirect URI sent to Google. Because Render proxies traffic through an internal port (`process.env.PORT`), inspecting `req.headers.host` can sometimes resolve to internal network IPs or loopbacks.
Setting:
```ini
AUTH_PUBLIC_BASE_URL="https://new-lifelink-smart-healthcare-assistance.onrender.com"
```
forces the backend to construct the exact canonical redirect URL:
`https://new-lifelink-smart-healthcare-assistance.onrender.com/api/auth/google/callback`
guaranteeing 100% cryptographic handshake agreement with Google Cloud identity servers.

---

### 26.6 Server-Sent Events (SSE) Over Cloud Reverse Proxy

Real-time doctor queue updates and patient appointment state notifications are pushed over **Server-Sent Events (SSE)** (`/sse/patient` and `/sse/doctor`). In a cloud environment, reverse proxies (like Render's edge proxy or Nginx) introduce specific challenges:

#### 1. Proxy Buffering Disabling
By default, cloud proxies buffer incoming HTTP responses to optimize packet delivery. For streaming SSE channels, buffering would delay real-time alerts until the buffer fills up. LifeLink explicitly disables proxy buffering via HTTP headers:
```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache, no-transform
Connection: keep-alive
X-Accel-Buffering: no
```
The `X-Accel-Buffering: no` header instructs Render and upstream Nginx proxies to flush SSE chunks immediately to the connected client.

#### 2. 25-Second Keep-Alive Heartbeat Strategy
Render's cloud edge terminates any HTTP connection that remains idle with no byte transmission for longer than **100 seconds**.
LifeLink's real-time event bus ([`backend/realtime/eventBus.ts`](backend/realtime/eventBus.ts)) runs an automated heartbeat timer:
- Every **25 seconds**, a comment packet is broadcast to all active SSE streams:
  ```text
  :keepalive\n\n
  ```
- This heartbeat consumes negligible bandwidth (~12 bytes per tick) while permanently resetting the reverse proxy idle timeout, ensuring doctor and patient sessions remain connected indefinitely.

---

### 26.7 Comprehensive Production Environment Variables Matrix

To configure the live application on Render, the following environment variables are set in the **Render Dashboard $\rightarrow$ Environment** tab:

| Environment Variable | Required | Production Value / Pattern | Security Tier | Operational Functionality |
|:---|:---:|:---|:---:|:---|
| `NODE_ENV` | **Yes** | `production` | Public | Enables production optimizations in Express, disables verbose dev stack traces. |
| `DATABASE_URL` | **Yes** | `mysql://...tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}` | **CRITICAL** | Encrypted TLS connection URI to TiDB Serverless cloud cluster. |
| `JWT_SECRET` | **Yes** | *(High-entropy 64+ char random string)* | **CRITICAL** | Cryptographic key used to sign HMAC-SHA256 session tokens. |
| `LIFELINK_DEMO_DOCTOR_ACCESS_CODE` | **Yes** | `lifelink-controlled-clinician-secret-key-2026` | **RESTRICTED** | Master clinician authorization code for workstation reset and verification. |
| `GEMINI_API_KEY` | **Yes** | `AIzaSy...` | **RESTRICTED** | Google Gemini 1.5/2.0 API key for AI symptom assessment & urgency triage. |
| `GOOGLE_OAUTH_CLIENT_ID` | Optional | `420856394354-...apps.googleusercontent.com` | Public | Google Cloud OAuth 2.0 Client ID for patient Google Sign-In. |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Optional | `GOCSPX-...` | **CRITICAL** | Google Cloud OAuth Client Secret for token exchange. |
| `AUTH_PUBLIC_BASE_URL` | **Yes** | `https://new-lifelink-smart-healthcare-assistance.onrender.com` | Public | Public origin used for canonical Google OAuth callbacks. |
| `PORT` | Auto | *Assigned dynamically by Render (e.g. 10000)* | Internal | Listen port assigned by Render container supervisor. Express binds to `0.0.0.0:$PORT`. |

---

### 26.8 Cold Start Management & Production Resiliency

#### 1. Free Tier Lifecycle & Hibernation
When deployed on Render's free compute tier:
- **Inactivity Spin-Down**: The container automatically spins down (hibernates) after **15 minutes** of zero incoming HTTP requests to conserve cloud resources.
- **Cold Boot Recovery**: When a new request arrives, Render boots the container within **30 to 50 seconds**. Subsequent requests are served immediately with sub-millisecond response times.

#### 2. Stateless Architecture & Zero Data Loss
Because LifeLink is designed with strict **stateless container semantics**:
- All patient records, consultations, prescriptions, and audit events reside durably in TiDB Serverless Cloud.
- No medical or operational data is lost during container hibernation, restart, or rolling deploy.
- The `/api/health` endpoint allows external uptime monitors (such as UptimeRobot or Cron-Job.org) to ping the instance periodically (e.g. every 10 minutes) if zero-downtime hot standby is desired.

---

## 27. Automated Testing Framework & Test Breakdown

LifeLink includes an automated test suite executed via Vitest ([`vitest.config.ts`](vitest.config.ts)):

```bash
npm test
```

### Complete Test Suite Breakdown (33 Test Files):

| Test Suite File | Tests | Validated System Behavior |
|:---|:---:|:---|
| `backend/ai/assessmentService.test.ts` | **54 tests** | 5-layer triage pipeline: input sanitization, non-medical pattern rejection, biological consistency checks (male pregnancy), pediatric age overrides, and urgency score mapping. |
| `backend/realtime/security.realtime.test.ts` | **32 tests** | Real-time Server-Sent Events (SSE) packet delivery, listener error handling, stream reconnection, and cleanup. |
| `backend/appointmentLifecycle.test.ts` | **26 tests** | 5-stage appointment state machine: `Requested` $\rightarrow$ `Pending` $\rightarrow$ `Confirmed` $\rightarrow$ `Completed` / `Cancelled`, slot conflicts, and past dates. |
| `backend/auth/security.idor.test.ts` | **15 tests** | IDOR boundaries ensuring patients cannot access or modify records belonging to other users. |
| `backend/prescriptionLifecycle.test.ts` | **15 tests** | Multi-item prescriptions, two-stage signing workflow (`UNSIGNED` $\rightarrow$ `SIGNED`), canonical SHA-256 seal calculation, anti-tampering proofs, duplicate signing prevention, clinician isolation, input validation, and real-time SSE event emission. |
| `backend/routers/doctor.test.ts` | **13 tests** | Doctor workstation endpoints, appointment status updates, consultation metrics, authorized patient detail, draft prescription creation, and explicit prescription signing mutation (`prescriptions.sign`). |
| `backend/healthPassport.test.ts` | **12 tests** | Emergency Health Passport: blood group validation, serialized allergy/condition lists, and profile updates. |
| `frontend/src/features/patient/Emergency/Emergency.test.tsx` | **11 tests** | Emergency assistance UI flows, SOS triggers, transit navigation, and modal management. |
| `backend/auth/doctorAuth.test.ts` | **8 tests** | Doctor Scrypt password checks, institutional email login, timing-safe password resets, and session cookies. |
| `backend/medicine.test.ts` | **7 tests** | Medicine cabinet operations, daily schedules, adherence tracking, and inventory counts. |
| `frontend/src/responsiveLayout.test.ts` | **6 tests** | Responsive rendering across 320px, 360px, 390px, 430px, 480px, 768px, and 4K screens with safe-area insets. |
| `frontend/src/features/patient/Specialists/SpecialistFinder.test.ts` | **5 tests** | Station filter, transit line filter, distance calculation, and doctor profile display. |
| `backend/discovery/mockDoctorDirectory.test.ts` | **4 tests** | Verifies 52 doctors, 1 GP per station guarantee across 19 stations, GPS coordinates, and line filters. |
| `frontend/src/features/entry/WorkspaceSelector.test.ts` | **4 tests** | Multi-role workspace switching, contrast verification, and responsive landing layout. |
| `backend/auth/providerAuth.test.ts` | **4 tests (3 passed, 1 skipped)** | Clinician authorization middleware, Google OAuth availability detector, and role enforcement (1 test skipped when external Google credentials are intentionally unconfigured). |
| `frontend/src/components/layout/AppShell.test.ts` | **3 tests** | Global navigation shell, dark/light theme switching, and safe header rendering. |
| `backend/realtime/patientRealtime.test.ts` | **3 tests** | SSE connection management and patient channel subscription isolation. |
| `backend/auth/nativePatientAuth.test.ts` | **2 tests** | Native patient signup, password complexity, unique Scrypt random salting, and `timingSafeEqual` login. |
| `backend/geminiKey.test.ts` | **2 tests** | Gemini API key environment configuration and connection tests. |
| `backend/ai/assessment.validation.test.ts` | **2 tests** | Zod input schema validation for triage requests (symptoms length, age limits, gender values). |
| `frontend/src/hooks/patientInactivity.test.ts` | **2 tests** | Inactivity timeout detection and automatic session locking after 5 minutes of idle time. |
| `frontend/src/features/patient/activeCopyAudit.test.ts` | **2 tests** | Copy audit ensuring professional clinical terminology across views. |
| `frontend/src/styles.motion.test.ts` | **2 tests** | Framer motion animation token validation and reduced motion compliance. |
| `frontend/src/typography.test.ts` | **2 tests** | Typography scale and tabular font rendering tests. |
| `scripts/dev.test.ts` | **2 tests** | Development server port scanner and proxy configuration tests. |
| `backend/emergencyContact.validation.test.ts` | **2 tests** | Zod schema validation for emergency contact inputs. |
| `backend/profilePhoto.test.ts` | **2 tests** | Avatar photo upload validation, magic byte verification, and size limits. |
| `backend/auth/simultaneousAuth.test.ts` | **1 test** | Dual session cookie isolation (`app_session_id` vs `doctor_session_id`). |
| `frontend/src/components/EntryThemeToggle.test.ts` | **1 test** | Theme toggle switch interaction and persistence tests. |
| `frontend/src/backgroundBranding.test.ts` | **1 test** | Official brand asset existence and path integrity tests. |
| `frontend/src/features/patient/Specialists/discoveryLocation.test.ts` | **1 test** | Client-side Haversine geodesic calculation tests. |
| `frontend/src/features/patient/patientAuthRoutes.test.ts` | **1 test** | Patient authentication route configuration tests. |
| `backend/auth/auth.logout.test.ts` | **1 test** | Session cookie invalidation and logout tests. |
| **Total** | **248 tests (247 passed, 1 skipped)** | **100% Passing Test Suite (33 Test Files)** |

---

## 28. Verified Test & Build Results

Verification checks executed on the current repository codebase:

- **Automated Tests**: **PASS** (`247 passed, 1 skipped across 33 test files` via `npm test`)
- **TypeScript Compilation**: **PASS** (`0 errors` via `npm run check`)
- **Production Build**: **PASS** (`Vite client bundle + backend esbuild bundle compiled successfully in ~26.6s` via `npm run build`)
- **Browser Verification**: Browser verification was not completed because a supported browser environment was unavailable.

---

## 29. Troubleshooting Guide

### 1. Database Connection Fails (`ECONNREFUSED` on port 3306)
- **Cause**: MySQL server is not running or credentials in `.env` are incorrect.
- **Solution**: Check that MySQL is running (`mysql -u root -p`). Verify that `DATABASE_URL` in `.env` matches your MySQL password and host. Run `npx tsx scripts/init-db.ts` to ensure the `lifelink` database exists.

### 2. Backend Port Collision (`EADDRINUSE: 4000`)
- **Cause**: Another process is occupying port 4000.
- **Solution**: The development orchestrator (`node scripts/dev.mjs`) automatically scans and binds to ports 4000-4004. If all ports are occupied, terminate orphaned Node processes via Task Manager or run `netstat -ano | findstr 4000`.

### 3. Doctor Login Fails ("Invalid Credentials")
- **Cause**: Doctor accounts have not been synchronized into your local MySQL database.
- **Solution**: Run `npm run db:sync:doctors`. This populates all 52 Mumbai railway doctors with their verified Scrypt password hashes. Check `scripts/list-doctor-credentials.ts` for valid test logins.

### 4. Appointment Time Slot Unavailable
- **Cause**: The selected time slot is already booked for that specific doctor, or the chosen time is in the past.
- **Solution**: Select a future 30-minute time slot. Remember that availability is specific to each doctor; choosing another specialist at the same station will display open slots.

### 5. AI Health Assessment Returns Fallback Advice
- **Cause**: `GEMINI_API_KEY` is missing, expired, or rate-limited.
- **Solution**: Add a valid Gemini API key from [Google AI Studio](https://aistudio.google.com/) to your `.env` file under `GEMINI_API_KEY`. If left unset, LifeLink's deterministic Layer 5 safety fallback operates automatically.

---

## 30. Medical Safety & Privacy Disclaimers

### 1. Non-Diagnostic Medical Guidance Disclaimer
LifeLink is an educational and clinical assistance software platform. The AI symptom triage module generates **preliminary health guidance only**. It **does not formulate a clinical diagnosis**, prescribe pharmaceutical treatments, or replace formal medical evaluations by a qualified physician. Users experiencing severe or acute symptoms must seek immediate medical care at a hospital emergency room.

### 2. Emergency Calling Boundaries
LifeLink provides quick-dial telephone links to emergency services (`112`). It **does not automatically dispatch ambulances, emergency vehicles, or medical responders**. Calling requires explicit user confirmation on the device.

### 3. Geolocation Data Privacy
Patient GPS coordinates are processed entirely in-memory within the user's web browser using client-side JavaScript. **Patient location data is never sent to the backend server, never written to server log files, and never stored in the database**.

---

## 31. Current Limitations & Future Enhancements

### Current Limitations
1. **Synthetic Clinical Directory**: The 52 Mumbai railway doctors are realistic synthetic profiles created for testing and demonstration. Production deployment would require official credential verification and clinical onboarding.
2. **Fixed Consultation Slots**: The scheduling engine uses predefined 30-minute intervals and does not integrate with external calendar systems (e.g., Google Calendar, Outlook).
3. **Regional Operational Range (Mumbai Only)**: The existing range, live specialist directory, and physical clinic coordinates are currently available only within the Mumbai Metropolitan Region (using 19 key railway stations as local landmark anchors). Specialists and healthcare facilities in other Indian cities, districts, and states are not yet populated in the active database.
4. **No Financial Processing**: Payment gateway integration, co-pays, and insurance verification are outside the current release scope.

### Future Enhancements (Planned)
1. **Pan-India Geographic & Location-Based Expansion**:
   While existing range and coverage are currently available only in Mumbai, LifeLink's architecture is engineered to scale across India:
   - **Multi-City & Regional Expansion**: Extending specialist directories to major Indian metropolitan cities and districts (e.g., Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad) using city, area, and PIN-code based location discovery.
   - **Tier-2, Tier-3 & Rural Healthcare Network**: Expanding clinical listings to district hospitals, Community Health Centres (CHCs), and Primary Health Centres (PHCs) across Indian states.
   - **Regional Language Localization**: Adding multilingual localization for major Indian languages (Hindi, Marathi, Kannada, Tamil, Telugu, Bengali, Gujarati).
2. **Telemedicine Audio/Video**: WebRTC-based video and audio consultation rooms connecting patients and clinicians directly.
3. **ABDM / FHIR Compliance**: Integrating with the Ayushman Bharat Digital Mission (ABDM) and FHIR healthcare interoperability standards.
4. **Offline Mobile App**: Packaging the patient portal as a progressive web app (PWA) with offline medication reminders and SMS backup.

---

## 32. Complete Verified NPM Script Quick Reference

All scripts verified directly from [`package.json`](package.json):

| NPM Script Command | Underlying Command Line | Purpose & Operational Behavior |
|:---|:---|:---|
| `npm run dev` | `node scripts/dev.mjs` | Starts Express backend (`:4000`) and Vite frontend (`:5173`) concurrently with API proxying. |
| `npm run build` | `vite build && esbuild backend/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist` | Builds production frontend into `dist/public` and bundles backend into `dist/index.js`. |
| `npm start` | `node dist/index.js` | Runs production server serving both the Express API and compiled frontend assets. |
| `npm run check` | `tsc --noEmit` | Executes TypeScript type-checking without emitting files (0 errors). |
| `npm test` | `vitest run` | Runs all 248 automated unit and integration tests across 33 test files (247 passed, 1 skipped). |
| `npm run format` | `prettier --write .` | Formats all code and documentation files according to Prettier formatting standards. |
| `npm run verify` | `npm run check && npm test && npm run build` | Sequentially runs type checking, test suites, and production build verification. |
| `npm run db:push` | `drizzle-kit generate --config database/drizzle.config.ts && drizzle-kit migrate --config database/drizzle.config.ts` | Generates and applies schema migrations directly to MySQL. |
| `npm run db:studio` | `drizzle-kit studio --config database/drizzle.config.ts` | Launches interactive Drizzle Studio database GUI. |
| `npm run db:sync:doctors` | `tsx scripts/sync-doctors.ts` | Populates and synchronizes all 52 Mumbai railway doctors and Scrypt password hashes. |
| `npm run db:clear` | `tsx scripts/clear-users.ts` | Safely purges test patient records while preserving all 52 doctor accounts. |
| `npm run db:delete-user` | `tsx scripts/delete-user.ts` | Selectively deletes a single user account by email. |

---

## 33. Modular Documentation Index & Cross-References

For deeper technical deep-dives, consult the specialized documentation guides in the repository:

- 📐 [**System Architecture Guide (ARCHITECTURE.md)**](ARCHITECTURE.md) — Comprehensive technical reference on system layers, tRPC procedures, and sequence lifecycles.
- 🗄️ [**Relational Database Guide (DATABASE.md)**](DATABASE.md) — Detailed schema breakdown of all 14 tables, columns, constraints, and relationships.
- 🚀 [**Installation & Setup Guide (SETUP.md)**](SETUP.md) — Step-by-step local setup, environment configuration, and database management guide.
- 🧪 [**Automated Testing Guide (TESTING.md)**](TESTING.md) — Complete 33-suite test breakdown, execution commands, and security verification matrix.
- 🔒 [**Security Policy & IDOR Controls (SECURITY.md)**](SECURITY.md) — Vulnerability disclosure process, cryptographic Scrypt hashing, and dual cookie isolation.
- 📊 [**System Architecture & Technical Diagrams (SYSTEM_DIAGRAMS.md)**](SYSTEM_DIAGRAMS.md) — Entity-relationship diagrams, directory layout, and Mermaid sequence charts.
- 👥 [**Contributors & Development Guidelines (CONTRIBUTORS.md)**](CONTRIBUTORS.md) — Project author, contributor acknowledgments, and development guidelines.
- 📋 [**Release Changelog (CHANGELOG.md)**](CHANGELOG.md) — Complete version release history and technical changelog notes.
- ⚖️ [**Open Source License (LICENSE)**](LICENSE) — MIT License terms and conditions.



# 🏥 LifeLink — Smart Healthcare Assistance Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v22%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.1-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Tests Passing](https://img.shields.io/badge/Vitest-241%20Tests%20Passed-success?style=for-the-badge&logo=vitest&logoColor=white)](#26-automated-testing-framework--test-breakdown)

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
26. [Automated Testing Framework & Test Breakdown](#26-automated-testing-framework--test-breakdown)
27. [Verified Test & Build Results](#27-verified-test--build-results)
28. [Troubleshooting Guide](#28-troubleshooting-guide)
29. [Medical Safety & Privacy Disclaimers](#29-medical-safety--privacy-disclaimers)
30. [Current Limitations & Future Enhancements](#30-current-limitations--future-enhancements)
31. [Complete Verified NPM Script Quick Reference](#31-complete-verified-npm-script-quick-reference)
32. [Modular Documentation Index & Cross-References](#32-modular-documentation-index--cross-references)

---

## 1. Project Overview

**LifeLink** is a full-stack smart healthcare assistance platform tailored for the **Mumbai Metropolitan Region (MMR)**. It connects daily train commuters and local residents with fast health guidance and verified medical specialists near their connecting railway stations.

In large metropolitan cities like Mumbai, over 7.5 million passengers travel daily across the suburban railway network. When commuters experience sudden health symptoms during transit, they face three common challenges:
- They do not know whether their condition is an emergency or something that can wait.
- They do not know which medical specialty (such as Cardiology, Dermatology, or Orthopedics) treats their specific symptoms.
- They do not know which accredited clinics or doctors are located within walking distance of their destination train station.

LifeLink addresses these challenges by combining:
1. **A 5-Layer AI Clinical Symptom Triage Engine** powered by Google Gemini, which evaluates symptoms against biological and emergency rules to recommend an appropriate medical specialty and urgency level.
2. **A Mumbai Rail Transit Specialist Directory** covering 52 verified doctor profiles across 19 major railway stations on the Western, Central, and Harbour lines.
3. **An Integrated Patient & Doctor Workflow**, providing appointment booking, personal Health Passports, medicine tracking, tamper-evident digital prescriptions, and live updates via Server-Sent Events (SSE).

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
2. **Map Specialists to Mumbai Transit Corridors**: Map verified clinics to 19 major suburban railway stations, enabling commuters to locate doctors near their transit routes.
3. **Enforce Doctor-Specific Appointment Scheduling**: Guarantee that appointment slots belong strictly to specific doctors, preventing cross-doctor scheduling conflicts and ensuring atomicity.
4. **Digitize Personal Health Records Securely**: Allow patients to maintain an Emergency Health Passport, an active medicine cabinet, and digital prescriptions with cryptographic integrity checks.
5. **Implement Strict Healthcare Security**: Enforce Scrypt password hashing with individual random salts, dual HTTP-only session cookies, 5-minute inactivity termination, and comprehensive IDOR protections.
6. **Support Real-Time Communication**: Push live appointment and prescription status changes to connected browsers instantly using lightweight Server-Sent Events (SSE).

---

## 4. Project Scope

To provide an accurate assessment of the platform, the project boundary is clearly divided into what is currently implemented and what lies outside the current release scope:

### Currently Implemented

- **Dual Workspaces**: Dedicated, isolated workspaces for patients (`/patient/*`) and clinicians (`/doctor/*`).
- **Authentication**: Native email/password authentication with memory-hard Scrypt hashing (16-byte random salts), timing-safe verification, and optional Google OAuth 2.0.
- **AI Symptom Triage**: 5-layer triage pipeline utilizing Google Gemini Flash models with deterministic 0ms emergency regex overrides, biological checks, and offline fallbacks.
- **Transit Specialist Directory**: 52 doctor profiles across 19 railway stations with interactive Leaflet map rendering and client-side geodesic distance calculations.
- **Appointment Scheduling**: Complete 5-stage lifecycle (`Requested`, `Pending`, `Confirmed`, `Completed`, `Cancelled`) with doctor-specific slot conflict detection and database unique constraints.
- **Medicine Cabinet**: CRUD operations for prescribed and personal medications with dosage, frequency, and adherence tracking.
- **Emergency Health Passport**: Digital medical ID storing blood group, contact phone, uploaded photo avatar, structured allergies, and chronic conditions.
- **Digital Prescriptions**: Doctor-authored prescriptions with individual medication items and SHA-256 digital signature hashes.
- **Emergency Assistance View**: Immediate access to India's national emergency helpline (`112`), Mumbai railway police (`1512`), and ambulance contacts with confirmation dialogues.
- **Real-Time Push Updates**: Server-Sent Events (SSE) streaming updates across 5 patient event types and 3 clinician event types with `Last-Event-ID` reconnection replay.
- **Design System & Contrast**: Swiss Clinical Humanist UI theme supporting light and dark modes with WCAG 2.1 AA compliant contrast ratios.

### Outside Current Scope (Future Roadmap)

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
- **Prescription Issuance**: Authors digital prescriptions with medication line items, dosages, instructions, and automated SHA-256 integrity signatures.
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
| **Digital Prescriptions** | Both | Clinician-authored prescription management with tamper-evident SHA-256 cryptographic hashes. |
| **Emergency SOS Hub** | Patient | Quick-access emergency protocol with explicit user confirmation for dialing national emergency (`112`) and railway police (`1512`). |
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
| **Testing Engine** | Vitest | `^5.0.1` | Unit and integration test runner (241 passing tests) |
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
├── CONTRIBUTORS.md                        # Project governance, maintainers & standards
├── LICENSE                                # MIT open-source license
├── README.md                              # Main documentation entry point
├── SECURITY.md                            # Security policies, reporting & controls
├── SYSTEM_DIAGRAMS.md                     # Visual architecture diagrams and ER hierarchy
├── components.json                        # UI component library configuration
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
- **Used by**: `backend/routers.ts` through the `assessment.create` procedure.

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
| [`backend/ai/assessmentService.ts`](backend/ai/assessmentService.ts) | Clinical triage engine | `assessment.create` | Implements the 5-layer triage pipeline, biological checking, emergency pattern matching, Google Gemini Flash REST calls, and offline fallback mapping. |
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
7. **Digital Prescriptions (`/patient/prescriptions`)**: Displays official prescriptions written and authorized by clinicians, complete with individual medication items, instructions, and SHA-256 digital signature hashes.
8. **Emergency Hub (`/patient/emergency`)**: Rapid emergency assistance providing direct links to India's national emergency number (`112`), Mumbai railway police (`1512`), and ambulance helplines, complete with confirmation dialogs to prevent accidental calls.
9. **Profile & Settings (`/patient/profile`, `/patient/settings`)**: Account management interface for uploading avatar photos (validated via binary magic bytes) and toggling dark/light theme preferences.

---

## 14. Doctor Workspace Walkthrough

The Doctor Workspace is a focused clinical environment designed for healthcare professionals:

1. **Clinician Authentication (`/doctor/login`)**: Workstation login accepting official `@lifelink.com` credentials. Sessions are stored in a dedicated `doctor_session_id` cookie.
2. **Workstation Dashboard (`/doctor/dashboard`)**: Displays key clinical operational metrics: total completed consultations, pending requests requiring review, upcoming scheduled appointments for the day, and recent triage assessments submitted for the doctor's specialty.
3. **Appointments Queue (`/doctor/appointments`)**: A triage queue showing all appointment requests. Clinicians can accept bookings (`Confirmed`), mark visits finished (`Completed`), or cancel requests with real-time push updates sent to the patient's phone.
4. **Patient Roster (`/doctor/patients`)**: Lists all patients who have booked consultations with this clinician. Clicking a patient opens their detailed medical record (`/doctor/patients/:id`).
5. **Patient Detail View (`/doctor/patients/:id`)**: Displays the patient's Emergency Health Passport (blood group, allergies, chronic conditions) and past consultation history. **Enforces IDOR security**: doctors can only view patients who have an active or historical appointment with them.
6. **Consultation Workspace (`/doctor/consultation`)**: A clinical examination workspace where doctors record consultation notes and initiate prescriptions.
7. **Digital Prescription Authoring (`/doctor/prescriptions`)**: Clinicians author prescriptions by adding medication names, dosages, frequencies, and administration instructions. Upon signing, the backend generates an immutable SHA-256 integrity reference hash.
8. **Credential Setup & Reset (`/doctor/reset`)**: Administrative tool allowing clinicians to reset workstation passwords using the administrative master secret code (`LIFELINK_DEMO_DOCTOR_ACCESS_CODE`).

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
| 10 | `patientPrescriptions` | Official prescriptions | `id`, `userId`, `doctorId`, `issuedAt`, `status`, `clinicalNotes`, `integrityReference` | Foreign key to `users.id` (cascade); stores SHA-256 integrity signature hash. |
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
| `patientAuth` | `patientAuth.register` | Mutation | Registers a new patient with email, name, and Scrypt-hashed password. |
| `patientAuth` | `patientAuth.login` | Mutation | Authenticates patient credentials and sets `app_session_id` cookie. |
| `doctorAuth` | `doctorAuth.login` | Mutation | Authenticates clinician credentials and sets `doctor_session_id` cookie. |
| `doctorAuth` | `doctorAuth.resetPassword`| Mutation | Resets clinician password using administrative master access code. |
| `assessment` | `assessment.create` | Mutation | Submits symptoms to 5-layer triage pipeline and saves assessment. |
| `assessment` | `assessment.history` | Query | Retrieves patient's historical symptom assessments. |
| `patientDiscovery`| `patientDiscovery.search` | Query | Filters 52 doctors by station, specialty, railway line, or keyword. |
| `patientAppointment`| `patientAppointment.request`| Mutation | Books appointment slot with conflict detection and concurrency key. |
| `patientAppointment`| `patientAppointment.cancel` | Mutation | Cancels patient appointment and reopens time slot. |
| `patientMedicine`| `patientMedicine.list` | Query | Lists all active medicines in patient's cabinet. |
| `patientMedicine`| `patientMedicine.create` | Mutation | Adds a new medication regimen with dosage and schedule. |
| `patientProfile`| `patientProfile.update` | Mutation | Updates blood group, phone, allergies, and chronic conditions. |
| `doctorWorkspace`| `doctorWorkspace.dashboard`| Query | Returns clinical statistics, upcoming bookings, and triage counts. |
| `doctorWorkspace`| `doctorWorkspace.appointments.updateStatus` | Mutation | Clinician updates appointment status (`Confirmed`, `Completed`, `Cancelled`). |
| `doctorWorkspace`| `doctorWorkspace.patientDetail` | Query | Retrieves medical history for an assigned patient (IDOR protected). |
| `doctorWorkspace`| `doctorWorkspace.prescriptions.create` | Mutation | Issues signed prescription with medication items and SHA-256 hash. |

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
- Files exceeding 2 MB are rejected. Requests require a custom `x-lifelink-request: profile-photo` header to prevent Cross-Site Request Forgery (CSRF).

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
- Choose **Patient Portal** to register a new patient account.
- Choose **Doctor Workspace** to sign in as a clinician (e.g. `cardiology.csmt@lifelink.com` or consult `scripts/list-doctor-credentials.ts`).

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

## 26. Automated Testing Framework & Test Breakdown

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
| `backend/healthPassport.test.ts` | **12 tests** | Emergency Health Passport: blood group validation, serialized allergy/condition lists, and profile updates. |
| `backend/prescriptionLifecycle.test.ts` | **12 tests** | Multi-item prescriptions, status transitions, and SHA-256 digital signature hash verification. |
| `frontend/src/features/patient/Emergency/Emergency.test.tsx` | **11 tests** | Emergency assistance UI flows, SOS triggers, transit navigation, and modal management. |
| `backend/routers/doctor.test.ts` | **10 tests** | Doctor workstation endpoints, appointment status updates, and prescription issuance. |
| `backend/auth/doctorAuth.test.ts` | **8 tests** | Doctor Scrypt password checks, institutional email login, timing-safe password resets, and session cookies. |
| `backend/medicine.test.ts` | **7 tests** | Medicine cabinet operations, daily schedules, adherence tracking, and inventory counts. |
| `frontend/src/responsiveLayout.test.ts` | **6 tests** | Responsive rendering across 320px, 360px, 390px, 430px, 480px, 768px, and 4K screens with safe-area insets. |
| `frontend/src/features/patient/Specialists/SpecialistFinder.test.ts` | **5 tests** | Station filter, transit line filter, distance calculation, and doctor profile display. |
| `backend/discovery/mockDoctorDirectory.test.ts` | **4 tests** | Verifies 52 doctors, 1 GP per station guarantee across 19 stations, GPS coordinates, and line filters. |
| `frontend/src/features/entry/WorkspaceSelector.test.ts` | **4 tests** | Multi-role workspace switching, contrast verification, and responsive landing layout. |
| `backend/auth/providerAuth.test.ts` | **4 tests** | Clinician authorization middleware and role enforcement. |
| `frontend/src/components/layout/AppShell.test.ts` | **3 tests** | Global navigation shell, dark/light theme switching, and safe header rendering. |
| `backend/realtime/patientRealtime.test.ts` | **3 tests** | SSE connection management and patient channel subscription isolation. |
| `backend/auth/nativePatientAuth.test.ts` | **2 tests** | Native patient signup, password complexity, unique Scrypt random salting, and `timingSafeEqual` login. |
| `backend/geminiKey.test.ts` | **2 tests** | Gemini API key environment configuration and connection tests. |
| `backend/ai/assessment.validation.test.ts` | **2 tests** | Zod input schema validation for triage requests (symptoms length, age limits, gender values). |
| `frontend/src/hooks/patientInactivity.test.ts` | **2 tests** | Inactivity timeout detection and automatic session locking after 5 minutes of idle time. |
| `frontend/src/activeCopyAudit.test.ts` | **2 tests** | Copy audit ensuring professional clinical terminology across views. |
| `frontend/src/styles.motion.test.ts` | **2 tests** | Framer motion animation token validation and reduced motion compliance. |
| `frontend/src/typography.test.ts` | **2 tests** | Typography scale and tabular font rendering tests. |
| `scripts/dev.test.ts` | **2 tests** | Development server port scanner and proxy configuration tests. |
| `backend/emergencyContact.validation.test.ts` | **2 tests** | Zod schema validation for emergency contact inputs. |
| `backend/profilePhoto.test.ts` | **2 tests** | Avatar photo upload validation, magic byte verification, and size limits. |
| `backend/auth/simultaneousAuth.test.ts` | **1 test** | Dual session cookie isolation (`app_session_id` vs `doctor_session_id`). |
| `frontend/src/components/EntryThemeToggle.test.ts` | **1 test** | Theme toggle switch interaction and persistence tests. |
| `frontend/src/backgroundBranding.test.ts` | **1 test** | Official brand asset existence and path integrity tests. |
| `frontend/src/discoveryLocation.test.ts` | **1 test** | Client-side Haversine geodesic calculation tests. |
| `frontend/src/patientAuthRoutes.test.ts` | **1 test** | Patient authentication route configuration tests. |
| `backend/auth/auth.logout.test.ts` | **1 test** | Session cookie invalidation and logout tests. |
| **Total** | **241 tests** | **100% Passing Test Suite (33 Test Files)** |

---

## 27. Verified Test & Build Results

Verification checks executed on the current repository codebase:

- **Automated Tests**: **PASS** (`241 passed, 1 skipped across 33 test files` via `npm test`)
- **TypeScript Compilation**: **PASS** (`0 errors` via `npm run check`)
- **Production Build**: **PASS** (`Vite client bundle + backend esbuild bundle compiled successfully in 3.54s` via `npm run build`)
- **Browser Verification**: Browser verification was not completed because a supported browser environment was unavailable.

---

## 28. Troubleshooting Guide

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

## 29. Medical Safety & Privacy Disclaimers

### 1. Non-Diagnostic Medical Guidance Disclaimer
LifeLink is an educational and clinical assistance software platform. The AI symptom triage module generates **preliminary health guidance only**. It **does not formulate a clinical diagnosis**, prescribe pharmaceutical treatments, or replace formal medical evaluations by a qualified physician. Users experiencing severe or acute symptoms must seek immediate medical care at a hospital emergency room.

### 2. Emergency Calling Boundaries
LifeLink provides quick-dial telephone links to emergency services (`112` and `1512`). It **does not automatically dispatch ambulances, emergency vehicles, or medical responders**. Calling requires explicit user confirmation on the device.

### 3. Geolocation Data Privacy
Patient GPS coordinates are processed entirely in-memory within the user's web browser using client-side JavaScript. **Patient location data is never sent to the backend server, never written to server log files, and never stored in the database**.

---

## 30. Current Limitations & Future Enhancements

### Current Limitations
1. **Synthetic Clinical Directory**: The 52 Mumbai railway doctors are realistic synthetic profiles created for testing and demonstration. Production deployment would require official credential verification and clinical onboarding.
2. **Fixed Consultation Slots**: The scheduling engine uses predefined 30-minute intervals and does not integrate with external calendar systems (e.g., Google Calendar, Outlook).
3. **Geographic Focus**: Station lists, transit corridors, and coordinates are tailored specifically to the Mumbai Metropolitan Region. Supporting other cities would require expanding the station catalog.
4. **No Financial Processing**: Payment gateway integration, co-pays, and insurance verification are outside the current release scope.

### Future Enhancements (Planned)
1. **Telemedicine Audio/Video**: WebRTC-based video and audio consultation rooms connecting patients and clinicians directly.
2. **Multi-City Transit Expansion**: Adapting the transit directory to other metropolitan railway networks (such as Delhi Metro, Bengaluru Namma Metro, and Kolkata Metro).
3. **ABDM / FHIR Compliance**: Integrating with the Ayushman Bharat Digital Mission (ABDM) and FHIR healthcare interoperability standards.
4. **Offline Mobile App**: Packaging the patient portal as a progressive web app (PWA) with offline medication reminders and SMS backup.

---

## 31. Complete Verified NPM Script Quick Reference

All scripts verified directly from [`package.json`](package.json):

| NPM Script Command | Underlying Command Line | Purpose & Operational Behavior |
|:---|:---|:---|
| `npm run dev` | `node scripts/dev.mjs` | Starts Express backend (`:4000`) and Vite frontend (`:5173`) concurrently with API proxying. |
| `npm run build` | `vite build && esbuild backend/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist` | Builds production frontend into `dist/public` and bundles backend into `dist/index.js`. |
| `npm start` | `node dist/index.js` | Runs production server serving both the Express API and compiled frontend assets. |
| `npm run check` | `tsc --noEmit` | Executes TypeScript type-checking without emitting files (0 errors). |
| `npm test` | `vitest run` | Runs all 241 automated unit and integration tests across 33 test files. |
| `npm run format` | `prettier --write .` | Formats all code and documentation files according to Prettier formatting standards. |
| `npm run verify` | `npm run check && npm test && npm run build` | Sequentially runs type checking, test suites, and production build verification. |
| `npm run db:push` | `drizzle-kit generate --config database/drizzle.config.ts && drizzle-kit migrate --config database/drizzle.config.ts` | Generates and applies schema migrations directly to MySQL. |
| `npm run db:studio` | `drizzle-kit studio --config database/drizzle.config.ts` | Launches interactive Drizzle Studio database GUI. |
| `npm run db:sync:doctors` | `tsx scripts/sync-doctors.ts` | Populates and synchronizes all 52 Mumbai railway doctors and Scrypt password hashes. |
| `npm run db:clear` | `tsx scripts/clear-users.ts` | Safely purges test patient records while preserving all 52 doctor accounts. |
| `npm run db:delete-user` | `tsx scripts/delete-user.ts` | Selectively deletes a single user account by email. |

---

## 32. Modular Documentation Index & Cross-References

For deeper technical deep-dives, consult the specialized documentation guides in the repository:

- 📐 [**System Architecture Guide (ARCHITECTURE.md)**](ARCHITECTURE.md) — Comprehensive technical reference on system layers, tRPC procedures, and sequence lifecycles.
- 🗄️ [**Relational Database Guide (DATABASE.md)**](DATABASE.md) — Detailed schema breakdown of all 14 tables, columns, constraints, and relationships.
- 🚀 [**Installation & Setup Guide (SETUP.md)**](SETUP.md) — Step-by-step local setup, environment configuration, and database management guide.
- 🧪 [**Automated Testing Guide (TESTING.md)**](TESTING.md) — Complete 33-suite test breakdown, execution commands, and security verification matrix.
- 🔒 [**Security Policy & IDOR Controls (SECURITY.md)**](SECURITY.md) — Vulnerability disclosure process, cryptographic Scrypt hashing, and dual cookie isolation.
- 📊 [**System Architecture & Technical Diagrams (SYSTEM_DIAGRAMS.md)**](SYSTEM_DIAGRAMS.md) — Entity-relationship diagrams, directory layout, and Mermaid sequence charts.
- 👥 [**Governance & Contributors (CONTRIBUTORS.md)**](CONTRIBUTORS.md) — Project leadership, maintainer standards, and code hygiene guidelines.
- 📋 [**Release Changelog (CHANGELOG.md)**](CHANGELOG.md) — Complete version release history and technical changelog notes.
- ⚖️ [**Open Source License (LICENSE)**](LICENSE) — MIT License terms and conditions.

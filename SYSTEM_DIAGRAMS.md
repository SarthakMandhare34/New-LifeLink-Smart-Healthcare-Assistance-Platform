# LifeLink — System Architecture & Technical Diagrams

A comprehensive visual and technical reference illustrating the software architecture, database relations, API structures, activity lifecycles, and sequence workflows for the LifeLink Healthcare Platform.

---

## 📑 Table of Contents

1. [Project Files & Directory Architecture](#1-project-files--directory-architecture)
2. [Relational Database Entity-Relationship Diagram (14 Tables)](#2-relational-database-entity-relationship-diagram-14-tables)
3. [UML Class & Structure Diagrams](#3-uml-class--structure-diagrams)
4. [System Activity Lifecycles & State Machines](#4-system-activity-lifecycles--state-machines)
5. [Sequence Lifecycles & End-to-End Execution Flows](#5-sequence-lifecycles--end-to-end-execution-flows)
6. [How to Run & Verify from Scratch](#6-how-to-run--verify-from-scratch)
7. [Production Cloud Infrastructure & Network Deployment Topology Diagram](#7-production-cloud-infrastructure--network-deployment-topology-diagram)

---

## 1. Project Files & Directory Architecture

```text
LifeLink-Smart-Healthcare-Assistance-Platform/
│
├── 🗄️ DATABASE PERSISTENCE LAYER [Related to: Section 2 ER Diagram]
│   ├── database/schema.ts                 <-- [EDIT] Drizzle MySQL schema (14 relational tables & relations)
│   ├── database/drizzle.config.ts         <-- [READ] Database connection & Drizzle Studio config
│   └── database/migrations/               <-- [AUTO] Versioned SQL migration history
│
├── ⚙️ BACKEND API & SERVICES LAYER [Related to: Section 3 Class & Section 5 Sequence Diagrams]
│   ├── backend/_core/index.ts             <-- [READ] Express entry point, cookie parsers, Vite dev middleware
│   ├── backend/_core/context.ts           <-- [READ] Dual session context parser (app_session_id & doctor_session_id)
│   ├── backend/_core/trpc.ts              <-- [READ] tRPC procedures (publicProcedure, protectedProcedure, doctorProcedure)
│   ├── backend/routers.ts                 <-- [EDIT] Master tRPC appRouter definition
│   ├── backend/routers/
│   │   ├── patient.ts                     <-- [EDIT] Patient APIs (auth, health passport, appointments, medicines)
│   │   └── doctor.ts                      <-- [EDIT] Doctor APIs (queue triage, consultations, digital prescriptions)
│   ├── backend/db.ts                      <-- [EDIT] Type-safe Drizzle SQL queries & relational helpers
│   ├── backend/ai/assessmentService.ts    <-- [EDIT] 5-layer AI symptom triage & Gemini Flash cascade engine
│   ├── backend/realtime/eventBus.ts       <-- [EDIT] Scoped Server-Sent Events (SSE) notification broadcaster
│   ├── backend/storage.ts                 <-- [READ] Cloud S3 / local profile asset storage adapter
│   ├── backend/syntheticDoctor.ts        <-- [READ] 52 Mumbai specialist accounts provisioning helpers
│   └── backend/auth/                      <-- [READ] Scrypt hashing with 16-byte random salts, JWT issuance, Google OAuth
│
├── 💻 FRONTEND CLIENT INTERFACE LAYER [Related to: Section 3 Component & Section 4 Activity Diagrams]
│   ├── frontend/src/App.tsx               <-- [EDIT] React Router hierarchy (/patient/*, /doctor/*, /workspace)
│   ├── frontend/src/index.css             <-- [EDIT] Swiss Clinical Humanist design tokens, high-contrast dark mode, WCAG 2.1 AA rules
│   ├── frontend/src/components/layout/
│   │   ├── AppShell.tsx                   <-- [EDIT] Patient portal navigation, drawer & header shell
│   │   └── DoctorAppShell.tsx             <-- [EDIT] Clinician workspace navigation, drawer & header shell
│   ├── frontend/src/components/ui/
│   │   ├── Card.tsx                       <-- [EDIT] High-contrast clinical container primitive
│   │   ├── Button.tsx                     <-- [EDIT] Accessible button primitive
│   │   └── Popup.tsx                      <-- [EDIT] Modal dialog with useId accessibility
│   ├── frontend/src/hooks/
│   │   ├── patientInactivity.ts           <-- [EDIT] 5-minute inactivity session tracking hook
│   │   ├── usePatientRealtime.ts          <-- [EDIT] Patient Server-Sent Events subscription hook
│   │   └── useDoctorRealtime.ts           <-- [EDIT] Doctor Server-Sent Events subscription hook
│   └── frontend/src/features/
│       ├── patient/
│       │   ├── Dashboard/                 <-- [EDIT] Aggregated clinical overview
│       │   ├── Assessment/                <-- [EDIT] 5-stage AI Symptom Checker & Triage interface
│       │   ├── Specialists/               <-- [EDIT] Mumbai Specialist Rail Network directory & Leaflet map
│       │   ├── Appointments/              <-- [EDIT] Appointment booking & consultation history
│       │   ├── HealthPassport/            <-- [EDIT] Medical passport, chronic conditions, emergency contacts
│       │   ├── Medicines/                 <-- [EDIT] Medicine cabinet & schedule tracker
│       │   ├── Prescriptions/             <-- [EDIT] Patient digital prescription records
│       │   ├── Emergency/                 <-- [EDIT] Emergency SOS 112 rapid dispatch view
│       │   ├── Profile/                   <-- [EDIT] Patient profile & avatar management
│       │   └── Settings/                  <-- [EDIT] Patient preferences & appearance
│       ├── doctor/
│       │   ├── Dashboard/                 <-- [EDIT] Doctor appointments queue & clinical statistics
│       │   ├── Appointments/              <-- [EDIT] Clinical consultation queue & scheduling
│       │   ├── Patients/                  <-- [EDIT] Patient roster & medical history view
│       │   ├── Consultations/             <-- [EDIT] Clinical consultation & notes workspace
│       │   ├── Prescriptions/             <-- [EDIT] Digital prescription authoring & SHA-256 signer
│       │   ├── Assessments/               <-- [EDIT] Specialty triage assessments review
│       │   ├── Profile/                   <-- [EDIT] Clinician credentials & hospital affiliation
│       │   ├── Settings/                  <-- [EDIT] Clinician workstation preferences
│       │   ├── Login.tsx                  <-- [EDIT] Clinician credential authentication (split layout)
│       │   └── ResetPassword.tsx          <-- [EDIT] Clinician password recovery workflow (split layout)
│       └── entry/
│           ├── Login.tsx                  <-- [EDIT] Patient login (credentials & Google OAuth, split layout)
│           ├── Register.tsx               <-- [EDIT] Patient registration (credentials & Google OAuth, split layout)
│           └── WorkspaceSelector.tsx      <-- [EDIT] Portal chooser (Patient vs Doctor Workspace)

│
├── 🌐 ISOMORPHIC SHARED DOMAIN LAYER
│   ├── shared/biologicalValidation.ts     <-- [READ] Deterministic biological consistency rules
│   ├── shared/const.ts                    <-- [READ] Cookie tokens, session timeouts, role enums
│   ├── shared/mumbaiRailNetwork.ts        <-- [READ] Mumbai Suburban rail stations & corridors
│   └── shared/types.ts                    <-- [READ] Cross-boundary TypeScript schemas & contracts
│
└── 🛠️ RUNTIME & SETUP SCRIPTS
    ├── scripts/init-db.ts                 <-- [RUN] Idempotently provisions 'lifelink' database in MySQL
    ├── scripts/sync-doctors.ts            <-- [RUN] Audits & synchronizes 52 doctor accounts in MySQL
    ├── scripts/generate-sql-seed.ts       <-- [RUN] Generates zero-dependency seed_doctors.sql script
    ├── scripts/clear-users.ts             <-- [RUN] Atomically wipes test patient data while preserving 52 doctors
    ├── scripts/delete-user.ts             <-- [RUN] Selectively deletes a single user account by email
    ├── scripts/list-doctor-credentials.ts <-- [RUN] Displays verified clinician credentials for login
    ├── scripts/seed-doctors.ts            <-- [RUN] Seeds 52 doctor accounts via Drizzle ORM
    └── scripts/dev.mjs                    <-- [RUN] Development runtime orchestrator (Vite on 5173, Express on 4000 with fallbacks)
```

---

## 2. Entity-Relationship (ER) Diagram

### Visual Relational Hierarchy
```text
users (Central Identity & Role Registry)
│
├── 1 : 1 ──> patientCredentials (email, passwordHash)
├── 1 : 1 ──> syntheticDoctorCredentials (doctorId, email, passwordHash)
├── 1 : N ──> patientProviderIdentities (OAuth provider, providerUserId)
├── 1 : 1 ──> patientProfiles (bloodGroup, phone, allergiesJson, conditionsJson)
│
├── 1 : N ──> patientAssessments (symptoms, duration, urgency: LOW/MODERATE/EMERGENCY/ERROR, specialty)
├── 1 : N ──> patientAppointments (doctorId, scheduledAt, status: Requested/Confirmed/Completed/Cancelled)
├── 1 : N ──> patientMedicines (name, dosage, frequency, schedule, quantity)
├── 1 : N ──> patientEmergencyContacts (name, relationship, phone)
├── 1 : N ──> patientEvents (type: APPOINTMENT_UPDATED, ASSESSMENT_COMPLETED, PRESCRIPTION_CREATED)
├── 1 : N ──> doctorEvents (type: APPOINTMENT_REQUESTED, APPOINTMENT_CANCELLED)
├── 1 : N ──> bookingErrors (audit log of booking conflicts and past-date attempts)
│
└── 1 : N ──> patientPrescriptions (doctorId, status: UNSIGNED/SIGNED, integrityReference)
              │
              └── 1 : N ──> patientPrescriptionItems (name, dosage, instructions)
```

### Complete Mermaid ER Diagram
```mermaid
erDiagram
    users ||--o| patientCredentials : "1:1"
    users ||--o| syntheticDoctorCredentials : "1:1"
    users ||--o{ patientProviderIdentities : "1:N"
    users ||--o| patientProfiles : "1:1"
    users ||--o{ patientEmergencyContacts : "1:N"
    users ||--o{ patientMedicines : "1:N"
    users ||--o{ patientAssessments : "1:N"
    users ||--o{ patientAppointments : "1:N"
    users ||--o{ patientPrescriptions : "1:N"
    users ||--o{ patientEvents : "1:N"
    users ||--o{ doctorEvents : "1:N"
    patientPrescriptions ||--o{ patientPrescriptionItems : "1:N"

    users {
        int id PK
        varchar openId UK
        text name
        varchar email
        varchar loginMethod
        enum role
        timestamp createdAt
        timestamp updatedAt
        timestamp lastSignedIn
    }

    patientCredentials {
        int id PK
        int userId FK, UK
        varchar email UK
        varchar passwordHash
    }

    syntheticDoctorCredentials {
        int id PK
        int userId FK, UK
        varchar doctorId UK
        varchar email UK
        varchar passwordHash
    }

    patientProfiles {
        int id PK
        int userId FK, UK
        varchar bloodGroup
        varchar phone
        varchar avatarKey
        text allergiesJson
        text conditionsJson
    }

    patientEmergencyContacts {
        int id PK
        int userId FK
        varchar name
        varchar relationship
        varchar phone
    }

    patientMedicines {
        int id PK
        int userId FK
        varchar name
        varchar dosage
        varchar frequency
        varchar schedule
        int quantity
    }

    patientAssessments {
        int id PK
        int userId FK
        text symptoms
        int age
        varchar gender
        varchar duration
        enum urgency
        text reason
        varchar specialty
        text guidance
    }

    patientAppointments {
        int id PK
        int userId FK
        varchar doctorId
        text reason
        timestamp scheduledAt
        enum status
    }

    patientPrescriptions {
        int id PK
        int userId FK
        varchar doctorId
        timestamp issuedAt
        enum status
        text clinicalNotes
        varchar integrityReference
    }

    patientPrescriptionItems {
        int id PK
        int prescriptionId FK
        varchar name
        varchar dosage
        text instructions
    }

    patientEvents {
        int id PK
        int userId FK
        enum type
        varchar entityId
    }

    doctorEvents {
        int id PK
        varchar doctorId
        int patientUserId FK
        enum type
        varchar entityId
    }
```

---

## 3. Dual-Session Architecture & Class Diagram

```mermaid
classDiagram
    direction TB

    class ClientLayer {
        +AppShell (Patient)
        +DoctorAppShell (Clinician)
        +Card (Swiss Clinical Surface)
        +registerPatientInactivityTimer()
    }

    class TRPCClientContext {
        +Cookie: app_session_id
        +Cookie: doctor_session_id
    }

    class ServerContextParser {
        +extractPatientUser()
        +extractDoctorUser()
    }

    class AppRouter {
        +patientAuthRouter
        +patientDashboardRouter
        +patientAppointmentRouter
        +patientPrescriptionRouter
        +assessmentRouter
        +doctorWorkspaceRouter
    }

    class SafetyTriageCascade {
        +checkBiologicalImpossibility()
        +hasEmergencyPattern()
        +invokeGemini()
        +parseModelContent()
    }

    class RealtimeBroadcaster {
        +publishPatientEvent()
        +publishDoctorEvent()
    }

    class DrizzleDatabase {
        +getDb()
        +createPatientAssessment()
        +createDoctorAuthorizedPrescription()
        +updateDoctorAppointmentStatus()
    }

    ClientLayer --> TRPCClientContext : Dispatches Queries/Mutations
    TRPCClientContext --> ServerContextParser : Passes Dual Session Cookies
    ServerContextParser --> AppRouter : Injects ctx.user & ctx.doctor
    AppRouter --> SafetyTriageCascade : Evaluates AI Symptom Triage
    AppRouter --> DrizzleDatabase : Executes Type-Safe SQL
    AppRouter --> RealtimeBroadcaster : Emits Scoped SSE Updates
```

---

## 4. Activity Workflows

### A. 5-Layer Clinical AI Symptom Triage
```mermaid
flowchart TD
    Start([Patient Enters Symptoms & Vitals]) --> BioCheck{Layer 1: Biological Impossibility?}
    BioCheck -- Detected (e.g. Male Pregnancy) --> BioResp[Return Biological Override with 0ms Delay]
    BioCheck -- Clean --> EmerCheck{Layer 2: Emergency Pattern Regex?}
    EmerCheck -- Matches Red Flags --> EmerResp[Return Hardcoded EMERGENCY Urgency with 0ms Delay]
    EmerCheck -- Clean --> GeminiCall[Layer 3: Execute Google Gemini Flash Cascade]
    GeminiCall --> ModelSuccess{Model Responded?}
    ModelSuccess -- No / Quota Exceeded --> SafeFallback[Layer 5: Return Deterministic Safe Offline Triage]
    ModelSuccess -- Yes --> PostProcess[Layer 4: Apply Pediatric Safeguards & Non-Medical Filters]
    PostProcess --> UrgencyCheck{Triage Result}
    UrgencyCheck -- EMERGENCY --> RedBadge[Render Red Alert & SOS Emergency Action]
    UrgencyCheck -- MODERATE --> SpecBadge[Render Urgency Badge & Mumbai Specialist Match]
    UrgencyCheck -- LOW --> SelfCare[Render Self-Care Guidance]
    UrgencyCheck -- ERROR --> ErrBadge[Render Non-Medical Input Rejection Alert]
    BioResp --> SaveDB[Persist Assessment in MySQL & Emit SSE]
    EmerResp --> SaveDB
    SafeFallback --> SaveDB
    RedBadge --> SaveDB
    SpecBadge --> SaveDB
    SelfCare --> SaveDB
    ErrBadge --> SaveDB
    SaveDB --> End([Render Response to Patient])
```

### B. Doctor Consultation & Cryptographic Prescription Signing
```mermaid
flowchart TD
    DocLogin([Doctor Logs in via /doctor/login]) --> DocDash[View Appointments on Clinical Dashboard]
    DocDash --> AcceptAppt[Accept Requested Appointment -> Status: Confirmed]
    AcceptAppt --> NotifyPatient[SSE Emits APPOINTMENT_UPDATED to Patient]
    NotifyPatient --> Consult[Doctor Conducts Consultation & Reviews Health Passport]
    Consult --> WriteRx[Add Medications, Dosages, and Instructions]
    WriteRx --> SignRx[Doctor Signs Digital Prescription]
    SignRx --> ComputeHash[Compute SHA-256 Cryptographic Integrity Reference]
    ComputeHash --> SaveRx[Persist Prescription in MySQL with Status 'SIGNED']
    SaveRx --> EmitRxSSE[SSE Emits PRESCRIPTION_CREATED]
    EmitRxSSE --> SyncCabinet[Patient Medicine Cabinet Auto-Refreshes in Real Time]
    SyncCabinet --> CompleteAppt[Mark Appointment as Completed]
    CompleteAppt --> Done([Consultation Finalized])
```

### C. 5-Minute Inactivity Session Termination
```mermaid
flowchart TD
    UserActive([User Interacts with Portal]) --> StartTimer[Start 5-Minute Timer (300,000 ms)]
    StartTimer --> ActivityDetected{User Event: mouse/key/touch/scroll?}
    ActivityDetected -- Yes --> StartTimer
    ActivityDetected -- No Activity for 5 Mins --> TriggerExpire[Trigger Session Timeout Handler]
    TriggerExpire --> InvalidateSession[Clear Session Cookies via /api/trpc/auth.logout]
    InvalidateSession --> ShowToast[Display Inactivity Toast Notification]
    ShowToast --> RedirectLogin[Redirect to /login with Replace History]
```

### D. Regional Scope: Current Mumbai Suburban Reference vs. Pan-India Modular Expansion
```mermaid
flowchart TD
    subgraph CoreEngine["LifeLink Core Platform (Region-Agnostic)"]
        TRPC[tRPC v11 API & Procedures]
        AI[5-Layer AI Clinical Triage]
        Auth[Scrypt Auth & Dual Sessions]
        Appt[Multi-Doctor Slot Scheduling]
        SSE[Server-Sent Events Realtime Engine]
    end

    subgraph ActiveScope["Current Operational Scope (Mumbai Metropolitan Region)"]
        MMR_Data[Local Proximity: 19 Railway Stations & Corridors]
        MMR_Docs[52 Mumbai Railway Specialists Directory]
    end

    subgraph PanIndiaRoadmap["Future Pan-India Expansion (Location-Based Registries)"]
        METRO["Major Metropolitan Cities: Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune"]
        TIER2["Tier-2 & Tier-3 District Hospitals"]
        RURAL["Rural Primary & Community Health Centres: PHCs / CHCs"]
        LANG["Multilingual Regional Language Support"]
    end

    ActiveScope --> CoreEngine
    PanIndiaRoadmap -.->|Location & PIN-Code Catalogs| CoreEngine
```

---

## 5. Sequence Diagrams

### A. AI Symptom Evaluation Sequence
```mermaid
sequenceDiagram
    autonumber
    actor Patient as Patient
    participant UI as frontend (AIAssessment.tsx)
    participant Router as backend/routers.ts (assessment)
    participant Safety as backend/ai/assessmentService.ts
    participant Gemini as Google Gemini Flash API
    participant DB as backend/db.ts (MySQL)
    participant SSE as backend/realtime/eventBus.ts

    Patient->>UI: Enters symptoms, age, gender, duration & submits
    UI->>Router: assessment.analyze({ symptoms, age, gender, duration })
    Router->>Safety: analyzeAssessmentWithGemini(input)
    Safety->>Safety: Layer 1: checkBiologicalImpossibility()
    Safety->>Safety: Layer 2: hasEmergencyPattern()
    alt Emergency Pattern Detected
        Safety-->>Router: Immediate Emergency Override (0ms)
    else Clean Input
        Safety->>Gemini: invokeGemini() with JSON Schema
        Gemini-->>Safety: Structured JSON payload
        Safety->>Safety: Layer 4: parseModelContent() (Pediatric & Minor Safeguards)
        Safety-->>Router: Validated AssessmentResult
    end
    Router->>DB: INSERT INTO patientAssessments
    Router->>SSE: publishPatientEvent(userId, "ASSESSMENT_COMPLETED")
    Router-->>UI: 200 OK (Urgency Badge, Specialty, Reason, Guidance)
```

### B. Prescription Issuance & Real-Time Sync Sequence
```mermaid
sequenceDiagram
    autonumber
    actor Doctor as Doctor
    participant DocUI as frontend (Prescriptions)
    participant DocRouter as backend/routers/doctor.ts
    participant DB as backend/db.ts (MySQL)
    participant SSE as backend/realtime/eventBus.ts
    participant PatUI as frontend (MedicineCabinet)

    Doctor->>DocUI: Selects Patient, inputs line items & clicks "Sign Prescription"
    DocUI->>DocRouter: doctorWorkspace.prescriptions.issue({ patientId, items, notes })
    DocRouter->>DocRouter: Generates SHA-256 integrity hash
    DocRouter->>DB: INSERT INTO patientPrescriptions (status: 'SIGNED', integrityReference)
    DocRouter->>DB: INSERT INTO patientPrescriptionItems
    DocRouter->>SSE: publishPatientEvent(patientId, "PRESCRIPTION_CREATED")
    SSE-->>PatUI: Live SSE Stream event received
    PatUI->>PatUI: Invalidates tRPC React Query cache
    PatUI->>Doctor: Medicine Cabinet & Prescriptions updated live
```

---

## 6. How to Run & Verify from Scratch

```powershell
# 1. Start MySQL 8 Service
net start MySQL80

# 2. Idempotently Create Database
npx tsx scripts/init-db.ts

# 3. Apply Drizzle Schema Migrations
npm run db:push

# 4. Synchronize 52 Mumbai Railway Doctors
npm run db:sync:doctors

# 5. Start Full-Stack Development Server
npm run dev

# 6. Execute Full Verification Pipeline (Typecheck, Test, Build)
npm run verify
```

---

## 7. Production Cloud Infrastructure & Network Deployment Topology Diagram

```mermaid
graph TB
    subgraph Clients["Patient & Doctor Endpoints"]
        PatBrowser["Patient Browser (/patient/*)"]
        DocBrowser["Doctor Workstation (/doctor/*)"]
    end

    subgraph RenderEdge["Render.com Global Cloud Edge"]
        Anycast["Anycast DNS & DDoS Shield"]
        TLS["TLS 1.3 Termination (Let's Encrypt)"]
        RevProxy["HTTP/2 Reverse Proxy Router"]
    end

    subgraph RenderContainer["Render Web Service (Linux / Node.js 22 LTS Container)"]
        Express["Express HTTP Server ($PORT = 10000)"]
        StaticVite["Static Assets (/dist/public - React 19 SPA)"]
        tRPCRouter["tRPC v11 JSON-RPC Router (/trpc)"]
        SSEBus["EventBus Real-time SSE (/sse/*)"]
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




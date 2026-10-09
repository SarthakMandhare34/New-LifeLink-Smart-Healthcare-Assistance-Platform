# 📐 LifeLink — System Architecture & Technical Specifications

This document provides a comprehensive technical architecture guide for the **LifeLink Smart Healthcare Assistance Platform**. It details the structural layers, protocol boundaries, remote procedure calls, data flows, and sequence lifecycles that govern the system.

---

## 📑 Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Layered Architecture Diagram](#2-layered-architecture-diagram)
3. [Client Presentation Layer (React 19)](#3-client-presentation-layer-react-19)
4. [Isomorphic Shared Domain Layer](#4-isomorphic-shared-domain-layer)
5. [Server Application Layer (Express & Node.js)](#5-server-application-layer-express--nodejs)
6. [Type-Safe API Layer (tRPC v11)](#6-type-safe-api-layer-trpc-v11)
7. [5-Layer AI Clinical Triage Architecture](#7-5-layer-ai-clinical-triage-architecture)
8. [Real-Time Push Subsystem (Server-Sent Events)](#8-real-time-push-subsystem-server-sent-events)
9. [Relational Data Layer (Drizzle ORM & MySQL 8.0)](#9-relational-data-layer-drizzle-orm--mysql-80)
10. [Geospatial Mathematics: Client-Side Haversine Calculation](#10-geospatial-mathematics-client-side-haversine-calculation)
11. [Sequence Lifecycles & Workflows](#11-sequence-lifecycles--workflows)
12. [Production Cloud Infrastructure & Deployment Topology (Render.com & TiDB Serverless)](#12-production-cloud-infrastructure--deployment-topology-rendercom--tidb-serverless)
13. [Architectural Roadmap & Pan-India Scalability](#13-architectural-roadmap--pan-india-scalability)

---

## 1. Architectural Overview

LifeLink is architected as an **isomorphic, type-safe full-stack web application**. The platform is designed around strict separation of concerns, zero runtime client-server type drift, deterministic AI safety boundaries, and defensive healthcare security controls.

### Architectural Tenets:
- **End-to-End Type Safety**: Shared TypeScript types ensure that a schema modification in the database is automatically validated by the TypeScript compiler on both the backend API and frontend React components.
- **Dual-Session Isolation**: Patient accounts and clinician workstations operate in isolated execution domains with dedicated cryptographic session cookies.
- **Privacy-Bounded Geolocation**: Sensitive patient GPS coordinates are evaluated strictly in-memory on the client browser and are never transmitted to or logged on the backend.
- **Defensive Clinical AI**: Symptom analysis is bounded by deterministic regular expressions, biological consistency validators, and pediatric post-processors before model evaluation.

---

## 2. Layered Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT PRESENTATION LAYER                          │
│                                                                             │
│   ┌────────────────────────────────┐     ┌──────────────────────────────┐   │
│   │   Patient Portal (/patient/*)  │     │  Doctor Workspace (/doctor/*)│   │
│   │   • Triage Symptom Checker     │     │  • Workstation Queue         │   │
│   │   • Transit Specialist Finder  │     │  • Patient Medical Records   │   │
│   │   • Appointment Booking        │     │  • Clinical Consultations    │   │
│   │   • Medicine Cabinet & SOS     │     │  • SHA-256 Prescriptions     │   │
│   └───────────────┬────────────────┘     └──────────────┬───────────────┘   │
│                   │                                     │                   │
│                   ▼                                     ▼                   │
│         TanStack React Query Cache ◄───► tRPC Batch Client Link             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / JSON-RPC
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SERVER APPLICATION & API LAYER                        │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                       Express HTTP Pipeline                         │   │
│   │   • Port scanner & loopback proxy listener (4000-4004)              │   │
│   │   • Body parsers (50 MB limit for medical assets)                   │   │
│   │   • Dual session cookie verification & context extraction           │   │
│   │   • Binary magic byte profile avatar upload route                   │   │
│   └──────────────────────────────────┬──────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                        tRPC App Router Engine                       │   │
│   │   • publicProcedure      (Unauthenticated endpoints)                │   │
│   │   • protectedProcedure   (Patient-authenticated, IDOR-protected)    │   │
│   │   • doctorProcedure      (Clinician-authenticated, role-checked)    │   │
│   └──────────────┬───────────────────┬───────────────────┬──────────────┘   │
└──────────────────┼───────────────────┼───────────────────┼──────────────────┘
                   │                   │                   │
                   ▼                   ▼                   ▼
┌────────────────────────┐  ┌────────────────────┐  ┌─────────────────────────┐
│     AI TRIAGE ENGINE   │  │   REALTIME SSE BUS │  │  DATABASE PERSISTENCE   │
│  (backend/ai/)         │  │ (backend/realtime/)│  │  (Drizzle ORM / MySQL)  │
│  • Biological Checks   │  │ • Node EventBus    │  │  • 14 Relational Tables │
│  • Emergency Regex     │  │ • SSE Streamer     │  │  • Foreign Keys         │
│  • Gemini Flash JSON   │  │ • Replay Mechanism │  │  • Unique Slot Keys     │
│  • Pediatric Safeguards│  │ • Heartbeat Ping   │  │  • Connection Pooling   │
└────────────────────────┘  └────────────────────┘  └─────────────────────────┘
```

---

## 3. Client Presentation Layer (React 19)

The user interface is built on **React 19** and bundled with **Vite**:

### 1. Root Bootstrapping & Context Hierarchy
The client root initializes in [`frontend/src/main.tsx`](frontend/src/main.tsx):
- **QueryClient**: TanStack Query is configured with `retry: false` and `refetchOnWindowFocus: false` for predictable medical data flows.
- **tRPC Client**: Configured with `httpBatchLink` to combine concurrent network requests into single HTTP payloads, utilizing `superjson` for seamless serialization of JavaScript `Date` and `Set` objects.
- **ThemeProvider**: Global React Context managing clinical dark and light mode themes with `localStorage` persistence.

### 2. Route Layout Shells
- **Public Gateway (`/`)**: Renders `WorkspaceSelector.tsx`, guiding users to select their designated role.
- **Patient Shell (`AppShell.tsx`)**: Wraps patient routes (`/patient/*`). Houses the top clinical brand navigation, responsive drawer, emergency quick-dial access, and the automated 5-minute inactivity tracker.
- **Doctor Shell (`DoctorAppShell.tsx`)**: Wraps clinician routes (`/doctor/*`). Displays clinician credentials, specialty badges, clinic station localities, and secure sign-out controls.

---

## 4. Isomorphic Shared Domain Layer

The [`shared/`](shared/) directory contains code executed by both the browser and Node.js:

- **`shared/biologicalValidation.ts`**: Contains deterministic anatomical keyword lists (`FEMALE_EXCLUSIVE_PATTERNS`, `MALE_EXCLUSIVE_PATTERNS`). Validates symptom input against biological gender before API calls occur.
- **`shared/const.ts`**: Single source of truth for session cookie names (`app_session_id`, `doctor_session_id`), timeouts, and the 12 recognized clinical specialties.
- **`shared/mumbaiRailNetwork.ts`**: Declares suburban railway lines (Western, Central, Harbour), corridor sequences, and station definitions.
- **`shared/mumbaiStationCoordinates.ts`**: Defines calibrated GPS latitude and longitude coordinates for all 19 transit stations.

### Location-Based Extensibility & Pan-India Pattern

While the initial deployment and operational range are focused on the **Mumbai Metropolitan Region (MMR)** (where suburban railway stations serve as local transit landmarks for commuter proximity), the architecture decouples location data from application logic:

- **Reference Implementation (Mumbai Local Proximity)**: `mumbaiRailNetwork.ts` and `mumbaiStationCoordinates.ts` act as the initial location provider for railway-adjacent clinic mapping in Mumbai.
- **Pan-India Extensibility Architecture**:
  1. *Schema Universality*: The `doctors` table in [`database/schema.ts`](database/schema.ts) stores universal decimal coordinates (`latitude`, `longitude`) alongside location attributes (`stationCode`, `stationName`, `line`, `address`). No city-specific or railway-specific hardcoded assumptions are embedded in the schema.
  2. *Regional Location Providers*: Expansion to new cities, districts, and rural healthcare regions (e.g., Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, district hospitals, and PHCs/CHCs) requires only registering corresponding regional location and clinic dictionaries under `shared/`.
  3. *Unchanged Core Engines*: The tRPC routing tier, 5-layer AI triage engine, Scrypt authentication, 5-stage appointment state machine, and SSE streaming pipeline remain 100% agnostic to geographic locality.

---

## 5. Server Application Layer (Express & Node.js)

The backend server is initialized in [`backend/_core/index.ts`](backend/_core/index.ts):

### 1. Dynamic Port Binding & Scanner
In development mode, `scripts/dev.mjs` scans ports sequentially starting at `4000` (up to `4004`) using socket probing to guarantee clean boot even if another background process is occupying port 4000. It injects `VITE_API_PORT` into the environment for Vite reverse proxying.

### 2. HTTP Pipeline Middleware
- `express.json({ limit: "50mb" })`: High capacity body parser supporting medical profile images and rich clinical records.
- `express.urlencoded({ limit: "50mb", extended: true })`: Form payload decoding.
- Cookie parser extracting `app_session_id` and `doctor_session_id`.

### 3. Dedicated REST Endpoints
Beyond tRPC, Express mounts dedicated REST endpoints:
- `POST /api/patient/profile-photo`: Raw binary image upload with magic bytes validation.
- `GET /api/realtime/patient`: Server-Sent Events stream for patients.
- `GET /api/realtime/doctor`: Server-Sent Events stream for doctors.
- `GET /api/auth/google`, `GET /api/auth/google/callback`: Google OAuth 2.0 flow.

---

## 6. Type-Safe API Layer (tRPC v11)

All application APIs use **tRPC v11**, providing compile-time type validation across the network boundary:

### Procedure Tier Structure

```typescript
// 1. Public Procedure: Open to all visitors
export const publicProcedure = t.procedure;

// 2. Protected Patient Procedure: Strictly validates patient session
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.role === "doctor") {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Please sign in as a patient." });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// 3. Doctor Procedure: Strictly validates clinician session
export const doctorProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "doctor") {
    throw new TRPCError({ code: "FORBIDDEN", message: "This action requires an authorized doctor workstation session." });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
```

---

## 7. 5-Layer AI Clinical Triage Architecture

The clinical triage engine in [`backend/ai/assessmentService.ts`](backend/ai/assessmentService.ts) enforces five defensive layers:

```text
[ Symptom Input ] ──► [ Layer 1: Biological Consistency ]
                               │ PASS
                               ▼
                      [ Layer 2: 0ms Emergency Regex ] ──► (Emergency? Return "EMERGENCY" / 0ms)
                               │ NO EMERGENCY
                               ▼
                      [ Layer 3: Gemini Structured JSON ] ──► (Constrained to 12 specialties)
                               │ GENERATED
                               ▼
                      [ Layer 4: Pediatric Post-Processor ] ──► (Age < 18? Route to Pediatrics)
                               │ PROCESSED
                               ▼
                      [ Layer 5: Safe Offline Fallback ] ──► (Network down? Keyword fallback)
```

---

## 8. Real-Time Push Subsystem (Server-Sent Events)

Server-Sent Events (SSE) provide real-time updates without polling:

### Message Structure:
```text
id: 42
event: patient-event
data: {"id":42,"type":"APPOINTMENT_UPDATED","entityId":"15","createdAt":"2026-09-29T18:00:00.000Z"}

: heartbeat

```

### Reconnection Protocol:
1. When a client reconnects, it sends `Last-Event-ID: 42` in the HTTP request headers.
2. The server calls `getPatientEventsSince(userId, 42)`.
3. Missed events are immediately replayed over the socket in chronological order.
4. Active event listeners trigger `@tanstack/react-query` cache invalidation, updating UI components instantly.

---

## 9. Relational Data Layer (Drizzle ORM & MySQL 8.0)

All database entities are declared in [`database/schema.ts`](database/schema.ts) using Drizzle ORM:

- **14 Tables**: Full normalized relational structure with cascading foreign keys.
- **Active Slot Concurrency**: `patientAppointments` includes a generated virtual column `activeSlotKey = doctorId:scheduledAt` backed by a unique index (`patientAppointments_active_slot_unique`).
- **Connection Pooling**: Managed via `mysql2/promise` with configurable pool limits.

---

## 10. Geospatial Mathematics: Client-Side Haversine Calculation

Clinic proximity is computed on the user's browser using the **Haversine formula** ([`frontend/src/features/patient/Specialists/discoveryLocation.ts`](frontend/src/features/patient/Specialists/discoveryLocation.ts)):

$$\Delta\phi = \frac{(\text{lat}_2 - \text{lat}_1) \cdot \pi}{180}, \quad \Delta\lambda = \frac{(\text{lon}_2 - \text{lon}_1) \cdot \pi}{180}$$
$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos\left(\frac{\text{lat}_1 \cdot \pi}{180}\right) \cdot \cos\left(\frac{\text{lat}_2 \cdot \pi}{180}\right) \cdot \sin^2\left(\frac{\Delta\lambda}{2}\right)$$
$$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1 - a}\right)$$
$$d = 6371 \cdot c \quad (\text{kilometers})$$

Coordinates are calculated entirely client-side, safeguarding commuter privacy.

---

## 11. Sequence Lifecycles & Workflows

### Sequence 1: Patient Symptom Triage to Doctor Booking

```text
Patient Browser                Express / tRPC Backend            Google Gemini            MySQL Database
      │                                  │                             │                         │
      │── 1. assessment.analyze(symptoms)─>│                            │                         │
      │                                  │── 2. Biological Check       │                         │
      │                                  │── 3. Emergency Pattern Check │                         │
      │                                  │── 4. POST generateContent ─>│                         │
      │                                  │<─ 5. JSON Schema Output ────│                         │
      │                                  │── 6. Pediatric Guardrail    │                         │
      │                                  │── 7. Insert Assessment ──────────────────────────────>│
      │<─ 8. Return Triage & Specialty ──│                                                       │
      │                                  │                                                       │
      │── 9. Search Doctors near Station─>│                                                       │
      │<─ 10. Return Filtered Specialists│                                                       │
      │                                  │                                                       │
      │── 11. appointment.request ───────>│── 12. Check Slot Conflict ───────────────────────────>│
      │                                  │── 13. Insert Appointment ────────────────────────────>│
      │                                  │── 14. Dispatch SSE Event (Doctor & Patient)           │
      │<─ 15. Return Confirmed Booking ──│                                                       │
```

### Sequence 2: Doctor Consultation & Two-Phase Prescription Signing

```text
Doctor Workstation              Express / tRPC Backend                                   MySQL Database
      │                                  │                                                     │
      │── 1. doctorWorkspace.appointments>│── Fetch Doctor Appointments ───────────────────────>│
      │<─ 2. Return Queue & Details ─────│                                                     │
      │                                  │                                                     │
      │── 3. prescriptions.create ───────>│── 4. Verify Doctor Session                          │
      │      (patientId, notes, items)   │── 5. Insert Draft Prescription & Items ─────────────>│
      │                                  │      status: "UNSIGNED / CONTROLLED WORKSPACE"      │
      │<─ 6. Return Draft Prescription ──│                                                     │
      │                                  │                                                     │
      │── 7. prescriptions.sign({ id }) ─>│── 8. Verify Unsigned State & Clinician Ownership    │
      │      (Explicit Sign Mutation)    │── 9. Generate Canonical SHA-256 Hash Seal           │
      │                                  │── 10. Update Status: "SIGNED — CONTROLLED STATE" ───>│
      │                                  │── 11. Broadcast SSE: "PRESCRIPTION_CREATED"         │
      │<─ 12. Return Sealed Prescription ─│                                                     │
```

---

## 12. Production Cloud Infrastructure & Deployment Topology (Render.com & TiDB Serverless)

LifeLink is engineered for production deployment utilizing a cloud-native, decoupled topology that combines stateless container execution on **Render.com** with distributed NewSQL persistence on **TiDB Serverless Cloud**.

### 12.1 Cloud Hosting Topology & Distributed Ingress

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PUBLIC INTERNET INGRESS                           │
│   • Patients (/patient/*)               • Clinicians (/doctor/*)            │
│   • Mobile Browsers (PWA Viewport)      • Transit Kiosk Clients             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / TLS 1.3 (Port 443)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       RENDER.COM CLOUD EDGE LAYER                           │
│   • Global Anycast DNS & Edge Network                                       │
│   • Automated TLS Certificate Provisioning & Renewal (Let's Encrypt)        │
│   • HTTP/2 Multiplexed Ingress & Reverse Proxy Router                       │
│   • Immediate Chunk Streaming (Bypasses Proxy Buffering)                    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Loopback Ingress ($PORT, e.g. 10000)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   RENDER WEB SERVICE APPLICATION CONTAINER                  │
│                   Image: Alpine Linux / Node.js 22 LTS Runtime               │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │               Express Application & Static Asset Pipeline           │   │
│   │                                                                     │   │
│   │   • Static Serving: dist/public (React 19 SPA Vite Bundle)          │   │
│   │   • History API Fallback: Catch-all GET -> dist/public/index.html   │   │
│   │   • tRPC JSON-RPC Bus: POST /trpc (appRouter procedure dispatcher)   │   │
│   │   • Real-Time Gateway: GET /sse/patient & GET /sse/doctor           │   │
│   │   • Health Monitor Probe: GET /api/health                           │   │
│   │   • OAuth Handshake: /api/auth/google & /api/auth/google/callback   │   │
│   └──────────────────┬───────────────────────────────┬──────────────────┘   │
│                      │                               │                      │
└──────────────────────┼───────────────────────────────┼──────────────────────┘
                       │                               │
       ┌───────────────┴───────────────┐               │ Outbound HTTPS Requests
       │ TLS 1.3 Encrypted Wire Tunnel │               ▼
       │ Port: 4000 (rejectUnauth=true)│    ┌─────────────────────────────────┐
       ▼                               │    │     EXTERNAL CLOUD PLATFORMS    │
┌─────────────────────────────────┐    │    │                                 │
│      TiDB SERVERLESS CLUSTER    │    │    │  • Google Gemini Flash AI       │
│  (AWS ap-southeast-1 Singapore) │    │    │    (Symptom Triage Pipeline)    │
│                                 │    │    │  • Google Cloud OAuth 2.0       │
│   ┌─────────────────────────┐   │    │    │    (Strict Production Callback) │
│   │   TiDB SQL Parser Layer │   │    │    └─────────────────────────────────┘
│   │   • MySQL 8.0 Protocol  │   │    │
│   │   • Cost-based Planner  │   │    │
│   └────────────┬────────────┘   │    │
│                ▼                │    │
│   ┌─────────────────────────┐   │    │
│   │  TiKV Storage Engines   │   │    │
│   │  • Multi-Raft Consensus │   │    │
│   │  • 14 Relational Tables │   │    │
│   │  • 52 Doctor Accounts   │   │    │
│   │  • Serverless RU Auto   │   │    │
│   └─────────────────────────┘   │    │
└─────────────────────────────────┘    ┘
```

---

### 12.2 Single-Container Isomorphic Serving Pipeline

In production, LifeLink runs inside a single Node.js 22 LTS container to guarantee atomicity, eliminate cross-origin request issues (CORS), and simplify deployment:

1. **Dual-Artifact Build Process**:
   - `vite build`: Compiles the React 19 client into minified JavaScript, CSS, and optimized static assets written to `dist/public/`.
   - `esbuild backend/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`: Bundles all backend TypeScript code, tRPC routers, AI logic, and Drizzle query adapters into a single ECMAScript module (`dist/index.js`).
2. **Dynamic Port Binding**:
   - The container does not hardcode port 4000 in production. Instead, it inspects `process.env.PORT` injected dynamically by Render (commonly port `10000`) and binds Express to `0.0.0.0:$PORT`.
3. **SPA History API Fallback**:
   - When users directly access client-side URLs such as `/patient/appointments` or `/doctor/workspace`, the Express static file handler intercepts the GET request. If no physical asset or API route matches, it returns `dist/public/index.html` with status 200, allowing React Router to instantiate and mount the correct view.

---

### 12.3 Distributed Relational Engine: TiDB Serverless & MySQL 8.0 Compatibility

LifeLink utilizes **TiDB Serverless Cloud** as its production relational database:

1. **MySQL 8.0 Wire Compatibility**:
   - TiDB is fully compatible with the MySQL 8.0 client protocol. LifeLink uses the production-standard `mysql2` driver and Drizzle ORM without requiring any database driver modifications or proprietary SDKs.
2. **Storage and Compute Separation**:
   - **Compute (TiDB SQL Layer)**: Stateless SQL execution nodes accept incoming connections, parse SQL statements, validate relational schemas, and produce distributed query execution plans.
   - **Storage (TiKV Layer)**: A distributed transactional key-value store that implements Multi-Raft consensus across independent availability zones in AWS Singapore (`ap-southeast-1`). Data is automatically sharded into continuous key ranges (Regions) of ~96 MB each.
3. **Transport Encryption (TLS 1.3)**:
   - All database traffic transmitted between Render (Linux container) and TiDB Serverless travels over an encrypted TLS 1.3 tunnel.
   - The connection string requires `?ssl={"rejectUnauthorized":true}` to enforce strict CA validation, preventing unauthorized traffic interception or man-in-the-middle exploits.
4. **Serverless Auto-Scaling (RU)**:
   - TiDB automatically allocates Request Units (RU) based on real-time query volume, scaling down to zero during idle nighttime periods and elastically scaling up during peak commuter morning triage surges.

---

### 12.4 Real-Time Push Subsystem Over Cloud Reverse Proxy

Streaming real-time data over cloud proxies presents specific architectural challenges:

1. **Reverse Proxy Buffering Mitigation**:
   - Cloud reverse proxies (such as Nginx, Cloudflare, and Render's edge load balancer) typically buffer HTTP response bodies to optimize MTU packet delivery.
   - LifeLink dispatches HTTP response headers that explicitly instruct upstream proxies to bypass buffering:
     ```http
     Content-Type: text/event-stream
     Cache-Control: no-cache, no-transform
     Connection: keep-alive
     X-Accel-Buffering: no
     ```
2. **25-Second Keep-Alive Heartbeat Pulse**:
   - Render's load balancer terminates open TCP sockets that remain silent for longer than **100 seconds**.
   - LifeLink's event bus ([`backend/realtime/eventBus.ts`](backend/realtime/eventBus.ts)) maintains a scheduled interval timer that pushes an SSE comment ping (`:keepalive\n\n`) every **25 seconds** to every connected patient and clinician socket.
   - This keeps the HTTP/2 tunnel open indefinitely while consuming less than 50 bytes per minute of idle bandwidth.

---

### 12.5 Google Cloud OAuth 2.0 Security State Machine in Production

When operating behind a cloud reverse proxy:
1. **Dynamic Origin Resolution**:
   - The application relies on `AUTH_PUBLIC_BASE_URL` (`https://new-lifelink-smart-healthcare-assistance.onrender.com`) to compute the canonical `redirect_uri` for Google OAuth 2.0 authorization codes.
   - This avoids issues where reverse proxy headers (`X-Forwarded-Host`, `Host`) might otherwise report internal container hostnames (`localhost:10000`).
2. **Session Cookie Isolation**:
   - In production, session cookies are configured with `secure: true` (only transmitted over HTTPS), `httpOnly: true` (inaccessible to malicious client scripts), and `sameSite: "lax"` (protects against CSRF during cross-site navigations).

---

## 13. Architectural Roadmap & Pan-India Scalability

LifeLink's operational boundary is currently deployed in the Mumbai Metropolitan Region (using railway stations as commuter landmark anchors). The system is engineered to expand to a nationwide Pan-India footprint via the following architectural phases:

1. **Multi-City & Regional Location Registry**:
   - Introduce an abstract location provider interface (`RegionalLocationCatalog`) that dynamically loads city, district, and PIN-code datasets based on the user's selected or detected metropolitan or rural region (e.g., Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Tier-2/Tier-3 towns).
2. **Multi-Tenant / Multi-City Database Partitioning**:
   - The MySQL database schema naturally supports city, district, and state indexing. As clinical listings expand across India, queries can be partitioned by state or postal code (PIN code) without breaking relational foreign keys or appointment uniqueness invariants.
3. **Low-Bandwidth & Offline Sync (PWA)**:
   - For tier-2, tier-3, and rural health corridors where connectivity fluctuates, the client application can leverage IndexedDB and service workers for offline prescription caching and medication reminders, synchronizing back via tRPC upon network restoration.




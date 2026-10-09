# 🚀 LifeLink — Complete Local Development & Production Setup Guide

This guide provides step-by-step instructions for setting up, configuring, running, and troubleshooting the **LifeLink Smart Healthcare Assistance Platform** on your local machine, as well as pushing to the live TiDB/Render production environment.

---

## 📑 Table of Contents

1. [System Prerequisites](#1-system-prerequisites)
2. [Step-by-Step Installation](#2-step-by-step-installation)
3. [Environment Configuration (.env)](#3-environment-configuration-env)
4. [Database Provisioning & Seeding](#4-database-provisioning--seeding)
5. [Starting the Application](#5-starting-the-application)
6. [Testing the Installation](#6-testing-the-installation)
7. [Verified Test Credentials](#7-verified-test-credentials)
8. [Comprehensive Troubleshooting Guide](#8-comprehensive-troubleshooting-guide)
9. [Production Deployment Guide: Render.com & TiDB Serverless Cloud](#9-production-deployment-guide-rendercom--tidb-serverless-cloud)

---

## 1. System Prerequisites

Before starting, ensure that your computer has the following software installed:

| Tool | Minimum Version | Purpose | Verification Command |
|:---|:---:|:---|:---|
| **Node.js** | `v22.0.0+` | JavaScript runtime environment | `node -v` |
| **NPM** | `v10.0.0+` | Package manager | `npm -v` |
| **MySQL Server** | `v8.0+` | Relational database engine | `mysql -u root -p -e "SELECT VERSION();"` |
| **Git** | Any recent | Version control | `git --version` |

---

## 2. Step-by-Step Installation

### Step 1: Clone the Repository
Clone the repository using Git and navigate into the project directory:
```bash
git clone https://github.com/SarthakMandhare34/New-LifeLink-Smart-Healthcare-Assistance-Platform.git
cd New-LifeLink-Smart-Healthcare-Assistance-Platform
```

### Step 2: Install Project Dependencies
Run `npm install` to install all runtime packages, build plugins, and development tools:
```bash
npm install
```
*This command downloads and configures the exact dependencies pinned in `package-lock.json`.*

---

## 3. Environment Configuration (.env)

### Step 3: Create Your Local Environment File
Copy the provided blueprint file to create your local `.env`:
```bash
cp .env.example .env
```

Open `.env` in your code editor. Here is a sample development configuration:
```ini
# ============================================================================
# LifeLink Smart Healthcare Assistance Platform - Environment Configuration (v1.3.0)
# ============================================================================

# 1. SERVER CONFIGURATION
PORT=4000

# 2. DATABASE CONFIGURATION (MySQL)
DATABASE_URL="mysql://root:your_mysql_password@localhost:3306/lifelink"

# 3. AUTHENTICATION SECRETS
JWT_SECRET="lifelink-ultra-secure-jwt-signing-secret-development-2026"
LIFELINK_DEMO_DOCTOR_ACCESS_CODE="lifelink-controlled-clinician-secret-key-2026"

# 4. ARTIFICIAL INTELLIGENCE (Google Gemini)
# Get a free API key from https://aistudio.google.com/
GEMINI_API_KEY="your-gemini-api-key-here"

# 5. GOOGLE OAUTH PROVIDER (Optional)
GOOGLE_OAUTH_CLIENT_ID=""
GOOGLE_OAUTH_CLIENT_SECRET=""
AUTH_PUBLIC_BASE_URL="http://localhost:5173"
```

> [!NOTE]
> `GEMINI_API_KEY` is optional for basic local testing. If omitted, LifeLink's deterministic Layer 5 safety fallback automatically handles symptom triage using verified clinical keyword mapping.

---

## 4. Database Provisioning & Seeding

### Step 4: Create the Database
Ensure your MySQL server is running, then create the `lifelink` database:
```bash
npx tsx scripts/init-db.ts
```
*This executes `CREATE DATABASE IF NOT EXISTS lifelink;` safely.*

### Step 5: Push Database Tables
Generate and apply all 14 relational tables to MySQL using Drizzle Kit:
```bash
npm run db:push
```

### Step 6: Synchronize the 52 Mumbai Railway Doctors
Populate the 52 clinician workstations and Scrypt password hashes:
```bash
npm run db:sync:doctors
```
*This synchronizes all 52 specialists across Western, Central, and Harbour railway lines into the database.*

---

## 5. Starting the Application

### Step 7: Launch the Development Environment
Run the unified development orchestrator:
```bash
npm run dev
```

### What Happens When You Run `npm run dev`:
1. `scripts/dev.mjs` scans network ports starting at `4000` to find an open port.
2. The Express server boots on that port (default: `http://localhost:4000`).
3. `VITE_API_PORT` is dynamically injected into Vite's environment.
4. The Vite development server launches on `http://localhost:5173`.
5. All frontend calls to `/api` and Server-Sent Events streams are automatically proxied to Express.

Open your browser to:
```text
http://localhost:5173
```

---

## 6. Testing the Installation

To verify that all components of the platform are functioning correctly, run the full verification pipeline:

```bash
npm run verify
```

This sequentially executes:
1. `npm run check` — TypeScript type-checking (`tsc --noEmit`). Must report 0 errors.
2. `npm test` — Vitest automated test suite (`vitest run`). Must report 247 passed tests (1 skipped across 33 test files).
3. `npm run build` — Production bundling (`vite build && esbuild`). Verifies that the client and server compile into `dist/`.

---

## 7. Verified Test Credentials

### Patient Access
- Navigate to `http://localhost:5173/login` or `http://localhost:5173/register`.
- You can create any new patient account using your own email and password.

### Doctor Workstation Access
- Navigate to `http://localhost:5173/doctor/login`.
- Use any of the 52 synchronized doctor work credentials. Examples:

| Medical Specialty | Railway Station | Transit Line | Clinician Work Email | Default Password |
|:---|:---|:---:|:---|:---|
| **Cardiology** | CSMT | Central | `central-cardiology-csmt@accounts.lifelink.test` | `Doctor@123` |
| **General Practice** | Dadar | Western / Central | `western-generalpractice-dadar@accounts.lifelink.test` | `Doctor@123` |
| **Pediatrics** | Andheri | Western | `western-pediatrics-andheri@accounts.lifelink.test` | `Doctor@123` |
| **Dermatology** | Ghatkopar | Central | `central-dermatology-ghatkopar@accounts.lifelink.test` | `Doctor@123` |
| **Orthopedics** | Vashi | Harbour | `harbour-orthopedics-vashi@accounts.lifelink.test` | `Doctor@123` |

*To inspect all 52 doctor credentials, run `npx tsx scripts/list-doctor-credentials.ts`.*

---

## 8. Comprehensive Troubleshooting Guide

### Issue 1: MySQL Database Connection Fails (`ECONNREFUSED 127.0.0.1:3306`)
- **Symptom**: Terminal throws `Error: connect ECONNREFUSED 127.0.0.1:3306`.
- **Diagnosis**: The MySQL database daemon is not running on your computer.
- **Fix**:
  - **Windows**: Open Services (`services.msc`), find **MySQL80** or **MySQL**, and click **Start**.
  - **macOS**: Run `brew services start mysql`.
  - **Linux**: Run `sudo systemctl start mysql`.
  - Ensure the credentials in `DATABASE_URL` match your MySQL username and password.

### Issue 2: Port Collision (`EADDRINUSE: 4000`)
- **Symptom**: Terminal reports that port 4000 is occupied.
- **Diagnosis**: Another background process or previous terminal run is holding the port.
- **Fix**: The development orchestrator (`node scripts/dev.mjs`) automatically scans ports 4000-4004. If all 5 ports are occupied, find and kill the hanging process:
  ```powershell
  # Windows PowerShell
  netstat -ano | findstr :4000
  taskkill /PID <PID_NUMBER> /F
  ```

### Issue 3: "Invalid credentials" When Logging in as a Doctor
- **Symptom**: Doctor login screen reports invalid email or password.
- **Diagnosis**: Doctor accounts have not been seeded into MySQL.
- **Fix**: Run `npm run db:sync:doctors` in your terminal. This creates all 52 doctor accounts with fresh Scrypt password hashes.

### Issue 4: Appointment Time Slot Unavailable
- **Symptom**: Booking returns an error: `"This appointment time slot is no longer available."`
- **Diagnosis**: That specific 30-minute time slot is already booked for that specific doctor, or the chosen time is in the past.
- **Fix**: Select a different time slot or another doctor. Availability is strictly doctor-scoped.

### Issue 5: Profile Photo Upload Fails (`Use a JPG, PNG, or WebP image`)
- **Symptom**: Uploading an avatar photo returns a validation error.
- **Diagnosis**: The image is either larger than 10 MB or the binary header does not match its file extension.
- **Fix**: Ensure the image is under 10 MB and is a genuine JPEG, PNG, or WebP file.

---

## 9. Production Deployment Guide: Render.com & TiDB Serverless Cloud

This section covers deploying LifeLink to a 24/7 cloud environment using **Render.com** (for the full-stack web service) and **TiDB Serverless Cloud** (for the distributed MySQL database).

🌍 **Live Production Reference:** [https://new-lifelink-smart-healthcare-assistance.onrender.com/](https://new-lifelink-smart-healthcare-assistance.onrender.com/)

---

### Step 1: Provision TiDB Serverless Cloud Database

1. Navigate to [TiDB Cloud](https://tidbcloud.com/) and register or log in with your Google or GitHub account.
2. In the TiDB Cloud Console, click **Create Cluster** (or **Create Project**).
3. Select the **Serverless** cluster type:
   - **Cost**: Free Tier (includes 5 GiB storage and 50 million Request Units monthly).
   - **Cloud Provider**: AWS.
   - **Region**: Choose the region closest to your deployment, such as `ap-southeast-1` (Singapore).
4. Set a cluster name (e.g., `lifelink-db`) and define a strong root password.
5. Once the cluster is active (typically 10-20 seconds), click **Connect**:
   - Choose **Connect with: General**.
   - Copy the generated connection string. It will look like:
     ```text
     mysql://3EF4bZSNjaGdwTj.root:<YOUR_PASSWORD>@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test
     ```
6. **Enforce SSL/TLS**: TiDB Cloud requires TLS 1.3 certificate validation. Append the SSL query parameter to the end of the URL:
   ```text
   ?ssl={"rejectUnauthorized":true}
   ```
   **Final Cloud Database URL Format**:
   ```text
   mysql://3EF4bZSNjaGdwTj.root:<YOUR_PASSWORD>@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}
   ```

---

### Step 2: Push Schema Migrations & Seed Doctors from Developer CLI

Before launching the web service on Render, apply the 14 relational database tables and synchronize all 52 doctor workstation accounts directly to the remote TiDB database.

Run these commands in your local terminal using `cross-env` to ensure proper quotation handling across Windows PowerShell and macOS/Linux:

```powershell
# 1. Apply Drizzle Schema Migrations to TiDB Cloud
npx cross-env DATABASE_URL='mysql://3EF4bZSNjaGdwTj.root:<YOUR_PASSWORD>@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}' npm run db:push

# 2. Seed All 52 Mumbai Railway Specialists to TiDB Cloud
npx cross-env DATABASE_URL='mysql://3EF4bZSNjaGdwTj.root:<YOUR_PASSWORD>@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}' npm run db:sync:doctors
```

**Verification Output**:
- `npm run db:push` will display: `14 tables migrated successfully`.
- `npm run db:sync:doctors` will log: `Verified 52 Mumbai railway doctors synchronized with valid Scrypt credentials`.

---

### Step 3: Configure Google Cloud OAuth 2.0 Credentials

If enabling Google Sign-In for patients, configure your OAuth Client in the [Google Cloud Console](https://console.cloud.google.com/):

1. Go to **APIs & Services $\rightarrow$ Credentials**.
2. Click your OAuth 2.0 Client ID (or create a new one under Web Application).
3. Under **Authorized JavaScript Origins**, add both development and production domains:
   - `https://new-lifelink-smart-healthcare-assistance.onrender.com`
   - `http://localhost:5173`
4. Under **Authorized Redirect URIs**, register the exact callback endpoints:
   - `https://new-lifelink-smart-healthcare-assistance.onrender.com/api/auth/google/callback`
   - `http://localhost:5173/api/auth/google/callback`
5. Click **Save**.

---

### Step 4: Create the Render.com Web Service

1. Navigate to the [Render Dashboard](https://dashboard.render.com/) and sign in with GitHub.
2. Click **New +** in the top navigation bar and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect:
   - Repository: `SarthakMandhare34/New-LifeLink-Smart-Healthcare-Assistance-Platform`
4. Configure the service settings:
   - **Name**: `new-lifelink-smart-healthcare-assistance`
   - **Region**: Singapore (Southeast Asia) *(recommended to match TiDB AWS ap-southeast-1)*
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

---

### Step 5: Configure Production Environment Variables on Render

In the **Environment Variables** section on Render, add the following key-value pairs:

| Environment Key | Required | Value / Example | Notes |
|:---|:---:|:---|:---|
| `NODE_ENV` | **Yes** | `production` | Enables Express production optimizations. |
| `DATABASE_URL` | **Yes** | `mysql://3EF4bZSNjaGdwTj.root:<PASSWORD>@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}` | Your TiDB Cloud connection string with SSL parameter. |
| `JWT_SECRET` | **Yes** | *(Generate a 64-char random string)* | Used for cryptographic signing of session JWTs. |
| `LIFELINK_DEMO_DOCTOR_ACCESS_CODE` | **Yes** | `lifelink-controlled-clinician-secret-key-2026` | Master access code for doctor account provisioning. |
| `GEMINI_API_KEY` | **Yes** | `AIzaSy...` | Your Google Gemini API key for symptom triage. |
| `GOOGLE_OAUTH_CLIENT_ID` | Optional | `420856394354-...apps.googleusercontent.com` | Google Cloud OAuth Client ID. |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Optional | `GOCSPX-...` | Google Cloud OAuth Client Secret. |
| `AUTH_PUBLIC_BASE_URL` | **Yes** | `https://new-lifelink-smart-healthcare-assistance.onrender.com` | **Critical**: Sets canonical public origin for OAuth callbacks. |

Click **Save Changes** and trigger the manual deploy if it does not start automatically.

---

### Step 6: Post-Deployment Smoke Test & Verification

Once Render displays **Deploy live** with a green status indicator, verify core subsystems:

1. **Production Health Check**:
   Navigate to `https://new-lifelink-smart-healthcare-assistance.onrender.com/api/health`.
   Expected response:
   ```json
   { "status": "ok", "uptime": 12.4 }
   ```
2. **Patient Registration & Login**:
   - Visit `https://new-lifelink-smart-healthcare-assistance.onrender.com/register`.
   - Register a new test patient account and verify redirection to `/patient/dashboard`.
3. **Doctor Workstation Authentication**:
   - Visit `https://new-lifelink-smart-healthcare-assistance.onrender.com/doctor/login`.
   - Sign in using:
     - Email: `central-cardiology-csmt@accounts.lifelink.test`
     - Password: `Doctor@123`
   - Verify that the clinician dashboard displays consultation queue metrics.
4. **Real-Time Push Verification**:
   - Open browser Developer Tools $\rightarrow$ **Network** tab $\rightarrow$ filter by `EventStream` or `Fetch/XHR`.
   - Verify `/sse/patient` (or `/sse/doctor`) remains in status `200 Pending` and receives periodic `:keepalive` comment pulses every 25 seconds.

---

### Step 7: Production Troubleshooting

| Symptom | Probable Cause | Immediate Resolution |
|:---|:---|:---|
| **`SSL connect error` or `Handshake failed`** | Missing SSL parameter in `DATABASE_URL`. | Append `?ssl={"rejectUnauthorized":true}` to `DATABASE_URL` in the Render Environment tab. |
| **`Error 400: redirect_uri_mismatch` on Google Login** | Google Cloud Console callback URI does not match `AUTH_PUBLIC_BASE_URL`. | Ensure `https://new-lifelink-smart-healthcare-assistance.onrender.com/api/auth/google/callback` is added under Authorized Redirect URIs in Google Cloud Console. |
| **Initial Page Load Takes ~40 Seconds** | Render Free Tier container cold start. | The free tier hibernates after 15 minutes of inactivity. The initial wake-up takes 30-50s. Subsequent requests load in under 200ms. External monitors (e.g. UptimeRobot) can ping `/api/health` every 10 minutes to maintain hot standby. |
| **`ECONNREFUSED` on Port 4000 on Render** | Hardcoded port instead of `$PORT`. | LifeLink automatically reads `process.env.PORT` assigned by Render. Ensure `PORT` is not manually overridden in Render environment settings. |




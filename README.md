# 🏥 LifeLink — Smart Healthcare Assistance Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v22%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tests Passing](https://img.shields.io/badge/Vitest-50%20Tests%20Passed-success?style=for-the-badge&logo=vitest&logoColor=white)](#-automated-testing)

**LifeLink** is a full-stack healthcare assistance platform built for **Mumbai, India**. It connects patients with **52 verified doctors** through an **AI-powered symptom triage engine** (Google Gemini), an **interactive Mumbai railway clinic map** (Leaflet + OpenStreetMap), and a **cryptographically secured digital prescription system** (SHA-256).

---

## 📑 Table of Contents

1. [🎯 Problem Statement](#-problem-statement)
2. [⚙️ Technology Stack](#️-technology-stack)
3. [✨ Core Features](#-core-features)
4. [🛡️ Security Architecture](#️-security-architecture)
5. [🩺 Mumbai Doctor Directory (52 Doctors)](#-mumbai-doctor-directory-52-doctors)
6. [🔐 Environment Configuration](#-environment-configuration)
7. [🚀 Local Development Setup (Step-by-Step)](#-local-development-setup-step-by-step)
8. [📦 NPM Script Reference](#-npm-script-reference)
9. [🗺️ Application Routes](#️-application-routes)
10. [📁 Project Structure](#-project-structure)
11. [🗄️ Database Schema (13 Tables)](#️-database-schema-13-tables)
12. [🧪 Automated Testing](#-automated-testing)
13. [🔧 Troubleshooting](#-troubleshooting)
14. [📖 Real-World Usage Scenarios](#-real-world-usage-scenarios)
15. [💡 Technology Rationale](#-technology-rationale)
16. [🗓️ Future Roadmap](#️-future-roadmap)
17. [👥 Contributors](#-contributors)
18. [📄 License](#-license)

---

## 🎯 Problem Statement

Getting timely and correct medical attention in a metropolitan city like Mumbai involves three distinct challenges:

### 🤔 Medical Confusion
Most patients do not have medical training. They cannot distinguish between a pulled muscle and a cardiac event, or know whether to visit a General Practitioner or a Neurologist. This results in delayed treatment, unnecessary spending, or visits to the wrong specialist entirely.

### 🗺️ Geographic Barriers
Mumbai's population of 20+ million depends on its suburban rail network (Central, Western, and Harbour lines). A commuter who falls ill mid-journey needs a nearby clinic on their travel corridor — not a distant hospital requiring a separate trip across the city.

### 📝 Unreliable Paper Prescriptions
Paper prescriptions can be lost, damaged, or physically altered. Illegible handwriting causes pharmacies to dispense incorrect dosages, creating a direct patient safety risk.

### ✅ How LifeLink Solves These

| Problem | Solution |
|:---|:---|
| 🤔 Don't know which doctor to see | 🤖 AI triage engine (Google Gemini) analyzes symptoms, classifies urgency, and routes to the correct specialty |
| 🗺️ Can't find a nearby clinic | 🗺️ Interactive map plots 52 verified doctors across Mumbai's Central, Western, and Harbour rail lines |
| 📝 Prescriptions can be altered | 🔒 SHA-256 cryptographic hashing locks prescriptions — any tampering is immediately detectable |

---

## ⚙️ Technology Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| 🖥️ Frontend Framework | **React 19 + Vite 7** | Component-based UI with instant hot module reloading |
| 🎨 Styling | **Tailwind CSS v4** | Utility-first styling with responsive design tokens |
| 📝 Language | **TypeScript 5.9** | End-to-end type safety across the full stack |
| 🖧 Backend Runtime | **Node.js v22 + Express.js** | HTTP server and API request handling |
| 🔗 API Layer | **tRPC v11** | Type-safe remote procedure calls (zero API contracts to maintain) |
| 🗄️ Database | **MySQL 8.0 (Local)** | Relational data storage with full ACID compliance |
| 📊 ORM | **Drizzle ORM** | Type-safe SQL query building and schema management |
| 🤖 AI Engine | **Google Gemini (Flash models)** | Clinical symptom analysis and urgency classification |
| 🔐 Authentication | **JWT + HTTP-Only Cookies** | Secure dual-session management (patient + doctor) |
| 🗺️ Maps | **Leaflet + OpenStreetMap** | Interactive clinic map locked to Mumbai Metropolitan Region |
| ⚡ Real-Time | **Server-Sent Events (SSE)** | Live appointment and prescription push notifications |
| 🧪 Testing | **Vitest** | 50 tests across 6 suites covering core business logic |
| 🚀 Runtime | **Local Development** | Runs on `localhost` via Vite (frontend) + Express (backend) |

---

## ✨ Core Features

### 🤖 AI Symptom Triage Engine

> Located at `/patient/assessment`

This is the primary patient-facing feature. When a patient submits their symptoms, the input passes through **five sequential safety layers** before a response is returned:

| Layer | What It Does |
|:---|:---|
| 1️⃣ **Input Validation** | Detects and rejects gibberish, non-medical questions, or empty submissions |
| 2️⃣ **Biological Consistency Check** | Cross-references the patient's profile to catch biologically impossible combinations (e.g., a male reporting pregnancy symptoms) |
| 3️⃣ **Pediatric Routing Guardrail** | If the patient is under 18, the response automatically overrides to recommend a Pediatrician |
| 4️⃣ **Urgency Classification** | Categorizes severity into three levels: `🟢 LOW` (home care), `🟡 MODERATE` (see doctor within 24-48h), `🔴 EMERGENCY` (life-threatening — triggers SOS screen) |
| 5️⃣ **Specialty Routing** | Maps the diagnosis to 1 of 12 medical specialties to direct the patient to the correct type of doctor |

> ⚠️ **Privacy:** The Gemini API is called server-side only. The API key is never exposed to the browser.

---

### 🗺️ Interactive Mumbai Railway Clinic Map

> Located at `/patient/specialists`

A full-width interactive map (Leaflet + OpenStreetMap) renders all **52 doctor clinic locations** pinned across Mumbai:

- 📍 **Geographically Locked** — The map viewport is strictly bounded to the **Mumbai Metropolitan Region (MMR)** with hard panning limits. Users cannot scroll to other cities or states.
- 🚂 **Railway Corridor Organization** — Clinics are grouped along the **Central Line**, **Western Line**, and **Harbour Line** railway corridors for easy commuter access.
- 📏 **Distance Calculation** — The patient's GPS location is used to calculate the physical distance to each clinic. This runs entirely in the browser — GPS coordinates are **never sent** to the server.
- 🖱️ **Interactive Pins** — Clicking a clinic pin shows the doctor's name, specialty, hospital affiliation, and appointment booking options.
- 📅 **30-Minute Appointment Slots** — Two clinic sessions: ☀️ Morning/Afternoon (10:00 AM – 3:00 PM) and 🌙 Evening (7:00 PM – 10:00 PM), with real-time availability checking.

---

### 🪪 Digital Health Passport

> Located at `/patient/health-passport`

Patients fill in their Health Passport once. It stores:

- 🩸 Blood group (e.g., O-, AB+)
- 💊 Known drug allergies (e.g., Penicillin)
- 🏥 Chronic conditions (e.g., Type 2 Diabetes)

When a patient arrives at a clinic, the attending doctor can immediately pull up this document — preventing allergy-related prescription errors and enabling faster clinical decisions.

---

### 💊 Medicine Cabinet & Adherence Tracker

> Located at `/patient/medicines`

After a prescription is issued, medicines appear in the patient's Medicine Cabinet:

- 💊 Medicine name and dosage
- ⏰ Daily schedule broken into four time slots: **Morning**, **Afternoon**, **Evening**, and **Night**
- 📊 Remaining pill count

This structured view helps patients follow their treatment plans accurately and never miss a dose.

---

### 🔒 SHA-256 Secured Digital Prescriptions

> Located at `/patient/prescriptions`

When a doctor issues a prescription:

1. The server collects the **doctor's ID**, **patient's ID**, **full medicine list**, and the exact **UTC timestamp**
2. These values are combined and hashed using the **SHA-256 algorithm** mixed with the server's private secret key
3. The resulting hash is stored alongside the prescription record

If any field is altered directly in the database (e.g., changing dosage from 1 to 10 tablets), the stored hash will **no longer match** — any verification immediately flags it as **TAMPERED**.

---

### 👨‍⚕️ Clinician Consultation Portal

> Accessible at `/doctor/login` using official `@lifelink.com` credentials

Doctors have a fully separate workspace with:

| Feature | Description |
|:---|:---|
| 📋 **Live Waiting Room Queue** | Updates in real-time via SSE when new appointments are booked |
| 🤖 **AI Triage Preview** | Read the patient's AI-generated triage report before the consultation |
| 📝 **Digital Prescription Pad** | Select medicines, set dosages, and specify frequency schedules |
| 👥 **Patient Directory** | List of all patients assigned to this clinic, with links to their Health Passports |

---

### 🆘 Emergency SOS Screen

> Located at `/patient/emergency` — Also triggered automatically on `EMERGENCY` triage result

- 🔴 Displays a **full-screen red alert** interface
- 📞 Single large button opens the native phone dialer pre-filled with **112** (India's unified emergency number)
- 📱 Prepares an SMS message to pre-registered emergency contacts

---

### 🌙 Dark Mode

> Toggled from `/patient/settings`

- Uses deep slate and navy tones (not plain black) for a clinical, readable environment
- All input fields maintain **WCAG 2.1 AA** high-contrast compliance
- Glassmorphism styling (backdrop blur + edge lighting) on floating panels

---

## 🛡️ Security Architecture

LifeLink handles personal medical data and is built with **defense-in-depth** from the ground up:

| Security Layer | Implementation |
|:---|:---|
| 🔑 **Dual-Session Isolation** | Patient (`app_session_id`) and Doctor (`doctor_session_id`) sessions are completely independent. Compromising one provides zero access to the other |
| 🔐 **Scrypt Password Hashing** | Memory-hard algorithm — makes brute-force attacks against a stolen database computationally impractical |
| ⏱️ **Auto Doctor Logout** | Workstations auto-lock after **5 minutes** of inactivity — prevents unauthorized access if a doctor walks away |
| 🚫 **OAuth Collision Prevention** | If a user registers with email+password, a Google OAuth login with the same email is blocked (prevents account takeover) |
| 🛑 **IDOR Prevention** | Every backend query includes ownership verification. URL parameter manipulation returns `UNAUTHORIZED` |
| 💉 **SQL Injection Protection** | Drizzle ORM uses parameterized queries for all database operations — SQL injection is structurally impossible |
| 🧹 **XSS Protection** | React 19 auto-escapes all rendered text — malicious scripts are treated as plain text |
| 🤖 **AI Prompt Injection Defense** | Gemini responses are forced into a strict JSON schema via `response_mime_type`. Injection attempts fail schema validation and return a safe fallback |
| 🍪 **HTTP-Only Cookies** | Session tokens are in `httpOnly` cookies — inaccessible to JavaScript, protecting against XSS token theft |

---

## 🩺 Mumbai Doctor Directory (52 Doctors)

The database is pre-seeded with **52 verified clinic workstations** distributed across Mumbai's three railway corridors: **19 General Practitioners** (1 per station) and **33 Specialists** (3 per each of 11 specialty fields).

### 📧 Credential Format

Each doctor's login credentials follow this pattern:

| Field | Format | Example |
|:---|:---|:---|
| 📧 Email | `<doctor-id-without-mock->@lifelink.com` | `central-cardiology-csmt@lifelink.com` |
| 🔑 Password | `<specialty>.<station>@lifelink` | `cardiology.csmt@lifelink` |

### 🚂 Central Line Doctors

| # | Station | Specialty | Doctor Name | Email | Password |
|:---|:---|:---|:---|:---|:---|
| 1 | CSMT | General Practice | Dr. Ramesh Kumar, MBBS | `central-general-practice-csmt@lifelink.com` | `generalpractice.csmt@lifelink` |
| 2 | Ghatkopar | General Practice | Dr. Arvind Shenoy, MBBS | `central-general-practice-ghatkopar@lifelink.com` | `generalpractice.ghatkopar@lifelink` |
| 3 | Bhandup | General Practice | Dr. Sunita Jagtap, MBBS | `central-general-practice-bhandup@lifelink.com` | `generalpractice.bhandup@lifelink` |
| 4 | Thane | General Practice | Dr. Meera Nambiar, MBBS, MD | `central-general-practice-thane@lifelink.com` | `generalpractice.thane@lifelink` |
| 5 | Mulund | General Practice | Dr. Shrikant Gokhale, MBBS | `central-general-practice-mulund@lifelink.com` | `generalpractice.mulund@lifelink` |
| 6 | Diva Junction | General Practice | Dr. Rameshwar Gaikwad, MBBS | `central-general-practice-diva@lifelink.com` | `generalpractice.divajunction@lifelink` |
| 7 | Kopar | General Practice | Dr. Kavita Joshi, MBBS | `central-general-practice-kopar@lifelink.com` | `generalpractice.kopar@lifelink` |
| 8 | Dombivli | General Practice | Dr. Nitin Agrawal, MBBS | `central-general-practice-dombivli@lifelink.com` | `generalpractice.dombivli@lifelink` |
| 9 | Thakurli | General Practice | Dr. Deepa Nair, MBBS | `central-general-practice-thakurli@lifelink.com` | `generalpractice.thakurli@lifelink` |
| 10 | CSMT | Cardiology | Dr. Rajesh Sharma, MD, DM | `central-cardiology-csmt@lifelink.com` | `cardiology.csmt@lifelink` |
| 11 | Ghatkopar | Dermatology | Dr. Ananya Deshmukh, MD, DNB | `central-dermatology-ghatkopar@lifelink.com` | `dermatology.ghatkopar@lifelink` |
| 12 | Bhandup | Orthopedics | Dr. Vikramaditya Patil, MS | `central-orthopedics-bhandup@lifelink.com` | `orthopedics.bhandup@lifelink` |
| 13 | Thane | Neurology | Dr. Sneha Kulkarni, MD, DM | `central-neurology-thane@lifelink.com` | `neurology.thane@lifelink` |
| 14 | Mulund | Pediatrics | Dr. Rohan Mehta, MD | `central-pediatrics-mulund@lifelink.com` | `pediatrics.mulund@lifelink` |
| 15 | CSMT | Ophthalmology | Dr. Preeti Saxena, MS | `central-ophthalmology-csmt@lifelink.com` | `ophthalmology.csmt@lifelink` |
| 16 | Thane | Gastroenterology | Dr. Jayant Bhatt, MD, DM | `central-gastroenterology-thane@lifelink.com` | `gastroenterology.thane@lifelink` |
| 17 | Ghatkopar | Psychiatry | Dr. Anjali Chhabria, MD | `central-psychiatry-ghatkopar@lifelink.com` | `psychiatry.ghatkopar@lifelink` |
| 18 | Bhandup | Endocrinology | Dr. Rahul Tambe, MD, DM | `central-endocrinology-bhandup@lifelink.com` | `endocrinology.bhandup@lifelink` |
| 19 | Thane | Pulmonology | Dr. Lancelot Pinto, MD, DM | `central-pulmonology-thane@lifelink.com` | `pulmonology.thane@lifelink` |
| 20 | Dombivli | Gynecology | Dr. Smita Patil, MD, DGO | `central-gynecology-dombivli@lifelink.com` | `gynecology.dombivli@lifelink` |

### 🚂 Western Line Doctors

| # | Station | Specialty | Doctor Name | Email | Password |
|:---|:---|:---|:---|:---|:---|
| 21 | Churchgate | General Practice | Dr. Farhan Mehta, MBBS, MD | `western-general-practice-churchgate@lifelink.com` | `generalpractice.churchgate@lifelink` |
| 22 | Dadar | General Practice | Dr. Ashok Tendulkar, MBBS | `western-general-practice-dadar@lifelink.com` | `generalpractice.dadar@lifelink` |
| 23 | Andheri | General Practice | Dr. Swati Bhosale, MBBS | `western-general-practice-andheri@lifelink.com` | `generalpractice.andheri@lifelink` |
| 24 | Goregaon | General Practice | Dr. Shalini Varma, MBBS | `western-general-practice-goregaon@lifelink.com` | `generalpractice.goregaon@lifelink` |
| 25 | Borivali | General Practice | Dr. Milind Chitnis, MBBS | `western-general-practice-borivali@lifelink.com` | `generalpractice.borivali@lifelink` |
| 26 | Andheri | Cardiology | Dr. Anil Kumar, MD, DM | `western-cardiology-andheri@lifelink.com` | `cardiology.andheri@lifelink` |
| 27 | Churchgate | Dermatology | Dr. Ritu Kapoor, MD | `western-dermatology-churchgate@lifelink.com` | `dermatology.churchgate@lifelink` |
| 28 | Dadar | Orthopedics | Dr. Mahesh Bhide, MS, MCh | `western-orthopedics-dadar@lifelink.com` | `orthopedics.dadar@lifelink` |
| 29 | Borivali | Neurology | Dr. Pankaj Shah, MD, DM | `western-neurology-borivali@lifelink.com` | `neurology.borivali@lifelink` |
| 30 | Andheri | Pediatrics | Dr. Pooja Chawla, MD, DCH | `western-pediatrics-andheri@lifelink.com` | `pediatrics.andheri@lifelink` |
| 31 | Goregaon | Ophthalmology | Dr. Sameer Merchant, MS, FICO | `western-ophthalmology-goregaon@lifelink.com` | `ophthalmology.goregaon@lifelink` |
| 32 | Borivali | Gastroenterology | Dr. Nitin Agrawal, MD, DM | `western-gastroenterology-borivali@lifelink.com` | `gastroenterology.borivali@lifelink` |
| 33 | Dadar | Psychiatry | Dr. Harish Shetty, MD | `western-psychiatry-dadar@lifelink.com` | `psychiatry.dadar@lifelink` |
| 34 | Churchgate | Endocrinology | Dr. Shashank Joshi, MD, DM | `western-endocrinology-churchgate@lifelink.com` | `endocrinology.churchgate@lifelink` |
| 35 | Andheri | Pulmonology | Dr. Zarir Udwadia, MD, FRCP | `western-pulmonology-andheri@lifelink.com` | `pulmonology.andheri@lifelink` |
| 36 | Goregaon | Gynecology | Dr. Veena Shinde, MD, DGO | `western-gynecology-goregaon@lifelink.com` | `gynecology.goregaon@lifelink` |

### 🚂 Harbour Line Doctors

| # | Station | Specialty | Doctor Name | Email | Password |
|:---|:---|:---|:---|:---|:---|
| 37 | Sewri | General Practice | Dr. Devendra Sawant, MBBS | `harbour-general-practice-sewri@lifelink.com` | `generalpractice.sewri@lifelink` |
| 38 | Chembur | General Practice | Dr. Prakash Nair, MBBS | `harbour-general-practice-chembur@lifelink.com` | `generalpractice.chembur@lifelink` |
| 39 | Vashi | General Practice | Dr. Harish Salunkhe, MBBS | `harbour-general-practice-vashi@lifelink.com` | `generalpractice.vashi@lifelink` |
| 40 | Nerul | General Practice | Dr. Vandana Rao, MBBS | `harbour-general-practice-nerul@lifelink.com` | `generalpractice.nerul@lifelink` |
| 41 | Panvel | General Practice | Dr. Chetan Mahajan, MBBS | `harbour-general-practice-panvel@lifelink.com` | `generalpractice.panvel@lifelink` |
| 42 | Vashi | Cardiology | Dr. Sanjeev Kulkarni, MD, DM | `harbour-cardiology-vashi@lifelink.com` | `cardiology.vashi@lifelink` |
| 43 | Chembur | Dermatology | Dr. Siddharth Merchant, MD | `harbour-dermatology-chembur@lifelink.com` | `dermatology.chembur@lifelink` |
| 44 | Panvel | Orthopedics | Dr. Sanjay Varma, MS | `harbour-orthopedics-panvel@lifelink.com` | `orthopedics.panvel@lifelink` |
| 45 | Nerul | Neurology | Dr. Vivek Deshpande, MD, DM | `harbour-neurology-nerul@lifelink.com` | `neurology.nerul@lifelink` |
| 46 | Vashi | Pediatrics | Dr. Neha Paranjpe, MD | `harbour-pediatrics-vashi@lifelink.com` | `pediatrics.vashi@lifelink` |
| 47 | Chembur | Ophthalmology | Dr. Alok Pandey, MS | `harbour-ophthalmology-chembur@lifelink.com` | `ophthalmology.chembur@lifelink` |
| 48 | Sewri | Gastroenterology | Dr. Reema Shetty, MD, DM | `harbour-gastroenterology-sewri@lifelink.com` | `gastroenterology.sewri@lifelink` |
| 49 | Sewri | Psychiatry | Dr. Devendra Sawant, MD, DPM | `harbour-psychiatry-sewri@lifelink.com` | `psychiatry.sewri@lifelink` |
| 50 | Chembur | Endocrinology | Dr. Malini Iyer, MD, DM | `harbour-endocrinology-chembur@lifelink.com` | `endocrinology.chembur@lifelink` |
| 51 | Vashi | Pulmonology | Dr. Harish Salunkhe, MD, DM | `harbour-pulmonology-vashi@lifelink.com` | `pulmonology.vashi@lifelink` |
| 52 | Panvel | Gynecology | Dr. Vandana Rao, MD, DGO | `harbour-gynecology-panvel@lifelink.com` | `gynecology.panvel@lifelink` |

### 🔑 Quick Test Login

Want to quickly test the doctor portal? Use any of these:

```
📧 Email:    central-cardiology-csmt@lifelink.com
🔑 Password: cardiology.csmt@lifelink
```

### 🔓 Password Reset (Demo)

Doctors can reset forgotten passwords at `/doctor/reset` using their email and the master override key:

```
lifelink-controlled-clinician-secret-key-2026
```

---

## 🔐 Environment Configuration

> ⚠️ **Never commit your `.env` file to GitHub.** It contains sensitive credentials. The `.gitignore` already excludes it, but always verify before pushing.

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

### Required Variables

| Variable | Description | Example |
|:---|:---|:---|
| `DATABASE_URL` | MySQL connection string | `mysql://root:password@127.0.0.1:3306/lifelink` |
| `JWT_SECRET` | Random 32+ character string for signing tokens | Generate with `openssl rand -hex 32` |
| `LIFELINK_DEMO_DOCTOR_ACCESS_CODE` | Master key for doctor password reset | `lifelink-controlled-clinician-secret-key-2026` |
| `GEMINI_API_KEY` | Google AI Studio API key (starts with `AIzaSy`) | Get from [aistudio.google.com](https://aistudio.google.com/) |
| `GOOGLE_OAUTH_CLIENT_ID` | Google OAuth client ID | From [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth client secret | Same as above |
| `AUTH_PUBLIC_BASE_URL` | Base URL of the running application | `http://localhost:5173` |

### 📝 Example `.env` File

```env
DATABASE_URL="mysql://root:yourpassword@127.0.0.1:3306/lifelink"
JWT_SECRET="a-long-random-string-of-at-least-32-characters"
LIFELINK_DEMO_DOCTOR_ACCESS_CODE="lifelink-controlled-clinician-secret-key-2026"
GEMINI_API_KEY="AIzaSyB9zX-your-key-here"
GOOGLE_OAUTH_CLIENT_ID="123456789012-abc.apps.googleusercontent.com"
GOOGLE_OAUTH_CLIENT_SECRET="GOCSPX-your-secret-here"
AUTH_PUBLIC_BASE_URL="http://localhost:5173"
```

---

## 🚀 Local Development Setup (Step-by-Step)

Follow these exact steps in your terminal to run LifeLink on your local machine.

### 📋 Prerequisites

Before you begin, ensure you have:

| Requirement | How to Check | Where to Get It |
|:---|:---|:---|
| ✅ **Node.js v22+** | Run `node -v` in terminal | [nodejs.org](https://nodejs.org/) |
| ✅ **npm** (comes with Node) | Run `npm -v` in terminal | Included with Node.js |
| ✅ **Git** | Run `git --version` in terminal | [git-scm.com](https://git-scm.com/) |
| ✅ **MySQL 8.0+** | Run `mysql --version` in terminal | [mysql.com](https://dev.mysql.com/downloads/mysql/) or via XAMPP / WAMP / MAMP |

### Step 1️⃣ — Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/sarthakmandhare34/New-LifeLink-Smart-Healthcare-Assistance-Platform.git
```

Then navigate into the project folder:

```bash
cd New-LifeLink-Smart-Healthcare-Assistance-Platform
```

### Step 2️⃣ — Install All Dependencies

```bash
npm install
```

⏳ This downloads all required packages. Expect **1-3 minutes** depending on your connection speed.

✅ **Success:** You should see a message like `added XXX packages` with no error messages.

### Step 3️⃣ — Create Your Environment File

**On Mac / Linux:**
```bash
cp .env.example .env
```

**On Windows (Command Prompt):**
```cmd
copy .env.example .env
```

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

Now open `.env` in any text editor (VS Code, Notepad, etc.) and fill in your actual credentials. See [🔐 Environment Configuration](#-environment-configuration) above for details on each variable.

### Step 4️⃣ — Set Up the Database

Create all 13 required database tables:

```bash
npm run db:push
```

✅ **Success:** You should see output confirming the migration completed with no errors.

### Step 5️⃣ — Seed the 52 Mumbai Doctor Accounts

```bash
npm run db:sync:doctors
```

This creates all 52 doctor accounts with their `@lifelink.com` emails and passwords. This command is **safe to run multiple times** — it will not create duplicate entries.

✅ **Success:** You should see `52 doctors synced` (or similar confirmation).

### Step 6️⃣ — Start the Development Server 🎉

```bash
npm run dev
```

This starts **two servers simultaneously**:

| Server | Port | Purpose |
|:---|:---|:---|
| ⚡ **Vite (Frontend)** | `5173` | React UI with hot module reloading |
| 🖧 **Express (Backend)** | `4000` | API server, database queries, AI calls |

### Step 7️⃣ — Open in Browser

Navigate to:

```
http://localhost:5173
```

🎉 **You should see the LifeLink landing page!**

### 🛑 To Stop the Server

Press `Ctrl + C` in the terminal where `npm run dev` is running.

---

## 📦 NPM Script Reference

All available commands defined in `package.json`:

| Command | What It Does |
|:---|:---|
| `npm run dev` | 🚀 Starts Vite frontend (port 5173) + Express backend (port 4000) concurrently |
| `npm run build` | 📦 Compiles React frontend to `dist/public/` and backend to `dist/index.js` |
| `npm start` | ▶️ Starts the compiled production server locally |
| `npm test` | 🧪 Runs all 50 Vitest tests across 6 suites |
| `npm run check` | ✅ TypeScript type-check (`tsc --noEmit`) — reports errors without building |
| `npm run format` | 🎨 Formats all source files using Prettier |
| `npm run verify` | 🔍 Runs `check` → `test` → `build` in sequence (pre-push validation) |
| `npm run db:push` | 🗄️ Creates/migrates all 13 database tables from `database/schema.ts` |
| `npm run db:studio` | 🔎 Opens Drizzle Studio UI (port 4983) to browse tables visually |
| `npm run db:clear` | 🗑️ Deletes all patient data (doctor accounts are preserved) |
| `npm run db:sync:doctors` | 👨‍⚕️ Seeds/syncs all 52 Mumbai doctor accounts (safe to re-run) |
| `npm run db:delete-user` | ❌ Removes a specific user and all their associated records |

---

## 🗺️ Application Routes

### 🌐 Public Routes (No Login Required)

| Path | Description |
|:---|:---|
| `/` | 🏠 Landing page — Users select Patient or Doctor workspace |
| `/login` | 🔐 Patient login (email/password or Google OAuth) |
| `/register` | 📝 Patient registration with email validation |
| `/doctor/login` | 👨‍⚕️ Doctor login (requires `@lifelink.com` email) |
| `/doctor/reset` | 🔓 Doctor password reset (requires master admin code) |

### 🧑‍💼 Patient Portal (Requires Patient Login)

| Path | Description |
|:---|:---|
| `/patient/dashboard` | 📊 Overview: active appointments, recent assessments, quick actions |
| `/patient/assessment` | 🤖 5-layer AI triage engine (symptom analysis) |
| `/patient/specialists` | 🗺️ Interactive Mumbai map with 52 doctor clinic locations |
| `/patient/appointments` | 📅 Book and manage clinic appointments (30-min slots) |
| `/patient/health-passport` | 🪪 Blood group, allergies, chronic conditions |
| `/patient/medicines` | 💊 Daily medication adherence tracker |
| `/patient/prescriptions` | 🔒 SHA-256 verified digital prescriptions |
| `/patient/emergency` | 🆘 Full-screen SOS interface with 112 emergency dialer |
| `/patient/profile` | 👤 Update personal details and profile photo |
| `/patient/settings` | ⚙️ Dark mode toggle, notifications, logout |

### 👨‍⚕️ Clinician Workspace (Requires Doctor Login)

| Path | Description |
|:---|:---|
| `/doctor/dashboard` | 📋 Live waiting room queue (real-time SSE updates) |
| `/doctor/patients` | 👥 Directory of assigned patients + Health Passports |
| `/doctor/consultation` | 💬 Active consultation workspace for clinical notes |
| `/doctor/prescriptions` | 📝 Digital prescription pad (medicines, dosages, schedules) |
| `/doctor/assessments` | 🤖 Review AI-generated triage reports |
| `/doctor/profile` | 🏥 Read-only clinic assignment and specialty details |
| `/doctor/settings` | 🔑 Change workstation password, manage sessions |

---

## 📁 Project Structure

```text
LifeLink-Smart-Healthcare-Assistance-Platform/
│
├── 🖥️ frontend/                         # React 19 + Vite 7 user interface
│   ├── index.html                       # Single HTML entry point
│   ├── public/                          # Static assets (favicons, logos, images)
│   └── src/
│       ├── main.tsx                     # Application bootstrap (context providers)
│       ├── App.tsx                      # React Router configuration
│       ├── index.css                    # Global CSS design tokens + Tailwind directives
│       ├── components/                  # 🧩 Shared UI (AppShell, Cards, Maps, ThemeToggle)
│       │   ├── Map.tsx                  # Leaflet base map (locked to Mumbai MMR)
│       │   ├── MumbaiDoctorMap.tsx      # Interactive doctor clinic pin map
│       │   └── brand/                   # Brand loading indicator
│       ├── features/
│       │   ├── entry/                   # 🔐 Login, Register, WorkspaceSelector
│       │   ├── patient/                 # 🧑‍💼 All patient portal screens
│       │   │   ├── Dashboard.tsx
│       │   │   ├── Appointments/        # 📅 Appointment booking
│       │   │   ├── Assessment/          # 🤖 AI triage UI
│       │   │   ├── Emergency/           # 🆘 112 SOS screen
│       │   │   ├── HealthPassport/      # 🪪 Medical history
│       │   │   ├── Medicines/           # 💊 Adherence tracker
│       │   │   ├── Prescriptions/       # 🔒 SHA-256 prescription viewer
│       │   │   ├── Profile/             # 👤 Patient profile
│       │   │   ├── Settings/            # ⚙️ Dark mode & preferences
│       │   │   └── Specialists/         # 🗺️ Mumbai map + SpecialistFinder
│       │   └── doctor/                  # 👨‍⚕️ All clinician workspace screens
│       │       ├── Dashboard.tsx         # 📋 Live queue
│       │       ├── Appointments/
│       │       ├── Assessments/
│       │       ├── Consultations/
│       │       ├── Patients/
│       │       ├── Prescriptions/
│       │       ├── Profile/
│       │       └── Settings/
│       ├── hooks/                       # 🪝 useAuth, usePatientRealtime, inactivity
│       ├── lib/                         # 🔧 tRPC client config, utilities
│       └── context/                     # 🎨 ThemeContext (dark mode)
│
├── 🖧 backend/                           # Node.js + Express API server
│   ├── routers.ts                       # Root tRPC router (merges all sub-routers)
│   ├── db.ts                            # Drizzle ORM connection pooling
│   ├── _core/                           # ⚙️ Core infra (context, tRPC, cookies, env)
│   ├── ai/                              # 🤖 Google Gemini integration
│   ├── auth/                            # 🔐 Dual auth (patient, doctor, Google OAuth)
│   ├── discovery/                       # 🔍 Doctor search & clinic lookup
│   │   └── mockDoctorDirectory.ts       # 52 Mumbai doctor definitions
│   ├── realtime/                        # ⚡ SSE event bus & real-time streaming
│   └── routers/                         # 🔗 Domain-specific API endpoints
│
├── 🗄️ database/                          # Database schema & migration tooling
│   ├── schema.ts                        # All 13 table definitions (Drizzle ORM)
│   ├── drizzle.config.ts               # Drizzle Kit CLI configuration
│   └── migrations/                      # Auto-generated SQL migration history
│
├── 🔗 shared/                            # Code shared between frontend & backend
│   ├── mumbaiRailNetwork.ts             # 19 station definitions across 3 rail lines
│   ├── mumbaiStationCoordinates.ts      # GPS coordinates for Leaflet map pins
│   └── types.ts                         # Shared TypeScript interfaces
│
├── 🛠️ scripts/                           # Developer utility scripts
│   ├── dev.mjs                          # Runs Vite + Express concurrently
│   ├── seed-doctors.ts                  # Initial seeding for 52 doctor accounts
│   ├── sync-doctors.ts                  # Idempotent doctor sync (safe to re-run)
│   ├── clear-users.ts                   # Wipes all patient data for clean testing
│   ├── delete-user.ts                   # Removes a specific user + full history
│   └── init-db.ts                       # Safe database initialization helper
│
├── .env.example                         # 📝 Template for required environment variables
├── package.json                         # 📦 NPM scripts and dependency list
├── tsconfig.json                        # TypeScript compiler configuration
├── vite.config.ts                       # Vite build and proxy configuration
└── vitest.config.ts                     # Vitest testing framework configuration
```

---

## 🗄️ Database Schema (13 Tables)

All tables reference the central `users` table via foreign keys with `onDelete: "cascade"`.

| Table | Purpose |
|:---|:---|
| 👤 `users` | Core auth — email, hashed passwords (Scrypt), Google OAuth IDs, role (`patient` / `doctor`) |
| 🧑 `patientProfiles` | Demographics, date of birth (drives pediatric AI guardrail), avatar URL |
| 👨‍⚕️ `doctorProfiles` | Doctor name, specialty, assigned railway station, consulting fee |
| 🪪 `healthPassports` | Blood group, drug allergies, chronic conditions |
| 🤖 `assessments` | AI triage submissions — stores symptoms and the full 5-layer AI response |
| 📅 `appointments` | Patient ↔ Doctor scheduled timeslots with status tracking (Pending → Confirmed → Completed / Cancelled) |
| 📝 `prescriptions` | SHA-256 digital signature linking each prescription to a specific doctor and patient |
| 💊 `prescriptionItems` | Individual line items (e.g., Paracetamol 500mg, twice daily) |
| 💊 `medicines` | Active medicine cabinet — remaining pill count + daily dose schedule |
| 🔑 `sessions` | Active login token registry (deleting a row = instant session invalidation) |
| 📞 `emergencyContacts` | Family member names and phone numbers for SOS dispatch |
| 📊 `systemEvents` | Internal audit log for security-sensitive actions (password resets, failed logins) |
| 📍 `clinicLocations` | Geographic coordinates (lat, lng) of each clinic for Leaflet map distance calculations |

---

## 🧪 Automated Testing

LifeLink has **50 tests across 6 test suites** covering all critical business logic:

| Test Suite | Tests | What It Validates |
|:---|:---|:---|
| `mockDoctorDirectory.test.ts` | 4 | ✅ 52 total doctors, 1 GP per station, ≥3 specialists per specialty field |
| `SpecialistFinder.test.ts` | 5 | ✅ Patient-facing labels, filter logic, Mumbai corridor selection |
| `appointmentLifecycle.test.ts` | 10 | ✅ Complete booking → confirm → complete → cancel flow |
| `prescriptionLifecycle.test.ts` | 12 | ✅ SHA-256 integrity, tamper detection, prescription issuance |
| `medicine.test.ts` | 7 | ✅ Medicine cabinet operations, pill count, schedule management |
| `healthPassport.test.ts` | 12 | ✅ Blood group, allergies, chronic conditions CRUD |

### Running Tests

```bash
# Run all tests
npm test

# Run TypeScript type-check (no output files)
npm run check

# Run everything: check → test → build
npm run verify
```

---

## 🔧 Troubleshooting

### ❌ "Google sign-in is not configured yet"

Your `.env` file is missing `GOOGLE_OAUTH_CLIENT_ID` or `GOOGLE_OAUTH_CLIENT_SECRET`. See [🔐 Environment Configuration](#-environment-configuration) to set these up.

---

### ❌ Google returns "Error 400: redirect_uri_mismatch"

Google rejected the login because the redirect URL is not approved. In the Google Cloud Console, add the correct URI to **Authorized redirect URIs**:

- 🖥️ **Authorized Redirect URI:** `http://localhost:5173/api/auth/google/callback`
- 🌐 **Authorized JavaScript Origins:** `http://localhost:5173`

---

### ❌ AI Symptom Checker returns a blank screen or 500 error

Your `GEMINI_API_KEY` is missing or invalid. Keys from Google AI Studio begin with `AIzaSy`. Check your `.env` file.

---

### ❌ `npm run dev` crashes with MySQL Connection Refused

The backend cannot reach the database. Verify:

1. `DATABASE_URL` in your `.env` is correct (e.g., `mysql://root:password@localhost:3306/lifelink_db`)
2. Ensure your local MySQL service is running (via MySQL Command Line, MySQL Workbench, XAMPP, or Windows Services)
3. Ensure the database `lifelink_db` has been created (`CREATE DATABASE IF NOT EXISTS lifelink_db;`)

---

### ❌ No doctors appear on the map

The database was not seeded. Run these commands in order:

```bash
npm run db:push
npm run db:sync:doctors
npm run dev
```

---

### ❌ Vite starts but browser shows a blank white screen

Open the browser developer console (`F12` → Console) and check for errors. Common causes:

- Backend didn't start — verify Express is running on port 4000
- Another process is using port 4000 or 5173
- Missing or incorrect `.env` variables

---

## 📖 Real-World Usage Scenarios

### 🦴 Scenario A: Sprained Ankle (Moderate Urgency)

Rahul, a college student, twists his ankle badly at Dadar station. He opens LifeLink on his phone and types:

> *"I fell on the stairs. My right ankle is swollen and hurts when I put weight on it."*

The AI classifies this as **🟡 MODERATE** urgency and routes to **Orthopedics**. The map highlights Dr. Mahesh Bhide at PD Hinduja Hospital, Dadar as the closest option. Rahul books an appointment, and when he arrives, the doctor already has his AI triage report on screen. The doctor diagnoses a Grade 2 sprain and issues a digital prescription for Ibuprofen. Rahul's Medicine Cabinet immediately shows the correct schedule: **Morning and Night**.

---

### 🫀 Scenario B: Suspected Heart Attack (Emergency Urgency)

Amit, 55, is at his office when he feels crushing chest pain and numbness in his left arm. He types:

> *"My chest is very heavy and my left arm is numb. I am sweating a lot."*

The AI immediately recognizes classic myocardial infarction indicators. The screen switches to a full-screen **🔴 EMERGENCY** alert. A single large button opens his phone's native dialer with **112** pre-filled. His emergency contacts receive an automated SMS with his registered details.

---

## 💡 Technology Rationale

### Why React 19 instead of plain HTML/CSS/JS?

LifeLink is a multi-screen application with dozens of interactive components sharing state (the logged-in user's data needs to be available on every page). React manages this through a component tree and virtual DOM that updates only changed parts — making navigation feel instantaneous even on slow mobile connections.

### Why Vite instead of Create React App or Webpack?

Vite uses native ES Modules during development, meaning it processes only the currently-edited file instead of re-bundling the entire codebase. For a project of this size, this reduces rebuild time from **tens of seconds to milliseconds**.

### Why MySQL 8.0?

MySQL is the world's most widely used open-source relational database. It provides **full ACID compliance**, **strong foreign key support**, and seamless integration with Drizzle ORM. Running locally gives you full control over your data with zero external dependencies or cloud costs.

### Why Google Gemini instead of other AI providers?

Gemini Flash models are optimized for **low-latency structured output** — critical for triage where users expect a response in 2-3 seconds. The `response_mime_type: "application/json"` parameter enforces a strict output schema, enabling reliable programmatic parsing without fragile text matching.

### Why tRPC instead of REST?

In REST, frontend-backend communication relies on informal contracts (URL paths + JSON shapes) not enforced by the compiler. If a developer changes the backend response shape, the frontend breaks **silently at runtime**. tRPC shares TypeScript types directly from backend router definitions to the frontend at compile time — shape mismatches become build errors caught **before the code ever runs**.

---

## 🗓️ Future Roadmap

| Feature | Description |
|:---|:---|
| 📱 **Native Mobile Apps** | Port to React Native for iOS/Android with native push notifications |
| 📸 **Computer Vision for Lab Reports** | Extend Gemini to accept image uploads — patients can photograph blood test reports or X-rays and receive plain-language summaries |
| 🗣️ **Multilingual Voice Input** | Web Speech API for symptom input in Hindi/Marathi with auto-translation to English |
| 💊 **Pharmacy Verification Portal** | Third role for verified pharmacies — scan a QR code to instantly verify a prescription's SHA-256 hash before dispensing |

---

## 👥 Contributors

**Sarthak Mandhare** ([@sarthakmandhare34](https://github.com/sarthakmandhare34))
Lead Developer, System Architect, and Project Owner.
Responsible for full-stack platform architecture, database schema design, AI safety guardrails, dual-authentication workflows, and UI engineering.

**Google DeepMind / Gemini**
AI architectural partner.
Provided the Gemini AI models used in the clinical triage engine.

For contribution guidelines, commit conventions, and coding standards, see [CONTRIBUTORS.md](CONTRIBUTORS.md).
For security vulnerability reporting, see [SECURITY.md](SECURITY.md).

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for the full terms.

You are free to use, copy, modify, merge, publish, distribute, and sublicense this software, provided that the original copyright notice is included in all copies or substantial portions of the software.

---

<div align="center">

🏥 *LifeLink was built to demonstrate that software engineering can make healthcare meaningfully safer and more accessible.*

*Built with ❤️ in Mumbai, India*

</div>

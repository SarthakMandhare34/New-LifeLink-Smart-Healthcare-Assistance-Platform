# 🏥 LifeLink — Healthcare Assistance Platform

[![Live Deployment](https://img.shields.io/badge/Render-Live%20Deployment-00C4CC?style=for-the-badge&logo=render&logoColor=white)](https://lifelink-healthcare.onrender.com)

**LifeLink** is a healthcare platform built for patients in Mumbai. It helps people figure out how serious their medical symptoms are, and connects them with doctors located near local railway stations. 

🌐 **Live Website**: [https://lifelink-healthcare.onrender.com](https://lifelink-healthcare.onrender.com)

---

## 📖 Table of Contents
1. [What is LifeLink?](#what-is-lifelink)
2. [Main Features](#main-features)
3. [List of Doctors (24 Stations)](#list-of-doctors-24-stations)
4. [How to Run it Locally on your Computer](#how-to-run-it-locally-on-your-computer)
5. [How to Deploy it on the Cloud (Render)](#how-to-deploy-it-on-the-cloud-render)
6. [Tech Stack & Commands](#tech-stack--commands)

---

## ❓ What is LifeLink?

When you get sick, it can be hard to know if you should rest at home, see a doctor, or rush to the emergency room. It's also hard to find the right doctor nearby. 

LifeLink solves this by:
- Asking you about your symptoms.
- Using **Google Gemini AI** to tell you how urgent it is and what type of doctor you need (like a Cardiologist or Dermatologist).
- Showing you clinics near Mumbai's local train stations (Central, Western, and Harbour lines).
- Letting doctors give you digital prescriptions that you can view on your phone.

---

## ⭐ Main Features

1. **AI Symptom Checker**: You type in how you feel, and the AI (Google Gemini) checks your symptoms. It knows not to give pregnant advice to men, and has special rules for children under 18. It tells you if it's a Low, Moderate, or Emergency situation.
2. **Mumbai Railway Clinic Map**: An interactive map that shows doctors located along the Central, Western, and Harbour railway lines. 
3. **Patient Health Profile**: You can save your blood group, allergies, and emergency contacts so doctors can see them easily.
4. **Medicine Tracker**: Keeps track of what medicines you need to take and when.
5. **Secure Digital Prescriptions**: Doctors can write prescriptions on the app. Every prescription is securely signed with a unique SHA-256 hash so it cannot be faked or changed.
6. **Emergency 112 SOS**: A quick button that opens your phone's dialer to call `112` (India's national emergency number) or draft an SMS to your emergency contacts.
7. **Doctor and Patient Portals**: Patients and doctors have completely separate login areas. If a patient books an appointment, the doctor sees it instantly without needing to refresh the page (using Server-Sent Events).

---

## 🩺 List of Doctors (24 Stations)

We have created 24 sample doctor accounts spread across Mumbai for testing. To log in as a doctor, go to `/doctor/login`.

**Central Line Doctors:**
- Cardiology (CSMT) -> `cardiology@lifelink.com` (Password: `cardio@lifelink`)
- Dermatology (Ghatkopar) -> `dermatology@lifelink.com` (Password: `derma@lifelink`)
- Orthopedics (Bhandup) -> `orthopedics@lifelink.com` (Password: `ortho@lifelink`)
- Neurology (Thane) -> `neurology@lifelink.com` (Password: `neuro@lifelink`)
- General Practice (Mulund) -> `generalpractice.mulund@lifelink.com` (Password: `general.mulund@lifelink`)
- General Practice (Thane) -> `generalpractice.thane@lifelink.com` (Password: `general.thane@lifelink`)
- General Practice (Diva Junction) -> `generalpractice.divajunction@lifelink.com` (Password: `general.divajunction@lifelink`)
- General Practice (Kopar) -> `generalpractice.kopar@lifelink.com` (Password: `general.kopar@lifelink`)
- General Practice (Dombivli) -> `generalpractice.dombivli@lifelink.com` (Password: `general.dombivli@lifelink`)
- General Practice (Thakurli) -> `generalpractice.thakurli@lifelink.com` (Password: `general.thakurli@lifelink`)

**Western Line Doctors:**
- General Practice (Churchgate) -> `generalpractice.churchgate@lifelink.com` (Password: `general.churchgate@lifelink`)
- General Practice (Dadar) -> `generalpractice.dadar@lifelink.com` (Password: `general.dadar@lifelink`)
- Pediatrics (Andheri) -> `pediatrics@lifelink.com` (Password: `pedia@lifelink`)
- Ophthalmology (Goregaon) -> `ophthalmology@lifelink.com` (Password: `ophthal@lifelink`)
- Gastroenterology (Borivali) -> `gastroenterology@lifelink.com` (Password: `gastro@lifelink`)
- General Practice (Borivali) -> `generalpractice.borivali@lifelink.com` (Password: `general.borivali@lifelink`)

**Harbour Line Doctors:**
- Psychiatry (Sewri) -> `psychiatry@lifelink.com` (Password: `psych@lifelink`)
- Endocrinology (Chembur) -> `endocrinology@lifelink.com` (Password: `endo@lifelink`)
- General Practice (Chembur) -> `generalpractice.chembur@lifelink.com` (Password: `general.chembur@lifelink`)
- Pulmonology (Vashi) -> `pulmonology@lifelink.com` (Password: `pulmo@lifelink`)
- General Practice (Vashi) -> `generalpractice.vashi@lifelink.com` (Password: `general.vashi@lifelink`)
- General Practice (Nerul) -> `generalpractice.nerul@lifelink.com` (Password: `general.nerul@lifelink`)
- Gynecology (Panvel) -> `gynecology@lifelink.com` (Password: `gynae@lifelink`)
- General Practice (Panvel) -> `generalpractice.panvel@lifelink.com` (Password: `general.panvel@lifelink`)

*(Note: If a doctor forgets their password, they can reset it using the Master Code: `lifelink-controlled-clinician-secret-key-2026` at `/doctor/reset`)*

---

## 💻 How to Run it Locally on your Computer

To run this project on your own computer (terminal), follow these simple steps:

### 1. What you need installed
- **Node.js** (Version 22 or higher)
- **MySQL Database** (Running locally on your computer)

### 2. Download the code
Open your terminal and run:
```bash
git clone https://github.com/sarthakmandhare34/New-LifeLink-Smart-Healthcare-Assistance-Platform.git
cd New-LifeLink-Smart-Healthcare-Assistance-Platform
npm install
```

### 3. Setup your Environment Variables
Create a file named `.env` in the main folder and add these details:
```env
# Your Local MySQL Database URL (Change the password if needed)
DATABASE_URL="mysql://root:yourpassword@127.0.0.1:3306/lifelink"

# A secret key to keep user logins safe
JWT_SECRET="my-super-secret-key-for-local-testing"

# Get a free Gemini AI key from https://aistudio.google.com/
GEMINI_API_KEY="your-google-gemini-api-key"

# Master key for doctors
LIFELINK_DEMO_DOCTOR_ACCESS_CODE="lifelink-controlled-clinician-secret-key-2026"

# For Google Sign-in (Optional for local testing)
GOOGLE_OAUTH_CLIENT_ID="your-client-id"
GOOGLE_OAUTH_CLIENT_SECRET="your-client-secret"
AUTH_PUBLIC_BASE_URL="http://localhost:5173"
```

### 4. Create Database Tables and Add Doctors
Run these commands in your terminal to set up the database and add the 24 doctors:
```bash
npm run db:push
npm run db:sync:doctors
```

### 5. Start the App
```bash
npm run dev
```
Now, open your browser and go to **`http://localhost:5173`**.

---

## ☁️ How to Deploy it on the Cloud (Render)

We use **Render** to host the website and **TiDB Serverless** to host the database. Here is how it works:

### 1. Database (TiDB Cloud)
- Go to [TiDB Cloud](https://tidbcloud.com) and create a free Serverless MySQL database.
- Get the connection string (it will look like `mysql://user.root:password@gateway...tidbcloud.com:4000/lifelink?ssl={"rejectUnauthorized":true}`).

### 2. Render Deployment
- Go to your [Render Dashboard](https://dashboard.render.com/) and click **New -> Blueprint**.
- Connect this GitHub repository.
- Render will automatically read the `render.yaml` file in this repository and set everything up for you!

### 3. Add Environment Variables on Render
Because of security rules in `render.yaml`, you must manually add these environment variables in your Render dashboard after connecting the Blueprint:
- `DATABASE_URL`: Your TiDB connection string.
- `GEMINI_API_KEY`: Your Google Gemini API Key.
- `GOOGLE_OAUTH_CLIENT_ID`: Your Google OAuth Client ID.
- `GOOGLE_OAUTH_CLIENT_SECRET`: Your Google OAuth Client Secret.

Render will automatically generate the `JWT_SECRET` for you!

---

## 🛠️ Tech Stack & Commands

**Built With:**
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite 7
- **Backend**: Node.js v22, Express, tRPC
- **Database**: MySQL 8.0, Drizzle ORM
- **AI**: Google Gemini API

**Useful Terminal Commands:**
- `npm run dev` : Starts the app on your computer.
- `npm run build` : Packages the app for production deployment.
- `npm start` : Runs the packaged production app.
- `npm test` : Runs all automated tests to make sure the code works.
- `npm run db:push` : Updates the database with any new tables.
- `npm run db:clear` : Deletes all test patients from the database.
- `npm run db:sync:doctors` : Makes sure all 24 doctors are correctly added to the database.

---
*Created by Sarthak Mandhare for the LifeLink Healthcare Platform.*

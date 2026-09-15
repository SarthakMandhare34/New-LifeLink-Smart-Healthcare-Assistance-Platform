import fs from 'fs';
import path from 'path';

function getCommentForFile(filePath) {
    const normalized = filePath.replace(/\\/g, '/');
    let title = "";
    let explanation = "";

    if (normalized.includes('backend/auth')) {
        title = "SECURITY AND AUTHENTICATION CORE";
        explanation = `WHY THIS FILE IS SPECIAL:
 * This file manages how users securely log into the application.
 * Healthcare apps are prime targets for hackers. Instead of basic security,
 * we use strict token management, password hashing (scrypt), and Google OAuth.
 * This prevents account takeovers, brute force attacks, and identity theft.
 * Never modify these security rules without a senior security audit.`;
    } else if (normalized.includes('backend/ai')) {
        title = "ARTIFICIAL INTELLIGENCE TRIAGE ENGINE";
        explanation = `WHY THIS FILE IS SPECIAL:
 * This is the brain of LifeLink. It connects to Google's Gemini AI supercomputers.
 * It is special because it doesn't just chat; it uses a strict 5-layer safety architecture:
 * 1. Rejects non-medical nonsense.
 * 2. Enforces biological reality (e.g., stopping male pregnancy diagnoses).
 * 3. Enforces pediatric guardrails for children under 18.
 * 4. Categorizes life-threatening emergencies instantly.
 * 5. Forces the AI to output machine-readable JSON instead of just text.`;
    } else if (normalized.includes('backend/realtime')) {
        title = "REAL-TIME EVENT STREAMING (SSE)";
        explanation = `WHY THIS FILE IS SPECIAL:
 * Traditional websites force you to refresh the page to see new data.
 * This file uses Server-Sent Events (SSE). Think of it like a walkie-talkie.
 * The server keeps a persistent, lightweight connection open to the patient's phone.
 * The absolute millisecond a doctor clicks 'Prescribe', the server pushes the 
 * data directly to the patient's screen instantly. It saves battery and network data.`;
    } else if (normalized.includes('backend/routers')) {
        title = "tRPC DOMAIN ROUTERS & BUSINESS LOGIC";
        explanation = `WHY THIS FILE IS SPECIAL:
 * This file contains the actual rules for what patients and doctors can do.
 * It uses tRPC, which creates an unbreakable bridge between the front-end and back-end.
 * More importantly, every single function here enforces IDOR (Insecure Direct Object Reference) protection.
 * It strictly checks: "Does this prescription actually belong to the person requesting it?"`;
    } else if (normalized.includes('backend/_core')) {
        title = "SYSTEM CORE & INFRASTRUCTURE";
        explanation = `WHY THIS FILE IS SPECIAL:
 * These are the foundational building blocks of the backend server.
 * It sets up the Express framework, cookie parsing, and environment variables.
 * Without this core infrastructure, the application cannot boot or talk to the internet securely.`;
    } else if (normalized.includes('database/')) {
        title = "RELATIONAL DATABASE SCHEMA (DRIZZLE ORM)";
        explanation = `WHY THIS FILE IS SPECIAL:
 * This file is the absolute blueprint of how data is stored permanently.
 * We use a tool called Drizzle ORM. It prevents SQL Injection attacks (hackers typing malicious code).
 * It guarantees that if we expect a 'number' for an Age, nobody can accidentally save a 'string'.`;
    } else if (normalized.includes('shared/')) {
        title = "SHARED ISOMORPHIC LOGIC";
        explanation = `WHY THIS FILE IS SPECIAL:
 * The code in this folder is executed by BOTH the front-end browser and the back-end server.
 * This ensures that when we calculate things (like the distance between clinics),
 * both the server and the phone agree on the exact same mathematical rules.`;
    } else if (normalized.includes('frontend/src/features/patient/Assessment')) {
        title = "AI SYMPTOM CHECKER UI";
        explanation = `WHY THIS FILE IS SPECIAL:
 * This React component provides the interface for patients to type their symptoms.
 * It manages complex loading states while waiting for Google's supercomputers to reply,
 * ensuring the user feels calm and informed during a potentially stressful medical moment.`;
    } else if (normalized.includes('frontend/src/features/patient/Specialists')) {
        title = "TRANSIT CLINIC INTERACTIVE MAP";
        explanation = `WHY THIS FILE IS SPECIAL:
 * This file renders the live geographic map using Leaflet.
 * It is highly special because it accesses the patient's GPS coordinates securely.
 * It computes the physical distance to 24 Mumbai railway clinics purely inside the browser memory.
 * Your GPS location is NEVER sent or saved to our servers, ensuring total geographic privacy.`;
    } else if (normalized.includes('frontend/src/features/patient/Prescriptions') || normalized.includes('frontend/src/features/doctor/Prescriptions')) {
        title = "SHA-256 DIGITAL PRESCRIPTIONS UI";
        explanation = `WHY THIS FILE IS SPECIAL:
 * This handles the rendering of official medical prescriptions.
 * To stop prescription fraud (hackers changing 1 pill to 10 pills), it displays 
 * a cryptographic SHA-256 hash. If even one letter of the medicine changes, the hash breaks.`;
    } else if (normalized.includes('frontend/src/features/patient/Emergency')) {
        title = "112 NATIONAL SOS DIALER";
        explanation = `WHY THIS FILE IS SPECIAL:
 * This is the critical emergency override screen.
 * It uses native HTML5 deep-linking (\`tel:112\`) to bypass the browser and instantly
 * force the mobile phone's dialer open to call national emergency services.
 * Seconds matter here, so it is built to load instantly.`;
    } else if (normalized.includes('frontend/src/features/doctor')) {
        title = "CLINICIAN WORKSTATION PORTAL";
        explanation = `WHY THIS FILE IS SPECIAL:
 * This is the heavily restricted portal used by professional doctors.
 * It contains components for reviewing AI Triage reports, managing live consultation queues,
 * and writing clinical notes. It is isolated completely from the patient portal.`;
    } else if (normalized.includes('frontend/src/features/patient')) {
        title = "PATIENT PORTAL UI";
        explanation = `WHY THIS FILE IS SPECIAL:
 * This manages the everyday user interfaces for patients (Dashboard, Health Passport, Medicines).
 * It uses modern React hooks to keep data perfectly synchronized and responsive.`;
    } else if (normalized.includes('frontend/src/components')) {
        title = "REUSABLE UI COMPONENTS (DESIGN SYSTEM)";
        explanation = `WHY THIS FILE IS SPECIAL:
 * Instead of rewriting the code for a button 50 times, we write it once here.
 * This ensures the entire application looks perfectly consistent (using Tailwind CSS)
 * and guarantees every component is accessible to screen readers for visually impaired users.`;
    } else if (normalized.includes('frontend/src/hooks')) {
        title = "CUSTOM REACT HOOKS";
        explanation = `WHY THIS FILE IS SPECIAL:
 * These files contain isolated, reusable behavior. 
 * For example, the auto-logout hook lives here. It constantly monitors mouse movement,
 * and if a doctor leaves their computer for 5 minutes, it logs them out to protect patient data.`;
    } else if (normalized.includes('frontend/src')) {
        title = "FRONTEND REACT CORE";
        explanation = `WHY THIS FILE IS SPECIAL:
 * This is the root configuration of the React application.
 * It sets up the Routing (which URL goes to which page) and global Theme Contexts.`;
    } else {
        return null;
    }

    return `/**
 * ============================================================================
 * ${title}
 * ============================================================================
 * 
 * ${explanation}
 */
`;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (!['node_modules', 'dist', '.git', '.tempmediaStorage', 'public'].includes(file)) {
                processDirectory(fullPath);
            }
        } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            
            // Skip if it already has our massive block comment to avoid duplication
            if (content.includes('WHY THIS FILE IS SPECIAL')) {
                continue;
            }

            // Remove old LIFELINK headers if they exist to replace with our new, better ones
            content = content.replace(/\/\*\*\s*\n\s*\*\s*={10,}.*?\*\/\s*\n/s, '');

            const comment = getCommentForFile(fullPath);
            if (comment) {
                fs.writeFileSync(fullPath, comment + content, 'utf-8');
                console.log(`Commented: ${fullPath}`);
            }
        }
    }
}

// Start processing
const directories = ['backend', 'frontend/src', 'database', 'shared'];

for (const dir of directories) {
    const fullDir = path.join(process.cwd(), dir);
    if (fs.existsSync(fullDir)) {
        processDirectory(fullDir);
    }
}

console.log("Finished adding educational comments to all files!");

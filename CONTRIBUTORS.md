# LifeLink — Project Contributors & Development Guidelines

## Project Author & Contributors

LifeLink is designed, architected, and maintained by:

- **Sarthak Mandhare** ([@sarthakmandhare34](https://github.com/sarthakmandhare34))
  - **Role**: Lead Developer & Project Author
  - **Responsibilities**: Full-stack platform architecture, database schema, AI safety guardrails, doctor-patient dual authentication workflows, and UI engineering.

- **Google**
  - **Role**: AI Development Partner & LLM Infrastructure
  - **Responsibilities**: Gemini AI models (`gemini-3.5-flash-lite`, `gemini-3.5-flash`, `gemini-3.7-flash`), structured schema triage integration, and latency optimization.

---

## 🛠️ Contribution Guidelines & Standards

We welcome contributions to the LifeLink platform. When submitting pull requests, ensure adherence to the following architectural standards:

### 1. Dual Authentication & Session Safety
* Never mix patient and clinician session tokens. Use `COOKIE_NAME = "app_session_id"` for patient procedures and `DOCTOR_COOKIE_NAME = "doctor_session_id"` for clinician procedures.
* Enforce strict authorization on all tRPC endpoints. Patient procedures must use `protectedProcedure` and derive identity from `ctx.user.id`; clinician procedures must use `doctorProcedure` and validate `ctx.user.openId`.

### 2. Clinical AI Triage Safety
* All AI evaluation must pass through the 5-layer safety cascade in `backend/ai/assessmentService.ts`:
  1. Biological Consistency Validation (`shared/biologicalValidation.ts`)
  2. Deterministic 0ms Emergency Regex Override (`hasEmergencyPattern`)
  3. Structured JSON generation with Google Gemini Flash Cascade
  4. Post-processing Pediatric & Adolescent Safeguards (<18 routed to Pediatrics)
  5. Deterministic Safe Offline Fallback
* Never execute Gemini API calls or store API keys in the client layer.

### 3. Design System & Accessibility
* Maintain the **Swiss Clinical Humanist** design system, combining precision clinical typography, high-contrast medical palettes (`#0284C7`, `#0F766E`, `#10B981`), enlarged brand identity, responsive flex-grid layouts, and full light/dark mode contrast parity.
* Adhere strictly to **WCAG 2.1 AA** standards: all interactive components must support keyboard navigation (`Tab`, `Enter`, `Escape`), accessible ARIA labels, minimum 4.5:1 text contrast ratios, and visible focus rings.

### 4. Code Hygiene & Testing
* Run `npm run verify` prior to submitting commits.
* Ensure 0 TypeScript compilation errors (`npm run check`) and 241 passing automated tests across 33 test files (`npm test`) with 100% pass rate.

### 5. Atomic Commit Conventions
* Format commit messages according to Conventional Commits (`feat:`, `fix:`, `docs:`, `perf:`, `build:`, `refactor:`) to maintain a clean, readable git history.

---

## 📄 Related Documentation & Policies

* [**Main Documentation Entry Point (README.md)**](README.md)
* [**System Architecture & Technical Specifications (ARCHITECTURE.md)**](ARCHITECTURE.md)
* [**Relational Database Reference (DATABASE.md)**](DATABASE.md)
* [**Local Development & Installation Guide (SETUP.md)**](SETUP.md)
* [**Automated Testing & Verification Guide (TESTING.md)**](TESTING.md)
* [**Security Policy & Vulnerability Reporting (SECURITY.md)**](SECURITY.md)
* [**System Architecture & Technical Diagrams (SYSTEM_DIAGRAMS.md)**](SYSTEM_DIAGRAMS.md)
* [**Changelog & Version History (CHANGELOG.md)**](CHANGELOG.md)
* [**MIT License (LICENSE)**](LICENSE)

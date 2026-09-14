/**
 * Liquid-glass design note: both patient and doctor flows use the same pearlescent
 * surface system, with page-specific content kept intact inside shared shells.
 */
import React, { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DoctorAppShell } from './components/layout/DoctorAppShell';
import { RouteLoader } from './components/ui/RouteLoader';
import { WorkspaceSelector } from './features/entry/WorkspaceSelector';

// --- Cluster: Code-Split Patient Portal Feature Modules ---
const PatientDashboard = React.lazy(() => import('./features/patient/Dashboard').then(m => ({ default: m.PatientDashboard })));
const HealthPassport = React.lazy(() => import('./features/patient/HealthPassport/HealthPassport').then(m => ({ default: m.HealthPassport })));
const MedicineCabinet = React.lazy(() => import('./features/patient/Medicines/MedicineCabinet').then(m => ({ default: m.MedicineCabinet })));
const PatientLogin = React.lazy(() => import('./features/entry/Login').then(m => ({ default: m.PatientLogin })));
const PatientRegistration = React.lazy(() => import('./features/entry/Register').then(m => ({ default: m.PatientRegistration })));
const AIAssessment = React.lazy(() => import('./features/patient/Assessment/AIAssessment').then(m => ({ default: m.AIAssessment })));
const SpecialistFinder = React.lazy(() => import('./features/patient/Specialists/SpecialistFinder').then(m => ({ default: m.SpecialistFinder })));
const Appointments = React.lazy(() => import('./features/patient/Appointments/Appointments').then(m => ({ default: m.Appointments })));
const Prescriptions = React.lazy(() => import('./features/patient/Prescriptions/Prescriptions').then(m => ({ default: m.Prescriptions })));
const Emergency = React.lazy(() => import('./features/patient/Emergency/Emergency').then(m => ({ default: m.Emergency })));
const Profile = React.lazy(() => import('./features/patient/Profile/Profile').then(m => ({ default: m.Profile })));
const Settings = React.lazy(() => import('./features/patient/Settings/Settings').then(m => ({ default: m.Settings })));

// --- Cluster: Code-Split Doctor Portal Feature Modules ---
const DoctorLogin = React.lazy(() => import('./features/doctor/Login').then(m => ({ default: m.DoctorLogin })));
const DoctorResetPassword = React.lazy(() => import('./features/doctor/ResetPassword').then(m => ({ default: m.DoctorResetPassword })));
const DoctorDashboard = React.lazy(() => import('./features/doctor/Dashboard').then(m => ({ default: m.DoctorDashboard })));
const Patients = React.lazy(() => import('./features/doctor/Patients/Patients').then(m => ({ default: m.Patients })));
const DoctorAppointments = React.lazy(() => import('./features/doctor/Appointments/Appointments').then(m => ({ default: m.DoctorAppointments })));
const Consultation = React.lazy(() => import('./features/doctor/Consultations/Consultation').then(m => ({ default: m.Consultation })));
const DoctorPrescriptions = React.lazy(() => import('./features/doctor/Prescriptions/Prescriptions').then(m => ({ default: m.DoctorPrescriptions })));
const Assessments = React.lazy(() => import('./features/doctor/Assessments/Assessments').then(m => ({ default: m.Assessments })));
const DoctorProfile = React.lazy(() => import('./features/doctor/Profile/Profile').then(m => ({ default: m.DoctorProfile })));
const DoctorSettings = React.lazy(() => import('./features/doctor/Settings/Settings').then(m => ({ default: m.DoctorSettings })));
const PatientView = React.lazy(() => import('./features/doctor/Patients/PatientDetails').then(m => ({ default: m.PatientView })));

/**
 * Main Application Router Component
 * 
 * This component defines the entire routing structure for the LifeLink platform.
 * It separates the application into three main areas:
 * 1. Entry / Public Routes (Login, Registration, Workspace Selection)
 * 2. Patient Portal (/patient/*) - Protected routes wrapped in AppShell
 * 3. Doctor Portal (/doctor/*) - Protected routes wrapped in DoctorAppShell
 * 
 * Feature routes are dynamically code-split using React.lazy to keep the initial
 * load bundle ultra-compact while providing smooth liquid-glass transitions.
 */
function App() {
  return (
    <BrowserRouter>                                                                        {/* HTML5 history pushState navigation container */}
      <Routes>                                                                             {/* Declarative client-side route matcher */}
        {/* Public Entry Routes */}
        <Route path="/" element={<WorkspaceSelector />} />                                  {/* Portal selector for patient vs clinician workspace */}
        <Route path="/login" element={<Suspense fallback={<RouteLoader />}><PatientLogin /></Suspense>} />                                  {/* Patient sign-in form */}
        <Route path="/register" element={<Suspense fallback={<RouteLoader />}><PatientRegistration /></Suspense>} />                        {/* Patient new account registration form */}
        <Route path="/doctor/login" element={<Suspense fallback={<RouteLoader />}><DoctorLogin /></Suspense>} />                            {/* Clinician credential authentication screen */}
        <Route path="/doctor/reset" element={<Suspense fallback={<RouteLoader />}><DoctorResetPassword /></Suspense>} />                    {/* Administrative clinician password reset */}

        {/* Patient Portal Routes - Uses AppShell for layout */}
        <Route path="/patient" element={<AppShell />}>                                      {/* Patient navigation shell with sidebar & header */}
          <Route path="dashboard" element={<PatientDashboard />} />                        {/* Patient home dashboard with live statistics */}
          <Route path="health-passport" element={<HealthPassport />} />                    {/* Emergency medical ID card & patient profile */}
          <Route path="assessment" element={<AIAssessment />} />                            {/* AI symptom triage & specialist recommendation */}
          <Route path="specialists" element={<SpecialistFinder />} />                      {/* Mumbai railway corridor specialist discovery */}
          <Route path="appointments" element={<Appointments />} />                          {/* Patient consultation booking & appointment management */}
          <Route path="medicines" element={<MedicineCabinet />} />                          {/* Medication tracking & dosage adherence */}
          <Route path="prescriptions" element={<Prescriptions />} />                        {/* Digital prescriptions issued by clinicians */}
          <Route path="emergency" element={<Emergency />} />                                {/* Quick-dial SOS emergency contacts & alerts */}
          <Route path="profile" element={<Profile />} />                                    {/* Personal account & avatar settings */}
          <Route path="settings" element={<Settings />} />                                  {/* Appearance & application preferences */}
          {/* Default redirect for /patient */}
          <Route index element={<Navigate to="dashboard" replace />} />                     {/* Redirect /patient to /patient/dashboard */}
        </Route>

        {/* Doctor Portal Routes - Uses DoctorAppShell for layout */}
        <Route path="/doctor" element={<DoctorAppShell />}>                                {/* Clinician workspace layout shell */}
          <Route path="dashboard" element={<DoctorDashboard />} />                          {/* Doctor clinic dashboard with patient queues */}
          <Route path="patients" element={<Patients />} />                                  {/* Assigned patient roster */}
          <Route path="patients/:patientId" element={<PatientView />} />                    {/* Full medical record for single patient */}
          <Route path="appointments" element={<DoctorAppointments />} />                    {/* Consultation scheduling & status updates */}
          <Route path="consultation" element={<Consultation />} />                          {/* Live clinical examination workspace */}
          <Route path="prescriptions" element={<DoctorPrescriptions />} />                  {/* Issued prescription archive */}
          <Route path="prescriptions/create" element={<DoctorPrescriptions />} />           {/* Digital prescription creator */}
          <Route path="assessments" element={<Assessments />} />                            {/* AI triage reports submitted by patients */}
          <Route path="profile" element={<DoctorProfile />} />                              {/* Clinician credentials & specialty information */}
          <Route path="settings" element={<DoctorSettings />} />                            {/* Clinician workspace preferences */}
          {/* Default redirect for /doctor */}
          <Route index element={<Navigate to="dashboard" replace />} />                     {/* Redirect /doctor to /doctor/dashboard */}
        </Route>

        {/* Fallback route for unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />                            {/* Catch-all route redirecting back to home selector */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

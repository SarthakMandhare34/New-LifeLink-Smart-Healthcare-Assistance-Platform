/**
 * ============================================================================
 * PATIENT PORTAL UI
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This manages the everyday user interfaces for patients (Dashboard, Health Passport, Medicines).
 * It uses modern React hooks to keep data perfectly synchronized and responsive.
 */
import React from 'react';                                                                // Core React UI framework
import { useNavigate } from 'react-router-dom';                                                 // Single-page application route navigator
import { 
  Calendar, Activity, Pill, FileText, TriangleAlert, ArrowRight, Clock
} from 'lucide-react';                                                                          // Healthcare status and navigation iconography
import { Card } from '../../components/ui/Card';                                                // Glassmorphic responsive container
import { Button } from '../../components/ui/Button';                                            // Interactive button component
import { trpc } from '../../lib/trpc';                                                          // Type-safe tRPC client bridge
import { useAuth } from '../../_core/hooks/useAuth';                                            // Authentication state hook supplying active user

// Dynamic badge coloring function based on triage urgency - Strictly No Blue, Green, or Purple
function urgencyColor(urgency: string) {
  if (urgency === 'EMERGENCY') return { bg: 'rgba(153, 27, 27, 0.12)', color: '#991B1B' }; // Urgent red styling
  if (urgency === 'MODERATE') return { bg: 'rgba(180, 83, 9, 0.12)', color: '#B45309' };     // Moderate amber styling
  if (urgency === 'ERROR') return { bg: 'rgba(153, 27, 27, 0.12)', color: '#991B1B' };        // Parse warning styling
  return { bg: 'rgba(39, 39, 42, 0.08)', color: '#27272A' };                                  // Routine charcoal styling
}

// =========================================================================================
// PATIENT CLINICAL DASHBOARD
// Serves as the primary patient portal landing screen upon successful authentication.
// Aggregates upcoming scheduled visits, latest AI symptom triage result, active medicine cabinet,
// verified doctor prescriptions, and one-touch emergency hotline access.
// Styled in Classic American Registry Deep Cordovan Wine (#581825) & Soft Bone (#FAF7F2).
// =========================================================================================
export const PatientDashboard = () => {
  const { user } = useAuth();                                                                   // Logged-in session credentials
  const dashboardQuery = trpc.patientDashboard.summary.useQuery();                              // Single aggregated server query
  const navigate = useNavigate();                                                               // Router navigation hook

  // Loading skeleton placeholder while aggregate dashboard query is resolving
  if (dashboardQuery.isLoading) {
    return (
      <div className="dashboard-loading" style={{ padding: '32px', textAlign: 'center' }}>
        <p className="caption" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Loading clinical health summary…</p>
      </div>
    );
  }

  // Error boundary state if patient profile could not be loaded
  if (!dashboardQuery.data?.profile) {
    return (
      <div className="dashboard-loading" style={{ padding: '32px', textAlign: 'center' }}>
        <p className="caption" style={{ color: 'var(--color-semantic-emergency)', fontWeight: 600 }}>Your patient medical profile could not be loaded. Please refresh and try again.</p>
      </div>
    );
  }

  const { profile: patient, latestAssessment, medicines, appointments, prescriptions } = dashboardQuery.data; // Destructure aggregate payload
  
  // Find the closest upcoming confirmed/pending appointment scheduled for the future
  const now = new Date();
  const upcomingAppointment = appointments
    .filter((a) => ['Requested', 'Pending', 'Confirmed'].includes(a.status) && new Date(a.scheduledAt) >= now) // Filter future active appointments
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0] ?? null;         // Pick earliest chronological visit

  const latestPrescription = prescriptions[0] ?? null;                                          // Most recently issued prescription

  // Reusable card styling layout tokens - Theme-aware Amber + Teal palette
  const cardStyle = {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '14px',
    minHeight: '210px',
    background: 'var(--color-surface-white)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    boxShadow: 'var(--shadow-sm)',
  };

  // Icon badge wrapper styling - Amber tinted plate
  const iconWrapperStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '4px',
    background: 'var(--color-primary-muted)',
    display: 'grid',
    placeItems: 'center',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-border)',
    flexShrink: 0
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Patient Overview Header - Warm Amber Accent */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '20px 24px',
          background: 'var(--color-surface-white)',
          border: '1px solid var(--color-border)',
          borderLeft: '4px solid var(--color-primary)',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
              Welcome, {patient.name || user?.name || 'Patient'}
            </h1>
            <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
              Personal Health Profile
            </span>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
              LifeLink Connected Health Hub
            </p>
          </div>
          {patient.bloodGroup ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-neutral">
                Blood: {patient.bloodGroup}
              </span>
            </div>
          ) : null}
        </div>
      </section>

      {/* =====================================================================================
          ROW 1: UPCOMING APPOINTMENT & RECENT AI ASSESSMENT
          ===================================================================================== */}
      <section
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '20px' }}
        aria-label="Health activity"
      >
        {/* Upcoming Appointment Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            <div>
              <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Upcoming Appointment
              </h2>
            </div>
            <div style={iconWrapperStyle}>
              <Calendar size={18} />
            </div>
          </div>

          {upcomingAppointment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={14} color="var(--color-text-muted)" />
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  {new Date(upcomingAppointment.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  {' '}•{' '}
                  {new Date(upcomingAppointment.scheduledAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                {upcomingAppointment.reason || 'General Consultation'}
              </p>
              <span
                className={`badge ${upcomingAppointment.status === 'Confirmed' ? 'badge-amber' : 'badge-neutral'}`}
                style={{ alignSelf: 'flex-start', marginTop: '4px' }}
              >
                {upcomingAppointment.status}
              </span>
            </div>
          ) : (
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>No upcoming visits scheduled.</p>
          )}

          {/* Quick link to appointments manager */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/patient/appointments')}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto' }}
          >
            View Appointments <ArrowRight size={14} />
          </Button>
        </div>

        {/* Recent AI Symptom Assessment Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            <div>
              <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Recent Assessment
              </h2>
            </div>
            <div style={iconWrapperStyle}>
              <Activity size={18} />
            </div>
          </div>

          {latestAssessment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Recorded: {new Date(latestAssessment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <span style={{
                display: 'inline-flex', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', alignSelf: 'flex-start',
                background: urgencyColor(latestAssessment.urgency).bg,
                color: urgencyColor(latestAssessment.urgency).color,
                border: '1px solid currentColor',
                marginTop: '2px'
              }}>
                {latestAssessment.urgency}
              </span>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', margin: '2px 0 0' }}>
                {latestAssessment.specialty}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>No assessments completed yet.</p>
          )}

          {/* Quick link to start or view assessments */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/patient/assessment')}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto' }}
          >
            {latestAssessment ? 'New Assessment' : 'Start Assessment'} <ArrowRight size={14} />
          </Button>
        </div>
      </section>

      {/* =====================================================================================
          ROW 2: ACTIVE MEDICATIONS & OFFICIAL PRESCRIPTIONS
          ===================================================================================== */}
      <section
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '20px' }}
        aria-label="Medical records"
      >
        {/* Medicines Overview Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Medications
            </h2>
            <div style={iconWrapperStyle}>
              <Pill size={18} />
            </div>
          </div>

          {medicines.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {medicines.slice(0, 2).map((med, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--color-background)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                  <Pill size={15} color="var(--color-primary)" />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--color-text)', display: 'block', fontWeight: 700 }}>{med.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{med.dosage}</span>
                  </div>
                </div>
              ))}
              {medicines.length > 2 && (
                <p style={{ fontSize: '0.78rem', color: 'var(--color-primary)', margin: '2px 0 0', fontWeight: 600 }}>+{medicines.length - 2} more on record</p>
              )}
            </div>
          ) : (
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>No medicines recorded.</p>
          )}

          {/* Quick link to medicine cabinet */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/patient/medicines')}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto' }}
          >
            Medicine Cabinet <ArrowRight size={14} />
          </Button>
        </div>

        {/* Digital Prescriptions Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Official Prescriptions
            </h2>
            <div style={iconWrapperStyle}>
              <FileText size={18} />
            </div>
          </div>

          {latestPrescription ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Issued: {new Date(latestPrescription.issuedAt ?? latestPrescription.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text)', margin: '2px 0 0' }}>
                {latestPrescription.clinicalNotes || `Prescription #${latestPrescription.id}`}
              </p>
              <span className="badge badge-amber" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                {latestPrescription.status}
              </span>
            </div>
          ) : (
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>No prescriptions issued yet.</p>
          )}

          {/* Quick link to prescriptions repository */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/patient/prescriptions')}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto' }}
          >
            View Prescriptions <ArrowRight size={14} />
          </Button>
        </div>
      </section>

      {/* =====================================================================================
          EMERGENCY ASSISTANCE CALLOUT BANNER - High-Contrast Amber / Deep Crimson
          ===================================================================================== */}
      <section>
        <div
          role="region"
          aria-label="Emergency assistance"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            padding: '18px 24px',
            background: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(220, 38, 38, 0.25)',
            borderLeft: '4px solid var(--color-semantic-emergency)',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: 'rgba(220, 38, 38, 0.14)', border: '1px solid rgba(220, 38, 38, 0.3)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <TriangleAlert size={20} color="var(--color-semantic-emergency)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-semantic-emergency)', margin: '0 0 2px' }}>
                Emergency Clinical Assistance
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Need urgent medical assistance? Access verified emergency hotlines and services.
              </p>
            </div>
          </div>
          {/* Direct navigation to Emergency Assistance portal */}
          <Button
            variant="danger"
            onClick={() => navigate('/patient/emergency')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, fontWeight: 700 }}
          >
            <TriangleAlert size={16} /> Emergency Assistance
          </Button>
        </div>
      </section>

    </div>
  );
};

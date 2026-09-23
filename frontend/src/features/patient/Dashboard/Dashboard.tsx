/**
 * ============================================================================
 * PATIENT CLINICAL DASHBOARD (frontend/src/features/patient/Dashboard.tsx)
 * ============================================================================
 * 
 * SWISS INTERNATIONAL TYPOGRAPHIC STYLE HEALTHCARE UI
 * Structured clinical information system:
 * 1. Patient identity & credentials header
 * 2. Rapid clinical access toolbar (Quick Actions)
 * 3. Scheduled visits & upcoming appointments
 * 4. Recent triage assessment records
 * 5. Active medication registry & verified digital prescriptions
 * 6. High-contrast Swiss Red (#E30613) emergency protocol section
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Activity, Pill, FileText, TriangleAlert, ArrowRight, Clock,
  MapPin, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { trpc } from '../../../lib/trpc';
import { useAuth } from '../../../_core/hooks/useAuth';

// Swiss semantic triage badge styling
function urgencyBadge(urgency: string) {
  if (urgency === 'EMERGENCY') {
    return { 
      bg: 'var(--swiss-red-soft)', 
      color: 'var(--color-primary)', 
      border: '1px solid var(--swiss-red-border)' 
    };
  }
  if (urgency === 'MODERATE') {
    return { 
      bg: 'var(--swiss-amber-bg)', 
      color: 'var(--swiss-amber-text)', 
      border: '1px solid var(--swiss-amber-border)' 
    };
  }
  return { 
    bg: 'var(--swiss-blue-soft)', 
    color: 'var(--color-accent)', 
    border: '1px solid var(--swiss-blue-border)' 
  };
}

export const PatientDashboard = () => {
  const { user } = useAuth();
  const dashboardQuery = trpc.patientDashboard.summary.useQuery();
  const navigate = useNavigate();

  if (dashboardQuery.isLoading) {
    return (
      <div className="dashboard-loading" style={{ padding: '40px', textAlign: 'center' }}>
        <p className="caption" style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
          Loading clinical health summary…
        </p>
      </div>
    );
  }

  if (!dashboardQuery.data?.profile) {
    return (
      <div className="dashboard-loading" style={{ padding: '40px', textAlign: 'center' }}>
        <p className="caption" style={{ color: 'var(--swiss-red)', fontWeight: 600 }}>
          Your patient medical profile could not be loaded. Please refresh and try again.
        </p>
      </div>
    );
  }

  const { profile: patient, latestAssessment, medicines, appointments, prescriptions } = dashboardQuery.data;

  // Closest upcoming confirmed/pending appointment
  const now = new Date();
  const upcomingAppointment = appointments
    .filter((a) => ['Requested', 'Pending', 'Confirmed'].includes(a.status) && new Date(a.scheduledAt) >= now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0] ?? null;

  const latestPrescription = prescriptions[0] ?? null;

  // Swiss structured card style handled by CSS class: .dashboard-card
  // Header box style handled by CSS class: .dashboard-header-box

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>

      {/* 1. PATIENT IDENTITY / WELCOME HEADER */}
      <section className="dashboard-header-box" aria-label="Patient identity summary">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ 
              display: 'inline-block', 
              fontSize: '0.72rem', 
              fontWeight: 700, 
              color: 'var(--swiss-red)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              marginBottom: '4px' 
            }}>
              Personal Health Profile &bull; LifeLink Connected Care
            </span>
            <h1 style={{ 
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', 
              fontWeight: 800, 
              margin: '0 0 6px', 
              color: 'var(--color-text)', 
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              {patient.name || user?.name || 'Patient'}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0 }}>
              Official medical records, scheduled consultations, and health monitoring
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {patient.bloodGroup ? (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'var(--swiss-red-soft)',
                border: '1px solid var(--swiss-red-border)',
                borderRadius: '2px',
                color: 'var(--color-primary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                <span>BLOOD GROUP:</span>
                <strong>{patient.bloodGroup}</strong>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => navigate('/patient/health-passport')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: '2px',
                color: 'var(--color-text)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Open Digital Health Passport"
            >
              <ShieldCheck size={15} color="var(--swiss-blue)" />
              <span>Verified Record &bull; Health Passport &rarr;</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2 & 3. UPCOMING APPOINTMENTS & RECENT ASSESSMENTS (GRID) */}
      <section
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '24px' }}
        aria-label="Clinical visits and triage"
      >
        {/* Upcoming Appointment */}
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '2px' }}>
            <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Upcoming Consultation
            </h2>
            <Calendar size={18} color="var(--color-accent)" />
          </div>

          {upcomingAppointment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color="var(--color-text-muted)" />
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums' }}>
                  {new Date(upcomingAppointment.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  {' '}•{' '}
                  {new Date(upcomingAppointment.scheduledAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                {upcomingAppointment.reason || 'General Consultation'}
              </p>
              <div style={{ marginTop: '4px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: upcomingAppointment.status === 'Confirmed' ? 'var(--swiss-blue-soft)' : 'var(--color-surface-subtle)',
                  color: upcomingAppointment.status === 'Confirmed' ? 'var(--color-accent)' : 'var(--color-text)',
                  border: upcomingAppointment.status === 'Confirmed' ? '1px solid var(--swiss-blue-border)' : '1px solid var(--color-border)'
                }}>
                  {upcomingAppointment.status}
                </span>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>
              No upcoming consultations scheduled.
            </p>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(upcomingAppointment ? '/patient/appointments' : '/patient/specialists')}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '10px', borderRadius: '2px' }}
          >
            {upcomingAppointment ? 'Manage Appointments' : 'Find Specialist & Book'} <ArrowRight size={14} />
          </Button>
        </div>

        {/* Recent AI Symptom Assessment */}
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '2px' }}>
            <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Recent AI Triage Assessment
            </h2>
            <Activity size={18} color="var(--color-accent)" />
          </div>

          {latestAssessment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Recorded on {new Date(latestAssessment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <div>
                <span style={{
                  display: 'inline-flex',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  ...urgencyBadge(latestAssessment.urgency)
                }}>
                  {latestAssessment.urgency}
                </span>
              </div>
              <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                Specialty: {latestAssessment.specialty}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>
              No symptom assessments recorded yet.
            </p>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/patient/assessment')}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '10px', borderRadius: '2px' }}
          >
            {latestAssessment ? 'New Symptom Assessment' : 'Start Assessment'} <ArrowRight size={14} />
          </Button>
        </div>
      </section>

      {/* 5. ACTIVE MEDICATIONS & OFFICIAL DIGITAL PRESCRIPTIONS (GRID) */}
      <section
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '24px' }}
        aria-label="Medication and prescriptions records"
      >
        {/* Medicines Overview */}
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '2px' }}>
            <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Active Medication Register
            </h2>
            <Pill size={18} color="var(--color-accent)" />
          </div>

          {medicines.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {medicines.slice(0, 3).map((med, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '10px 14px', 
                    background: 'var(--color-surface-subtle)', 
                    borderRadius: '2px', 
                    border: '1px solid var(--color-border)' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Pill size={15} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--color-text)', display: 'block', fontWeight: 700 }}>
                        {med.name}
                      </strong>
                      <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                        {med.dosage} &bull; {med.frequency}
                      </span>
                    </div>
                  </div>
                  {med.schedule && (
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                      {med.schedule}
                    </span>
                  )}
                </div>
              ))}
              {medicines.length > 3 && (
                <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', margin: '4px 0 0', fontWeight: 600 }}>
                  +{medicines.length - 3} more on register
                </p>
              )}
            </div>
          ) : (
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>
              No medications recorded in cabinet.
            </p>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/patient/medicines')}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '10px', borderRadius: '2px' }}
          >
            Open Medicine Cabinet <ArrowRight size={14} />
          </Button>
        </div>

        {/* Official Prescriptions */}
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '2px' }}>
            <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Official Digital Prescriptions
            </h2>
            <FileText size={18} color="var(--color-accent)" />
          </div>

          {latestPrescription ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Issued: {new Date(latestPrescription.issuedAt ?? latestPrescription.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <p style={{ fontSize: '0.90rem', fontWeight: 700, color: 'var(--color-text)', margin: 0, lineHeight: 1.5 }}>
                {latestPrescription.clinicalNotes || `Prescription #${latestPrescription.id}`}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: 'var(--swiss-blue-soft)',
                  color: 'var(--color-accent)',
                  border: '1px solid var(--swiss-blue-border)'
                }}>
                  {latestPrescription.status}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  <CheckCircle2 size={13} color="var(--color-accent)" /> SHA-256 Verified
                </span>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>
              No prescriptions issued yet.
            </p>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/patient/prescriptions')}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '10px', borderRadius: '2px' }}
          >
            View Prescriptions <ArrowRight size={14} />
          </Button>
        </div>
      </section>

      {/* 6. EMERGENCY SECTION - CLEARLY RED (#E30613) */}
      <section>
        <div
          role="region"
          aria-label="Emergency assistance"
          className="dashboard-emergency-section"
        >
          <div className="dashboard-emergency-inner">
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '2px', 
              background: 'var(--swiss-red)', 
              display: 'grid', 
              placeItems: 'center', 
              flexShrink: 0 
            }}>
              <TriangleAlert size={22} color="#FFFFFF" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--swiss-red)', margin: '0 0 2px', letterSpacing: '-0.01em' }}>
                Emergency Medical Assistance
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', margin: 0 }}>
                Immediate hotline dispatch &bull; 2-Step Emergency Protocol &bull; Verified Hotlines
              </p>
            </div>
          </div>
          
          <Button
            variant="danger"
            onClick={() => navigate('/patient/emergency')}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              flexShrink: 0, 
              fontWeight: 700, 
              borderRadius: '2px',
              padding: '10px 20px',
              fontSize: '0.90rem'
            }}
          >
            <TriangleAlert size={16} /> Open Emergency Protocol
          </Button>
        </div>
      </section>

    </div>
  );
};

/**
 * ============================================================================
 * PATIENT CLINICAL DASHBOARD (frontend/src/features/patient/Dashboard.tsx)
 * ============================================================================
 *
 * LIFELINK SWISS CLINICAL HUMANIST UI
 * Structured clinical information system:
 * 1. Patient identity & welcome header (blue identity)
 * 2. Upcoming appointment & recent AI assessment
 * 3. Active medication register & digital prescriptions
 * 4. Emergency assistance panel (red — reserved for critical)
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Activity, Pill, FileText, TriangleAlert, ArrowRight, Clock,
  MapPin, ShieldCheck, CheckCircle2, Stethoscope, Heart, ClipboardList
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { trpc } from '../../../lib/trpc';
import { useAuth } from '../../../_core/hooks/useAuth';

// Urgency badge styles using semantic LifeLink colors
function urgencyBadge(urgency: string) {
  if (urgency === 'EMERGENCY') {
    return {
      bg: 'var(--lifelink-red-soft)',
      color: 'var(--lifelink-red)',
      border: '1px solid var(--lifelink-red-border)'
    };
  }
  if (urgency === 'MODERATE') {
    return {
      bg: 'var(--lifelink-warning-soft)',
      color: 'var(--lifelink-warning)',
      border: '1px solid var(--lifelink-warning-border)'
    };
  }
  return {
    bg: 'var(--lifelink-blue-soft)',
    color: 'var(--lifelink-blue)',
    border: '1px solid var(--lifelink-blue-border)'
  };
}

// Greeting based on time of day
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export const PatientDashboard = () => {
  const { user } = useAuth();
  const dashboardQuery = trpc.patientDashboard.summary.useQuery();
  const navigate = useNavigate();

  if (dashboardQuery.isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        {/* Skeleton: Welcome header */}
        <div className="dashboard-header-box" style={{ minHeight: '120px' }}>
          <div className="skeleton-box" style={{ width: '60%', height: '16px', marginBottom: '12px' }} />
          <div className="skeleton-box" style={{ width: '40%', height: '28px', marginBottom: '8px' }} />
          <div className="skeleton-box" style={{ width: '80%', height: '14px' }} />
        </div>
        {/* Skeleton: Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '24px' }}>
          <div className="dashboard-card" style={{ minHeight: '200px' }}>
            <div className="skeleton-box" style={{ width: '50%', height: '14px' }} />
            <div className="skeleton-box" style={{ width: '70%', height: '18px', marginTop: '16px' }} />
            <div className="skeleton-box" style={{ width: '40%', height: '14px', marginTop: '8px' }} />
          </div>
          <div className="dashboard-card" style={{ minHeight: '200px' }}>
            <div className="skeleton-box" style={{ width: '50%', height: '14px' }} />
            <div className="skeleton-box" style={{ width: '60%', height: '18px', marginTop: '16px' }} />
            <div className="skeleton-box" style={{ width: '35%', height: '14px', marginTop: '8px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardQuery.data?.profile) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: 'var(--border-radius-md)',
          background: 'var(--lifelink-red-soft)',
          marginBottom: '16px'
        }}>
          <TriangleAlert size={24} color="var(--lifelink-red)" />
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
          Unable to load your profile
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
          Your patient medical profile could not be loaded. Please refresh and try again.
        </p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  const { profile: patient, latestAssessment, medicines, appointments, prescriptions } = dashboardQuery.data;

  const now = new Date();
  const upcomingAppointment = appointments
    .filter((a) => ['Requested', 'Pending', 'Confirmed'].includes(a.status) && new Date(a.scheduledAt) >= now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0] ?? null;

  const latestPrescription = prescriptions[0] ?? null;

  const patientName = patient.name || user?.name || 'Patient';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>

      {/* ── 1. WELCOME HEADER ── */}
      <section className="dashboard-header-box" aria-label="Patient identity summary">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{
              display: 'inline-block',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--lifelink-blue)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '4px'
            }}>
              LifeLink Connected Care
            </span>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              fontWeight: 700,
              margin: '0 0 6px',
              color: 'var(--color-text)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              {getGreeting()}, {patientName}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0 }}>
              Here's your health overview and upcoming care.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {patient.bloodGroup ? (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'var(--lifelink-red-soft)',
                border: '1px solid var(--lifelink-red-border)',
                borderRadius: 'var(--border-radius-badge)',
                color: 'var(--lifelink-red)',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                <Heart size={13} />
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
                borderRadius: 'var(--border-radius-badge)',
                color: 'var(--color-text)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Open Digital Health Passport"
            >
              <ShieldCheck size={15} color="var(--lifelink-blue)" />
              <span>Health Passport &rarr;</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. QUICK ACTIONS ── */}
      <section aria-label="Quick actions" style={{ width: '100%', minWidth: 0 }}>
        <div className="dashboard-quick-actions-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
          gap: '12px',
          width: '100%',
          minWidth: 0,
        }}>
          {[
            { label: 'Assessment', icon: Activity, path: '/patient/assessment', color: 'var(--lifelink-blue)' },
            { label: 'Appointments', icon: Calendar, path: '/patient/appointments', color: 'var(--lifelink-blue)' },
            { label: 'Medicines', icon: Pill, path: '/patient/medicines', color: 'var(--lifelink-blue)' },
            { label: 'Specialists', icon: Stethoscope, path: '/patient/specialists', color: 'var(--lifelink-blue)' },
            { label: 'Prescriptions', icon: FileText, path: '/patient/prescriptions', color: 'var(--lifelink-blue)' },
            { label: 'Health Passport', icon: ClipboardList, path: '/patient/health-passport', color: 'var(--lifelink-blue)' },
          ].map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => navigate(action.path)}
              className="dashboard-quick-action"
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <action.icon size={16} />
                {action.label}
              </span>
              <ArrowRight size={14} color="var(--color-text-muted)" />
            </button>
          ))}
        </div>
      </section>

      {/* ── 3. UPCOMING APPOINTMENT & RECENT ASSESSMENT ── */}
      <section
        className="dashboard-primary-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px', width: '100%', minWidth: 0 }}
        aria-label="Clinical visits and triage"
      >
        {/* Upcoming Appointment */}
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '2px' }}>
            <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Upcoming Consultation
            </h2>
            <Calendar size={18} color="var(--lifelink-blue)" />
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
                  borderRadius: 'var(--border-radius-badge)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: upcomingAppointment.status === 'Confirmed' ? 'var(--lifelink-blue-soft)' : 'var(--color-surface-subtle)',
                  color: upcomingAppointment.status === 'Confirmed' ? 'var(--lifelink-blue)' : 'var(--color-text)',
                  border: upcomingAppointment.status === 'Confirmed' ? '1px solid var(--lifelink-blue-border)' : '1px solid var(--color-border)'
                }}>
                  {upcomingAppointment.status}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px', background: 'var(--color-surface-subtle)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px' }}>
                No upcoming appointments
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                You don't have any upcoming consultations scheduled.
              </p>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(upcomingAppointment ? '/patient/appointments' : '/patient/specialists')}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '10px' }}
          >
            {upcomingAppointment ? 'Manage Appointments' : 'Find Specialist & Book'} <ArrowRight size={14} />
          </Button>
        </div>

        {/* Recent AI Assessment */}
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '2px' }}>
            <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Recent AI Triage Assessment
            </h2>
            <Activity size={18} color="var(--lifelink-blue)" />
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
                  borderRadius: 'var(--border-radius-badge)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: urgencyBadge(latestAssessment.urgency).bg,
                  color: urgencyBadge(latestAssessment.urgency).color,
                  border: urgencyBadge(latestAssessment.urgency).border,
                }}>
                  {latestAssessment.urgency}
                </span>
              </div>
              <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                Specialty: {latestAssessment.specialty}
              </p>
            </div>
          ) : (
            <div style={{ padding: '16px', background: 'var(--color-surface-subtle)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px' }}>
                No assessments recorded
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Use the AI-assisted symptom assessment to get guidance on your health concerns.
              </p>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/patient/assessment')}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '10px' }}
          >
            {latestAssessment ? 'New Symptom Assessment' : 'Start Assessment'} <ArrowRight size={14} />
          </Button>
        </div>
      </section>

      {/* ── 4. MEDICINES & PRESCRIPTIONS ── */}
      <section
        className="dashboard-lower-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px', width: '100%', minWidth: 0 }}
        aria-label="Medication and prescriptions records"
      >
        {/* Medicines */}
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '2px' }}>
            <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Active Medication Register
            </h2>
            <Pill size={18} color="var(--lifelink-blue)" />
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
                    borderRadius: 'var(--border-radius-sm)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Pill size={15} style={{ color: 'var(--lifelink-blue)', flexShrink: 0 }} />
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
                <p style={{ fontSize: '0.78rem', color: 'var(--lifelink-blue)', margin: '4px 0 0', fontWeight: 600 }}>
                  +{medicines.length - 3} more on register
                </p>
              )}
            </div>
          ) : (
            <div style={{ padding: '16px', background: 'var(--color-surface-subtle)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px' }}>
                No medicines recorded
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Your medicines will appear here once you add them to your cabinet.
              </p>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/patient/medicines')}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '10px' }}
          >
            Open Medicine Cabinet <ArrowRight size={14} />
          </Button>
        </div>

        {/* Prescriptions */}
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '2px' }}>
            <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Official Digital Prescriptions
            </h2>
            <FileText size={18} color="var(--lifelink-blue)" />
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
                  borderRadius: 'var(--border-radius-badge)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: 'var(--lifelink-blue-soft)',
                  color: 'var(--lifelink-blue)',
                  border: '1px solid var(--lifelink-blue-border)'
                }}>
                  {latestPrescription.status}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  <CheckCircle2 size={13} color="var(--lifelink-success)" /> SHA-256 Verified
                </span>
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px', background: 'var(--color-surface-subtle)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px' }}>
                No prescriptions issued
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Prescriptions issued by your doctors will appear here.
              </p>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/patient/prescriptions')}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '10px' }}
          >
            View Prescriptions <ArrowRight size={14} />
          </Button>
        </div>
      </section>

      {/* ── 5. EMERGENCY PANEL ── */}
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
              borderRadius: 'var(--border-radius-sm)',
              background: 'var(--lifelink-red)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0
            }}>
              <TriangleAlert size={22} color="#FFFFFF" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--lifelink-red)', margin: '0 0 2px', letterSpacing: '-0.01em' }}>
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

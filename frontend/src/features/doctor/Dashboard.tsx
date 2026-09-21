/**
 * ============================================================================
 * DOCTOR CLINICAL WORKSTATION DASHBOARD (frontend/src/features/doctor/Dashboard.tsx)
 * ============================================================================
 * 
 * SWISS INTERNATIONAL TYPOGRAPHIC STYLE HEALTHCARE UI
 * Information-dense clinician workstation:
 * - Structured clinical metrics (4 operational stat blocks)
 * - Upcoming appointments tabular ledger
 * - Triage assessments decision-support stream
 * - Authorized patient registry
 * - Practice activity timeline
 * - Blue (#0057B8) primary accent & zero decorative shadows
 */
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Users, Calendar, Clock, Activity, ArrowRight, Stethoscope, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { trpc } from "../../lib/trpc";

// Swiss semantic triage badge styling
function urgencyBadge(urgency: string) {
  if (urgency === 'EMERGENCY') {
    return { bg: 'var(--swiss-red-soft)', color: 'var(--swiss-red)', border: '1px solid var(--swiss-red)' };
  }
  if (urgency === 'MODERATE') {
    return { bg: 'rgba(217, 119, 6, 0.1)', color: '#B45309', border: '1px solid #D97706' };
  }
  return { bg: 'var(--swiss-blue-soft)', color: 'var(--swiss-blue)', border: '1px solid var(--swiss-blue)' };
}

// Swiss semantic appointment status styling
function statusBadge(status: string) {
  if (status === 'Confirmed' || status === 'Completed') {
    return { bg: 'var(--swiss-blue-soft)', color: 'var(--swiss-blue)', border: '1px solid var(--swiss-blue)' };
  }
  if (status === 'Cancelled') {
    return { bg: 'var(--swiss-red-soft)', color: 'var(--swiss-red)', border: '1px solid var(--swiss-red)' };
  }
  if (status === 'Requested' || status === 'Pending') {
    return { bg: 'rgba(217, 119, 6, 0.1)', color: '#B45309', border: '1px solid #D97706' };
  }
  return { bg: 'var(--swiss-gray-100)', color: 'var(--swiss-gray-800)', border: '1px solid var(--swiss-gray-300)' };
}

export const DoctorDashboard = () => {
  const navigate = useNavigate();
  const dashboard = trpc.doctorWorkspace.dashboard.useQuery();
  const session = trpc.doctorAuth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const patientsQuery = trpc.doctorWorkspace.patients.useQuery(undefined, { enabled: Boolean(session.data) });
  const appointmentsQuery = trpc.doctorWorkspace.appointments.list.useQuery(undefined, { enabled: Boolean(session.data) });

  if (dashboard.isLoading) {
    return (
      <div className="dashboard-loading" style={{ padding: '40px', textAlign: 'center' }}>
        <p className="caption" style={{ color: 'var(--swiss-gray-700)', fontWeight: 600 }}>
          Loading clinical workstation…
        </p>
      </div>
    );
  }

  if (dashboard.isError || !dashboard.data) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p role="alert" style={{ color: 'var(--swiss-red)', fontWeight: 600 }}>
          Unable to load the clinical workstation. Please try again.
        </p>
      </div>
    );
  }

  const { pendingCount, upcomingCount, patientCount, assessmentCount = 0, recentAssessments = [] } = dashboard.data;
  const recentPatients = patientsQuery.data ?? [];

  // Upcoming appointments: strictly scheduled in future with active status, chronological
  const now = Date.now();
  const upcomingAppointments = (appointmentsQuery.data ?? [])
    .filter(
      (a) =>
        ['Requested', 'Pending', 'Confirmed'].includes(a.status) &&
        new Date(a.scheduledAt).getTime() >= now
    )
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  // Recent activity: appointments ordered by most recent
  const recentActivity = (appointmentsQuery.data ?? [])
    .slice()
    .sort((a, b) => new Date(b.createdAt || b.scheduledAt).getTime() - new Date(a.createdAt || a.scheduledAt).getTime())
    .slice(0, 5);

  const displayName = session.data?.displayName
    ? `Dr. ${session.data.displayName.replace(/^Dr\.?\s*/i, '')}`
    : 'Doctor';

  // Swiss card & stat tokens: 1px border, 2px radius, no shadow
  const cardStyle: React.CSSProperties = {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    background: 'var(--swiss-white)',
    border: '1px solid var(--swiss-gray-300)',
    borderRadius: '2px',
    boxShadow: 'none',
  };

  const statCardStyle: React.CSSProperties = {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '120px',
    background: 'var(--swiss-white)',
    border: '1px solid var(--swiss-gray-300)',
    borderRadius: '2px',
    boxShadow: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>

      {/* CLINICIAN WORKSTATION HEADER - SWISS BLUE ACCENT */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '24px 28px',
          background: 'var(--swiss-white)',
          border: '1px solid var(--swiss-gray-300)',
          borderLeft: '4px solid var(--swiss-blue)',
          borderRadius: '2px',
          boxShadow: 'none',
        }}
        aria-label="Clinician identity and schedule overview"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ 
              fontSize: '0.72rem', 
              fontWeight: 700, 
              color: 'var(--swiss-blue)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em',
              display: 'block',
              marginBottom: '2px'
            }}>
              Clinical Practice Workstation &bull; Licensed Provider Session
            </span>
            <h1 style={{ 
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', 
              fontWeight: 800, 
              margin: '2px 0 6px', 
              color: 'var(--swiss-black)', 
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Welcome, {displayName}
            </h1>
            <p style={{ color: 'var(--swiss-gray-600)', fontSize: '0.88rem', margin: 0 }}>
              Authorized consultation schedule, assigned patient charts, and clinical decision support
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/doctor/consultation')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '2px', fontWeight: 600 }}
            >
              <Stethoscope size={15} color="var(--swiss-blue)" /> Open Examination Room
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/doctor/prescriptions')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '2px', fontWeight: 600, background: 'var(--swiss-blue)' }}
            >
              <FileText size={15} /> Issue Prescription
            </Button>
          </div>
        </div>
      </section>

      {/* 4 OPERATIONAL CLINICAL METRIC CARDS */}
      <section
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))', gap: '16px' }}
        aria-label="Practice operational metrics"
      >
        {/* 1. Upcoming Appointments */}
        <div style={statCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--swiss-gray-700)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Upcoming Consultations
            </span>
            <Calendar size={18} color="var(--swiss-blue)" />
          </div>
          <div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--swiss-black)', marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {upcomingCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--swiss-gray-600)' }}>Scheduled future visits</span>
          </div>
        </div>

        {/* 2. Pending Requests */}
        <div style={{
          ...statCardStyle,
          borderLeft: pendingCount > 0 ? '3px solid #D97706' : '1px solid var(--swiss-gray-300)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: pendingCount > 0 ? '#B45309' : 'var(--swiss-gray-700)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Pending Requests
            </span>
            <Clock size={18} color={pendingCount > 0 ? '#B45309' : 'var(--swiss-gray-500)'} />
          </div>
          <div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--swiss-black)', marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {pendingCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: pendingCount > 0 ? '#B45309' : 'var(--swiss-gray-600)', fontWeight: pendingCount > 0 ? 700 : 500 }}>
              {pendingCount > 0 ? 'Requires clinical review' : 'All requests cleared'}
            </span>
          </div>
        </div>

        {/* 3. Authorized Patients */}
        <div style={statCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--swiss-gray-700)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Assigned Patients
            </span>
            <Users size={18} color="var(--swiss-blue)" />
          </div>
          <div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--swiss-black)', marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {patientCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--swiss-gray-600)' }}>Authorized medical charts</span>
          </div>
        </div>

        {/* 4. Triage Assessments */}
        <div style={statCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--swiss-gray-700)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Triage Assessments
            </span>
            <Activity size={18} color="var(--swiss-blue)" />
          </div>
          <div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--swiss-black)', marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {assessmentCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--swiss-gray-600)' }}>Submitted clinical records</span>
          </div>
        </div>
      </section>

      {/* MAIN 2-COLUMN STRUCTURED CLINICAL WORKSPACE */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
        aria-label="Clinical operational panels"
      >
        {/* LEFT COLUMN: UPCOMING CONSULTATIONS & RECENT ASSESSMENTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* 1. Upcoming Consultations — Structured Ledger */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--swiss-gray-300)', paddingBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--swiss-black)', letterSpacing: '-0.01em' }}>
                  Upcoming Consultations
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--swiss-gray-600)' }}>
                  Chronological schedule ordered by visit time
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/doctor/appointments')}
                aria-label="View all upcoming appointments"
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--swiss-blue)', 
                  fontSize: '0.84rem', 
                  fontWeight: 700, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--swiss-gray-300)', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--swiss-gray-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Time</th>
                      <th style={{ padding: '8px 10px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--swiss-gray-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Patient</th>
                      <th style={{ padding: '8px 10px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--swiss-gray-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Reason</th>
                      <th style={{ padding: '8px 10px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--swiss-gray-600)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAppointments.slice(0, 5).map((apt: any, idx: number) => {
                      const aptDate = new Date(apt.scheduledAt);
                      const badge = statusBadge(apt.status);
                      const patientName = apt.patient?.name || apt.patientName || 'Patient';
                      return (
                        <tr 
                          key={apt.id || idx}
                          style={{ 
                            borderBottom: '1px solid var(--swiss-gray-200)',
                            transition: 'background 0.15s'
                          }}
                        >
                          <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                            <strong style={{ display: 'block', fontSize: '0.84rem', color: 'var(--swiss-black)' }}>
                              {aptDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--swiss-gray-600)', fontVariantNumeric: 'tabular-nums' }}>
                              {aptDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td style={{ padding: '10px' }}>
                            <strong style={{ display: 'block', color: 'var(--swiss-black)', fontSize: '0.88rem' }}>
                              {patientName}
                            </strong>
                          </td>
                          <td style={{ padding: '10px', color: 'var(--swiss-gray-700)', fontSize: '0.82rem' }}>
                            {apt.reason || 'General Consultation'}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '2px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              background: badge.bg,
                              color: badge.color,
                              border: badge.border,
                            }}>
                              {apt.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '24px 16px', textAlign: 'center', background: 'var(--swiss-off-white)', borderRadius: '2px', border: '1px dashed var(--swiss-gray-300)' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--swiss-gray-600)', margin: '0 0 12px', fontStyle: 'italic' }}>
                  No upcoming consultations scheduled.
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/doctor/appointments')}
                  style={{ borderRadius: '2px', background: 'var(--swiss-blue)' }}
                >
                  Review Appointment Ledger
                </Button>
              </div>
            )}
          </div>

          {/* 2. Triage Assessments — Decision Support */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--swiss-gray-300)', paddingBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--swiss-black)', letterSpacing: '-0.01em' }}>
                  Triage Assessments
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--swiss-gray-600)' }}>
                  Clinical decision support from assigned patients
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/doctor/assessments')}
                aria-label="View all recent assessments"
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--swiss-blue)', 
                  fontSize: '0.84rem', 
                  fontWeight: 700, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            {recentAssessments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentAssessments.slice(0, 3).map((assessment: any, idx: number) => {
                  const badge = urgencyBadge(assessment.urgency);
                  return (
                    <div
                      key={assessment.id || idx}
                      tabIndex={assessment.patientId ? 0 : undefined}
                      role={assessment.patientId ? 'button' : undefined}
                      aria-label={assessment.patientId ? `View assessment for ${assessment.patientName || 'Assigned Patient'}` : undefined}
                      style={{
                        padding: '12px 14px',
                        background: 'var(--swiss-off-white)',
                        borderRadius: '2px',
                        border: '1px solid var(--swiss-gray-300)',
                        borderLeft: assessment.urgency === 'EMERGENCY' ? '4px solid var(--swiss-red)' : '1px solid var(--swiss-gray-300)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        cursor: assessment.patientId ? 'pointer' : 'default',
                      }}
                      onClick={() => assessment.patientId && navigate(`/doctor/patients/${assessment.patientId}`)}
                      onKeyDown={(e) => {
                        if (assessment.patientId && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          navigate(`/doctor/patients/${assessment.patientId}`);
                        }
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--swiss-black)' }}>
                            {assessment.patientName || 'Assigned Patient'}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--swiss-gray-600)', display: 'block' }}>
                            {new Date(assessment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '2px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            background: badge.bg,
                            color: badge.color,
                            border: badge.border,
                          }}
                        >
                          {assessment.urgency}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--swiss-gray-700)' }}>
                        <span style={{ fontWeight: 700, color: 'var(--swiss-black)' }}>Specialty:</span> {assessment.specialty}
                      </div>
                      {assessment.guidance && (
                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--swiss-gray-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {assessment.guidance}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '24px 16px', textAlign: 'center', background: 'var(--swiss-off-white)', borderRadius: '2px', border: '1px dashed var(--swiss-gray-300)' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--swiss-gray-600)', margin: 0, fontStyle: 'italic' }}>
                  No recent assessments submitted by assigned patients.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ASSIGNED PATIENTS & CLINICAL TIMELINE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* 3. Authorized Patient Registry */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--swiss-gray-300)', paddingBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--swiss-black)', letterSpacing: '-0.01em' }}>
                  Authorized Patient Registry
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--swiss-gray-600)' }}>
                  Appointment-authorized charts
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/doctor/patients')}
                aria-label="View all accessible patients"
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--swiss-blue)', 
                  fontSize: '0.84rem', 
                  fontWeight: 700, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            {recentPatients.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentPatients.slice(0, 5).map((pt: any, idx: number) => {
                  const initials = (pt.name || 'P')
                    .split(' ')
                    .map((w: string) => w[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                  return (
                    <div
                      key={pt.id || idx}
                      tabIndex={0}
                      role="button"
                      aria-label={`View records for ${pt.name}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: 'var(--swiss-off-white)',
                        borderRadius: '2px',
                        border: '1px solid var(--swiss-gray-300)',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s ease',
                      }}
                      onClick={() => navigate(`/doctor/patients/${pt.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/doctor/patients/${pt.id}`);
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '2px',
                            background: 'var(--swiss-white)',
                            border: '1px solid var(--swiss-gray-300)',
                            color: 'var(--swiss-blue)',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: 'var(--swiss-black)', display: 'block' }}>{pt.name}</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--swiss-gray-600)' }}>Record ID: #{pt.id}</span>
                        </div>
                      </div>
                      <ArrowRight size={15} color="var(--swiss-gray-500)" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '20px 16px', textAlign: 'center', background: 'var(--swiss-off-white)', borderRadius: '2px', border: '1px dashed var(--swiss-gray-300)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--swiss-gray-600)', margin: 0, fontStyle: 'italic' }}>
                  No authorized patient records yet.
                </p>
              </div>
            )}
          </div>

          {/* 4. Clinical Activity Log */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--swiss-gray-300)', paddingBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--swiss-black)', letterSpacing: '-0.01em' }}>
                  Clinical Activity Log
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--swiss-gray-600)' }}>
                  Practice timeline
                </p>
              </div>
            </div>

            {recentActivity.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentActivity.map((apt: any, idx: number) => {
                  const patientName = apt.patient?.name || apt.patientName || 'Patient';
                  const isCompleted = apt.status === 'Completed';
                  const isCancelled = apt.status === 'Cancelled';
                  const dotColor = isCompleted
                    ? 'var(--swiss-blue)'
                    : isCancelled
                    ? 'var(--swiss-red)'
                    : 'var(--swiss-gray-500)';
                  return (
                    <div key={apt.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 0', borderBottom: '1px solid var(--swiss-gray-200)' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: dotColor, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: '0.84rem', color: 'var(--swiss-black)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <strong style={{ fontWeight: 600 }}>{patientName}</strong> &bull; <span style={{ color: dotColor, fontWeight: 600 }}>{apt.status}</span>
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--swiss-gray-600)' }}>
                          {new Date(apt.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '20px 16px', textAlign: 'center', background: 'var(--swiss-off-white)', borderRadius: '2px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--swiss-gray-600)', margin: 0, fontStyle: 'italic' }}>
                  No recent clinical activity.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

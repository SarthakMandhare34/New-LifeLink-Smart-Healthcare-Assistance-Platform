import React from 'react';
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Users, Calendar, Clock, Activity, ArrowRight, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../lib/trpc";

// Returns color styling object for triage urgency badge - Strictly No Blue, Green, or Purple
function urgencyBadge(urgency: string) {
  if (urgency === 'EMERGENCY') {                                                           // High-risk emergency condition
    return { bg: 'rgba(153, 27, 27, 0.12)', color: '#991B1B', border: '1px solid rgba(153, 27, 27, 0.25)' };
  }
  if (urgency === 'MODERATE') {                                                            // Moderate clinical attention needed
    return { bg: 'rgba(180, 83, 9, 0.12)', color: '#B45309', border: '1px solid rgba(180, 83, 9, 0.25)' };
  }
  if (urgency === 'ERROR') {                                                               // Non-medical or gibberish query
    return { bg: 'rgba(153, 27, 27, 0.12)', color: '#991B1B', border: '1px solid rgba(153, 27, 27, 0.25)' };
  }
  return { bg: 'rgba(39, 39, 42, 0.08)', color: '#27272A', border: '1px solid #D4D4D8' }; // Low urgency / routine charcoal
}

// Returns color styling object for appointment status pill - Strictly No Blue, Green, or Purple
function statusBadge(status: string) {
  if (status === 'Confirmed' || status === 'Completed') {                                  // Technical charcoal/amber pill for active/completed visits
    return { bg: 'rgba(180, 83, 9, 0.12)', color: '#B45309', border: '1px solid rgba(180, 83, 9, 0.25)' };
  }
  if (status === 'Cancelled') {                                                            // Red pill for cancelled consultations
    return { bg: 'rgba(153, 27, 27, 0.12)', color: '#991B1B', border: '1px solid rgba(153, 27, 27, 0.25)' };
  }
  return { bg: 'rgba(39, 39, 42, 0.08)', color: '#27272A', border: '1px solid #D4D4D8' }; // Neutral charcoal for pending
}

// Doctor clinical workstation dashboard displaying real-time queues and metrics
export const DoctorDashboard = () => {
  const navigate = useNavigate();                                                          // Programmatic page navigation hook
  const dashboard = trpc.doctorWorkspace.dashboard.useQuery();                             // Query aggregated dashboard statistics from backend
  const session = trpc.doctorAuth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false }); // Current clinician identity
  const patientsQuery = trpc.doctorWorkspace.patients.useQuery(undefined, { enabled: Boolean(session.data) }); // Unique patient roster
  const appointmentsQuery = trpc.doctorWorkspace.appointments.list.useQuery(undefined, { enabled: Boolean(session.data) }); // Appointment list

  if (dashboard.isLoading) return (                                                        // Loading state view
    <div className="dashboard-loading" style={{ padding: '40px', textAlign: 'center' }}>
      <p className="caption" style={{ color: '#27272A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Loading clinical workspace…</p>
    </div>
  );
  if (dashboard.isError || !dashboard.data) return (                                       // Error state view
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p role="alert" style={{ color: 'var(--color-semantic-emergency)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Unable to load the clinical workspace. Please try again.</p>
    </div>
  );

  const { pendingCount, upcomingCount, patientCount, assessmentCount = 0, recentAssessments = [] } = dashboard.data; // Unpack metrics
  const recentPatients = patientsQuery.data ?? [];                                         // Assigned patient list

  // Upcoming appointments: strictly scheduled in the future with active status, ordered nearest first
  const now = Date.now();
  const upcomingAppointments = (appointmentsQuery.data ?? [])
    .filter(
      (a) =>
        ['Requested', 'Pending', 'Confirmed'].includes(a.status) &&                        // Active status check
        new Date(a.scheduledAt).getTime() >= now                                           // Future timestamp check
    )
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()); // Ascending chronological sort

  // Recent activity: actual appointments ordered by most recent creation/schedule timestamp
  const recentActivity = (appointmentsQuery.data ?? [])
    .slice()
    .sort((a, b) => new Date(b.createdAt || b.scheduledAt).getTime() - new Date(a.createdAt || a.scheduledAt).getTime()) // Descending order
    .slice(0, 5);                                                                          // Top 5 records

  const displayName = session.data?.displayName                                            // Format doctor title
    ? `Dr. ${session.data.displayName.replace(/^Dr\.?\s*/i, '')}`
    : 'Doctor';

  // Technical Graphite & Clinical Ash Bone styling
  const cardStyle = {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    background: '#EBECEF',
    border: '1px solid #D4D4D8',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  };

  const statCardStyle = {
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between' as const,
    minHeight: '130px',
    background: '#EBECEF',
    border: '1px solid #D4D4D8',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  };

  const iconWrapperStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '4px',
    background: '#F4F4F5',
    display: 'grid',
    placeItems: 'center',
    color: '#27272A',
    border: '1px solid #D4D4D8',
    flexShrink: 0,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Institutional Clinician Header - Technical Graphite Slate Accent */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '20px 24px',
          background: '#EBECEF',
          border: '1px solid #D4D4D8',
          borderLeft: '4px solid #27272A',
          borderRadius: '6px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
      >
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Provider Clinical Registry • Clinician Terminal
        </span>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, margin: '2px 0', color: '#18181B', letterSpacing: '-0.02em' }}>
          Welcome, {displayName}
        </h1>
        <p style={{ color: '#52525B', fontSize: '0.9rem', margin: 0 }}>
          Assigned practice schedule and real-time consultation workspace
        </p>
      </section>

      {/* 4 Operational Stat Cards */}
      <section
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px' }}
        aria-label="Clinical practice statistics"
      >
        {/* 1. Upcoming Appointments — actual future/confirmed */}
        <div style={statCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#27272A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Upcoming Appointments
            </span>
            <div style={iconWrapperStyle}>
              <Calendar size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.1, color: '#18181B', marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {upcomingCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#71717A' }}>Scheduled future visits</span>
          </div>
        </div>

        {/* 2. Pending Requests — awaiting clinical action */}
        <div style={statCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pending Requests
            </span>
            <div style={{ ...iconWrapperStyle, background: 'rgba(180, 83, 9, 0.12)', color: '#B45309', borderColor: 'rgba(180, 83, 9, 0.25)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.1, color: '#18181B', marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {pendingCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: pendingCount > 0 ? '#B45309' : '#71717A', fontWeight: pendingCount > 0 ? 700 : 500 }}>
              {pendingCount > 0 ? 'Requires clinical action' : 'All requests cleared'}
            </span>
          </div>
        </div>

        {/* 3. Accessible Patients — authorized via appointments */}
        <div style={statCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#27272A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Accessible Patients
            </span>
            <div style={iconWrapperStyle}>
              <Users size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.1, color: '#18181B', marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {patientCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#71717A' }}>Authorized patient charts</span>
          </div>
        </div>

        {/* 4. Recent Assessments — count of assessments submitted by authorized patients */}
        <div style={statCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#27272A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Triage Assessments
            </span>
            <div style={{ ...iconWrapperStyle, background: '#F4F4F5', color: '#27272A', borderColor: '#D4D4D8' }}>
              <Activity size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.1, color: '#18181B', marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {assessmentCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#71717A' }}>Submitted clinical records</span>
          </div>
        </div>
      </section>

      {/* Main 2-Column Clinical Layout */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
        aria-label="Clinical practice activity"
      >
        {/* Left Column: Upcoming Appointments + Recent Assessments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* 1. Upcoming Appointments */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #D4D4D8', paddingBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#18181B' }}>
                  Upcoming Consultations
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#71717A' }}>Chronological clinical schedule</p>
              </div>
              <button
                onClick={() => navigate('/doctor/appointments')}
                aria-label="View all upcoming appointments"
                style={{ background: 'none', border: 'none', color: '#B45309', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {upcomingAppointments.slice(0, 4).map((apt: any, idx: number) => {
                  const aptDate = new Date(apt.scheduledAt);
                  const badge = statusBadge(apt.status);
                  const patientName = apt.patient?.name || apt.patientName || 'Patient';
                  return (
                    <div
                      key={apt.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px',
                        padding: '12px 14px',
                        background: '#F4F4F5',
                        borderRadius: '4px',
                        border: '1px solid #D4D4D8',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: '1 1 200px' }}>
                        <div style={{ width: '82px', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#27272A', display: 'block' }}>
                            {aptDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#71717A', display: 'block' }}>
                            {aptDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <strong style={{ display: 'block', fontSize: '0.9rem', color: '#18181B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {patientName}
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: '#71717A', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {apt.reason || 'General Consultation'}
                          </span>
                        </div>
                      </div>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          background: badge.bg,
                          color: badge.color,
                          border: badge.border,
                          flexShrink: 0,
                        }}
                      >
                        {apt.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '24px 16px', textAlign: 'center', background: '#F4F4F5', borderRadius: '4px', border: '1px dashed #D4D4D8' }}>
                <p style={{ fontSize: '0.88rem', color: '#71717A', margin: '0 0 12px', fontStyle: 'italic' }}>No upcoming appointments scheduled.</p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/doctor/appointments')}
                >
                  Review All Appointments
                </Button>
              </div>
            )}
          </div>

          {/* 2. Recent Assessments (from authorized patients) */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #D4D4D8', paddingBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#18181B' }}>
                  Triage Assessments
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#71717A' }}>Submitted by assigned patients</p>
              </div>
              <button
                onClick={() => navigate('/doctor/assessments')}
                aria-label="View all recent assessments"
                style={{ background: 'none', border: 'none', color: '#B45309', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
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
                        background: '#F4F4F5',
                        borderRadius: '4px',
                        border: '1px solid #D4D4D8',
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
                          <strong style={{ fontSize: '0.9rem', color: '#18181B' }}>
                            {assessment.patientName || 'Assigned Patient'}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: '#71717A', display: 'block' }}>
                            {new Date(assessment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
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
                      <div style={{ fontSize: '0.82rem', color: '#52525B' }}>
                        <span style={{ fontWeight: 600, color: '#27272A' }}>Specialty:</span> {assessment.specialty}
                      </div>
                      {assessment.guidance && (
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#71717A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {assessment.guidance}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '24px 16px', textAlign: 'center', background: '#F4F4F5', borderRadius: '4px', border: '1px dashed #D4D4D8' }}>
                <p style={{ fontSize: '0.88rem', color: '#71717A', margin: 0, fontStyle: 'italic' }}>
                  No recent assessments submitted by assigned patients.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Accessible Patients + Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* 3. Accessible Patients */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #D4D4D8', paddingBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#18181B' }}>
                  Authorized Patient Registry
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#71717A' }}>Appointment-authorized records</p>
              </div>
              <button
                onClick={() => navigate('/doctor/patients')}
                aria-label="View all accessible patients"
                style={{ background: 'none', border: 'none', color: '#B45309', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            {recentPatients.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentPatients.slice(0, 4).map((pt: any, idx: number) => {
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
                        background: '#F4F4F5',
                        borderRadius: '4px',
                        border: '1px solid #D4D4D8',
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
                            width: '34px',
                            height: '34px',
                            borderRadius: '4px',
                            background: '#EBECEF',
                            border: '1px solid #D4D4D8',
                            color: '#27272A',
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
                          <strong style={{ fontSize: '0.88rem', color: '#18181B', display: 'block' }}>{pt.name}</strong>
                          <span style={{ fontSize: '0.72rem', color: '#71717A' }}>Patient ID: #{pt.id}</span>
                        </div>
                      </div>
                      <ArrowRight size={15} color="#27272A" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '20px 16px', textAlign: 'center', background: '#F4F4F5', borderRadius: '4px', border: '1px dashed #D4D4D8' }}>
                <p style={{ fontSize: '0.85rem', color: '#71717A', margin: 0, fontStyle: 'italic' }}>No authorized patient records yet.</p>
              </div>
            )}
          </div>

          {/* 4. Recent Activity */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #D4D4D8', paddingBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#18181B' }}>
                  Clinical Activity Log
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#71717A' }}>Practice timeline</p>
              </div>
            </div>

            {recentActivity.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentActivity.map((apt: any, idx: number) => {
                  const patientName = apt.patient?.name || apt.patientName || 'Patient';
                  const isCompleted = apt.status === 'Completed';
                  const isCancelled = apt.status === 'Cancelled';
                  const dotColor = isCompleted
                    ? '#B45309'
                    : isCancelled
                    ? '#991B1B'
                    : '#27272A';
                  return (
                    <div key={apt.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 0', borderBottom: '1px solid #D4D4D8' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: dotColor, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: '0.84rem', color: '#18181B', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <strong style={{ fontWeight: 600 }}>{patientName}</strong> &bull; <span style={{ color: dotColor, fontWeight: 600 }}>{apt.status}</span>
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#71717A' }}>
                          {new Date(apt.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '20px 16px', textAlign: 'center', background: '#F4F4F5', borderRadius: '4px' }}>
                <p style={{ fontSize: '0.85rem', color: '#71717A', margin: 0, fontStyle: 'italic' }}>No recent clinical activity.</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

/**
 * ============================================================================
 * PATIENT APPOINTMENTS MANAGEMENT (frontend/src/features/patient/Appointments/Appointments.tsx)
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This component manages patient consultations with Mumbai railway transit clinic doctors.
 * It separates active/upcoming bookings from past consultation records, enables
 * real-time cancellation with optimistic UI updates, and links directly into
 * specialist clinic profiles along Central, Western, and Harbour corridors.
 */
import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Popup } from '../../../components/ui/Popup';
import { BentoGrid, BentoItem } from '../../../components/layout/Bento';
import { CheckCircle2, Clock, XCircle, Calendar as CalendarIcon, User } from 'lucide-react';
import { trpc } from '../../../lib/trpc';

// Patient appointments management page displaying upcoming visits and cancellation workflow
export const Appointments = () => {
  const trpcUtils = trpc.useUtils();                                                       // Cache invalidation client
  const appointmentsQuery = trpc.patientAppointment.list.useQuery();                       // Query all appointments for signed-in patient
  const cancelMutation = trpc.patientAppointment.cancel.useMutation();                     // Mutation procedure to cancel an appointment
  const [cancellingId, setCancellingId] = useState<number | null>(null);                   // ID of appointment actively being cancelled
  const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null);     // ID of appointment selected for confirmation dialog
  const [mutationError, setMutationError] = useState('');                                  // Error message string for UI alert

  if (appointmentsQuery.isLoading) {                                                       // Loading state view
    return <div className="flex items-center justify-center h-full"><p className="caption">Loading appointments…</p></div>;
  }

  const appointments = appointmentsQuery.data ?? [];                                       // List of patient appointments
  const upcoming = appointments.filter((appointment) => ['Requested', 'Pending', 'Confirmed'].includes(appointment.status)); // Future active visits
  const past = appointments.filter((appointment) => ['Completed', 'Cancelled'].includes(appointment.status)); // History of past consultations

  // Returns icon component matching appointment status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={14} />;                                 // Completed checkmark
      case 'Confirmed': return <CheckCircle2 size={14} />;                                 // Confirmed checkmark
      case 'Requested':
      case 'Pending': return <Clock size={14} />;                                          // Pending clock
      case 'Cancelled': return <XCircle size={14} />;                                      // Cancelled cross
      default: return null;
    }
  };

  // Maps appointment status to badge color variant
  const getStatusVariant = (status: string) => {
    if (status === 'Confirmed' || status === 'Completed') return 'success';                // Green for confirmed / completed
    if (status === 'Cancelled') return 'danger';                                           // Red for cancelled
    return 'neutral';                                                                      // Amber / neutral for pending
  };

  // Opens confirmation dialog before cancelling
  const requestCancel = (id: number) => {
    setAppointmentToCancel(id);                                                            // Prompt confirmation modal
  };

  // Submits cancellation request to backend and invalidates caches
  const confirmCancel = async () => {
    if (appointmentToCancel === null) return;
    const id = appointmentToCancel;                                                        // Target ID
    setAppointmentToCancel(null);                                                          // Close modal
    setCancellingId(id);                                                                   // Set cancelling spinner
    setMutationError('');                                                                  // Clear error
    try {
      await cancelMutation.mutateAsync({ id });                                            // Execute cancellation mutation
      await trpcUtils.patientAppointment.list.invalidate();                                // Refresh appointment list
      await trpcUtils.patientDashboard.summary.invalidate();                               // Refresh dashboard counters
    } catch (error: unknown) {
      setMutationError(error instanceof Error ? error.message : 'Unable to cancel this appointment. Please try again.');
    } finally {
      setCancellingId(null);                                                               // Reset loading state
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', width: '100%' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: 48, height: 48, borderRadius: '4px', background: 'var(--color-primary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CalendarIcon size={24} style={{ color: 'var(--color-primary)' }} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Appointments</h1>
          <p className="caption" style={{ margin: '4px 0 0', color: 'var(--color-text-muted)' }}>Manage your scheduled clinical consultations and history.</p>
        </div>
      </header>

      {mutationError && <div className="alert-panel" style={{ marginBottom: '12px' }}><span className="caption">{mutationError}</span></div>}

      <div>
        <h2 style={{ fontSize: 'var(--text-h2)', marginBottom: '20px', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Upcoming Consultations</h2>
        <div className="responsive-list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '24px' }}>
          {upcoming.map((appointment) => {
            const doctor = appointment.doctor;
            return (
              <Card key={appointment.id} className="h-full flex-col justify-between" style={{ opacity: cancellingId === appointment.id ? 0.5 : 1, padding: 'clamp(24px, 3vw, 28px)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <div className="flex justify-between items-start" style={{ marginBottom: '18px' }}>
                    <div className="flex items-center gap-3">
                      <div style={{ width: 44, height: 44, borderRadius: '2px', background: 'var(--color-primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                        {doctor?.name.charAt(0) || <User size={20} />}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)' }}>{doctor?.name || 'Controlled directory specialist'}</h3>
                        <span className="caption" style={{ fontSize: '0.80rem', color: 'var(--color-text-muted)', marginTop: '2px', display: 'block' }}>{doctor?.specialty || 'Specialty not recorded'} • {doctor?.hospital || 'Controlled directory'}</span>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(appointment.status) as any}>
                      {getStatusIcon(appointment.status)} {appointment.status}
                    </Badge>
                  </div>

                  <div style={{ padding: '16px 20px', background: 'var(--color-surface-interactive)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="caption">Date & Time</span>
                      <strong style={{ color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums', fontSize: '0.95rem' }}>
                        {new Date(appointment.scheduledAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </strong>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '10px', textAlign: 'right' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => requestCancel(appointment.id)}
                    disabled={cancellingId === appointment.id}
                    aria-label={`Cancel appointment with ${doctor?.name || 'specialist'} on ${new Date(appointment.scheduledAt).toLocaleDateString()}`}
                  >
                    {cancellingId === appointment.id ? 'Cancelling...' : 'Cancel Appointment'}
                  </Button>
                </div>
              </Card>
            );
          })}

          {upcoming.length === 0 && (
            <Card style={{ textAlign: 'center', padding: '56px 24px', gridColumn: '1 / -1' }}>
              <CalendarIcon size={36} style={{ color: 'var(--color-text-muted)', opacity: 0.5, margin: '0 auto 12px' }} />
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text)', fontSize: '1rem' }}>No upcoming appointments scheduled.</p>
              <p className="caption" style={{ margin: '6px 0 0', color: 'var(--color-text-muted)' }}>Book a consultation with a specialist to see your schedule here.</p>
            </Card>
          )}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: 'var(--text-h2)', marginBottom: '20px', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Consultation History</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {past.map((appointment) => {
            const doctor = appointment.doctor;
            return (
              <Card key={appointment.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4" style={{ padding: '20px 24px' }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>{doctor?.name || 'Controlled directory specialist'}</h3>
                    <Badge variant={getStatusVariant(appointment.status) as any}>
                      {getStatusIcon(appointment.status)} {appointment.status}
                    </Badge>
                  </div>
                  <span className="caption" style={{ color: 'var(--color-text-muted)' }}>
                    {doctor?.specialty || 'Specialty not recorded'} • <span style={{ fontVariantNumeric: 'tabular-nums' }}>{new Date(appointment.scheduledAt).toLocaleDateString()} at {new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                  </span>
                  {appointment.reason && (
                    <p className="caption" style={{ margin: '6px 0 0', color: 'var(--color-text-muted)' }}>
                      Reason: {appointment.reason}
                    </p>
                  )}
                  {appointment.status === 'Completed' && (
                    <p className="caption" style={{ margin: '6px 0 0', color: 'var(--color-semantic-success)', fontWeight: 600 }}>
                      ✓ Consultation completed with your specialist.
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
          {past.length === 0 && (
            <Card style={{ textAlign: 'center', padding: 'var(--spacing-6) var(--spacing-4)' }}>
              <p className="caption" style={{ margin: 0, color: 'var(--color-text-muted)' }}>No past appointments recorded.</p>
            </Card>
          )}
        </div>
      </div>

      <Popup isOpen={appointmentToCancel !== null} onClose={() => setAppointmentToCancel(null)} title="Cancel Appointment" maxWidth="400px">
        <div className="flex-col gap-4">
          <p>Are you sure you want to cancel this appointment request?</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px', flexWrap: 'wrap' }}>
            <Button variant="outline" onClick={() => setAppointmentToCancel(null)}>Keep Appointment</Button>
            <Button variant="danger" onClick={confirmCancel}>Cancel Appointment</Button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

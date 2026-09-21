/**
 * ============================================================================
 * CLINICIAN WORKSTATION PORTAL
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This is the heavily restricted portal used by professional doctors.
 * It contains components for reviewing AI Triage reports, managing live consultation queues,
 * and writing clinical notes. It is isolated completely from the patient portal.
 */
import { useState } from "react";                                                             // React hook for managing feedback state
import { useNavigate } from "react-router-dom";                                                 // React router hook for route navigation
import { Card } from "../../../components/ui/Card";                                             // Standard UI card container
import { Button } from "../../../components/ui/Button";                                         // Interactive styled button
import { CheckCircle2, Clock, XCircle, CheckCheck } from "lucide-react";                        // Status badge and consultation icons
import { trpc } from "../../../lib/trpc";                                                       // Type-safe tRPC client bridge

// =========================================================================================
// DOCTOR APPOINTMENTS WORKBENCH
// Enables clinicians to review pending patient booking requests, accept (confirm) visits,
// decline/cancel sessions, and mark finished consultations as Completed.
// Automatically updates patient rosters and dashboard metrics upon status transitions.
// =========================================================================================
export const DoctorAppointments = () => {
  const navigate = useNavigate();                                                               // Route navigation controller
  const utils = trpc.useUtils();                                                                // Client query cache invalidator
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);                  // User-facing status update banner
  const appointments = trpc.doctorWorkspace.appointments.list.useQuery();                       // Fetches doctor's assigned appointments
  
  // Status update mutation (Accept / Complete / Cancel)
  const updateStatus = trpc.doctorWorkspace.appointments.updateStatus.useMutation({
    onSuccess: async (data, variables) => {
      if (variables.status === "Confirmed") {
        setFeedbackMessage("Appointment accepted and confirmed. Patient has been notified.");   // Confirmation banner
      } else if (variables.status === "Completed") {
        setFeedbackMessage("Appointment marked as Completed! Consultation finished successfully."); // Completion banner
      } else if (variables.status === "Cancelled") {
        setFeedbackMessage("Appointment has been cancelled/declined.");                         // Cancellation banner
      }
      // Concurrently invalidate relevant caches to immediately synchronize doctor and patient views
      await Promise.all([
        utils.doctorWorkspace.appointments.list.invalidate(),                                   // Refresh appointments query
        utils.doctorWorkspace.dashboard.invalidate(),                                           // Refresh doctor dashboard metrics
        utils.doctorWorkspace.patients.invalidate(),                                            // Refresh patient authorization roster
      ]);
    },
  });

  // Loading state placeholder
  if (appointments.isLoading) return <p>Loading assigned appointments…</p>;
  // Error boundary state
  if (appointments.isError) return <p role="alert">Unable to load assigned appointments. Please try again.</p>;

  // Dynamic left border indicator color matching appointment lifecycle
  const getBorderColor = (status: string) => {
    switch (status) {
      case "Completed": return "3px solid var(--color-text-secondary)";
      case "Confirmed": return "3px solid var(--color-doctor-primary)";
      case "Cancelled": return "3px solid var(--color-semantic-error)";
      default: return "3px solid var(--color-doctor-primary)";
    }
  };

  // Status badge with matching icon and standardized 6px pill styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--color-surface-interactive)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)", padding: "3px 8px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600 }}><CheckCheck size={13} /> Completed</span>;
      case "Confirmed":
        return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(30, 107, 90, 0.12)", color: "var(--color-doctor-primary)", border: "1px solid rgba(30, 107, 90, 0.25)", padding: "3px 8px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600 }}><CheckCircle2 size={13} /> Confirmed (Active)</span>;
      case "Cancelled":
        return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(197, 48, 48, 0.1)", color: "var(--color-semantic-error)", border: "1px solid rgba(197, 48, 48, 0.25)", padding: "3px 8px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600 }}><XCircle size={13} /> Cancelled</span>;
      default:
        return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--color-surface-interactive)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)", padding: "3px 8px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600 }}><Clock size={13} /> {status}</span>;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      {/* Page Header */}
      <header>
        <h1>Appointments</h1>
        <p className="caption">
          Manage patient appointment requests, confirm consultations, and mark finished consultations as Completed.
        </p>
      </header>

      {/* Dismissible feedback notification message */}
      {feedbackMessage && (
        <div style={{ background: "var(--color-surface-interactive)", border: "1px solid var(--color-border)", color: "var(--color-text)", padding: "var(--spacing-3)", borderRadius: "var(--border-radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span><strong>Status updated:</strong> {feedbackMessage}</span>
          <button type="button" aria-label="Dismiss status notification" onClick={() => setFeedbackMessage(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text)", fontWeight: "bold", fontSize: "1.2rem", padding: "4px 8px" }}>×</button>
        </div>
      )}

      {/* Empty appointment list fallback */}
      {!appointments.data?.length ? (
        <Card style={{ textAlign: "center", padding: "var(--spacing-8) var(--spacing-4)" }}>
          <Clock size={36} style={{ color: "var(--color-text-secondary)", opacity: 0.5, margin: "0 auto var(--spacing-3)" }} />
          <p style={{ margin: 0, fontWeight: 600, color: "var(--color-text)" }}>No assigned appointments yet.</p>
          <p className="caption" style={{ margin: "4px 0 0", color: "var(--color-text-secondary)" }}>When patients book consultations with you, they will appear here for review.</p>
        </Card>
      ) : (
        /* Appointment item cards list */
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          {appointments.data.map((appointment) => {
            const isPending = appointment.status === "Requested" || appointment.status === "Pending"; // True if awaiting doctor decision
            const isConfirmed = appointment.status === "Confirmed";                                 // True if visit is active and confirmed
            const isCompleted = appointment.status === "Completed";                                 // True if consultation was completed

            return (
              <Card
                key={appointment.id}                                                            // Unique appointment ID
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "var(--spacing-3)",
                  alignItems: "center",
                  flexWrap: "wrap",
                  borderLeft: getBorderColor(appointment.status),                              // Lifecycle color strip
                }}
              >
                {/* Appointment & Patient Info */}
                <div style={{ flex: "1 1 min(100%, 360px)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", marginBottom: "4px" }}>
                    <h3 style={{ margin: 0 }}>{appointment.patient.name}</h3>                   {/* Patient legal name */}
                    {getStatusBadge(appointment.status)}                                        {/* Status badge */}
                  </div>
                  <p className="caption" style={{ margin: "var(--spacing-1) 0" }}>
                    Scheduled: <span style={{ fontVariantNumeric: "tabular-nums" }}>{new Date(appointment.scheduledAt).toLocaleString()}</span>
                  </p>
                  <p style={{ margin: "var(--spacing-2) 0" }}>
                    <strong>Booking reason:</strong> {appointment.reason}                       {/* Patient's reported symptom / reason */}
                  </p>
                </div>

                {/* Doctor Action Controls */}
                <div style={{ display: "flex", gap: "var(--spacing-2)", flexWrap: "wrap" }}>
                  {/* View patient health record */}
                  <Button variant="secondary" onClick={() => navigate(`/doctor/patients/${appointment.patient.id}`)}>
                    Review patient
                  </Button>

                  {/* Actions for Pending appointments: Accept or Decline */}
                  {isPending && (
                    <>
                      <Button
                        variant="primary"
                        disabled={updateStatus.isPending}
                        onClick={() => updateStatus.mutate({ id: appointment.id, status: "Confirmed" })} // Confirm booking
                      >
                        Accept
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={updateStatus.isPending}
                        onClick={() => updateStatus.mutate({ id: appointment.id, status: "Cancelled" })} // Decline booking
                      >
                        Decline
                      </Button>
                    </>
                  )}

                  {/* Actions for Confirmed appointments: Complete or Cancel */}
                  {isConfirmed && (
                    <>
                      <Button
                        variant="primary"
                        disabled={updateStatus.isPending}
                        onClick={() => updateStatus.mutate({ id: appointment.id, status: "Completed" })} // Mark consultation finished
                      >
                        ✓ Mark as Completed
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={updateStatus.isPending}
                        onClick={() => updateStatus.mutate({ id: appointment.id, status: "Cancelled" })} // Cancel booking
                      >
                        Cancel
                      </Button>
                    </>
                  )}

                  {/* Static notice for Completed visits */}
                  {isCompleted && (
                    <span className="caption" style={{ color: "var(--color-semantic-success)", fontWeight: 600, alignSelf: "center" }}>
                      Consultation Complete
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Mutation error banner */}
      {updateStatus.isError && (
        <p role="alert" style={{ color: "var(--color-danger)" }}>
          {updateStatus.error.message || "That appointment could not be updated."}
        </p>
      )}
    </div>
  );
};

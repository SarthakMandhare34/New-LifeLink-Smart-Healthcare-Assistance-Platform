/**
 * ============================================================================
 * DOCTOR CONSULTATION WORKSPACE (frontend/src/features/doctor/Consultations/Consultation.tsx)
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This component provides the clinical encounter interface for licensed physicians.
 * It filters active patient appointments needing clinical review, provides rapid
 * access to patient medical histories, and initiates the diagnostic consultation workflow.
 */
import { useNavigate } from "react-router-dom";                                                 // Router navigation hook
import { Card } from "../../../components/ui/Card";                                             // Visual card container
import { Button } from "../../../components/ui/Button";                                         // Styled action button
import { CheckCircle2, Clock, Stethoscope, User } from "lucide-react";                          // Clinical consultation icons
import { trpc } from "../../../lib/trpc";                                                       // Type-safe client tRPC bridge

// =========================================================================================
// DOCTOR CONSULTATION WORKSPACE
// Dedicated clinical interface for reviewing active and upcoming appointments.
// Gives clinicians one-click direct access to open the patient's full EHR record and write prescriptions.
// =========================================================================================
export const Consultation = () => {
  const navigate = useNavigate();                                                               // Page navigation controller
  const appointments = trpc.doctorWorkspace.appointments.list.useQuery();                       // Fetches doctor's appointment list

  // Loading indicator while resolving appointment data
  if (appointments.isLoading) return <p>Loading assigned consultations…</p>;

  // Filter only active appointments requiring clinician action
  const activeConsultations = (appointments.data ?? []).filter(
    (a) => a.status === "Confirmed" || a.status === "Requested" || a.status === "Pending",
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      {/* Workspace Header */}
      <header>
        <h1>Consultation Workspace</h1>
        <p className="caption">
          Authorized active consultations for your assigned clinical appointments.
        </p>
      </header>

      {/* Empty consultations view */}
      {activeConsultations.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "var(--spacing-8) var(--spacing-4)" }}>
          <Stethoscope size={40} style={{ color: "var(--color-text-secondary)", opacity: 0.5, margin: "0 auto var(--spacing-3)" }} />
          <h2 style={{ margin: "0 0 var(--spacing-2)", fontSize: "1.2rem", color: "var(--color-text)" }}>No active consultations</h2>
          <p className="caption" style={{ margin: "0 auto", maxWidth: "420px" }}>You have no active appointment requests or confirmed consultations awaiting review.</p>
          <Button variant="primary" onClick={() => navigate("/doctor/appointments")} style={{ marginTop: "var(--spacing-4)" }}>
            View All Appointments
          </Button>
        </Card>
      ) : (
        /* List of active patient consultations */
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          {activeConsultations.map((appointment) => (
            <Card
              key={appointment.id}                                                              // Appointment unique ID
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "var(--spacing-3)",
                borderLeft: appointment.status === "Confirmed" ? "3px solid var(--color-doctor-primary)" : "3px solid var(--color-semantic-warning)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", marginBottom: "4px" }}>
                  <User size={18} style={{ color: "var(--color-doctor-primary)" }} />
                  <h3 style={{ margin: 0 }}>{appointment.patient.name}</h3>                     {/* Patient name */}
                  <span
                    style={{
                      background: appointment.status === "Confirmed" ? "rgba(30, 107, 90, 0.12)" : "rgba(184, 134, 11, 0.12)",
                      color: appointment.status === "Confirmed" ? "var(--color-doctor-primary)" : "var(--color-semantic-warning)",
                      border: appointment.status === "Confirmed" ? "1px solid rgba(30, 107, 90, 0.25)" : "1px solid rgba(184, 134, 11, 0.25)",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {appointment.status === "Confirmed" ? "Confirmed (Ready)" : "Requested"}     {/* Status tag */}
                  </span>
                </div>
                <p className="caption" style={{ margin: "var(--spacing-1) 0" }}>
                  Scheduled: <span style={{ fontVariantNumeric: "tabular-nums" }}>{new Date(appointment.scheduledAt).toLocaleString()}</span>
                </p>
                <p style={{ margin: "var(--spacing-1) 0", fontSize: "0.88rem" }}>
                  <strong>Reason:</strong> {appointment.reason}                                 {/* Patient's reported chief complaint */}
                </p>
              </div>

              {/* Action button opening patient record to prescribe */}
              <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
                <Button variant="primary" onClick={() => navigate(`/doctor/patients/${appointment.patient.id}`)}>
                  Open Clinical Record & Prescribe
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

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
    <div style={{ display: "flex", flexDirection: "column", gap: "36px", width: "100%" }}>
      {/* Workspace Header */}
      <header>
        <h1 style={{ margin: 0 }}>Consultation Workspace</h1>
        <p className="caption" style={{ margin: "6px 0 0" }}>
          Authorized active consultations for your assigned clinical appointments.
        </p>
      </header>

      {/* Empty consultations view */}
      {activeConsultations.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "var(--spacing-10) var(--spacing-6)", borderRadius: "2px" }}>
          <Stethoscope size={40} style={{ color: "var(--color-text-muted)", opacity: 0.5, margin: "0 auto var(--spacing-3)" }} />
          <h2 style={{ margin: "0 0 var(--spacing-2)", fontSize: "1.2rem", color: "var(--color-text)" }}>No active consultations</h2>
          <p className="caption" style={{ margin: "0 auto", maxWidth: "420px" }}>You have no active appointment requests or confirmed consultations awaiting review.</p>
          <Button variant="primary" onClick={() => navigate("/doctor/appointments")} style={{ marginTop: "var(--spacing-4)", borderRadius: "2px", background: "var(--swiss-blue)" }}>
            View All Appointments
          </Button>
        </Card>
      ) : (
        /* List of active patient consultations */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {activeConsultations.map((appointment) => (
            <Card
              key={appointment.id}                                                              // Appointment unique ID
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "20px",
                padding: "24px 28px",
                borderRadius: "2px",
                borderLeft: appointment.status === "Confirmed" ? "3px solid var(--swiss-blue)" : "3px solid var(--swiss-amber-text)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <User size={20} style={{ color: "var(--swiss-blue)" }} />
                  <h3 style={{ margin: 0 }}>{appointment.patient.name}</h3>                     {/* Patient name */}
                  <span
                    style={{
                      background: appointment.status === "Confirmed" ? "var(--swiss-blue-soft)" : "var(--swiss-amber-bg)",
                      color: appointment.status === "Confirmed" ? "var(--swiss-blue)" : "var(--swiss-amber-text)",
                      border: appointment.status === "Confirmed" ? "1px solid var(--swiss-blue)" : "1px solid var(--swiss-amber-border)",
                      padding: "3px 8px",
                      borderRadius: "2px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {appointment.status === "Confirmed" ? "Confirmed (Ready)" : "Requested"}     {/* Status tag */}
                  </span>
                </div>
                <p className="caption" style={{ margin: "4px 0" }}>
                  Scheduled: <span style={{ fontVariantNumeric: "tabular-nums" }}>{new Date(appointment.scheduledAt).toLocaleString()}</span>
                </p>
                <p style={{ margin: "8px 0 0", fontSize: "0.92rem" }}>
                  <strong>Reason:</strong> {appointment.reason}                                 {/* Patient's reported chief complaint */}
                </p>
              </div>

              {/* Action button opening patient record to prescribe */}
              <div style={{ display: "flex", gap: "12px" }}>
                <Button variant="primary" onClick={() => navigate(`/doctor/patients/${appointment.patient.id}`)} style={{ borderRadius: "2px", background: "var(--swiss-blue)" }}>
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

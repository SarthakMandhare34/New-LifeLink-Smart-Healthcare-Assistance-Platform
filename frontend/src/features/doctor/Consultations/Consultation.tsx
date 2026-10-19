/**
 * ============================================================================
 * DOCTOR CLINICAL CONSULTATION WORKSPACE (frontend/src/features/doctor/Consultations/Consultation.tsx)
 * ============================================================================
 *
 * Comprehensive clinical encounter interface:
 * 1. Active Consultation Queue: Lists pending & confirmed appointments awaiting review
 * 2. Active Clinical Encounter View: Supports /doctor/consultation/:appointmentId
 *    - Full patient health passport inspection (allergies, chronic conditions, blood group)
 *    - Direct appointment status transitions (Requested -> Confirmed -> Completed)
 *    - Integrated digital prescription issuance pre-linked to the active encounter
 * ============================================================================
 */
import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { trpc } from "../../../lib/trpc";
import { formatUserFriendlyError } from "../../../lib/errorFormatting";
import {
  Stethoscope,
  User,
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Pill,
  Activity,
  Phone,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";

export const Consultation: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ appointmentId?: string }>();
  const [searchParams] = useSearchParams();
  const utils = trpc.useUtils();

  const activeAppointmentId = params.appointmentId || searchParams.get("appointmentId");
  const [filterStatus, setFilterStatus] = useState<"all" | "Confirmed" | "Requested">("all");

  // Query appointments assigned to this clinician
  const appointmentsQuery = trpc.doctorWorkspace.appointments.list.useQuery(undefined, {
    staleTime: 5000,
  });

  const appointments = appointmentsQuery.data ?? [];

  // If a specific appointment is selected, resolve it
  const selectedAppointment = activeAppointmentId
    ? appointments.find(a => String(a.id) === String(activeAppointmentId))
    : null;

  // Query patient detail if appointment is selected
  const patientDetailQuery = trpc.doctorWorkspace.patientDetail.useQuery(
    { patientId: selectedAppointment?.patient.id as number },
    { enabled: Boolean(selectedAppointment?.patient.id) }
  );

  // Status mutation
  const updateStatusMutation = trpc.doctorWorkspace.appointments.updateStatus.useMutation({
    onSuccess: async () => {
      toast.success("Appointment status updated.");
      await utils.doctorWorkspace.appointments.list.invalidate();
      if (selectedAppointment?.patient.id) {
        await utils.doctorWorkspace.patientDetail.invalidate({
          patientId: selectedAppointment.patient.id,
        });
      }
    },
    onError: error => {
      toast.error(
        `Failed to update appointment: ${formatUserFriendlyError(
          error,
          "Status transition could not be completed."
        )}`
      );
    },
  });

  // Loading state
  if (appointmentsQuery.isLoading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--color-doctor-primary)" }}>
        <p className="caption">Loading clinical consultation workspace…</p>
      </div>
    );
  }

  // Active encounters
  const activeConsultations = appointments.filter(
    a => a.status === "Confirmed" || a.status === "Requested" || a.status === "Pending"
  );

  const filteredConsultations = activeConsultations.filter(a => {
    if (filterStatus === "all") return true;
    return a.status === filterStatus;
  });

  // --------------------------------------------------------------------------
  // VIEW 1: SINGLE CONSULTATION ENCOUNTER WORKSPACE (:appointmentId)
  // --------------------------------------------------------------------------
  if (activeAppointmentId) {
    if (!selectedAppointment) {
      return (
        <Card
          variant="solid"
          style={{
            padding: "36px",
            textAlign: "center",
            maxWidth: "600px",
            margin: "40px auto",
            borderRadius: "var(--border-radius-card)",
          }}
        >
          <AlertTriangle size={36} color="var(--lifelink-warning)" style={{ margin: "0 auto 12px" }} />
          <h2 style={{ margin: "0 0 8px", color: "var(--color-doctor-text)" }}>
            Consultation Encounter Not Found
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", margin: "0 0 20px" }}>
            The requested appointment (#{activeAppointmentId}) could not be found or is not assigned to your clinician account.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/doctor/consultation")}
            style={{ background: "var(--color-doctor-primary)" }}
          >
            Return to Active Roster
          </Button>
        </Card>
      );
    }

    const patient = patientDetailQuery.data?.patient;
    const assessments = patientDetailQuery.data?.assessments ?? [];
    const prescriptions = patientDetailQuery.data?.prescriptions ?? [];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <button
            type="button"
            onClick={() => navigate("/doctor/consultation")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              color: "var(--color-doctor-primary)",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
            }}
          >
            <ArrowLeft size={18} />
            <span>Back to Consultation Queue</span>
          </button>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background:
                selectedAppointment.status === "Confirmed"
                  ? "var(--color-accent-muted)"
                  : "rgba(217, 119, 6, 0.12)",
              color:
                selectedAppointment.status === "Confirmed"
                  ? "var(--color-doctor-primary)"
                  : "var(--color-semantic-warning)",
              padding: "4px 12px",
              borderRadius: "var(--border-radius-badge)",
              fontWeight: 700,
              fontSize: "0.8rem",
            }}
          >
            Status: {selectedAppointment.status}
          </span>
        </div>

        {/* Encounter Header Card */}
        <Card
          variant="solid"
          style={{
            padding: "24px 28px",
            borderRadius: "var(--border-radius-card)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-white)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--border-radius-badge)",
                  background: "var(--color-accent-muted)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--color-doctor-primary)",
                }}
              >
                <User size={22} />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.35rem", color: "var(--color-doctor-text)" }}>
                  {selectedAppointment.patient.name}
                </h1>
                <small style={{ color: "var(--color-text-muted)" }}>
                  Patient ID #{selectedAppointment.patient.id} · Scheduled Encounter #{selectedAppointment.id}
                </small>
              </div>
            </div>
          </div>

          {/* Direct Workflow Actions */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {selectedAppointment.status === "Requested" && (
              <Button
                variant="primary"
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: selectedAppointment.id,
                    status: "Confirmed",
                  })
                }
                disabled={updateStatusMutation.isPending}
                style={{ background: "var(--color-doctor-primary)" }}
              >
                Confirm Consultation
              </Button>
            )}

            {selectedAppointment.status === "Confirmed" && (
              <Button
                variant="outline"
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: selectedAppointment.id,
                    status: "Completed",
                  })
                }
                disabled={updateStatusMutation.isPending}
              >
                Mark Completed
              </Button>
            )}

            <Button
              variant="primary"
              onClick={() =>
                navigate(
                  `/doctor/prescriptions/create?patientId=${selectedAppointment.patient.id}&appointmentId=${selectedAppointment.id}`
                )
              }
              style={{
                background: "var(--color-doctor-primary)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FileText size={16} />
              <span>Issue Prescription</span>
            </Button>
          </div>
        </Card>

        {/* Appointment Chief Complaint Card */}
        <Card
          variant="solid"
          style={{
            padding: "20px 24px",
            borderRadius: "var(--border-radius-card)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-white)",
          }}
        >
          <h2 style={{ fontSize: "1rem", margin: "0 0 10px", color: "var(--color-doctor-text)" }}>
            Chief Medical Complaint & Encounter Schedule
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              fontSize: "0.88rem",
            }}
          >
            <div>
              <span style={{ color: "var(--color-text-muted)", display: "block", fontSize: "0.78rem" }}>
                Scheduled Date & Time
              </span>
              <strong style={{ fontVariantNumeric: "tabular-nums", color: "var(--color-text)" }}>
                {new Date(selectedAppointment.scheduledAt).toLocaleString()}
              </strong>
            </div>
            <div>
              <span style={{ color: "var(--color-text-muted)", display: "block", fontSize: "0.78rem" }}>
                Patient's Reported Reason
              </span>
              <span style={{ color: "var(--color-text)", fontWeight: 500 }}>
                {selectedAppointment.reason || "No complaint recorded."}
              </span>
            </div>
          </div>
        </Card>

        {/* Patient Clinical Baseline EHR Card */}
        <Card
          variant="solid"
          style={{
            padding: "24px",
            borderRadius: "var(--border-radius-card)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-white)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.05rem", margin: 0, color: "var(--color-doctor-text)" }}>
              Patient Clinical Baseline (Health Passport)
            </h2>
            <button
              type="button"
              onClick={() => navigate(`/doctor/patients/${selectedAppointment.patient.id}`)}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-doctor-primary)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
              }}
            >
              Open Full Patient File →
            </button>
          </div>

          {patientDetailQuery.isLoading ? (
            <p className="caption">Loading patient medical baseline…</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                fontSize: "0.88rem",
              }}
            >
              <div>
                <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", display: "block" }}>
                  Blood Group
                </span>
                <strong style={{ fontSize: "1.1rem", color: "var(--color-text)" }}>
                  {patient?.bloodGroup || "Not specified"}
                </strong>
              </div>
              <div>
                <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", display: "block" }}>
                  Verified Allergies
                </span>
                <strong style={{ color: "var(--color-text)" }}>
                  {patient?.allergies?.length ? patient.allergies.join(", ") : "None reported"}
                </strong>
              </div>
              <div>
                <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", display: "block" }}>
                  Chronic Conditions
                </span>
                <strong style={{ color: "var(--color-text)" }}>
                  {patient?.conditions?.length ? patient.conditions.join(", ") : "None reported"}
                </strong>
              </div>
              <div>
                <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", display: "block" }}>
                  Patient Identity
                </span>
                <span style={{ color: "var(--color-text)", fontWeight: 500 }}>
                  {patient?.name || "LifeLink Patient"} (#{patient?.id})
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Recent Prescriptions Issued for this Patient */}
        {prescriptions.length > 0 && (
          <Card
            variant="solid"
            style={{
              padding: "20px 24px",
              borderRadius: "var(--border-radius-card)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface-white)",
            }}
          >
            <h2 style={{ fontSize: "1rem", margin: "0 0 12px", color: "var(--color-doctor-text)" }}>
              Existing Prescriptions ({prescriptions.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {prescriptions.map(rx => (
                <div
                  key={rx.id}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "var(--border-radius-badge)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.85rem",
                  }}
                >
                  <div>
                    <strong>Prescription #{rx.id}</strong> — Issued: {new Date(rx.issuedAt).toLocaleDateString()}
                    <span style={{ color: "var(--color-text-muted)", marginLeft: "12px" }}>
                      Status: {rx.status}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/doctor/prescriptions")}
                    style={{ fontSize: "0.78rem", padding: "4px 10px" }}
                  >
                    View in Rx Ledger
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW 2: ROSTER OF ACTIVE CONSULTATIONS QUEUE
  // --------------------------------------------------------------------------
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%" }}>
      {/* Workspace Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ margin: 0, color: "var(--color-doctor-text)", fontSize: "1.75rem", fontWeight: 700 }}>
            Consultation Workspace
          </h1>
          <p className="caption" style={{ margin: "6px 0 0", color: "var(--color-text-muted)" }}>
            Authorized clinical encounters for your assigned patient appointments.
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setFilterStatus("all")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--border-radius-badge)",
              border: filterStatus === "all" ? "1px solid var(--color-doctor-primary)" : "1px solid var(--color-border)",
              background: filterStatus === "all" ? "var(--color-accent-muted)" : "transparent",
              color: filterStatus === "all" ? "var(--color-doctor-primary)" : "var(--color-text-muted)",
              fontWeight: filterStatus === "all" ? 700 : 500,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            All Active ({activeConsultations.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("Confirmed")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--border-radius-badge)",
              border: filterStatus === "Confirmed" ? "1px solid var(--color-doctor-primary)" : "1px solid var(--color-border)",
              background: filterStatus === "Confirmed" ? "var(--color-accent-muted)" : "transparent",
              color: filterStatus === "Confirmed" ? "var(--color-doctor-primary)" : "var(--color-text-muted)",
              fontWeight: filterStatus === "Confirmed" ? 700 : 500,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            Confirmed
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("Requested")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--border-radius-badge)",
              border: filterStatus === "Requested" ? "1px solid var(--color-doctor-primary)" : "1px solid var(--color-border)",
              background: filterStatus === "Requested" ? "var(--color-accent-muted)" : "transparent",
              color: filterStatus === "Requested" ? "var(--color-doctor-primary)" : "var(--color-text-muted)",
              fontWeight: filterStatus === "Requested" ? 700 : 500,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            Requested
          </button>
        </div>
      </header>

      {/* Empty State */}
      {filteredConsultations.length === 0 ? (
        <Card
          variant="solid"
          style={{
            textAlign: "center",
            padding: "var(--spacing-10) var(--spacing-6)",
            borderRadius: "var(--border-radius-card)",
            background: "var(--color-surface-white)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Stethoscope
            size={40}
            style={{
              color: "var(--color-text-muted)",
              opacity: 0.5,
              margin: "0 auto var(--spacing-3)",
            }}
          />
          <h2 style={{ margin: "0 0 var(--spacing-2)", fontSize: "1.2rem", color: "var(--color-doctor-text)" }}>
            No active consultations
          </h2>
          <p className="caption" style={{ margin: "0 auto", maxWidth: "420px" }}>
            You have no active appointment requests or confirmed consultations awaiting review under the current filter.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/doctor/appointments")}
            style={{
              marginTop: "var(--spacing-4)",
              borderRadius: "var(--border-radius-btn)",
              background: "var(--color-doctor-primary)",
            }}
          >
            View All Historical Appointments
          </Button>
        </Card>
      ) : (
        /* List of active patient consultations */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredConsultations.map(appointment => (
            <Card
              key={appointment.id}
              variant="solid"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "20px",
                padding: "20px 24px",
                borderRadius: "var(--border-radius-card)",
                background: "var(--color-surface-white)",
                border: "1px solid var(--color-border)",
                borderLeft:
                  appointment.status === "Confirmed"
                    ? "4px solid var(--color-doctor-primary)"
                    : "4px solid var(--color-semantic-warning)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <User size={18} style={{ color: "var(--color-doctor-primary)" }} />
                  <h3 style={{ margin: 0, color: "var(--color-doctor-text)", fontSize: "1.05rem" }}>
                    {appointment.patient.name}
                  </h3>
                  <span
                    style={{
                      background:
                        appointment.status === "Confirmed"
                          ? "var(--color-accent-muted)"
                          : "rgba(217, 119, 6, 0.12)",
                      color:
                        appointment.status === "Confirmed"
                          ? "var(--color-doctor-primary)"
                          : "var(--color-semantic-warning)",
                      border:
                        appointment.status === "Confirmed"
                          ? "1px solid var(--color-doctor-primary)"
                          : "1px solid rgba(217, 119, 6, 0.25)",
                      padding: "2px 8px",
                      borderRadius: "var(--border-radius-badge)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    {appointment.status === "Confirmed" ? "Confirmed (Ready)" : "Requested"}
                  </span>
                </div>
                <p className="caption" style={{ margin: "4px 0", color: "var(--color-text-muted)" }}>
                  Scheduled: <span style={{ fontVariantNumeric: "tabular-nums" }}>{new Date(appointment.scheduledAt).toLocaleString()}</span>
                </p>
                <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: "var(--color-text)" }}>
                  <strong>Reason:</strong> {appointment.reason}
                </p>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/doctor/consultation/${appointment.id}`)}
                  style={{
                    borderRadius: "var(--border-radius-btn)",
                    background: "var(--color-doctor-primary)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: 600,
                  }}
                >
                  <span>Open Consultation</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

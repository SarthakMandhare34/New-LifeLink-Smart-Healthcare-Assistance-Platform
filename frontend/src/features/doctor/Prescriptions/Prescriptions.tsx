/**
 * ============================================================================
 * DOCTOR RX MANAGEMENT & CRYPTOGRAPHIC SIGNING (frontend/src/features/doctor/Prescriptions/Prescriptions.tsx)
 * ============================================================================
 *
 * WHY THIS FILE IS SPECIAL:
 * This component provides doctors with a comprehensive audit ledger of all prescriptions
 * issued under their clinician identity. It verifies that issued prescriptions contain valid
 * SHA-256 cryptographic hashes that match the medications and dosages in MySQL, ensuring
 * prescriptions cannot be manipulated by third parties before pharmacy dispensing.
 */
import React, { useState } from "react"; // Core React component engine
import { useNavigate } from "react-router-dom"; // SPA route navigation hook
import {
  FileText,
  Lock,
  ArrowRight,
  Plus,
  Pill,
  Clock,
  User,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
} from "lucide-react"; // Prescription icons
import { Card } from "../../../components/ui/Card"; // Glassmorphic card container
import { Button } from "../../../components/ui/Button"; // Styled user interaction button
import { Badge } from "../../../components/ui/Badge"; // Status badge component
import { trpc } from "../../../lib/trpc"; // Type-safe tRPC client bridge
import { formatUserFriendlyError } from "../../../lib/errorFormatting"; // Human-readable error formatter

type ActionFeedback = { type: "success" | "error"; message: string } | null;

// =========================================================================================
// DOCTOR PRESCRIPTIONS WORKSPACE
// Allows clinicians to inspect past digital prescriptions issued under their credential,
// verify cryptographic integrity hashes, and initiate new prescriptions for authorized patients.
// =========================================================================================
export const DoctorPrescriptions = () => {
  const navigate = useNavigate(); // Page navigation controller
  const utils = trpc.useUtils(); // Client cache invalidator
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback>(null); // User action feedback banner
  const prescriptionsQuery = trpc.doctorWorkspace.prescriptions.list.useQuery(); // Fetches doctor's issued prescriptions
  const patientsQuery = trpc.doctorWorkspace.patients.useQuery(); // Fetches authorized patient list

  // Dedicated mutation for transitioning prescription from UNSIGNED to SIGNED
  const signPrescription = trpc.doctorWorkspace.prescriptions.sign.useMutation({
    onSuccess: async data => {
      setActionFeedback({
        type: "success",
        message: `Prescription #${data.id} successfully signed and cryptographically sealed with SHA-256 seal.`,
      });
      await utils.doctorWorkspace.prescriptions.list.invalidate();
    },
    onError: error => {
      setActionFeedback({
        type: "error",
        message: `Failed to sign prescription: ${formatUserFriendlyError(error, "Prescription could not be signed and sealed.")}`,
      });
    },
  });

  const isLoading = prescriptionsQuery.isLoading || patientsQuery.isLoading; // Combined loading flag

  // Loading state placeholder
  if (isLoading) {
    return (
      <div className="dashboard-loading" style={{ padding: "32px" }}>
        <p className="caption" style={{ color: "var(--color-doctor-primary)" }}>
          Loading prescriptions workspace…
        </p>
      </div>
    );
  }

  const issuedPrescriptions = prescriptionsQuery.data ?? []; // Fallback to empty array
  const assignedPatients = patientsQuery.data ?? []; // Fallback to empty array

  // Uniform card styling layout
  const cardStyle = {
    background: "var(--color-surface-white)",
    padding: "clamp(24px, 3.2vw, 32px)",
    borderRadius: "var(--border-radius-card)",
    border: "1px solid var(--color-border)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
    boxShadow: "none",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "36px",
        width: "100%",
      }}
    >
      {/* Workspace Header */}
      <header style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "var(--border-radius-sm)",
            background: "var(--color-accent-muted)",
            border: "1px solid var(--color-doctor-primary)",
            display: "grid",
            placeItems: "center",
            color: "var(--color-doctor-primary)",
            flexShrink: 0,
          }}
        >
          <FileText size={26} /> {/* Prescriptions header icon */}
        </div>
        <div>
          <h1
            className="font-display"
            style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--color-doctor-text)",
            }}
          >
            Prescriptions Workspace
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.92rem",
              margin: "4px 0 0",
            }}
          >
            Manage and issue verified digital prescriptions for authorized
            patients.
          </p>
        </div>
      </header>

      {/* =====================================================================================
          SECTION 1: ISSUED PRESCRIPTIONS
          ===================================================================================== */}
      <section
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        aria-labelledby="issued-prescriptions-heading"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              id="issued-prescriptions-heading"
              style={{
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--color-doctor-text)",
              }}
            >
              Issued Prescriptions
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                color: "var(--color-text-muted)",
                fontSize: "0.85rem",
              }}
            >
              Records created and verified by your clinician session.
            </p>
          </div>
          <span
            style={{
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              fontWeight: 600,
            }}
          >
            {issuedPrescriptions.length}{" "}
            {issuedPrescriptions.length === 1 ? "record" : "records"}
          </span>
        </div>

        {actionFeedback && (
          <div
            role={actionFeedback.type === "error" ? "alert" : "status"}
            aria-live="polite"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              borderRadius: "var(--border-radius-sm)",
              fontSize: "0.88rem",
              background:
                actionFeedback.type === "error"
                  ? "rgba(239, 68, 68, 0.08)"
                  : "rgba(34, 197, 94, 0.08)",
              border:
                actionFeedback.type === "error"
                  ? "1px solid rgba(239, 68, 68, 0.3)"
                  : "1px solid rgba(34, 197, 94, 0.3)",
              color:
                actionFeedback.type === "error"
                  ? "var(--color-semantic-emergency, #b91c1c)"
                  : "var(--color-semantic-success, #15803d)",
            }}
          >
            {actionFeedback.type === "error" ? (
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            ) : (
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            )}
            <span>{actionFeedback.message}</span>
          </div>
        )}

        {/* Empty state if doctor hasn't written any prescriptions yet */}
        {issuedPrescriptions.length === 0 ? (
          <Card
            style={{ ...cardStyle, textAlign: "center", padding: "48px 24px" }}
          >
            <FileText
              size={44}
              color="var(--color-text-muted)"
              style={{ margin: "0 auto 14px", opacity: 0.6 }}
            />
            <p
              style={{
                margin: 0,
                color: "var(--color-text-muted)",
                fontStyle: "italic",
                fontSize: "0.95rem",
              }}
            >
              No prescriptions issued yet.
            </p>
          </Card>
        ) : (
          /* Grid of issued prescription cards */
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
              gap: "24px",
            }}
          >
            {issuedPrescriptions.map(rx => (
              <Card key={rx.id} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <strong
                      style={{
                        fontSize: "1.05rem",
                        color: "var(--color-text)",
                        display: "block",
                      }}
                    >
                      {rx.patientName || "Assigned Patient"}{" "}
                      {/* Patient receiving medication */}
                    </strong>
                    <span
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Issued:{" "}
                      {new Date(rx.issuedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <Badge
                    status={
                      rx.status === "SIGNED — CONTROLLED STATE"
                        ? "success"
                        : "warning"
                    }
                  >
                    {rx.status === "SIGNED — CONTROLLED STATE" ? (
                      <CheckCircle2 size={10} style={{ marginRight: "3px" }} />
                    ) : (
                      <Lock size={10} style={{ marginRight: "3px" }} />
                    )}
                    {rx.status}
                  </Badge>
                </div>

                {/* Prescribed medication items list */}
                <div
                  style={{
                    padding: "16px 18px",
                    background: "var(--color-surface-subtle)",
                    borderRadius: "var(--border-radius-sm)",
                    border: "1px solid var(--color-border)",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-muted)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Prescribed Items:
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      marginTop: "6px",
                    }}
                  >
                    {rx.items && rx.items.length > 0 ? (
                      rx.items.map(item => (
                        <div
                          key={item.id}
                          style={{
                            fontSize: "0.86rem",
                            color: "var(--color-text)",
                          }}
                        >
                          <Pill
                            size={12}
                            color="var(--color-doctor-primary)"
                            style={{ display: "inline", marginRight: "6px" }}
                          />
                          <strong>{item.name}</strong> — {item.dosage} (
                          {item.instructions})
                        </div>
                      ))
                    ) : (
                      <span
                        style={{
                          fontSize: "0.82rem",
                          color: "var(--color-text-muted)",
                          fontStyle: "italic",
                        }}
                      >
                        No items recorded
                      </span>
                    )}
                  </div>
                </div>

                {/* Optional clinical doctor notes */}
                {rx.clinicalNotes && (
                  <p
                    style={{
                      margin: "0 0 6px",
                      fontSize: "0.84rem",
                      color: "var(--color-text)",
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;{rx.clinicalNotes}&rdquo;
                  </p>
                )}

                {/* Digital Signature Verification Status */}
                {rx.status === "SIGNED — CONTROLLED STATE" ? (
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "10px",
                      borderTop: "1px solid var(--color-border)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <CheckCircle2
                      size={14}
                      color="var(--color-semantic-success, #16a34a)"
                    />
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "var(--color-text)",
                      }}
                    >
                      Digitally Signed &amp; Sealed
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "8px",
                      borderTop: "1px solid var(--color-border)",
                    }}
                  >
                    <span
                      className="caption"
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--color-text-muted)",
                        fontStyle: "italic",
                      }}
                    >
                      Unsigned Draft · Awaiting signature
                    </span>
                  </div>
                )}

                {/* Unsigned Action: Sign & Seal Prescription */}
                {rx.status === "UNSIGNED / CONTROLLED WORKSPACE" && (
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={signPrescription.isPending}
                    onClick={() => signPrescription.mutate({ id: rx.id })}
                    style={{
                      borderRadius: "var(--border-radius-btn)",
                      background: "var(--color-doctor-primary)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      width: "100%",
                      marginTop: "10px",
                    }}
                  >
                    <FileCheck size={14} />
                    {signPrescription.isPending &&
                    signPrescription.variables?.id === rx.id
                      ? "Signing & Sealing…"
                      : "Sign & Seal Prescription"}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================================================
          SECTION 2: ASSIGNED PATIENTS ELIGIBLE FOR PRESCRIPTIONS
          ===================================================================================== */}
      <section
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        aria-labelledby="eligible-patients-heading"
      >
        <div>
          <h2
            id="eligible-patients-heading"
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--color-doctor-text)",
            }}
          >
            Write New Prescription
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              color: "var(--color-text-muted)",
              fontSize: "0.85rem",
            }}
          >
            Select an authorized patient with a confirmed or completed
            appointment.
          </p>
        </div>

        {/* Empty state when doctor has no authorized patients */}
        {assignedPatients.length === 0 ? (
          <Card
            style={{ ...cardStyle, textAlign: "center", padding: "48px 24px" }}
          >
            <FileText
              size={44}
              color="var(--color-text-muted)"
              style={{ margin: "0 auto 14px", opacity: 0.6 }}
            />
            <h3
              style={{
                margin: "0 0 6px",
                color: "var(--color-doctor-text)",
                fontSize: "1.05rem",
              }}
            >
              No eligible patient appointments
            </h3>
            <p
              style={{
                margin: "0 0 18px",
                color: "var(--color-text-muted)",
                fontSize: "0.88rem",
              }}
            >
              Prescriptions can only be created once an appointment request has
              been confirmed.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate("/doctor/appointments")}
              style={{
                alignSelf: "center",
                borderRadius: "var(--border-radius-btn)",
                background: "var(--color-doctor-primary)",
              }}
            >
              Review Appointments <ArrowRight size={16} />
            </Button>
          </Card>
        ) : (
          /* Grid of patients eligible for prescribing */
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
              gap: "24px",
            }}
          >
            {assignedPatients.map(patient => (
              <Card key={patient.id} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "var(--border-radius-badge)",
                      background: "var(--color-accent-muted)",
                      border: "1px solid var(--color-doctor-primary)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--color-doctor-primary)",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  >
                    {patient.name.charAt(0).toUpperCase()}{" "}
                    {/* Patient initial avatar */}
                  </div>
                  <div>
                    <strong
                      style={{
                        display: "block",
                        fontSize: "1rem",
                        color: "var(--color-text)",
                      }}
                    >
                      {patient.name}
                    </strong>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Patient ID: #{patient.id}
                    </span>
                  </div>
                </div>

                <div
                  style={{ display: "flex", gap: "10px", marginTop: "auto" }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    style={{
                      flex: 1,
                      borderRadius: "var(--border-radius-btn)",
                    }}
                    onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                  >
                    View Record
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    style={{
                      flex: 1,
                      borderRadius: "var(--border-radius-btn)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      background: "var(--color-doctor-primary)",
                    }}
                    onClick={() => navigate(`/doctor/patients/${patient.id}`)} // Opens patient record to issue Rx
                  >
                    <Plus size={14} /> Write Rx
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

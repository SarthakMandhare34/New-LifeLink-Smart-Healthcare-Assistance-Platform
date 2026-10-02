/**
 * ============================================================================
 * DOCTOR CLINICAL EHR INSPECTOR & RX SUITE (frontend/src/features/doctor/Patients/PatientDetails.tsx)
 * ============================================================================
 *
 * WHY THIS FILE IS SPECIAL:
 * This is the comprehensive patient chart interface for authorized clinicians.
 * It enforces relationship-based access control (only allowing doctors to view patients
 * with confirmed/active appointments), displays the patient's full medical baseline,
 * and integrates the digital prescription authoring engine with cryptographic SHA-256 signing.
 */
import { useState } from "react";                                                             // React hook for form tracking
import { useParams } from "react-router-dom";                                                   // Extracts URL parameters (patientId)
import { Card } from "../../../components/ui/Card";                                             // Visual card container
import { Button } from "../../../components/ui/Button";                                         // Styled button
import { Input } from "../../../components/ui/Input";                                           // Styled input
import { Badge } from "../../../components/ui/Badge";                                           // Status badge component
import { Activity, AlertTriangle, CalendarCheck, CheckCircle2, FileCheck, FileText, Info, Lock, Pill, Trash2 } from "lucide-react"; // Clinical records iconography
import { trpc } from "../../../lib/trpc";                                                       // Type-safe tRPC client bridge

// Formats array of strings into comma-separated text or fallback
const listOrNotRecorded = (items: string[]) => items.length ? items.join(", ") : "Not recorded"; // Format helper
type PrescriptionItem = { name: string; dosage: string; instructions: string };                 // Prescription item data shape
type FeedbackState = { type: "success" | "error" | "info"; message: string } | null;

// Formats error messages, gracefully parsing Zod schema arrays into clear clinician guidance
function formatErrorMessage(errorMsg: string): string {
  if (!errorMsg) return "An unexpected error occurred.";
  try {
    const parsed = JSON.parse(errorMsg);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const messages = parsed.map((issue: any) => {
        if (issue.path && Array.isArray(issue.path)) {
          const path = issue.path;
          if (path[0] === "items" && typeof path[1] === "number") {
            const itemIdx = path[1] + 1;
            const field = path[2];
            const fieldLabel =
              field === "name"
                ? "medicine name"
                : field === "dosage"
                ? "dosage"
                : field === "instructions"
                ? "instructions"
                : String(field);
            return `Medication #${itemIdx}: ${fieldLabel} is required`;
          }
          if (path.length > 0) {
            return `${path.join(".")}: ${issue.message || "Invalid value"}`;
          }
        }
        return issue.message || "Invalid input";
      });
      return Array.from(new Set(messages)).join("; ") + ".";
    }
  } catch {
    // Not a JSON string
  }
  return errorMsg;
}

// =========================================================================================
// DOCTOR CLINICAL PATIENT RECORD INSPECTOR & PRESCRIPTION WRITER
// Provides appointment-authorized deep inspection of an individual patient's medical baseline:
// - Health passport summary (Blood Group, Allergies, Chronic Conditions)
// - Historical AI triage assessment summaries
// - Active medicine cabinet regimens
// - Prescription authoring suite with explicit signing mutation
// =========================================================================================
export const PatientView = () => {
  const { patientId } = useParams();                                                            // Retrieve patient ID from URL
  const parsedPatientId = Number(patientId);                                                    // Parse as number
  const utils = trpc.useUtils();                                                                // Client cache manager
  const [clinicalNotes, setClinicalNotes] = useState("");                                       // Clinician diagnostic notes state
  const [items, setItems] = useState<PrescriptionItem[]>([{ name: "", dosage: "", instructions: "" }]); // Medicine item list state
  const [feedback, setFeedback] = useState<FeedbackState>(null);                               // User status feedback state
  const [itemErrors, setItemErrors] = useState<Record<number, { name?: boolean; dosage?: boolean; instructions?: boolean }>>({}); // Inline input errors
  const [isSigningImmediately, setIsSigningImmediately] = useState(false);                     // Track sign immediately flow

  // Query patient detail with relationship authorization check on backend
  const detail = trpc.doctorWorkspace.patientDetail.useQuery(
    { patientId: parsedPatientId },
    { enabled: Number.isInteger(parsedPatientId) && parsedPatientId > 0 }
  );

  // Mutation to persist a new digital prescription (created in UNSIGNED status)
  const createPrescription = trpc.doctorWorkspace.prescriptions.create.useMutation({
    onSuccess: async () => {
      setFeedback({
        type: "info",
        message: "Prescription draft saved in UNSIGNED / CONTROLLED WORKSPACE.",
      });
      setClinicalNotes("");                                                                     // Clear notes
      setItems([{ name: "", dosage: "", instructions: "" }]);                                   // Reset medicine item inputs
      setItemErrors({});
      await utils.doctorWorkspace.patientDetail.invalidate({ patientId: parsedPatientId });      // Invalidate patient cache
    },
    onError: (error) => setFeedback({
      type: "error",
      message: formatErrorMessage(error.message),
    }),
  });

  // Dedicated explicit mutation to transition prescription from UNSIGNED to SIGNED
  const signPrescription = trpc.doctorWorkspace.prescriptions.sign.useMutation({
    onSuccess: async (data) => {
      setFeedback({
        type: "success",
        message: `Prescription #${data.id} successfully signed and cryptographically sealed with SHA-256 seal.`,
      });
      await Promise.all([
        utils.doctorWorkspace.patientDetail.invalidate({ patientId: parsedPatientId }),
        utils.doctorWorkspace.prescriptions.list.invalidate(),
      ]);
    },
    onError: (error) => setFeedback({
      type: "error",
      message: `Signing failed: ${formatErrorMessage(error.message)}`,
    }),
  });

  // Mutation to update appointment status (e.g. Accept or Complete)
  const updateStatus = trpc.doctorWorkspace.appointments.updateStatus.useMutation({
    onSuccess: async () => {
      setFeedback({
        type: "success",
        message: "Appointment updated successfully.",
      });
      await Promise.all([
        utils.doctorWorkspace.patientDetail.invalidate({ patientId: parsedPatientId }),         // Refresh patient record
        utils.doctorWorkspace.appointments.list.invalidate(),                                   // Refresh appointment list
        utils.doctorWorkspace.dashboard.invalidate(),                                           // Refresh doctor dashboard counters
      ]);
    },
    onError: (error) => setFeedback({
      type: "error",
      message: formatErrorMessage(error.message),
    }),
  });

  // Validation guards
  if (!Number.isInteger(parsedPatientId) || parsedPatientId <= 0) return <p role="alert">Invalid patient record request.</p>;
  if (detail.isLoading) return <p>Verifying the appointment relationship and loading the authorized patient summary…</p>;
  if (detail.isError || !detail.data) return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      <header><h1>Patient Record</h1></header>
      <Card style={{ textAlign: "center", padding: "var(--spacing-6) var(--spacing-4)" }}>
        <Lock size={40} color="var(--color-text-muted)" />
        <h2>Not authorized</h2>
        <p>This patient is not linked to an appointment assigned to the signed synthetic doctor.</p>
      </Card>
    </div>
  );

  const { patient, appointments, medicines, assessments, prescriptions = [] } = detail.data; // Destructure authorized payload
  const hasActiveOrCompleted = appointments.some((appointment) => appointment.status === "Confirmed" || appointment.status === "Completed"); // Eligible to prescribe check

  // Prescribed items form managers
  const updateItem = (index: number, field: keyof PrescriptionItem, value: string) => {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
    if (itemErrors[index]?.[field]) {
      setItemErrors((current) => ({
        ...current,
        [index]: { ...current[index], [field]: false },
      }));
    }
    if (feedback?.type === "error") {
      setFeedback(null);
    }
  };

  const removeItem = (index: number) => {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setItemErrors((current) => {
      const next: Record<number, { name?: boolean; dosage?: boolean; instructions?: boolean }> = {};
      let nextIdx = 0;
      Object.keys(current).forEach((key) => {
        const k = Number(key);
        if (k !== index) {
          next[nextIdx] = current[k];
          nextIdx++;
        }
      });
      return next;
    });
  };

  // Submit prescription handler - supports creating draft or creating and signing immediately
  const handleSavePrescription = async (signImmediately: boolean) => {
    setFeedback(null);
    setItemErrors({});

    // Client-side validation: must have at least one medication item
    if (items.length === 0) {
      setFeedback({
        type: "error",
        message: "Please add at least one medication to the prescription.",
      });
      return;
    }

    // Client-side validation: all items must have non-empty name, dosage, instructions
    const newErrors: Record<number, { name?: boolean; dosage?: boolean; instructions?: boolean }> = {};
    let hasError = false;
    const missingDescriptions: string[] = [];

    items.forEach((item, index) => {
      const err: { name?: boolean; dosage?: boolean; instructions?: boolean } = {};
      if (!item.name.trim()) {
        err.name = true;
        hasError = true;
      }
      if (!item.dosage.trim()) {
        err.dosage = true;
        hasError = true;
      }
      if (!item.instructions.trim()) {
        err.instructions = true;
        hasError = true;
      }
      if (err.name || err.dosage || err.instructions) {
        newErrors[index] = err;
        const missingLabels: string[] = [];
        if (err.name) missingLabels.push("medicine name");
        if (err.dosage) missingLabels.push("dosage");
        if (err.instructions) missingLabels.push("instructions");
        missingDescriptions.push(`Medication #${index + 1} (${missingLabels.join(", ")})`);
      }
    });

    if (hasError) {
      setItemErrors(newErrors);
      setFeedback({
        type: "error",
        message: `Please complete all required medication fields: ${missingDescriptions.join("; ")}.`,
      });
      return;
    }

    setIsSigningImmediately(signImmediately);
    try {
      const created = await createPrescription.mutateAsync({
        patientId: parsedPatientId,
        clinicalNotes: clinicalNotes.trim() || undefined,
        items: items.map((item) => ({
          name: item.name.trim(),
          dosage: item.dosage.trim(),
          instructions: item.instructions.trim(),
        })),
      });
      if (signImmediately && created?.id) {
        await signPrescription.mutateAsync({ id: created.id });
      }
    } catch {
      // Error message is formatted and set by mutation onError callbacks
    } finally {
      setIsSigningImmediately(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px", width: "100%" }}>
      {/* Header */}
      <header>
        <h1 style={{ margin: 0, color: "var(--color-doctor-text)" }}>Patient Record</h1>
        <p className="caption" style={{ margin: "6px 0 0" }}>{patient.name} · Appointment-authorized summary</p>
      </header>

      {/* Health Passport summary */}
      <Card style={{ padding: "clamp(26px, 3.5vw, 32px)", borderRadius: "var(--border-radius-card)" }}>
        <h2 style={{ margin: "0 0 20px", color: "var(--color-doctor-text)" }}>Health Passport summary</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "20px" }}>
          <div style={{ padding: "16px 20px", background: "var(--color-surface-subtle)", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-border)" }}>
            <p className="caption" style={{ margin: "0 0 6px" }}>Blood group</p>
            <strong style={{ fontSize: "1.1rem", color: "var(--color-text)" }}>{patient.bloodGroup}</strong>                                               {/* Patient blood group */}
          </div>
          <div style={{ padding: "16px 20px", background: "var(--color-surface-subtle)", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-border)" }}>
            <p className="caption" style={{ margin: "0 0 6px" }}>Allergies</p>
            <strong style={{ color: "var(--color-text)" }}>{listOrNotRecorded(patient.allergies)}</strong>                             {/* Allergies */}
          </div>
          <div style={{ padding: "16px 20px", background: "var(--color-surface-subtle)", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-border)" }}>
            <p className="caption" style={{ margin: "0 0 6px" }}>Conditions</p>
            <strong style={{ color: "var(--color-text)" }}>{listOrNotRecorded(patient.conditions)}</strong>                            {/* Chronic conditions */}
          </div>
        </div>
        <p className="caption" style={{ marginTop: "20px" }}>Email, phone, emergency contacts, and unrelated patient records are intentionally not exposed to this doctor workspace.</p>
      </Card>

      {/* Booking Context */}
      <Card style={{ padding: "clamp(26px, 3.5vw, 32px)", borderRadius: "var(--border-radius-card)" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px", color: "var(--color-doctor-text)" }}>
          <CalendarCheck size={22} color="var(--color-doctor-primary)" /> Booking context
        </h2>
        <div style={{ display: "grid", gap: "16px" }}>
          {appointments.map((appointment) => (
            <div key={appointment.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", padding: "18px 22px", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-sm)", background: "var(--color-surface-subtle)" }}>
              <div>
                <strong style={{ fontSize: "1rem", color: "var(--color-text)" }}>{new Date(appointment.scheduledAt).toLocaleString()} · {appointment.status}</strong>
                <p className="caption" style={{ margin: "6px 0 0" }}>Reason: {appointment.reason || "No booking reason was recorded."}</p>
              </div>
              {appointment.status === "Requested" || appointment.status === "Pending" ? (
                <Button size="sm" variant="primary" disabled={updateStatus.isPending} aria-label={`Accept appointment on ${new Date(appointment.scheduledAt).toLocaleDateString()}`} onClick={() => updateStatus.mutate({ id: appointment.id, status: "Confirmed" })} style={{ borderRadius: "var(--border-radius-btn)", background: "var(--color-doctor-primary)" }}>
                  Accept Appointment
                </Button>
              ) : appointment.status === "Confirmed" ? (
                <Button size="sm" variant="secondary" disabled={updateStatus.isPending} aria-label={`Mark appointment on ${new Date(appointment.scheduledAt).toLocaleDateString()} completed`} onClick={() => updateStatus.mutate({ id: appointment.id, status: "Completed" })} style={{ borderRadius: "var(--border-radius-btn)" }}>
                  ✓ Mark Completed
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </Card>

      {/* Submitted Assessment Summaries */}
      <Card style={{ padding: "clamp(26px, 3.5vw, 32px)", borderRadius: "var(--border-radius-card)" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px", color: "var(--color-doctor-text)" }}>
          <Activity size={22} color="var(--color-doctor-primary)" /> Submitted assessment summaries
        </h2>
        {assessments.length ? (
          <div style={{ display: "grid", gap: "16px" }}>
            {assessments.map((assessment) => (
              <div key={assessment.id} style={{ padding: "18px 22px", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-sm)", background: "var(--color-surface-subtle)" }}>
                <strong style={{ fontSize: "1rem", color: "var(--color-text)" }}>{assessment.specialty} · {assessment.urgency}</strong>
                <p style={{ margin: "10px 0 0", color: "var(--color-text)" }}><b>Symptoms:</b> {assessment.symptoms}</p>
                <p className="caption" style={{ margin: "6px 0 0" }}>Duration: {assessment.duration} · Patient context: {assessment.reason}</p>
                <p className="caption" style={{ margin: "6px 0 0" }}>Automated guidance: {assessment.guidance}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="caption" style={{ margin: 0 }}>No patient-submitted assessments are available for this assigned record.</p>
        )}
      </Card>

      {/* Patient Medicines */}
      <Card style={{ padding: "clamp(26px, 3.5vw, 32px)", borderRadius: "var(--border-radius-card)" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px", color: "var(--color-doctor-text)" }}>
          <Pill size={22} color="var(--color-doctor-primary)" /> Medicines
        </h2>
        {medicines.length ? (
          <div style={{ display: "grid", gap: "16px" }}>
            {medicines.map((medicine) => (
              <div key={medicine.id} style={{ padding: "16px 20px", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-sm)", background: "var(--color-surface-subtle)" }}>
                <strong style={{ fontSize: "1rem", color: "var(--color-text)" }}>{medicine.name}</strong>
                <p className="caption" style={{ margin: "6px 0 0" }}>{medicine.dosage} · {medicine.frequency} · {medicine.schedule}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="caption" style={{ margin: 0 }}>No medicines have been recorded by this patient.</p>
        )}
      </Card>

      {/* Prescriptions for this patient */}
      <Card style={{ padding: "clamp(26px, 3.5vw, 32px)", borderRadius: "var(--border-radius-card)" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px", color: "var(--color-doctor-text)" }}>
          <FileText size={22} color="var(--color-doctor-primary)" /> Prescriptions for this patient
        </h2>
        {prescriptions && prescriptions.length ? (
          <div style={{ display: "grid", gap: "16px" }}>
            {prescriptions.map((rx) => (
              <div key={rx.id} style={{ padding: "18px 22px", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-sm)", background: "var(--color-surface-subtle)", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <strong style={{ fontSize: "1rem", color: "var(--color-text)" }}>
                      Prescription #{rx.id} · {new Date(rx.createdAt).toLocaleDateString()}
                    </strong>
                    {rx.clinicalNotes ? (
                      <p className="caption" style={{ margin: "4px 0 0" }}>Notes: {rx.clinicalNotes}</p>
                    ) : null}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <Badge status={rx.status === "SIGNED — CONTROLLED STATE" ? "success" : "warning"}>
                      {rx.status === "SIGNED — CONTROLLED STATE" ? (
                        <CheckCircle2 size={12} style={{ marginRight: "4px" }} />
                      ) : (
                        <Lock size={12} style={{ marginRight: "4px" }} />
                      )}
                      {rx.status}
                    </Badge>
                    {rx.status === "UNSIGNED / CONTROLLED WORKSPACE" ? (
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={signPrescription.isPending}
                        onClick={() => signPrescription.mutate({ id: rx.id })}
                        style={{ borderRadius: "var(--border-radius-btn)", background: "var(--color-doctor-primary)", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <FileCheck size={14} />
                        {signPrescription.isPending ? "Signing…" : "Sign & Seal Prescription"}
                      </Button>
                    ) : null}
                  </div>
                </div>

                {/* Medication items */}
                {rx.items && rx.items.length ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "8px", borderTop: "1px solid var(--color-border)" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Prescribed Medications:</span>
                    {rx.items.map((item: any) => (
                      <div key={item.id} style={{ fontSize: "0.88rem", color: "var(--color-text)" }}>
                        <Pill size={12} color="var(--color-doctor-primary)" style={{ display: "inline", marginRight: "6px" }} />
                        <strong>{item.name}</strong> — {item.dosage} ({item.instructions})
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Digital Signature Seal indicator */}
                {rx.status === "SIGNED — CONTROLLED STATE" ? (
                  <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", paddingTop: "6px", borderTop: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={13} color="var(--color-semantic-success, #16a34a)" />
                    <span>Cryptographically verified &amp; sealed in database</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="caption" style={{ margin: 0 }}>No prescriptions have been authored for this patient yet.</p>
        )}
      </Card>

      {/* Create Prescription Suite */}
      <Card style={{ padding: "clamp(26px, 3.5vw, 32px)", borderRadius: "var(--border-radius-card)" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px", color: "var(--color-doctor-text)" }}>
          <FileText size={22} color="var(--color-doctor-primary)" /> Create prescription
        </h2>
        {hasActiveOrCompleted ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSavePrescription(false); }} style={{ display: "grid", gap: "20px" }}>
            <label className="auth-field" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--color-text)" }}>Clinical notes (optional)</span>
              <textarea value={clinicalNotes} onChange={(event) => setClinicalNotes(event.target.value)} maxLength={4000} rows={3} style={{ width: "100%", resize: "vertical", padding: "12px 14px", borderRadius: "var(--border-radius-input)", border: "1px solid var(--color-border)", background: "var(--color-surface-white)", color: "var(--color-text)" }} />
            </label>
            {items.map((item, index) => {
              const errors = itemErrors[index];
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "16px 18px",
                    border: errors && (errors.name || errors.dosage || errors.instructions)
                      ? "1px solid var(--color-semantic-emergency, #ef4444)"
                      : "1px solid var(--color-border)",
                    borderRadius: "var(--border-radius-sm)",
                    background: "var(--color-surface-subtle)",
                    transition: "border-color var(--transition-fast)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-doctor-text)" }}>
                      Medication #{index + 1}
                    </span>
                    {items.length > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        aria-label={`Remove medication ${index + 1}`}
                        style={{ borderColor: "rgba(197, 48, 48, 0.3)", color: "var(--color-semantic-emergency)", height: "32px", padding: "0 10px", borderRadius: "var(--border-radius-btn)" }}
                      >
                        <Trash2 size={13} style={{ marginRight: "4px" }} /> Remove
                      </Button>
                    ) : null}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <Input
                        placeholder="Medicine name *"
                        aria-label={`Medicine name ${index + 1}`}
                        value={item.name}
                        onChange={(event) => updateItem(index, "name", event.target.value)}
                        style={errors?.name ? { borderColor: "var(--color-semantic-emergency, #ef4444)", background: "rgba(239, 68, 68, 0.04)" } : undefined}
                      />
                      {errors?.name ? (
                        <span style={{ fontSize: "0.74rem", color: "var(--color-semantic-emergency, #ef4444)", marginTop: "4px", display: "block" }}>
                          Medicine name is required
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <Input
                        placeholder="Dosage * (e.g. 500mg, 1 tablet)"
                        aria-label={`Dosage ${index + 1}`}
                        value={item.dosage}
                        onChange={(event) => updateItem(index, "dosage", event.target.value)}
                        style={errors?.dosage ? { borderColor: "var(--color-semantic-emergency, #ef4444)", background: "rgba(239, 68, 68, 0.04)" } : undefined}
                      />
                      {errors?.dosage ? (
                        <span style={{ fontSize: "0.74rem", color: "var(--color-semantic-emergency, #ef4444)", marginTop: "4px", display: "block" }}>
                          Dosage is required
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <Input
                        placeholder="Instructions * (e.g. Twice daily after meals)"
                        aria-label={`Instructions ${index + 1}`}
                        value={item.instructions}
                        onChange={(event) => updateItem(index, "instructions", event.target.value)}
                        style={errors?.instructions ? { borderColor: "var(--color-semantic-emergency, #ef4444)", background: "rgba(239, 68, 68, 0.04)" } : undefined}
                      />
                      {errors?.instructions ? (
                        <span style={{ fontSize: "0.74rem", color: "var(--color-semantic-emergency, #ef4444)", marginTop: "4px", display: "block" }}>
                          Instructions are required
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "8px" }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setItems((current) => [...current, { name: "", dosage: "", instructions: "" }])}
                style={{ borderRadius: "var(--border-radius-btn)" }}
              >
                + Add Another Medicine
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={createPrescription.isPending || isSigningImmediately}
                onClick={() => handleSavePrescription(false)}
                style={{ borderRadius: "var(--border-radius-btn)" }}
              >
                {createPrescription.isPending && !isSigningImmediately ? "Saving Draft…" : "Save Draft (Unsigned)"}
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={createPrescription.isPending || isSigningImmediately}
                onClick={() => handleSavePrescription(true)}
                style={{ borderRadius: "var(--border-radius-btn)", background: "var(--color-doctor-primary)", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <FileCheck size={16} />
                {isSigningImmediately ? "Signing & Sealing…" : "Sign & Seal Immediately"}
              </Button>
            </div>
            {feedback ? (
              <div
                role={feedback.type === "error" ? "alert" : "status"}
                aria-live="polite"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  borderRadius: "var(--border-radius-sm)",
                  fontSize: "0.88rem",
                  background:
                    feedback.type === "error"
                      ? "rgba(239, 68, 68, 0.08)"
                      : feedback.type === "success"
                      ? "rgba(34, 197, 94, 0.08)"
                      : "rgba(14, 116, 144, 0.08)",
                  border:
                    feedback.type === "error"
                      ? "1px solid rgba(239, 68, 68, 0.3)"
                      : feedback.type === "success"
                      ? "1px solid rgba(34, 197, 94, 0.3)"
                      : "1px solid rgba(14, 116, 144, 0.3)",
                  color:
                    feedback.type === "error"
                      ? "var(--color-semantic-emergency, #b91c1c)"
                      : feedback.type === "success"
                      ? "var(--color-semantic-success, #15803d)"
                      : "var(--color-doctor-primary, #0e7490)",
                }}
              >
                {feedback.type === "error" ? (
                  <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                ) : feedback.type === "success" ? (
                  <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                ) : (
                  <Info size={18} style={{ flexShrink: 0 }} />
                )}
                <span>{feedback.message}</span>
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "14px 18px",
                borderRadius: "var(--border-radius-sm)",
                background: "rgba(14, 116, 144, 0.06)",
                border: "1px solid rgba(14, 116, 144, 0.18)",
                color: "var(--color-text)",
                fontSize: "0.85rem",
                lineHeight: 1.5,
              }}
            >
              <Info size={18} color="var(--color-doctor-primary, #0e7490)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ display: "block", marginBottom: "2px", color: "var(--color-doctor-text)" }}>
                  Prescription Governance &amp; Signing Lifecycle
                </strong>
                <span>
                  Saving as <strong>Draft</strong> keeps the record in <code style={{ padding: "2px 6px", borderRadius: "4px", background: "var(--color-surface-subtle)", fontSize: "0.8rem", border: "1px solid var(--color-border)" }}>UNSIGNED / CONTROLLED WORKSPACE</code>. Choosing <strong>Sign &amp; Seal</strong> executes the explicit signing mutation to generate the immutable cryptographic SHA-256 seal.
                </span>
              </div>
            </div>
          </form>
        ) : (
          <p className="caption" style={{ margin: 0 }}>Accept the assigned appointment before creating a prescription for this patient.</p>
        )}
      </Card>
    </div>
  );
};

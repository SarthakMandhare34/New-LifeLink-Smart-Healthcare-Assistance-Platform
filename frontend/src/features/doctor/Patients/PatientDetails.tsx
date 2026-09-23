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
import { Activity, CalendarCheck, FileText, Lock, Pill, Trash2 } from "lucide-react";           // Clinical records iconography
import { trpc } from "../../../lib/trpc";                                                       // Type-safe tRPC client bridge

// Formats array of strings into comma-separated text or fallback
const listOrNotRecorded = (items: string[]) => items.length ? items.join(", ") : "Not recorded"; // Format helper
type PrescriptionItem = { name: string; dosage: string; instructions: string };                 // Prescription item data shape

// =========================================================================================
// DOCTOR CLINICAL PATIENT RECORD INSPECTOR & PRESCRIPTION WRITER
// Provides appointment-authorized deep inspection of an individual patient's medical baseline:
// - Health passport summary (Blood Group, Allergies, Chronic Conditions)
// - Historical AI triage assessment summaries
// - Active medicine cabinet regimens
// - Prescription authoring suite (creates digitally verified prescriptions)
// =========================================================================================
export const PatientView = () => {
  const { patientId } = useParams();                                                            // Retrieve patient ID from URL
  const parsedPatientId = Number(patientId);                                                    // Parse as number
  const utils = trpc.useUtils();                                                                // Client cache manager
  const [clinicalNotes, setClinicalNotes] = useState("");                                       // Clinician diagnostic notes state
  const [items, setItems] = useState<PrescriptionItem[]>([{ name: "", dosage: "", instructions: "" }]); // Medicine item list state
  const [prescriptionMessage, setPrescriptionMessage] = useState("");                           // User status feedback message

  // Query patient detail with relationship authorization check on backend
  const detail = trpc.doctorWorkspace.patientDetail.useQuery(
    { patientId: parsedPatientId },
    { enabled: Number.isInteger(parsedPatientId) && parsedPatientId > 0 }
  );

  // Mutation to persist a new digital prescription
  const createPrescription = trpc.doctorWorkspace.prescriptions.create.useMutation({
    onSuccess: async () => {
      setPrescriptionMessage("Prescription created for this assigned patient.");                // Feedback banner
      setClinicalNotes("");                                                                     // Clear notes
      setItems([{ name: "", dosage: "", instructions: "" }]);                                   // Reset medicine item inputs
      await utils.doctorWorkspace.patientDetail.invalidate({ patientId: parsedPatientId });      // Invalidate patient cache
    },
    onError: (error) => setPrescriptionMessage(error.message),                                  // Error message
  });

  // Mutation to update appointment status (e.g. Accept or Complete)
  const updateStatus = trpc.doctorWorkspace.appointments.updateStatus.useMutation({
    onSuccess: async () => {
      setPrescriptionMessage("Appointment updated successfully.");
      await Promise.all([
        utils.doctorWorkspace.patientDetail.invalidate({ patientId: parsedPatientId }),         // Refresh patient record
        utils.doctorWorkspace.appointments.list.invalidate(),                                   // Refresh appointment list
        utils.doctorWorkspace.dashboard.invalidate(),                                           // Refresh doctor dashboard counters
      ]);
    },
    onError: (error) => setPrescriptionMessage(error.message),
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

  const { patient, appointments, medicines, assessments } = detail.data;                         // Destructure authorized payload
  const hasActiveOrCompleted = appointments.some((appointment) => appointment.status === "Confirmed" || appointment.status === "Completed"); // Eligible to prescribe check

  // Prescribed items form managers
  const updateItem = (index: number, field: keyof PrescriptionItem, value: string) =>
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  const removeItem = (index: number) =>
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));

  // Submit prescription handler
  const submitPrescription = (event: React.FormEvent) => {
    event.preventDefault();                                                                     // Prevent refresh
    setPrescriptionMessage("");                                                                 // Clear past message
    createPrescription.mutate({
      patientId: parsedPatientId,                                                               // Target patient ID
      clinicalNotes: clinicalNotes.trim() || undefined,                                         // Optional clinical notes
      items: items.map((item) => ({ name: item.name.trim(), dosage: item.dosage.trim(), instructions: item.instructions.trim() })) // Item array
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px", width: "100%" }}>
      {/* Header */}
      <header>
        <h1 style={{ margin: 0 }}>Patient Record</h1>
        <p className="caption" style={{ margin: "6px 0 0" }}>{patient.name} · Appointment-authorized summary</p>
      </header>

      {/* Health Passport summary */}
      <Card style={{ padding: "clamp(26px, 3.5vw, 32px)", borderRadius: "2px" }}>
        <h2 style={{ margin: "0 0 20px" }}>Health Passport summary</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "20px" }}>
          <div style={{ padding: "16px 20px", background: "var(--color-surface-subtle)", borderRadius: "2px", border: "1px solid var(--color-border)" }}>
            <p className="caption" style={{ margin: "0 0 6px" }}>Blood group</p>
            <strong style={{ fontSize: "1.1rem" }}>{patient.bloodGroup}</strong>                                               {/* Patient blood group */}
          </div>
          <div style={{ padding: "16px 20px", background: "var(--color-surface-subtle)", borderRadius: "2px", border: "1px solid var(--color-border)" }}>
            <p className="caption" style={{ margin: "0 0 6px" }}>Allergies</p>
            <strong>{listOrNotRecorded(patient.allergies)}</strong>                             {/* Allergies */}
          </div>
          <div style={{ padding: "16px 20px", background: "var(--color-surface-subtle)", borderRadius: "2px", border: "1px solid var(--color-border)" }}>
            <p className="caption" style={{ margin: "0 0 6px" }}>Conditions</p>
            <strong>{listOrNotRecorded(patient.conditions)}</strong>                            {/* Chronic conditions */}
          </div>
        </div>
        <p className="caption" style={{ marginTop: "20px" }}>Email, phone, emergency contacts, and unrelated patient records are intentionally not exposed to this doctor workspace.</p>
      </Card>

      {/* Booking Context */}
      <Card style={{ padding: "clamp(26px, 3.5vw, 32px)", borderRadius: "2px" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px" }}>
          <CalendarCheck size={22} color="var(--color-doctor-primary)" /> Booking context
        </h2>
        <div style={{ display: "grid", gap: "16px" }}>
          {appointments.map((appointment) => (
            <div key={appointment.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", padding: "18px 22px", border: "1px solid var(--color-border)", borderRadius: "2px", background: "var(--color-surface-subtle)" }}>
              <div>
                <strong style={{ fontSize: "1rem" }}>{new Date(appointment.scheduledAt).toLocaleString()} · {appointment.status}</strong>
                <p className="caption" style={{ margin: "6px 0 0" }}>Reason: {appointment.reason || "No booking reason was recorded."}</p>
              </div>
              {appointment.status === "Requested" || appointment.status === "Pending" ? (
                <Button size="sm" variant="primary" disabled={updateStatus.isPending} aria-label={`Accept appointment on ${new Date(appointment.scheduledAt).toLocaleDateString()}`} onClick={() => updateStatus.mutate({ id: appointment.id, status: "Confirmed" })} style={{ borderRadius: "2px" }}>
                  Accept Appointment
                </Button>
              ) : appointment.status === "Confirmed" ? (
                <Button size="sm" variant="secondary" disabled={updateStatus.isPending} aria-label={`Mark appointment on ${new Date(appointment.scheduledAt).toLocaleDateString()} completed`} onClick={() => updateStatus.mutate({ id: appointment.id, status: "Completed" })} style={{ borderRadius: "2px" }}>
                  ✓ Mark Completed
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </Card>

      {/* Submitted Assessment Summaries */}
      <Card style={{ padding: "clamp(26px, 3.5vw, 32px)", borderRadius: "2px" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px" }}>
          <Activity size={22} color="var(--color-doctor-primary)" /> Submitted assessment summaries
        </h2>
        {assessments.length ? (
          <div style={{ display: "grid", gap: "16px" }}>
            {assessments.map((assessment) => (
              <div key={assessment.id} style={{ padding: "18px 22px", border: "1px solid var(--color-border)", borderRadius: "2px", background: "var(--color-surface-subtle)" }}>
                <strong style={{ fontSize: "1rem" }}>{assessment.specialty} · {assessment.urgency}</strong>
                <p style={{ margin: "10px 0 0" }}><b>Symptoms:</b> {assessment.symptoms}</p>
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
      <Card style={{ padding: "clamp(26px, 3.5vw, 32px)", borderRadius: "2px" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px" }}>
          <Pill size={22} color="var(--color-doctor-primary)" /> Medicines
        </h2>
        {medicines.length ? (
          <div style={{ display: "grid", gap: "16px" }}>
            {medicines.map((medicine) => (
              <div key={medicine.id} style={{ padding: "16px 20px", border: "1px solid var(--color-border)", borderRadius: "2px", background: "var(--color-surface-subtle)" }}>
                <strong style={{ fontSize: "1rem" }}>{medicine.name}</strong>
                <p className="caption" style={{ margin: "6px 0 0" }}>{medicine.dosage} · {medicine.frequency} · {medicine.schedule}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="caption" style={{ margin: 0 }}>No medicines have been recorded by this patient.</p>
        )}
      </Card>

      {/* Create Prescription Suite */}
      <Card style={{ padding: "clamp(26px, 3.5vw, 32px)", borderRadius: "2px" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px" }}>
          <FileText size={22} color="var(--color-doctor-primary)" /> Create prescription
        </h2>
        {hasActiveOrCompleted ? (
          <form onSubmit={submitPrescription} style={{ display: "grid", gap: "20px" }}>
            <label className="auth-field" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>Clinical notes (optional)</span>
              <textarea value={clinicalNotes} onChange={(event) => setClinicalNotes(event.target.value)} maxLength={4000} rows={3} style={{ width: "100%", resize: "vertical", padding: "12px 14px", borderRadius: "2px", border: "1px solid var(--color-border)" }} />
            </label>
            {items.map((item, index) => (
              <div key={index} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr)) auto", gap: "14px", alignItems: "center", padding: "16px 18px", border: "1px solid var(--color-border)", borderRadius: "2px", background: "var(--color-surface-subtle)" }}>
                <Input placeholder="Medicine name" aria-label={`Medicine name ${index + 1}`} value={item.name} onChange={(event) => updateItem(index, "name", event.target.value)} required />
                <Input placeholder="Dosage" aria-label={`Dosage ${index + 1}`} value={item.dosage} onChange={(event) => updateItem(index, "dosage", event.target.value)} required />
                <Input placeholder="Instructions" aria-label={`Instructions ${index + 1}`} value={item.instructions} onChange={(event) => updateItem(index, "instructions", event.target.value)} required />
                {items.length > 1 ? (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeItem(index)} aria-label={`Remove item ${index + 1}`} style={{ borderColor: "rgba(197, 48, 48, 0.3)", color: "var(--color-semantic-error)", height: "38px", padding: "0 8px", borderRadius: "2px" }}>
                    <Trash2 size={14} />
                  </Button>
                ) : null}
              </div>
            ))}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "8px" }}>
              <Button type="button" variant="secondary" onClick={() => setItems((current) => [...current, { name: "", dosage: "", instructions: "" }])} style={{ borderRadius: "2px" }}>
                Add medicine
              </Button>
              <Button type="submit" variant="primary" disabled={createPrescription.isPending} style={{ borderRadius: "2px" }}>
                {createPrescription.isPending ? "Creating…" : "Create prescription"}
              </Button>
            </div>
            {prescriptionMessage ? <p role="status" className="caption">{prescriptionMessage}</p> : null}
            <p className="caption" style={{ margin: 0 }}>This creates an unsigned clinician-workspace prescription for the assigned patient. It is not a real signed medical order.</p>
          </form>
        ) : (
          <p className="caption" style={{ margin: 0 }}>Accept the assigned appointment before creating a prescription for this patient.</p>
        )}
      </Card>
    </div>
  );
};

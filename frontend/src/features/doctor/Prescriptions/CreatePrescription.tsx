/**
 * ============================================================================
 * DIGITAL PRESCRIPTION CREATOR (frontend/src/features/doctor/Prescriptions/CreatePrescription.tsx)
 * ============================================================================
 *
 * Dedicated clinical workflow for creating, configuring, and issuing
 * tamper-evident digital prescriptions:
 * - Patient selection with appointment context auto-resolution
 * - Dynamic line-item medication dosage & instruction builder
 * - Immediate SHA-256 cryptographic signing readiness
 * ============================================================================
 */
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { trpc } from "../../../lib/trpc";
import { formatUserFriendlyError } from "../../../lib/errorFormatting";
import {
  FileText,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Pill,
  User,
  Clock,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";

interface PrescriptionItem {
  name: string;
  dosage: string;
  instructions: string;
}

export const CreatePrescription: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const utils = trpc.useUtils();

  const urlPatientId = searchParams.get("patientId");
  const urlAppointmentId = searchParams.get("appointmentId");

  const [selectedPatientId, setSelectedPatientId] = useState<number | "">(
    urlPatientId ? Number(urlPatientId) : ""
  );
  const [clinicalNotes, setClinicalNotes] = useState<string>("");
  const [items, setItems] = useState<PrescriptionItem[]>([
    { name: "", dosage: "", instructions: "" },
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Queries
  const patientsQuery = trpc.doctorWorkspace.patients.useQuery();
  const appointmentsQuery = trpc.doctorWorkspace.appointments.list.useQuery();

  const patients = patientsQuery.data ?? [];
  const appointments = appointmentsQuery.data ?? [];

  // If patientId was passed in URL, sync it
  useEffect(() => {
    if (urlPatientId && !selectedPatientId) {
      setSelectedPatientId(Number(urlPatientId));
    }
  }, [urlPatientId, selectedPatientId]);

  // Selected appointment details (if appointmentId provided)
  const matchedAppointment = urlAppointmentId
    ? appointments.find(a => String(a.id) === urlAppointmentId)
    : appointments.find(a => a.patient.id === selectedPatientId);

  // Mutation to persist prescription
  const createMutation = trpc.doctorWorkspace.prescriptions.create.useMutation({
    onSuccess: async data => {
      toast.success(`Prescription #${data.id} created successfully.`);
      await utils.doctorWorkspace.prescriptions.list.invalidate();
      if (selectedPatientId) {
        await utils.doctorWorkspace.patientDetail.invalidate({
          patientId: Number(selectedPatientId),
        });
      }
      navigate("/doctor/prescriptions", { replace: true });
    },
    onError: error => {
      toast.error(
        `Failed to issue prescription: ${formatUserFriendlyError(
          error,
          "Please verify that an appointment exists for this patient."
        )}`
      );
    },
  });

  const handleAddItem = () => {
    if (items.length >= 20) {
      toast.error("Maximum 20 medication items per prescription.");
      return;
    }
    setItems([...items, { name: "", dosage: "", instructions: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      toast.error("A prescription must have at least one medication item.");
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof PrescriptionItem,
    value: string
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedPatientId) {
      newErrors.patient = "Please select an assigned patient.";
    }

    items.forEach((item, idx) => {
      if (!item.name.trim()) {
        newErrors[`name_${idx}`] = "Medication name required.";
      }
      if (!item.dosage.trim()) {
        newErrors[`dosage_${idx}`] = "Dosage required.";
      }
      if (!item.instructions.trim()) {
        newErrors[`instructions_${idx}`] = "Usage instructions required.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required medication fields.");
      return;
    }

    createMutation.mutate({
      patientId: Number(selectedPatientId),
      clinicalNotes: clinicalNotes.trim() || undefined,
      items: items.map(it => ({
        name: it.name.trim(),
        dosage: it.dosage.trim(),
        instructions: it.instructions.trim(),
      })),
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        width: "100%",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      {/* Top Breadcrumb & Action Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/doctor/prescriptions")}
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
          <span>Back to Prescriptions</span>
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.78rem",
            color: "var(--color-text-muted)",
          }}
        >
          <ShieldCheck size={16} color="var(--color-doctor-primary)" />
          <span>Cryptographically Sealed on Signing</span>
        </div>
      </div>

      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--color-doctor-text)",
          }}
        >
          Create Digital Prescription
        </h1>
        <p
          className="caption"
          style={{ margin: "4px 0 0", color: "var(--color-text-muted)" }}
        >
          Issue official electronic prescription orders. Drafts are created in
          a controlled workspace prior to cryptographic signing.
        </p>
      </div>

      {/* Main Prescription Authoring Form */}
      <form onSubmit={handleSubmit}>
        <Card
          variant="solid"
          style={{
            padding: "clamp(24px, 4vw, 36px)",
            borderRadius: "var(--border-radius-card)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-white)",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          {/* Section 1: Patient Selection */}
          <div>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "var(--color-doctor-text)",
                margin: "0 0 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <User size={18} color="var(--color-doctor-primary)" />
              <span>1. Target Patient</span>
            </h2>

            <div style={{ maxWidth: "480px" }}>
              <label
                htmlFor="select-patient"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                  marginBottom: "6px",
                }}
              >
                Assigned Patient Roster *
              </label>
              <select
                id="select-patient"
                value={selectedPatientId}
                onChange={e => {
                  setSelectedPatientId(
                    e.target.value ? Number(e.target.value) : ""
                  );
                  if (errors.patient) {
                    setErrors({ ...errors, patient: "" });
                  }
                }}
                disabled={Boolean(urlPatientId)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--border-radius-btn)",
                  border: errors.patient
                    ? "1px solid var(--lifelink-red)"
                    : "1px solid var(--color-border)",
                  background: "var(--color-surface-ground)",
                  color: "var(--color-text)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              >
                <option value="">— Choose patient with assigned visit —</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (#{p.id})
                  </option>
                ))}
              </select>
              {errors.patient && (
                <p
                  style={{
                    color: "var(--lifelink-red)",
                    fontSize: "0.75rem",
                    margin: "4px 0 0",
                  }}
                >
                  {errors.patient}
                </p>
              )}
            </div>

            {matchedAppointment && (
              <div
                style={{
                  marginTop: "14px",
                  padding: "12px 16px",
                  borderRadius: "var(--border-radius-badge)",
                  background: "var(--color-accent-muted)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "0.85rem",
                }}
              >
                <Clock size={16} color="var(--color-doctor-primary)" />
                <span>
                  <strong>Linked Appointment:</strong> #{matchedAppointment.id}{" "}
                  — {new Date(matchedAppointment.scheduledAt).toLocaleString()}{" "}
                  ({matchedAppointment.status})
                </span>
              </div>
            )}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: 0 }} />

          {/* Section 2: Clinical Encounter Notes */}
          <div>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "var(--color-doctor-text)",
                margin: "0 0 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FileText size={18} color="var(--color-doctor-primary)" />
              <span>2. Clinical Notes & Diagnostic Summary</span>
            </h2>

            <div>
              <label
                htmlFor="clinical-notes"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                  marginBottom: "6px",
                }}
              >
                Physician Diagnosis & Regimen Notes (Optional)
              </label>
              <textarea
                id="clinical-notes"
                rows={3}
                value={clinicalNotes}
                onChange={e => setClinicalNotes(e.target.value)}
                placeholder="e.g., Primary hypertension follow-up. Patient advised to reduce sodium intake and maintain blood pressure log."
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "var(--border-radius-btn)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface-ground)",
                  color: "var(--color-text)",
                  fontSize: "0.9rem",
                  outline: "none",
                  resize: "vertical",
                  lineHeight: 1.5,
                }}
              />
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: 0 }} />

          {/* Section 3: Medication Items */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--color-doctor-text)",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Pill size={18} color="var(--color-doctor-primary)" />
                <span>3. Prescribed Medications ({items.length})</span>
              </h2>

              <Button
                type="button"
                variant="outline"
                onClick={handleAddItem}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.82rem",
                  padding: "6px 12px",
                }}
              >
                <Plus size={16} />
                <span>Add Medication</span>
              </Button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "16px",
                    borderRadius: "var(--border-radius-btn)",
                    background: "var(--color-surface-ground)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "var(--color-doctor-primary)",
                      }}
                    >
                      Item #{idx + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--lifelink-red)",
                          cursor: "pointer",
                          padding: "2px 6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.78rem",
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--color-text)",
                          marginBottom: "4px",
                        }}
                      >
                        Medication Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Amlodipine"
                        value={item.name}
                        onChange={e =>
                          handleItemChange(idx, "name", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "var(--border-radius-btn)",
                          border: errors[`name_${idx}`]
                            ? "1px solid var(--lifelink-red)"
                            : "1px solid var(--color-border)",
                          background: "var(--color-surface-white)",
                          color: "var(--color-text)",
                          fontSize: "0.88rem",
                          outline: "none",
                        }}
                      />
                      {errors[`name_${idx}`] && (
                        <p
                          style={{
                            color: "var(--lifelink-red)",
                            fontSize: "0.72rem",
                            margin: "2px 0 0",
                          }}
                        >
                          {errors[`name_${idx}`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--color-text)",
                          marginBottom: "4px",
                        }}
                      >
                        Dosage & Strength *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 5 mg orally once daily"
                        value={item.dosage}
                        onChange={e =>
                          handleItemChange(idx, "dosage", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "var(--border-radius-btn)",
                          border: errors[`dosage_${idx}`]
                            ? "1px solid var(--lifelink-red)"
                            : "1px solid var(--color-border)",
                          background: "var(--color-surface-white)",
                          color: "var(--color-text)",
                          fontSize: "0.88rem",
                          outline: "none",
                        }}
                      />
                      {errors[`dosage_${idx}`] && (
                        <p
                          style={{
                            color: "var(--lifelink-red)",
                            fontSize: "0.72rem",
                            margin: "2px 0 0",
                          }}
                        >
                          {errors[`dosage_${idx}`]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "var(--color-text)",
                        marginBottom: "4px",
                      }}
                    >
                      Instructions & Duration *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Take in the morning with water for 30 days. Do not skip doses."
                      value={item.instructions}
                      onChange={e =>
                        handleItemChange(idx, "instructions", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "var(--border-radius-btn)",
                        border: errors[`instructions_${idx}`]
                          ? "1px solid var(--lifelink-red)"
                          : "1px solid var(--color-border)",
                        background: "var(--color-surface-white)",
                        color: "var(--color-text)",
                        fontSize: "0.88rem",
                        outline: "none",
                      }}
                    />
                    {errors[`instructions_${idx}`] && (
                      <p
                        style={{
                          color: "var(--lifelink-red)",
                          fontSize: "0.72rem",
                          margin: "2px 0 0",
                        }}
                      >
                        {errors[`instructions_${idx}`]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "12px",
              paddingTop: "16px",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/doctor/prescriptions")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createMutation.isPending}
              style={{
                background: "var(--color-doctor-primary)",
                color: "#FFFFFF",
                padding: "10px 24px",
                fontWeight: 600,
              }}
            >
              {createMutation.isPending
                ? "Creating Prescription Draft…"
                : "Save & Issue Prescription Draft"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

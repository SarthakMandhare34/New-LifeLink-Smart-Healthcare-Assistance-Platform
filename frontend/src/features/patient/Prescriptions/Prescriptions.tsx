/**
 * ============================================================================
 * SHA-256 DIGITAL PRESCRIPTIONS UI
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This handles the rendering of official medical prescriptions.
 * To stop prescription fraud (hackers changing 1 pill to 10 pills), it displays 
 * a cryptographic SHA-256 hash. If even one letter of the medicine changes, the hash breaks.
 */
import React, { useState } from 'react';                                                  // Core React engine & component state tracking
import { Card } from '../../../components/ui/Card';                                            // Reusable glassmorphic UI container
import { Button } from '../../../components/ui/Button';                                        // Styled user interaction action button
import { Badge } from '../../../components/ui/Badge';                                          // Visual indicator chip for status badges
import { FileText, Lock, ArrowLeft, Pill, Clock, UserCheck, Stethoscope } from 'lucide-react';  // Medical and navigation iconography
import { trpc } from '../../../lib/trpc';                                                       // Type-safe client RPC gateway

// =========================================================================================
// PATIENT PRESCRIPTION VAULT COMPONENT
// Displays official digital medical prescriptions issued to the logged-in patient by licensed specialists.
// Features dual view: summary list cards and detailed itemized clinical verification views.
// =========================================================================================
export const Prescriptions = () => {
  // Query server for full list of prescriptions assigned to the current patient session
  const prescriptionsQuery = trpc.patientPrescription.list.useQuery();                          // Fetches all authorized prescriptions for current patient
  const profileQuery = trpc.patientProfile.get.useQuery();                                      // Fetches current patient profile
  const [selectedRxId, setSelectedRxId] = useState<number | null>(null);                        // Tracks ID of prescription actively being viewed in modal/detail mode

  // Detail query for selected prescription (verifies server-side ownership and cryptographic tamper seals)
  const detailQuery = trpc.patientPrescription.getById.useQuery(
    { id: selectedRxId! },                                                                      // Target prescription identifier
    { enabled: selectedRxId !== null && selectedRxId > 0 }                                      // Query only fires when a positive numeric ID is selected
  );

  // Render friendly loading state during initial network synchronization
  if (prescriptionsQuery.isLoading) {                                                           // Check if initial prescriptions list is fetching
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <p className="caption" style={{ color: 'var(--color-text-muted)' }}>Loading prescriptions…</p>         {/* Visual loading feedback */}
      </div>
    );
  }

  const prescriptions = prescriptionsQuery.data ?? [];                                          // Default to empty array if query response is null

  // =========================================================================================
  // DETAIL VIEW: ITEM-BY-ITEM CLINICAL PRESCRIPTION BREAKDOWN
  // =========================================================================================
  if (selectedRxId !== null) {                                                                  // Patient has clicked a specific prescription
    const rx = detailQuery.data;                                                                // Loaded prescription details
    const prescribingDoctor = rx?.doctor ?? null;                                               // Specialist who authorized and signed the prescription

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Navigation header with back button */}
        <header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedRxId(null)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} /> Back to Prescriptions
          </Button>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            Prescription Details
          </h1>
        </header>

        {/* Loading detail state indicator */}
        {detailQuery.isLoading ? (
          <div className="flex items-center justify-center" style={{ minHeight: '30vh' }}>
            <p className="caption" style={{ color: 'var(--color-text-muted)' }}>Verifying prescription record…</p> {/* Integrity verification placeholder */}
          </div>
        ) : detailQuery.isError || !rx ? (
          /* Error or unauthorized state */
          <Card style={{ padding: '32px', textAlign: 'center', background: 'var(--color-surface-white)', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
            <p role="alert" style={{ color: 'var(--color-semantic-emergency)', margin: 0, fontWeight: 600 }}>
              Prescription record not found or access is not authorized.
            </p>
          </Card>
        ) : (
          /* Detailed clinical prescription card - Swiss Document Style */
          <Card
            variant="document"
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              width: '100%',
              background: 'var(--color-surface-white)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius-md)',
              padding: 'clamp(20px, 4vw, 32px)',
              boxShadow: 'none',
            }}
          >
            {/* Document Header Plate: Patient, Doctor, Date, Integrity Reference */}
            <div style={{ borderBottom: '2px solid var(--color-border)', paddingBottom: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                    Official Medical Prescription
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <Stethoscope size={18} color="var(--color-accent)" />
                    <h2 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                      {prescribingDoctor?.name || 'Controlled Directory Specialist'}
                    </h2>
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    {prescribingDoctor?.specialty || 'Specialist'} • {prescribingDoctor?.hospital || 'Controlled Clinical Workspace'}
                  </p>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <Badge status="neutral">
                    <Lock size={12} style={{ marginRight: '4px' }} /> {rx.status}
                  </Badge>
                  <span className="caption" style={{ color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                    Issue Date: {new Date(rx.issuedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Structured Metadata Box: Patient, Date, Reference */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', 
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'var(--color-surface-interactive)',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div>
                  <span className="caption" style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Patient</span>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>{profileQuery.data?.name || 'Verified Patient'}</div>
                </div>
                <div>
                  <span className="caption" style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Prescribing Specialist</span>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text)' }}>{prescribingDoctor?.name || 'Specialist'}</div>
                </div>
                <div>
                  <span className="caption" style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Prescription ID</span>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', fontVariantNumeric: 'tabular-nums', color: 'var(--color-text)' }}>#{rx.id}</div>
                </div>
              </div>

              {/* SHA-256 Integrity Hash Reference */}
              {rx.integrityReference && (
                <div style={{ marginTop: '12px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    SHA-256 Cryptographic Integrity Reference
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: 'var(--color-text)',
                      background: 'var(--color-surface-white)',
                      padding: '6px 10px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: '1px solid var(--color-border)',
                      wordBreak: 'break-all',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {rx.integrityReference}
                  </p>
                </div>
              )}
            </div>

            {/* Prescribed Items (Rx) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
                  Rx
                </span>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Prescribed Regimen
                </h3>
              </div>

              {/* Medication roster */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rx.items && rx.items.length > 0 ? (
                  rx.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '16px',
                        background: 'var(--color-surface-interactive)',
                        borderRadius: 'var(--border-radius-sm)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Pill size={16} color="var(--color-primary)" />
                          <strong style={{ fontSize: '1.05rem', color: 'var(--color-text)', fontWeight: 700 }}>
                            {item.name}
                          </strong>
                        </div>
                        <span
                          style={{
                            padding: '2px 8px',
                            background: 'var(--color-surface-white)',
                            borderRadius: 'var(--border-radius-badge)',
                            border: '1px solid var(--color-border)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: 'var(--color-primary)',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {item.dosage}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Instructions:</strong> {item.instructions}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', margin: 0 }}>No prescription items recorded.</p>
                )}
              </div>

              {/* Clinical Notes & Observations */}
              {rx.clinicalNotes && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '16px',
                    background: 'var(--color-primary-muted)',
                    borderRadius: '8px',
                    border: '1px dashed var(--color-primary)',
                  }}
                >
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Clinical Notes & Observations
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--color-text)', fontStyle: 'italic', lineHeight: 1.5 }}>
                    &ldquo;{rx.clinicalNotes}&rdquo;                                            {/* Clinician diagnostic remarks */}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // =========================================================================================
  // LIST VIEW: ALL PRESCRIBED RECORDS
  // =========================================================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header banner */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: 'var(--border-radius-sm)', background: 'var(--color-primary-muted)', display: 'grid', placeItems: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
          <FileText size={24} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            Prescriptions
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '3px 0 0' }}>
            Verified medical prescriptions issued by your assigned LifeLink specialists.
          </p>
        </div>
      </header>

      {/* Empty state when patient has no prescriptions */}
      {prescriptions.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '56px 24px', background: 'var(--color-surface-white)', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
          <FileText size={44} color="var(--color-text-muted)" style={{ margin: '0 auto 12px', opacity: 0.7 }} />
          <p style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
            No prescriptions issued yet.
          </p>
        </Card>
      ) : (
        /* Prescriptions responsive card grid */
        <div className="responsive-list-grid">
          {prescriptions.map((prescription) => (
            <Card
              key={prescription.id}
              variant="default"
              className="h-full flex-col justify-between"
              onClick={() => setSelectedRxId(prescription.id)}
              style={{
                background: 'var(--color-surface-white)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius-md)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'none',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: 'var(--border-radius-sm)', background: 'var(--color-primary-muted)', display: 'grid', placeItems: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                        {prescription.doctor?.name || 'Assigned Specialist'}
                      </h3>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                        {new Date(prescription.issuedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <Badge status="neutral">
                    <Lock size={10} style={{ marginRight: '3px' }} /> {prescription.status}
                  </Badge>
                </div>

                <div
                  style={{
                    padding: '12px',
                    background: 'var(--color-background)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    marginTop: '8px',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Prescribed Items:
                  </span>
                  <p style={{ margin: '4px 0 0', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                    {prescription.items && prescription.items.length
                      ? prescription.items.map((item) => `${item.name} (${item.dosage})`).join(', ') // Joined list of drug names
                      : 'No items recorded'}
                  </p>
                </div>
              </div>

              {/* View details action trigger */}
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="primary"                                                             // Primary button style
                  size="sm"                                                                    // Compact size
                  onClick={(event) => {
                    event.stopPropagation();                                                    // Avoid bubbling to parent card
                    setSelectedRxId(prescription.id);                                           // Select this prescription for detail inspection
                  }}
                  style={{ borderRadius: '8px' }}
                  aria-label={`View details for prescription from ${prescription.doctor?.name || 'specialist'} on ${new Date(prescription.issuedAt).toLocaleDateString()}`}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

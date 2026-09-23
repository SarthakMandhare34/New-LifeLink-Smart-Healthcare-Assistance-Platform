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
import { useNavigate } from "react-router-dom";                                                 // Router navigation hook
import { Activity, Lock, ArrowRight, Loader2 } from "lucide-react";                             // Clinical assessment and security icons
import { Card } from "../../../components/ui/Card";                                             // Visual card container
import { Button } from "../../../components/ui/Button";                                         // Styled action button
import { Badge } from "../../../components/ui/Badge";                                           // Status badge component
import { trpc } from "../../../lib/trpc";                                                       // Type-safe tRPC client bridge

// =========================================================================================
// DOCTOR ASSESSMENTS WORKBENCH
// Displays AI-generated triage assessment history for patients authorized via active appointments.
// Allows doctors to review AI symptom findings, urgency determinations, and differential context.
// =========================================================================================
export const Assessments = () => {
  const navigate = useNavigate();                                                               // Page navigation controller
  const patients = trpc.doctorWorkspace.patients.useQuery();                                    // Queries list of authorized patients for doctor

  // Loading skeleton placeholder
  if (patients.isLoading) return (
    <div className="dashboard-loading">
      <p className="caption">Loading assigned patient assessments…</p>
    </div>
  );

  return (
    <div className="dashboard-workspace" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Assessments workspace header banner */}
      <header className="flex items-center gap-3" style={{ marginBottom: 0 }}>
        <div style={{ width: 48, height: 48, borderRadius: '2px', background: 'var(--swiss-blue-soft)', border: '1px solid var(--swiss-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Activity size={24} style={{ color: 'var(--swiss-blue)' }} />
        </div>
        <div>
          <h1 style={{ margin: 0 }}>Patient Assessments</h1>
          <p className="caption" style={{ margin: '4px 0 0' }}>Review AI assessment context for your assigned patients</p>
        </div>
      </header>

      {/* Error state */}
      {patients.isError ? (
        <Card style={{ padding: 'var(--spacing-8)', textAlign: 'center', borderRadius: '2px' }}>
          <p role="alert" style={{ color: 'var(--swiss-red)' }}>Unable to verify assigned patient access. Please try again.</p>
        </Card>
      ) : !patients.data?.length ? (
        /* Empty assessments state */
        <Card style={{ padding: 'var(--spacing-10) var(--spacing-6)', textAlign: 'center', borderRadius: '2px' }}>
          <Activity size={44} style={{ color: 'var(--color-text-muted)', opacity: 0.5, margin: '0 auto var(--spacing-3)' }} />
          <h2 style={{ margin: '0 0 var(--spacing-2)', fontSize: '1.2rem', color: 'var(--color-text)' }}>No assigned patient assessments</h2>
          <p className="caption" style={{ margin: '0 auto', maxWidth: '440px' }}>Assessment context appears when an assigned patient has submitted an AI health assessment.</p>
          <Button variant="primary" style={{ marginTop: 'var(--spacing-4)', borderRadius: '2px', background: 'var(--swiss-blue)' }} onClick={() => navigate('/doctor/patients')}>
            View Patient Roster <ArrowRight size={16} />
          </Button>
        </Card>
      ) : (
        /* Responsive list grid displaying each authorized patient's assessment card */
        <section className="responsive-list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {patients.data.map((patient) => (
            <Card key={patient.id} style={{ padding: '24px 28px', borderRadius: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Patient monogram */}
                  <div style={{ width: 44, height: 44, borderRadius: '2px', background: 'var(--swiss-blue-soft)', border: '1px solid var(--swiss-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--swiss-blue)', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.02rem', color: 'var(--color-text)' }}>{patient.name}</strong>
                    <div className="flex items-center gap-1" style={{ marginTop: '3px' }}>
                      <Lock size={12} style={{ color: 'var(--color-text-muted)' }} />
                      <span className="caption" style={{ fontSize: '0.78rem' }}>Appointment-authorized</span>
                    </div>
                  </div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--swiss-blue-soft)', color: 'var(--swiss-blue)', border: '1px solid var(--swiss-blue)', borderRadius: '2px', padding: '3px 8px', fontSize: '0.75rem', fontWeight: 700 }}>Active</span>
              </div>
              {/* Action button to open full patient assessment context */}
              <Button variant="secondary" className="w-full" style={{ marginTop: '8px', borderRadius: '2px' }}
                onClick={() => navigate(`/doctor/patients/${patient.id}`)}>
                Review Assessment Context <ArrowRight size={14} />
              </Button>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
};

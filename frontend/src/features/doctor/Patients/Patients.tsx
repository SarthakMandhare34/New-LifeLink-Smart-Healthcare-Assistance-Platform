/**
 * ============================================================================
 * DOCTOR AUTHORIZED PATIENT ROSTER (frontend/src/features/doctor/Patients/Patients.tsx)
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This component displays the active clinical panel of patients assigned to the doctor.
 * In compliance with digital health privacy standards, it restricts directory visibility
 * strictly to patients with booked or completed appointments with this specialist station,
 * preventing unauthorized browsing of unrelated patient records across Mumbai.
 */
import { useNavigate } from "react-router-dom";                                                 // React router hook for navigation transitions
import { Users, ArrowRight, UserCheck, Loader2 } from "lucide-react";                           // Roster, action, and loading icons
import { Card } from "../../../components/ui/Card";                                             // Visual card container component
import { Button } from "../../../components/ui/Button";                                         // Standard action button
import { Badge } from "../../../components/ui/Badge";                                           // Small pill badge component
import { trpc } from "../../../lib/trpc";                                                       // Type-safe tRPC client bridge

// =========================================================================================
// DOCTOR PATIENT ROSTER COMPONENT
// Lists all patients who have authorized clinical access with this doctor via confirmed or
// pending appointment bookings. In strict adherence to healthcare privacy (HIPAA/DPDP),
// doctors can only inspect health records of patients with an active clinical relationship.
// =========================================================================================
export const Patients = () => {
  const navigate = useNavigate();                                                               // Page navigation controller
  const patients = trpc.doctorWorkspace.patients.useQuery();                                    // Fetches list of authorized patients for doctor

  // Loading state placeholder with animated spinner
  if (patients.isLoading) return (
    <div className="dashboard-loading">
      <Loader2 size={24} className="workspace-choice-spinner" style={{ animation: 'spin 1s linear infinite' }} />
      <p className="caption">Loading authorized patients…</p>
    </div>
  );

  // Error boundary state
  if (patients.isError) return <p role="alert">Unable to load authorized patients. Please try again.</p>;

  return (
    <div className="dashboard-workspace" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Roster header banner */}
      <header className="flex items-center gap-3" style={{ marginBottom: 0 }}>
        <div style={{ width: 48, height: 48, borderRadius: '2px', background: 'var(--swiss-blue-soft)', border: '1px solid var(--swiss-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Users size={24} style={{ color: 'var(--swiss-blue)' }} />
        </div>
        <div>
          <h1 style={{ margin: 0 }}>Patient Roster</h1>
          <p className="caption" style={{ margin: '4px 0 0' }}>Patients authorized via assigned appointments</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Badge style={{ background: 'var(--swiss-blue-soft)', color: 'var(--swiss-blue)', border: '1px solid var(--swiss-blue)', borderRadius: '2px', padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700 }}>
            {patients.data?.length ?? 0} Patients
          </Badge>
        </div>
      </header>

      {/* Empty roster state */}
      {!patients.data?.length ? (
        <Card style={{ padding: 'var(--spacing-10) var(--spacing-6)', textAlign: 'center', borderRadius: '2px' }}>
          <UserCheck size={44} style={{ color: 'var(--color-text-muted)', opacity: 0.5, margin: '0 auto var(--spacing-3)' }} />
          <h2 style={{ margin: '0 0 var(--spacing-2)', fontSize: '1.2rem', color: 'var(--color-text)' }}>No authorized patients yet</h2>
          <p className="caption" style={{ margin: '0 auto', maxWidth: '440px' }}>Patients appear here once an appointment is assigned and confirmed to your account.</p>
          <Button variant="primary" style={{ marginTop: 'var(--spacing-4)', borderRadius: '2px', background: 'var(--swiss-blue)' }} onClick={() => navigate('/doctor/appointments')}>
            Review Appointments <ArrowRight size={16} />
          </Button>
        </Card>
      ) : (
        /* Patient cards grid */
        <section className="responsive-list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {patients.data.map((patient) => (
            <Card key={patient.id} style={{ padding: '24px 28px', cursor: 'pointer', borderRadius: '2px' }}
              onClick={() => navigate(`/doctor/patients/${patient.id}`)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Patient initial square avatar */}
                  <div style={{ width: 44, height: 44, borderRadius: '2px', background: 'var(--swiss-blue-soft)', border: '1px solid var(--swiss-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--swiss-blue)', fontSize: '1.1rem', fontWeight: 700, flexShrink: 0 }}>
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.02rem', display: 'block', color: 'var(--color-text)' }}>{patient.name}</strong>
                    <p className="caption" style={{ margin: '3px 0 0', fontSize: '0.78rem' }}>Appointment-authorized access</p>
                  </div>
                </div>
                {/* Direct action button */}
                <Button variant="secondary" size="sm" style={{ flexShrink: 0, borderRadius: '2px' }}
                  onClick={(e) => { e.stopPropagation(); navigate(`/doctor/patients/${patient.id}`); }}>
                  View record <ArrowRight size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
};

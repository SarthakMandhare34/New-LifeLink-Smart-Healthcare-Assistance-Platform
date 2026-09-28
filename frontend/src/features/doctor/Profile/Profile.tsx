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
import { Card } from "../../../components/ui/Card";                                             // Visual glass card container
import { ShieldCheck, Stethoscope, MapPin, Building, Mail, User } from "lucide-react";           // Medical specialist profile iconography
import { trpc } from "../../../lib/trpc";                                                       // Type-safe tRPC client bridge

// =========================================================================================
// CLINICIAN PROFILE VIEW
// Displays professional credentials and clinic localization details for the authenticated doctor:
// - Display name and medical specialty
// - Clinic hospital affiliation, locality, and Mumbai rail line transit connectivity
// - Controlled directory status and verified workstation assurance badge
// =========================================================================================
export const DoctorProfile = () => {
  const profile = trpc.doctorWorkspace.profile.useQuery();                                      // Retrieves clinician profile from backend

  // Loading skeleton state
  if (profile.isLoading) return <div className="dashboard-loading"><p className="caption">Loading doctor profile…</p></div>;
  // Error boundary state
  if (profile.isError || !profile.data) return <p role="alert">Unable to load the doctor profile. Please try again.</p>;

  const data = profile.data;                                                                    // Loaded clinician profile data

  return (
    <div className="dashboard-workspace" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Profile header banner */}
      <header className="flex items-center gap-3" style={{ marginBottom: 0 }}>
        <div style={{ width: 52, height: 52, borderRadius: 'var(--border-radius-sm)', background: 'var(--color-accent-muted)', border: '1px solid var(--color-doctor-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stethoscope size={26} color="var(--color-doctor-primary)" />                                                {/* Clinician stethoscope icon */}
        </div>
        <div>
          <h1 style={{ margin: 0, color: 'var(--color-doctor-text)' }}>Doctor Profile</h1>                                         {/* Header title */}
          <p className="caption" style={{ margin: '4px 0 0' }}>Your controlled LifeLink directory account</p>
        </div>
      </header>

      {/* Bento grid layout */}
      <section className="bento-grid" style={{ gap: '24px' }}>
        {/* Identity & Credentials Card */}
        <Card variant="default" className="bento-col-8" style={{ padding: 'clamp(28px, 3.5vw, 36px)', borderRadius: 'var(--border-radius-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
            {/* Clinician initial monogram avatar */}
            <div style={{
              width: '72px', height: '72px', borderRadius: 'var(--border-radius-card)',
              background: 'var(--color-accent-muted)', border: '1px solid var(--color-doctor-primary)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'var(--color-doctor-primary)', fontSize: '2rem', fontWeight: 700,
              flexShrink: 0
            }}>
              {data.displayName.charAt(0).toUpperCase()}                                        {/* Avatar initial */}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--color-doctor-text)' }}>{data.displayName}</h2>             {/* Full clinical name */}
              <p className="caption" style={{ margin: '6px 0 0' }}>{data.specialty}</p>        {/* Specialty title */}
            </div>
          </div>

          {/* Clinical metadata badge grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px' }}>
            {/* Specialty tag */}
            <div style={{ padding: '18px 20px', background: 'var(--color-surface-subtle)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                <Stethoscope size={16} color="var(--color-doctor-primary)" />
                <span className="caption" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Specialty</span>
              </div>
              <strong style={{ fontSize: '1.05rem', color: 'var(--color-text)' }}>{data.specialty || 'Not set'}</strong>
            </div>
            {/* Locality tag */}
            <div style={{ padding: '18px 20px', background: 'var(--color-surface-subtle)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                <MapPin size={16} color="var(--color-doctor-primary)" />
                <span className="caption" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Locality</span>
              </div>
              <strong style={{ fontSize: '1.05rem', color: 'var(--color-text)' }}>{data.locality || 'Mumbai'}</strong>
            </div>
            {/* Healthcare zone tag */}
            <div style={{ padding: '18px 20px', background: 'var(--color-surface-subtle)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                <Building size={16} color="var(--color-doctor-primary)" />
                <span className="caption" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Healthcare Zone</span>
              </div>
              <strong style={{ fontSize: '1.05rem', color: 'var(--color-text)' }}>{data.railLine ? `${data.railLine} Zone` : 'Mumbai MMR'}</strong>
            </div>
          </div>
        </Card>

        {/* Directory Verification Notice Card */}
        <Card variant="default" className="bento-col-4" style={{ padding: 'clamp(28px, 3.5vw, 36px)', borderRadius: 'var(--border-radius-card)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px' }}>
          <div>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--border-radius-sm)', background: 'var(--color-accent-muted)', border: '1px solid var(--color-doctor-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <ShieldCheck size={22} color="var(--color-doctor-primary)" />
            </div>
            <h3 style={{ margin: '0 0 12px', color: 'var(--color-doctor-text)' }}>Directory status</h3>
            <p className="caption" style={{ lineHeight: 1.6 }}>
              This is a controlled LifeLink directory account. Specialist records are not verified clinician credentials or medical registrations.
            </p>
          </div>
          <div style={{ padding: '16px 18px', borderRadius: 'var(--border-radius-sm)', background: 'var(--color-accent-muted)', border: '1px solid var(--color-doctor-primary)', marginTop: '20px' }}>
            <p style={{ margin: 0, color: 'var(--color-doctor-primary)', fontWeight: 600, fontSize: '14px' }}>
              Account type: Controlled directory specialist
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
};

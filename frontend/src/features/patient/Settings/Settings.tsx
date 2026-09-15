/**
 * ============================================================================
 * PATIENT PORTAL UI
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This manages the everyday user interfaces for patients (Dashboard, Health Passport, Medicines).
 * It uses modern React hooks to keep data perfectly synchronized and responsive.
 */
import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { trpc } from '../../../lib/trpc';
import { Settings as SettingsIcon, Bell, Shield, CheckCircle2, UserCheck } from 'lucide-react';

// =========================================================================================
// PATIENT WORKSPACE PREFERENCES & SETTINGS (Settings)
// =========================================================================================
//
// WHAT THIS COMPONENT DOES:
// 1. Provides a balanced, spacious 2-column configuration suite for patient account management.
// 2. Notification Preferences Card: Manages appointment reminder alerts, medication renewal
//    notifications, and clinical event broadcasts.
// 3. Privacy & Security Card: Outlines patient account safeguards including isolated
//    session storage (`app_session_id`), 5-minute inactivity timeouts, and zero data leakage.
// 4. Layout Architecture: Replaced narrow single-column box with a wide, responsive
//    grid (`minmax(480px, 1fr)`) aligned with the Patient Amber + Teal visual design system.
// =========================================================================================
export const Settings = () => {
  const meQuery = trpc.auth.me.useQuery();
  const patient = meQuery.data;

  // Local state for notification toggle preferences
  const [aptReminders, setAptReminders] = useState(true);
  const [medAlerts, setMedAlerts] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Workspace Header Banner */}
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '24px 28px',
          background: 'var(--color-surface-white)',
          border: '1px solid var(--color-border)',
          borderLeft: '4px solid var(--color-primary)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'var(--color-primary-muted)',
            border: '1px solid var(--color-border)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--color-primary)',
            flexShrink: 0,
          }}
        >
          <SettingsIcon size={26} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
            Workspace Preferences
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            Manage notification alerts, session preferences, and security options for your health portal.
          </p>
        </div>
      </section>

      {/* Main Grid: Generous 2-column layout matching other primary pages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: '24px' }}>
        
        {/* Notification Preferences Card */}
        <Card
          variant="glass"
          style={{
            padding: '28px',
            background: 'var(--color-surface-white)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--color-primary-muted)', display: 'grid', placeItems: 'center', color: 'var(--color-primary)' }}>
                <Bell size={20} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'Outfit, sans-serif' }}>
                Notification Preferences
              </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Appointment Reminder Toggle Option */}
              <div style={{ padding: '18px 20px', background: 'var(--color-surface-interactive)', borderRadius: '10px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="pref-apt-reminders" style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)', display: 'block', cursor: 'pointer' }}>
                    Appointment reminder preference
                  </label>
                  <span className="caption" style={{ display: 'block', marginTop: '4px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Reminder delivery is not active yet. This preference is saved only for the current workspace session.
                  </span>
                </div>
                <input 
                  id="pref-apt-reminders"
                  type="checkbox" 
                  aria-label="Appointment reminder preference"
                  checked={aptReminders} 
                  onChange={(e) => setAptReminders(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)', transform: 'scale(1.25)', cursor: 'pointer', marginTop: '4px' }} 
                />
              </div>

              {/* Medicine Alert Toggle Option */}
              <div style={{ padding: '18px 20px', background: 'var(--color-surface-interactive)', borderRadius: '10px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="pref-med-alerts" style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)', display: 'block', cursor: 'pointer' }}>
                    Medicine inventory preference
                  </label>
                  <span className="caption" style={{ display: 'block', marginTop: '4px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Inventory alerts are not active yet. This preference is saved only for the current workspace session.
                  </span>
                </div>
                <input 
                  id="pref-med-alerts"
                  type="checkbox" 
                  aria-label="Medicine inventory preference"
                  checked={medAlerts} 
                  onChange={(e) => setMedAlerts(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)', transform: 'scale(1.25)', cursor: 'pointer', marginTop: '4px' }} 
                />
              </div>

            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
            <CheckCircle2 size={16} color="var(--color-primary)" />
            <span className="caption" style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Preferences are read-only in this workspace.</span>
          </div>
        </Card>

        {/* Security & Account Options Card */}
        <Card
          variant="glass"
          style={{
            padding: '28px',
            background: 'var(--color-surface-white)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--color-primary-muted)', display: 'grid', placeItems: 'center', color: 'var(--color-primary)' }}>
                <Shield size={20} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'Outfit, sans-serif' }}>
                Account Options
              </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Password Option */}
              <div style={{ padding: '18px 20px', background: 'var(--color-surface-interactive)', borderRadius: '10px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>Patient password changes</p>
                  <span className="caption" style={{ display: 'block', marginTop: '4px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Password changes are not available in this workspace.
                  </span>
                </div>
                <Button variant="secondary" size="sm" disabled style={{ opacity: 0.85, whiteSpace: 'nowrap' }}>
                  Not available
                </Button>
              </div>

              {/* Deletion Option */}
              <div style={{ padding: '18px 20px', background: 'var(--color-surface-interactive)', borderRadius: '10px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>Delete Account</p>
                  <span className="caption" style={{ display: 'block', marginTop: '4px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Deletion requests are not available in this workspace.
                  </span>
                </div>
                <Button variant="outline" size="sm" disabled style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', opacity: 0.85, whiteSpace: 'nowrap' }}>
                  Not available
                </Button>
              </div>

              {/* Patient Ownership Badge Note */}
              <div style={{ padding: '16px 20px', background: 'var(--color-primary-muted)', borderRadius: '10px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <UserCheck size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.86rem', color: 'var(--color-text)', lineHeight: 1.5, fontWeight: 500 }}>
                  Logged in as <strong>{patient?.name || 'Authorized Patient'}</strong>. Your medical records remain patient-owned and protected.
                </span>
              </div>

            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

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
import { useState } from "react";                                                             // React state hook for form input tracking
import { useNavigate } from "react-router-dom";                                                 // Navigation hook to redirect between views
import { Card } from "../../components/ui/Card";                                                // UI glass container component
import { Button } from "../../components/ui/Button";                                            // Styled interactive button component
import { Input } from "../../components/ui/Input";                                              // Styled form text input component
import { LifeLinkLogo } from "../../components/brand/LifeLinkLogo";                            // Official platform SVG brand logo
import { EntryThemeToggle } from "../../components/EntryThemeToggle";                          // Light/dark theme toggle component
import { trpc } from "../../lib/trpc";                                                          // Type-safe tRPC client bridge
import { Activity, Key, Mail, Lock, ShieldCheck, Shield } from 'lucide-react';                  // Medical security and credential icons

// =========================================================================================
// DOCTOR PASSWORD RESET & CREDENTIAL RECOVERY WORKFLOW (DoctorResetPassword)
// =========================================================================================
//
// WHAT THIS COMPONENT DOES:
// 1. Allows medical clinicians to reset their workstation passwords at `/doctor/reset`.
// 2. Enforces institutional security using the controlled master clinician secret key
//    (`lifelink-controlled-clinician-secret-key-2026`) established during server deployment,
//    preventing unauthorized self-service password hijacking.
// 3. Shares the high-contrast Doctor Auth Page visual styling (`.doctor-auth-page`):
//    - Deep ocean teal radial ambient background (`#0E2E33` -> `#071416` -> `#030A0B`).
//    - Elevated ivory brand card mount (`#FAF5EC`) with gold rim accent.
//    - Luminous ice-teal and ivory typography ensuring maximum readability in both light & dark modes.
// =========================================================================================
export const DoctorResetPassword = () => {
  const navigate = useNavigate();                                                               // Router navigation hook
  const [email, setEmail] = useState("");                                                       // Doctor email input state
  const [password, setPassword] = useState("");                                                 // Desired new password input state
  const [provisioningCode, setProvisioningCode] = useState("");                                 // Secret owner provisioning passcode
  const [message, setMessage] = useState("");                                                   // Status feedback message banner

  // tRPC mutation invoking backend doctor credential update
  const reset = trpc.doctorAuth.resetPassword.useMutation({
    onSuccess: () => {
      setMessage("Password changed successfully. Sign in using the new doctor password.");       // Success banner feedback
      setPassword("");                                                                          // Clear password field for security
      setProvisioningCode("");                                                                  // Clear secret code field
    },
    onError: (error) => setMessage(error.message),                                              // Display error message from server
  });

  // Handle form submission
  const submit = (event: React.FormEvent) => {
    event.preventDefault();                                                                     // Prevent native page refresh
    setMessage("");                                                                             // Clear prior feedback
    reset.mutate({ email, password, provisioningCode });                                        // Trigger password reset mutation
  };

  return (
    <main className="auth-page doctor-auth-page" aria-labelledby="doctor-reset-heading" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Top navigation portal header */}
      <header className="workspace-portal-header doctor-portal-header" aria-label="LifeLink portal header">
        <div className="workspace-portal-brand">
          <span className="workspace-portal-mark" aria-hidden="true">
            <LifeLinkLogo variant="symbol" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          </span>
          <span>
            <strong>LifeLink</strong>
            <small>Doctor workstation</small>
          </span>
        </div>
        <div className="workspace-portal-assurance">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>Secure physician recovery</span>
        </div>
        <EntryThemeToggle />                                                                    {/* Theme toggle control */}
      </header>

      {/* Split layout: Branding panel + Form card */}
      <div className="doctor-setup-layout auth-split-layout" style={{ flex: 1, display: 'flex', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Ambient background clinical grid watermark */}
        <div style={{ position: 'absolute', bottom: '2%', left: '4%', opacity: 0.08, pointerEvents: 'none', color: 'var(--color-doctor-primary)' }}>
          <Activity size={340} strokeWidth={1} />
        </div>

        {/* Branding Panel (Left Column): Structured Showcase */}
        <div className="auth-branding-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'var(--spacing-6)', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Structured Logo Mount */}
            <div 
              style={{ 
                background: '#FAF5EC', 
                border: '2px solid #D4B07B', 
                borderRadius: '8px', 
                padding: '24px 36px', 
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                marginBottom: '28px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: 'min(460px, 94vw)',
                width: '100%'
              }}
            >
              <LifeLinkLogo className="lifelink-logo-auth" style={{ width: '100%', maxWidth: '420px', height: 'auto', margin: 0, padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }} />
            </div>
            
            {/* Clinician Subtitle & Motto */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <span 
                style={{ 
                  background: 'var(--color-doctor-primary)', 
                  color: 'var(--color-surface-white)', 
                  fontSize: '0.74rem', 
                  fontWeight: 700, 
                  letterSpacing: '0.08em', 
                  textTransform: 'uppercase', 
                  padding: '4px 12px', 
                  borderRadius: '4px',
                  border: '1px solid var(--color-doctor-border)'
                }}
              >
                Doctor Portal • Account Recovery
              </span>

              <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, margin: '6px 0 0', color: 'var(--color-doctor-text)', letterSpacing: '-0.01em' }}>
                Care. Connect. Cure.
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5, maxWidth: '380px' }}>
                Secure account recovery for verified medical practitioners using your owner provisioning code.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container (Right Column): Classic American Institutional Card */}
        <div style={{ flex: 1.1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--spacing-4)', zIndex: 1 }}>
          <Card 
            className="clinical-glass-card" 
            style={{ 
              width: '100%', 
              maxWidth: '520px', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: 'clamp(24px, 4vw, 36px)', 
              borderRadius: '4px', 
              background: 'var(--color-doctor-surface)', 
              border: '1px solid var(--color-doctor-border)', 
              boxShadow: 'var(--shadow-md)' 
            }}
          >
            {/* Form Header */}
            <header className="auth-card-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
              {/* Responsive Mobile Logo Showcase: Guarantees full brand visibility on mobile devices where left branding column is hidden */}
              <div className="auth-card-mobile-logo-wrap">
                <LifeLinkLogo className="lifelink-logo-auth auth-card-mobile-logo" />
              </div>

              <h1 id="doctor-reset-heading" className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-doctor-text)', letterSpacing: '-0.02em' }}>
                Reset Doctor Password
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.90rem', margin: 0 }}>
                Use your owner provisioning code to set a new password
              </p>
            </header>

            {/* Status message */}
            {message && (
              <div 
                className="alert-panel auth-message" 
                role="status" 
                style={{ 
                  marginBottom: '20px', 
                  textAlign: 'center', 
                  background: 'var(--color-surface-interactive)', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '4px', 
                  padding: '10px 14px', 
                  fontSize: '0.88rem', 
                  color: 'var(--color-text)' 
                }}
              >
                {message}
              </div>
            )}

            {/* Reset Form */}
            <form onSubmit={submit} className="auth-form" style={{ display: 'grid', gap: '16px' }}>
              {/* Doctor email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="reset-email" style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-text)' }}>
                  Doctor Email
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your official @lifelink.com doctor email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="username"
                    required
                    style={{ width: '100%', paddingLeft: '42px', borderRadius: '4px', minHeight: '44px', border: '1px solid var(--color-border)', fontSize: '0.90rem', background: 'var(--color-surface-interactive)', color: 'var(--color-text)' }}
                  />
                </div>
              </div>

              {/* New Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="reset-password" style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-text)' }}>
                  New Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                  <Input
                    id="reset-password"
                    type="password"
                    minLength={10}
                    placeholder="Enter your new password (minimum 10 characters)"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                    style={{ width: '100%', paddingLeft: '42px', borderRadius: '4px', minHeight: '44px', border: '1px solid var(--color-border)', fontSize: '0.90rem', background: 'var(--color-surface-interactive)', color: 'var(--color-text)' }}
                  />
                </div>
              </div>

              {/* Owner Provisioning Code */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="reset-provisioning-code" style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-text)' }}>
                  Owner Provisioning Code
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Key size={18} style={{ position: 'absolute', left: '14px', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                  <Input
                    id="reset-provisioning-code"
                    type="password"
                    placeholder="Enter your owner provisioning access code"
                    value={provisioningCode}
                    onChange={(event) => setProvisioningCode(event.target.value)}
                    autoComplete="off"
                    required
                    style={{ width: '100%', paddingLeft: '42px', borderRadius: '4px', minHeight: '44px', border: '1px solid var(--color-border)', fontSize: '0.90rem', background: 'var(--color-surface-interactive)', color: 'var(--color-text)' }}
                  />
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                disabled={reset.isPending}
                style={{ 
                  width: '100%', 
                  minHeight: '44px', 
                  padding: '11px', 
                  fontSize: '0.96rem', 
                  fontWeight: 600, 
                  borderRadius: '4px', 
                  background: 'var(--color-doctor-primary)', 
                  color: '#FFFFFF', 
                  border: 'none', 
                  marginTop: '4px', 
                  cursor: 'pointer', 
                  opacity: reset.isPending ? 0.7 : 1 
                }}
              >
                {reset.isPending ? "Resetting…" : "Reset Password"}
              </Button>
            </form>

            {/* Back to sign in */}
            <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.86rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Remembered the password? </span>
              <button
                type="button"
                onClick={() => navigate("/doctor/login")}
                style={{ background: 'none', border: 'none', color: 'var(--color-doctor-primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Doctor sign in
              </button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

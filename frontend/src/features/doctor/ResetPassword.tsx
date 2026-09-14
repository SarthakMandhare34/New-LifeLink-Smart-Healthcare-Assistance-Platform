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
// DOCTOR PASSWORD RESET WORKFLOW
// Allows medical clinicians to reset their workstation passwords using the secure owner
// provisioning code established during server deployment. Prevents unauthorized password resets.
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
    <main className="auth-page" aria-labelledby="doctor-reset-heading" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Top navigation portal header */}
      <header className="workspace-portal-header" aria-label="LifeLink portal header">
        <div className="workspace-portal-brand">
          <span className="workspace-portal-mark" aria-hidden="true">
            <LifeLinkLogo variant="symbol" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
          </span>
          <span>
            <strong>LifeLink</strong>
            <small>Doctor workstation</small>
          </span>
        </div>
        <div className="workspace-portal-assurance">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>Controlled clinician recovery</span>
        </div>
        <EntryThemeToggle />                                                                    {/* Theme toggle control */}
      </header>

      {/* Split layout: Branding panel + Form card */}
      <div className="doctor-setup-layout auth-split-layout" style={{ flex: 1, display: 'flex', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Ambient background clinical grid watermark */}
        <div style={{ position: 'absolute', bottom: '2%', left: '4%', opacity: 0.08, pointerEvents: 'none', color: '#27272A' }}>
          <Activity size={340} strokeWidth={1} />
        </div>

        {/* Branding Panel (Left Column): Structured Institutional Showcase */}
        <div className="auth-branding-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'var(--spacing-6)', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Structured Institutional Logo Mount */}
            <div 
              style={{ 
                background: '#EBECEF', 
                border: '2px solid #D4D4D8', 
                borderRadius: '6px', 
                padding: '16px 28px', 
                boxShadow: '0 4px 12px rgba(24, 24, 27, 0.08)',
                marginBottom: '28px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LifeLinkLogo className="lifelink-logo-auth" style={{ width: '280px', height: 'auto', margin: 0, padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }} />
            </div>
            
            {/* Institutional Clinician Subtitle & Motto */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <span 
                style={{ 
                  background: '#27272A', 
                  color: '#F4F4F5', 
                  fontSize: '0.74rem', 
                  fontWeight: 700, 
                  letterSpacing: '0.08em', 
                  textTransform: 'uppercase', 
                  padding: '4px 12px', 
                  borderRadius: '4px',
                  border: '1px solid #3F3F46'
                }}
              >
                Clinician Workstation • Password Recovery
              </span>

              <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, margin: '6px 0 0', color: '#18181B', letterSpacing: '-0.01em', fontFamily: 'Outfit, sans-serif' }}>
                Care. Connect. Cure.
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#52525B', margin: 0, lineHeight: 1.5, maxWidth: '380px' }}>
                Controlled institutional recovery for physician credentials using your verified owner provisioning code.
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
              background: '#EBECEF', 
              border: '1px solid #D4D4D8', 
              boxShadow: '0 4px 16px rgba(24, 24, 27, 0.06)' 
            }}
          >
            {/* Form Header */}
            <header className="auth-card-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
              {/* Responsive Mobile Logo Showcase: Guarantees full brand visibility on mobile devices where left branding column is hidden */}
              <div className="auth-card-mobile-logo-wrap">
                <LifeLinkLogo className="lifelink-logo-auth auth-card-mobile-logo" />
              </div>

              <h1 id="doctor-reset-heading" className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '6px', color: '#18181B', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
                Reset Clinician Password
              </h1>
              <p style={{ color: '#52525B', fontSize: '0.90rem', margin: 0 }}>
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
                  background: '#F4F4F5', 
                  border: '1px solid #D4D4D8', 
                  borderRadius: '4px', 
                  padding: '10px 14px', 
                  fontSize: '0.88rem', 
                  color: '#18181B' 
                }}
              >
                {message}
              </div>
            )}

            {/* Reset Form */}
            <form onSubmit={submit} className="auth-form" style={{ display: 'grid', gap: '16px' }}>
              {/* Doctor email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="reset-email" style={{ fontWeight: 600, fontSize: '0.86rem', color: '#18181B' }}>
                  Clinician Email
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', color: '#71717A', pointerEvents: 'none' }} />
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="username"
                    required
                    style={{ width: '100%', paddingLeft: '42px', borderRadius: '4px', minHeight: '44px', border: '1px solid #D4D4D8', fontSize: '0.90rem', background: '#F4F4F5', color: '#18181B' }}
                  />
                </div>
              </div>

              {/* New Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="reset-password" style={{ fontWeight: 600, fontSize: '0.86rem', color: '#18181B' }}>
                  New Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', color: '#71717A', pointerEvents: 'none' }} />
                  <Input
                    id="reset-password"
                    type="password"
                    minLength={10}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                    style={{ width: '100%', paddingLeft: '42px', borderRadius: '4px', minHeight: '44px', border: '1px solid #D4D4D8', fontSize: '0.90rem', background: '#F4F4F5', color: '#18181B' }}
                  />
                </div>
              </div>

              {/* Owner Provisioning Code */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="reset-provisioning-code" style={{ fontWeight: 600, fontSize: '0.86rem', color: '#18181B' }}>
                  Owner Provisioning Code
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Key size={18} style={{ position: 'absolute', left: '14px', color: '#71717A', pointerEvents: 'none' }} />
                  <Input
                    id="reset-provisioning-code"
                    type="password"
                    value={provisioningCode}
                    onChange={(event) => setProvisioningCode(event.target.value)}
                    autoComplete="off"
                    required
                    style={{ width: '100%', paddingLeft: '42px', borderRadius: '4px', minHeight: '44px', border: '1px solid #D4D4D8', fontSize: '0.90rem', background: '#F4F4F5', color: '#18181B' }}
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
                  background: 'linear-gradient(180deg, #3F3F46 0%, #27272A 100%)', 
                  color: '#F4F4F5', 
                  border: '1px solid #18181B', 
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
              <span style={{ color: '#71717A' }}>Remembered the password? </span>
              <button
                type="button"
                onClick={() => navigate("/doctor/login")}
                style={{ background: 'none', border: 'none', color: '#B45309', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Doctor sign in
              </button>
            </div>

            {/* Trust and security badges */}
            <footer style={{ display: 'flex', justifyContent: 'space-around', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #D4D4D8' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#52525B' }}>
                <ShieldCheck size={18} color="#27272A" />
                <span style={{ fontSize: '0.70rem', fontWeight: 600 }}>Owner Auth</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#52525B' }}>
                <ShieldCheck size={18} color="#27272A" />
                <span style={{ fontSize: '0.70rem', fontWeight: 600 }}>Zero Stored Logs</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#52525B' }}>
                <Shield size={18} color="#27272A" />
                <span style={{ fontSize: '0.70rem', fontWeight: 600 }}>Protected Workspace</span>
              </div>
            </footer>
          </Card>
        </div>
      </div>
    </main>
  );
};

/**
 * ============================================================================
 * CLINICIAN WORKSTATION AUTHENTICATION PORTAL (frontend/src/features/doctor/Login.tsx)
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This is the dedicated credential verification gateway for medical clinicians.
 * It strictly issues independent `doctor_session_id` cookies to prevent token cross-contamination
 * with patient sessions, verifies credentials against the synthetic doctor directory across
 * 24 Mumbai railway transit clinic locations, and routes verified specialists into their practice suite.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LifeLinkLogo } from "../../components/brand/LifeLinkLogo";
import { EntryThemeToggle } from "../../components/EntryThemeToggle";
import { trpc } from "../../lib/trpc";
import { Lock, Mail, Eye, EyeOff, Stethoscope, ShieldCheck } from 'lucide-react';

// =========================================================================================
// CLINICIAN WORKSTATION AUTHENTICATION MODULE (DoctorLogin)
// =========================================================================================
//
// WHAT THIS COMPONENT DOES:
// 1. Provides a dedicated sign-in portal for medical clinicians at `/doctor/login`.
// 2. Enforces institutional work-email logins (`<specialty>@lifelink.com`) with auto-provisioning
//    for all 24 seeded Mumbai specialty stations.
// 3. Establishes isolated `doctor_session_id` HTTP-only cookies completely decoupled from patient sessions.
// 4. Implements the Deep Ocean Teal + Gold visual identity system with high-contrast dark mode support:
//    - Luminous ice-teal & ivory typography (`#D4F0EE` / `#F0FDFD`) on dark surfaces (`#0E2226`).
//    - Elevated ivory logo mount (`#FAF5EC`) for crisp brand presentation.
//    - Deep ocean teal radial ambient background (`radial-gradient` at 30% 20%).
// =========================================================================================
export const DoctorLogin = () => {
  const navigate = useNavigate();                                                          // Programmatic page navigation hook
  const utils = trpc.useUtils();                                                           // tRPC cache utilities
  const [email, setEmail] = useState("");                                                  // Clinician work email state
  const [password, setPassword] = useState("");                                            // Clinician password state
  const [showPassword, setShowPassword] = useState(false);                                 // Password visibility toggle
  const [error, setError] = useState("");                                                  // Authentication error message
  
  // tRPC mutation for doctor authentication and session cookie establishment
  const login = trpc.doctorAuth.login.useMutation({
    onSuccess: async (doctor) => {
      utils.doctorAuth.me.setData(undefined, doctor);                                      // Seed active doctor profile into cache
      await utils.auth.me.invalidate();                                                    // Invalidate stale user context
      navigate("/doctor/dashboard", { replace: true });                                    // Navigate to clinician dashboard
    },
    onError: () => setError("Invalid email or Password"),                                  // Display error message
  });

  // Form submission handler
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();                                                                // Prevent browser form reload
    setError("");                                                                          // Clear previous error message
    login.mutate({ email, password });                                                     // Dispatch login credentials
  };

  return (
    <main className="auth-page doctor-auth-page" aria-labelledby="doctor-login-heading">
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
          <span>Protected doctor workspace</span>
        </div>
        <EntryThemeToggle />
      </header>

      <div className="doctor-setup-layout auth-split-layout" style={{ flex: 1, display: 'flex', width: '100%', position: 'relative', zIndex: 1 }}>

        {/* Branding Panel (Left Column): Clean Nordic Clinical Identity */}
        <div className="auth-branding-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'var(--spacing-6)', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Proportional Brand Treatment (Section 11) */}
            <div style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <LifeLinkLogo className="lifelink-logo-auth" style={{ width: '100%', maxWidth: '240px', height: 'auto', margin: 0, padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }} />
            </div>
            
            {/* Institutional Clinician Subtitle & Motto */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <span 
                style={{ 
                  background: 'var(--swiss-blue-soft)', 
                  color: 'var(--color-doctor-primary)', 
                  fontSize: '0.74rem', 
                  fontWeight: 600, 
                  letterSpacing: '0.06em', 
                  textTransform: 'uppercase', 
                  padding: '5px 14px', 
                  borderRadius: 'var(--border-radius-badge)',
                  border: '1px solid #BFDBFE'
                }}
              >
                Healthcare Provider Suite
              </span>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '6px 0 0', color: 'var(--color-doctor-text)', letterSpacing: '-0.02em' }}>
                Care. Connect. Cure.
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5, maxWidth: '380px' }}>
                Streamlined clinical platform for patient appointments, intelligent triage insights, and digital prescriptions.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container (Right Column): Solid Clinical Card */}
        <div style={{ flex: 1.1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'clamp(24px, 4vw, 40px)', zIndex: 1 }}>
          <Card 
            className="card" 
            style={{ 
              width: '100%', 
              maxWidth: '480px', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: 'clamp(30px, 4.5vw, 44px)',
              background: 'var(--color-surface-white)',
              border: '1px solid var(--color-border)',
              borderRadius: '2px',
              boxShadow: 'none'
            }}
          >
            {/* Form Card Header */}
            <header className="auth-card-header" style={{ textAlign: 'center', marginBottom: '28px' }}>
              {/* Responsive Mobile Logo Showcase: Guarantees full brand visibility on mobile devices where left branding column is hidden */}
              <div className="auth-card-mobile-logo-wrap">
                <LifeLinkLogo className="lifelink-logo-auth auth-card-mobile-logo" />
              </div>

              <h1 id="doctor-login-heading" className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-doctor-text)', letterSpacing: '-0.02em' }}>
                Doctor Sign In
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.90rem', margin: 0 }}>
                Review assigned appointments and clinical patient context
              </p>
            </header>

            {/* Error banner */}
            {error && (
              <div 
                className="alert-panel auth-message" 
                role="alert" 
                style={{ 
                  marginBottom: '20px', 
                  color: 'var(--color-semantic-emergency)', 
                  textAlign: 'center',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '2px',
                  padding: '12px 16px',
                  fontSize: '0.88rem'
                }}
              >
                {error}
              </div>
            )}

            {/* Doctor Login form */}
            <form onSubmit={handleLogin} className="auth-form" style={{ display: 'grid', gap: '20px' }}>
              {/* Doctor Work Email Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="doctor-email" style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-doctor-text)' }}>
                  Doctor Work Email
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', color: 'var(--color-doctor-primary)', pointerEvents: 'none' }} />
                  <Input
                    id="doctor-email"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    style={{ 
                      width: '100%', 
                      paddingLeft: '42px', 
                      borderRadius: '2px', 
                      minHeight: '48px', 
                      fontSize: '0.90rem',
                      border: '1px solid var(--color-doctor-input-border, var(--color-doctor-border))',
                      background: 'var(--color-surface-white)',
                      color: 'var(--color-doctor-text)'
                    }}
                  />
                </div>
                <small style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Use your @lifelink.com work email.</small>
              </div>

              {/* Password Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="doctor-password" style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-doctor-text)' }}>
                  Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', color: 'var(--color-doctor-primary)', pointerEvents: 'none' }} />
                  <Input
                    id="doctor-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    style={{ 
                      width: '100%', 
                      paddingLeft: '42px', 
                      paddingRight: '42px', 
                      borderRadius: '2px', 
                      minHeight: '46px', 
                      fontSize: '0.90rem',
                      border: '1px solid var(--color-doctor-input-border, var(--color-doctor-border))',
                      background: 'var(--color-surface-white)',
                      color: 'var(--color-doctor-text)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: 'var(--color-doctor-primary)', cursor: 'pointer', padding: 0 }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Sign In Primary Button */}
              <Button
                type="submit"
                disabled={login.isPending}
                style={{
                  width: '100%',
                  minHeight: '46px',
                  background: 'linear-gradient(180deg, #0E7279 0%, #0C5F66 100%)',
                  border: '1px solid var(--color-doctor-accent)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  marginTop: '8px',
                  boxShadow: '0 4px 12px rgba(12, 95, 102, 0.3)'
                }}
              >
                {login.isPending ? 'Signing In…' : 'Sign In'}
              </Button>
            </form>

            {/* Password recovery & Patient navigation */}
            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button
                  type="button"
                  onClick={() => navigate('/doctor/reset')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-doctor-accent)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Reset password
                </button>
              </div>
              <div style={{ marginTop: '4px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Are you a patient? </span>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-doctor-primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Patient sign in
                </button>
              </div>
            </div>

          </Card>
        </div>
      </div>
    </main>
  );
};

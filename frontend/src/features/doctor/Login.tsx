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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LifeLinkLogo } from "../../components/brand/LifeLinkLogo";
import { EntryThemeToggle } from "../../components/EntryThemeToggle";
import { trpc } from "../../lib/trpc";
import { Activity, Lock, Mail, Eye, EyeOff, Stethoscope, ShieldCheck } from 'lucide-react';

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
    onError: () => setError("The clinician email or password was not accepted."),          // Display error message
  });

  // Form submission handler
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();                                                                // Prevent browser form reload
    setError("");                                                                          // Clear previous error message
    login.mutate({ email, password });                                                     // Dispatch login credentials
  };

  return (
    <main className="auth-page doctor-auth-page" aria-labelledby="doctor-login-heading" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
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
          <span>Protected clinician workspace</span>
        </div>
        <EntryThemeToggle />
      </header>

      <div className="doctor-setup-layout auth-split-layout" style={{ flex: 1, display: 'flex', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Ambient background clinical grid watermark */}
        <div className="ambient-ecg-decoration" style={{ position: 'absolute', bottom: '2%', left: '4%', opacity: 0.08, color: 'var(--color-doctor-primary)', pointerEvents: 'none' }}>
          <Activity size={340} strokeWidth={1} />
        </div>

        {/* Branding Panel (Left Column): Structured Institutional Showcase */}
        <div className="auth-branding-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'var(--spacing-6)', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Structured Logo Mount: Crisp elevated plate guaranteeing high contrast and sharp brand visibility */}
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
            
            {/* Institutional Clinician Subtitle & Motto */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <span 
                style={{ 
                  background: 'var(--color-doctor-primary)', 
                  color: '#FFFFFF', 
                  fontSize: '0.74rem', 
                  fontWeight: 700, 
                  letterSpacing: '0.08em', 
                  textTransform: 'uppercase', 
                  padding: '5px 14px', 
                  borderRadius: '4px',
                  border: '1px solid var(--color-doctor-border)'
                }}
              >
                Healthcare Provider Suite
              </span>

              <h2 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 700, margin: '6px 0 0', color: 'var(--color-doctor-text)', letterSpacing: '-0.01em' }}>
                Care. Connect. Cure.
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5, maxWidth: '380px' }}>
                Streamlined clinical platform for patient appointments, intelligent triage insights, and digital prescriptions.
              </p>

              {/* Provider feature highlights — warm, human, not institutional */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', textAlign: 'left', width: '100%', maxWidth: '340px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--color-doctor-text)', fontWeight: 500 }}>
                  <ShieldCheck size={18} color="var(--color-doctor-primary)" style={{ flexShrink: 0 }} />
                  <span>Your patients, your dashboard</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--color-doctor-text)', fontWeight: 500 }}>
                  <Activity size={18} color="var(--color-doctor-primary)" style={{ flexShrink: 0 }} />
                  <span>Smart triage queue built for busy practitioners</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--color-doctor-text)', fontWeight: 500 }}>
                  <Stethoscope size={18} color="var(--color-doctor-primary)" style={{ flexShrink: 0 }} />
                  <span>Digital prescriptions sent in under a minute</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container (Right Column): Classic American Institutional Card */}
        <div style={{ flex: 1.1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--spacing-4)', zIndex: 1 }}>
          <Card 
            className="clinical-glass-card" 
            style={{ 
              width: '100%', 
              maxWidth: '500px', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: 'clamp(24px, 4vw, 36px)',
              background: 'var(--color-doctor-surface)',
              border: '1px solid var(--color-doctor-border)',
              borderRadius: '6px',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {/* Form Card Header */}
            <header className="auth-card-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
              {/* Responsive Mobile Logo Showcase: Guarantees full brand visibility on mobile devices where left branding column is hidden */}
              <div className="auth-card-mobile-logo-wrap">
                <LifeLinkLogo className="lifelink-logo-auth auth-card-mobile-logo" />
              </div>

              <h1 id="doctor-login-heading" className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-doctor-text)', letterSpacing: '-0.02em' }}>
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
                  borderRadius: '4px',
                  padding: '10px 14px',
                  fontSize: '0.88rem'
                }}
              >
                {error}
              </div>
            )}

            {/* Clinician Login form */}
            <form onSubmit={handleLogin} className="auth-form" style={{ display: 'grid', gap: '16px' }}>
              {/* Clinician Work Email Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="doctor-email" style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-doctor-text)' }}>
                  Clinician Work Email
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', color: 'var(--color-doctor-primary)', pointerEvents: 'none' }} />
                  <Input
                    id="doctor-email"
                    type="email"
                    placeholder="e.g. cardiology@lifelink.com or orthopedics@lifelink.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    style={{ 
                      width: '100%', 
                      paddingLeft: '42px', 
                      borderRadius: '4px', 
                      minHeight: '44px', 
                      fontSize: '0.90rem',
                      border: '1px solid var(--color-doctor-border)',
                      background: 'var(--color-surface-interactive)',
                      color: 'var(--color-doctor-text)'
                    }}
                  />
                </div>
                <small style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Must be your official @lifelink.com clinical work email.</small>
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
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    style={{ 
                      width: '100%', 
                      paddingLeft: '42px', 
                      paddingRight: '42px', 
                      borderRadius: '4px', 
                      minHeight: '44px', 
                      fontSize: '0.90rem',
                      border: '1px solid var(--color-doctor-border)',
                      background: 'var(--color-surface-interactive)',
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
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '4px',
                  boxShadow: '0 4px 12px rgba(12, 95, 102, 0.3)'
                }}
              >
                {login.isPending ? 'Authenticating Clinician…' : 'Access Provider Terminal'}
              </Button>
            </form>

            {/* Password recovery & Patient navigation */}
            <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

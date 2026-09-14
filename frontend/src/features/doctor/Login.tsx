import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LifeLinkLogo } from "../../components/brand/LifeLinkLogo";
import { EntryThemeToggle } from "../../components/EntryThemeToggle";
import { trpc } from "../../lib/trpc";
import { Activity, Lock, Mail, Eye, EyeOff, Stethoscope, ShieldCheck, Shield } from 'lucide-react';

// Doctor authentication page component allowing specialists to access their clinical dashboard
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
    <main className="auth-page" aria-labelledby="doctor-login-heading" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
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
          <span>Protected clinician workspace</span>
        </div>
        <EntryThemeToggle />
      </header>

      <div className="doctor-setup-layout auth-split-layout" style={{ flex: 1, display: 'flex', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Ambient background clinical grid watermark */}
        <div className="ambient-ecg-decoration" style={{ position: 'absolute', bottom: '2%', left: '4%', opacity: 0.08, color: '#27272A', pointerEvents: 'none' }}>
          <Activity size={340} strokeWidth={1} />
        </div>

        {/* Branding Panel (Left Column): Structured Institutional Showcase */}
        <div className="auth-branding-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'var(--spacing-6)', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Structured Institutional Logo Mount: Crisp, elevated zinc ash plate guaranteeing high contrast and sharp brand visibility */}
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
                Clinician Workstation • Provider Terminal
              </span>

              <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, margin: '6px 0 0', color: '#18181B', letterSpacing: '-0.01em', fontFamily: 'Outfit, sans-serif' }}>
                Care. Connect. Cure.
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#52525B', margin: 0, lineHeight: 1.5, maxWidth: '380px' }}>
                Authorized provider terminal for patient roster management, clinical assessments review, and e-prescription issuance.
              </p>

              {/* Institutional feature highlights in classic American enterprise list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', textAlign: 'left', width: '100%', maxWidth: '340px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#27272A', fontWeight: 500 }}>
                  <ShieldCheck size={18} color="#B45309" />
                  <span>Authorized Physician Credential Guard</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#27272A', fontWeight: 500 }}>
                  <Activity size={18} color="#B45309" />
                  <span>Patient Triage Review & Consultation Queue</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#27272A', fontWeight: 500 }}>
                  <Stethoscope size={18} color="#B45309" />
                  <span>Digital Prescription & Diagnosis Workflow</span>
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
              background: '#EBECEF',
              border: '1px solid #D4D4D8',
              borderRadius: '4px',
              boxShadow: '0 4px 16px rgba(24, 24, 27, 0.06)'
            }}
          >
            {/* Form Card Header */}
            <header className="auth-card-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
              {/* Responsive Mobile Logo Showcase: Guarantees full brand visibility on mobile devices where left branding column is hidden */}
              <div className="auth-card-mobile-logo-wrap">
                <LifeLinkLogo className="lifelink-logo-auth auth-card-mobile-logo" />
              </div>

              <h1 id="doctor-login-heading" className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '6px', color: '#18181B', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
                Doctor Sign In
              </h1>
              <p style={{ color: '#52525B', fontSize: '0.90rem', margin: 0 }}>
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
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
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
                <label htmlFor="doctor-email" style={{ fontWeight: 600, fontSize: '0.86rem', color: '#18181B' }}>
                  Clinician Work Email
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', color: '#71717A', pointerEvents: 'none' }} />
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
                      border: '1px solid #D4D4D8',
                      background: '#F4F4F5',
                      color: '#18181B'
                    }}
                  />
                </div>
                <small style={{ fontSize: '0.74rem', color: '#71717A' }}>Must be your official @lifelink.com clinical work email.</small>
              </div>

              {/* Password Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="doctor-password" style={{ fontWeight: 600, fontSize: '0.86rem', color: '#18181B' }}>
                  Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', color: '#71717A', pointerEvents: 'none' }} />
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
                      border: '1px solid #D4D4D8',
                      background: '#F4F4F5',
                      color: '#18181B'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', padding: 0 }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Sign In Primary Button */}
              <Button
                type="submit"
                variant="primary"
                disabled={login.isPending}
                style={{ 
                  width: '100%', 
                  minHeight: '44px', 
                  padding: '11px', 
                  fontSize: '0.96rem', 
                  fontWeight: 600, 
                  borderRadius: '4px', 
                  marginTop: '4px', 
                  cursor: 'pointer', 
                  opacity: login.isPending ? 0.7 : 1,
                  background: 'linear-gradient(180deg, #3F3F46 0%, #27272A 100%)',
                  border: '1px solid #18181B',
                  color: '#F4F4F5'
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
                  style={{ background: 'none', border: 'none', color: '#B45309', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Reset password
                </button>
              </div>
              <div style={{ marginTop: '4px' }}>
                <span style={{ color: '#71717A' }}>Are you a patient? </span>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  style={{ background: 'none', border: 'none', color: '#27272A', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Patient sign in
                </button>
              </div>
            </div>

            {/* Institutional Security Badges */}
            <footer style={{ display: 'flex', justifyContent: 'space-around', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #D4D4D8' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#52525B' }}>
                <ShieldCheck size={18} color="#27272A" />
                <span style={{ fontSize: '0.70rem', fontWeight: 600 }}>Physician Guard</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#52525B' }}>
                <ShieldCheck size={18} color="#27272A" />
                <span style={{ fontSize: '0.70rem', fontWeight: 600 }}>Verified Doctors</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#52525B' }}>
                <Shield size={18} color="#27272A" />
                <span style={{ fontSize: '0.70rem', fontWeight: 600 }}>Protected Access</span>
              </div>
            </footer>
          </Card>
        </div>
      </div>
    </main>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LifeLinkLogo } from '../../components/brand/LifeLinkLogo';
import { EntryThemeToggle } from '../../components/EntryThemeToggle';
import { trpc } from '../../lib/trpc';
import { Activity, Lock, User as UserIcon, Mail, HeartPulse, ShieldCheck, Shield } from 'lucide-react';
import { PATIENT_DASHBOARD_PATH } from '../patient/patientAuthRoutes';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
    <path fill="#FBBC05" d="M5.28 14.27a7.18 7.18 0 0 1 0-4.54V6.58H1.25a11.97 11.97 0 0 0 0 10.84l4.03-3.15z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
  </svg>
);

// Patient registration page component for creating new accounts
export const PatientRegistration = () => {
  const navigate = useNavigate();                                                          // Navigation hook for dashboard redirection
  const [searchParams] = useSearchParams();                                                // URL search parameters for OAuth error notifications
  const trpcUtils = trpc.useUtils();                                                       // tRPC utility cache client
  const registerMutation = trpc.patientAuth.register.useMutation();                        // Mutation hook creating new native patient in DB
  const providerQuery = trpc.auth.providers.useQuery(undefined, {                          // Query available social OAuth providers
    retry: 3,                                                                              // Retry up to 3 times
    staleTime: 10000,                                                                      // Cache provider availability for 10 seconds
  });
  const [name, setName] = useState('');                                                    // Controlled full name state
  const [email, setEmail] = useState('');                                                  // Controlled email state
  const [password, setPassword] = useState('');                                            // Controlled password state
  const [confirmPassword, setConfirmPassword] = useState('');                              // Controlled confirm password state
  const [isLoading, setIsLoading] = useState(false);                                       // Registration submission loading state
  const [error, setError] = useState('');                                                  // Validation or server error message

  const authErrorParam = searchParams.get('authError');                                    // Check if arriving from failed Google registration
  useEffect(() => {
    if (authErrorParam) {
      const errorMap: Record<string, string> = {
        invalid_provider_state: "The Google authorization session expired. Please try again.",
        provider_sign_in_cancelled: "Google sign-up was cancelled.",
        account_exists: "An account with this Google email already exists. Please sign in instead.",
        provider_sign_in_failed: "Google registration could not be verified. Please try again.",
      };
      setError(errorMap[authErrorParam] || "Google registration failed. Please try again.");
    }
  }, [authErrorParam]);

  // Validates matching passwords and calls backend registration mutation
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();                                                                    // Prevent form refresh
    setIsLoading(true);                                                                    // Show progress state
    setError('');                                                                          // Clear existing error
    if (password !== confirmPassword) {                                                    // Client-side password match verification
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    try {
      await registerMutation.mutateAsync({ name, email, password });                       // Call tRPC registration procedure
      await trpcUtils.auth.me.refetch();                                                   // Update authenticated user context
      navigate(PATIENT_DASHBOARD_PATH, { replace: true });                                 // Direct new patient to dashboard
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.'); // Display failure reason
      setIsLoading(false);                                                                 // Reset loading state
    }
  };

  // Initiates Google OAuth sign-up flow
  const handleGoogleClick = () => {
    const startUrl = providerQuery.data?.googleRegistrationStartUrl ?? providerQuery.data?.googleAuthorizationStartUrl ?? '/api/auth/google?intent=register'; // Registration intent endpoint
    window.location.assign(startUrl);                                                      // Redirect to Google consent screen
  };

  return (
    <main className="auth-page" aria-labelledby="patient-register-heading" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <header className="workspace-portal-header" aria-label="LifeLink portal header">
        <div className="workspace-portal-brand">
          <span className="workspace-portal-mark" aria-hidden="true">
            <LifeLinkLogo variant="symbol" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
          </span>
          <span>
            <strong>LifeLink</strong>
            <small>Patient care portal</small>
          </span>
        </div>
        <div className="workspace-portal-assurance">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>Patient-owned health passport</span>
        </div>
        <EntryThemeToggle />
      </header>

      <div className="doctor-setup-layout auth-split-layout" style={{ flex: 1, display: 'flex', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Ambient background clinical grid watermark */}
        <div className="ambient-ecg-decoration" style={{ position: 'absolute', bottom: '2%', left: '4%', opacity: 0.08, color: '#581825', pointerEvents: 'none' }}>
          <Activity size={340} strokeWidth={1} />
        </div>

        {/* Branding Panel (Left Column): Structured Institutional Showcase */}
        <div className="auth-branding-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'var(--spacing-6)', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Structured Institutional Logo Mount: Crisp, elevated soft bone plate guaranteeing high contrast and sharp brand visibility */}
            <div 
              style={{ 
                background: '#FAF7F2', 
                border: '2px solid #E0D8CE', 
                borderRadius: '6px', 
                padding: '16px 28px', 
                boxShadow: '0 4px 12px rgba(43, 21, 25, 0.08)',
                marginBottom: '28px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LifeLinkLogo className="lifelink-logo-auth" style={{ width: '280px', height: 'auto', margin: 0, padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }} />
            </div>
            
            {/* Institutional System Subtitle & Motto */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <span 
                style={{ 
                  background: '#581825', 
                  color: '#FAF7F2', 
                  fontSize: '0.74rem', 
                  fontWeight: 700, 
                  letterSpacing: '0.08em', 
                  textTransform: 'uppercase', 
                  padding: '4px 12px', 
                  borderRadius: '4px' 
                }}
              >
                Healthcare Assistance & EHR Platform
              </span>

              <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, margin: '6px 0 0', color: '#2B1519', letterSpacing: '-0.01em', fontFamily: 'Outfit, sans-serif' }}>
                Care. Connect. Cure.
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#6E585B', margin: 0, lineHeight: 1.5, maxWidth: '380px' }}>
                Create your patient-owned clinical EHR identity to securely hold medical history, book appointments, and access clinical triage.
              </p>

              {/* Institutional feature highlights in classic American enterprise list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', textAlign: 'left', width: '100%', maxWidth: '340px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#4B3539', fontWeight: 500 }}>
                  <ShieldCheck size={18} color="#581825" />
                  <span>Encrypted Patient Data Sovereignity</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#4B3539', fontWeight: 500 }}>
                  <Activity size={18} color="#581825" />
                  <span>Immediate Triage & Real-Time Vital Logs</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#4B3539', fontWeight: 500 }}>
                  <HeartPulse size={18} color="#581825" />
                  <span>Verified Clinical Network Collaboration</span>
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
              maxWidth: '520px', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: 'clamp(24px, 4vw, 36px)',
              background: '#FAF7F2',
              border: '1px solid #E0D8CE',
              borderRadius: '4px',
              boxShadow: '0 4px 16px rgba(43, 21, 25, 0.06)'
            }}
          >
            {/* Form Card Header */}
            <header className="auth-card-header" style={{ textAlign: 'center', marginBottom: '22px' }}>
              {/* Responsive Mobile Logo Showcase: Guarantees full brand visibility on mobile devices where left branding column is hidden */}
              <div className="auth-card-mobile-logo-wrap">
                <LifeLinkLogo className="lifelink-logo-auth auth-card-mobile-logo" />
              </div>

              <h1 id="patient-register-heading" className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '6px', color: '#2B1519', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
                Create Patient Account
              </h1>
              <p style={{ color: '#6E585B', fontSize: '0.90rem', margin: 0 }}>
                Set up your secure, patient-owned health passport
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

            {/* Registration form */}
            <form onSubmit={handleRegister} className="auth-form" style={{ display: 'grid', gap: '14px' }}>
              {/* Full Name field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label htmlFor="patient-name" style={{ fontWeight: 600, fontSize: '0.86rem', color: '#2B1519' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <UserIcon size={18} style={{ position: 'absolute', left: '14px', color: '#6E585B', pointerEvents: 'none' }} />
                  <Input
                    id="patient-name"
                    type="text"
                    placeholder="e.g. Eleanor Vance"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    style={{ 
                      width: '100%', 
                      paddingLeft: '42px', 
                      borderRadius: '4px', 
                      minHeight: '44px', 
                      fontSize: '0.90rem',
                      border: '1px solid #E0D8CE',
                      background: '#FBF9F7',
                      color: '#2B1519'
                    }}
                  />
                </div>
              </div>

              {/* Email field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label htmlFor="patient-email" style={{ fontWeight: 600, fontSize: '0.86rem', color: '#2B1519' }}>
                  Email
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', color: '#6E585B', pointerEvents: 'none' }} />
                  <Input
                    id="patient-email"
                    type="email"
                    placeholder="e.g. eleanor@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="username"
                    required
                    style={{ 
                      width: '100%', 
                      paddingLeft: '42px', 
                      borderRadius: '4px', 
                      minHeight: '44px', 
                      fontSize: '0.90rem',
                      border: '1px solid #E0D8CE',
                      background: '#FBF9F7',
                      color: '#2B1519'
                    }}
                  />
                </div>
              </div>

              {/* Password field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label htmlFor="patient-password" style={{ fontWeight: 600, fontSize: '0.86rem', color: '#2B1519' }}>
                  Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', color: '#6E585B', pointerEvents: 'none' }} />
                  <Input
                    id="patient-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                    style={{ 
                      width: '100%', 
                      paddingLeft: '42px', 
                      borderRadius: '4px', 
                      minHeight: '44px', 
                      fontSize: '0.90rem',
                      border: '1px solid #E0D8CE',
                      background: '#FBF9F7',
                      color: '#2B1519'
                    }}
                  />
                </div>
              </div>

              {/* Confirm Password field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label htmlFor="patient-confirm-password" style={{ fontWeight: 600, fontSize: '0.86rem', color: '#2B1519' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', color: '#6E585B', pointerEvents: 'none' }} />
                  <Input
                    id="patient-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                    style={{ 
                      width: '100%', 
                      paddingLeft: '42px', 
                      borderRadius: '4px', 
                      minHeight: '44px', 
                      fontSize: '0.90rem',
                      border: '1px solid #E0D8CE',
                      background: '#FBF9F7',
                      color: '#2B1519'
                    }}
                  />
                </div>
              </div>

              {/* Submit Registration Button */}
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  minHeight: '44px', 
                  padding: '11px', 
                  fontSize: '0.96rem', 
                  fontWeight: 600, 
                  borderRadius: '4px', 
                  marginTop: '6px', 
                  cursor: 'pointer', 
                  opacity: isLoading ? 0.7 : 1,
                  background: 'linear-gradient(180deg, #6E1E2E 0%, #581825 100%)',
                  border: '1px solid #45121C',
                  color: '#FAF7F2'
                }}
              >
                {isLoading ? 'Creating account…' : 'Create Patient Account'}
              </Button>
            </form>

            {/* Alternative registration provider divider */}
            <div className="social-auth" style={{ marginTop: '18px' }}>
              <div className="social-auth-divider" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6E585B', fontSize: '0.80rem' }}>
                <div style={{ flex: 1, height: '1px', background: '#E0D8CE' }} />
                <span>OR SIGN UP WITH</span>
                <div style={{ flex: 1, height: '1px', background: '#E0D8CE' }} />
              </div>
              <div className="social-auth-actions" style={{ marginTop: '12px' }}>
                <Button
                  type="button"
                  variant="outline"
                  className="btn w-full"
                  onClick={handleGoogleClick}
                  title="Sign up with Google"
                  style={{ 
                    borderRadius: '4px', 
                    minHeight: '44px', 
                    fontSize: '0.90rem', 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '10px', 
                    cursor: 'pointer', 
                    fontWeight: 600,
                    border: '1px solid #E0D8CE',
                    background: '#FAF7F2',
                    color: '#2B1519'
                  }}
                >
                  <GoogleIcon /> Sign up with Google SSO
                </Button>
              </div>
            </div>

            {/* Link back to sign in */}
            <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.86rem' }}>
              <span style={{ color: '#6E585B' }}>Already registered? </span>
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{ background: 'none', border: 'none', color: '#581825', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Sign in
              </button>
            </div>

            {/* Institutional Security Badges */}
            <footer style={{ display: 'flex', justifyContent: 'space-around', marginTop: '22px', paddingTop: '14px', borderTop: '1px solid #E0D8CE' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#6E585B' }}>
                <ShieldCheck size={18} color="#581825" />
                <span style={{ fontSize: '0.70rem', fontWeight: 600 }}>HIPAA Ready</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#6E585B' }}>
                <ShieldCheck size={18} color="#581825" />
                <span style={{ fontSize: '0.70rem', fontWeight: 600 }}>Encrypted EHR</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#6E585B' }}>
                <Shield size={18} color="#581825" />
                <span style={{ fontSize: '0.70rem', fontWeight: 600 }}>Protected Privacy</span>
              </div>
            </footer>
          </Card>
        </div>
      </div>
    </main>
  );
};

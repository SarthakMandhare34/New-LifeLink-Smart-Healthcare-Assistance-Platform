/**
 * ============================================================================
 * FRONTEND REACT CORE
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This is the root configuration of the React application.
 * It sets up the Routing (which URL goes to which page) and global Theme Contexts.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LifeLinkLogo } from '../../components/brand/LifeLinkLogo';
import { EntryThemeToggle } from '../../components/EntryThemeToggle';
import { trpc } from '../../lib/trpc';
import { Activity, Lock, Mail, Eye, EyeOff, HeartPulse, ShieldCheck, Shield } from 'lucide-react';
import { PATIENT_DASHBOARD_PATH } from '../patient/patientAuthRoutes';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
    <path fill="#FBBC05" d="M5.28 14.27a7.18 7.18 0 0 1 0-4.54V6.58H1.25a11.97 11.97 0 0 0 0 10.84l4.03-3.15z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
  </svg>
);

// Patient sign-in page component supporting email/password and Google OAuth
export const PatientLogin = () => {
  const navigate = useNavigate();                                                          // Programmatic page navigation hook
  const [searchParams] = useSearchParams();                                                // Access URL query params (e.g. authError from OAuth redirect)
  const trpcUtils = trpc.useUtils();                                                       // tRPC cache utilities for query refetching
  const loginMutation = trpc.patientAuth.login.useMutation();                              // Mutation hook for native patient authentication
  const providerQuery = trpc.auth.providers.useQuery(undefined, {                          // Query available social OAuth providers
    retry: 3,                                                                              // Retry up to 3 times
    staleTime: 10000,                                                                      // Cache provider availability for 10 seconds
  });
  const [email, setEmail] = useState('');                                                  // Controlled state for email input
  const [password, setPassword] = useState('');                                            // Controlled state for password input
  const [showPassword, setShowPassword] = useState(false);                                 // Toggle password visibility
  const [isLoading, setIsLoading] = useState(false);                                       // Form submission loading state
  const [error, setError] = useState('');                                                  // Error message display

  const authErrorParam = searchParams.get('authError');                                    // Check if arriving from failed OAuth redirect
  useEffect(() => {
    if (authErrorParam) {
      const errorMap: Record<string, string> = {
        invalid_provider_state: "The Google authorization session expired. Please try again.",
        provider_sign_in_cancelled: "Google sign-in was cancelled.",
        registration_required: "No patient account found with this Google email. Please sign up first using 'Sign up with Google'.",
        account_exists: "An account with this email already exists. Please sign in below.",
        provider_sign_in_failed: "Google authentication could not be completed. Please try again.",
      };
      setError(errorMap[authErrorParam] || "Google sign-in failed. Please try again.");
    }
  }, [authErrorParam]);

  // Submits native email and password credentials to backend tRPC API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();                                                                    // Prevent standard browser page reload
    setIsLoading(true);                                                                    // Show loading spinner
    setError('');                                                                          // Clear previous errors
    try {
      await loginMutation.mutateAsync({ email, password });                                // Send credentials to backend
      await trpcUtils.auth.me.refetch();                                                   // Re-query current user context
      navigate(PATIENT_DASHBOARD_PATH, { replace: true });                                 // Navigate to patient dashboard
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.'); // Display failure message
      setIsLoading(false);                                                                 // Reset loading state
    }
  };

  // Redirects user to Google OAuth authorization URL
  const handleGoogleClick = () => {
    const startUrl = providerQuery.data?.googleAuthorizationStartUrl || '/api/auth/google'; // Get configured Google auth endpoint
    window.location.assign(startUrl);                                                      // Navigate browser to Google sign-in
  };

  return (
    <main className="auth-page" aria-labelledby="patient-login-heading" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <header className="workspace-portal-header" aria-label="LifeLink portal header">
        <div className="workspace-portal-brand">
          <span className="workspace-portal-mark" aria-hidden="true">
            <LifeLinkLogo variant="symbol" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
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

      <div className="patient-auth-layout auth-split-layout" style={{ flex: 1, display: 'flex', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Ambient background clinical grid watermark */}
        <div className="ambient-ecg-decoration" style={{ position: 'absolute', bottom: '2%', left: '4%', opacity: 0.08, color: 'var(--color-primary)', pointerEvents: 'none' }}>
          <Activity size={340} strokeWidth={1} />
        </div>

        {/* Branding Panel (Left Column): Structured Institutional Showcase */}
        <div className="auth-branding-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'var(--spacing-6)', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Structured Logo Mount: Warm ivory plate ensuring crystal-clear contrast in both light and dark modes */}
            <div 
              className="auth-branding-logo-mount"
              style={{ 
                background: '#FAF5EC', 
                border: '1px solid #D4B07B', 
                borderRadius: '8px', 
                padding: '20px 32px', 
                boxShadow: '0 4px 18px rgba(183, 107, 0, 0.12)',
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
            
            {/* System Subtitle & Motto */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <span 
                style={{ 
                  background: 'var(--color-primary)', 
                  color: '#FFFFFF', 
                  fontSize: '0.74rem', 
                  fontWeight: 700, 
                  letterSpacing: '0.08em', 
                  textTransform: 'uppercase', 
                  padding: '4px 12px', 
                  borderRadius: '4px' 
                }}
              >
                Smart Healthcare & Wellness Platform
              </span>

              <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, margin: '6px 0 0', color: 'var(--color-text)', letterSpacing: '-0.01em', fontFamily: 'Outfit, sans-serif' }}>
                Care. Connect. Cure.
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5, maxWidth: '380px' }}>
                Your personal healthcare companion for managing medical history, instant AI health checks, and direct consultations with certified specialists.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container (Right Column): High-contrast glass card */}
        <div style={{ flex: 1.1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--spacing-4)', zIndex: 1 }}>
          <Card 
            className="clinical-glass-card" 
            style={{ 
              width: '100%', 
              maxWidth: '500px', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: 'clamp(24px, 4vw, 36px)',
              background: 'var(--color-surface-white)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {/* Form Card Header */}
            <header className="auth-card-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="auth-card-mobile-logo-wrap">
                <LifeLinkLogo className="lifelink-logo-auth auth-card-mobile-logo" />
              </div>

              <h1 id="patient-login-heading" className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text)', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
                Patient Sign In
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.90rem', margin: 0 }}>
                Enter your credentials to access your secure health portal
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
                  background: 'rgba(220, 38, 38, 0.08)',
                  border: '1px solid rgba(220, 38, 38, 0.25)',
                  borderRadius: '4px',
                  padding: '10px 14px',
                  fontSize: '0.88rem'
                }}
              >
                {error}
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleLogin} className="auth-form" style={{ display: 'grid', gap: '16px' }}>
              {/* Email Input Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="patient-email" style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-text)' }}>
                  Email
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                  <Input
                    id="patient-email"
                    type="email"
                    placeholder="Enter email"
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
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-background)',
                      color: 'var(--color-text)'
                    }}
                  />
                </div>
              </div>

              {/* Password Input Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="patient-password" style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-text)' }}>
                  Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                  <Input
                    id="patient-password"
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
                      borderRadius: '4px', 
                      minHeight: '44px', 
                      fontSize: '0.90rem',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-background)',
                      color: 'var(--color-text)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button: Amber Primary Button */}
              <Button
                type="submit"
                variant="primary"
                className="btn-primary"
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  minHeight: '44px', 
                  padding: '11px', 
                  fontSize: '0.96rem', 
                  fontWeight: 700, 
                  borderRadius: '4px', 
                  marginTop: '4px', 
                  cursor: 'pointer', 
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Signing In…' : 'Sign In'}
              </Button>
            </form>

            {/* Alternative authentication provider divider */}
            <div className="social-auth" style={{ marginTop: '20px' }}>
              <div className="social-auth-divider" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-muted)', fontSize: '0.80rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                <span>OR CONTINUE WITH</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
              </div>
              <div className="social-auth-actions" style={{ marginTop: '12px' }}>
                <Button
                  type="button"
                  variant="outline"
                  className="btn w-full"
                  onClick={handleGoogleClick}
                  title="Continue with Google"
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
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface-white)',
                    color: 'var(--color-text)'
                  }}
                >
                  <GoogleIcon /> Continue with Google
                </Button>
              </div>
            </div>

            {/* Auxiliary workspace navigation links */}
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Sign up
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

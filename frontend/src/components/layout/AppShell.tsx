import React, { useState } from 'react';                                                  // Core React and state hook
import { useEffect } from 'react';                                                              // React side-effect hook
import { Outlet, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';          // Router layout primitives and hooks
import { useTheme } from '../../context/ThemeContext';                                          // Application theme manager
import { useAuth } from '../../_core/hooks/useAuth';                                            // Client authentication state
import { LifeLinkLogo } from '../brand/LifeLinkLogo';                                           // Official brand logo component
import { usePatientRealtime } from '../../hooks/usePatientRealtime';                            // Real-time patient SSE subscription hook
import { trpc } from '../../lib/trpc';                                                          // Type-safe tRPC client bridge
import { registerPatientInactivityTimer } from '../../hooks/patientInactivity';                  // Auto-logout security timer hook
import { toast } from 'sonner';                                                                 // Toast notification library
import { RouteLoader } from '../ui/RouteLoader';                                                   // Liquid-glass suspense fallback loader
import {
  LayoutDashboard,
  FileHeart,
  Activity,
  MapPin,
  Calendar,
  Pill,
  FileText,
  TriangleAlert,
  User,
  Settings as SettingsIcon,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Bell,
  ChevronDown
} from 'lucide-react';                                                                          // Comprehensive application iconography

// Canonical navigation items rendered in the patient portal sidebar
const patientNavigation = [
  { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },                      // Dashboard landing
  { to: '/patient/assessment', label: 'AI Assessment', icon: Activity },                        // Symptom triage
  { to: '/patient/appointments', label: 'Appointments', icon: Calendar },                        // Visit booking & tracking
  { to: '/patient/health-passport', label: 'Health Passport', icon: FileHeart },                // Medical baseline EHR
  { to: '/patient/medicines', label: 'Medicines', icon: Pill },                                 // Medicine cabinet
  { to: '/patient/prescriptions', label: 'Prescriptions', icon: FileText },                     // Digital prescriptions
  { to: '/patient/specialists', label: 'Specialist Finder', icon: MapPin },                     // Mumbai map directory
  { to: '/patient/emergency', label: 'Emergency', icon: TriangleAlert },                        // SOS hotline & emergency contacts
  { to: '/patient/profile', label: 'Profile', icon: User },                                     // Patient demographics
  { to: '/patient/settings', label: 'Settings', icon: SettingsIcon },                           // Preferences
] as const;

export const PATIENT_SIDEBAR_BRAND_LABEL = 'LifeLink patient home';                             // Accessible logo label

// =========================================================================================
// PATIENT PORTAL APPLICATION SHELL (AppShell)
// Provides the global responsive layout frame for all patient workspaces:
// - Fixed/collapsible navigation sidebar with brand logo lockup
// - Top application header with mobile drawer trigger, theme toggler, and avatar pill
// - Background auto-logout inactivity monitor (5-minute privacy timeout)
// - Server-Sent Events (SSE) listener for instantaneous real-time UI updates
// =========================================================================================
export const AppShell = () => {
  const { user, loading, logout } = useAuth();                                                  // Auth session state
  const { theme, toggleTheme } = useTheme();                                                    // Light/Dark mode state
  const navigate = useNavigate();                                                               // Router navigation hook
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);                  // Mobile drawer open state
  const profileQuery = trpc.patientProfile.get.useQuery(undefined, { enabled: Boolean(user) }); // Fetch patient name and avatar
  usePatientRealtime(Boolean(user));                                                            // Subscribe to real-time SSE updates

  const closeMobileNavigation = () => setIsMobileNavigationOpen(false);                         // Close drawer helper

  // Keyboard accessibility: close mobile sidebar on Escape key
  useEffect(() => {
    if (!isMobileNavigationOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileNavigation();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileNavigationOpen]);

  // Privacy safeguard: 5-minute inactivity auto-logout monitor
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    let hasExpired = false;
    return registerPatientInactivityTimer(window, () => {
      if (hasExpired) return;
      hasExpired = true;
      void (async () => {
        try {
          await logout();                                                                       // Invalidate session on server
        } finally {
          toast.error('You have been signed out after five minutes of inactivity.');            // Show toast
          navigate('/login', { replace: true });                                                // Redirect to sign in
        }
      })();
    });
  }, [logout, navigate, user]);

  // Loading skeleton screen
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%' }}>
        <p className="caption" style={{ color: '#2D9D9C', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1rem', fontWeight: 600 }}>
          Loading your LifeLink workspace…
        </p>
      </div>
    );
  }

  // Redirect unauthenticated visitors to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User logout click handler
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    navigate('/login');
  };

  // Derive initials for avatar fallback
  const displayName = profileQuery.data?.name?.trim() || user?.name?.trim() || 'Patient';
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'P';

  return (
    <div className="app-layout">
      {/* Mobile backdrop dim overlay - dismisses drawer on outside tap */}
      {isMobileNavigationOpen && (
        <button
          type="button"
          className="app-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={closeMobileNavigation}
        />
      )}

      {/* Navigation Sidebar: Classic American Healthcare Portal Frame */}
      <aside
        id="patient-sidebar"
        className={`app-sidebar ${isMobileNavigationOpen ? 'is-open' : ''}`}
        aria-label="Patient navigation"
      >
        {/* Brand logo header: Institutional white mount with clear LifeLink lockup and EHR subtitle */}
        <div 
          className="app-sidebar-header" 
          style={{ 
            padding: '16px 18px', 
            borderBottom: '2px solid var(--color-border)', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'var(--color-surface-white)' 
          }}
        >
          <NavLink 
            to="/patient/dashboard" 
            onClick={closeMobileNavigation} 
            className="app-sidebar-brand-link" 
            aria-label={PATIENT_SIDEBAR_BRAND_LABEL} 
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* The official LifeLink logo is rendered on a crisp structured mount for maximum contrast and legibility */}
            <LifeLinkLogo className="lifelink-logo-sidebar lifelink-logo-sidebar-patient" />
          </NavLink>
        </div>

        {/* Navigation links: Classic American institutional list layout with 4px corners and active left-border indicator */}
        <nav 
          className="app-sidebar-nav" 
          style={{ 
            padding: '12px 10px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '3px', 
            flex: 1, 
            overflowY: 'auto' 
          }}
        >
          {patientNavigation.map(({ to, label, icon: Icon }) => (
            <NavLink 
              key={to} 
              to={to} 
              onClick={closeMobileNavigation} 
              className={({ isActive }) => `app-sidebar-nav-item ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '9px 12px',
                borderRadius: '4px',
                fontSize: '0.88rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#581825' : 'var(--color-text-muted)',
                background: isActive ? '#F5ECEE' : 'transparent',
                borderLeft: isActive ? '3px solid #581825' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s, border-color 0.15s'
              })}
            >
              <Icon size={18} /> <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Institutional logout action button at bottom of sidebar */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--color-border)' }}>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '9px 12px',
              borderRadius: '4px',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              fontSize: '0.88rem',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s, color 0.15s'
            }}
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport Content Area */}
      <main className="app-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top App Header: Classic Healthcare Network Utility Bar */}
        <header className="app-header">
          <div className="app-header-context">
            {/* Mobile hamburger menu toggle */}
            <button
              type="button"
              className="app-mobile-menu-button"
              aria-label={isMobileNavigationOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isMobileNavigationOpen}
              aria-controls="patient-sidebar"
              onClick={() => setIsMobileNavigationOpen((open) => !open)}
            >
              {isMobileNavigationOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile compact brand emblem */}
            <NavLink to="/patient/dashboard" className="app-mobile-brand" aria-label={PATIENT_SIDEBAR_BRAND_LABEL}>
              <LifeLinkLogo variant="symbol" className="app-mobile-brand-symbol" />
              <span>LifeLink</span>
            </NavLink>

            {/* Institutional System Status Indicator: Automatically responsive via .app-header-system-tag */}
            <div className="app-header-system-tag" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
              <span 
                className="badge" 
                style={{ 
                  background: '#581825', 
                  color: '#FAF7F2', 
                  fontSize: '0.70rem', 
                  fontWeight: 700, 
                  padding: '3px 8px', 
                  letterSpacing: '0.04em',
                  borderRadius: '4px'
                }}
              >
                LIFELINK EHR
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                Patient Ambulatory Portal
              </span>
            </div>
          </div>

          {/* Header controls: Theme toggle, notifications, and structured patient profile badge */}
          <div className="app-header-controls">
            {/* Theme switcher */}
            <button 
              className="icon-btn" 
              aria-label="Toggle theme" 
              onClick={toggleTheme} 
              title="Toggle theme"
              style={{ borderRadius: '4px', border: '1px solid var(--color-border)', width: '36px', height: '36px', display: 'grid', placeItems: 'center' }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Notification alert center */}
            <button 
              className="icon-btn" 
              aria-label="Notifications" 
              style={{ 
                position: 'relative', 
                background: 'var(--color-background)', 
                width: '36px', 
                height: '36px', 
                borderRadius: '4px', 
                display: 'grid', 
                placeItems: 'center', 
                border: '1px solid var(--color-border)', 
                cursor: 'pointer' 
              }}
            >
              <Bell size={18} color="var(--color-text-muted)" />
            </button>

            {/* User Profile Monogram Badge: Responsive chip with collapsible text metadata on small phones */}
            <button 
              type="button" 
              onClick={() => navigate('/patient/profile')} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'var(--color-surface-white)', 
                border: '1px solid var(--color-border)', 
                borderRadius: '4px', 
                padding: '4px 8px 4px 4px', 
                cursor: 'pointer' 
              }}
              aria-label="Open your profile"
            >
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '3px', 
                  background: '#581825', 
                  color: '#FAF7F2', 
                  fontWeight: 700, 
                  fontSize: '0.80rem', 
                  display: 'grid', 
                  placeItems: 'center' 
                }}
              >
                {profileQuery.data?.avatarUrl ? (
                  <img src={profileQuery.data.avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '3px', objectFit: 'cover' }} />
                ) : (
                  initials
                )}
              </div>
              <div className="app-header-user-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)' }}>{displayName}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Patient Record</span>
              </div>
              <ChevronDown size={14} color="var(--color-text-muted)" />
            </button>
          </div>
        </header>

        {/* Dynamic nested page content rendered via React Router */}
        <div className="app-content">
          {/* Nested Suspense Boundary: While child pages (e.g. Assessment, Medicines) are 
              being loaded on-demand over the network, RouteLoader displays a loading indicator. 
              The outer sidebar and header stay fully stationary and responsive. */}
          <React.Suspense fallback={<RouteLoader />}>
            <Outlet />
          </React.Suspense>
        </div>
      </main>
    </div>
  );
};

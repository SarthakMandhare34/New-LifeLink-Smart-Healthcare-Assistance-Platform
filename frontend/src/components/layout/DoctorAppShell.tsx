import React, { useState, useEffect } from "react";                                         // Core React hooks
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";                     // Navigation routing primitives
import {
  Calendar, LayoutDashboard, FileText, Users, Activity,
  Settings as SettingsIcon, User, LogOut, Sun, Moon, Bell,
  ChevronDown, Menu, X, Stethoscope
} from "lucide-react";                                                                          // Clinician workspace icon set
import { LifeLinkLogo } from "../brand/LifeLinkLogo";                                           // Official brand logo component
import { trpc } from "../../lib/trpc";                                                          // Type-safe tRPC client bridge
import { useDoctorRealtime } from "../../hooks/useDoctorRealtime";                              // Real-time doctor SSE subscription hook
import { useTheme } from "../../context/ThemeContext";                                          // Application theme manager
import { registerPatientInactivityTimer } from "../../hooks/patientInactivity";                  // Auto-logout security timer hook
import { toast } from "sonner";                                                                 // User feedback toast notifications
import { RouteLoader } from "../ui/RouteLoader";                                                   // Liquid-glass suspense fallback loader

// Doctor portal navigation items
const navItems = [
  { path: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },                    // Clinical dashboard
  { path: "/doctor/appointments", label: "Appointments", icon: Calendar },                      // Visit schedule management
  { path: "/doctor/patients", label: "Patients", icon: Users },                                 // Authorized patient roster
  { path: "/doctor/assessments", label: "Assessments", icon: Activity },                        // Patient AI assessment context
  { path: "/doctor/consultation", label: "Consultation", icon: Stethoscope },                    // Active consultation manager
  { path: "/doctor/prescriptions", label: "Prescriptions", icon: FileText },                   // Digital prescriptions suite
  { path: "/doctor/profile", label: "Profile", icon: User },                                     // Clinician details
  { path: "/doctor/settings", label: "Settings", icon: SettingsIcon },                           // Password & account settings
];

// =========================================================================================
// DOCTOR CLINICIAN APPLICATION SHELL (DoctorAppShell)
// Provides the dedicated workstation frame for medical specialists:
// - Navigation sidebar configured with clinician tools and brand identity
// - Header with theme toggling and doctor profile menu
// - 5-minute inactivity session expiration protection
// - Server-Sent Events (SSE) listener updating appointments and assessments in real time
// =========================================================================================
export const DoctorAppShell = () => {
  const navigate = useNavigate();                                                               // Router navigation hook
  const utils = trpc.useUtils();                                                                // Cache invalidator
  const { theme, toggleTheme } = useTheme();                                                    // Theme toggle hook
  const [isMobileOpen, setIsMobileOpen] = useState(false);                                      // Mobile drawer open state
  
  // Query active clinician session
  const session = trpc.doctorAuth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  
  // Clinician logout mutation
  const logoutMutation = trpc.doctorAuth.logout.useMutation({
    onSuccess: async () => {
      utils.doctorAuth.me.setData(undefined, null);                                             // Clear auth cache
      await utils.doctorWorkspace.invalidate();                                                 // Invalidate workspace cache
      navigate("/doctor/login", { replace: true });                                             // Redirect to doctor login
    },
  });

  useDoctorRealtime(Boolean(session.data));                                                     // Subscribe to real-time doctor events

  // Handle logout action
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logoutMutation.mutateAsync();
  };

  const closeMobile = () => setIsMobileOpen(false);                                             // Close mobile sidebar

  // Close mobile drawer on Escape key
  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  // Automatic inactivity auto-logout protection (5 minutes)
  useEffect(() => {
    if (!session.data || typeof window === 'undefined') return;

    let hasExpired = false;
    return registerPatientInactivityTimer(window, () => {
      if (hasExpired) return;
      hasExpired = true;
      void (async () => {
        try {
          await logoutMutation.mutateAsync();
        } finally {
          toast.error('You have been signed out after five minutes of inactivity.');
          navigate('/doctor/login', { replace: true });
        }
      })();
    });
  }, [session.data, logoutMutation, navigate]);

  // Loading skeleton screen
  if (session.isLoading) return (
    <main className="doctor-content">
      <div className="container"><p>Verifying clinician session…</p></div>
    </main>
  );

  // Redirect to login if doctor session is absent
  if (!session.data) return <Navigate to="/doctor/login" replace />;

  // Calculate doctor initials for avatar display
  const initials = (session.data?.displayName?.trim() || 'Doctor')
    .split(/\s+/)
    .filter(Boolean)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'D';

  return (
    <div className="app-layout">
      {/* Mobile backdrop dim overlay - dismisses navigation drawer on outside tap */}
      {isMobileOpen && (
        <button
          type="button"
          className="app-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={closeMobile}
        />
      )}

      {/* Navigation Sidebar: Classic American Provider Workstation Frame */}
      <aside
        id="doctor-sidebar"
        className={`app-sidebar ${isMobileOpen ? 'is-open' : ''}`}
        aria-label="Doctor navigation"
      >
        {/* Brand logo header: Institutional white mount with clear LifeLink lockup and Provider subtitle */}
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
            to="/doctor/dashboard" 
            onClick={closeMobile} 
            className="app-sidebar-brand-link" 
            aria-label="LifeLink clinician home" 
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* The official LifeLink logo is rendered on a crisp structured mount for maximum contrast and legibility */}
            <LifeLinkLogo className="lifelink-logo-sidebar lifelink-logo-sidebar-patient" />
          </NavLink>

          {/* Institutional clinician subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B45309' }}>
              Clinician Terminal • EHR
            </span>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#D97706' }} title="Provider Session Active" />
          </div>
        </div>

        {/* Doctor workspace navigation links: Classic institutional list layout with 4px corners and active left-border indicator */}
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
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={closeMobile}
              className={({ isActive }) => `app-sidebar-nav-item ${isActive ? "active" : ""}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '9px 12px',
                borderRadius: '4px',
                fontSize: '0.88rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#18181B' : '#52525B',
                background: isActive ? '#EBECEF' : 'transparent',
                borderLeft: isActive ? '3px solid #B45309' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s, border-color 0.15s'
              })}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Institutional logout action button */}
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
            title="Sign out of clinician workspace"
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
            {/* Mobile menu button */}
            <button
              type="button"
              className="app-mobile-menu-button"
              aria-label={isMobileOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isMobileOpen}
              aria-controls="doctor-sidebar"
              onClick={() => setIsMobileOpen((open) => !open)}
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile brand symbol */}
            <NavLink to="/doctor/dashboard" className="app-mobile-brand" aria-label="LifeLink clinician home">
              <LifeLinkLogo variant="symbol" className="app-mobile-brand-symbol" />
              <span>LifeLink</span>
            </NavLink>

            {/* Institutional Clinician Terminal Badge (Desktop/Tablet): Automatically responsive via .app-header-system-tag */}
            <div className="app-header-system-tag" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
              <span 
                className="badge" 
                style={{ 
                  background: '#27272A', 
                  color: '#FAFAFA', 
                  border: '1px solid #B45309',
                  fontSize: '0.70rem', 
                  fontWeight: 700, 
                  padding: '3px 8px', 
                  letterSpacing: '0.04em',
                  borderRadius: '4px'
                }}
              >
                CLINICAL WORKSTATION
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                Provider Terminal
              </span>
            </div>
          </div>

          {/* Header controls: Theme toggle, notifications, and structured clinician badge */}
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

            {/* Notification bell */}
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

            {/* Doctor Profile Monogram Badge: Responsive chip with collapsible text metadata on small phones */}
            <button
              type="button"
              onClick={() => navigate('/doctor/profile')}
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
                  background: '#27272A', 
                  border: '1px solid #B45309',
                  color: '#FAFAFA', 
                  fontWeight: 700, 
                  fontSize: '0.80rem', 
                  display: 'grid', 
                  placeItems: 'center' 
                }}
              >
                {initials}
              </div>
              <div className="app-header-user-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)' }}>{session.data?.displayName || 'Doctor'}</span>
                <span style={{ fontSize: '0.68rem', color: '#B45309', fontWeight: 600 }}>Active Clinician</span>
              </div>
              <ChevronDown size={14} color="var(--color-text-muted)" />
            </button>
          </div>
        </header>

        {/* Dynamic nested doctor view content */}
        <div className="app-content">
          {/* Nested Suspense Boundary: Displays RouteLoader while doctor feature pages 
              (Consultations, Prescriptions, Queue) load dynamically in the background, 
              preventing visual jumps in the clinical header or navigation bar. */}
          <React.Suspense fallback={<RouteLoader />}>
            <Outlet />
          </React.Suspense>
        </div>
      </main>
    </div>
  );
};

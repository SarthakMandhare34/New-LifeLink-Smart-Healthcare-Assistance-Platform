/**
 * ============================================================================
 * REUSABLE UI COMPONENTS (DESIGN SYSTEM)
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * Instead of rewriting the code for a button 50 times, we write it once here.
 * This ensures the entire application looks perfectly consistent (using Tailwind CSS)
 * and guarantees every component is accessible to screen readers for visually impaired users.
 */
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
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);                          // Notification panel open state
  const notificationRef = React.useRef<HTMLDivElement>(null);                                   // Notification container DOM ref
  
  // Query active clinician session
  const session = trpc.doctorAuth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  
  // Appointments query for clinician notification feed
  const appointmentsQuery = trpc.doctorWorkspace.appointments.list.useQuery(undefined, {
    enabled: Boolean(session.data),
    staleTime: 5000,
  });

  const appointments = appointmentsQuery.data || [];
  const pendingRequests = appointments.filter(a => a.status === 'Requested' || a.status === 'Pending');
  const unreadCount = pendingRequests.length;

  // Dismiss notification popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationOpen]);
  
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
            borderBottom: '1px solid var(--color-border)', 
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

          {/* Clinician subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--swiss-blue)' }}>
              Doctor Workstation
            </span>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '1px', background: 'var(--swiss-blue)' }} title="Provider Session Active" />
          </div>
        </div>

        {/* Doctor workspace navigation links: Swiss list layout with 2px corners and 3px blue active indicator */}
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
                borderRadius: '2px',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--swiss-blue)' : 'var(--swiss-gray-700)',
                background: isActive ? 'var(--swiss-blue-soft)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--swiss-blue)' : '3px solid transparent',
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
              borderRadius: '2px', 
              border: 'none', 
              background: 'transparent', 
              color: 'var(--swiss-gray-700)', 
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
          </div>

          {/* Header controls: Theme toggle, notifications, and structured clinician badge */}
          <div className="app-header-controls">
            {/* Theme switcher */}
            <button 
              className="icon-btn" 
              aria-label="Toggle theme" 
              onClick={toggleTheme} 
              title="Toggle theme"
              style={{ borderRadius: '2px', border: '1px solid var(--color-border)', width: '36px', height: '36px', display: 'grid', placeItems: 'center' }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Centralized Clinician Notification bell with popover */}
            <div ref={notificationRef} style={{ position: 'relative' }}>
              <button
                className="icon-btn"
                aria-label="Notifications"
                aria-haspopup="true"
                aria-expanded={isNotificationOpen}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                style={{ 
                  position: 'relative', 
                  background: isNotificationOpen ? 'var(--color-surface-subtle)' : 'transparent', 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '2px', 
                  display: 'grid', 
                  placeItems: 'center', 
                  border: '1px solid var(--color-border)', 
                  cursor: 'pointer' 
                }}
              >
                <Bell size={18} color={unreadCount > 0 ? "var(--color-doctor-primary)" : "var(--color-text-muted)"} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '1px',
                      background: 'var(--swiss-blue)',
                    }}
                  />
                )}
              </button>

              {isNotificationOpen && (
                <div
                  role="region"
                  aria-label="Clinician Notifications Panel"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: 'min(90vw, 360px)',
                    background: 'var(--color-surface-white)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '2px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1000,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--color-surface-subtle)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bell size={16} color="var(--color-doctor-primary)" />
                      <strong style={{ fontSize: '0.92rem', color: 'var(--color-text)' }}>Consultation Requests</strong>
                      {unreadCount > 0 && (
                        <span style={{
                          background: 'var(--color-doctor-primary)',
                          color: '#FFF',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          borderRadius: '2px',
                          padding: '1px 6px',
                        }}>
                          {unreadCount} pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {appointments.length === 0 ? (
                      <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--swiss-gray-600)' }}>
                        <Bell size={24} style={{ opacity: 0.3, margin: '0 auto 8px', display: 'block' }} />
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>No appointment notifications yet.</p>
                      </div>
                    ) : (
                      appointments.slice(0, 8).map((appt) => (
                        <div
                          key={appt.id}
                          onClick={() => {
                            setIsNotificationOpen(false);
                            navigate('/doctor/appointments');
                          }}
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid var(--color-border)',
                            background: (appt.status === 'Requested' || appt.status === 'Pending') ? 'var(--color-accent-muted)' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'flex-start',
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '2px',
                            background: appt.status === 'Requested' ? 'rgba(217, 119, 6, 0.12)' : 'var(--color-accent-muted)',
                            display: 'grid',
                            placeItems: 'center',
                            color: appt.status === 'Requested' ? '#B45309' : 'var(--color-doctor-primary)',
                            flexShrink: 0,
                          }}>
                            <Calendar size={16} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                              <strong style={{ fontSize: '0.85rem', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {appt.patient.name}
                              </strong>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '2px',
                                background: appt.status === 'Requested' ? 'rgba(217, 119, 6, 0.15)' : 'var(--color-accent-muted)',
                                color: appt.status === 'Requested' ? '#b45309' : 'var(--color-doctor-primary)',
                                border: '1px solid currentColor',
                              }}>
                                {appt.status}
                              </span>
                            </div>
                            <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                              {new Date(appt.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div style={{ padding: '8px 16px', background: 'var(--color-surface-subtle)', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsNotificationOpen(false);
                        navigate('/doctor/appointments');
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-doctor-primary)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      View all consultations &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Doctor Profile Monogram Badge */}
            <button
              type="button"
              onClick={() => navigate('/doctor/profile')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'var(--color-surface-white)', 
                border: '1px solid var(--color-border)', 
                borderRadius: '2px', 
                padding: '4px 8px 4px 4px', 
                cursor: 'pointer' 
              }}
              aria-label="Open your profile"
            >
              <div 
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '2px', 
                  background: 'var(--color-accent-muted)', 
                  border: '1px solid var(--color-doctor-primary)',
                  color: 'var(--color-doctor-primary)', 
                  fontWeight: 700, 
                  fontSize: '0.80rem', 
                  display: 'grid', 
                  placeItems: 'center',
                  overflow: 'hidden'
                }}
              >
                {initials}
              </div>
              <div className="app-header-user-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)' }}>{session.data?.displayName || 'Doctor'}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--color-doctor-primary)', fontWeight: 600 }}>Active Clinician</span>
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

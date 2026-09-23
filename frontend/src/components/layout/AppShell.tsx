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
import React, { useState, useEffect, useRef } from 'react';                                                  // Core React hooks
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

  // Centralized notifications state (designated panel for all notifications)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const notificationsQuery = trpc.patientNotification.list.useQuery(undefined, { enabled: Boolean(user) });
  const notifications = notificationsQuery.data ?? [];

  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('lifelink_read_notifications') || '[]');
    } catch {
      return [];
    }
  });

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const markAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    localStorage.setItem('lifelink_read_notifications', JSON.stringify(allIds));
  };

  const handleNotificationClick = (link: string, id: string) => {
    if (!readIds.includes(id)) {
      const next = [...readIds, id];
      setReadIds(next);
      localStorage.setItem('lifelink_read_notifications', JSON.stringify(next));
    }
    setIsNotificationOpen(false);
    navigate(link);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationOpen]);

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
        <p className="caption" style={{ color: 'var(--swiss-red)', fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600 }}>
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
            borderBottom: '1px solid var(--color-border)', 
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

        {/* Navigation links: Structured Nordic Clinical list layout with 8px corners and active left-border indicator */}
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
                borderRadius: '2px',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--swiss-red)' : 'var(--swiss-gray-700)',
                background: isActive ? 'var(--swiss-red-soft)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--swiss-red)' : '3px solid transparent',
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
          </div>

          {/* Header controls: Theme toggle, notifications, and structured patient profile badge */}
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

            {/* Notification alert center (designated panel for all notifications) */}
            <div ref={notificationRef} style={{ position: 'relative' }}>
              <button 
                className="icon-btn" 
                aria-label="Notifications" 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                title="Notifications"
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
                <Bell size={18} color={unreadCount > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'var(--swiss-red)',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    borderRadius: '2px',
                    padding: '1px 5px',
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--color-surface-white)',
                    lineHeight: 1,
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Centralized Notification Dropdown Panel */}
              {isNotificationOpen && (
                <div
                  role="region"
                  aria-label="Notifications Panel"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: 'min(90vw, 360px)',
                    background: 'var(--color-surface-white)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '2px',
                    boxShadow: 'none',
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
                      <Bell size={16} color="var(--color-primary)" />
                      <strong style={{ fontSize: '0.92rem', color: 'var(--color-text)' }}>Notifications</strong>
                      {unreadCount > 0 && (
                        <span style={{
                          background: 'var(--swiss-red)',
                          color: '#FFF',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          borderRadius: '2px',
                          padding: '1px 6px',
                        }}>
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--swiss-red)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--swiss-gray-600)' }}>
                        <Bell size={24} style={{ opacity: 0.3, margin: '0 auto 8px', display: 'block' }} />
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>No notifications yet.</p>
                        <span className="caption" style={{ display: 'block', marginTop: '4px', fontSize: '0.78rem' }}>
                          Appointment booking updates and prescription updates will appear here.
                        </span>
                      </div>
                    ) : (
                      notifications.map((item) => {
                        const isUnread = !readIds.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleNotificationClick(item.link, item.id)}
                            style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid var(--color-border)',
                              background: isUnread ? 'var(--color-primary-muted)' : 'transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              gap: '10px',
                              alignItems: 'flex-start',
                              transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-interactive)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = isUnread ? 'var(--color-primary-muted)' : 'transparent'}
                          >
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '2px',
                              background: item.category === 'PRESCRIPTION' ? 'var(--color-accent-muted)' : 'var(--color-surface-subtle)',
                              color: item.category === 'PRESCRIPTION' ? 'var(--color-accent)' : 'var(--color-text)',
                              display: 'grid',
                              placeItems: 'center',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}>
                              {item.category === 'PRESCRIPTION' ? <FileText size={16} /> : <Calendar size={16} />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                <strong style={{ fontSize: '0.84rem', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {item.title}
                                </strong>
                                {isUnread && (
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--swiss-red)', flexShrink: 0 }} />
                                )}
                              </div>
                              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.35 }}>
                                {item.description}
                              </p>
                              <span style={{ display: 'block', marginTop: '4px', fontSize: '0.72rem', color: 'var(--color-text-muted)', opacity: 0.8 }}>
                                {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Monogram Badge */}
            <button 
              type="button" 
              onClick={() => navigate('/patient/profile')} 
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
                  background: 'var(--swiss-red)', 
                  color: '#FFFFFF', 
                  fontWeight: 700, 
                  fontSize: '0.80rem', 
                  display: 'grid', 
                  placeItems: 'center',
                  overflow: 'hidden'
                }}
              >
                {profileQuery.data?.avatarUrl ? (
                  <img src={profileQuery.data.avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '2px', objectFit: 'cover' }} />
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

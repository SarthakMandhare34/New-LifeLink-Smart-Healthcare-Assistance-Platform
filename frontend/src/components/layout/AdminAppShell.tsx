/**
 * ============================================================================
 * ADMINISTRATOR APPLICATION SHELL (frontend/src/components/layout/AdminAppShell.tsx)
 * ============================================================================
 *
 * Dedicated layout framework for the LifeLink Administrator Dashboard:
 * - Simple, clean English labels and clear navigation
 * - Responsive desktop sidebar and mobile slide-in menu
 * - Focused administrative links: Dashboard, User Directory, Mumbai Specialists, Booking Audits
 * - Single sign-out action to clear administrator session
 * ============================================================================
 */
import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { LifeLinkLogo } from "../brand/LifeLinkLogo";
import { EntryThemeToggle } from "../EntryThemeToggle";
import { Button } from "../ui/Button";
import { RouteLoader } from "../ui/RouteLoader";
import { trpc } from "../../lib/trpc";
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  AlertTriangle,
  Stethoscope,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const adminNavItems = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    path: "/admin/users",
    label: "User Directory",
    icon: Users,
    badge: null,
  },
  {
    path: "/admin/doctors",
    label: "Mumbai Specialists",
    icon: Stethoscope,
    badge: "52",
  },
  {
    path: "/admin/audits",
    label: "Booking Audits",
    icon: AlertTriangle,
    badge: null,
  },
];

export const AdminAppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const utils = trpc.useUtils();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const adminQuery = trpc.admin.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: async () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("lifelink_admin_session");
      }
      utils.admin.me.setData(undefined, null);
      navigate("/admin/login", { replace: true });
    },
  });

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("lifelink_admin_session");
    }
    await logoutMutation.mutateAsync();
  };

  const closeMobile = () => setIsMobileOpen(false);

  // Close mobile drawer on Escape key
  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  // Close mobile drawer when path changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const adminUser = adminQuery.data;

  return (
    <div className="app-layout" style={{ minHeight: "100vh", display: "flex" }}>
      {/* Mobile background overlay */}
      {isMobileOpen && (
        <button
          type="button"
          className="app-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={closeMobile}
          style={{ display: "block" }}
        />
      )}

      {/* Navigation Sidebar */}
      <aside
        id="admin-sidebar"
        className={`app-sidebar ${isMobileOpen ? "is-open" : ""}`}
        aria-label="Admin navigation"
        style={{
          width: "260px",
          display: "flex",
          flexDirection: "column",
          background: "var(--color-surface-white)",
          borderRight: "1px solid var(--color-border)",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 60,
        }}
      >
        {/* Brand Header */}
        <div
          className="app-sidebar-header"
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--color-surface-white)",
          }}
        >
          <div
            onClick={() => navigate("/admin/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--border-radius-badge)",
                background: "var(--lifelink-blue)",
                display: "grid",
                placeItems: "center",
                color: "#FFFFFF",
                flexShrink: 0,
              }}
            >
              <ShieldAlert size={20} />
            </div>
            <div>
              <strong style={{ fontSize: "1rem", color: "var(--color-text)", display: "block" }}>
                LifeLink Admin
              </strong>
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "var(--lifelink-blue)",
                  fontWeight: 600,
                }}
              >
                Administrator Console
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav
          className="app-sidebar-nav"
          style={{
            padding: "14px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
            overflowY: "auto",
          }}
        >
          <span
            style={{
              padding: "8px 12px 4px",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Management
          </span>
          {adminNavItems.map(({ path, label, icon: Icon, badge }) => (
            <NavLink
              key={path}
              to={path}
              onClick={closeMobile}
              className={({ isActive }) =>
                `app-sidebar-nav-item ${isActive ? "active" : ""}`
              }
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 12px",
                borderRadius: "var(--border-radius-btn)",
                fontSize: "0.88rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "var(--lifelink-blue)" : "var(--color-text)",
                background: isActive ? "var(--lifelink-blue-soft)" : "transparent",
                borderLeft: isActive ? "3px solid var(--lifelink-blue)" : "3px solid transparent",
                textDecoration: "none",
                transition: "all var(--transition-fast)",
              })}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Icon size={18} />
                <span>{label}</span>
              </div>
              {badge && (
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: "10px",
                    background: "rgba(14, 165, 233, 0.12)",
                    color: "var(--lifelink-blue)",
                  }}
                >
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer: Admin Profile & Sign Out */}
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: "var(--color-surface-white)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--lifelink-blue)",
                color: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                fontSize: "0.82rem",
              }}
            >
              {(adminUser?.name || "Admin").slice(0, 1).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {adminUser?.name || "Administrator"}
              </div>
              <small
                style={{
                  fontSize: "0.72rem",
                  color: "var(--color-text-muted)",
                  display: "block",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {adminUser?.email || "admin@lifelink.com"}
              </small>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "6px 12px",
              fontSize: "0.82rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
            aria-label="Sign out of administrator console"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Container */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Sticky Header */}
        <header
          style={{
            height: "64px",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-surface-white)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 clamp(16px, 3vw, 32px)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="icon-btn"
              aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMobileOpen}
              aria-controls="admin-sidebar"
              onClick={() => setIsMobileOpen(open => !open)}
              style={{
                display: "grid",
                placeItems: "center",
                width: "36px",
                height: "36px",
                borderRadius: "var(--border-radius-btn)",
                border: "1px solid var(--color-border)",
                background: "transparent",
                color: "var(--color-text)",
                cursor: "pointer",
              }}
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Title / Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "var(--border-radius-badge)",
                  background: "#FFFFFF",
                  display: "grid",
                  placeItems: "center",
                  padding: "2px",
                }}
              >
                <LifeLinkLogo variant="symbol" style={{ width: "20px", height: "20px" }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--color-text)" }}>
                LifeLink
              </span>
              <span style={{ color: "var(--color-border)" }}>/</span>
              <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
                Administrator Dashboard
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <EntryThemeToggle />

            {/* Status indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                background: "var(--color-surface-ground)",
                borderRadius: "var(--border-radius-badge)",
                border: "1px solid var(--color-border)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--color-text)",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#10B981",
                }}
              />
              <span className="hidden sm:inline">Active</span>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              style={{
                padding: "6px 12px",
                fontSize: "0.82rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              aria-label="Sign out of administrator console"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </header>

        {/* Main Content with Suspense */}
        <main
          style={{
            flex: 1,
            padding: "clamp(20px, 3vw, 36px) clamp(16px, 4vw, 40px)",
            maxWidth: "1400px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <React.Suspense fallback={<RouteLoader />}>
            <Outlet />
          </React.Suspense>
        </main>
      </div>
    </div>
  );
};

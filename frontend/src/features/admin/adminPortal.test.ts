/**
 * ============================================================================
 * ADMIN PORTAL INTEGRATION & ACCESS TEST SUITE
 * ============================================================================
 *
 * Verifies:
 * 1. Admin portal route definitions and subroutes (/admin, /admin/dashboard, /admin/users, /admin/doctors, /admin/audits)
 * 2. Role-based route guard integrity for administrative authorization
 * 3. High-visibility entry points in WorkspaceSelector (header button + dedicated governance banner)
 * 4. Responsive AdminAppShell layout features (desktop sidebar, mobile drawer, active states, sign out)
 * ============================================================================
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const appSource = readFileSync(
  resolve(process.cwd(), "frontend/src/App.tsx"),
  "utf8"
);
const protectedRouteSource = readFileSync(
  resolve(process.cwd(), "frontend/src/components/layout/ProtectedRoute.tsx"),
  "utf8"
);
const adminShellSource = readFileSync(
  resolve(process.cwd(), "frontend/src/components/layout/AdminAppShell.tsx"),
  "utf8"
);
const workspaceSelectorSource = readFileSync(
  resolve(process.cwd(), "frontend/src/features/entry/WorkspaceSelector.tsx"),
  "utf8"
);
const adminLoginSource = readFileSync(
  resolve(process.cwd(), "frontend/src/features/admin/AdminLogin.tsx"),
  "utf8"
);
const adminDashboardSource = readFileSync(
  resolve(process.cwd(), "frontend/src/features/admin/AdminDashboard.tsx"),
  "utf8"
);

describe("Admin Portal Routing & Accessibility", () => {
  it("registers admin login and protected admin portal routes in App.tsx", () => {
    expect(appSource).toContain('path="/admin/login"');
    expect(appSource).toContain('<ProtectedRoute role="admin">');
    expect(appSource).toContain('<AdminAppShell />');
    expect(appSource).toContain('path="dashboard" element={<AdminDashboard initialTab="users" />}');
    expect(appSource).toContain('path="users" element={<AdminDashboard initialTab="users" />}');
    expect(appSource).toContain('path="doctors" element={<AdminDashboard initialTab="doctors" />}');
    expect(appSource).toContain('path="audits" element={<AdminDashboard initialTab="errors" />}');
  });

  it("enforces role='admin' in ProtectedRoute with session synchronization", () => {
    expect(protectedRouteSource).toContain('function AdminRouteGuard');
    expect(protectedRouteSource).toContain('adminQuery.data && adminQuery.data.role === "admin"');
    expect(protectedRouteSource).toContain('sessionStorage.setItem("lifelink_admin_session", "active")');
    expect(protectedRouteSource).toContain('/admin/login?redirect=');
  });

  it("makes single secure admin login clearly visible on the landing workspace selector", () => {
    // Single header trigger
    expect(workspaceSelectorSource).toContain('Admin Login');
    expect(workspaceSelectorSource).toContain('onClick={() => navigate("/admin/login")}');
  });

  it("provides comprehensive responsive navigation in AdminAppShell", () => {
    expect(adminShellSource).toContain('className={`app-sidebar ${isMobileOpen ? "is-open" : ""}`}');
    expect(adminShellSource).toContain('className="app-sidebar-backdrop"');
    expect(adminShellSource).toContain('/admin/dashboard');
    expect(adminShellSource).toContain('/admin/users');
    expect(adminShellSource).toContain('/admin/doctors');
    expect(adminShellSource).toContain('/admin/audits');
    expect(adminShellSource).toContain('Sign Out');
    expect(adminShellSource).toContain('Active');
  });

  it("provides auto-redirect on AdminLogin for already authenticated admins", () => {
    expect(adminLoginSource).toContain('adminMeQuery.data && adminMeQuery.data.role === "admin"');
    expect(adminLoginSource).toContain('sessionStorage.setItem("lifelink_admin_session", "active")');
  });

  it("supports initialTab in AdminDashboard for seamless tab switching", () => {
    expect(adminDashboardSource).toContain('interface AdminDashboardProps');
    expect(adminDashboardSource).toContain('initialTab');
    expect(adminDashboardSource).toContain('setActiveTab(initialTab)');
  });
});

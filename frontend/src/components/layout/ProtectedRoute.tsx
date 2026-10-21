/**
 * ============================================================================
 * GLOBAL ROLE-BASED ACCESS CONTROL (frontend/src/components/layout/ProtectedRoute.tsx)
 * ============================================================================
 *
 * Enforces strict client-side route guards for patient, clinician, and admin portals:
 * - Prevents unauthenticated access to protected dashboard and record views
 * - Enforces role-based isolation (patients cannot enter doctor/admin workspaces)
 * - Preserves requested destination paths for smooth post-login redirection
 *
 * SECURITY NOTE: Server-side JWT cookie verification (via tRPC) is the sole
 * source of truth for authentication. The sessionStorage flags are written
 * AFTER the server confirms a valid session and are never read to make access
 * decisions. This prevents:
 *   1. False-logout: users kicked out on page refresh when they still hold a
 *      valid HTTP-only cookie (sessionStorage is cleared on tab close).
 *   2. Bypass attacks: forging a sessionStorage flag granting no access because
 *      the server query still returns null for unauthenticated users.
 * ============================================================================
 */
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../_core/hooks/useAuth";
import { trpc } from "../../lib/trpc";
import { RouteLoader } from "../ui/RouteLoader";

export type ProtectedRole = "patient" | "doctor" | "admin";

interface ProtectedRouteProps {
  role: ProtectedRole;
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  role,
  children,
}) => {
  const location = useLocation();

  if (role === "patient") {
    return <PatientRouteGuard location={location}>{children}</PatientRouteGuard>;
  }

  if (role === "doctor") {
    return <DoctorRouteGuard location={location}>{children}</DoctorRouteGuard>;
  }

  if (role === "admin") {
    return <AdminRouteGuard location={location}>{children}</AdminRouteGuard>;
  }

  return <>{children ?? <Outlet />}</>;
};

/**
 * PatientRouteGuard
 *
 * The server-verified JWT cookie (validated by trpc.auth.me) is the only
 * access gate. sessionStorage is NOT checked for access decisions.
 */
function PatientRouteGuard({
  location,
  children,
}: {
  location: ReturnType<typeof useLocation>;
  children?: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <RouteLoader />;
  }

  if (!user) {
    const redirectUrl = `/login?redirect=${encodeURIComponent(
      location.pathname + location.search
    )}`;
    return <Navigate to={redirectUrl} replace />;
  }

  // Write the tab-session hint AFTER confirming server auth (pure UX optimization,
  // never read as a security gate).
  if (typeof window !== "undefined") {
    sessionStorage.setItem("lifelink_patient_session", "active");
  }

  return <>{children ?? <Outlet />}</>;
}

/**
 * DoctorRouteGuard
 *
 * The server-verified doctor JWT cookie (validated by trpc.doctorAuth.me) is
 * the sole access gate. No sessionStorage dependency.
 */
function DoctorRouteGuard({
  location,
  children,
}: {
  location: ReturnType<typeof useLocation>;
  children?: React.ReactNode;
}) {
  const doctorQuery = trpc.doctorAuth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (doctorQuery.isLoading) {
    return <RouteLoader />;
  }

  if (!doctorQuery.data) {
    const redirectUrl = `/doctor/login?redirect=${encodeURIComponent(
      location.pathname + location.search
    )}`;
    return <Navigate to={redirectUrl} replace />;
  }

  if (typeof window !== "undefined") {
    sessionStorage.setItem("lifelink_doctor_session", "active");
  }

  return <>{children ?? <Outlet />}</>;
}

/**
 * AdminRouteGuard
 *
 * The server-verified admin JWT cookie (validated by trpc.admin.me) is the
 * sole access gate. No sessionStorage dependency.
 */
function AdminRouteGuard({
  location,
  children,
}: {
  location: ReturnType<typeof useLocation>;
  children?: React.ReactNode;
}) {
  const adminQuery = trpc.admin.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (adminQuery.isLoading) {
    return <RouteLoader />;
  }

  const isAdmin = Boolean(adminQuery.data && adminQuery.data.role === "admin");

  if (!isAdmin) {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("lifelink_admin_session");
    }
    const redirectUrl = `/admin/login?redirect=${encodeURIComponent(
      location.pathname + location.search
    )}`;
    return <Navigate to={redirectUrl} replace />;
  }

  if (typeof window !== "undefined") {
    sessionStorage.setItem("lifelink_admin_session", "active");
  }

  return <>{children ?? <Outlet />}</>;
}

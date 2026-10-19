/**
 * ============================================================================
 * GLOBAL ROLE-BASED ACCESS CONTROL (frontend/src/components/layout/ProtectedRoute.tsx)
 * ============================================================================
 *
 * Enforces strict client-side route guards for patient, clinician, and admin portals:
 * - Prevents unauthenticated access to protected dashboard and record views
 * - Enforces role-based isolation (patients cannot enter doctor/admin workspaces)
 * - Preserves requested destination paths for smooth post-login redirection
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

function PatientRouteGuard({
  location,
  children,
}: {
  location: ReturnType<typeof useLocation>;
  children?: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const hasPatientSession =
    typeof window !== "undefined" &&
    sessionStorage.getItem("lifelink_patient_session") === "active";

  if (loading) {
    return <RouteLoader />;
  }

  if (!user || !hasPatientSession) {
    const redirectUrl = `/login?redirect=${encodeURIComponent(
      location.pathname + location.search
    )}`;
    return <Navigate to={redirectUrl} replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

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

  const hasDoctorSession =
    typeof window !== "undefined" &&
    sessionStorage.getItem("lifelink_doctor_session") === "active";

  if (doctorQuery.isLoading) {
    return <RouteLoader />;
  }

  if (!doctorQuery.data || !hasDoctorSession) {
    const redirectUrl = `/doctor/login?redirect=${encodeURIComponent(
      location.pathname + location.search
    )}`;
    return <Navigate to={redirectUrl} replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

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

  const hasAdminSession =
    typeof window !== "undefined" &&
    sessionStorage.getItem("lifelink_admin_session") === "active";

  if (adminQuery.isLoading || (hasAdminSession && adminQuery.isFetching && !adminQuery.data)) {
    return <RouteLoader />;
  }

  const isAdmin = adminQuery.data && adminQuery.data.role === "admin";

  if (!isAdmin) {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("lifelink_admin_session");
    }
    const redirectUrl = `/admin/login?redirect=${encodeURIComponent(
      location.pathname + location.search
    )}`;
    return <Navigate to={redirectUrl} replace />;
  }

  // Synchronize active admin session marker
  if (typeof window !== "undefined") {
    sessionStorage.setItem("lifelink_admin_session", "active");
  }

  return <>{children ?? <Outlet />}</>;
}

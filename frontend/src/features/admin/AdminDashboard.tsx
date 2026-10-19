/**
 * ============================================================================
 * ADMINISTRATOR DASHBOARD (frontend/src/features/admin/AdminDashboard.tsx)
 * ============================================================================
 *
 * Single unified management center for authorized administrators:
 * 1. Platform Metrics: Real-time counts of users, doctors, appointments, and prescriptions
 * 2. User Directory: View registered users and remove inactive or invalid accounts
 * 3. Mumbai Specialist Registry: Complete list of all 52 specialists across Mumbai transit lines
 * 4. Booking Audit Records: View and clear appointment scheduling conflicts and errors
 *
 * All text uses simple, standard English words for clarity and ease of use.
 * ============================================================================
 */
import React, { useState } from "react";
import { trpc } from "../../lib/trpc";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  Users,
  Stethoscope,
  Calendar,
  FileText,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Train,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

interface AdminDashboardProps {
  initialTab?: "users" | "doctors" | "errors";
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialTab = "users",
}) => {
  const utils = trpc.useUtils();
  const [activeTab, setActiveTab] = useState<"users" | "doctors" | "errors">(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);

  // Queries
  const metricsQuery = trpc.admin.metrics.useQuery(undefined, {
    staleTime: 10_000,
  });
  const usersQuery = trpc.admin.users.list.useQuery(undefined, {
    staleTime: 10_000,
  });
  const doctorsQuery = trpc.admin.doctors.list.useQuery(undefined, {
    staleTime: 60_000,
  });
  const errorsQuery = trpc.admin.bookingErrors.list.useQuery(undefined, {
    staleTime: 5_000,
  });

  // Mutations
  const deleteUserMutation = trpc.admin.users.delete.useMutation({
    onSuccess: () => {
      toast.success("User account successfully deleted.");
      setUserToDelete(null);
      utils.admin.users.list.invalidate();
      utils.admin.metrics.invalidate();
    },
    onError: err => {
      toast.error(err.message || "Failed to delete user account.");
    },
  });

  const clearErrorsMutation = trpc.admin.bookingErrors.clear.useMutation({
    onSuccess: () => {
      toast.success("Booking audit records cleared.");
      utils.admin.bookingErrors.list.invalidate();
      utils.admin.metrics.invalidate();
    },
    onError: err => {
      toast.error(err.message || "Failed to clear audit records.");
    },
  });

  const metrics = metricsQuery.data;
  const rawUsers = usersQuery.data ?? [];
  const rawDoctors = doctorsQuery.data ?? [];
  const rawErrors = errorsQuery.data ?? [];

  // Filter users
  const filteredUsers = rawUsers.filter(u => {
    const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
    const nameMatch = (u.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (u.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && (nameMatch || emailMatch);
  });

  // Filter doctors
  const filteredDoctors = rawDoctors.filter(d => {
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.station.toLowerCase().includes(q) ||
      d.railLine.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {/* Top Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: "var(--color-text)" }}>
            Administrator Dashboard
          </h1>
          <p style={{ margin: "4px 0 0", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            Manage platform metrics, user directory, Mumbai specialist registry, and booking audit records.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            utils.admin.invalidate();
            toast.info("Refreshed dashboard data.");
          }}
          style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}
        >
          <RefreshCw size={16} />
          <span>Refresh Data</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        <MetricCard
          title="Total Users"
          value={metrics?.totalUsers ?? "-"}
          subtitle="All registered accounts"
          icon={<Users size={22} color="var(--lifelink-blue)" />}
        />
        <MetricCard
          title="Patients"
          value={metrics?.patientCount ?? "-"}
          subtitle="Registered patient accounts"
          icon={<Users size={22} color="#10B981" />}
        />
        <MetricCard
          title="Specialists"
          value={metrics?.totalDoctorsDirectory ?? 52}
          subtitle="Mumbai doctor directory"
          icon={<Stethoscope size={22} color="#0EA5E9" />}
        />
        <MetricCard
          title="Appointments"
          value={metrics?.appointmentCount ?? "-"}
          subtitle="Total visits booked"
          icon={<Calendar size={22} color="#8B5CF6" />}
        />
        <MetricCard
          title="Prescriptions"
          value={metrics?.prescriptionCount ?? "-"}
          subtitle="Digital prescriptions issued"
          icon={<FileText size={22} color="#F59E0B" />}
        />
        <MetricCard
          title="Booking Errors"
          value={metrics?.bookingErrorCount ?? 0}
          subtitle="Scheduling conflict logs"
          icon={<AlertTriangle size={22} color="var(--lifelink-red)" />}
        />
      </div>

      {/* Main Single Tabbed Management Panel */}
      <Card
        variant="solid"
        style={{
          padding: "24px",
          borderRadius: "var(--border-radius-card)",
          border: "1px solid var(--color-border)",
          background: "var(--color-surface-white)",
        }}
      >
        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--color-border)",
            paddingBottom: "16px",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <TabButton
              active={activeTab === "users"}
              onClick={() => setActiveTab("users")}
              icon={<Users size={16} />}
              label={`User Directory (${rawUsers.length})`}
            />
            <TabButton
              active={activeTab === "doctors"}
              onClick={() => setActiveTab("doctors")}
              icon={<Stethoscope size={16} />}
              label={`Mumbai Specialists (${rawDoctors.length})`}
            />
            <TabButton
              active={activeTab === "errors"}
              onClick={() => setActiveTab("errors")}
              icon={<AlertTriangle size={16} />}
              label={`Booking Audits (${rawErrors.length})`}
            />
          </div>

          {/* Search Box */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                }}
              />
              <input
                type="text"
                placeholder={
                  activeTab === "users"
                    ? "Search users by name or email…"
                    : activeTab === "doctors"
                    ? "Search doctors or stations…"
                    : "Search error records…"
                }
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  padding: "6px 12px 6px 32px",
                  borderRadius: "var(--border-radius-btn)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface-ground)",
                  color: "var(--color-text)",
                  fontSize: "0.85rem",
                  width: "240px",
                }}
              />
            </div>

            {activeTab === "users" && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Filter size={16} color="var(--color-text-muted)" />
                <select
                  value={userRoleFilter}
                  onChange={e => setUserRoleFilter(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "var(--border-radius-btn)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface-ground)",
                    color: "var(--color-text)",
                    fontSize: "0.85rem",
                  }}
                  aria-label="Filter users by role"
                >
                  <option value="all">All Roles</option>
                  <option value="patient">Patients</option>
                  <option value="doctor">Doctors</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Tab 1: User Directory */}
        {activeTab === "users" && (
          <div>
            {filteredUsers.length === 0 ? (
              <EmptyState message="No users match the search criteria." />
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left" }}>
                      <th style={{ padding: "10px 12px", color: "var(--color-text-muted)", fontWeight: 600 }}>User</th>
                      <th style={{ padding: "10px 12px", color: "var(--color-text-muted)", fontWeight: 600 }}>Email</th>
                      <th style={{ padding: "10px 12px", color: "var(--color-text-muted)", fontWeight: 600 }}>Role</th>
                      <th style={{ padding: "10px 12px", color: "var(--color-text-muted)", fontWeight: 600 }}>Registered</th>
                      <th style={{ padding: "10px 12px", color: "var(--color-text-muted)", fontWeight: 600, textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr
                        key={user.id}
                        style={{
                          borderBottom: "1px solid var(--color-border)",
                          transition: "background 0.15s ease",
                        }}
                      >
                        <td style={{ padding: "12px", fontWeight: 600, color: "var(--color-text)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: "var(--color-surface-subtle)",
                                border: "1px solid var(--color-border)",
                                display: "grid",
                                placeItems: "center",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                              }}
                            >
                              {(user.name || "U").slice(0, 1).toUpperCase()}
                            </div>
                            <span>{user.name || "Unnamed User"}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px", color: "var(--color-text-muted)" }}>
                          {user.email || "No email"}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <Badge
                            variant={
                              user.role === "admin"
                                ? "primary"
                                : user.role === "doctor"
                                ? "success"
                                : "neutral"
                            }
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td style={{ padding: "12px", color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                        </td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          {user.role === "admin" ? (
                            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                              Primary Admin
                            </span>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => setUserToDelete({ id: user.id, name: user.name || "this user" })}
                              style={{
                                padding: "4px 8px",
                                fontSize: "0.75rem",
                                color: "var(--lifelink-red)",
                                borderColor: "var(--lifelink-red-border)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Mumbai Specialists Registry */}
        {activeTab === "doctors" && (
          <div>
            {filteredDoctors.length === 0 ? (
              <EmptyState message="No Mumbai doctors match the search criteria." />
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left" }}>
                      <th style={{ padding: "10px 12px", color: "var(--color-text-muted)", fontWeight: 600 }}>Doctor Name</th>
                      <th style={{ padding: "10px 12px", color: "var(--color-text-muted)", fontWeight: 600 }}>Specialty</th>
                      <th style={{ padding: "10px 12px", color: "var(--color-text-muted)", fontWeight: 600 }}>Station</th>
                      <th style={{ padding: "10px 12px", color: "var(--color-text-muted)", fontWeight: 600 }}>Railway Line</th>
                      <th style={{ padding: "10px 12px", color: "var(--color-text-muted)", fontWeight: 600 }}>Work Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.map(doctor => (
                      <tr key={doctor.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <td style={{ padding: "12px", fontWeight: 600, color: "var(--color-text)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Stethoscope size={16} color="var(--lifelink-blue)" />
                            <span>{doctor.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px", color: "var(--color-text)" }}>
                          <Badge variant="neutral">{doctor.specialty}</Badge>
                        </td>
                        <td style={{ padding: "12px", color: "var(--color-text-muted)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Train size={14} color="var(--color-text-muted)" />
                            <span>{doctor.station}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px", color: "var(--color-text-muted)" }}>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              background:
                                doctor.railLine === "Western"
                                  ? "rgba(14, 165, 233, 0.12)"
                                  : doctor.railLine === "Central"
                                  ? "rgba(239, 68, 68, 0.12)"
                                  : "rgba(16, 185, 129, 0.12)",
                              color:
                                doctor.railLine === "Western"
                                  ? "#0284C7"
                                  : doctor.railLine === "Central"
                                  ? "#DC2626"
                                  : "#059669",
                            }}
                          >
                            {doctor.railLine} Line
                          </span>
                        </td>
                        <td style={{ padding: "12px", color: "var(--color-text-muted)", fontFamily: "monospace", fontSize: "0.82rem" }}>
                          {doctor.workEmail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Booking Audit Records */}
        {activeTab === "errors" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                This record tracks scheduling conflicts and invalid appointment requests to keep booking synchronized.
              </p>
              {rawErrors.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => clearErrorsMutation.mutate()}
                  disabled={clearErrorsMutation.isPending}
                  style={{
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--lifelink-red)",
                    borderColor: "var(--lifelink-red-border)",
                  }}
                >
                  <Trash2 size={14} />
                  <span>Clear Audit Records</span>
                </Button>
              )}
            </div>

            {rawErrors.length === 0 ? (
              <div
                style={{
                  padding: "48px 24px",
                  textAlign: "center",
                  background: "var(--color-surface-ground)",
                  borderRadius: "var(--border-radius-card)",
                  border: "1px dashed var(--color-border)",
                }}
              >
                <CheckCircle2 size={36} color="#10B981" style={{ margin: "0 auto 12px" }} />
                <h3 style={{ margin: "0 0 6px", fontSize: "1.05rem", color: "var(--color-text)" }}>
                  No Scheduling Conflicts Found
                </h3>
                <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                  All appointment bookings and clinician schedules are synchronized with zero conflicts.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left" }}>
                      <th style={{ padding: "10px 12px", color: "var(--color-text-muted)", fontWeight: 600 }}>Recorded Time</th>
                      <th style={{ padding: "10px 12px", color: "var(--color-text-muted)", fontWeight: 600 }}>Doctor ID</th>
                      <th style={{ padding: "10px 12px", color: "var(--color-text-muted)", fontWeight: 600 }}>Attempted Time</th>
                      <th style={{ padding: "10px 12px", color: "var(--color-text-muted)", fontWeight: 600 }}>Error Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawErrors.map(errItem => (
                      <tr key={errItem.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <td style={{ padding: "12px", color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Clock size={13} />
                            <span>{new Date(errItem.timestamp).toLocaleString()}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px", fontWeight: 600, color: "var(--color-text)" }}>
                          {errItem.doctorId || "All Specialists"}
                        </td>
                        <td style={{ padding: "12px", color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
                          {errItem.attemptedAt ? new Date(errItem.attemptedAt).toLocaleString() : "Not specified"}
                        </td>
                        <td style={{ padding: "12px", color: "var(--lifelink-red)", fontSize: "0.82rem" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ fontWeight: 600 }}>{errItem.errorType}</span>
                            <span>{errItem.errorMessage}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Delete User Modal */}
      {userToDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "grid",
            placeItems: "center",
            zIndex: 100,
            padding: "16px",
          }}
        >
          <Card
            variant="solid"
            style={{
              maxWidth: "420px",
              width: "100%",
              padding: "24px",
              borderRadius: "var(--border-radius-card)",
              background: "var(--color-surface-white)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--lifelink-red-soft)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--lifelink-red)",
                }}
              >
                <Trash2 size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--color-text)" }}>
                  Confirm Delete User
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                  This action permanently removes the user account.
                </p>
              </div>
            </div>

            <p style={{ fontSize: "0.9rem", color: "var(--color-text)", margin: "0 0 20px" }}>
              Are you sure you want to delete the account for <strong>{userToDelete.name}</strong>?
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button
                variant="outline"
                onClick={() => setUserToDelete(null)}
                disabled={deleteUserMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => deleteUserMutation.mutate({ id: userToDelete.id })}
                disabled={deleteUserMutation.isPending}
                style={{
                  background: "var(--lifelink-red)",
                  borderColor: "var(--lifelink-red)",
                  color: "#FFFFFF",
                }}
              >
                {deleteUserMutation.isPending ? "Deleting…" : "Delete Account"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// Reusable Metric Card
function MetricCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Card
      variant="solid"
      style={{
        padding: "16px 20px",
        borderRadius: "var(--border-radius-card)",
        border: "1px solid var(--color-border)",
        background: "var(--color-surface-white)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-text-muted)" }}>
          {title}
        </span>
        {icon}
      </div>
      <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text)" }}>
        {value}
      </div>
      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
        {subtitle}
      </span>
    </Card>
  );
}

// Reusable Tab Button
function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 14px",
        borderRadius: "var(--border-radius-btn)",
        border: "none",
        background: active ? "var(--lifelink-blue)" : "transparent",
        color: active ? "#FFFFFF" : "var(--color-text-muted)",
        fontSize: "0.85rem",
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
        transition: "all var(--transition-fast)",
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Reusable Empty State
function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        color: "var(--color-text-muted)",
        fontSize: "0.9rem",
      }}
    >
      {message}
    </div>
  );
}

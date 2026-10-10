/**
 * ============================================================================
 * PATIENT PORTAL UI
 * ============================================================================
 *
 * WHY THIS FILE IS SPECIAL:
 * This manages the everyday user interfaces for patients (Dashboard, Health Passport, Medicines).
 * It uses modern React hooks to keep data perfectly synchronized and responsive.
 */
import React, { useEffect, useState } from "react"; // Core React component hooks
import { Card } from "../../../components/ui/Card"; // Glassmorphic UI container
import { Input } from "../../../components/ui/Input"; // Styled input field
import { Button } from "../../../components/ui/Button"; // Styled button
import { Badge } from "../../../components/ui/Badge"; // Status badge
import { User, CheckCircle2, Camera, Loader2, Edit2, X } from "lucide-react"; // User identity and camera iconography
import { trpc } from "../../../lib/trpc"; // Type-safe tRPC client bridge

// =========================================================================================
// PATIENT PROFILE & AVATAR MANAGEMENT
// Allows authenticated patients to manage their personal demographic info and profile image:
// - Updates first name, last name, and contact telephone number
// - Direct avatar photo upload with client-side mime/size validation and secure server storage
// =========================================================================================
export const Profile = () => {
  const trpcUtils = trpc.useUtils(); // Client cache invalidator
  const profileQuery = trpc.patientProfile.get.useQuery(); // Retrieves patient profile
  const updateMutation = trpc.patientProfile.update.useMutation(); // Updates name & phone on server

  // Local form & upload state
  const [isEditing, setIsEditing] = useState(false); // Edit mode toggle
  const [isSaving, setIsSaving] = useState(false); // Demographic save in-flight flag
  const [error, setError] = useState(""); // Demographic error banner
  const [success, setSuccess] = useState(false); // Demographic success banner
  const [first, setFirst] = useState(""); // First name input
  const [last, setLast] = useState(""); // Last name input
  const [phone, setPhone] = useState(""); // Telephone input
  const [photoError, setPhotoError] = useState(""); // Avatar upload error banner
  const [isPhotoSaving, setIsPhotoSaving] = useState(false); // Avatar upload in-flight flag

  // Populate form inputs when profile query loads
  useEffect(() => {
    if (!profileQuery.data) return;
    const nameParts = profileQuery.data.name.trim().split(/\s+/); // Split full name into first and last
    setFirst(nameParts.shift() || "");
    setLast(nameParts.join(" "));
    setPhone(profileQuery.data.phone || "");
  }, [profileQuery.data]);

  // Loading skeleton placeholder
  if (profileQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="caption">Loading patient profile…</p>
      </div>
    );
  }
  if (!profileQuery.data) return null;
  const profile = profileQuery.data;
  const profileInitial = profile.name.trim().charAt(0).toUpperCase() || "P"; // Fallback avatar initial

  // Profile photo file selection and binary upload handler
  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const photo = event.target.files?.[0]; // Selected image file
    event.target.value = ""; // Reset input element value
    if (!photo) return;

    // Validate MIME type
    if (!["image/jpeg", "image/png", "image/webp"].includes(photo.type)) {
      setPhotoError("Use a JPG, PNG, or WebP image.");
      return;
    }
    // Validate file size limit (10 MB)
    if (photo.size > 10 * 1024 * 1024) {
      setPhotoError("Choose an image smaller than 10 MB.");
      return;
    }

    setPhotoError("");
    setIsPhotoSaving(true); // Show upload spinner
    try {
      const response = await fetch("/api/patient/profile-photo", {
        // Stream photo binary directly
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": photo.type,
          "X-LifeLink-Request": "profile-photo",
        },
        body: photo,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(
          typeof payload.error === "string"
            ? payload.error
            : "Your photo could not be saved."
        );
      // Invalidate queries to display newly uploaded avatar across header and dashboard
      await Promise.all([
        trpcUtils.patientProfile.get.invalidate(),
        trpcUtils.patientDashboard.summary.invalidate(),
      ]);
    } catch (uploadError) {
      setPhotoError(
        uploadError instanceof Error
          ? uploadError.message
          : "Your photo could not be saved."
      );
    } finally {
      setIsPhotoSaving(false); // Reset spinner
    }
  };

  // Demographic info form save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent native form submit
    if (!first.trim() || !last.trim()) {
      setError("First and last name are required.");
      return;
    }
    setError("");
    setIsSaving(true);
    setSuccess(false);

    try {
      await updateMutation.mutateAsync({
        name: `${first.trim()} ${last.trim()}`, // Recombine name
        phone: phone.trim(),
      });
      await trpcUtils.patientProfile.get.invalidate(); // Invalidate profile query
      await trpcUtils.patientDashboard.summary.invalidate(); // Invalidate dashboard query
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Auto-hide success message after 3 seconds
    } catch (err) {
      setError("Failed to update patient profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError("");
    if (profileQuery.data) {
      const nameParts = profileQuery.data.name.trim().split(/\s+/);
      setFirst(nameParts.shift() || "");
      setLast(nameParts.join(" "));
      setPhone(profileQuery.data.phone || "");
    }
  };

  return (
    <div
      className="container patient-profile-page"
      style={{
        maxWidth: "840px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "36px",
      }}
    >
      {/* Profile Header */}
      <header className="patient-profile-heading flex items-center gap-3">
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "var(--border-radius-sm)",
            background: "var(--color-primary-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <User size={26} style={{ color: "var(--color-primary)" }} />
        </div>
        <div>
          <h1 style={{ margin: 0 }}>Patient Profile</h1>
          <p className="caption" style={{ margin: "6px 0 0" }}>
            Manage identity information and contact preferences.
          </p>
        </div>
      </header>

      {/* Main Profile Card */}
      <Card
        className="patient-profile-card"
        style={{
          padding: "clamp(28px, 4vw, 38px)",
          borderRadius: "var(--border-radius-card)",
        }}
      >
        {/* Avatar and Identity banner */}
        <div
          className="patient-profile-identity"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "32px",
            flexWrap: "wrap",
          }}
        >
          <label
            className="profile-photo-picker"
            title="Click to choose a new photo"
          >
            <input
              id="profile-photo-input"
              className="profile-photo-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              disabled={isPhotoSaving}
              aria-label="Upload profile photo"
            />
            <span className="patient-profile-avatar">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" />
              ) : (
                <span>{profileInitial}</span>
              )}
            </span>
            <span className="profile-photo-edit" aria-hidden="true">
              {isPhotoSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Camera size={14} />
              )}
            </span>
          </label>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <h2 style={{ margin: 0, fontSize: "var(--text-h2)" }}>
                    {profile.name}
                  </h2>
                  {!isEditing && (
                    <button
                      id="profile-name-edit-btn"
                      type="button"
                      onClick={() => setIsEditing(true)}
                      title="Edit profile"
                      style={{
                        background: "none",
                        border: "none",
                        padding: "2px 4px",
                        cursor: "pointer",
                        color: "var(--color-primary)",
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: "var(--border-radius-badge)",
                      }}
                      aria-label="Edit Profile"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge status="success">
                    <CheckCircle2 size={12} /> Patient Account
                  </Badge>
                  <span className="caption">Private profile</span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                {!isEditing ? (
                  <Button
                    id="profile-header-edit-btn"
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(true);
                      setError("");
                      setSuccess(false);
                    }}
                    style={{
                      borderRadius: "var(--border-radius-btn)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: 600,
                    }}
                  >
                    <Edit2 size={14} /> Edit Profile
                  </Button>
                ) : (
                  <Button
                    id="profile-header-cancel-btn"
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    style={{
                      borderRadius: "var(--border-radius-btn)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <X size={14} /> Cancel
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("profile-photo-input")?.click()
                  }
                  disabled={isPhotoSaving}
                  style={{ borderRadius: "var(--border-radius-btn)" }}
                >
                  <Camera size={14} />{" "}
                  {isPhotoSaving ? "Saving…" : "Select Photo"}
                </Button>
              </div>
            </div>
            {isPhotoSaving && (
              <p
                className="caption"
                style={{
                  margin: "8px 0 0",
                  color: "var(--color-primary)",
                  fontWeight: 600,
                }}
              >
                Saving your profile photo…
              </p>
            )}
          </div>
        </div>

        {/* Error Alerts */}
        {photoError && (
          <div className="alert-panel" style={{ marginBottom: "20px" }}>
            <span style={{ fontSize: "var(--text-caption)" }}>
              {photoError}
            </span>
          </div>
        )}
        {error && (
          <div className="alert-panel" style={{ marginBottom: "20px" }}>
            <span style={{ fontSize: "var(--text-caption)" }}>{error}</span>
          </div>
        )}

        {/* Profile Content: View mode or Edit form */}
        {!isEditing ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                gap: "16px",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  background: "var(--color-surface-subtle)",
                  borderRadius: "var(--border-radius-sm)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span
                  className="caption"
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--color-text-muted)",
                  }}
                >
                  First Name
                </span>
                <strong
                  style={{ fontSize: "1.05rem", color: "var(--color-text)" }}
                >
                  {first || "—"}
                </strong>
              </div>
              <div
                style={{
                  padding: "16px 20px",
                  background: "var(--color-surface-subtle)",
                  borderRadius: "var(--border-radius-sm)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span
                  className="caption"
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--color-text-muted)",
                  }}
                >
                  Last Name
                </span>
                <strong
                  style={{ fontSize: "1.05rem", color: "var(--color-text)" }}
                >
                  {last || "—"}
                </strong>
              </div>
            </div>

            <div
              style={{
                padding: "16px 20px",
                background: "var(--color-surface-subtle)",
                borderRadius: "var(--border-radius-sm)",
                border: "1px solid var(--color-border)",
              }}
            >
              <span
                className="caption"
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--color-text-muted)",
                }}
              >
                Registered Email Address
              </span>
              <strong
                style={{ fontSize: "1.05rem", color: "var(--color-text)" }}
              >
                {profile.email}
              </strong>
              <span
                className="caption"
                style={{
                  display: "block",
                  marginTop: "4px",
                  color: "var(--color-text-muted)",
                }}
              >
                Linked to your LifeLink sign-in account
              </span>
            </div>

            <div
              style={{
                padding: "16px 20px",
                background: "var(--color-surface-subtle)",
                borderRadius: "var(--border-radius-sm)",
                border: "1px solid var(--color-border)",
              }}
            >
              <span
                className="caption"
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--color-text-muted)",
                }}
              >
                Primary Contact Phone
              </span>
              <strong
                style={{ fontSize: "1.05rem", color: "var(--color-text)" }}
              >
                {phone || "Not provided"}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "4px",
              }}
            >
              <Button
                id="profile-footer-edit-btn"
                type="button"
                variant="primary"
                onClick={() => setIsEditing(true)}
                style={{
                  borderRadius: "var(--border-radius-btn)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: 600,
                }}
              >
                <Edit2 size={15} /> Edit Profile Details
              </Button>
              {success && (
                <span
                  style={{
                    color: "var(--color-semantic-success)",
                    fontWeight: 600,
                    fontSize: "var(--text-caption)",
                  }}
                >
                  Profile updated successfully!
                </span>
              )}
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 240px" }}>
                <label
                  htmlFor="profile-first-name"
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                    fontSize: "var(--text-caption)",
                  }}
                >
                  First Name
                </label>
                <Input
                  id="profile-first-name"
                  type="text"
                  value={first}
                  onChange={e => setFirst(e.target.value)}
                  required
                />
              </div>
              <div style={{ flex: "1 1 240px" }}>
                <label
                  htmlFor="profile-last-name"
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                    fontSize: "var(--text-caption)",
                  }}
                >
                  Last Name
                </label>
                <Input
                  id="profile-last-name"
                  type="text"
                  value={last}
                  onChange={e => setLast(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="profile-email"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                  fontSize: "var(--text-caption)",
                }}
              >
                Registered Email Address
              </label>
              <Input
                id="profile-email"
                type="email"
                value={profile.email}
                readOnly
                style={{
                  background: "var(--color-surface-interactive)",
                  color: "var(--color-text-muted)",
                  cursor: "not-allowed",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                  fontSize: "var(--text-caption)",
                }}
              >
                Primary Contact Phone
              </label>
              <Input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "12px",
                flexWrap: "wrap",
              }}
            >
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
                style={{ borderRadius: "var(--border-radius-btn)" }}
              >
                {isSaving ? "Saving Changes..." : "Save Profile Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                style={{ borderRadius: "var(--border-radius-btn)" }}
              >
                Cancel
              </Button>
              {success && (
                <span
                  style={{
                    color: "var(--color-semantic-success)",
                    fontWeight: 600,
                    fontSize: "var(--text-caption)",
                  }}
                >
                  Profile updated successfully!
                </span>
              )}
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

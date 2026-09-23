/**
 * ============================================================================
 * CLINICIAN WORKSTATION PORTAL
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This is the heavily restricted portal used by professional doctors.
 * It contains components for reviewing AI Triage reports, managing live consultation queues,
 * and writing clinical notes. It is isolated completely from the patient portal.
 */
import React, { useState } from "react";                                      // React core runtime and component state hooks
import { Card } from "../../../components/ui/Card";                                // Reusable glass/solid container UI component
import { Button } from "../../../components/ui/Button";                            // Button component with loading and disabled states
import { Input } from "../../../components/ui/Input";                              // Input component for styled form fields
import { Settings, Lock, CheckCircle2, AlertCircle, ShieldCheck, UserCheck } from "lucide-react"; // Icons for settings, security, and notices
import { trpc } from "../../../lib/trpc";                                          // Type-safe tRPC client bridge for React

// =========================================================================================
// DOCTOR WORKSPACE SETTINGS & CLINICIAN SECURITY PREFERENCES (DoctorSettings)
// =========================================================================================
//
// WHAT THIS COMPONENT DOES:
// 1. Provides a structured 2-column configuration suite for medical clinicians.
// 2. Password Modification Card: Allows clinicians to update workstation passwords
//    with cryptographic verification of their current password via tRPC mutation.
// 3. Workstation Authorization & Boundary Declarations Card: Displays institutional
//    access tier, active station assignment, and session privacy compliance rules.
// 4. Layout & Design System: Implements generous 2-column responsive layout (`minmax(480px, 1fr)`)
//    with deep ocean teal accents, matching the visual rhythm of other clinical dashboard views.
// =========================================================================================
export const DoctorSettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");                      // Clinician's current password for verification
  const [newPassword, setNewPassword] = useState("");                              // Clinician's proposed new password (min 10 chars)
  const [message, setMessage] = useState("");                                      // Feedback banner display message text
  const [isSuccess, setIsSuccess] = useState(false);                               // Flag determining whether banner style is success (teal) or error (red)

  // tRPC mutation to securely authenticate and rotate doctor credentials
  const changePassword = trpc.doctorAuth.changePassword.useMutation({              // Mutation hook communicating with backend doctorAuth router
    onSuccess: () => {                                                             // Invoked if current password matches and update succeeds
      setMessage("Password changed successfully.");                                // Set positive confirmation feedback
      setIsSuccess(true);                                                          // Mark alert banner as successful state
      setCurrentPassword("");                                                      // Clear current password input field
      setNewPassword("");                                                          // Clear new password input field
    },
    onError: (error) => {                                                          // Invoked if current password is wrong or validation fails
      setMessage(error.message);                                                   // Display specific server validation or authentication error
      setIsSuccess(false);                                                         // Mark alert banner as failure state
    },
  });

  // Submit event handler executing mutation
  const submit = (event: React.FormEvent) => {                                     // Form submission handler
    event.preventDefault();                                                        // Halt standard browser page navigation refresh
    setMessage("");                                                                // Clear any existing banners
    changePassword.mutate({ currentPassword, newPassword });                       // Dispatch payload to tRPC backend
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Workspace Header Banner */}
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '24px 28px',
          background: 'var(--color-surface-white)',
          border: '1px solid var(--color-border)',
          borderLeft: '4px solid var(--color-doctor-primary)',
          borderRadius: '2px',
          boxShadow: 'none',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '2px',
            background: 'var(--color-accent-muted)',
            border: '1px solid var(--color-doctor-primary)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--color-doctor-primary)',
            flexShrink: 0,
          }}
        >
          <Settings size={22} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif' }}>
            Workspace Settings
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            Security controls, credential status, and privacy boundary declarations for your doctor account.
          </p>
        </div>
      </section>

      {/* Main Grid: Generous 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: '24px' }}>
        
        {/* Change Password Card */}
        <Card
          variant="default"
          style={{
            padding: '28px',
            background: 'var(--color-surface-white)',
            border: '1px solid var(--color-border)',
            borderRadius: '2px',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '2px', background: 'var(--color-accent-muted)', display: 'grid', placeItems: 'center', color: 'var(--color-doctor-primary)' }}>
                <Lock size={18} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
                Change Password
              </h2>
            </div>

            <p className="caption" style={{ marginBottom: '20px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Update this doctor account's password. The owner-controlled reset path is available from Doctor sign in if your current password is unavailable.
            </p>

            {/* Feedback banner */}
            {message && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  background: isSuccess ? 'rgba(13, 148, 136, 0.12)' : 'rgba(220, 38, 38, 0.12)',
                  color: isSuccess ? 'var(--color-semantic-success)' : 'var(--color-semantic-emergency)',
                  border: `1px solid ${isSuccess ? 'rgba(13, 148, 136, 0.25)' : 'rgba(220, 38, 38, 0.25)'}`,
                }}
              >
                {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span style={{ fontSize: '0.90rem', fontWeight: 600 }}>{message}</span>
              </div>
            )}

            {/* Password update form */}
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-text)' }}>Current password</span>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
                  minLength={10}
                  required
                  placeholder="Enter your current password"
                  style={{
                    borderRadius: '8px',
                    minHeight: '44px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface-interactive)',
                    color: 'var(--color-text)',
                  }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-text)' }}>New password</span>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={10}
                  required
                  placeholder="At least 10 characters"
                  style={{
                    borderRadius: '8px',
                    minHeight: '44px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface-interactive)',
                    color: 'var(--color-text)',
                  }}
                />
              </label>

              <Button
                type="submit"
                variant="primary"
                className="doctor-btn-primary"
                disabled={changePassword.isPending}
                style={{ marginTop: '8px', minHeight: '44px', fontWeight: 700, borderRadius: '8px' }}
              >
                {changePassword.isPending ? "Changing…" : "Change password"}
              </Button>
            </form>
          </div>
        </Card>

        {/* Account Information Card */}
        <Card
          variant="default"
          style={{
            padding: '28px',
            background: 'var(--color-surface-white)',
            border: '1px solid var(--color-border)',
            borderRadius: '2px',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '2px', background: 'var(--color-accent-muted)', display: 'grid', placeItems: 'center', color: 'var(--color-doctor-primary)' }}>
                <ShieldCheck size={18} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
                Account Information & Privacy Boundary
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px 20px', background: 'var(--color-surface-subtle)', borderRadius: '2px', border: '1px solid var(--color-border)' }}>
                <p className="caption" style={{ margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', fontWeight: 700 }}>Account Type</p>
                <strong style={{ fontSize: '1rem', color: 'var(--color-text)' }}>Controlled Directory Doctor</strong>
              </div>

              <div style={{ padding: '16px 20px', background: 'var(--color-surface-subtle)', borderRadius: '2px', border: '1px solid var(--color-border)' }}>
                <p className="caption" style={{ margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', fontWeight: 700 }}>Access Level</p>
                <strong style={{ fontSize: '1rem', color: 'var(--color-text)' }}>Appointment-restricted patient context</strong>
              </div>

              <div style={{ padding: '16px 20px', background: 'var(--color-accent-muted)', borderRadius: '2px', border: '1px solid var(--color-doctor-primary)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <UserCheck size={20} color="var(--color-doctor-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
                  <strong>Note:</strong> This is a controlled LifeLink directory account. Records here are not verified doctor identities, credentials, or medical registrations.
                </p>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

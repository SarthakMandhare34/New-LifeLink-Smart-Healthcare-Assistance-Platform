/**
 * ============================================================================
 * ADMINISTRATOR LOGIN (frontend/src/features/admin/AdminLogin.tsx)
 * ============================================================================
 *
 * Dedicated authentication portal for platform administrators:
 * - Matches the layout, styling, and design system of Patient & Doctor login pages
 * - Standard Email/Username and Password inputs
 * - Automatic redirection if already authenticated
 * ============================================================================
 */
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LifeLinkLogo } from "../../components/brand/LifeLinkLogo";
import { EntryThemeToggle } from "../../components/EntryThemeToggle";
import { trpc } from "../../lib/trpc";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const utils = trpc.useUtils();
  const redirectTarget = searchParams.get("redirect") || "/admin/dashboard";

  const adminMeQuery = trpc.admin.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (adminMeQuery.data && adminMeQuery.data.role === "admin") {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("lifelink_admin_session", "active");
      }
      navigate(redirectTarget, { replace: true });
    }
  }, [adminMeQuery.data, navigate, redirectTarget]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: async data => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("lifelink_admin_session", "active");
      }
      if (data?.user) {
        utils.admin.me.setData(undefined, data.user as any);
      }
      await utils.admin.me.refetch();
      navigate(redirectTarget, { replace: true });
    },
    onError: err => {
      setError(
        err.message || "Invalid administrator credentials. Please check your email and password."
      );
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your administrator email or username.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your administrator password.");
      return;
    }

    loginMutation.mutate({
      email: email.trim(),
      password: password.trim(),
      accessCode: password.trim(),
    });
  };

  return (
    <main
      className="auth-page admin-auth-page"
      aria-labelledby="admin-login-heading"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Top Header Bar */}
      <header
        className="workspace-portal-header"
        aria-label="LifeLink portal header"
      >
        <div className="workspace-portal-brand">
          <span className="workspace-portal-mark" aria-hidden="true">
            <LifeLinkLogo
              variant="symbol"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </span>
          <span>
            <strong>LifeLink</strong>
            <small>Admin portal</small>
          </span>
        </div>
        <div className="workspace-portal-assurance">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>Authorized admin portal</span>
        </div>
        <EntryThemeToggle />
      </header>

      {/* Split Layout: Branding Panel + Login Card */}
      <div className="doctor-setup-layout auth-split-layout" style={{ flex: 1 }}>
        {/* Left Branding Panel */}
        <div className="auth-branding-panel">
          <div
            style={{
              textAlign: "center",
              maxWidth: "440px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <LifeLinkLogo className="lifelink-logo-auth" />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <span
                style={{
                  background: "var(--swiss-blue-soft)",
                  color: "var(--lifelink-blue)",
                  fontSize: "0.74rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "5px 14px",
                  borderRadius: "var(--border-radius-badge)",
                  border: "1px solid var(--color-border)",
                }}
              >
                Governance Console
              </span>

              <h2
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  margin: "6px 0 0",
                  color: "var(--color-text)",
                  letterSpacing: "-0.02em",
                }}
              >
                Control. Monitor. Protect.
              </h2>
              <p
                style={{
                  fontSize: "0.92rem",
                  color: "var(--color-text-muted)",
                  margin: 0,
                  lineHeight: 1.5,
                  maxWidth: "380px",
                }}
              >
                Secure management console for user registries, transit doctor workstations, and platform audit records.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Card Column */}
        <div
          className="auth-card-column"
          style={{
            flex: 1.1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "clamp(8px, 1.5vw, 20px)",
            zIndex: 1,
            width: "100%",
          }}
        >
          <Card
            className="card auth-card"
            style={{
              width: "100%",
              maxWidth: "480px",
              padding: "clamp(20px, 3.2vw, 32px)",
              background: "var(--color-surface-white)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--border-radius-card)",
              boxShadow: "none",
              boxSizing: "border-box",
            }}
          >
            {/* Form Card Header */}
            <div style={{ marginBottom: "22px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "var(--swiss-blue-soft)",
                  color: "var(--lifelink-blue)",
                  marginBottom: "12px",
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <h1
                id="admin-login-heading"
                style={{
                  fontSize: "1.45rem",
                  fontWeight: 700,
                  margin: "0 0 6px 0",
                  color: "var(--color-text)",
                  letterSpacing: "-0.01em",
                }}
              >
                Administrator Sign In
              </h1>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--color-text-muted)",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Enter your administrative credentials to continue.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "var(--border-radius-btn)",
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#991B1B",
                  fontSize: "0.85rem",
                  lineHeight: 1.4,
                  marginBottom: "18px",
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Email / Username Field */}
              <div>
                <label
                  htmlFor="admin-email"
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--color-text)",
                    marginBottom: "6px",
                  }}
                >
                  Email or Username
                </label>
                <div style={{ position: "relative" }}>
                  <Input
                    id="admin-email"
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter email or username"
                    autoComplete="username"
                    required
                    style={{
                      paddingLeft: "38px",
                      background: "var(--color-surface-ground)",
                    }}
                  />
                  <Mail
                    size={16}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-text-muted)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="admin-password"
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--color-text)",
                    marginBottom: "6px",
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                    style={{
                      paddingLeft: "38px",
                      paddingRight: "40px",
                      background: "var(--color-surface-ground)",
                    }}
                  />
                  <Lock
                    size={16}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-text-muted)",
                      pointerEvents: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--color-text-muted)",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                disabled={loginMutation.isPending}
                style={{
                  width: "100%",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "var(--lifelink-blue)",
                  borderRadius: "var(--border-radius-btn)",
                  fontWeight: 600,
                  marginTop: "6px",
                }}
              >
                {loginMutation.isPending ? (
                  "Signing In…"
                ) : (
                  <>
                    Sign In as Administrator <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </form>

            {/* Footer Navigation */}
            <div
              style={{
                marginTop: "24px",
                paddingTop: "20px",
                borderTop: "1px solid var(--color-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.82rem",
              }}
            >
              <button
                type="button"
                onClick={() => navigate("/")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--lifelink-blue)",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                ← Back to Home
              </button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--color-text-muted)",
                }}
              >
                <ShieldCheck size={14} />
                <span>Protected admin workspace</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

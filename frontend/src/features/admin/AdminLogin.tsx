/**
 * ============================================================================
 * ADMINISTRATOR LOGIN (frontend/src/features/admin/AdminLogin.tsx)
 * ============================================================================
 *
 * Secure single sign-in for the authorized platform administrator:
 * - Simple, clear English labels and messages
 * - Single secure input for the administrator key
 * - Automatic redirection if already signed in
 * ============================================================================
 */
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LifeLinkLogo } from "../../components/brand/LifeLinkLogo";
import { EntryThemeToggle } from "../../components/EntryThemeToggle";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { trpc } from "../../lib/trpc";
import {
  ShieldAlert,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/admin/dashboard";

  const adminMeQuery = trpc.admin.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (adminMeQuery.data && adminMeQuery.data.role === "admin") {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("lifelink_admin_session", "active");
      }
      navigate(redirectTarget, { replace: true });
    }
  }, [adminMeQuery.data, navigate, redirectTarget]);

  const utils = trpc.useUtils();
  const [accessCode, setAccessCode] = useState("admin");
  const [showKey, setShowKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    onError: error => {
      setErrorMessage(
        error.message || "Invalid administrator key. Please check your key and try again."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!accessCode.trim()) {
      setErrorMessage("Please enter your administrator key.");
      return;
    }
    loginMutation.mutate({ accessCode: accessCode.trim() });
  };

  return (
    <main
      className="auth-split-layout"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "var(--color-surface-ground)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--border-radius-badge)",
                background: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                padding: "2px",
              }}
            >
              <LifeLinkLogo variant="symbol" style={{ width: "24px", height: "24px" }} />
            </div>
            <strong style={{ fontSize: "1rem", color: "var(--color-text)" }}>
              LifeLink
            </strong>
          </div>
          <EntryThemeToggle />
        </div>

        {/* Auth Card */}
        <Card
          variant="solid"
          style={{
            padding: "clamp(24px, 4vw, 36px)",
            borderRadius: "var(--border-radius-card)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-white)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--border-radius-badge)",
                background: "rgba(14, 165, 233, 0.12)",
                color: "var(--lifelink-blue)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 12px",
              }}
            >
              <ShieldAlert size={26} />
            </div>
            <h1
              style={{
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "var(--color-text)",
                margin: "0 0 6px",
              }}
            >
              Administrator Login
            </h1>
            <p
              className="caption"
              style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.88rem" }}
            >
              Enter your secret administrator key to open the dashboard.
            </p>
          </div>

          {errorMessage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                background: "var(--lifelink-red-soft)",
                color: "var(--lifelink-red)",
                border: "1px solid var(--lifelink-red-border)",
                borderRadius: "var(--border-radius-badge)",
                fontSize: "0.85rem",
                marginBottom: "20px",
              }}
              role="alert"
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label
                htmlFor="admin-access-code"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                  marginBottom: "6px",
                }}
              >
                Administrator Key
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="admin-access-code"
                  type={showKey ? "text" : "password"}
                  value={accessCode}
                  onChange={e => setAccessCode(e.target.value)}
                  placeholder="Enter administrator key"
                  style={{
                    width: "100%",
                    padding: "10px 42px 10px 14px",
                    borderRadius: "var(--border-radius-btn)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface-ground)",
                    color: "var(--color-text)",
                    fontSize: "0.9rem",
                    fontFamily: showKey ? "monospace" : "inherit",
                    outline: "none",
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
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
                  aria-label={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", margin: "4px 0 0" }}>
                Accepts default key: <code style={{ color: "var(--lifelink-blue)", fontWeight: 600 }}>admin</code> or <code style={{ color: "var(--lifelink-blue)", fontWeight: 600 }}>admin123</code>.
              </p>
            </div>

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
              Back to Home
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-text-muted)" }}>
              <ShieldCheck size={14} />
              <span>Secure Access</span>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

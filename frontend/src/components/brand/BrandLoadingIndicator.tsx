/**
 * ============================================================================
 * BRANDED REAL-TIME LOADING INDICATOR
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * Displays LifeLink's official brand symbol with an animated beacon glow
 * exclusively during actual in-flight network requests or connection waits.
 * Zero artificial timeouts or mock delays: disappears the millisecond data is ready.
 */
import React from "react";
import { LifeLinkLogo } from "./LifeLinkLogo";
import { cn } from "@/lib/utils";

export type BrandLoadingIndicatorProps = {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
};

export function BrandLoadingIndicator({
  message = "Loading live specialist network…",
  className = "",
  size = "md",
  fullScreen = false,
}: BrandLoadingIndicatorProps) {
  const sizePx = size === "sm" ? 36 : size === "lg" ? 64 : 48;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 select-none",
        fullScreen
          ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          : "w-full py-12",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Glowing pulse beacon */}
        <div
          className="absolute rounded-full animate-ping opacity-30"
          style={{
            width: sizePx + 16,
            height: sizePx + 16,
            backgroundColor: "var(--color-primary, #0D9488)",
            animationDuration: "1.6s",
          }}
          aria-hidden="true"
        />

        {/* Outer orbital soft glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: sizePx + 24,
            height: sizePx + 24,
            background:
              "radial-gradient(circle, rgba(13, 148, 136, 0.18) 0%, rgba(13, 148, 136, 0) 70%)",
          }}
          aria-hidden="true"
        />

        {/* Official LifeLink Brand Symbol */}
        <div
          style={{
            width: sizePx,
            height: sizePx,
            borderRadius: "14px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-surface-white, #FFFFFF)",
            border: "1px solid var(--color-border, #E0D8CE)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            zIndex: 1,
          }}
        >
          <LifeLinkLogo
            variant="symbol"
            style={{
              width: "100%",
              height: "100%",
              padding: 0,
              border: "none",
              background: "transparent",
              boxShadow: "none",
            }}
          />
        </div>
      </div>

      {message && (
        <p
          className="text-sm font-semibold tracking-wide text-muted-foreground animate-pulse"
          style={{
            margin: 0,
            color: "var(--color-text-muted, #71717A)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            animationDuration: "2s",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

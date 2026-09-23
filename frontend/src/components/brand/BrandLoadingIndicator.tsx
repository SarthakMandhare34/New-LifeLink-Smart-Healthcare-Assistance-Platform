/**
 * ============================================================================
 * STANDARD REAL-TIME LOADING INDICATOR
 * ============================================================================
 * 
 * Clean, modern circular activity indicator for real-time data fetching
 * and map initialization. Uses a neutral clinical dual-tone spinning ring
 * without logos, red colors, or distracting pulse animations.
 */
import React from "react";
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
  // Dimensions and stroke widths for standard spinner sizes
  const spinnerConfig = {
    sm: { size: 24, stroke: "2px" },
    md: { size: 36, stroke: "3px" },
    lg: { size: 48, stroke: "3.5px" },
  }[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3.5 select-none",
        fullScreen
          ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-xs"
          : "w-full py-12",
        className
      )}
    >
      {/* Standard circular spinning activity ring (clean neutral dual-tone) */}
      <div
        className="rounded-full animate-spin border-solid"
        style={{
          width: spinnerConfig.size,
          height: spinnerConfig.size,
          borderWidth: spinnerConfig.stroke,
          borderColor: "var(--swiss-gray-300, #E2E8F0)",
          borderTopColor: "var(--swiss-blue, #0057B8)",
        }}
        aria-hidden="true"
      />

      {message && (
        <span
          className="text-xs font-medium tracking-wide text-neutral-600 dark:text-neutral-400"
          style={{
            margin: 0,
            color: "var(--swiss-gray-700, #475569)",
            fontFamily: "var(--font-family-base, 'Inter', sans-serif)",
          }}
        >
          {message}
        </span>
      )}
    </div>
  );
}

// Convenient alias for semantic clarity across consumers
export const NormalLoadingIndicator = BrandLoadingIndicator;
export const LoadingSpinner = BrandLoadingIndicator;


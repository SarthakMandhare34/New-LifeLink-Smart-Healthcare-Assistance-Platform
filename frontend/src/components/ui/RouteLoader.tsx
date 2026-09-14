import React from 'react';

/**
 * ============================================================================
 * ROUTE LOADER COMPONENT (frontend/src/components/ui/RouteLoader.tsx)
 * ============================================================================
 * 
 * WHAT THIS COMPONENT DOES:
 * When users navigate between different sections of the LifeLink app (e.g. from
 * Dashboard to Medicine Cabinet), the page code is downloaded on-demand in the
 * background via React.lazy(). 
 * 
 * While the browser is fetching that code, this RouteLoader component is rendered
 * inside <React.Suspense fallback={<RouteLoader />} /> as a smooth placeholder.
 * 
 * WHY THIS IS IMPORTANT:
 * 1. Prevents Layout Shifts: Has a minimum height (min-h-[320px]) so the page layout
 *    stays stable and doesn't jerk up and down.
 * 2. Accessibility (a11y): Includes role="status" and aria-label so screen readers
 *    inform visually impaired users that content is currently loading.
 * 3. Liquid-Glass Aesthetics: Uses backdrop blur, subtle pulsing borders, and a
 *    gentle primary-color spinner that seamlessly matches our clinical glass theme.
 */
export const RouteLoader: React.FC = () => {
  return (
    // Outer centered layout container with smooth 300ms fade transition
    <div
      className="w-full min-h-[320px] flex flex-col items-center justify-center p-8 transition-opacity duration-300"
      role="status"
      aria-label="Loading workspace section"
    >
      {/* Liquid-glass container card with soft backdrop blur and pulse animation */}
      <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 shadow-sm animate-pulse">
        {/* Circular spinning activity indicator */}
        <div 
          className="w-9 h-9 rounded-full border-2 border-primary/25 border-t-primary animate-spin" 
          aria-hidden="true"
        />
        {/* User-friendly status message */}
        <span className="text-xs font-medium text-muted-foreground tracking-wide">
          Loading workspace...
        </span>
      </div>
    </div>
  );
};


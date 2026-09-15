/**
 * ============================================================================
 * REUSABLE UI COMPONENTS (DESIGN SYSTEM)
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * Instead of rewriting the code for a button 50 times, we write it once here.
 * This ensures the entire application looks perfectly consistent (using Tailwind CSS)
 * and guarantees every component is accessible to screen readers for visually impaired users.
 */
import React from 'react';

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


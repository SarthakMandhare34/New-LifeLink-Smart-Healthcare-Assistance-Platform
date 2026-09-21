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
      {/* Solid Nordic Clinical surface card */}
      <div 
        className="flex flex-col items-center gap-3.5 p-6 border shadow-xs"
        style={{
          backgroundColor: 'var(--color-surface-white)',
          borderColor: 'var(--color-border)',
          borderRadius: 'var(--border-radius-card)',
        }}
      >
        {/* Circular spinning activity indicator */}
        <div 
          className="w-8 h-8 rounded-full border-2 animate-spin" 
          style={{
            borderColor: 'var(--color-primary-muted)',
            borderTopColor: 'var(--color-primary)',
          }}
          aria-hidden="true"
        />
        {/* User-friendly status message */}
        <span 
          className="text-xs font-medium tracking-wide"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Loading workspace...
        </span>
      </div>
    </div>
  );
};


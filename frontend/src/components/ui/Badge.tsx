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
import React from 'react';                                                                // Core React engine

interface BadgeProps {
  children: React.ReactNode;                                                                    // Badge label content
  status?: 'success' | 'warning' | 'neutral' | 'danger';                                        // Status styling token
  variant?: 'success' | 'warning' | 'neutral' | 'primary' | 'secondary' | 'danger';             // Variant alias
  className?: string;                                                                           // Extra CSS class names
  style?: React.CSSProperties;                                                                  // Inline styles
}

// =========================================================================================
// CLINICAL STATUS BADGE COMPONENT
// Compact pill badge component displaying operational statuses (e.g., Active, Confirmed, Emergency).
// =========================================================================================
export const Badge: React.FC<BadgeProps> = ({ children, status, variant, className = '', style }) => {
  const finalStatus = variant || status || 'neutral';                                           // Fallback status resolver
  return (
    <span className={`badge badge-${finalStatus} ${className}`} style={style}>
      {children}
    </span>
  );
};

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
import { LifeLinkLogo } from './LifeLinkLogo';                                                 // Base logo component

type LifeLinkMarkProps = {
  size?: 'sm' | 'md' | 'lg';                                                                    // Responsive size tokens
  className?: string;                                                                           // Extra classes
};

// =========================================================================================
// LIFELINK COMPACT BRAND EMBLEM MARK
// Renders the iconographic brand symbol for navigation sidebars, headers, and favicons.
// =========================================================================================
export function LifeLinkMark({ size = 'md', className = '' }: LifeLinkMarkProps) {
  return (
    <LifeLinkLogo variant="symbol" className={`lifelink-mark lifelink-mark-${size} ${className}`} /> // Compact emblem variant
  );
}

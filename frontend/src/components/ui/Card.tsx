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

interface CardProps {
  children: React.ReactNode;                                                                    // Card child content
  className?: string;                                                                           // Extra classes
  variant?: 'default' | 'glass' | 'solid' | 'emergency';                                        // Surface treatment variants
  interactive?: boolean;                                                                        // Hover elevation flag
  selected?: boolean;                                                                           // Selected ring indicator
  style?: React.CSSProperties;                                                                  // Inline styles
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;                                      // Click callback
}

// =========================================================================================
// REUSABLE CARD CONTAINER COMPONENT (frontend/src/components/ui/Card.tsx)
// =========================================================================================
//
// WHAT THIS COMPONENT DOES:
// This is the universal visual card container used across all patient and doctor views.
// It wraps medical records, dashboard stats, triage recommendations, and action buttons.
//
// KEY DESIGN & ACCESSIBILITY FEATURES:
// 1. Multiple Surface Variants:
//    - 'glass': Liquid-glass surface with blur and translucent background.
//    - 'solid' / 'default': High-contrast solid clinical background.
//    - 'emergency': Red-accented alert styling for urgent triage and SOS dialogs.
// 2. Automatic Interactivity:
//    If an `onClick` function is passed (or `interactive=true`), the card automatically
//    becomes focusable (`tabIndex={0}`), announces itself as a button to screen readers
//    (`role="button"`), and responds to tactile hover/elevation effects (`.interactive-surface`).
// 3. Accessible Keyboard Navigation (WCAG 2.1 AA):
//    Users navigating with a keyboard can press Enter or Space to activate the card,
//    ensuring complete accessibility without needing a mouse.
// =========================================================================================
export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'glass',
  interactive = false,
  selected = false,
  style,
  onClick
}) => {
  // Step 1: Select the CSS base surface class based on the requested variant
  let baseClass = 'glass-surface';                                                              // Default translucent glassmorphism
  if (variant === 'solid' || variant === 'default') {
    baseClass = 'solid-clinical-surface';                                                       // Opaque clinical surface
  } else if (variant === 'emergency') {
    baseClass = 'emergency-panel';                                                              // Urgent red-accented emergency surface
  }

  // Step 2: Automatically detect if this card can be clicked
  const isInteractive = interactive || Boolean(onClick);
  const interactiveClass = isInteractive ? 'interactive-surface' : '';
  const selectedClass = selected ? 'selected' : '';

  // Step 3: Keyboard handler — activates onClick when the user presses Enter or Space
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault(); // Prevent accidental page scrolling on Space press
      if (onClick) onClick(e as any);
    }
  };
  
  return (
    <div 
      className={`${baseClass} ${interactiveClass} ${selectedClass} ${className}`}
      style={style}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={isInteractive ? 0 : undefined}                                                  // Allows keyboard tabbing into this card
      role={isInteractive ? 'button' : undefined}                                               // Informs screen readers this is an interactive button
    >
      {children}
    </div>
  );
};

// Reusable card header row
export const CardHeader: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div className="card-header flex justify-between items-center">
    <h3 style={{ margin: 0 }}>{title}</h3>
    {action && <div>{action}</div>}
  </div>
);

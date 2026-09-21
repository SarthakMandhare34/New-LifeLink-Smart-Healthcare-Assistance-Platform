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
  variant?: 'default' | 'solid' | 'emergency' | 'document';                                     // Swiss surface treatment variants (glass purged)
  interactive?: boolean;                                                                        // Hover highlight flag
  selected?: boolean;                                                                           // Selected ring indicator
  style?: React.CSSProperties;                                                                  // Inline styles
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;                                      // Click callback
}

// =========================================================================================
// SWISS REUSABLE CARD CONTAINER COMPONENT (frontend/src/components/ui/Card.tsx)
// =========================================================================================
//
// WHAT THIS COMPONENT DOES:
// This is the universal visual card container across the Swiss International Typographic system.
// It presents structured healthcare data on flat, opaque, physical clinical surfaces (1px borders,
// 0–2px radius, zero glassmorphism, default zero shadow).
//
// VARIANTS:
// - 'default' / 'solid': High-contrast solid clinical white/dark surface.
// - 'emergency': Swiss Red alert styling for acute triage and SOS confirmations.
// - 'document': Clean clinical sheet styling for medical reports and prescriptions.
// =========================================================================================
export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  interactive = false,
  selected = false,
  style,
  onClick
}) => {
  // Step 1: Select the CSS base surface class based on the Swiss variant
  let baseClass = 'solid-clinical-surface';
  if (variant === 'emergency') {
    baseClass = 'emergency-panel';
  } else if (variant === 'document') {
    baseClass = 'solid-clinical-surface swiss-document-surface';
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

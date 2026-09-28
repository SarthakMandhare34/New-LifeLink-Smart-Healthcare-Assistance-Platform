/**
 * ============================================================================
 * CLINICAL TEXT INPUT — LIFELINK DESIGN SYSTEM
 * ============================================================================
 * Form input with 6px radius, blue focus ring, clean clinical styling.
 */
import React from 'react';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ style, className = '', ...props }, ref) => {
    const baseStyle: React.CSSProperties = {
      background: 'transparent',
      borderRadius: 'var(--border-radius-input)',
      padding: '10px var(--spacing-3)',
      fontSize: 'var(--text-body)',
      color: 'var(--color-text)',
      width: '100%',
      outline: 'none',
      transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    };

    return (
      <input
        ref={ref}
        style={{ ...baseStyle, ...style }}
        className={`liquid-input ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

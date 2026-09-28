/**
 * ============================================================================
 * CLINICAL STATUS BADGE — LIFELINK DESIGN SYSTEM
 * ============================================================================
 * Compact badge with 4px radius for status display.
 * Uses semantic colors: success (green), warning (amber), danger (red), neutral/primary (blue).
 */
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  status?: 'success' | 'warning' | 'neutral' | 'danger';
  variant?: 'success' | 'warning' | 'neutral' | 'primary' | 'secondary' | 'danger';
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ children, status, variant, className = '', style }) => {
  const finalStatus = variant || status || 'neutral';
  return (
    <span className={`badge badge-${finalStatus} ${className}`} style={style}>
      {children}
    </span>
  );
};

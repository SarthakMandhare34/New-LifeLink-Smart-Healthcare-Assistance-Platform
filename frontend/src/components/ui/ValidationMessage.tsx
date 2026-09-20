/**
 * ============================================================================
 * INLINE VALIDATION MESSAGE COMPONENT (frontend/src/components/ui/ValidationMessage.tsx)
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * Provides standardized, user-friendly, accessible validation feedback for form
 * controls across the application. Replaces raw error codes, unformatted stack traces,
 * or code-like JSON strings with clean, styled, and human-readable feedback.
 */
import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface ValidationMessageProps {
  message?: string | null;
  type?: 'error' | 'warning' | 'info' | 'success';
  className?: string;
  style?: React.CSSProperties;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  message,
  type = 'error',
  className = '',
  style = {},
}) => {
  if (!message) return null;

  const colorMap = {
    error: {
      color: 'var(--color-semantic-emergency, #dc2626)',
      bg: 'rgba(220, 38, 38, 0.08)',
      border: 'rgba(220, 38, 38, 0.25)',
      Icon: AlertCircle,
    },
    warning: {
      color: 'var(--color-semantic-warning, #d97706)',
      bg: 'rgba(217, 119, 6, 0.08)',
      border: 'rgba(217, 119, 6, 0.25)',
      Icon: AlertCircle,
    },
    info: {
      color: 'var(--color-primary, #0f766e)',
      bg: 'rgba(15, 118, 110, 0.08)',
      border: 'rgba(15, 118, 110, 0.25)',
      Icon: Info,
    },
    success: {
      color: 'var(--color-semantic-success, #16a34a)',
      bg: 'rgba(22, 163, 74, 0.08)',
      border: 'rgba(22, 163, 74, 0.25)',
      Icon: CheckCircle2,
    },
  }[type];

  const { color, bg, border, Icon } = colorMap;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`validation-message ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        marginTop: '6px',
        borderRadius: '8px',
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color,
        fontSize: '0.84rem',
        fontWeight: 500,
        lineHeight: 1.4,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        ...style,
      }}
    >
      <Icon size={16} style={{ flexShrink: 0 }} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};

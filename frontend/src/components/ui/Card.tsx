/**
 * ============================================================================
 * REUSABLE CARD COMPONENT — LIFELINK DESIGN SYSTEM
 * ============================================================================
 * Clean clinical surfaces with 8px radius, 1px borders, no shadow.
 * Variants: default/solid, emergency (red), document (clean sheet).
 */
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "solid" | "emergency" | "document";
  interactive?: boolean;
  selected?: boolean;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  interactive = false,
  selected = false,
  style,
  onClick,
}) => {
  let baseClass = "solid-clinical-surface";
  if (variant === "emergency") {
    baseClass = "emergency-panel";
  } else if (variant === "document") {
    baseClass = "solid-clinical-surface swiss-document-surface";
  }

  const isInteractive = interactive || Boolean(onClick);
  const interactiveClass = isInteractive ? "interactive-surface" : "";
  const selectedClass = selected ? "selected" : "";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      if (onClick) onClick(e as any);
    }
  };

  return (
    <div
      className={`${baseClass} ${interactiveClass} ${selectedClass} ${className}`}
      style={style}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? "button" : undefined}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: string;
  action?: React.ReactNode;
}> = ({ title, action }) => (
  <div className="card-header flex justify-between items-center">
    <h3 style={{ margin: 0 }}>{title}</h3>
    {action && <div>{action}</div>}
  </div>
);

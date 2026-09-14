import React from 'react';

/**
 * RouteLoader provides a lightweight, accessible liquid-glass loading
 * placeholder while lazy-loaded route bundles are downloaded in the background.
 */
export const RouteLoader: React.FC = () => {
  return (
    <div
      className="w-full min-h-[320px] flex flex-col items-center justify-center p-8 transition-opacity duration-300"
      role="status"
      aria-label="Loading workspace section"
    >
      <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 shadow-sm animate-pulse">
        <div className="w-9 h-9 rounded-full border-2 border-primary/25 border-t-primary animate-spin" />
        <span className="text-xs font-medium text-muted-foreground tracking-wide">
          Loading workspace...
        </span>
      </div>
    </div>
  );
};

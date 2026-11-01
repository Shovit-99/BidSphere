import React from 'react';

/**
 * Standardized Institutional StatusBadge primitive
 * Variants:
 * - gold: Editorial highlights, platform tier, verified lot
 * - live: Active STOMP stream, Reserve Met, Escrow guaranteed
 * - danger: Anti-snipe critical threshold (<30s) countdown
 * - neutral: Protocol specs, versioning, metadata tags
 */
const variantStyles = {
  gold: 'bg-gold-400/10 text-gold-300 border-gold-400/25',
  live: 'bg-telemetry-live/10 text-telemetry-live border-telemetry-live/25',
  danger: 'bg-telemetry-danger/10 text-telemetry-danger border-telemetry-danger/25',
  neutral: 'bg-white/[0.04] text-slate-400 border-white/[0.08]',
};

const dotColors = {
  gold: 'bg-gold-400',
  live: 'bg-telemetry-live',
  danger: 'bg-telemetry-danger',
  neutral: 'bg-slate-400',
};

export function StatusBadge({ variant = 'neutral', pulse = false, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider border ${variantStyles[variant] || variantStyles.neutral} ${className}`}
    >
      {pulse && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.neutral} animate-pulse`} />
      )}
      {children}
    </span>
  );
}

export default StatusBadge;

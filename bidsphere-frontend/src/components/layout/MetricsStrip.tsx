import React from 'react';
import { TrendingUp, Zap, Activity, ShieldAlert } from 'lucide-react';

const METRICS = [
  {
    label: 'TOTAL GMV SETTLED',
    value: '₹42.8 Cr+',
    meta: '100% Escrow Backed',
    icon: TrendingUp,
    accent: 'text-gold-400',
  },
  {
    label: 'WEBSOCKET LATENCY',
    value: '11.4 ms',
    meta: 'STOMP Broker P99',
    icon: Zap,
    accent: 'text-telemetry-live',
  },
  {
    label: 'ENGINE UPTIME',
    value: '99.98%',
    meta: 'Zero Lock Contention',
    icon: Activity,
    accent: 'text-telemetry-live',
  },
  {
    label: 'ANTI-SNIPING PROTECTION',
    value: '100%',
    meta: '+30s Auto-Extend Window',
    icon: ShieldAlert,
    accent: 'text-gold-400',
  },
];

export function MetricsStrip() {
  return (
    <section className="section-shell">
      <div className="card-surface grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
        {METRICS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="mono-metric text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {item.label}
                </span>
                <Icon className={`w-4 h-4 ${item.accent}`} />
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="mono-metric text-2xl sm:text-3xl font-bold text-white">
                  {item.value}
                </span>
                <span className="text-xs text-slate-400">{item.meta}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default MetricsStrip;

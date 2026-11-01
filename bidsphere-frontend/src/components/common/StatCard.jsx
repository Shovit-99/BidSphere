import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendType = 'positive', 
  badge,
  className = '' 
}) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        {badge && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
            {badge}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {trend && (
            <span className={`font-semibold flex items-center gap-0.5 ${
              trendType === 'positive' ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {trendType === 'positive' ? '↑' : '↓'} {trend}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-500">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Gavel, Search, PlusCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon = Gavel,
  title = 'No items found',
  description = 'Try adjusting your search filters or check back later.',
  actionLabel,
  actionLink,
  onAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-300 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-4 shadow-2xs">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      
      {actionLabel && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-800 transition shadow-xs"
          >
            {actionLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-800 transition shadow-xs cursor-pointer"
          >
            {actionLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
        )
      )}
    </div>
  );
}

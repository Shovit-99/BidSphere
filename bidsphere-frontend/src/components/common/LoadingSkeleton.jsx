import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs animate-pulse">
      <div className="h-52 bg-slate-200" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
        <div className="h-5 w-3/4 bg-slate-200 rounded" />
        <div className="h-3 w-1/2 bg-slate-100 rounded" />
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
          <div>
            <div className="h-3 w-14 bg-slate-100 rounded mb-1" />
            <div className="h-6 w-24 bg-slate-200 rounded" />
          </div>
          <div className="h-9 w-24 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-slate-200 rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export default function LoadingSkeleton({ count = 4, type = 'card' }) {
  if (type === 'table') {
    return (
      <tbody>
        {Array.from({ length: count }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </tbody>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

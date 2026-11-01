import React from 'react';
import { StatusBadge } from './StatusBadge';

interface SectionHeaderProps {
  id?: string;
  badgeText: string;
  badgeVariant?: 'gold' | 'live' | 'danger' | 'neutral';
  title: string;
  subtitle: string;
  align?: 'center' | 'left';
}

export function SectionHeader({
  id,
  badgeText,
  badgeVariant = 'gold',
  title,
  subtitle,
  align = 'center',
}: SectionHeaderProps) {
  const alignmentClasses =
    align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';

  return (
    <div
      id={id}
      className={`scroll-mt-28 flex flex-col max-w-3xl mb-14 ${alignmentClasses}`}
    >
      <div className="mb-4">
        <StatusBadge variant={badgeVariant} pulse={badgeVariant === 'live'}>
          {badgeText}
        </StatusBadge>
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-3.5 text-base text-slate-400 leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

export default SectionHeader;

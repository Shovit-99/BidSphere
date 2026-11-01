import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ 
  endTime, 
  variant = 'badge', // 'badge' | 'compact' | 'boxes' | 'text'
  onEnd,
  className = '' 
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false
  });

  useEffect(() => {
    const calculateTime = () => {
      if (!endTime) return;
      const target = new Date(endTime).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true });
        if (onEnd) onEnd();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isEnded: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endTime, onEnd]);

  if (timeLeft.isEnded) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 ${className}`}>
        <Clock className="w-3.5 h-3.5" />
        Auction Closed
      </span>
    );
  }

  const pad = (n) => String(n).padStart(2, '0');

  // Boxes format (for hero / detail pages)
  if (variant === 'boxes') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {timeLeft.days > 0 && (
          <div className="flex flex-col items-center justify-center min-w-[56px] py-2 px-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <span className="text-xl font-bold text-slate-900 leading-tight font-mono">{pad(timeLeft.days)}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Days</span>
          </div>
        )}
        <div className="flex flex-col items-center justify-center min-w-[56px] py-2 px-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <span className="text-xl font-bold text-slate-900 leading-tight font-mono">{pad(timeLeft.hours)}</span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Hours</span>
        </div>
        <div className="flex flex-col items-center justify-center min-w-[56px] py-2 px-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <span className="text-xl font-bold text-slate-900 leading-tight font-mono">{pad(timeLeft.minutes)}</span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Mins</span>
        </div>
        <div className="flex flex-col items-center justify-center min-w-[56px] py-2 px-2.5 bg-amber-50 border border-amber-200 rounded-lg shadow-2xs">
          <span className="text-xl font-bold text-amber-800 leading-tight font-mono animate-pulse">{pad(timeLeft.seconds)}</span>
          <span className="text-[10px] uppercase font-semibold text-amber-700 tracking-wider">Secs</span>
        </div>
      </div>
    );
  }

  // Compact format
  if (variant === 'compact') {
    return (
      <span className={`inline-flex items-center gap-1 font-mono text-xs font-semibold ${
        timeLeft.days === 0 && timeLeft.hours === 0 ? 'text-rose-600' : 'text-slate-700'
      } ${className}`}>
        <Clock className="w-3.5 h-3.5" />
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    );
  }

  // Text only
  if (variant === 'text') {
    return (
      <span className={`font-mono ${timeLeft.days === 0 && timeLeft.hours < 1 ? 'text-amber-600 font-bold' : 'text-slate-600'} ${className}`}>
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
      </span>
    );
  }

  // Default badge format
  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 2;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition-colors ${
      isUrgent 
        ? 'bg-rose-500/10 text-rose-700 border border-rose-300/60' 
        : 'bg-slate-900/80 text-white border border-slate-700/50'
    } ${className}`}>
      <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'animate-spin' : ''}`} />
      <span className="font-mono">
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    </span>
  );
}

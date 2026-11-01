import React, { useState, useEffect } from 'react';
import { Gavel, Clock, Radio, CheckCircle2, Sparkles } from 'lucide-react';

export interface LiveLotCardProps {
  onEnterRoom?: () => void;
}

export function LiveLotCard({ onEnterRoom }: LiveLotCardProps = {}) {
  const [currentBid, setCurrentBid] = useState(418000);
  const [bidCount, setBidCount] = useState(24);
  const [justBid, setJustBid] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(3 * 3600 + 42 * 60 + 16); // 03h : 42m : 16s

  // Live countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}h : ${mins}m : ${secs}s`;
  };

  const handleQuickRaise = (amount: number) => {
    setCurrentBid((prev) => prev + amount);
    setBidCount((prev) => prev + 1);
    setJustBid(true);
    setTimeout(() => setJustBid(false), 600);
  };

  return (
    <div className="card-surface overflow-hidden transition-all duration-300 hover:border-white/[0.12]">
      
      {/* 1. Integrated Top Telemetry Strip (Replaces the overlapping bottom pill) */}
      <div className="px-5 py-3 bg-obsidian-900/90 border-b border-white/[0.06] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 mono-metric text-telemetry-live font-medium">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>LIVE DROP</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">11ms STOMP</span>
        </div>
        <div className="mono-metric text-slate-400">
          <span className="text-white font-semibold">{bidCount}</span> bids placed
        </div>
      </div>

      {/* 2. Asset Image + Floating Overlays */}
      <div className="relative h-60 w-full bg-obsidian-900 overflow-hidden group">
        <img
          src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=85"
          alt="2003 Royal Enfield Bullet 350"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        {/* Subtle dark vignette for badge legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/20 to-black/30" />

        {/* Top-Left Lot Number & Top-Right Category */}
        <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between">
          <span className="mono-metric px-2.5 py-1 rounded-md bg-obsidian-950/80 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-gold-300">
            LOT #101
          </span>
          <span className="px-2.5 py-1 rounded-md bg-obsidian-950/80 backdrop-blur-md border border-white/10 text-[11px] text-slate-200 font-medium">
            Vintage Motorcycles
          </span>
        </div>

        {/* Bottom Overlaid Countdown Bar */}
        <div className="absolute bottom-3 left-4 right-4 px-3.5 py-2 rounded-xl bg-obsidian-950/85 backdrop-blur-md border border-white/10 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            Closing In
          </span>
          <span className="mono-metric text-xs font-semibold text-gold-300 tracking-wider">
            {formatTime(secondsLeft)}
          </span>
        </div>
      </div>

      {/* 3. Card Body */}
      <div className="p-5 space-y-5">
        
        {/* Provenance Tag & Asset Title */}
        <div>
          <div className="flex items-center gap-1.5 mono-metric text-[11px] uppercase tracking-wider text-gold-400 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Verified Heritage • Matching Engine & Frame</span>
          </div>
          <h3 className="text-lg font-bold text-white leading-snug">
            2003 Royal Enfield Bullet 350 — Cast-Iron Collector Edition
          </h3>
        </div>

        {/* High-Contrast Bid Box */}
        <div
          className={`subcard-surface p-4 flex items-center justify-between transition-colors duration-300 ${
            justBid ? 'border-gold-400/60 bg-gold-400/[0.06]' : ''
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="mono-metric text-[10px] uppercase tracking-wider text-slate-400">
                Current High Bid
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-telemetry-live">
                <CheckCircle2 className="w-3 h-3" />
                Reserve Met
              </span>
            </div>
            <div className="mono-metric text-2xl sm:text-3xl font-bold text-white mt-0.5">
              ₹{currentBid.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            type="button"
            onClick={onEnterRoom}
            className="btn-gold px-4 py-2.5 text-xs cursor-pointer"
          >
            <Gavel className="w-3.5 h-3.5" />
            Enter Room
          </button>
        </div>

        {/* Quick Raise Bar */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-xs font-medium text-slate-400">
            Instant Quick Raise:
          </span>
          <div className="flex items-center gap-2">
            {[5000, 10000, 25000].map((increment) => (
              <button
                key={increment}
                type="button"
                onClick={() => handleQuickRaise(increment)}
                className="mono-metric px-2.5 py-1.5 rounded-lg bg-obsidian-900 hover:bg-gold-400/15 border border-white/[0.07] hover:border-gold-400/40 text-xs text-slate-300 hover:text-gold-300 transition active:scale-95 cursor-pointer"
              >
                +₹{(increment / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default LiveLotCard;

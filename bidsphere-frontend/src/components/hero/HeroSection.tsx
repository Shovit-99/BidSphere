import React from 'react';
import { Gavel, ArrowRight, Terminal, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { LiveLotCard } from './LiveLotCard';

export interface HeroSectionProps {
  onOpenAuction?: (auction?: any) => void;
  onOpenAuth?: () => void;
  onOpenCreate?: () => void;
}

export function HeroSection({ onOpenAuction, onOpenAuth }: HeroSectionProps = {}) {
  return (
    <div className="section-shell">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        
        {/* Left Column: Value Proposition (7 Columns) */}
        <div className="lg:col-span-7 space-y-7">
          
          {/* Top Release Pill */}
          <a
            href="#architecture"
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-obsidian-800 border border-white/[0.08] hover:border-gold-400/40 text-xs text-slate-300 transition group"
          >
            <span className="w-2 h-2 rounded-full bg-telemetry-live animate-pulse" />
            <span className="font-semibold text-gold-300">Astryx Live Engine</span>
            <span className="text-slate-600">•</span>
            <span>Built for Real-Time Concurrency</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            Bid on India’s Rarest{' '}
            <span className="block mt-1 font-serif italic font-normal text-5xl sm:text-7xl bg-gradient-to-r from-gold-200 via-gold-400 to-gold-500 bg-clip-text text-transparent">
              Heritage & Luxury.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
            Institutional-grade live auctions with automated anti-sniping protection, optimistic locking concurrency, and instant escrow settlement — engineered for India.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <a href="#drops" className="btn-gold px-6 py-3.5">
              <Gavel className="w-4 h-4" />
              <span>Browse Live Auctions</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a href="#simulator" className="btn-secondary px-6 py-3.5">
              <Terminal className="w-4 h-4 text-gold-400" />
              <span>Try Anti-Snipe Simulator</span>
            </a>
          </div>

          {/* Clean Inline Trust Pillars (Replaces the boxed pill bar) */}
          <div className="pt-6 border-t border-white/[0.06] flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-telemetry-live shrink-0" />
              <span>100% Provenance Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Anti-Sniping Engine (+30s)</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gold-300 shrink-0" />
              <span className="mono-metric">Sub-15ms STOMP Stream</span>
            </div>
          </div>

        </div>

        {/* Right Column: Live Featured Lot Card (5 Columns) */}
        <div className="lg:col-span-5">
          <LiveLotCard onEnterRoom={() => onOpenAuction?.({ id: 101, title: '2003 Royal Enfield Bullet 350 — Cast-Iron Collector Edition', currentPrice: 418000, categoryName: 'Vintage Motorcycles' })} />
        </div>

      </div>
    </div>
  );
}

export default HeroSection;

import React from 'react';
import { Link } from 'react-router-dom';
import { Gavel, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { LiveLotCard } from './LiveLotCard';

export function HeroSection({ featuredLot, onOpenAuction }) {
  return (
    <section className="relative pt-32 pb-8 sm:pt-34 sm:pb-10 lg:pt-36 lg:pb-12 bg-[#FBF9F5] border-b border-[#E2D9C8] overflow-hidden">
      {/* Soft Warm Radial Lighting */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[radial-gradient(ellipse_at_top_right,rgba(232,91,42,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(197,160,89,0.07),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Refined Editorial Serif Headline & Stackable Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
            {/* Release Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4EFE6] border border-[#E2D9C8] text-[11px] font-bold text-[#e85b2a] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#e85b2a] animate-pulse inline-block" />
              <span>Spring 2026 Marquee Collections</span>
              <span className="text-[#C5A059]">•</span>
              <span className="text-[#121416]">Anti-Snipe Protected</span>
            </div>

            {/* Intentional 3-Line Headline Break */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-[4.2rem] font-medium tracking-tight text-[#121416] leading-[1.12]">
              Where Historic<br />
              Provenance Meets<br />
              <span className="italic font-light text-[#e85b2a]">Digital Bidding.</span>
            </h1>

            {/* Refined Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-stone-600 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed tracking-normal">
              Discover exceptional fine art, rare horology, and marquee motorcars. Experience sub-15ms live bidding with physical condition verification and guaranteed escrow settlements.
            </p>

            {/* Hero Action Buttons: Sentence Case, 14px Radius, Stackable on Mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
              <Link
                to="/auctions"
                className="px-7 py-3.5 rounded-[14px] bg-[#e85b2a] hover:bg-[#cf4d1f] active:bg-[#b54016] text-white font-bold text-sm transition-all duration-200 shadow-md shadow-[#e85b2a]/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Gavel className="w-4 h-4" />
                <span>Explore the catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/register"
                className="px-7 py-3.5 rounded-[14px] bg-white hover:bg-[#FAF8F5] border border-stone-800/20 hover:border-stone-800/50 text-stone-900 font-bold text-sm transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Consign with us</span>
              </Link>
            </div>

            {/* Trust Indicators Pillar */}
            <div className="pt-4 border-t border-[#E2D9C8] flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>100% Certified provenance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#e85b2a]" />
                <span>Live bidding • 12ms</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#121416]" />
                <span>Escrow safe settlement</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Featured Live Lot Card */}
          <div className="lg:col-span-5">
            <LiveLotCard lot={featuredLot} onOpenAuction={onOpenAuction} />
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;


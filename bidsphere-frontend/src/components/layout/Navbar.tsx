import React, { useState, useEffect } from 'react';
import { Gavel, Search, Bell, ChevronDown, Menu, X, Shield, PlusCircle, Heart, Trophy, LogOut, User } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Auctions', href: '#auctions', active: true },
  { label: 'Live Drops', href: '#drops', live: true },
  { label: 'Simulator', href: '#simulator' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'How It Works', href: '#how-it-works' },
];

export interface NavbarProps {
  onOpenCreateAuction?: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  onOpenAdmin?: () => void;
  onOpenWatchlist?: () => void;
  onOpenWonAuctions?: () => void;
  onOpenSearch?: () => void;
}

export function Navbar({
  onOpenCreateAuction,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
  onOpenWatchlist,
  onOpenWonAuctions,
  onOpenSearch,
}: NavbarProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-obsidian-950/85 backdrop-blur-xl border-b border-white/[0.07] shadow-lg shadow-black/40'
          : 'bg-obsidian-950/50 backdrop-blur-md border-b border-white/[0.04]'
      }`}
    >
      <div className="section-shell h-20 flex items-center justify-between gap-6">
        
        {/* Left: Brand Identity */}
        <a href="#" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center text-obsidian-950 shadow-gold-glow group-hover:scale-105 transition-transform">
            <Gavel className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white">
              BidSphere
            </span>
            <span className="mono-metric text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/[0.07]">
              v2.4
            </span>
          </div>
        </a>

        {/* Center: Clean Unboxed Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                item.active
                  ? 'text-white bg-white/[0.04]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              {item.label}
              {item.live && (
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              )}
            </a>
          ))}
        </nav>

        {/* Right: Search, Telemetry Alerts & Profile */}
        <div className="flex items-center gap-3">
          {/* Command K Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 border border-white/[0.07] hover:border-white/[0.14] text-xs text-slate-400 transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search lots</span>
            <kbd className="mono-metric px-1.5 py-0.5 text-[10px] bg-white/[0.05] rounded text-slate-300 border border-white/[0.06]">
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={onOpenWonAuctions}
            className="relative p-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 border border-white/[0.07] text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="mono-metric absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-400 text-obsidian-950 text-[10px] font-bold flex items-center justify-center">
              2
            </span>
          </button>

          {/* User Pill (Replaces the clashing purple 'D' circle) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (onOpenProfile) {
                  onOpenProfile();
                } else {
                  setShowDropdown(!showDropdown);
                }
              }}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 border border-white/[0.07] transition cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-gold-400/15 border border-gold-400/30 text-gold-300 font-mono text-xs font-bold flex items-center justify-center">
                D
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-obsidian-900 border border-white/[0.08] shadow-2xl p-2 z-50 text-xs text-slate-200">
                <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                  <div className="font-semibold text-white">Demo Bidder</div>
                  <div className="text-[11px] text-slate-400 font-mono">bidder@bidsphere.io</div>
                </div>
                {onOpenProfile && (
                  <button
                    onClick={() => { setShowDropdown(false); onOpenProfile(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.05] text-left"
                  >
                    <User className="w-3.5 h-3.5 text-gold-400" />
                    <span>My Account & Wallet</span>
                  </button>
                )}
                {onOpenCreateAuction && (
                  <button
                    onClick={() => { setShowDropdown(false); onOpenCreateAuction(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.05] text-left"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-gold-400" />
                    <span>Create Auction</span>
                  </button>
                )}
                {onOpenAdmin && (
                  <button
                    onClick={() => { setShowDropdown(false); onOpenAdmin(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.05] text-left"
                  >
                    <Shield className="w-3.5 h-3.5 text-gold-400" />
                    <span>Admin Console</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-obsidian-800 border border-white/[0.07] text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-6 py-4 bg-obsidian-950/95 border-b border-white/[0.07] backdrop-blur-xl space-y-2">
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/[0.04]"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenSearch?.(); }}
              className="flex-1 py-2 px-3 rounded-lg bg-obsidian-800 border border-white/[0.07] text-xs text-slate-300 text-center"
            >
              Search Lots (⌘K)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

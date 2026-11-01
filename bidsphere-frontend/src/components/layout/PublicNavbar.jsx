import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, ArrowRight, LogIn, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function PublicNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount = 0 } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/auctions?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  // Phase 2 exact required top navigation links:
  // Home, Collections, Auctions, How It Works
  const navLinks = [
    { label: 'Home', path: '/', isHash: false },
    { label: 'Collections', path: '/auctions?category=ALL', isHash: false },
    { label: 'Auctions', path: '/auctions', isHash: false },
    { label: 'How It Works', path: '/#how-it-works', hashId: 'how-it-works', isHash: true },
  ];

  const isLinkActive = (link) => {
    if (link.isHash) {
      return location.pathname === '/' && location.hash === `#${link.hashId}`;
    }
    if (link.path === '/') {
      return location.pathname === '/' && !location.hash;
    }
    return location.pathname.startsWith(link.path);
  };

  const handleNavClick = (e, link) => {
    if (link.isHash) {
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(link.hashId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', `#${link.hashId}`);
        }
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#14171A] border-b border-[#2A2E38] shadow-md transition-all duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* ============================================================
            1. BIDSPHERE LOGO (Left Aligned)
            ============================================================ */}
        <Link 
          to="/" 
          className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D95A2B] rounded-lg"
          aria-label="BidSphere Home"
        >
          {/* Hexagonal Antique Gold Geometric Icon */}
          <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
            <svg 
              viewBox="0 0 40 40" 
              className="w-9 h-9 fill-[#D95A2B] drop-shadow-[0_0_8px_rgba(217,90,43,0.35)] group-hover:scale-105 transition-transform duration-200"
            >
              <polygon points="20,2 38,12 38,28 20,38 2,28 2,12" fill="none" stroke="#D95A2B" strokeWidth="2.5" />
              <polygon points="20,9 31,16 31,24 20,31 9,24 9,16" fill="#D95A2B" opacity="0.9" />
              <path d="M14,20 L26,20" stroke="#14171A" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif leading-none">
              BID<span className="text-[#D95A2B]">SPHERE</span>
            </span>
            <span className="text-[9px] font-semibold tracking-widest text-[#7C828D] uppercase mt-0.5">
              Heritage Editorial Marketplace
            </span>
          </div>
        </Link>

        {/* ============================================================
            2. NAVIGATION LINKS: Home, Collections, Auctions, How It Works
            ============================================================ */}
        <nav 
          aria-label="Main Navigation" 
          className="hidden md:flex items-center justify-center gap-1 lg:gap-2 flex-1"
        >
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <a
                key={link.label}
                href={link.path}
                onClick={(e) => handleNavClick(e, link)}
                className={`px-3 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[#D95A2B] ${
                  active
                    ? 'text-[#D95A2B] font-bold bg-white/5'
                    : 'text-slate-200 hover:text-[#D95A2B] hover:bg-white/5 active:text-[#D95A2B]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* ============================================================
            3. INLINE SEARCH BAR (Discover maker, lot #, ref)
            ============================================================ */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search maker, lot #, ref..."
            className="w-56 xl:w-72 min-w-[210px] pl-8 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#D95A2B] focus:bg-white/10 text-xs text-white placeholder-slate-400 outline-none transition-all font-sans"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
        </form>

        {/* ============================================================
            4. LIVE WEBSOCKET TELEMETRY PILL
            ============================================================ */}
        <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>STOMP Live • 12ms</span>
        </div>

        {/* ============================================================
            5. RIGHT ACTIONS: Profile / Auth (Zero Ghost Icons)
            ============================================================ */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Notifications link only visible for authenticated users */}
              <Link
                to="/dashboard/notifications"
                className="p-2 rounded-full text-slate-300 hover:text-[#D95A2B] hover:bg-white/5 transition relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D95A2B] ring-2 ring-[#14171A]" />
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#D95A2B] text-white transition text-xs font-semibold"
                title="Go to Dashboard"
              >
                <div className="w-6 h-6 rounded-full bg-[#D95A2B] text-white font-bold flex items-center justify-center text-[10px]">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="max-w-[120px] truncate">{user?.name || 'Dashboard'}</span>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-white transition text-xs font-semibold cursor-pointer"
                title="Log Out / Switch Account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Clean Auth Button Cluster: Prominent Login & Register */}
              <Link
                to="/login"
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white hover:text-[#D95A2B] hover:bg-white/5 transition flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>

              {/* Register / Membership Button (Burnt Orange Capsule) */}
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-full bg-[#D95A2B] hover:bg-[#C04B1F] active:bg-[#A83F17] text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#D95A2B]/20 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* ============================================================
            4. MOBILE HAMBURGER TOGGLE
            ============================================================ */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-white hover:text-[#D95A2B] hover:bg-white/10 transition-colors focus:outline-none"
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* ============================================================
          5. MOBILE RESPONSIVE DRAWER
          ============================================================ */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#14171A] border-t border-[#2A2E38] shadow-2xl px-5 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search maker, lot #, ref..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 outline-none focus:border-[#D95A2B]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </form>

          <nav aria-label="Mobile Navigation" className="space-y-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link);
              return (
                <a
                  key={link.label}
                  href={link.path}
                  onClick={(e) => {
                    handleNavClick(e, link);
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'text-[#D95A2B] font-bold bg-white/5'
                      : 'text-slate-200 hover:text-[#D95A2B] hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#2A2E38] flex flex-col gap-3">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/dashboard/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 text-white text-xs font-semibold"
                >
                  <Bell className="w-4 h-4 text-[#D95A2B]" />
                  <span>Notifications</span>
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-full bg-[#D95A2B] text-white font-bold text-sm text-center"
                >
                  Dashboard ({user?.name || 'Account'})
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-full border border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold text-xs text-center flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-full border border-white/20 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-full bg-[#D95A2B] text-white font-bold text-xs text-center flex items-center justify-center gap-1.5"
                >
                  <span>Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

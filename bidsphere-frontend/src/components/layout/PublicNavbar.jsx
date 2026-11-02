import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Gavel, ArrowRight, ChevronDown, Menu, X, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function PublicNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount = 0 } = useNotifications();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll listener for dynamic frosted opacity & shadow depth
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCollectionsDropdownOpen(false);
  }, [location.pathname, location.hash]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/auctions?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/', isHash: false },
    { label: 'Collections', path: '/collections', hasDropdown: true },
    { label: 'Auctions', path: '/auctions', isHash: false },
    { label: 'How It Works', path: '/#how-it-works', hashId: 'how-it-works', isHash: true },
  ];

  const categories = [
    { name: 'Haute Horlogerie', path: '/auctions?category=Luxury%20Watches' },
    { name: 'Supercars & Classics', path: '/auctions?category=Heritage%20%26%20Classic%20Cars' },
    { name: 'Modern & Fine Art', path: '/auctions?category=Modern%20%26%20Fine%20Art' },
    { name: 'Sports Memorabilia', path: '/auctions?category=Sports%20Memorabilia' },
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
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 transition-all duration-300">
      <div 
        className={`max-w-[1400px] mx-auto rounded-full px-6 sm:px-8 h-20 flex items-center justify-between gap-4 sm:gap-6 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#faf6f0]/95 backdrop-blur-xl border-2 border-[#e0d4c5] shadow-xl shadow-stone-900/8' 
            : 'bg-[#faf6f0]/85 backdrop-blur-md border-2 border-[#ede3d5] shadow-[0_12px_40px_rgba(28,24,21,0.06)]'
        }`}
      >
        {/* ============================================================
            1. LEFT ZONE: BRAND IDENTITY (Substantial Luxury Seal & Typography)
            ============================================================ */}
        <Link to="/" className="flex items-center gap-3.5 shrink-0 group focus:outline-none">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#f5ede2] via-[#ede3d5] to-[#dfceb7] border border-[#c5a059]/40 flex items-center justify-center text-[#8a7258] group-hover:border-[#c5a059] group-hover:scale-105 transition-all shadow-xs">
            <Gavel className="w-5 h-5 text-[#8a7258] stroke-[2.2]" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif font-black text-base sm:text-lg tracking-[0.18em] text-[#1c1815]">
              BIDSPHERE
            </span>
            <span className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.25em] font-semibold text-[#8e8576] mt-1">
              HERITAGE AUCTIONEERS
            </span>
          </div>
        </Link>

        {/* ============================================================
            2. CENTER ZONE: NAVIGATION & INTEGRATED SEARCH
            ============================================================ */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-8 text-[13.5px] font-semibold text-neutral-700">
          <Link 
            to="/" 
            className={`transition-colors py-1 ${
              isLinkActive(navLinks[0])
                ? 'text-[#966b3b] font-bold'
                : 'hover:text-[#1c1815]'
            }`}
          >
            Home
          </Link>

          {/* Collections with Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setCollectionsDropdownOpen(true)}
            onMouseLeave={() => setCollectionsDropdownOpen(false)}
          >
            <Link
              to="/collections"
              className="hover:text-[#1c1815] flex items-center gap-1.5 transition-colors py-1 text-neutral-700"
            >
              <span>Collections</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 transition-transform" />
            </Link>

            {/* Dropdown Menu */}
            {collectionsDropdownOpen && (
              <div className="absolute top-full left-0 pt-3 z-50">
                <div className="w-60 bg-[#faf6f0]/98 backdrop-blur-xl border border-[#ede5db] rounded-2xl p-2.5 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8e8576] px-3 py-1.5 border-b border-[#ede5db] mb-1">
                    Curated Disciplines
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      onClick={() => setCollectionsDropdownOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-800 hover:text-[#966b3b] hover:bg-black/5 transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link 
            to="/auctions" 
            className={`transition-colors py-1 ${
              isLinkActive(navLinks[2])
                ? 'text-[#966b3b] font-bold'
                : 'hover:text-[#1c1815]'
            }`}
          >
            Auctions
          </Link>

          <a 
            href="/#how-it-works" 
            onClick={(e) => handleNavClick(e, navLinks[3])}
            className="hover:text-[#1c1815] transition-colors py-1"
          >
            How It Works
          </a>
        </nav>

        {/* Spacious Recessed Search Field (No clipped text) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative flex-1 max-w-[320px] xl:max-w-[360px]">
          <Search className="w-4 h-4 absolute left-3.5 text-neutral-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search maker, lot #, artist, ref..."
            className="w-full h-11 bg-white/80 border border-[#e5ddd3] rounded-full pl-10 pr-16 text-xs sm:text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#966b3b] focus:bg-white transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
          />
          <kbd className="absolute right-2.5 px-2 py-0.5 text-[10px] font-mono text-neutral-500 bg-black/5 rounded-md border border-black/5 pointer-events-none">
            Ctrl K
          </kbd>
        </form>

        {/* ============================================================
            3. RIGHT ZONE: ACTION CONTROLS (Comfortable, Prominent Heights)
            ============================================================ */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/dashboard/notifications"
                className="w-10 h-10 rounded-full text-neutral-700 hover:text-black hover:bg-black/5 transition flex items-center justify-center relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#d95c2e]" />
                )}
              </Link>

              <Link
                to="/dashboard"
                className="h-11 flex items-center gap-2 px-4 rounded-full bg-black/5 border border-black/10 hover:border-[#c5a880] text-neutral-800 transition text-xs sm:text-sm font-semibold"
                title="Go to Dashboard"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#d95c2e] to-[#e76034] text-white font-bold flex items-center justify-center text-[10px]">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="max-w-[110px] truncate hidden sm:inline">{user?.name || 'Dashboard'}</span>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="w-9 h-9 flex items-center justify-center text-neutral-500 hover:text-red-600 rounded-full hover:bg-black/5 transition cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Log in */}
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-neutral-700 hover:text-black px-3.5 py-2 transition-colors"
              >
                Log in
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="h-11 flex items-center gap-1.5 text-xs sm:text-sm font-bold px-5 sm:px-6 rounded-full bg-gradient-to-r from-[#d95c2e] via-[#e26433] to-[#eb6f3a] hover:brightness-110 active:scale-95 text-white shadow-md shadow-orange-950/20 transition-all whitespace-nowrap"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-neutral-700 hover:text-black hover:bg-black/5 transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ============================================================
          4. MOBILE COLLAPSED DRAWER
          ============================================================ */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 max-w-[1400px] mx-auto rounded-3xl bg-[#faf6f0]/98 backdrop-blur-xl border-2 border-[#ede5db] p-6 space-y-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-3 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search maker, lot #, artist, ref..."
              className="w-full h-11 bg-white/90 border border-[#e5ddd3] rounded-full pl-11 pr-16 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
            />
            <kbd className="absolute right-3 top-2.5 px-2 py-0.5 text-[10px] font-mono text-neutral-500 bg-black/5 rounded-md">
              Ctrl K
            </kbd>
          </form>

          <nav className="flex flex-col gap-1.5 pt-2 border-t border-[#ede5db]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                onClick={(e) => {
                  handleNavClick(e, link);
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-800 hover:text-[#966b3b] hover:bg-black/5 transition"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#ede5db] flex items-center justify-between">
            {isAuthenticated ? (
              <div className="flex items-center justify-between w-full">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-neutral-800 hover:text-black"
                >
                  Dashboard ({user?.name || 'Account'})
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 w-full">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-11 flex items-center justify-center text-xs font-semibold text-neutral-800 hover:text-black rounded-full bg-black/5 border border-black/5"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-11 flex items-center justify-center text-xs font-bold text-white rounded-full bg-gradient-to-r from-[#d95c2e] via-[#e26433] to-[#eb6f3a]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

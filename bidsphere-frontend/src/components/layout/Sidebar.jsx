import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Gavel,
  Radio,
  Clock,
  Trophy,
  Heart,
  ListChecks,
  Bell,
  User,
  Settings,
  LogOut,
  X,
  PlusCircle,
  Shield,
  Layers,
  Crown
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isSeller, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path.includes('?') && `${location.pathname}${location.search}` === path) return true;
    if (!path.includes('?') && path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navMenuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'All Auctions', icon: Gavel, path: '/dashboard/auctions' },
    { label: 'Live Auctions', icon: Radio, path: '/dashboard/auctions?status=live' },
    { label: 'Upcoming Auctions', icon: Clock, path: '/dashboard/auctions?status=upcoming' },
    { label: 'My Bids', icon: Trophy, path: '/dashboard/my-bids' },
    { label: 'My Watchlist', icon: Heart, path: '/dashboard/watchlist' },
    { label: 'Won Auctions', icon: Layers, path: '/dashboard/won' }
  ];

  const managementItems = [
    ...(isSeller || isAdmin ? [
      { label: 'My Listings', icon: ListChecks, path: '/dashboard/my-listings' },
      { label: 'Create Auction', icon: PlusCircle, path: '/dashboard/create' }
    ] : [
      { label: 'My Listings', icon: ListChecks, path: '/dashboard/my-listings' }
    ]),
    ...(isAdmin ? [
      { label: 'Admin Console', icon: Shield, path: '/dashboard/admin' }
    ] : []),
    { label: 'Notifications', icon: Bell, path: '/dashboard/notifications', badge: 3 },
    { label: 'Profile', icon: User, path: '/dashboard/profile' },
    { label: 'Settings', icon: Settings, path: '/dashboard/settings' }
  ];

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="p-5 pb-4 flex items-center justify-between border-b border-white/[0.06]">
          <Link to="/dashboard" className="flex items-center gap-2.5 group" onClick={onClose}>
            {/* Hexagonal Gold Logo Icon */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-8 h-8 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                <polygon points="20,2 38,12 38,28 20,38 2,28 2,12" fill="none" stroke="#f59e0b" strokeWidth="3" />
                <polygon points="20,9 31,16 31,24 20,31 9,24 9,16" fill="#f59e0b" opacity="0.9" />
                <path d="M14,20 L26,20" stroke="#0a0f1d" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white font-serif">
                BID<span className="text-amber-400">SPHERE</span>
              </span>
              <span className="block text-[9px] font-semibold tracking-widest text-slate-400 uppercase -mt-0.5">
                Bid Beyond Limits
              </span>
            </div>
          </Link>

          <button 
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Card below logo */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="bg-[#121929] border border-white/[0.06] rounded-xl p-3 flex items-center gap-3">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || 'User'}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D95A2B] to-[#C5A059] text-white font-bold text-sm flex items-center justify-center border border-white/20">
                  {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#121929]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">
                {user?.name || user?.email?.split('@')[0] || 'Collector'}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'authenticated@bidsphere.com'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-semibold">
                  {user?.role?.replace('ROLE_', '') || 'Online'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
          {/* MENU Section */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Menu
            </p>
            <div className="space-y-1">
              {navMenuItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon size={16} className={active ? 'text-white' : 'text-slate-400'} />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* MANAGEMENT Section */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Management
            </p>
            <div className="space-y-1">
              {managementItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon size={16} className={active ? 'text-white' : 'text-slate-400'} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Become a Seller Banner Card */}
          <div className="p-3.5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-1 text-amber-400">
              <Crown size={15} />
              <span className="text-xs font-bold">Become a Seller</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-2.5 leading-snug">
              Turn your valuable luxury items into high-return auction events.
            </p>
            <Link
              to="/dashboard/create"
              onClick={onClose}
              className="w-full py-1.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1 transition"
            >
              <span>Create Auction</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Bottom Actions: Logout + Brand Footer */}
        <div className="p-3 border-t border-white/[0.06] space-y-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.06] transition cursor-pointer"
          >
            <LogOut size={15} className="text-amber-400" />
            <span>Logout</span>
          </button>

          <div className="pt-2 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400">
              <div className="w-3.5 h-3.5 rounded bg-amber-400 flex items-center justify-center text-[#0a0f1d] font-bold text-[8px]">
                ⚡
              </div>
              <span className="text-[11px] font-serif text-white tracking-wider">BIDSPHERE</span>
            </div>
            <p className="text-[9px] text-slate-600 mt-0.5">
              Secure • Trusted • Fast
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Search, Bell, Menu, ChevronDown, User, LogOut, Settings, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardTopbar({ onToggleSidebar, searchQuery, onSearchChange }) {
  const { user, logout, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-16 px-4 sm:px-6 bg-[#0a0f1d] border-b border-white/[0.06] flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile Toggle + Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
        >
          <Menu size={20} />
        </button>

        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search auctions, items, brands..."
            value={searchQuery || ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-12 py-2 bg-[#121929] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-mono text-slate-400">
            <span>⌘K</span>
          </div>
        </div>
      </div>

      {/* Right: Notifications + User Profile Pill */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <Link
          to="/dashboard/notifications"
          className="relative p-2.5 rounded-xl bg-[#121929] border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition"
          title="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0a0f1d]" />
        </Link>

        {/* User Pill Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 bg-[#121929] border border-white/10 rounded-xl hover:border-white/20 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#D95A2B] to-[#C5A059] border border-white/20 flex items-center justify-center text-white font-bold text-xs">
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-white block leading-tight max-w-[120px] truncate">
                {user?.name || user?.email?.split('@')[0] || 'Collector'}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold leading-none mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Online
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 ml-1" />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#121929] border border-white/10 rounded-xl shadow-2xl z-50 py-1.5 text-xs">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <div className="font-bold text-white truncate">{user?.name || user?.email?.split('@')[0] || 'Collector'}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email || 'authenticated@bidsphere.com'}</div>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#D95A2B]/10 text-[#D95A2B] border border-[#D95A2B]/20">
                    {user?.role?.replace('ROLE_', '') || 'BIDDER'}
                  </span>
                </div>

                <Link
                  to="/dashboard/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/[0.06] transition"
                >
                  <User size={14} />
                  <span>Collector Profile</span>
                </Link>

                <Link
                  to="/dashboard/settings"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/[0.06] transition"
                >
                  <Settings size={14} />
                  <span>Account Settings</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/dashboard/admin"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-amber-300 hover:text-amber-200 hover:bg-white/[0.06] transition"
                  >
                    <Shield size={14} />
                    <span>Admin Supervision</span>
                  </Link>
                )}

                <div className="border-t border-white/[0.06] mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => { setShowDropdown(false); logout(); }}
                    className="flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition w-full text-left cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

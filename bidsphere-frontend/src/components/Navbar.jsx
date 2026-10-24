import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  Gavel, 
  Search, 
  Heart, 
  Bell, 
  PlusCircle, 
  Shield, 
  User, 
  LogOut, 
  LogIn, 
  Clock, 
  Sparkles,
  Check,
  ChevronDown,
  Trophy
} from 'lucide-react';

export default function Navbar({ 
  onOpenCreateAuction, 
  onOpenAuth, 
  onOpenProfile, 
  onOpenAdmin,
  onOpenWatchlist,
  onOpenWonAuctions,
  searchQuery, 
  setSearchQuery,
  activeView,
  setActiveView
}) {
  const { user, isAuthenticated, logout, switchDemoRole, isAdmin, isSeller } = useAuth();
  const { unreadCount, notifications, markAllRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveView('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{ 
            width: 42, 
            height: 42, 
            borderRadius: 12, 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Gavel size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #ffffff, #c7d2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                BidSphere
              </span>
              <span className="live-indicator" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>
                <span className="live-dot" style={{ width: 6, height: 6 }}></span>
                LIVE
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Real-Time High Stakes Auctions
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search watches, supercars, fine art, collectibles..." 
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 42, borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.05)', height: 42 }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Center / Right Nav Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          
          {/* Quick Demo Switcher Pill (Helpful to test all 3 roles!) */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-full)', padding: '3px', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => switchDemoRole('BIDDER')}
              style={{
                background: user?.role === 'ROLE_BIDDER' ? '#6366f1' : 'transparent',
                color: user?.role === 'ROLE_BIDDER' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Switch to Bidder view"
            >
              Bidder
            </button>
            <button 
              onClick={() => switchDemoRole('SELLER')}
              style={{
                background: user?.role === 'ROLE_SELLER' ? '#10b981' : 'transparent',
                color: user?.role === 'ROLE_SELLER' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Switch to Seller view"
            >
              Seller
            </button>
            <button 
              onClick={() => switchDemoRole('ADMIN')}
              style={{
                background: user?.role === 'ROLE_ADMIN' ? '#f59e0b' : 'transparent',
                color: user?.role === 'ROLE_ADMIN' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Switch to Admin view"
            >
              Admin
            </button>
          </div>

          {/* Sell Item Button (for Sellers & Admins) */}
          {(isSeller || isAdmin) && (
            <button 
              onClick={onOpenCreateAuction}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <PlusCircle size={16} />
              <span>List Item</span>
            </button>
          )}

          {/* Won Auctions quick button */}
          <button 
            onClick={onOpenWonAuctions}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.85rem', position: 'relative' }}
            title="Won Auctions & Settlements"
          >
            <Trophy size={16} color="#fbbf24" />
            <span style={{ display: 'none', smDisplay: 'inline' }}>Won Items</span>
          </button>

          {/* Watchlist quick button */}
          <button 
            onClick={onOpenWatchlist}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            title="My Watchlist"
          >
            <Heart size={16} color="#f43f5e" />
          </button>

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn btn-secondary"
              style={{ padding: '8px 12px', position: 'relative' }}
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: -4, 
                  right: -4, 
                  background: '#ef4444', 
                  color: '#fff', 
                  fontSize: '0.65rem', 
                  fontWeight: 700, 
                  borderRadius: '50%', 
                  width: 18, 
                  height: 18, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Drawer */}
            {showNotifications && (
              <div 
                className="glass-panel" 
                style={{ 
                  position: 'absolute', 
                  right: 0, 
                  top: '115%', 
                  width: 340, 
                  zIndex: 200, 
                  padding: 16,
                  background: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Activity Alerts</div>
                  <button 
                    onClick={markAllRead}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Mark all read
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '16px 0' }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        style={{ 
                          padding: '10px 12px', 
                          borderRadius: 'var(--radius-sm)', 
                          background: n.read ? 'rgba(255,255,255,0.03)' : 'rgba(99, 102, 241, 0.1)',
                          borderLeft: n.read ? '2px solid transparent' : '3px solid #6366f1'
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: n.read ? 'var(--text-main)' : '#a5b4fc', marginBottom: 2 }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {n.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Panel button if role is admin */}
          {isAdmin && (
            <button 
              onClick={onOpenAdmin}
              className="btn btn-gold"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <Shield size={16} />
              <span>Admin</span>
            </button>
          )}

          {/* User Account / Auth Menu */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  cursor: 'pointer', 
                  padding: '4px 8px', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-color)',
                  background: 'rgba(255,255,255,0.04)' 
                }}
              >
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: '#fff'
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name || 'User'}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {user.role === 'ROLE_ADMIN' ? 'Administrator' : user.role === 'ROLE_SELLER' ? 'Verified Seller' : 'Registered Bidder'}
                  </div>
                </div>
                <ChevronDown size={14} color="var(--text-muted)" />
              </div>

              {/* User dropdown */}
              {showUserMenu && (
                <div 
                  className="glass-panel" 
                  style={{ 
                    position: 'absolute', 
                    right: 0, 
                    top: '115%', 
                    width: 200, 
                    zIndex: 200, 
                    padding: '8px 0',
                    background: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.12)'
                  }}
                >
                  <div 
                    onClick={() => { setShowUserMenu(false); onOpenProfile(); }}
                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.85rem' }}
                    className="dropdown-item"
                  >
                    <User size={16} /> My Profile & Bids
                  </div>
                  <div 
                    onClick={() => { setShowUserMenu(false); onOpenWonAuctions(); }}
                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.85rem' }}
                    className="dropdown-item"
                  >
                    <Trophy size={16} color="#fbbf24" /> Won Items & Checkout
                  </div>
                  <div style={{ height: 1, background: 'var(--border-color)', margin: '4px 0' }}></div>
                  <div 
                    onClick={() => { setShowUserMenu(false); logout(); }}
                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.85rem', color: '#f87171' }}
                    className="dropdown-item"
                  >
                    <LogOut size={16} /> Log Out
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}

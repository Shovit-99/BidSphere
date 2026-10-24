import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import { 
  X, 
  User, 
  Shield, 
  Lock, 
  Gavel, 
  Trophy, 
  Heart, 
  CheckCircle2, 
  Mail, 
  Phone,
  Camera
} from 'lucide-react';

export default function UserProfileModal({ onClose, onOpenAuction }) {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [activeTab, setActiveTab] = useState('bids');
  const [profile, setProfile] = useState(null);
  const [myBids, setMyBids] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, bidsRes, watchRes] = await Promise.all([
          api.getProfile(),
          api.getMyBids(),
          api.getMyWatchlist()
        ]);
        setProfile(profRes);
        if (bidsRes && bidsRes.content) setMyBids(bidsRes.content);
        if (watchRes && watchRes.content) setWatchlist(watchRes.content);
      } catch (e) {
        console.warn('Failed loading profile data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast({ title: 'Validation Error', message: 'New passwords do not match.', type: 'error' });
      return;
    }
    setChangingPass(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      addToast({ title: 'Success', message: 'Password updated successfully.', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast({ title: 'Password Change Failed', message: err.message, type: 'error' });
    } finally {
      setChangingPass(false);
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 780, padding: 0, overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(15, 23, 42, 0.7)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#fff',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}>
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{user?.name || 'User Profile'}</h2>
                <span className="badge badge-primary">{user?.role?.replace('ROLE_', '') || 'BIDDER'}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {user?.email}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ padding: '16px 20px', background: 'rgba(17, 24, 39, 0.9)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bids Placed</div>
            <div className="mono-font" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>
              {profile?.totalBidsPlaced || myBids.length || 0}
            </div>
          </div>
          <div style={{ padding: '16px 20px', background: 'rgba(17, 24, 39, 0.9)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Auctions Won</div>
            <div className="mono-font" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>
              {profile?.totalAuctionsWon || 4}
            </div>
          </div>
          <div style={{ padding: '16px 20px', background: 'rgba(17, 24, 39, 0.9)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Items Listed</div>
            <div className="mono-font" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>
              {profile?.totalItemsListed || 2}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'rgba(11, 15, 23, 0.4)' }}>
          {[
            { id: 'bids', label: 'My Bids', icon: Gavel },
            { id: 'watchlist', label: 'Watchlist', icon: Heart },
            { id: 'settings', label: 'Security & Password', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 16px',
                  background: active ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  border: 'none',
                  borderBottom: active ? '2px solid #6366f1' : '2px solid transparent',
                  color: active ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ padding: 24, maxHeight: '55vh', overflowY: 'auto' }}>
          
          {/* Bids Tab */}
          {activeTab === 'bids' && (
            <div>
              {myBids.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                  No bids recorded yet. Enter a live auction room to start bidding!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {myBids.map((b, i) => (
                    <div 
                      key={b.id || i}
                      className="glass-panel"
                      style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                          <Gavel size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Auction #{b.auctionId}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {new Date(b.bidTime).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="mono-font" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>
                        {formatPrice(b.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Watchlist Tab */}
          {activeTab === 'watchlist' && (
            <div>
              {watchlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                  No saved items in your watchlist. Click the heart icon on any auction card to save it.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {watchlist.map((item, i) => {
                    const auc = item.auction || item;
                    return (
                      <div 
                        key={item.id || i}
                        className="glass-panel"
                        onClick={() => { onClose(); if (onOpenAuction) onOpenAuction(auc); }}
                        style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {auc.imageUrl && (
                            <img src={auc.imageUrl} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                          )}
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{auc.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                              {auc.categoryName} • Status: {auc.status}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div className="mono-font" style={{ fontWeight: 800, color: '#fbbf24' }}>
                            {formatPrice(auc.currentPrice)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                            View Room →
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Password & Security Tab */}
          {activeTab === 'settings' && (
            <form onSubmit={handleChangePassword} style={{ maxWidth: 440, margin: '0 auto' }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={changingPass}
                style={{ width: '100%', marginTop: 12 }}
              >
                {changingPass ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

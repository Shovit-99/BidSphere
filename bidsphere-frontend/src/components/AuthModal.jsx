import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { X, LogIn, UserPlus, Shield, Sparkles, Check } from 'lucide-react';

export default function AuthModal({ onClose }) {
  const { login, register, switchDemoRole } = useAuth();
  const { addToast } = useNotifications();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('ROLE_BIDDER');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        addToast({ title: 'Welcome Back!', message: 'Signed in successfully.', type: 'success' });
      } else {
        await register(name, email, password, phone, role);
        addToast({ title: 'Account Created!', message: 'Welcome to BidSphere.', type: 'success' });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (roleKey) => {
    switchDemoRole(roleKey);
    addToast({ title: `Switched to Demo ${roleKey}`, message: `Now logged in as demo ${roleKey.toLowerCase()}.`, type: 'info' });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 460, padding: 0, overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(15, 23, 42, 0.7)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              {mode === 'login' ? 'Sign In to BidSphere' : 'Create BidSphere Account'}
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Participate in live bidding and verify provenance.
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: mode === 'login' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
              borderBottom: mode === 'login' ? '2px solid #6366f1' : 'none',
              color: mode === 'login' ? '#fff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: mode === 'register' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
              borderBottom: mode === 'register' ? '2px solid #6366f1' : 'none',
              color: mode === 'register' ? '#fff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: 24 }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              marginBottom: 16
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Account Role</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      className={`btn btn-sm ${role === 'ROLE_BIDDER' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1 }}
                      onClick={() => setRole('ROLE_BIDDER')}
                    >
                      Bidder / Buyer
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${role === 'ROLE_SELLER' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1 }}
                      onClick={() => setRole('ROLE_SELLER')}
                    >
                      Verified Seller
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%', padding: '12px 0', marginTop: 8 }}
            >
              {submitting ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Quick 1-Click Demo Accounts */}
          <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚡ Instant 1-Click Test Access
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.75rem' }}
                onClick={() => handleQuickDemo('BIDDER')}
              >
                Bidder
              </button>
              <button 
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.75rem' }}
                onClick={() => handleQuickDemo('SELLER')}
              >
                Seller
              </button>
              <button 
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.75rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
                onClick={() => handleQuickDemo('ADMIN')}
              >
                Admin
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Search, Gavel, ArrowRight, X, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchCommandModal({ isOpen, onClose, auctions = [], onSelectAuction }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Can be toggled from parent or if opened
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? auctions.filter(a => 
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.categoryName?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : auctions.slice(0, 4);

  const handleGoToBrowse = () => {
    onClose();
    navigate(`/auctions${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  };

  const handleSelectItem = (auction) => {
    onClose();
    if (onSelectAuction) {
      onSelectAuction(auction);
    } else {
      navigate('/auctions');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="glass-panel-elevated" 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 640,
          overflow: 'hidden'
        }}
      >
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)', gap: 12 }}>
          <Search size={20} className="text-gold-400" />
          <input 
            type="text"
            autoFocus
            placeholder="Search active auctions, categories, or lots... (Press Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGoToBrowse();
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Results */}
        <div style={{ padding: '16px 20px', maxHeight: 380, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            {query.trim() ? 'Matching Auctions' : 'Featured Live Lots'}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
              No auctions matching "{query}".
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    border: '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img 
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} 
                      alt={item.title}
                      style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} 
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.categoryName || 'Collectibles'}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="mono-font" style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.95rem' }}>
                      ${(item.currentPrice || 0).toLocaleString()}
                    </span>
                    <ArrowRight size={16} className="text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div style={{ 
          padding: '12px 20px', 
          background: 'rgba(0, 0, 0, 0.25)', 
          borderTop: '1px solid var(--border)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#94a3b8'
        }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <span><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 4 }}>↵</kbd> View in marketplace</span>
            <span><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 4 }}>ESC</kbd> Close</span>
          </div>
          <button 
            onClick={handleGoToBrowse}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#818cf8', 
              fontWeight: 600, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span>All Auctions</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

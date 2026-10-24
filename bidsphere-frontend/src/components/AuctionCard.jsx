import React, { useState, useEffect } from 'react';
import { Heart, Clock, Gavel, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export default function AuctionCard({ auction, onOpenBidModal, onWatchlistChange, isInWatchlist: initialWatchlist }) {
  const [inWatchlist, setInWatchlist] = useState(initialWatchlist || false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: false, isAntiSnipe: false });

  // Update countdown clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const end = new Date(auction.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true, isAntiSnipe: false });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const isAntiSnipe = diff <= 2 * 60 * 1000; // less than 2 minutes

      setTimeLeft({ days, hours, minutes, seconds, isEnded: false, isAntiSnipe });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [auction.endTime]);

  const toggleWatchlist = async (e) => {
    e.stopPropagation();
    try {
      if (inWatchlist) {
        await api.removeFromWatchlist(auction.id);
        setInWatchlist(false);
      } else {
        await api.addToWatchlist(auction.id);
        setInWatchlist(true);
      }
      if (onWatchlistChange) onWatchlistChange();
    } catch (err) {
      console.warn('Watchlist toggle error', err);
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div 
      className="glass-panel" 
      onClick={() => onOpenBidModal(auction)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Thumbnail Banner */}
      <div style={{ position: 'relative', width: '100%', height: 230, overflow: 'hidden', backgroundColor: '#0f172a' }}>
        <img 
          src={auction.imageUrl} 
          alt={auction.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
        />

        {/* Gradient Overlay for bottom readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.2) 50%, rgba(15, 23, 42, 0) 100%)'
        }}></div>

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, zIndex: 2 }}>
          {timeLeft.isEnded ? (
            <span className="badge badge-rose">ENDED</span>
          ) : timeLeft.isAntiSnipe ? (
            <span className="badge badge-rose" style={{ animation: 'livePulse 1s infinite' }}>
              <AlertTriangle size={12} /> ANTI-SNIPE ACTIVE
            </span>
          ) : (
            <span className="live-indicator">
              <span className="live-dot"></span>
              LIVE
            </span>
          )}
          <span className="badge badge-primary">{auction.condition.replace('_', ' ')}</span>
        </div>

        {/* Watchlist Heart Button */}
        <button 
          onClick={toggleWatchlist}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 3,
            transition: 'all 0.2s ease'
          }}
          title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Heart 
            size={18} 
            color={inWatchlist ? "#f43f5e" : "#cbd5e1"} 
            fill={inWatchlist ? "#f43f5e" : "none"} 
          />
        </button>

        {/* Live Countdown Floating Pill */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: timeLeft.isAntiSnipe ? 'rgba(239, 68, 68, 0.85)' : 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          padding: '5px 12px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <Clock size={14} color={timeLeft.isAntiSnipe ? "#ffffff" : "#fbbf24"} />
          <span className="mono-font">
            {timeLeft.isEnded ? 'Auction Closed' : (
              timeLeft.days > 0 
                ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`
                : `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`
            )}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
          {auction.categoryName}
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: 42 }}>
          {auction.title}
        </h3>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 16 }}>
          Listed by <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{auction.sellerName}</span>
        </div>

        {/* Pricing / Bid Box */}
        <div style={{ 
          marginTop: 'auto',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Current Bid
            </div>
            <div className="mono-font" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '-0.02em' }}>
              {formatPrice(auction.currentPrice)}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {auction.bidCount || 0} bids placed
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
              <TrendingUp size={13} />
              <span>{auction.highestBidderName ? `Lead: ${auction.highestBidderName}` : 'No bids yet'}</span>
            </div>
          </div>
        </div>

        {/* Place Bid CTA Button */}
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: 14 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenBidModal(auction);
          }}
        >
          <Gavel size={16} />
          <span>Enter Bidding Room</span>
        </button>
      </div>
    </div>
  );
}

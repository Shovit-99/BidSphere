import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { wsService } from '../services/websocket';
import { api } from '../services/api';
import { formatINR } from '../lib/currency';
import confetti from 'canvas-confetti';
import { 
  X, 
  Clock, 
  Gavel, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  User, 
  Sparkles, 
  Heart,
  Share2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function LiveBiddingModal({ auction, onClose, onBidSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useNotifications();

  const [currentAuction, setCurrentAuction] = useState(auction);
  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(true);
  const [bidAmount, setBidAmount] = useState(auction.currentPrice + auction.minIncrement);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [justUpdated, setJustUpdated] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isEnded: false, isAntiSnipe: false });

  // 1. Fetch bid history
  const loadBids = async () => {
    try {
      const res = await api.getBidHistory(currentAuction.id);
      if (res && res.content) {
        setBids(res.content);
      }
    } catch (e) {
      console.warn('Failed to load bids', e);
    } finally {
      setLoadingBids(false);
    }
  };

  useEffect(() => {
    loadBids();
  }, [currentAuction.id]);

  // 2. Connect to WebSocket STOMP topic `/topic/auction/{id}`
  useEffect(() => {
    wsService.connect();

    const sub = wsService.subscribeToAuction(currentAuction.id, (update) => {
      console.log('[BidSphere Live] Received live bid update:', update);
      setCurrentAuction((prev) => ({
        ...prev,
        currentPrice: update.currentPrice,
        highestBidderName: update.highestBidderName,
        endTime: update.endTime || prev.endTime,
        bidCount: update.bidCount || (prev.bidCount + 1)
      }));

      // Flash animation on card
      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2000);

      // Pre-fill next minimum bid
      setBidAmount(update.currentPrice + currentAuction.minIncrement);

      // Reload bid history table
      loadBids();

      addToast({
        title: 'New Highest Bid!',
        message: `${update.highestBidderName} just placed a bid of $${update.currentPrice.toLocaleString()}`,
        type: 'info'
      });
    });

    return () => {
      wsService.unsubscribe(currentAuction.id);
    };
  }, [currentAuction.id, currentAuction.minIncrement]);

  // 3. Countdown timer
  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const end = new Date(currentAuction.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isEnded: true, isAntiSnipe: false });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const isAntiSnipe = diff <= 2 * 60 * 1000;

      setTimeLeft({ hours, minutes, seconds, isEnded: false, isAntiSnipe });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentAuction.endTime]);

  const minRequiredBid = currentAuction.currentPrice + currentAuction.minIncrement;

  // Handle placing a bid
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isAuthenticated) {
      setErrorMsg('Please log in first to place a bid.');
      return;
    }

    if (user?.id === currentAuction.sellerId) {
      setErrorMsg('Sellers cannot bid on their own listings.');
      return;
    }

    if (bidAmount < minRequiredBid) {
      setErrorMsg(`Bid must be at least ${formatINR(minRequiredBid)} (Min increment is ${formatINR(currentAuction.minIncrement)})`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.placeBid(currentAuction.id, bidAmount);
      
      // Confetti burst for high bidder excitement!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      addToast({
        title: 'Bid Placed Successfully! 🎯',
        message: `You are currently the highest bidder at $${bidAmount.toLocaleString()}`,
        type: 'success'
      });

      // Update local state immediately
      setCurrentAuction((prev) => ({
        ...prev,
        currentPrice: bidAmount,
        highestBidderName: user.name || 'You',
        bidCount: (prev.bidCount || 0) + 1
      }));

      // Next min bid suggestion
      setBidAmount(bidAmount + currentAuction.minIncrement);
      loadBids();

      if (onBidSuccess) onBidSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place bid. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (val) => {
    return formatINR(val);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 840, padding: 0, overflow: 'hidden' }}
      >
        {/* Modal Header Bar */}
        <div style={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="live-indicator">
              <span className="live-dot"></span>
              LIVE BIDDING ROOM
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Auction #{currentAuction.id}
            </span>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 6,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 0 }}>
          
          {/* Left Column: Image, Details & Anti-Snipe Notice */}
          <div style={{ padding: 24, borderRight: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }}>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 260, marginBottom: 16, position: 'relative' }}>
              <img 
                src={currentAuction.imageUrl} 
                alt={currentAuction.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                <span className="badge badge-primary">{currentAuction.condition.replace('_', ' ')}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
              {currentAuction.categoryName}
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 10, lineHeight: 1.3 }}>
              {currentAuction.title}
            </h2>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
              {currentAuction.description}
            </p>

            {/* Anti-Sniping Protection Guarantee Card */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start'
            }}>
              <ShieldAlert size={20} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24', marginBottom: 2 }}>
                  Anti-Sniping Engine Active
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Any bid submitted in the final 2 minutes will automatically extend the closing timer by 2 minutes to ensure fair competition.
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Seller: <strong style={{ color: 'var(--text-muted)' }}>{currentAuction.sellerName}</strong></span>
              <span>Min Incr: <strong style={{ color: 'var(--text-muted)' }}>{formatINR(currentAuction.minIncrement)}</strong></span>
            </div>
          </div>

          {/* Right Column: Live Price, Countdown Clock, Bid Placement & History */}
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
            
            {/* Live Countdown & Price Showcase */}
            <div style={{
              background: justUpdated ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: justUpdated ? '1px solid #6366f1' : '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
              marginBottom: 20,
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Current Highest Bid
                  </div>
                  <div className="mono-font" style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>
                    {formatPrice(currentAuction.currentPrice)}
                  </div>
                </div>

                {/* Clock */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Time Remaining
                  </div>
                  <div 
                    className="mono-font" 
                    style={{ 
                      fontSize: '1.4rem', 
                      fontWeight: 800, 
                      color: timeLeft.isAntiSnipe ? '#ef4444' : '#ffffff',
                      animation: timeLeft.isAntiSnipe ? 'livePulse 1s infinite' : 'none'
                    }}
                  >
                    {timeLeft.isEnded ? 'ENDED' : `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>Highest Bidder: <strong style={{ color: '#34d399' }}>{currentAuction.highestBidderName || 'None'}</strong></span>
                <span>Total Bids: <strong>{currentAuction.bidCount || 0}</strong></span>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16
              }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Bid Input & Presets */}
            {!timeLeft.isEnded ? (
              <form onSubmit={handlePlaceBid} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  {[currentAuction.minIncrement, currentAuction.minIncrement * 2, currentAuction.minIncrement * 5, currentAuction.minIncrement * 10].map((inc, i) => (
                    <button
                      key={i}
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, padding: '6px 4px', fontSize: '0.75rem' }}
                      onClick={() => setBidAmount(currentAuction.currentPrice + inc)}
                    >
                      +{formatINR(inc)}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700 }}>
                      ₹
                    </span>
                    <input 
                      type="number"
                      step={currentAuction.minIncrement}
                      min={minRequiredBid}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="form-input mono-font"
                      style={{ paddingLeft: 30, fontSize: '1.1rem', fontWeight: 700 }}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                    style={{ padding: '0 24px', whiteSpace: 'nowrap' }}
                  >
                    <Gavel size={18} />
                    <span>{submitting ? 'Placing...' : 'Place Bid'}</span>
                  </button>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 6 }}>
                  Minimum acceptable bid is ${minRequiredBid.toLocaleString()}
                </div>
              </form>
            ) : (
              <div style={{
                padding: 16,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                color: '#f87171',
                fontWeight: 700,
                marginBottom: 20
              }}>
                This auction has concluded.
              </div>
            )}

            {/* Live Bid History Timeline */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 180 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>Bid Activity Log</span>
                <span style={{ color: 'var(--text-dim)', fontWeight: 500 }}>Live Feed</span>
              </div>

              <div style={{ 
                flex: 1, 
                maxHeight: 180, 
                overflowY: 'auto', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                background: 'rgba(0, 0, 0, 0.2)'
              }}>
                {loadingBids ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                    Loading bid stream...
                  </div>
                ) : bids.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', padding: '20px 0' }}>
                    Be the first bidder to set the price!
                  </div>
                ) : (
                  bids.map((b, index) => (
                    <div 
                      key={b.id || index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 0',
                        borderBottom: index < bids.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: index === 0 ? '#10b981' : '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: '#fff'
                        }}>
                          {index + 1}
                        </div>
                        <span style={{ fontWeight: 600, color: index === 0 ? '#34d399' : 'var(--text-main)' }}>
                          {b.bidderName || `Bidder #${b.bidderId}`}
                        </span>
                        {index === 0 && <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>LEAD</span>}
                      </div>

                      <div className="mono-font" style={{ fontWeight: 700, color: index === 0 ? '#fbbf24' : 'var(--text-muted)' }}>
                        {formatPrice(b.amount)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

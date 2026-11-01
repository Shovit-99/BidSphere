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
    if (!val && val !== 0) return '₹0';
    // Format in Indian numbering (lakhs, crores)
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div 
      className="glass-panel group flex flex-col overflow-hidden cursor-pointer rounded-2xl transition-all duration-300 hover:-translate-y-1.5" 
      onClick={() => onOpenBidModal(auction)}
    >
      {/* Thumbnail Banner */}
      <div className="relative w-full h-56 overflow-hidden bg-slate-950">
        <img 
          src={auction.imageUrl} 
          alt={auction.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
        />

        {/* Gradient Overlay for bottom readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          {timeLeft.isEnded ? (
            <span className="badge badge-rose">ENDED</span>
          ) : timeLeft.isAntiSnipe ? (
            <span className="badge badge-rose animate-pulse">
              <AlertTriangle size={12} /> ANTI-SNIPE ACTIVE
            </span>
          ) : (
            <span className="live-indicator">
              <span className="live-dot"></span>
              LIVE
            </span>
          )}
          <span className="badge badge-primary glass-pill">{auction.condition ? auction.condition.replace(/_/g, ' ') : 'VERIFIED'}</span>
        </div>

        {/* Watchlist Heart Button */}
        <button 
          onClick={toggleWatchlist}
          className="absolute top-3 right-3 w-9 h-9 rounded-full glass-pill flex items-center justify-center cursor-pointer z-10 hover:scale-110 transition-transform"
          title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Heart 
            size={16} 
            className={inWatchlist ? "text-rose-500 fill-rose-500" : "text-slate-300"} 
          />
        </button>

        {/* Live Countdown Floating Pill */}
        <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${timeLeft.isAntiSnipe ? 'bg-rose-600/90 text-white' : 'glass-pill text-white shadow-lg'}`}>
          <Clock size={13} className={timeLeft.isAntiSnipe ? "text-white" : "text-amber-400"} />
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
      <div className="p-5 flex flex-col flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{color: 'var(--accent-gold)'}}>
          {auction.categoryName}
        </div>

        <h3 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-amber-200 transition-colors">
          {auction.title}
        </h3>

        <div className="text-xs text-slate-400 mb-4">
          Listed by <span className="text-slate-300 font-semibold">{auction.sellerName}</span>
        </div>

        {/* Pricing / Bid Box */}
        <div className="mt-auto glass-inset p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Current Bid
            </div>
            <div className="mono-font text-xl font-extrabold" style={{color:'var(--accent-gold)'}}>
              {formatPrice(auction.currentPrice)}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-medium">
              {auction.bidCount || 0} bids placed
            </div>
            <div className="text-xs font-semibold flex items-center justify-end gap-1 mt-0.5" style={{color:'var(--accent-teal)'}}>
              <TrendingUp size={12} />
              <span>{auction.highestBidderName ? `Lead: ${auction.highestBidderName}` : 'No bids yet'}</span>
            </div>
          </div>
        </div>

        {/* Place Bid CTA Button */}
        <button 
          className="btn btn-gold w-full mt-3.5 btn-sm cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onOpenBidModal(auction);
          }}
        >
          <Gavel size={15} />
          <span>Enter Bidding Room</span>
        </button>
      </div>
    </div>
  );
}

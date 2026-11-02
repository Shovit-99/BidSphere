import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Share2, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import CountdownTimer from '../common/CountdownTimer';
import { formatINR } from '../../lib/currency';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';

const DEFAULT_LOT = {
  id: 100,
  title: '1971 Rolex Daytona "Paul Newman" Ref. 6263 — Exotic Panda Dial',
  categoryName: 'Haute Horlogerie',
  currentPrice: 4650000,
  minIncrement: 50000,
  startingPrice: 4000000,
  imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
  issuingAuthority: 'Geneva Horological Archive',
  coaNumber: 'ROLEX-GEN-1971-8932',
  endTime: '2026-11-02T20:30:00.000Z'
};

export function LiveLotCard({ lot, onEnterRoom, onOpenAuction }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useNotifications();
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Default featured lot if none provided
  const lotData = lot || DEFAULT_LOT;

  const currentBid = lotData.currentPrice || lotData.startingPrice || 4650000;
  const minIncrement = lotData.minIncrement || 50000;
  const nextMinBid = currentBid + minIncrement;

  const handleWatchlist = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      addToast({
        type: 'warning',
        title: 'Sign in required',
        message: 'Please sign in to add items to your watchlist.'
      });
      return;
    }

    try {
      if (isWatchlisted) {
        await api.removeFromWatchlist(lotData.id);
        setIsWatchlisted(false);
        addToast({ type: 'info', title: 'Removed', message: 'Item removed from your watchlist.' });
      } else {
        await api.addToWatchlist(lotData.id);
        setIsWatchlisted(true);
        addToast({ type: 'success', title: 'Saved', message: 'Item added to your watchlist.' });
      }
    } catch {
      setIsWatchlisted(!isWatchlisted);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const url = `${window.location.origin}/auctions/${lotData.id}`;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        addToast({
          type: 'success',
          title: 'Link copied',
          message: 'Auction lot link copied to clipboard.'
        });
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard access restricted
      }
    }
  };

  const handleActionClick = () => {
    if (onEnterRoom) {
      onEnterRoom(lotData);
    } else if (onOpenAuction) {
      onOpenAuction(lotData);
    } else {
      navigate(`/auctions/${lotData.id}`);
    }
  };

  return (
    <div className="bg-white rounded-[20px] border border-[#E2D9C8] p-4 sm:p-5 shadow-[0_12px_36px_-8px_rgba(20,23,26,0.08)] hover:shadow-[0_18px_44px_-8px_rgba(20,23,26,0.12)] transition-all duration-300 relative group">
      {/* 1. Media Image Area */}
      <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#121416]">
        <img
          src={lotData.imageUrl}
          alt={lotData.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80';
          }}
        />

        {/* Floating Badges with Rounded Pills */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#121416]/90 text-white shadow-md border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#e85b2a] animate-pulse" />
            LOT #{lotData.id}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#121416]/90 text-[#C5A059] border border-[#C5A059]/40 backdrop-blur-md shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>COA included</span>
          </span>
        </div>

        {/* High-Contrast Countdown Pill */}
        {lotData.endTime && (
          <div className="absolute bottom-3 left-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121416]/95 backdrop-blur-md text-white text-xs font-mono border border-white/20 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold text-red-400 tracking-wider">CLOSING SOON:</span>
              <span className="font-bold text-white tracking-wide">
                <CountdownTimer endTime={lotData.endTime} variant="badge" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Card Content & Details */}
      <div className="mt-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span className="font-semibold uppercase tracking-wider text-[#e85b2a]">
            {lotData.categoryName || 'Haute Horlogerie'}
          </span>
          <span className="text-stone-500">Issuing authority: {lotData.issuingAuthority || 'Geneva Archive'}</span>
        </div>

        {/* Title Row with Heart Watchlist Button and Share Button on Desktop */}
        <div className="flex items-start justify-between gap-3">
          <h3 
            onClick={handleActionClick}
            className="font-serif text-lg sm:text-xl font-bold text-[#121416] line-clamp-2 min-h-[3rem] leading-snug group-hover:text-[#e85b2a] transition-colors flex-1 cursor-pointer"
          >
            {lotData.title}
          </h3>

          <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
            {/* Share button on desktop */}
            <button
              type="button"
              onClick={handleShare}
              title="Share lot link"
              aria-label="Share auction lot"
              className="hidden sm:inline-flex p-2 rounded-xl text-stone-400 hover:text-[#121416] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Watchlist heart button near the title */}
            <button
              type="button"
              onClick={handleWatchlist}
              title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
              aria-label="Add to watchlist"
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isWatchlisted
                  ? 'text-[#e85b2a] bg-[#FAF0EB]'
                  : 'text-stone-400 hover:text-[#e85b2a] hover:bg-[#F4EFE6]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWatchlisted ? 'fill-current text-[#e85b2a]' : ''}`} />
            </button>
          </div>
        </div>

        {/* 3. Improved Bottom Action Area */}
        <div className="pt-3.5 mt-3 border-t border-[#EFE9DF] flex items-center justify-between gap-4">
          {/* Clear Price Information */}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block leading-tight">
              Current bid
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#e85b2a] font-mono leading-tight tracking-tight block">
              {formatINR(currentBid)}
            </span>
            <div className="text-[11px] font-semibold text-[#121416] flex items-center gap-1 mt-0.5 truncate">
              <span className="text-stone-500 font-normal">Next minimum:</span>
              <span className="font-mono font-bold text-[#121416]">{formatINR(nextMinBid)}</span>
            </div>
          </div>

          {/* Larger Enter Bid Button */}
          <button
            type="button"
            onClick={handleActionClick}
            className="px-6 py-3.5 rounded-xl bg-[#e85b2a] hover:bg-[#cf4d1f] active:bg-[#b54016] text-white font-bold text-sm transition-all duration-200 shadow-md shadow-[#e85b2a]/25 hover:shadow-lg flex items-center gap-2 shrink-0 transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            <span>Enter bid</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LiveLotCard;

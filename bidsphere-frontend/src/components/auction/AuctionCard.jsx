import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, ShieldCheck, User, ArrowRight } from 'lucide-react';
import CountdownTimer from '../common/CountdownTimer';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { formatINR } from '../../lib/currency';

export default function AuctionCard({
  auction,
  onOpenAuction,
  onOpenBidModal,
  isWatchlisted = false,
  onWatchlistToggle,
  isInWatchlist
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useNotifications();
  const [inWatchlist, setInWatchlist] = useState(isWatchlisted || isInWatchlist || false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);

  if (!auction) return null;

  const {
    id,
    title,
    description,
    currentPrice,
    startingPrice,
    imageUrl,
    categoryName,
    status = 'ACTIVE',
    endTime,
    sellerUsername,
    sellerName,
    sellerAvatar
  } = auction;

  const displayPrice = currentPrice !== undefined && currentPrice !== null ? currentPrice : startingPrice;
  const isLive = status === 'ACTIVE' || status === 'LIVE';
  const isUpcoming = status === 'UPCOMING';
  const isEnded = status === 'ENDED' || status === 'COMPLETED';

  // Urgent (< 15 mins) vs Standard (Hours/Days) countdown calculation
  const diffMs = endTime ? new Date(endTime).getTime() - Date.now() : 0;
  const isUrgent = isLive && diffMs > 0 && diffMs < 15 * 60 * 1000;
  const incrementVal = auction.minIncrement || Math.max(1000, Math.round((displayPrice || 10000) * 0.05));
  const nextMinBid = (displayPrice || 0) + incrementVal;

  const getEndsInText = () => {
    if (isEnded) return 'Ended';
    if (!endTime) return 'Ending soon';
    if (diffMs <= 0) return 'Ended';
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
    if (days > 0) return `Ends in ${days}d ${hours}h`;
    if (hours > 0) return `Ends in ${hours}h ${mins}m`;
    return `Ends in ${mins}m ${secs}s`;
  };

  const handleToggleWatchlist = async (e) => {
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

    setLoadingWatchlist(true);
    try {
      if (inWatchlist) {
        await api.removeFromWatchlist(id);
        setInWatchlist(false);
        addToast({ type: 'info', title: 'Removed', message: 'Item removed from your watchlist.' });
      } else {
        await api.addToWatchlist(id);
        setInWatchlist(true);
        addToast({ type: 'success', title: 'Saved', message: 'Item added to your watchlist.' });
      }
      if (onWatchlistToggle) onWatchlistToggle(id, !inWatchlist);
    } catch {
      setInWatchlist(!inWatchlist);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  const handleCardClick = () => {
    if (onOpenAuction) {
      onOpenAuction(auction);
    } else if (onOpenBidModal) {
      onOpenBidModal(auction);
    } else {
      navigate(`/auctions/${id}`);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="group bg-white rounded-[20px] border border-[#E2D9C8] overflow-hidden shadow-[0_4px_20px_-2px_rgba(20,23,26,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(20,23,26,0.09)] hover:border-[#D5C9B4] transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* 1. Media Image & Status Badge Area */}
      <div className="relative h-56 sm:h-60 w-full bg-[#121416] overflow-hidden">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
          }}
        />

        {/* Top Floating Badges using rounded pills */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isLive ? (
              isUrgent ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-950/90 text-red-200 border border-red-500/50 shadow-md backdrop-blur-md animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  CLOSING SOON
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#121416]/90 text-white shadow-sm border border-white/10 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#e85b2a] inline-block animate-pulse" />
                  LIVE LOT
                </span>
              )
            ) : isUpcoming ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#F4EFE6] text-[#121416] border border-[#E2D9C8] shadow-xs">
                <Clock className="w-3 h-3 text-[#e85b2a]" />
                UPCOMING
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-[#121416]/80 text-[#EBE4D5] backdrop-blur-xs">
                CLOSED
              </span>
            )}

            {/* COA included badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#121416]/85 text-[#C5A059] border border-[#C5A059]/40 backdrop-blur-md shadow-xs">
              <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
              <span>COA</span>
            </span>
          </div>
        </div>

        {/* Countdown Badge on Image */}
        {endTime && !isEnded && (
          <div className="absolute bottom-3 left-3 pointer-events-none">
            {isUrgent ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/90 backdrop-blur-md text-red-200 text-[11px] font-mono border border-red-500/40 shadow-md animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="font-bold text-red-400">URGENT:</span>
                <CountdownTimer endTime={endTime} variant="badge" />
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121416]/85 backdrop-blur-md text-[#EBE4D5] text-[11px] font-mono border border-white/10 shadow-xs">
                <Clock className="w-3 h-3 text-[#C5A059]" />
                <CountdownTimer endTime={endTime} variant="badge" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Category, Title & Watchlist Icon */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Category & Lot Number */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[#e85b2a] truncate max-w-[170px]">
              {categoryName || 'Fine Collectibles'}
            </span>
            <span className="text-[11px] font-mono text-stone-400">
              Lot #{id}
            </span>
          </div>

          {/* Product Title with Watchlist Heart Button next to it */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#121416] group-hover:text-[#e85b2a] transition-colors line-clamp-1 leading-snug flex-1">
              {title}
            </h3>
            <button
              type="button"
              onClick={handleToggleWatchlist}
              disabled={loadingWatchlist}
              title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              aria-label="Add to watchlist"
              className={`p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                inWatchlist
                  ? 'text-[#e85b2a] bg-[#FAF0EB]'
                  : 'text-stone-400 hover:text-[#e85b2a] hover:bg-[#F4EFE6]'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWatchlist ? 'fill-current text-[#e85b2a]' : ''}`} />
            </button>
          </div>

          {/* Consignor attribution */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-stone-500">
            <div className="w-3.5 h-3.5 rounded-full bg-[#F4EFE6] border border-[#E2D9C8] flex items-center justify-center text-[8px] font-bold text-[#121416]">
              {sellerAvatar ? (
                <img src={sellerAvatar} alt="" className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="w-2.5 h-2.5 text-stone-500" />
              )}
            </div>
            <span className="truncate max-w-[160px] text-stone-600 font-medium text-[11px]">
              {sellerUsername || sellerName || 'Verified Consignor'}
            </span>
            <ShieldCheck className="w-3 h-3 text-[#C5A059] shrink-0" />
          </div>
        </div>

        {/* 3. Bottom Action Area - Aligned with LiveLotCard */}
        <div className="pt-3.5 mt-3.5 border-t border-[#EFE9DF] flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            {/* Price Column: Current Bid & Next Minimum Bid on the Left */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block leading-tight">
                {isEnded ? 'Hammer price' : isUpcoming ? 'Opening estimate' : 'Current bid'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#e85b2a] font-mono leading-tight tracking-tight block">
                {formatINR(displayPrice)}
              </span>

              {/* Next Minimum Bid */}
              {!isEnded && !isUpcoming && (
                <div className="text-[11px] font-semibold text-[#121416] flex items-center gap-1 mt-0.5 truncate">
                  <span className="text-stone-500 font-normal">Next minimum:</span>
                  <span className="font-mono font-bold text-[#121416]">{formatINR(nextMinBid)}</span>
                </div>
              )}
            </div>

            {/* Enter Bid Button on the Right: 12-16px radius, sentence case */}
            <button
              type="button"
              onClick={handleCardClick}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#e85b2a] hover:bg-[#cf4d1f] active:bg-[#b54016] text-white text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap shrink-0 transform hover:-translate-y-0.5"
            >
              <span>{isEnded ? 'View result' : isUpcoming ? 'Inspect lot' : 'Enter bid'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hairline Footer info with countdown */}
          <div className="pt-2 border-t border-[#F4EFE6] flex items-center justify-between text-[11px] text-stone-500">
            {isUrgent ? (
              <span className="font-mono text-red-600 font-bold flex items-center gap-1 animate-pulse">
                <Clock className="w-3 h-3" />
                {getEndsInText()}
              </span>
            ) : (
              <span className="font-mono text-stone-600 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#C5A059]" />
                {getEndsInText()}
              </span>
            )}
            <span className="text-stone-400 text-[10px]">Anti-snipe protected</span>
          </div>
        </div>
      </div>
    </article>
  );
}

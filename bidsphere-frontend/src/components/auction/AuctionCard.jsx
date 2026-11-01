import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Gavel, Clock, ShieldCheck, User, Users, ArrowRight } from 'lucide-react';
import CountdownTimer from '../common/CountdownTimer';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { formatINR } from '../../lib/currency';

export default function AuctionCard({
  auction,
  onOpenAuction,
  isWatchlisted = false,
  onWatchlistToggle,
  variant = 'default'
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useNotifications();
  const [inWatchlist, setInWatchlist] = useState(isWatchlisted);
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
    bidCount = 0,
    endTime,
    sellerUsername,
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
        title: 'Sign In Required',
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
    } else {
      navigate(`/auctions/${id}`);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-[#E2D9C8] overflow-hidden shadow-[0_4px_20px_-2px_rgba(20,23,26,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(20,23,26,0.09)] hover:border-[#D5C9B4] transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* 1. Media Image Area */}
      <div className="relative h-56 sm:h-60 w-full bg-[#14171A] overflow-hidden">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
          }}
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isLive ? (
              isUrgent ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-950/90 text-red-200 border border-red-500/50 shadow-md backdrop-blur-md animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  CLOSING SOON
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#14171A]/90 text-white shadow-sm border border-white/10 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#C5A059] inline-block" />
                  LIVE LOT
                </span>
              )
            ) : isUpcoming ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#F4EFE6] text-[#14171A] border border-[#E2D9C8] shadow-xs">
                <Clock className="w-3 h-3 text-[#D95A2B]" />
                Upcoming
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-[#14171A]/80 text-[#EBE4D5] backdrop-blur-xs">
                Closed
              </span>
            )}

            {categoryName && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/90 text-[#14171A] shadow-xs backdrop-blur-md border border-[#E2D9C8]">
                {categoryName}
              </span>
            )}
          </div>

          {/* Watchlist Action */}
          <button
            type="button"
            onClick={handleToggleWatchlist}
            disabled={loadingWatchlist}
            aria-label="Add to watchlist"
            className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm ${
              inWatchlist
                ? 'bg-[#FAF0EB] text-[#D95A2B] border border-[#D95A2B]/30'
                : 'bg-white/95 text-[#4A505A] hover:text-[#D95A2B] hover:bg-white border border-[#E2D9C8] backdrop-blur-xs'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWatchlist ? 'fill-current text-[#D95A2B]' : ''}`} />
          </button>
        </div>

        {/* Countdown Badge on Image (Urgent: Pulsing Red with seconds | Standard: Muted amber/slate) */}
        {endTime && !isEnded && (
          <div className="absolute bottom-3 left-3 pointer-events-none">
            {isUrgent ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/90 backdrop-blur-md text-red-200 text-[11px] font-mono border border-red-500/40 shadow-md animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="font-bold text-red-400">URGENT:</span>
                <CountdownTimer endTime={endTime} variant="badge" />
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14171A]/85 backdrop-blur-md text-[#EBE4D5] text-[11px] font-mono border border-white/10 shadow-xs">
                <Clock className="w-3 h-3 text-[#C5A059]" />
                <CountdownTimer endTime={endTime} variant="badge" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Editorial Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Seller / Verified Consignor Bar with Provenance Tooltip */}
          <div className="flex items-center justify-between text-xs text-[#7C828D] mb-2">
            <div className="relative group/prov inline-block">
              <div className="flex items-center gap-1.5 cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-[#F4EFE6] border border-[#E2D9C8] overflow-hidden flex items-center justify-center text-[9px] font-bold text-[#14171A]">
                  {sellerAvatar ? (
                    <img src={sellerAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-2.5 h-2.5" />
                  )}
                </div>
                <span className="truncate max-w-[130px] font-medium text-[#4A505A] group-hover/prov:text-[#D95A2B] transition-colors">
                  {sellerUsername || 'Verified Consignor'}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              </div>

              {/* Provenance & Authority Floating Tooltip Card on Hover */}
              <div className="absolute left-0 bottom-full mb-2 z-50 hidden group-hover/prov:block w-72 p-3.5 bg-[#14171A] text-white rounded-xl shadow-2xl border border-[#2A303C] text-xs pointer-events-none transition-all duration-200">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <span className="font-bold text-[#C5A059] flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Provenance
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{auction.coaNumber || `COA-#${id}`}</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-200 mb-1">
                  {auction.issuingAuthority || 'Certified Consignor Verification Board'}
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
                  {auction.provenance || 'Physical inspection and chain of custody verified by credentialed specialists.'}
                </p>
                <div className="text-[9px] text-[#4ADE80] font-mono bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/20">
                  ✓ Escrow Protection &amp; Anti-Snipe Guarantee
                </div>
              </div>
            </div>

            <span className="text-[11px] font-mono text-[#7C828D]">
              Lot #{id}
            </span>
          </div>

          {/* Product Title (Editorial Serif Typography) */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#14171A] group-hover:text-[#D95A2B] transition-colors line-clamp-1 leading-snug">
            {title}
          </h3>

          {/* Optional Short Description */}
          {description && (
            <p className="text-xs text-[#7C828D] line-clamp-1 mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* 3. Pricing, Bid Count & View CTA Panel */}
        <div className="pt-4 mt-4 border-t border-[#EFE9DF] flex flex-col gap-3">
          <div className="flex items-end justify-between gap-3">
            {/* Price Column with Current Bid & Next Minimum Bid */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C828D] block">
                {isEnded ? 'Hammer Price' : isUpcoming ? 'Opening Estimate' : 'Current Bid'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#D95A2B] font-mono leading-none tracking-tight">
                {formatINR(displayPrice)}
              </span>

              {/* Next Minimum Bid and Count Info */}
              <div className="mt-1.5 space-y-0.5">
                {!isEnded && !isUpcoming && (
                  <span className="text-[11px] font-semibold text-[#14171A] flex items-center gap-1">
                    <span className="text-[#7C828D] font-normal">Next Bid:</span>
                    <span className="font-mono font-bold text-[#14171A]">{formatINR(nextMinBid)}</span>
                  </span>
                )}
                <span className="text-[10px] text-[#7C828D] block">
                  {bidCount} {bidCount === 1 ? 'bid placed' : 'bids placed'}
                  {startingPrice && <span className="text-[#A0A6B2]"> • Start {formatINR(startingPrice)}</span>}
                </span>
              </div>
            </div>

            {/* View Auction CTA (Burnt Orange Capsule) */}
            <button
              type="button"
              onClick={handleCardClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#14171A] group-hover:bg-[#D95A2B] text-white text-xs font-bold transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>{isEnded ? 'View Result' : isUpcoming ? 'Inspect Lot' : 'View Auction'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Hairline Footer info */}
          <div className="pt-2 border-t border-[#F4EFE6] flex items-center justify-between text-[11px] text-[#7C828D]">
            {isUrgent ? (
              <span className="font-mono text-red-600 font-bold flex items-center gap-1 animate-pulse">
                <Clock className="w-3 h-3" />
                {getEndsInText()}
              </span>
            ) : (
              <span className="font-mono text-[#5A606A] font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#C5A059]" />
                {getEndsInText()}
              </span>
            )}
            <span className="text-[#A0A6B2]">Anti-Snipe Protected</span>
          </div>
        </div>
      </div>
    </article>
  );
}

import React, { useState } from 'react';
import { Gavel, AlertCircle, CheckCircle2, TrendingUp, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { formatINR } from '../../lib/currency';
import confetti from 'canvas-confetti';

export default function BidForm({
  auction,
  onBidSuccess,
  className = ''
}) {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const currentPrice = Number(auction?.currentPrice || auction?.startingPrice || 0);
  const minIncrement = Number(auction?.minIncrement || Math.max(100, Math.round(currentPrice * 0.05)));
  const minNextBid = currentPrice + minIncrement;

  const [bidAmount, setBidAmount] = useState(minNextBid);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const quickIncrements = [
    minIncrement,
    minIncrement * 2,
    minIncrement * 5,
    minIncrement * 10
  ];

  const handleQuickAdd = (inc) => {
    setBidAmount(currentPrice + inc);
    setError('');
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      addToast({
        type: 'warning',
        title: 'Authentication Required',
        message: 'Please sign in or create an account to place a bid.'
      });
      return;
    }

    const amount = Number(bidAmount);
    if (isNaN(amount) || amount < minNextBid) {
      setError(`Your bid must be at least ${formatINR(minNextBid)}`);
      return;
    }

    setSubmitting(true);
    try {
      await api.placeBid(auction.id, amount);
      
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}

      addToast({
        type: 'success',
        title: 'Bid Placed Successfully!',
        message: `You are now the highest bidder at ${formatINR(amount)}`
      });

      const nextMin = amount + minIncrement;
      setBidAmount(nextMin);

      if (onBidSuccess) {
        onBidSuccess(amount);
      }
    } catch (err) {
      setError(err.message || 'Failed to place bid. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isEnded = auction?.status === 'ENDED' || auction?.status === 'COMPLETED';

  if (isEnded) {
    return (
      <div className={`p-6 bg-[#F4EFE6] rounded-2xl border border-[#E2D9C8] text-center ${className}`}>
        <p className="text-sm font-bold text-[#14171A]">Auction Concluded</p>
        <p className="text-xs text-[#7C828D] mt-1">Bidding is closed for this lot.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl border border-[#E2D9C8] p-6 sm:p-7 shadow-xs ${className}`}>
      {/* Price Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2D9C8]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C828D]">Current High Bid</span>
          <p className="text-3xl sm:text-4xl font-black text-[#D95A2B] font-mono tracking-tight mt-0.5">
            {formatINR(currentPrice)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C828D]">Min. Next Bid</span>
          <p className="text-sm font-bold text-[#14171A] font-mono mt-0.5">
            {formatINR(minNextBid)}
          </p>
        </div>
      </div>

      <form onSubmit={handleBidSubmit} className="mt-5 space-y-4">
        {/* Quick Increment Chips */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7C828D] mb-2">
            Quick Bid Increments
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickIncrements.map((inc, idx) => {
              const target = currentPrice + inc;
              const isSelected = bidAmount === target;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickAdd(inc)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition cursor-pointer flex flex-col items-center ${
                    isSelected
                      ? 'bg-[#14171A] text-white border-[#14171A] shadow-xs'
                      : 'bg-[#F4EFE6] text-[#14171A] border-[#E2D9C8] hover:bg-white'
                  }`}
                >
                  <span className="font-mono">{formatINR(target)}</span>
                  <span className={`text-[10px] font-normal ${isSelected ? 'text-[#D95A2B]' : 'text-[#7C828D]'}`}>
                    (+{formatINR(inc)})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Bid Input */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7C828D] mb-1.5">
            Place Your Bid Amount (₹)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 font-bold text-base text-[#14171A]">₹</span>
            <input
              type="number"
              min={minNextBid}
              step={minIncrement}
              value={bidAmount}
              onChange={(e) => {
                setBidAmount(e.target.value);
                setError('');
              }}
              placeholder={`Min ${minNextBid}`}
              className="w-full pl-9 pr-4 py-3 bg-[#FBF9F5] border border-[#E2D9C8] rounded-xl text-base font-bold text-[#14171A] focus:outline-none focus:border-[#D95A2B] focus:ring-1 focus:ring-[#D95A2B] font-mono transition"
            />
          </div>
          <p className="text-[11px] text-[#7C828D] mt-1.5 flex items-center gap-1 font-medium">
            <span>Minimum bid increment: <strong>{formatINR(minIncrement)}</strong></span>
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-[#FAF0EB] border border-[#D95A2B]/30 rounded-xl flex items-center gap-2 text-xs text-[#D95A2B] font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Bid Button (Refined 12-16px Radius) */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-6 rounded-xl bg-[#D95A2B] hover:bg-[#C04B1F] active:bg-[#A83F17] disabled:opacity-50 text-white font-bold text-sm transition-all duration-200 shadow-md shadow-[#D95A2B]/20 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying escrow &amp; placing bid...</span>
            </>
          ) : (
            <>
              <Gavel className="w-4 h-4" />
              <span>Enter bid of {formatINR(Number(bidAmount) || minNextBid)}</span>
            </>
          )}
        </button>

        {/* Escrow Guarantee Note */}
        <div className="pt-2 text-center text-[11px] text-[#7C828D] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Settled via 256-bit institutional escrow. Funds held securely until acceptance.</span>
        </div>
      </form>
    </div>
  );
}

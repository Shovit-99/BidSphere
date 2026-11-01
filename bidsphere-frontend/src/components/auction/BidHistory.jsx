import React from 'react';
import { Trophy, Clock, User, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../lib/currency';

export default function BidHistory({
  bids = [],
  loading = false,
  className = ''
}) {
  const { user } = useAuth();

  const formatBidderName = (bidderName, bidderId) => {
    if (user && (user.id === bidderId || user.email === bidderName)) {
      return (
        <span className="font-bold text-[#D95A2B] flex items-center gap-1">
          <span>You</span>
          <span className="text-[10px] bg-[#FAF0EB] text-[#D95A2B] px-1.5 py-0.5 rounded-full font-semibold border border-[#D95A2B]/20">Self</span>
        </span>
      );
    }
    if (!bidderName) return 'Verified Bidder';
    if (bidderName.length <= 3) return bidderName;
    return `${bidderName.slice(0, 2)}***${bidderName.slice(-1)}`;
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffSecs = Math.floor((now - date) / 1000);

      if (diffSecs < 60) return 'Just now';
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
      if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <div className={`bg-white rounded-3xl border border-[#E2D9C8] overflow-hidden shadow-xs ${className}`}>
      <div className="p-4 bg-[#F4EFE6] border-b border-[#E2D9C8] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#D95A2B]" />
          <h4 className="font-serif text-sm font-bold text-[#14171A]">Verified Bid Activity</h4>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-[#14171A] border border-[#E2D9C8] font-mono">
          {bids.length} {bids.length === 1 ? 'Bid' : 'Bids'}
        </span>
      </div>

      <div className="divide-y divide-[#E2D9C8]/60 max-h-96 overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-5 h-5 border-2 border-[#E2D9C8] border-t-[#D95A2B] rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#7C828D]">Streaming live telemetry...</p>
          </div>
        ) : bids.length === 0 ? (
          <div className="p-8 text-center text-[#7C828D]">
            <p className="font-serif text-sm font-bold text-[#14171A] mb-1">No bids placed yet</p>
            <p className="text-xs text-[#7C828D]">Be the first to enter an opening bid.</p>
          </div>
        ) : (
          bids.map((bid, index) => {
            const isHighest = index === 0;
            return (
              <div
                key={bid.id || index}
                className={`p-3.5 flex items-center justify-between transition ${
                  isHighest ? 'bg-[#FAF0EB]/60' : 'hover:bg-[#FBF9F5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isHighest 
                      ? 'bg-[#D95A2B] text-white shadow-xs' 
                      : 'bg-[#F4EFE6] text-[#14171A] border border-[#E2D9C8]'
                  }`}>
                    {isHighest ? <Trophy className="w-4 h-4 text-white" /> : <User className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      {formatBidderName(bid.bidderUsername || bid.bidderName, bid.bidderId)}
                      {isHighest && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D95A2B] bg-white px-2 py-0.5 rounded-full border border-[#D95A2B]/20">
                          Highest Bid
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#7C828D] mt-0.5">
                      {formatTime(bid.bidTime || bid.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-sm font-extrabold font-mono ${isHighest ? 'text-[#D95A2B]' : 'text-[#14171A]'}`}>
                    {formatINR(bid.amount)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

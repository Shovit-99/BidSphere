import React, { useState, useEffect } from 'react';
import { Heart, Gavel, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuctionCard from '../../components/auction/AuctionCard';
import EmptyState from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { INITIAL_AUCTIONS } from '../../services/mockData';

export default function WatchlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWatchlist = async () => {
    try {
      const res = await api.getMyWatchlist();
      if (res && res.content && res.content.length > 0) {
        setItems(res.content);
      } else {
        // Fallback with first two mock items
        setItems(INITIAL_AUCTIONS.slice(0, 3));
      }
    } catch (e) {
      setItems(INITIAL_AUCTIONS.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.removeFromWatchlist(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Watchlist</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep track of lots you're monitoring before bidding opens.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs self-start">
          <strong className="text-navy-900 font-mono">{items.length}</strong> Lots Saved
        </span>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-navy-900 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading your saved auctions...</p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your Watchlist is Empty"
          description="Save auctions you're interested in by tapping the heart icon on any lot card to receive price and closing alerts."
          actionLabel="Browse Marketplace"
          actionLink="/dashboard/auctions"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((auction) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              isWatchlisted={true}
              onWatchlistToggle={(id) => handleRemove(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

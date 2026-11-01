import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Gavel, Clock, Eye, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { INITIAL_AUCTIONS } from '../../services/mockData';
import { formatINR } from '../../lib/currency';

export default function MyListingsPage() {
  const { addToast } = useNotifications();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadListings = async () => {
    try {
      const res = await api.getMyAuctions();
      if (res && res.content && res.content.length > 0) {
        setListings(res.content);
      } else {
        setListings(INITIAL_AUCTIONS.slice(0, 3));
      }
    } catch (e) {
      setListings(INITIAL_AUCTIONS.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleCancelAuction = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this auction listing?')) return;
    try {
      await api.cancelAuction(id);
      addToast({
        type: 'info',
        title: 'Listing Cancelled',
        message: `Auction Lot #${id} has been withdrawn.`
      });
      setListings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Cancellation Error',
        message: err.message || 'Could not cancel listing.'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Consignor Listings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your active auction catalog, monitor real-time bids, and oversee lot closures.
          </p>
        </div>
        <Link
          to="/dashboard/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-navy-900 text-white font-bold text-xs hover:bg-navy-800 transition shadow-2xs self-start"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Consign New Item</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-navy-900 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading your consigned items...</p>
        </div>
      ) : listings.length === 0 ? (
        <EmptyState
          icon={Gavel}
          title="No Consignments Yet"
          description="You haven't listed any items for auction. Publish your first lot to start receiving bids from verified collectors."
          actionLabel="Create First Listing"
          actionLink="/dashboard/create"
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Consigned Lot</th>
                  <th className="py-3.5 px-4">Starting Price</th>
                  <th className="py-3.5 px-4">Current High Bid</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {listings.map((auc) => (
                  <tr key={auc.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={auc.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'}
                          alt={auc.title}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <Link to={`/auctions/${auc.id}`} className="font-bold text-slate-900 hover:text-navy-700 block truncate max-w-xs sm:max-w-md">
                            {auc.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 mt-0.5 block">Lot #{auc.id} • {auc.categoryName || 'General'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-slate-700">
                      {formatINR(auc.startingPrice)}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-900 text-sm">
                      {formatINR(auc.currentPrice || auc.startingPrice)}
                      <span className="text-[10px] text-slate-400 block font-sans font-normal">{auc.bidCount || 0} bids</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        ACTIVE
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/auctions/${auc.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                          title="View Live Lot"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleCancelAuction(auc.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Withdraw Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

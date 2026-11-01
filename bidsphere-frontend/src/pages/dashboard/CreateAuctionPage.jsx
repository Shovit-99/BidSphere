import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, ArrowRight, ShieldCheck, Image, DollarSign, Calendar, Tag } from 'lucide-react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { INITIAL_CATEGORIES } from '../../services/mockData';

export default function CreateAuctionPage() {
  const navigate = useNavigate();
  const { addToast } = useNotifications();

  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [reservePrice, setReservePrice] = useState('');
  const [minIncrement, setMinIncrement] = useState('50');
  const [imageUrl, setImageUrl] = useState('');
  const [durationDays, setDurationDays] = useState('7');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await api.getCategories();
        if (res && res.length > 0) {
          setCategories(res);
          setCategoryId(String(res[0].id));
        }
      } catch (e) {
        setCategories(INITIAL_CATEGORIES);
        setCategoryId(String(INITIAL_CATEGORIES[0]?.id || 1));
      }
    };
    loadCats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !startingPrice) {
      setError('Please provide an auction title and starting price.');
      return;
    }

    setSubmitting(true);
    try {
      const endTime = new Date(Date.now() + Number(durationDays) * 24 * 60 * 60 * 1000).toISOString();
      const payload = {
        title,
        categoryId: categoryId ? Number(categoryId) : 1,
        description,
        startingPrice: Number(startingPrice),
        reservePrice: reservePrice ? Number(reservePrice) : Number(startingPrice),
        minIncrement: Number(minIncrement) || 50,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        endTime,
        status: 'ACTIVE'
      };

      const newAuc = await api.createAuction(payload);
      addToast({
        type: 'success',
        title: 'Listing Published!',
        message: `Lot "${title}" is now live and accepting bids.`
      });
      navigate(`/auctions/${newAuc.id || ''}`);
    } catch (err) {
      setError(err.message || 'Failed to publish auction listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Consign & List New Lot</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Create an institutional auction catalog entry with real-time bidding and anti-snipe safeguards.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Lot Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 1957 Rolex Submariner 'Big Crown' Ref. 6538"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition"
            />
          </div>

          {/* Category & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Category Discipline *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Auction Duration *
              </label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition cursor-pointer"
              >
                <option value="1">24 Hours (Flash Auction)</option>
                <option value="3">3 Days</option>
                <option value="5">5 Days</option>
                <option value="7">7 Days (Standard Marquee)</option>
                <option value="14">14 Days</option>
              </select>
            </div>
          </div>

          {/* Pricing Grid: Starting Price, Reserve Price, Min Increment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Starting Bid (₹ INR) *
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="25000"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Reserve Price (Optional)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={reservePrice}
                onChange={(e) => setReservePrice(e.target.value)}
                placeholder="50000"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Min. Bid Increment (₹ INR)
              </label>
              <input
                type="number"
                min="5"
                step="any"
                value={minIncrement}
                onChange={(e) => setMinIncrement(e.target.value)}
                placeholder="1000"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Image URL with live preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              High-Resolution Image URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition"
              />
            </div>
            {imageUrl && (
              <div className="mt-3 relative w-36 h-28 rounded-lg overflow-hidden border border-slate-200">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Description & Provenance */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Lot Condition & Catalog Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the provenance, condition grade, serial numbers, box/papers, and prior ownership..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition resize-y"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Listed lots automatically inherit 60-second anti-snipe extensions.
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>Publish Auction Lot</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

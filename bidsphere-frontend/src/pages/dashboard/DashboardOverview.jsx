import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Gavel, 
  Trophy, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Radio, 
  Sparkles,
  Zap,
  Users,
  Laptop,
  Car,
  Palette,
  Shirt,
  Home,
  Watch,
  LayoutGrid,
  Filter,
  ChevronDown,
  ShieldAlert,
  Coins
} from 'lucide-react';
import AuctionCard from '../../components/auction/AuctionCard';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { INITIAL_AUCTIONS } from '../../services/mockData';
import { formatINR } from '../../lib/currency';

export default function DashboardOverview() {
  const { user, isSeller } = useAuth();
  const navigate = useNavigate();

  const [auctions, setAuctions] = useState(INITIAL_AUCTIONS);
  const [loading, setLoading] = useState(true);
  const [sortFilter, setSortFilter] = useState('Ending Soonest');

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        const aucRes = await api.getActiveAuctions(0, 8);
        if (aucRes?.content && aucRes.content.length > 0) {
          setAuctions(aucRes.content);
        } else {
          setAuctions(INITIAL_AUCTIONS);
        }
      } catch (e) {
        setAuctions(INITIAL_AUCTIONS);
      } finally {
        setLoading(false);
      }
    };

    loadOverviewData();
  }, []);

  // Category browse items exactly from Screenshot 2
  const browseCategories = [
    { name: 'Electronics', count: '124+ auctions', icon: Laptop, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100', query: 'Electronics' },
    { name: 'Vehicles', count: '86+ auctions', icon: Car, color: 'text-rose-500', bg: 'bg-rose-50 border-rose-100', query: 'Vehicles' },
    { name: 'Art & Collectibles', count: '62+ auctions', icon: Palette, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-100', query: 'Art' },
    { name: 'Fashion', count: '48+ auctions', icon: Shirt, color: 'text-pink-500', bg: 'bg-pink-50 border-pink-100', query: 'Fashion' },
    { name: 'Real Estate', count: '32+ auctions', icon: Home, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100', query: 'Real Estate' },
    { name: 'Sports Memorabilia', count: '28+ auctions', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100', query: 'Sports' },
    { name: 'Luxury Watches', count: '21+ auctions', icon: Watch, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-100', query: 'Luxury Watches' },
    { name: 'More', count: '+5 categories', icon: LayoutGrid, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200', query: '' }
  ];

  // Specific 4 Live items matching screenshot 2 (Rolex, Mercedes, Van Gogh, iPhone)
  const displayLiveAuctions = [
    auctions.find(a => a.id === 107) || auctions[2] || INITIAL_AUCTIONS[2], // Rolex Submariner
    auctions.find(a => a.id === 108) || auctions[3] || INITIAL_AUCTIONS[3], // Mercedes-Benz
    auctions.find(a => a.id === 109) || auctions[4] || INITIAL_AUCTIONS[4], // Van Gogh
    auctions.find(a => a.id === 110) || auctions[5] || INITIAL_AUCTIONS[5], // iPhone 15 Pro Max
  ].filter(Boolean);

  return (
    <div className="space-y-8">
      {/* 1. Hero Showcase Banner (Screenshot 2) */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0b1329] via-[#0d1c3a] to-[#070d1d] border border-blue-500/20 shadow-2xl p-6 sm:p-10 text-white overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#D95A2B] bg-[#FAF0EB] text-[#14171A] border border-[#D95A2B]/30 px-3 py-1 rounded-full inline-block font-mono">
                {user?.role?.replace('ROLE_', '') || 'BIDDER'} ACCOUNT
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Welcome back, <strong className="text-white">{user?.name || user?.email?.split('@')[0] || 'Collector'}</strong>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight leading-tight">
              Discover. Bid. <span className="text-amber-400">Win.</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              Exclusive items, competitive bidding, and unmatched opportunities — all in one place.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/dashboard/auctions"
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-amber-400/20"
              >
                <span>Explore Auctions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/dashboard/create"
                className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-2"
              >
                <span>Start Selling</span>
              </Link>
            </div>
          </div>

          {/* Center Column: 3D Showcase Luxury Watch */}
          <div className="lg:col-span-4 flex items-center justify-center relative">
            <div className="relative w-64 sm:w-72 h-64 sm:h-72 rounded-3xl overflow-hidden p-3 bg-gradient-to-b from-white/10 to-transparent border border-white/15 shadow-2xl flex items-center justify-center group">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
                alt="Luxury Watch Showcase"
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none rounded-2xl" />
              <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-400/30 backdrop-blur-xs">
                  Curated Haute Horlogerie
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Trust Pillars */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Secure Bidding</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">Your transactions are safe and protected with escrow</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
              <div className="w-9 h-9 rounded-xl bg-blue-400/15 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Real-Time Updates</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">Stay informed, bid with confidence via live sockets</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Trusted Community</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">Thousands of verified bidders & authentic sellers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Browse by Category Icon Carousel (Screenshot 2) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-xs text-slate-500">Discover lots curated by specialist departments</p>
          </div>
          <Link
            to="/dashboard/auctions"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {browseCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => navigate(cat.query ? `/dashboard/auctions?category=${encodeURIComponent(cat.query)}` : '/dashboard/auctions')}
                className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition group cursor-pointer bg-white"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition group-hover:scale-110 ${cat.bg}`}>
                  <Icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Live Auctions + Trust & Featured Auction Sidebar (Screenshot 2) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Main Live Auctions Section */}
        <div className="xl:col-span-9 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Live Auctions
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Bids are happening now. Don't miss your chance!</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={sortFilter}
                  onChange={(e) => setSortFilter(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="Ending Soonest">Sort by: Ending Soonest</option>
                  <option value="Highest Bid">Sort by: Highest Bid</option>
                  <option value="Most Active">Sort by: Most Active</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <Link
                to="/dashboard/auctions"
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
              >
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span>Filters</span>
              </Link>
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayLiveAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>

        {/* Right Column: Verified Sellers & Featured Auction (Screenshot 2) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Card 1: Buy with Confidence (Verified Sellers) */}
          <div className="rounded-3xl p-6 bg-gradient-to-b from-[#11192e] to-[#0a0f1d] border border-amber-500/30 text-white shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-4 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Verified Sellers
            </span>
            <h3 className="text-lg font-black mt-1 leading-snug">
              Buy with Confidence
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              All items are verified, authenticated and backed by our secure escrow platform.
            </p>

            <Link
              to="/dashboard/profile"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
            >
              <span>Learn More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Featured Auction */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Featured Auction
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Live
              </span>
            </div>

            <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
                alt="Rare Vintage Painting"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono">
                <Clock className="w-3 h-3 text-rose-400" />
                <span>Ends in 01:22:16</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                Rare Vintage Masterpiece Canvas
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Modern & Fine Art • COA Included</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Current Bid</p>
                <p className="text-base font-black text-slate-900 leading-tight">
                  ₹ 12,40,000
                </p>
              </div>

              <Link
                to="/dashboard/auctions"
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition flex items-center gap-1"
              >
                <span>View Auction</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Popular Categories Row (Screenshot 2 bottom) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Popular Categories</h3>
            <p className="text-xs text-slate-500">Discover top categories with the most active auctions</p>
          </div>
          <Link
            to="/dashboard/auctions"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Haute Horlogerie', count: '45 Active Lots', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80', cat: 'Luxury Watches' },
            { title: 'Collector Vehicles', count: '18 Active Lots', img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80', cat: 'Heritage & Classic Cars' },
            { title: 'Museum Masterpieces', count: '32 Active Lots', img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80', cat: 'Modern & Fine Art' },
            { title: 'Iconic Cricket Relics', count: '14 Active Lots', img: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80', cat: 'Sports Memorabilia' },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(`/dashboard/auctions?category=${encodeURIComponent(item.cat)}`)}
              className="relative h-32 rounded-2xl overflow-hidden group cursor-pointer border border-slate-200/80 shadow-xs"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h4 className="text-xs font-bold">{item.title}</h4>
                <p className="text-[10px] text-amber-300 font-medium">{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

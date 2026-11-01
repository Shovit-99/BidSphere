import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Shield, 
  Trophy, 
  Heart, 
  PlusCircle, 
  DollarSign, 
  Gavel, 
  Layers, 
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage({ 
  auctions = [], 
  onOpenCreate, 
  onOpenWon, 
  onOpenWatchlist, 
  onOpenAdmin,
  onOpenAuction 
}) {
  const { user, isSeller, isAdmin, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Filter seller's auctions or demo auctions
  const myAuctions = auctions.slice(0, 3);

  return (
    <div className="astryx-container py-10 w-full flex-1">
      {/* Profile Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center text-obsidian-950 text-2xl font-bold shadow-gold-glow">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white">{user?.name || 'Bidder Account'}</h1>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gold-400/10 text-gold-300 border border-gold-400/30 font-mono">
                {user?.role?.replace('ROLE_', '') || 'BIDDER'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{user?.email || 'bidder@bidsphere.io'}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenWon}
            className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-2"
          >
            <Trophy size={15} className="text-amber-400" />
            <span>Won Lots & Escrow</span>
          </button>

          {(isSeller || isAdmin) && (
            <button
              onClick={onOpenCreate}
              className="btn btn-primary text-xs py-2 px-3.5 flex items-center gap-2"
            >
              <PlusCircle size={15} />
              <span>List New Item</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="btn btn-gold text-xs py-2 px-3.5 flex items-center gap-2"
            >
              <Shield size={15} />
              <span>Admin Console</span>
            </button>
          )}
        </div>
      </div>

      {/* Role Switcher banner for test convenience */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60">
        <div className="text-xs text-slate-300">
          <span className="font-bold text-white">Active Demo Role:</span> Switch between perspectives to test bidder, seller or admin capabilities.
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => switchDemoRole('BIDDER')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${user?.role === 'ROLE_BIDDER' ? 'bg-gold-400 text-obsidian-950 font-semibold shadow-gold-glow' : 'bg-white/5 text-slate-400 hover:text-white'}`}
          >
            Bidder
          </button>
          <button
            onClick={() => switchDemoRole('SELLER')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${user?.role === 'ROLE_SELLER' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
          >
            Seller
          </button>
          <button
            onClick={() => switchDemoRole('ADMIN')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${user?.role === 'ROLE_ADMIN' ? 'bg-amber-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Balance</span>
            <DollarSign size={18} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">$25,000.00</div>
          <div className="text-[11px] text-emerald-400 mt-1">Available for live bids</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Bids</span>
            <Gavel size={18} className="text-gold-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">3 Auctions</div>
          <div className="text-[11px] text-gold-400 mt-1">Currently leading in 2 lots</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lots Won</span>
            <Trophy size={18} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">2 Items</div>
          <div className="text-[11px] text-amber-400 mt-1">Escrow settlement ready</div>
        </div>
      </div>

      {/* Recent Activity / Watchlist items */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Tracked Live Lots</h2>
          <button 
            onClick={() => navigate('/auctions')}
            className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1"
          >
            <span>Browse More</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="space-y-3">
          {auctions.slice(0, 4).map(item => (
            <div 
              key={item.id}
              onClick={() => onOpenAuction(item)}
              className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-12 h-12 rounded-lg object-cover" 
                />
                <div>
                  <div className="font-semibold text-sm text-white">{item.title}</div>
                  <div className="text-xs text-slate-400">{item.categoryName}</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase">Current Bid</div>
                  <div className="font-mono font-bold text-amber-400">${(item.currentPrice || 0).toLocaleString()}</div>
                </div>
                <span className="btn btn-primary text-xs py-1.5 px-3">Enter Room</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

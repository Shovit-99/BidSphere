import React from 'react';
import { Gavel, HeartHandshake, Trophy, Clock, Flame } from 'lucide-react';

export default function DashboardMetricsCards({
  activeAuctionsCount = 12,
  myBidsCount = 5,
  wonCount = 0,
  endingSoonCount = 4
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Active Auctions */}
      <div className="relative rounded-2xl p-5 bg-gradient-to-br from-[#0c2340] via-[#091829] to-[#071320] border border-blue-500/30 shadow-lg shadow-blue-950/40 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-300">Total Active Auctions</p>
            <h3 className="text-3xl font-black text-white mt-1.5 font-mono">{activeAuctionsCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Gavel size={20} />
          </div>
        </div>
      </div>

      {/* 2. My Active Bids */}
      <div className="relative rounded-2xl p-5 bg-gradient-to-br from-[#2b123c] via-[#1c0a27] to-[#120619] border border-fuchsia-500/30 shadow-lg shadow-purple-950/40 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-fuchsia-300">My Active Bids</p>
            <h3 className="text-3xl font-black text-white mt-1.5 font-mono">{myBidsCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-fuchsia-600/30 border border-fuchsia-500/40 flex items-center justify-center text-fuchsia-400">
            <HeartHandshake size={20} />
          </div>
        </div>
      </div>

      {/* 3. Auctions Won */}
      <div className="relative rounded-2xl p-5 bg-gradient-to-br from-[#06332b] via-[#04221c] to-[#021511] border border-emerald-500/30 shadow-lg shadow-emerald-950/40 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-300">Auctions Won</p>
            <h3 className="text-3xl font-black text-white mt-1.5 font-mono">{wonCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Trophy size={20} />
          </div>
        </div>
      </div>

      {/* 4. Ending Soon (24h) */}
      <div className="relative rounded-2xl p-5 bg-gradient-to-br from-[#382405] via-[#241703] to-[#150d01] border border-amber-500/30 shadow-lg shadow-amber-950/40 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-300">Ending Soon (24h)</p>
            <h3 className="text-3xl font-black text-white mt-1.5 font-mono">{endingSoonCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Clock size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

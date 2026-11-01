import React, { useState, useEffect } from 'react';
import { Trophy, ShieldCheck, CreditCard, Truck, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { formatINR } from '../../lib/currency';
import confetti from 'canvas-confetti';

export default function WonAuctionsPage() {
  const { addToast } = useNotifications();
  const [wonAuctions, setWonAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingAuctionId, setPayingAuctionId] = useState(null);
  const [paying, setPaying] = useState(false);

  const loadWonData = async () => {
    try {
      const res = await api.getWonAuctions();
      if (res && res.content && res.content.length > 0) {
        setWonAuctions(res.content);
      } else {
        // Fallback default sample won auction
        setWonAuctions([
          {
            id: 99,
            title: 'Audemars Piguet Royal Oak "Jumbo" Extra-Thin Ref. 16202ST',
            finalPrice: 32000.00,
            imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
            wonAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
            paymentStatus: 'PAID',
            escrowStatus: 'ESCROW_HELD',
            trackingNumber: 'BS-EXP-774921-US',
            sellerUsername: 'Heritage Timepieces NY'
          },
          {
            id: 104,
            title: '1973 Porsche 911 Carrera RS 2.7 Lightweight',
            finalPrice: 420000.00,
            imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&q=80',
            wonAt: new Date(Date.now() - 3600000 * 12).toISOString(),
            paymentStatus: 'PENDING_PAYMENT',
            escrowStatus: 'AWAITING_FUNDS',
            sellerUsername: 'Classic Vault Geneva'
          }
        ]);
      }
    } catch (e) {
      console.warn('Failed to load won auctions', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWonData();
  }, []);

  const handlePayNow = async (auction) => {
    setPayingAuctionId(auction.id);
    setPaying(true);
    try {
      await api.processPayment(auction.id, {
        amount: auction.finalPrice,
        paymentMethod: 'CREDIT_CARD',
        transactionRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`
      });

      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      addToast({
        type: 'success',
        title: 'Escrow Payment Confirmed',
        message: `Funds for Lot #${auction.id} have been securely deposited into escrow.`
      });

      // Update state locally
      setWonAuctions(prev => prev.map(item => 
        item.id === auction.id 
          ? { ...item, paymentStatus: 'PAID', escrowStatus: 'ESCROW_HELD', trackingNumber: `BS-EXP-${Math.floor(100000 + Math.random() * 900000)}` }
          : item
      ));
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Payment Failed',
        message: err.message || 'Payment processing error. Please try again.'
      });
    } finally {
      setPaying(false);
      setPayingAuctionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Won Auctions & Escrow</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete escrow settlements and track insured white-glove courier deliveries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
            100% Escrow Protected
          </span>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-navy-900 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Checking your won catalog...</p>
        </div>
      ) : wonAuctions.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No Won Auctions Yet"
          description="When you win an auction, it will appear here along with verified escrow settlement and shipment tracking."
          actionLabel="View Live Auctions"
          actionLink="/dashboard/auctions"
        />
      ) : (
        <div className="space-y-4">
          {wonAuctions.map((item) => {
            const isPaid = item.paymentStatus === 'PAID';
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.2 rounded border border-amber-200">
                        Lot #{item.id}
                      </span>
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Escrow Funded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.2 rounded border border-rose-200 animate-pulse">
                          <Clock className="w-3 h-3" /> Settlement Required
                        </span>
                      )}
                    </div>

                    <Link to={`/auctions/${item.id}`} className="text-base font-bold text-slate-900 hover:text-navy-700 transition">
                      {item.title}
                    </Link>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>Seller: <strong className="text-slate-700">{item.sellerUsername}</strong></span>
                      {item.trackingNumber && (
                        <span className="flex items-center gap-1 text-navy-800 font-mono font-medium">
                          <Truck className="w-3.5 h-3.5 text-navy-600" />
                          Tracking: {item.trackingNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 shrink-0">
                  <div className="text-left md:text-right mb-0 md:mb-3">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">Hammer Price</span>
                    <span className="text-xl font-black text-slate-900 font-mono">
                      {formatINR(item.finalPrice)}
                    </span>
                  </div>

                  {isPaid ? (
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold cursor-default"
                    >
                      Payment Complete
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePayNow(item)}
                      disabled={paying && payingAuctionId === item.id}
                      className="px-4 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {paying && payingAuctionId === item.id ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>Fund Escrow Now</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

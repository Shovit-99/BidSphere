import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  ShieldCheck, 
  Clock, 
  Gavel, 
  Award, 
  Truck, 
  RotateCcw, 
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import CountdownTimer from '../components/common/CountdownTimer';
import BidForm from '../components/auction/BidForm';
import BidHistory from '../components/auction/BidHistory';
import AuctionCard from '../components/auction/AuctionCard';
import { api } from '../services/api';
import { wsService } from '../services/websocket';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { INITIAL_AUCTIONS } from '../services/mockData';
import { formatINR } from '../lib/currency';

export default function AuctionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBids, setLoadingBids] = useState(true);
  const [relatedAuctions, setRelatedAuctions] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const fetchAuctionData = async () => {
    try {
      setLoading(true);
      let data = null;
      try {
        data = await api.getAuction(id);
      } catch (e) {
        data = INITIAL_AUCTIONS.find((a) => String(a.id) === String(id));
      }

      if (data) {
        setAuction(data);
        try {
          const allRes = await api.getActiveAuctions();
          const list = (allRes && allRes.content) ? allRes.content : INITIAL_AUCTIONS;
          setRelatedAuctions(list.filter((a) => String(a.id) !== String(id)).slice(0, 3));
        } catch (e) {
          setRelatedAuctions(INITIAL_AUCTIONS.filter((a) => String(a.id) !== String(id)).slice(0, 3));
        }
      }
    } catch (err) {
      console.error('Failed to load auction', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    if (!id) return;
    try {
      setLoadingBids(true);
      const res = await api.getBidHistory(id);
      if (res && res.content) {
        setBids(res.content);
      }
    } catch (e) {
      console.warn('Failed to load bids', e);
    } finally {
      setLoadingBids(false);
    }
  };

  useEffect(() => {
    fetchAuctionData();
    fetchBids();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    wsService.connect();

    const sub = wsService.subscribeToAuction(id, (update) => {
      setAuction((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentPrice: update.amount,
          highestBidder: update.bidderName,
          bidCount: (prev.bidCount || 0) + 1
        };
      });

      setBids((prev) => [
        {
          id: Date.now(),
          amount: update.amount,
          bidderName: update.bidderName,
          bidderId: update.bidderId,
          bidTime: new Date().toISOString()
        },
        ...prev
      ]);
    });

    return () => {
      if (sub && sub.unsubscribe) sub.unsubscribe();
    };
  }, [id]);

  const handleBidSuccess = (amount) => {
    setAuction((prev) => ({
      ...prev,
      currentPrice: amount,
      bidCount: (prev.bidCount || 0) + 1
    }));
    fetchBids();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: auction?.title,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        title: 'Catalogue Link Copied',
        message: 'Direct lot URL copied to clipboard.'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FBF9F5]">
        <div className="w-10 h-10 border-4 border-[#E2D9C8] border-t-[#D95A2B] rounded-full animate-spin mb-4" />
        <p className="text-sm font-serif font-bold text-[#14171A]">Retrieving provenance records...</p>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center bg-[#FBF9F5]">
        <h2 className="font-serif text-3xl font-bold text-[#14171A] mb-2">Lot Not Found</h2>
        <p className="text-sm text-[#7C828D] mb-6">This item may have concluded or the URL is incorrect.</p>
        <Link
          to="/auctions"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#14171A] text-white font-bold text-xs hover:bg-[#232830] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const isLive = auction.status === 'ACTIVE' || auction.status === 'LIVE';

  // Gallery images array
  const galleryImages = [
    auction.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80',
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80',
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#14171A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* ============================================================
            Breadcrumbs & Utility Bar
            ============================================================ */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2D9C8]">
          <nav className="flex items-center gap-2 text-xs text-[#7C828D]">
            <Link to="/" className="hover:text-[#14171A] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
            <Link to="/auctions" className="hover:text-[#14171A] transition">Catalogue</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
            {auction.categoryName && (
              <>
                <span className="hover:text-[#14171A] transition">{auction.categoryName}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </>
            )}
            <span className="font-semibold text-[#14171A] truncate max-w-[200px] sm:max-w-xs font-serif">
              {auction.title}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E2D9C8] text-[#14171A] text-xs font-semibold hover:bg-[#F4EFE6] transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <Link
              to="/auctions"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E2D9C8] text-[#14171A] text-xs font-semibold hover:bg-[#F4EFE6] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalogue</span>
            </Link>
          </div>
        </div>

        {/* ============================================================
            Main Product Presentation Grid
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (7 cols): Gallery + Documentation */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Primary Showcase Image */}
            <div className="bg-white rounded-3xl border border-[#E2D9C8] p-4 sm:p-5 shadow-xs space-y-4">
              <div className="relative aspect-4/3 w-full bg-[#14171A] rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src={galleryImages[activeImageIdx]}
                  alt={auction.title}
                  className="w-full h-full object-cover object-center transition-all duration-500"
                />

                {/* Floating Live Badge */}
                <div className="absolute top-4 left-4">
                  {isLive ? (
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#14171A]/90 text-white shadow-md border border-white/10 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-[#D95A2B] animate-pulse" />
                      LIVE AUCTION IN PROGRESS
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#14171A]/90 text-white backdrop-blur-xs">
                      Auction Concluded
                    </span>
                  )}
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div className="flex items-center gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                      activeImageIdx === idx ? 'border-[#D95A2B] shadow-sm' : 'border-[#E2D9C8] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Authenticity Certificate Strip */}
            <div className="p-5 rounded-2xl bg-[#F4EFE6] border border-[#E2D9C8] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E2D9C8] flex items-center justify-center text-[#D95A2B] shadow-xs shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#14171A]">BidSphere Guaranteed Provenance &amp; Title</h4>
                <p className="text-xs text-[#7C828D] mt-0.5 leading-relaxed">
                  Every lot has undergone physical microscopic verification, title clearance, and authenticity certificate validation.
                </p>
              </div>
            </div>

            {/* Editorial Information Tabs */}
            <div className="bg-white rounded-3xl border border-[#E2D9C8] shadow-xs overflow-hidden">
              <div className="flex border-b border-[#E2D9C8] bg-[#FBF9F5]">
                {['description', 'provenance', 'terms'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer border-b-2 -mb-px ${
                      activeTab === tab
                        ? 'border-[#D95A2B] text-[#D95A2B] bg-white'
                        : 'border-transparent text-[#7C828D] hover:text-[#14171A]'
                    }`}
                  >
                    {tab === 'description' && 'Lot Description'}
                    {tab === 'provenance' && 'Provenance & Specs'}
                    {tab === 'terms' && 'Escrow & Logistics'}
                  </button>
                ))}
              </div>

              <div className="p-6 sm:p-8">
                {activeTab === 'description' && (
                  <div className="space-y-4 text-sm text-[#4A505A] leading-relaxed">
                    <p>{auction.description || 'This extraordinary lot is presented in impeccable collector condition. Offered directly from an esteemed private collection with complete matching documentation and original accessories.'}</p>
                    <h4 className="font-serif text-base font-bold text-[#14171A] pt-2">Specialist Inspection Notes</h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#7C828D]">
                      <li>Complete original accessories, box, and certificate of authenticity included</li>
                      <li>Single-owner provenance maintained under climate-controlled vault storage</li>
                      <li>Physical grading report: 9.8 / Mint Collector</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'provenance' && (
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E2D9C8]">
                      <span className="text-[#7C828D] block mb-1">Collecting Discipline</span>
                      <span className="font-semibold text-[#14171A]">{auction.categoryName || 'Fine Horology'}</span>
                    </div>
                    <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E2D9C8]">
                      <span className="text-[#7C828D] block mb-1">Starting Price</span>
                      <span className="font-bold text-[#14171A] font-mono">{formatINR(auction.startingPrice)}</span>
                    </div>
                    <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E2D9C8]">
                      <span className="text-[#7C828D] block mb-1">Minimum Increment</span>
                      <span className="font-bold text-[#14171A] font-mono">{formatINR(auction.minIncrement || 5000)}</span>
                    </div>
                    <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E2D9C8]">
                      <span className="text-[#7C828D] block mb-1">Authorized Consignor</span>
                      <span className="font-semibold text-[#14171A]">{auction.sellerUsername || 'Verified Consignor'}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'terms' && (
                  <div className="space-y-4 text-xs text-[#4A505A] leading-relaxed">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-[#D95A2B] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#14171A] block font-serif text-sm">Armored Courier Transit</strong>
                        Insured white-glove transport with live telemetry and armed handover upon signature.
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pt-3 border-t border-[#E2D9C8]">
                      <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#14171A] block font-serif text-sm">Institutional Escrow Protection</strong>
                        Your hammer payment is held securely in escrow until you inspect and accept the physical lot.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Header, Countdown, Bidding Station & History */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title & Countdown Panel */}
            <div className="bg-white rounded-3xl border border-[#E2D9C8] p-6 sm:p-7 shadow-xs space-y-5">
              <div>
                <span className="text-[11px] font-bold text-[#D95A2B] bg-[#FAF0EB] px-3 py-1 rounded-full border border-[#D95A2B]/20 inline-block mb-2 font-mono">
                  Lot #{auction.id}
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#14171A] tracking-tight leading-snug">
                  {auction.title}
                </h1>
                <p className="text-xs text-[#7C828D] mt-2 flex items-center gap-1.5">
                  <span>Consigned by</span>
                  <span className="font-bold text-[#14171A]">{auction.sellerUsername || 'Consignor'}</span>
                  <span className="text-[#C5A059] font-bold">★ 4.98</span>
                </p>
              </div>

              {/* Countdown Unit */}
              <div className="p-4 bg-[#F4EFE6] rounded-2xl border border-[#E2D9C8]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C828D]">Countdown</span>
                  <span className="text-xs font-semibold text-[#D95A2B]">
                    {isLive ? 'Live Bidding Active' : 'Concluded'}
                  </span>
                </div>
                {auction.endTime && (
                  <CountdownTimer endTime={auction.endTime} variant="boxes" />
                )}
              </div>
            </div>

            {/* Live Bidding Station */}
            <BidForm
              auction={auction}
              onBidSuccess={handleBidSuccess}
            />

            {/* Real-time Bid History Feed */}
            <BidHistory
              bids={bids}
              loading={loadingBids}
            />

          </div>

        </div>

        {/* ============================================================
            Related Catalogue Lots
            ============================================================ */}
        {relatedAuctions.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#E2D9C8]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#14171A]">More From This Collection</h3>
                <p className="text-xs text-[#7C828D] mt-0.5">Explore companion pieces currently open for bidding</p>
              </div>
              <Link
                to="/auctions"
                className="text-xs font-bold text-[#D95A2B] hover:text-[#C04B1F] flex items-center gap-1"
              >
                <span>View All Lots</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedAuctions.map((rel) => (
                <AuctionCard key={rel.id} auction={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Gavel, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Lock, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Truck, 
  ChevronRight, 
  Search, 
  ChevronDown,
  Quote,
  HelpCircle,
  Plus,
  Minus
} from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import Footer from '../components/layout/Footer';
import AuctionCard from '../components/auction/AuctionCard';
import CountdownTimer from '../components/common/CountdownTimer';
import { INITIAL_AUCTIONS } from '../services/mockData';
import { formatINR } from '../lib/currency';

export default function LandingPage({
  auctions = [],
  categories = [],
  onOpenAuction
}) {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const lots = auctions && auctions.length > 0 ? auctions : INITIAL_AUCTIONS;
  const featuredLot = lots.find(l => l.id === 100) || lots[0];
  const liveLots = lots.filter(l => (l.status === 'ACTIVE' || l.status === 'LIVE') && l.id !== featuredLot.id).slice(0, 4);
  const upcomingLots = lots.filter(l => l.status === 'UPCOMING').slice(0, 3);

  const collections = [
    { 
      id: 'WATCHES', 
      title: 'Haute Horlogerie', 
      subtitle: 'Swiss chronographs & rare Indian mechanical dials',
      count: '48 Lots', 
      img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
      category: 'Luxury Watches'
    },
    { 
      id: 'CARS', 
      title: 'Supercars & Classics', 
      subtitle: 'Exotic motorcars & matching-number restorations',
      count: '28 Lots', 
      img: '/images/hero-supercar.jpg',
      category: 'Heritage & Classic Cars'
    },
    { 
      id: 'ART', 
      title: 'Modern & Fine Art', 
      subtitle: 'Original canvases & museum-verified sculptures',
      count: '64 Lots', 
      img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80',
      category: 'Modern & Fine Art'
    },
    { 
      id: 'SPORTS', 
      title: 'Historic Memorabilia', 
      subtitle: 'Signed cricket relics & trophy archive pieces',
      count: '19 Lots', 
      img: '/images/sachin-bat.jpg',
      category: 'Sports Memorabilia'
    }
  ];

  const testimonials = [
    {
      quote: "BidSphere has redefined luxury auction acquisitions in India. The anti-snipe clock gave me time to evaluate my final bid on an impossible-to-find vintage timepiece.",
      author: "Vikramaditya S.",
      role: "Private Horology Collector, Mumbai",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80"
    },
    {
      quote: "The physical condition report was identical to the delivered art canvas. Funds remained in escrow until my appraisal was completed. World-class institutional execution.",
      author: "Devika P.",
      role: "Art Curator & Patron, Geneva",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80"
    },
    {
      quote: "Consigning my collector motorcar through BidSphere yielded a final hammer price 22% above reserve. The telemetry and buyer qualification are unparalleled.",
      author: "Capt. Rajesh N.",
      role: "Automotive Heritage Consignor, Pune",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80"
    }
  ];

  const faqs = [
    {
      q: "How does BidSphere guarantee provenance and physical condition?",
      a: "Every lot cataloged on BidSphere undergoes mandatory hands-on verification by certified specialists before publication. Condition reports, microscopic inspection photographs, and title documentation are archived permanently."
    },
    {
      q: "What is the Anti-Snipe Guarantee?",
      a: "If a bid is entered in the final 60 seconds of any auction, the closing countdown automatically extends by another 60 seconds. This prevents automated bot sniping and allows authentic connoisseurs to respond fairly."
    },
    {
      q: "How does the Escrow Settlement process protect bidders and consignors?",
      a: "Winning hammer payments are held in an encrypted institutional escrow vault. Funds are only disbursed to the consignor once the winning bidder has received, physically inspected, and accepted the lot."
    },
    {
      q: "How are high-value lots delivered?",
      a: "Dispatched exclusively via armored transit courier or specialized climate-controlled transport with live telemetry and armed handover upon signature verification."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#14171A] font-sans antialiased">
      <PublicNavbar />

      {/* ============================================================
          1. LARGE TYPOGRAPHIC EDITORIAL HERO
          ============================================================ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#FBF9F5] border-b border-[#E2D9C8] overflow-hidden">
        {/* Soft Warm Radial Lighting */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_top_right,rgba(217,90,43,0.06),transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(197,160,89,0.08),transparent_70%)] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Refined Editorial Serif Headline */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Release Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4EFE6] border border-[#E2D9C8] text-[11px] font-bold text-[#D95A2B] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#D95A2B] animate-pulse inline-block" />
                <span>Spring 2026 Marquee Collections</span>
                <span className="text-[#C5A059]">•</span>
                <span className="text-[#14171A]">Anti-Snipe Protected</span>
              </div>

              {/* Refined Headline with Christie's/Sotheby's Balance */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-medium tracking-tight text-[#14171A] leading-[1.16]">
                Where Historic Provenance Meets{' '}
                <span className="italic font-light text-[#D95A2B]">Digital Bidding.</span>
              </h1>

              {/* Airy Subtitle */}
              <p className="text-base sm:text-lg text-[#5A606A] font-light max-w-xl mx-auto lg:mx-0 leading-relaxed tracking-normal">
                Discover exceptional fine art, rare horology, and marquee motorcars. Experience sub-15ms live bidding with physical condition verification and guaranteed escrow settlements.
              </p>

              {/* Capsule CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
                <Link
                  to="/auctions"
                  className="px-8 py-4 rounded-full bg-[#D95A2B] hover:bg-[#C04B1F] active:bg-[#A83F17] text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-[#D95A2B]/20 flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Gavel className="w-4 h-4" />
                  <span>Explore The Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/register"
                  className="px-8 py-4 rounded-full bg-white hover:bg-[#FAF8F5] border-2 border-stone-800/20 hover:border-stone-800/50 text-stone-900 font-bold text-sm transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
                >
                  <span>Consign With Us</span>
                </Link>
              </div>

              {/* Trust Pillars */}
              <div className="pt-6 border-t border-[#E2D9C8] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#7C828D]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>100% Certified Provenance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#D95A2B]" />
                  <span>Zero-Lag STOMP Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#14171A]" />
                  <span>Escrow Safe Settlement</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Featured Auction Showcase (Archival Provenance Card) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-[#E2D9C8] p-5 shadow-[0_16px_40px_-10px_rgba(20,23,26,0.08)] relative group">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#14171A]">
                  <img
                    src={featuredLot.imageUrl}
                    alt={featuredLot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = '/assets/watch.jpg';
                    }}
                  />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#14171A]/90 text-white shadow-md border border-white/10 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-[#D95A2B] animate-pulse" />
                      MARQUEE LOT #{featuredLot.id}
                    </span>
                  </div>

                  {/* Provenance Verification Overlay */}
                  <div className="absolute top-3.5 right-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#14171A]/90 text-[#C5A059] border border-[#C5A059]/40 backdrop-blur-md shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>COA Included</span>
                    </span>
                  </div>

                  {/* High-Contrast Legible Timer Pill */}
                  {featuredLot.endTime && (
                    <div className="absolute bottom-3.5 left-3.5">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14171A]/95 backdrop-blur-md text-white text-xs font-mono border border-white/20 shadow-xl">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="font-bold text-red-400 tracking-wider">CLOSING SOON:</span>
                        <span className="font-bold text-white tracking-wide">
                          <CountdownTimer endTime={featuredLot.endTime} variant="badge" />
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#7C828D]">
                    <span className="font-semibold uppercase tracking-wider text-[#D95A2B]">
                      {featuredLot.categoryName || 'Fine Collectibles'}
                    </span>
                    <span className="text-[#4A505A]">Issuing Authority: {featuredLot.issuingAuthority || 'Geneva Archive'}</span>
                  </div>

                  {/* Full 2-line title without clipping */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#14171A] line-clamp-2 min-h-[3.25rem] leading-snug group-hover:text-[#D95A2B] transition-colors">
                    {featuredLot.title}
                  </h3>

                  <div className="pt-3 border-t border-[#EFE9DF] flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C828D] block">Current Bid</span>
                      <span className="text-2xl font-black text-[#D95A2B] font-mono leading-none">
                        {formatINR(featuredLot.currentPrice || featuredLot.startingPrice)}
                      </span>
                      <span className="text-[11px] font-semibold text-[#14171A] block mt-1">
                        <span className="text-[#7C828D] font-normal">Next Min Bid: </span>
                        <span className="font-mono font-bold text-[#14171A]">
                          {formatINR((featuredLot.currentPrice || featuredLot.startingPrice) + (featuredLot.minIncrement || 10000))}
                        </span>
                        <span className="text-[10px] text-[#7C828D] font-mono"> (+{formatINR(featuredLot.minIncrement || 10000)})</span>
                      </span>
                    </div>

                    <Link
                      to={`/auctions/${featuredLot.id}`}
                      className="px-6 py-3 rounded-full bg-[#14171A] hover:bg-[#D95A2B] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Enter Bid</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          2. PLATFORM METRICS STRIP
          ============================================================ */}
      <section className="bg-[#F4EFE6] border-b border-[#E2D9C8] py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-[#E2D9C8]">
            <div>
              <p className="font-mono text-3xl font-black text-[#14171A]">₹48.5 Cr+</p>
              <p className="text-xs font-semibold text-[#7C828D] uppercase tracking-wider mt-1">Total Hammer Volume</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-black text-[#14171A]">&lt;15ms</p>
              <p className="text-xs font-semibold text-[#7C828D] uppercase tracking-wider mt-1">WebSocket Latency</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-black text-[#14171A]">99.9%</p>
              <p className="text-xs font-semibold text-[#7C828D] uppercase tracking-wider mt-1">Escrow Success Rate</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-black text-[#14171A]">28,000+</p>
              <p className="text-xs font-semibold text-[#7C828D] uppercase tracking-wider mt-1">Verified Collectors</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. CURATED COLLECTIONS (DISCIPLINES)
          ============================================================ */}
      <section id="categories" className="py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D95A2B] bg-[#FAF0EB] px-3 py-1 rounded-full border border-[#D95A2B]/20 inline-block mb-2">
              Curated Departments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#14171A] tracking-tight">
              Collecting Disciplines
            </h2>
            <p className="text-sm text-[#7C828D] mt-1">Specialized catalogs curated by credentialed department heads</p>
          </div>

          <Link
            to="/auctions"
            className="text-xs font-bold text-[#D95A2B] hover:text-[#C04B1F] flex items-center gap-1.5"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              to={`/auctions?category=${encodeURIComponent(col.category)}`}
              className="group relative rounded-3xl overflow-hidden aspect-3/4 border border-[#E2D9C8] shadow-xs flex flex-col justify-end p-6 bg-[#14171A]"
            >
              <img
                src={col.img}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* High-Contrast Multi-Stop Gradient Overlay for Superior Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F12] via-[#14171A]/80 via-45% to-black/20" />
              
              <div className="relative z-10 text-white space-y-1.5">
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/15 px-2.5 py-0.5 rounded border border-[#C5A059]/30 backdrop-blur-xs">
                  {col.count}
                </span>
                <h4 className="font-serif text-2xl font-bold leading-snug group-hover:text-[#D95A2B] transition-colors drop-shadow-sm">
                  {col.title}
                </h4>
                <p className="text-xs text-slate-200 line-clamp-1 leading-relaxed drop-shadow-xs">
                  {col.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-[#D95A2B] group-hover:translate-x-1 transition-transform">
                  <span>Explore Department</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          4. LIVE AUCTIONS SECTION
          ============================================================ */}
      <section className="py-20 bg-[#F4EFE6] border-y border-[#E2D9C8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D95A2B] bg-white px-3 py-1 rounded-full border border-[#E2D9C8]">
                  <span className="w-2 h-2 rounded-full bg-[#D95A2B] animate-pulse" />
                  <span>Live Marketplace</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Feed Connected • 12ms STOMP</span>
                </div>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#14171A] tracking-tight">
                Auctions Closing Today
              </h2>
              <p className="text-sm text-[#7C828D] mt-1">Live bidding active with automated 60-second anti-snipe clock extensions</p>
            </div>

            <Link
              to="/auctions"
              className="text-xs font-bold text-[#14171A] hover:text-[#D95A2B] flex items-center gap-1"
            >
              <span>Explore All Live Lots</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveLots.map((auc) => (
              <AuctionCard
                key={auc.id}
                auction={auc}
                onOpenAuction={onOpenAuction}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          5. UPCOMING AUCTIONS SECTION
          ============================================================ */}
      {upcomingLots.length > 0 && (
        <section className="py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7C828D] bg-white px-3 py-1 rounded-full border border-[#E2D9C8] inline-block mb-2">
                Opening Soon
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#14171A] tracking-tight">
                Upcoming Sales &amp; Previews
              </h2>
              <p className="text-sm text-[#7C828D] mt-1">Register advance interest and inspect condition reports prior to opening</p>
            </div>

            <Link
              to="/auctions"
              className="text-xs font-bold text-[#D95A2B] hover:underline"
            >
              View Upcoming Calendar →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingLots.map((auc) => (
              <AuctionCard
                key={auc.id}
                auction={auc}
                onOpenAuction={onOpenAuction}
              />
            ))}
          </div>
        </section>
      )}

      {/* ============================================================
          6. HOW IT WORKS (3-Step Institutional Process)
          ============================================================ */}
      <section id="how-it-works" className="py-20 bg-white border-y border-[#E2D9C8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D95A2B] bg-[#FAF0EB] px-3 py-1 rounded-full inline-block mb-3 border border-[#D95A2B]/20">
              Institutional Protocol
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-black text-[#14171A] tracking-tight">
              How Bidding Works on BidSphere
            </h3>
            <p className="text-sm text-[#7C828D] mt-2">
              Engineered with financial-grade precision to eliminate bot sniping, authenticate provenance, and protect capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FBF9F5] rounded-3xl p-8 border border-[#E2D9C8] relative">
              <span className="text-4xl font-mono font-black text-[#E2D9C8] absolute top-6 right-6">01</span>
              <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] border border-[#E2D9C8] text-[#14171A] flex items-center justify-center mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#14171A] mb-2">Curate &amp; Inspect</h4>
              <p className="text-xs sm:text-sm text-[#4A505A] leading-relaxed">
                Every lot undergoes microscopic inspection, authenticity verification, and title confirmation before catalog publication.
              </p>
            </div>

            <div className="bg-[#FBF9F5] rounded-3xl p-8 border border-[#E2D9C8] relative">
              <span className="text-4xl font-mono font-black text-[#E2D9C8] absolute top-6 right-6">02</span>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0EB] border border-[#D95A2B]/30 text-[#D95A2B] flex items-center justify-center mb-6">
                <Gavel className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#14171A] mb-2">Compete in Real-Time</h4>
              <p className="text-xs sm:text-sm text-[#4A505A] leading-relaxed">
                Place bids with instantaneous sub-15ms WebSocket updates. If a bid arrives in the final 60 seconds, anti-sniping extends the clock.
              </p>
            </div>

            <div className="bg-[#FBF9F5] rounded-3xl p-8 border border-[#E2D9C8] relative">
              <span className="text-4xl font-mono font-black text-[#E2D9C8] absolute top-6 right-6">03</span>
              <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] border border-[#C5A059]/40 text-[#C5A059] flex items-center justify-center mb-6">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#14171A] mb-2">Escrow &amp; Armored Transit</h4>
              <p className="text-xs sm:text-sm text-[#4A505A] leading-relaxed">
                Winning bids are settled via encrypted escrow. Funds disburse only after physical delivery and acceptance verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. TRUST & SECURITY PROMISE
          ============================================================ */}
      <section className="py-20 bg-[#14171A] text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D95A2B] bg-[#D95A2B]/10 px-3 py-1 rounded-full border border-[#D95A2B]/20">
                Fair-Auction Architecture
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-black text-white leading-tight">
                Zero Last-Second Bot Sniping. Guaranteed.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                Conventional auction platforms allow automated scripts to steal lots in the final millisecond. BidSphere’s automated anti-snipe engine extends the clock whenever a bid is submitted in the final minute, giving genuine connoisseurs an honest opportunity to respond.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link
                to="/register"
                className="px-8 py-4 rounded-full bg-[#D95A2B] hover:bg-[#C04B1F] active:bg-[#A83F17] text-white font-bold text-sm shadow-xl shadow-[#D95A2B]/25 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                Join as Verified Collector
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          8. TESTIMONIALS (CONNOISSEURS & CONSIGNORS)
          ============================================================ */}
      <section className="py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] bg-white px-3 py-1 rounded-full border border-[#E2D9C8] inline-block mb-2">
            Patron Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#14171A] tracking-tight">
            Trusted by Connoisseurs Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-[#E2D9C8] shadow-xs flex flex-col justify-between space-y-6">
              <Quote className="w-8 h-8 text-[#D95A2B]/40" />
              <p className="text-sm text-[#4A505A] leading-relaxed italic font-serif">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#EFE9DF]">
                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover border border-[#E2D9C8]" />
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#14171A]">{t.author}</h4>
                  <p className="text-[11px] text-[#7C828D]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          9. FREQUENTLY ASKED QUESTIONS (ACCORDION)
          ============================================================ */}
      <section className="py-20 bg-[#F4EFE6] border-t border-[#E2D9C8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D95A2B] bg-white px-3 py-1 rounded-full border border-[#E2D9C8] inline-block mb-2">
              Frequently Asked Questions
            </span>
            <h2 className="font-serif text-3xl font-black text-[#14171A] tracking-tight">
              Essential Inquiries
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="bg-white rounded-2xl border border-[#E2D9C8] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FBF9F5] transition"
                  >
                    <span className="font-serif text-base font-bold text-[#14171A]">{faq.q}</span>
                    <div className="w-7 h-7 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#D95A2B] shrink-0">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#4A505A] leading-relaxed border-t border-[#F4EFE6] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          10. FOOTER
          ============================================================ */}
      <Footer />
    </div>
  );
}

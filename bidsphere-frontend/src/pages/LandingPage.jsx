import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Gavel, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Search, 
  Truck, 
  ChevronRight, 
  Quote, 
  Plus, 
  Minus 
} from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/HeroSection';
import AuctionCard from '../components/auction/AuctionCard';
import { INITIAL_AUCTIONS } from '../services/mockData';

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

  const collections = [
    { 
      id: 'WATCHES', 
      title: 'Haute Horlogerie', 
      subtitle: 'Swiss chronographs & rare mechanical dials',
      count: '48 lots', 
      img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
      category: 'Luxury Watches'
    },
    { 
      id: 'CARS', 
      title: 'Supercars & Classics', 
      subtitle: 'Exotic motorcars & matching-number restorations',
      count: '28 lots', 
      img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80',
      category: 'Heritage & Classic Cars'
    },
    { 
      id: 'ART', 
      title: 'Modern & Fine Art', 
      subtitle: 'Original canvases & museum-verified sculptures',
      count: '64 lots', 
      img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80',
      category: 'Modern & Fine Art'
    },
    { 
      id: 'SPORTS', 
      title: 'Historic Memorabilia', 
      subtitle: 'Signed cricket relics & trophy archive pieces',
      count: '19 lots', 
      img: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
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
    <div className="min-h-screen bg-[#FBF9F5] text-[#121416] font-sans antialiased">
      {/* Navigation */}
      <PublicNavbar />

      {/* ============================================================
          1. HERO & 2. TRUST INDICATORS (Inside HeroSection)
          Reduced vertical padding ensures metrics section is visible above the fold
          ============================================================ */}
      <HeroSection 
        featuredLot={featuredLot} 
        onOpenAuction={onOpenAuction} 
      />

      {/* ============================================================
          3. KEY MARKETPLACE METRICS STRIP (Visible Above the Fold)
          ============================================================ */}
      <section className="bg-[#F4EFE6] border-b border-[#E2D9C8] py-5 sm:py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-[#E2D9C8]">
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-black text-[#121416]">₹48.5 Cr+</p>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-1">Total hammer volume</p>
            </div>
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-black text-[#121416]">&lt;15ms</p>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-1">Live bidding latency</p>
            </div>
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-black text-[#121416]">99.9%</p>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-1">Escrow settlement rate</p>
            </div>
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-black text-[#121416]">28,000+</p>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-1">Verified collectors</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          4. FEATURED AUCTIONS (Auctions Closing Today)
          ============================================================ */}
      <section className="py-14 sm:py-18 bg-[#FBF9F5] border-b border-[#E2D9C8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e85b2a] bg-white px-3 py-1 rounded-full border border-[#E2D9C8]">
                  <span className="w-2 h-2 rounded-full bg-[#e85b2a] animate-pulse" />
                  <span>Live marketplace</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live bidding • 12ms</span>
                </div>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#121416] tracking-tight">
                Auctions closing today
              </h2>
              <p className="text-sm text-stone-500 mt-1">Live bidding active with automated 60-second anti-snipe clock extensions</p>
            </div>

            <Link
              to="/auctions"
              className="text-xs font-bold text-[#121416] hover:text-[#e85b2a] flex items-center gap-1.5 transition-colors"
            >
              <span>Explore all live lots</span>
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
          5. CATEGORIES (Collecting Disciplines)
          Placed before How It Works as required
          ============================================================ */}
      <section id="categories" className="py-14 sm:py-18 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#e85b2a] bg-[#FAF0EB] px-3 py-1 rounded-full border border-[#e85b2a]/20 inline-block mb-2">
              Curated Departments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#121416] tracking-tight">
              Collecting disciplines
            </h2>
            <p className="text-sm text-stone-500 mt-1">Specialized catalogs curated by credentialed department heads</p>
          </div>

          <Link
            to="/auctions"
            className="text-xs font-bold text-[#e85b2a] hover:text-[#cf4d1f] flex items-center gap-1.5 transition-colors"
          >
            <span>View all departments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              to={`/auctions?category=${encodeURIComponent(col.category)}`}
              className="group relative rounded-[20px] overflow-hidden aspect-3/4 border border-[#E2D9C8] shadow-xs flex flex-col justify-end p-6 bg-[#121416]"
            >
              <img
                src={col.img}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* High-Contrast Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F12] via-[#121416]/80 via-45% to-black/20" />
              
              <div className="relative z-10 text-white space-y-1.5">
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/15 px-2.5 py-0.5 rounded border border-[#C5A059]/30 backdrop-blur-xs">
                  {col.count}
                </span>
                <h4 className="font-serif text-2xl font-bold leading-snug group-hover:text-[#e85b2a] transition-colors drop-shadow-sm">
                  {col.title}
                </h4>
                <p className="text-xs text-slate-200 line-clamp-1 leading-relaxed drop-shadow-xs">
                  {col.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-[#e85b2a] group-hover:translate-x-1 transition-transform">
                  <span>Explore department</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          6. HOW IT WORKS (3-Step Institutional Protocol)
          ============================================================ */}
      <section id="how-it-works" className="py-14 sm:py-18 bg-white border-y border-[#E2D9C8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#e85b2a] bg-[#FAF0EB] px-3 py-1 rounded-full inline-block mb-3 border border-[#e85b2a]/20">
              Institutional Protocol
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-black text-[#121416] tracking-tight">
              How bidding works on BidSphere
            </h3>
            <p className="text-sm text-stone-500 mt-2">
              Engineered with financial-grade precision to eliminate bot sniping, authenticate provenance, and protect capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-[#FBF9F5] rounded-[20px] p-7 border border-[#E2D9C8] relative">
              <span className="text-4xl font-mono font-black text-[#E2D9C8] absolute top-6 right-6">01</span>
              <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] border border-[#E2D9C8] text-[#121416] flex items-center justify-center mb-5">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#121416] mb-2">Curate &amp; inspect</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Every lot undergoes microscopic inspection, authenticity verification, and title confirmation before catalog publication.
              </p>
            </div>

            <div className="bg-[#FBF9F5] rounded-[20px] p-7 border border-[#E2D9C8] relative">
              <span className="text-4xl font-mono font-black text-[#E2D9C8] absolute top-6 right-6">02</span>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0EB] border border-[#e85b2a]/30 text-[#e85b2a] flex items-center justify-center mb-5">
                <Gavel className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#121416] mb-2">Compete in real-time</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Place bids with instantaneous sub-15ms WebSocket updates. If a bid arrives in the final 60 seconds, anti-sniping extends the clock.
              </p>
            </div>

            <div className="bg-[#FBF9F5] rounded-[20px] p-7 border border-[#E2D9C8] relative">
              <span className="text-4xl font-mono font-black text-[#E2D9C8] absolute top-6 right-6">03</span>
              <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] border border-[#C5A059]/40 text-[#C5A059] flex items-center justify-center mb-5">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#121416] mb-2">Escrow &amp; armored transit</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Winning bids are settled via encrypted escrow. Funds disburse only after physical delivery and acceptance verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. FINAL CONSIGN CTA (Fair-Auction Architecture)
          ============================================================ */}
      <section className="py-16 sm:py-20 bg-[#121416] text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#e85b2a] bg-[#e85b2a]/10 px-3 py-1 rounded-full border border-[#e85b2a]/20">
                Fair-auction architecture
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-black text-white leading-tight">
                Zero last-second bot sniping. Guaranteed.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                Conventional auction platforms allow automated scripts to steal lots in the final millisecond. BidSphere’s automated anti-snipe engine extends the clock whenever a bid is submitted in the final minute, giving genuine connoisseurs an honest opportunity to respond.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:justify-end gap-3">
              <Link
                to="/register"
                className="px-7 py-3.5 rounded-[14px] bg-[#e85b2a] hover:bg-[#cf4d1f] active:bg-[#b54016] text-white font-bold text-sm shadow-lg shadow-[#e85b2a]/25 transition transform hover:-translate-y-0.5 cursor-pointer text-center"
              >
                Join as verified collector
              </Link>
              <Link
                to="/register"
                className="px-6 py-3.5 rounded-[14px] bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition cursor-pointer text-center"
              >
                Consign with us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TESTIMONIALS & FAQ (Institutional Trust)
          ============================================================ */}
      <section className="py-14 sm:py-18 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] bg-white px-3 py-1 rounded-full border border-[#E2D9C8] inline-block mb-2">
            Patron Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#121416] tracking-tight">
            Trusted by connoisseurs worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-[20px] p-7 border border-[#E2D9C8] shadow-xs flex flex-col justify-between space-y-5">
              <Quote className="w-8 h-8 text-[#e85b2a]/40" />
              <p className="text-sm text-stone-600 leading-relaxed italic font-serif">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#EFE9DF]">
                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover border border-[#E2D9C8]" />
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#121416]">{t.author}</h4>
                  <p className="text-[11px] text-stone-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-14 sm:py-18 bg-[#F4EFE6] border-t border-[#E2D9C8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#e85b2a] bg-white px-3 py-1 rounded-full border border-[#E2D9C8] inline-block mb-2">
              Frequently Asked Questions
            </span>
            <h2 className="font-serif text-3xl font-black text-[#121416] tracking-tight">
              Essential inquiries
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="bg-white rounded-[14px] border border-[#E2D9C8] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FBF9F5] transition"
                  >
                    <span className="font-serif text-base font-bold text-[#121416]">{faq.q}</span>
                    <div className="w-7 h-7 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#e85b2a] shrink-0">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-[#F4EFE6] pt-3">
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
          8. FOOTER
          ============================================================ */}
      <Footer />
    </div>
  );
}

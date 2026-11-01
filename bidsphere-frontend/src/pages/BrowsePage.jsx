import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AuctionCard from '../components/auction/AuctionCard';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import Pagination from '../components/common/Pagination';
import { 
  Gavel, 
  Search, 
  ChevronDown, 
  SlidersHorizontal, 
  RotateCcw, 
  Sparkles, 
  Tag, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Filter,
  X,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { INITIAL_AUCTIONS } from '../services/mockData';
import { formatINR } from '../lib/currency';

export default function BrowsePage({
  auctions = [],
  loading = false,
  onOpenAuction,
  watchlistIds = [],
  onWatchlistChange
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Lots');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceMax, setPriceMax] = useState(10000000);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('endingSoon');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(9);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with URL params
  useEffect(() => {
    if (searchParams.get('q')) setSearchQuery(searchParams.get('q'));
    if (searchParams.get('category')) setSelectedCategory(searchParams.get('category'));
  }, [searchParams]);

  const categoriesList = [
    { name: 'All Lots', count: 12 },
    { name: 'Luxury Watches', count: 4 },
    { name: 'Heritage & Classic Cars', count: 3 },
    { name: 'Modern & Fine Art', count: 2 },
    { name: 'High-End Electronics', count: 1 },
    { name: 'Sports Memorabilia', count: 2 }
  ];

  const brandList = ['Rolex', 'McLaren', 'HMT', 'Mercedes-Benz', 'Van Gogh', 'Adidas', 'Apple'];
  const conditionList = ['All', 'NEW_UNWORN', 'MINT_COLLECTOR', 'EXCELLENT', 'LIKE_NEW', 'GRADED_PSA_9'];
  const locationList = ['All', 'Mumbai', 'Geneva', 'Jaipur', 'Pune', 'National Archives'];

  const activeLots = auctions && auctions.length > 0 ? auctions : INITIAL_AUCTIONS;

  // Filter logic
  let filtered = [...activeLots];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(a =>
      a.title?.toLowerCase().includes(q) ||
      (a.description && a.description.toLowerCase().includes(q)) ||
      (a.categoryName && a.categoryName.toLowerCase().includes(q)) ||
      (a.sellerName && a.sellerName.toLowerCase().includes(q)) ||
      (a.sellerUsername && a.sellerUsername.toLowerCase().includes(q))
    );
  }

  if (selectedCategory && selectedCategory !== 'All Lots') {
    filtered = filtered.filter(a =>
      a.categoryName?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(a.categoryName?.toLowerCase() || '')
    );
  }

  if (selectedBrand) {
    filtered = filtered.filter(a =>
      a.title?.toLowerCase().includes(selectedBrand.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(selectedBrand.toLowerCase()))
    );
  }

  if (priceMax) {
    filtered = filtered.filter(a => {
      const p = a.currentPrice || a.startingPrice || 0;
      return p <= priceMax;
    });
  }

  if (selectedStatus !== 'All') {
    if (selectedStatus === 'Live Now') {
      filtered = filtered.filter(a => a.status === 'ACTIVE' || a.status === 'LIVE');
    } else if (selectedStatus === 'Upcoming') {
      filtered = filtered.filter(a => a.status === 'UPCOMING');
    } else if (selectedStatus === 'Ended') {
      filtered = filtered.filter(a => a.status === 'ENDED' || a.status === 'COMPLETED');
    }
  }

  if (selectedCondition !== 'All') {
    filtered = filtered.filter(a => a.condition === selectedCondition);
  }

  if (selectedLocation !== 'All') {
    filtered = filtered.filter(a =>
      a.sellerName?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(selectedLocation.toLowerCase()))
    );
  }

  // Sorting
  if (sortBy === 'endingSoon') {
    filtered.sort((a, b) => new Date(a.endTime || 0).getTime() - new Date(b.endTime || 0).getTime());
  } else if (sortBy === 'priceHigh') {
    filtered.sort((a, b) => (Number(b.currentPrice || b.startingPrice || 0)) - (Number(a.currentPrice || a.startingPrice || 0)));
  } else if (sortBy === 'priceLow') {
    filtered.sort((a, b) => (Number(a.currentPrice || a.startingPrice || 0)) - (Number(b.currentPrice || b.startingPrice || 0)));
  } else if (sortBy === 'mostBids') {
    filtered.sort((a, b) => (b.bidCount || 0) - (a.bidCount || 0));
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedItems = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Lots');
    setSelectedBrand('');
    setPriceMax(10000000);
    setSelectedStatus('All');
    setSelectedCondition('All');
    setSelectedLocation('All');
    setSortBy('endingSoon');
    setCurrentPage(0);
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'All Lots' || selectedBrand || priceMax < 10000000 || selectedStatus !== 'All' || selectedCondition !== 'All' || selectedLocation !== 'All';

  return (
    <div className="w-full bg-[#FBF9F5] text-[#14171A] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ============================================================
            1. EDITORIAL PROMOTIONAL BANNER
            ============================================================ */}
        <div className="relative rounded-3xl bg-[#F4EFE6] border border-[#E2D9C8] p-6 sm:p-10 overflow-hidden shadow-xs">
          {/* Subtle antique background watermark */}
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_right,rgba(197,160,89,0.12),transparent)] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2D9C8] text-[11px] font-bold text-[#D95A2B] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Spring 2026 Marquee Catalogue</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#14171A] leading-tight">
              International Auction Catalogue
            </h1>

            <p className="text-sm sm:text-base text-[#4A505A] leading-relaxed font-normal">
              Rare horology, museum-grade fine art, signed sporting relics, and collector motorcars. Authenticated with physical provenance inspection and settled via encrypted escrow.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-[#7C828D]">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                100% Verified Provenance
              </span>
              <span>•</span>
              <span className="font-medium text-[#14171A]">
                <strong className="font-mono text-[#D95A2B]">{filtered.length}</strong> Lots Open for Bidding
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================
            2. MAIN SEARCH & CATEGORY CHIPS STRIP
            ============================================================ */}
        <div className="space-y-4">
          {/* Search Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative flex items-center">
              <Search className="w-4 h-4 text-[#7C828D] absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(0); }}
                placeholder="Search lots by title, artist, maker, or catalog ID..."
                className="w-full pl-11 pr-10 py-3.5 bg-white border border-[#E2D9C8] rounded-2xl text-sm text-[#14171A] placeholder-[#7C828D] focus:outline-none focus:border-[#D95A2B] focus:ring-1 focus:ring-[#D95A2B] transition shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-[#7C828D] hover:text-[#14171A]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-5 py-3.5 bg-white border border-[#E2D9C8] rounded-2xl text-xs font-bold text-[#14171A] flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4 text-[#D95A2B]" />
              <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
            </button>
          </div>

          {/* Horizontal Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoriesList.map((cat) => {
              const active = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => { setSelectedCategory(cat.name); setCurrentPage(0); }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-[#14171A] text-white shadow-xs'
                      : 'bg-white text-[#4A505A] border border-[#E2D9C8] hover:bg-[#F4EFE6] hover:text-[#14171A]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-white/20 text-white' : 'bg-[#F4EFE6] text-[#7C828D]'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            3. TWO-COLUMN LAYOUT: Filter Sidebar + Main Auction Grid
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================
              LEFT FILTER SIDEBAR
              ======================================================== */}
          <aside className={`lg:col-span-3 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}>
            <div className="bg-[#F4EFE6]/80 backdrop-blur-xs border border-[#E2D9C8] rounded-3xl p-6 space-y-6 shadow-xs sticky top-24">
              
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2D9C8]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#D95A2B]" />
                  <h3 className="font-serif text-lg font-bold text-[#14171A]">Refine Catalog</h3>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-[#D95A2B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* 1. Auction Status Filter */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7C828D] block">
                  Auction Status
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['All', 'Live Now', 'Upcoming'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => { setSelectedStatus(st); setCurrentPage(0); }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center ${
                        selectedStatus === st
                          ? 'bg-[#14171A] text-white shadow-xs'
                          : 'bg-white text-[#4A505A] border border-[#E2D9C8] hover:bg-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Price Range Slider */}
              <div className="space-y-2 pt-2 border-t border-[#E2D9C8]/80">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7C828D]">
                    Maximum Price
                  </label>
                  <span className="text-xs font-mono font-bold text-[#D95A2B]">
                    {formatINR(priceMax)}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="10000000"
                  step="50000"
                  value={priceMax}
                  onChange={(e) => { setPriceMax(Number(e.target.value)); setCurrentPage(0); }}
                  className="w-full accent-[#D95A2B] h-1.5 bg-[#E2D9C8] rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-[#7C828D] font-mono">
                  <span>₹50,000</span>
                  <span>₹1.00 Cr</span>
                </div>
              </div>

              {/* 3. Brand / Maker Filter */}
              <div className="space-y-2 pt-2 border-t border-[#E2D9C8]/80">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7C828D] block">
                  Maker / Brand
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedBrand('')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      !selectedBrand ? 'bg-[#14171A] text-white' : 'bg-white text-[#4A505A] border border-[#E2D9C8]'
                    }`}
                  >
                    All Makers
                  </button>
                  {brandList.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => { setSelectedBrand(selectedBrand === brand ? '' : brand); setCurrentPage(0); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                        selectedBrand === brand ? 'bg-[#14171A] text-white' : 'bg-white text-[#4A505A] border border-[#E2D9C8]'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Condition Filter */}
              <div className="space-y-2 pt-2 border-t border-[#E2D9C8]/80">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7C828D] block">
                  Grading &amp; Condition
                </label>
                <div className="relative">
                  <select
                    value={selectedCondition}
                    onChange={(e) => { setSelectedCondition(e.target.value); setCurrentPage(0); }}
                    className="w-full appearance-none bg-white border border-[#E2D9C8] rounded-xl px-3.5 py-2.5 pr-8 text-xs font-semibold text-[#14171A] outline-none focus:border-[#D95A2B] cursor-pointer"
                  >
                    {conditionList.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond === 'All' ? 'All Conditions' : cond.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#7C828D] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 5. Provenance Location Filter */}
              <div className="space-y-2 pt-2 border-t border-[#E2D9C8]/80">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7C828D] block">
                  Consignment Origin
                </label>
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => { setSelectedLocation(e.target.value); setCurrentPage(0); }}
                    className="w-full appearance-none bg-white border border-[#E2D9C8] rounded-xl px-3.5 py-2.5 pr-8 text-xs font-semibold text-[#14171A] outline-none focus:border-[#D95A2B] cursor-pointer"
                  >
                    {locationList.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc === 'All' ? 'All Locations' : loc}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#7C828D] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Security Pill */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E2D9C8] text-xs space-y-1 text-[#7C828D]">
                <div className="flex items-center gap-1.5 font-bold text-[#14171A]">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                  <span>Escrow Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Consignor disbursements are locked until winning bidders physically verify lot condition.
                </p>
              </div>

            </div>
          </aside>

          {/* ========================================================
              MAIN AUCTIONS CONTENT AREA
              ======================================================== */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Sort & Count Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2D9C8]">
              <div>
                <span className="text-xs text-[#7C828D]">
                  Displaying <strong className="text-[#14171A] font-bold">{paginatedItems.length}</strong> of <strong className="text-[#14171A] font-bold">{filtered.length}</strong> authenticated lots
                </span>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs text-[#7C828D] font-medium hidden sm:inline">Sort by:</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setCurrentPage(0); }}
                    className="appearance-none bg-white border border-[#E2D9C8] rounded-xl px-4 py-2.5 pr-9 text-xs font-bold text-[#14171A] outline-none focus:border-[#D95A2B] cursor-pointer shadow-xs"
                  >
                    <option value="endingSoon">Ending Soonest</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="mostBids">Most Active Bids</option>
                    <option value="newest">Recently Listed</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7C828D] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid of Auction Cards */}
            {loading ? (
              <LoadingSkeleton count={6} />
            ) : paginatedItems.length === 0 ? (
              <EmptyState
                icon={Gavel}
                title="No Matching Lots Found"
                description="We couldn't locate any lots matching your current filter criteria. Try resetting your filters to explore the full catalog."
                actionLabel="Reset All Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedItems.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    onOpenAuction={onOpenAuction}
                    isWatchlisted={watchlistIds.includes(auction.id)}
                    onWatchlistToggle={onWatchlistChange}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 pt-6 border-t border-[#E2D9C8]">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalElements={filtered.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AuctionCard from './components/AuctionCard';
import LiveBiddingModal from './components/LiveBiddingModal';
import CreateAuctionModal from './components/CreateAuctionModal';
import WonAuctionsModal from './components/WonAuctionsModal';
import UserProfileModal from './components/UserProfileModal';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';
import { api } from './services/api';
import { wsService } from './services/websocket';
import { 
  Gavel, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  HelpCircle, 
  Zap, 
  Heart,
  ExternalLink,
  Layers
} from 'lucide-react';

function MainApplication() {
  const { user, isSeller, isAdmin } = useAuth();
  const { addToast } = useNotifications();

  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Modals
  const [selectedAuctionForBid, setSelectedAuctionForBid] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [showWonModal, setShowWonModal] = useState(false);
  const [watchlistIds, setWatchlistIds] = useState([101, 102]);

  // Load initial data
  const loadData = async () => {
    try {
      const [aucRes, catRes] = await Promise.all([
        api.getActiveAuctions(),
        api.getCategories()
      ]);

      if (aucRes && aucRes.content) setAuctions(aucRes.content);
      if (catRes) setCategories(catRes);
    } catch (err) {
      console.warn('Initial load warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Connect STOMP WebSocket
    wsService.connect();
    return () => {
      wsService.disconnect();
    };
  }, []);

  // Filtered and Sorted Auctions
  let displayedAuctions = [...auctions];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedAuctions = displayedAuctions.filter(
      (a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.categoryName.toLowerCase().includes(q)
    );
  }

  if (selectedCategory) {
    displayedAuctions = displayedAuctions.filter((a) => a.categoryId === selectedCategory);
  }

  if (activeFilter === 'endingSoon') {
    displayedAuctions.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
  } else if (activeFilter === 'mostBids') {
    displayedAuctions.sort((a, b) => (b.bidCount || 0) - (a.bidCount || 0));
  } else if (activeFilter === 'newest') {
    displayedAuctions.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  // Spotlight featured auction (e.g. 1971 Porsche or highest priced)
  const featuredAuction = auctions.length > 0 ? auctions[0] : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation */}
      <Navbar
        onOpenCreateAuction={() => setShowCreateModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenAdmin={() => setShowAdminPortal(true)}
        onOpenWatchlist={() => setShowProfileModal(true)}
        onOpenWonAuctions={() => setShowWonModal(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <main style={{ maxWidth: 1380, width: '100%', margin: '0 auto', padding: '0 24px 60px', flex: 1 }}>
        
        {/* Hero Section with Showcase & Category Filters */}
        <HeroSection
          featuredAuction={featuredAuction}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onOpenAuction={(auc) => setSelectedAuctionForBid(auc)}
        />

        {/* Live Marketplace Section */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Live Bidding Lots</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {displayedAuctions.length} auctions open for active bids
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="live-indicator">
                <span className="live-dot"></span>
                ACTIVE MARKET
              </span>
            </div>
          </div>

          {/* Grid of Auction Cards */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Loading active auctions...
            </div>
          ) : displayedAuctions.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '50px 20px', borderRadius: 'var(--radius-xl)' }}>
              <Gavel size={48} color="#475569" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 6 }}>No Auctions Matching Search</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 18 }}>
                Try adjusting your search query or switching categories.
              </p>
              <button 
                className="btn btn-secondary"
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: 24
            }}>
              {displayedAuctions.map((auction) => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  isInWatchlist={watchlistIds.includes(auction.id)}
                  onWatchlistChange={() => {
                    setWatchlistIds(prev => 
                      prev.includes(auction.id) ? prev.filter(id => id !== auction.id) : [...prev, auction.id]
                    );
                  }}
                  onOpenBidModal={(auc) => setSelectedAuctionForBid(auc)}
                />
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(11, 15, 23, 0.95)', padding: '40px 24px 30px', marginTop: 'auto' }}>
        <div style={{ maxWidth: 1380, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gavel size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>BidSphere</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>High-Concurrency Auction Engine</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span>Backend: Spring Boot 3.4.1</span>
            <span>WebSocket: STOMP over SockJS</span>
            <span>Protection: Anti-Sniping & Optimistic Locks</span>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            © 2026 BidSphere Platform. All rights reserved.
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* 1. Live Bidding Modal */}
      {selectedAuctionForBid && (
        <LiveBiddingModal
          auction={selectedAuctionForBid}
          onClose={() => setSelectedAuctionForBid(null)}
          onBidSuccess={() => loadData()}
        />
      )}

      {/* 2. Create Auction Modal */}
      {showCreateModal && (
        <CreateAuctionModal
          categories={categories}
          onClose={() => setShowCreateModal(false)}
          onCreated={(newAuc) => {
            setAuctions(prev => [newAuc, ...prev]);
            setSelectedAuctionForBid(newAuc);
          }}
        />
      )}

      {/* 3. Won Auctions & Settlement Modal */}
      {showWonModal && (
        <WonAuctionsModal
          onClose={() => setShowWonModal(false)}
        />
      )}

      {/* 4. Profile & Activity Modal */}
      {showProfileModal && (
        <UserProfileModal
          onClose={() => setShowProfileModal(false)}
          onOpenAuction={(auc) => {
            setShowProfileModal(false);
            setSelectedAuctionForBid(auc);
          }}
        />
      )}

      {/* 5. Admin Portal */}
      {showAdminPortal && (
        <AdminPortal
          onClose={() => setShowAdminPortal(false)}
          onCategoriesUpdated={() => loadData()}
        />
      )}

      {/* 6. Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainApplication />
      </NotificationProvider>
    </AuthProvider>
  );
}

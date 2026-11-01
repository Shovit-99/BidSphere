import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import PublicNavbar from './components/layout/PublicNavbar';
import Footer from './components/layout/Footer';

// Public Pages
import LandingPage from './pages/LandingPage';
import BrowsePage from './pages/BrowsePage';
import AuctionDetailPage from './pages/AuctionDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Authenticated Dashboard Subpages
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyBidsPage from './pages/dashboard/MyBidsPage';
import WatchlistPage from './pages/dashboard/WatchlistPage';
import WonAuctionsPage from './pages/dashboard/WonAuctionsPage';
import CreateAuctionPage from './pages/dashboard/CreateAuctionPage';
import MyListingsPage from './pages/dashboard/MyListingsPage';
import AdminConsolePage from './pages/dashboard/AdminConsolePage';
import ProfilePage from './pages/dashboard/ProfilePage';
import NotificationsPage from './pages/dashboard/NotificationsPage';

// Modals
import SearchCommandModal from './components/SearchCommandModal';
import LiveBiddingModal from './components/LiveBiddingModal';
import AuthModal from './components/AuthModal';

// Services
import { api } from './services/api';
import { wsService } from './services/websocket';
import { INITIAL_AUCTIONS, INITIAL_CATEGORIES } from './services/mockData';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5]">
        <div className="w-8 h-8 border-4 border-[#E2D9C8] border-t-[#D95A2B] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Public Page Shell Wrapper (Navbar + Page + Footer)
function PublicShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
      <PublicNavbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function MainApp() {
  const [auctions, setAuctions] = useState(INITIAL_AUCTIONS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [loadingData, setLoadingData] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedAuctionModal, setSelectedAuctionModal] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const loadData = async () => {
    try {
      const [aucRes, catRes] = await Promise.allSettled([
        api.getActiveAuctions(),
        api.getCategories()
      ]);

      if (aucRes.status === 'fulfilled' && aucRes.value?.content?.length > 0) {
        setAuctions(aucRes.value.content);
      } else {
        setAuctions(INITIAL_AUCTIONS);
      }

      if (catRes.status === 'fulfilled' && catRes.value?.length > 0) {
        setCategories(catRes.value);
      } else {
        setCategories(INITIAL_CATEGORIES);
      }
    } catch (err) {
      console.warn('Data load fallback', err);
      setAuctions(INITIAL_AUCTIONS);
      setCategories(INITIAL_CATEGORIES);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
    wsService.connect();
    return () => {
      wsService.disconnect();
    };
  }, []);

  // Keyboard shortcut for Cmd+K / Ctrl+K search palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Routes>
        {/* Public Visitor Routes */}
        <Route
          path="/"
          element={
            <LandingPage
              auctions={auctions}
              categories={categories}
              onOpenAuction={(auc) => setSelectedAuctionModal(auc)}
            />
          }
        />

        <Route
          path="/auctions"
          element={
            <PublicShell>
              <BrowsePage
                auctions={auctions}
                categories={categories}
                loading={loadingData}
                onOpenAuction={(auc) => setSelectedAuctionModal(auc)}
              />
            </PublicShell>
          }
        />

        <Route
          path="/auctions/:id"
          element={
            <PublicShell>
              <AuctionDetailPage />
            </PublicShell>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route
            path="auctions"
            element={
              <BrowsePage
                auctions={auctions}
                categories={categories}
                loading={loadingData}
                onOpenAuction={(auc) => setSelectedAuctionModal(auc)}
              />
            }
          />
          <Route path="my-bids" element={<MyBidsPage />} />
          <Route path="watchlist" element={<WatchlistPage />} />
          <Route path="won" element={<WonAuctionsPage />} />
          <Route path="create" element={<CreateAuctionPage />} />
          <Route path="my-listings" element={<MyListingsPage />} />
          <Route path="admin" element={<AdminConsolePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Cmd+K Quick Search Palette */}
      <SearchCommandModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        auctions={auctions}
        onSelectAuction={(auc) => setSelectedAuctionModal(auc)}
      />

      {/* Live Bidding Modal (if launched from Quick Action) */}
      {selectedAuctionModal && (
        <LiveBiddingModal
          auction={selectedAuctionModal}
          onClose={() => setSelectedAuctionModal(null)}
          onBidSuccess={() => loadData()}
        />
      )}

      {/* Unified Login & Register Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          initialMode={authModalMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => loadData()}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <MainApp />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

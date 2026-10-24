import { INITIAL_AUCTIONS, INITIAL_CATEGORIES, INITIAL_BIDS, INITIAL_NOTIFICATIONS } from './mockData';

const BASE_URL = 'http://localhost:8080';

// In-memory mock storage fallback when backend is offline
let mockAuctions = [...INITIAL_AUCTIONS];
let mockCategories = [...INITIAL_CATEGORIES];
let mockBids = { ...INITIAL_BIDS };
let mockNotifications = [...INITIAL_NOTIFICATIONS];
let mockWatchlist = [101, 102];
let mockPayments = [
  {
    id: 1,
    auctionId: 99,
    auctionTitle: 'Audemars Piguet Royal Oak Jumbo',
    amount: 32000.00,
    status: 'COMPLETED',
    paymentMethod: 'CREDIT_CARD',
    transactionRef: 'TXN-9981-AP77',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export const getAuthToken = () => localStorage.getItem('bidsphere_token');
export const setAuthToken = (token) => {
  if (token) localStorage.setItem('bidsphere_token', token);
  else localStorage.removeItem('bidsphere_token');
};

export const getStoredUser = () => {
  const data = localStorage.getItem('bidsphere_user');
  return data ? JSON.parse(data) : null;
};

export const setStoredUser = (user) => {
  if (user) localStorage.setItem('bidsphere_user', JSON.stringify(user));
  else localStorage.removeItem('bidsphere_user');
};

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { ...options.headers };
  const token = getAuthToken();

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is NOT FormData, set JSON content type
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `Request failed with status ${response.status}` };
      }
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    // 204 No Content
    if (response.status === 204) return null;
    return await response.json();
  } catch (err) {
    // Check if network error (backend offline)
    if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('Load failed'))) {
      console.warn(`[BidSphere] Backend offline or unreachable for ${endpoint}. Falling back to client simulator.`, err);
      return handleOfflineFallback(endpoint, options);
    }
    throw err;
  }
}

// Fallback handlers to provide full functionality even if Spring Boot is offline
function handleOfflineFallback(endpoint, options) {
  const method = options.method || 'GET';
  const currentUser = getStoredUser() || { id: 3, name: 'David H.', email: 'bidder@bidsphere.com', role: 'ROLE_BIDDER' };

  // 1. Auth endpoints
  if (endpoint === '/api/auth/login' && method === 'POST') {
    const body = JSON.parse(options.body);
    let role = 'ROLE_BIDDER';
    if (body.email.includes('admin')) role = 'ROLE_ADMIN';
    else if (body.email.includes('seller')) role = 'ROLE_SELLER';

    return {
      token: 'mock-jwt-token-' + Date.now(),
      type: 'Bearer',
      id: 3,
      name: body.email.split('@')[0],
      email: body.email,
      role: role
    };
  }

  if (endpoint === '/api/auth/register' && method === 'POST') {
    const body = JSON.parse(options.body);
    return {
      token: 'mock-jwt-token-' + Date.now(),
      type: 'Bearer',
      id: Math.floor(Math.random() * 1000) + 10,
      name: body.name,
      email: body.email,
      role: body.role || 'ROLE_BIDDER'
    };
  }

  // 2. Categories
  if (endpoint === '/api/categories' && method === 'GET') {
    return mockCategories;
  }

  // 3. Auctions
  if (endpoint.startsWith('/api/auctions')) {
    if (endpoint === '/api/auctions' && method === 'GET') {
      return {
        content: mockAuctions,
        totalPages: 1,
        totalElements: mockAuctions.length,
        size: 12,
        number: 0
      };
    }

    if (endpoint.startsWith('/api/auctions/search')) {
      const url = new URL(BASE_URL + endpoint);
      const q = (url.searchParams.get('keyword') || '').toLowerCase();
      const filtered = mockAuctions.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
      return { content: filtered, totalPages: 1, totalElements: filtered.length };
    }

    if (endpoint.startsWith('/api/auctions/category/')) {
      const parts = endpoint.split('/');
      const catId = parseInt(parts[parts.length - 1]);
      const filtered = mockAuctions.filter(a => a.categoryId === catId);
      return { content: filtered, totalPages: 1, totalElements: filtered.length };
    }

    if (endpoint === '/api/auctions/my') {
      const filtered = mockAuctions.filter(a => a.sellerId === currentUser.id);
      return { content: filtered, totalPages: 1, totalElements: filtered.length };
    }

    // Detail: /api/auctions/{id}
    const matchDetail = endpoint.match(/\/api\/auctions\/(\d+)$/);
    if (matchDetail && method === 'GET') {
      const id = parseInt(matchDetail[1]);
      const found = mockAuctions.find(a => a.id === id);
      if (!found) throw new Error('Auction not found');
      return found;
    }

    // Create Auction (Multipart)
    if (endpoint === '/api/auctions' && method === 'POST') {
      let auctionData = {};
      if (options.body instanceof FormData) {
        const jsonPart = options.body.get('auction');
        auctionData = typeof jsonPart === 'string' ? JSON.parse(jsonPart) : jsonPart;
      }
      const newAuction = {
        id: Date.now(),
        title: auctionData.title || 'Untitled Auction',
        description: auctionData.description || '',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
        condition: auctionData.condition || 'EXCELLENT',
        categoryName: mockCategories.find(c => c.id === auctionData.categoryId)?.name || 'General',
        categoryId: auctionData.categoryId || 1,
        sellerId: currentUser.id,
        sellerName: currentUser.name || 'Seller User',
        startingPrice: auctionData.startingPrice || 100,
        currentPrice: auctionData.startingPrice || 100,
        minIncrement: auctionData.minIncrement || 10,
        highestBidderName: null,
        highestBidderId: null,
        startTime: auctionData.startTime || new Date().toISOString(),
        endTime: auctionData.endTime || new Date(Date.now() + 86400000 * 3).toISOString(),
        status: 'ACTIVE',
        bidCount: 0,
        createdAt: new Date().toISOString()
      };
      mockAuctions = [newAuction, ...mockAuctions];
      return newAuction;
    }

    // Cancel auction
    if (matchDetail && method === 'DELETE') {
      const id = parseInt(matchDetail[1]);
      mockAuctions = mockAuctions.filter(a => a.id !== id);
      return null;
    }
  }

  // 4. Bids
  const matchBids = endpoint.match(/\/api\/auctions\/(\d+)\/bids$/);
  if (matchBids) {
    const auctionId = parseInt(matchBids[1]);
    if (method === 'GET') {
      const list = mockBids[auctionId] || [];
      return { content: list, totalPages: 1, totalElements: list.length };
    }
    if (method === 'POST') {
      const body = JSON.parse(options.body);
      const auction = mockAuctions.find(a => a.id === auctionId);
      if (!auction) throw new Error('Auction not found');
      if (body.amount <= auction.currentPrice) {
        throw new Error(`Bid amount must be at least ${auction.currentPrice + auction.minIncrement}`);
      }

      // Check anti-sniping: if remaining time < 2 minutes, extend by 2 minutes!
      const remainingMs = new Date(auction.endTime).getTime() - Date.now();
      let extended = false;
      if (remainingMs > 0 && remainingMs < 2 * 60 * 1000) {
        auction.endTime = new Date(Date.now() + 4 * 60 * 1000).toISOString();
        extended = true;
      }

      auction.currentPrice = body.amount;
      auction.highestBidderName = currentUser.name || 'David H.';
      auction.highestBidderId = currentUser.id;
      auction.bidCount = (auction.bidCount || 0) + 1;

      const newBid = {
        id: Date.now(),
        auctionId,
        bidderId: currentUser.id,
        bidderName: currentUser.name || 'David H.',
        amount: body.amount,
        bidTime: new Date().toISOString()
      };

      if (!mockBids[auctionId]) mockBids[auctionId] = [];
      mockBids[auctionId] = [newBid, ...mockBids[auctionId]];

      if (extended) {
        mockNotifications.unshift({
          id: Date.now(),
          title: 'Anti-Sniping Activated ⏱️',
          message: `Auction for "${auction.title}" was extended by 2 minutes due to late bidding.`,
          read: false,
          type: 'ANTI_SNIPE',
          auctionId: auction.id,
          createdAt: new Date().toISOString()
        });
      }

      return newBid;
    }
  }

  if (endpoint === '/api/bids/my') {
    const all = Object.values(mockBids).flat().filter(b => b.bidderId === currentUser.id);
    return { content: all, totalPages: 1, totalElements: all.length };
  }

  // 5. Watchlist
  if (endpoint === '/api/watchlist' && method === 'GET') {
    const list = mockAuctions.filter(a => mockWatchlist.includes(a.id)).map(a => ({
      id: a.id,
      auction: a,
      createdAt: new Date().toISOString()
    }));
    return { content: list, totalPages: 1, totalElements: list.length };
  }

  const matchWatchlistStatus = endpoint.match(/\/api\/watchlist\/(\d+)\/status$/);
  if (matchWatchlistStatus) {
    const id = parseInt(matchWatchlistStatus[1]);
    return { inWatchlist: mockWatchlist.includes(id) };
  }

  const matchWatchlistToggle = endpoint.match(/\/api\/watchlist\/(\d+)$/);
  if (matchWatchlistToggle) {
    const id = parseInt(matchWatchlistToggle[1]);
    if (method === 'POST') {
      if (!mockWatchlist.includes(id)) mockWatchlist.push(id);
      return { id, auctionId: id, createdAt: new Date().toISOString() };
    }
    if (method === 'DELETE') {
      mockWatchlist = mockWatchlist.filter(wId => wId !== id);
      return null;
    }
  }

  // 6. Notifications
  if (endpoint === '/api/notifications' && method === 'GET') {
    return { content: mockNotifications, totalPages: 1, totalElements: mockNotifications.length };
  }
  if (endpoint === '/api/notifications/unread-count') {
    const count = mockNotifications.filter(n => !n.read).length;
    return { unreadCount: count };
  }
  if (endpoint.match(/\/api\/notifications\/\d+\/read$/)) {
    const id = parseInt(endpoint.split('/')[3]);
    const n = mockNotifications.find(item => item.id === id);
    if (n) n.read = true;
    return n;
  }
  if (endpoint === '/api/notifications/read-all') {
    mockNotifications.forEach(n => n.read = true);
    return { message: 'All notifications marked as read' };
  }

  // 7. Payments
  if (endpoint.startsWith('/api/payments/auction/') && method === 'POST') {
    const auctionId = parseInt(endpoint.split('/')[4]);
    const payment = {
      id: Date.now(),
      auctionId,
      auctionTitle: mockAuctions.find(a => a.id === auctionId)?.title || 'Auction Settlement',
      amount: 15400.00,
      status: 'COMPLETED',
      paymentMethod: 'CREDIT_CARD',
      transactionRef: 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      createdAt: new Date().toISOString()
    };
    mockPayments.unshift(payment);
    return payment;
  }

  if (endpoint === '/api/payments/my') {
    return { content: mockPayments, totalPages: 1, totalElements: mockPayments.length };
  }

  // 8. User Profile
  if (endpoint === '/api/users/profile') {
    return {
      id: currentUser.id,
      name: currentUser.name || 'David Henderson',
      email: currentUser.email || 'david@bidsphere.com',
      phone: '+1 (555) 349-2891',
      role: currentUser.role || 'ROLE_BIDDER',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      totalBidsPlaced: 47,
      totalAuctionsWon: 4,
      totalItemsListed: 2,
      createdAt: '2024-01-15T09:00:00'
    };
  }

  if (endpoint === '/api/users/won-auctions') {
    const won = mockAuctions.slice(0, 2);
    return { content: won, totalPages: 1, totalElements: won.length };
  }

  // 9. Admin operations
  if (endpoint === '/api/admin/dashboard') {
    return {
      totalUsers: 1420,
      activeAuctions: mockAuctions.length,
      closedAuctions: 843,
      totalBids: 12940,
      totalCategories: mockCategories.length,
      totalRevenue: 284500.00
    };
  }

  if (endpoint === '/api/admin/users') {
    return {
      content: [
        { id: 1, name: 'Admin Master', email: 'admin@bidsphere.com', role: 'ROLE_ADMIN', enabled: true },
        { id: 2, name: 'Marcus Heritage Motors', email: 'marcus@motors.com', role: 'ROLE_SELLER', enabled: true },
        { id: 3, name: 'David Henderson', email: 'bidder@bidsphere.com', role: 'ROLE_BIDDER', enabled: true },
        { id: 4, name: 'Geneva Vaults', email: 'vaults@geneva.ch', role: 'ROLE_SELLER', enabled: true },
        { id: 5, name: 'Elena Rostova', email: 'elena@gmail.com', role: 'ROLE_BIDDER', enabled: true }
      ],
      totalPages: 1,
      totalElements: 5
    };
  }

  if (endpoint.match(/\/api\/admin\/users\/\d+\/toggle/)) {
    return { id: 3, name: 'David Henderson', enabled: true };
  }

  // Default empty object
  return {};
}

export const api = {
  // Auth
  login: (credentials) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

  // Categories
  getCategories: () => request('/api/categories'),

  // Auctions
  getActiveAuctions: (page = 0, size = 12, sort = 'endTime,asc') =>
    request(`/api/auctions?page=${page}&size=${size}&sort=${sort}`),
  getAuction: (id) => request(`/api/auctions/${id}`),
  searchAuctions: (keyword, page = 0, size = 12) =>
    request(`/api/auctions/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`),
  getAuctionsByCategory: (categoryId, page = 0, size = 12) =>
    request(`/api/auctions/category/${categoryId}?page=${page}&size=${size}`),
  getMyAuctions: (page = 0, size = 12) =>
    request(`/api/auctions/my?page=${page}&size=${size}`),
  createAuction: (formData) =>
    request('/api/auctions', { method: 'POST', body: formData }),
  updateAuction: (id, formData) =>
    request(`/api/auctions/${id}`, { method: 'PUT', body: formData }),
  cancelAuction: (id) =>
    request(`/api/auctions/${id}`, { method: 'DELETE' }),

  // Bids
  placeBid: (auctionId, amount) =>
    request(`/api/auctions/${auctionId}/bids`, { method: 'POST', body: JSON.stringify({ amount }) }),
  getBidHistory: (auctionId, page = 0, size = 20) =>
    request(`/api/auctions/${auctionId}/bids?page=${page}&size=${size}&sort=bidTime,desc`),
  getMyBids: (page = 0, size = 20) =>
    request(`/api/bids/my?page=${page}&size=${size}&sort=bidTime,desc`),

  // Watchlist
  addToWatchlist: (auctionId) =>
    request(`/api/watchlist/${auctionId}`, { method: 'POST' }),
  removeFromWatchlist: (auctionId) =>
    request(`/api/watchlist/${auctionId}`, { method: 'DELETE' }),
  getMyWatchlist: (page = 0, size = 12) =>
    request(`/api/watchlist?page=${page}&size=${size}`),
  getWatchlistStatus: (auctionId) =>
    request(`/api/watchlist/${auctionId}/status`),

  // Notifications
  getNotifications: (page = 0, size = 20) =>
    request(`/api/notifications?page=${page}&size=${size}`),
  getUnreadCount: () =>
    request('/api/notifications/unread-count'),
  markAsRead: (id) =>
    request(`/api/notifications/${id}/read`, { method: 'PUT' }),
  markAllAsRead: () =>
    request('/api/notifications/read-all', { method: 'PUT' }),
  deleteNotification: (id) =>
    request(`/api/notifications/${id}`, { method: 'DELETE' }),

  // Payments
  processPayment: (auctionId, paymentData) =>
    request(`/api/payments/auction/${auctionId}`, { method: 'POST', body: JSON.stringify(paymentData) }),
  getPaymentByAuction: (auctionId) =>
    request(`/api/payments/auction/${auctionId}`),
  getMyPayments: (page = 0, size = 20) =>
    request(`/api/payments/my?page=${page}&size=${size}`),

  // Profile & User
  getProfile: () => request('/api/users/profile'),
  updateProfile: (formData) =>
    request('/api/users/profile', { method: 'PUT', body: formData }),
  changePassword: (passwordData) =>
    request('/api/users/change-password', { method: 'PUT', body: JSON.stringify(passwordData) }),
  getWonAuctions: (page = 0, size = 12) =>
    request(`/api/users/won-auctions?page=${page}&size=${size}`),
  getUserById: (id) => request(`/api/users/${id}`),

  // Admin
  getDashboardStats: () => request('/api/admin/dashboard'),
  getAllUsers: (page = 0, size = 20) =>
    request(`/api/admin/users?page=${page}&size=${size}`),
  toggleUser: (id) =>
    request(`/api/admin/users/${id}/toggle`, { method: 'PUT' }),
  getAllAuctions: (status = '', page = 0, size = 20) => {
    const q = status ? `?status=${status}&page=${page}&size=${size}` : `?page=${page}&size=${size}`;
    return request(`/api/admin/auctions${q}`);
  },
  cancelAuctionByAdmin: (id) =>
    request(`/api/admin/auctions/${id}/cancel`, { method: 'PUT' }),
  getAllPayments: (page = 0, size = 20) =>
    request(`/api/admin/payments?page=${page}&size=${size}`),
  createCategory: (categoryData) =>
    request('/api/admin/categories', { method: 'POST', body: JSON.stringify(categoryData) })
};

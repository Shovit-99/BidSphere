# BidSphere — React Frontend

The official modern React frontend for the **BidSphere Online Auction Platform**. Built with React 19, Vite, Lucide Icons, STOMP over SockJS, Canvas Confetti, and custom obsidian/glassmorphism design tokens.

---

## 🚀 Features

- **Live Bidding Room**:
  - Sub-millisecond STOMP WebSocket connection to `/topic/auction/{id}`
  - Dynamic live countdown timer with pulsing anti-sniping indicator (< 2 mins)
  - Quick-increment bid buttons (`+$10`, `+$50`, `+$100`, `+$500`)
  - Live bid activity log stream
  - Confetti blast animation upon placing winning bids

- **Anti-Sniping Engine Feedback**:
  - Clear real-time visual alerts when the anti-snipe 2-minute extension triggers on late bids

- **Marketplace & Discovery**:
  - Dynamic category pills (`Luxury Watches`, `Vintage Cars`, `Fine Art`, `Electronics`, `Collectibles`, `Jewelry`)
  - Search bar with instant keyword matching
  - Sort tabs: `All Active`, `Ending Soon ⏱️`, `Hot / Most Bids 🔥`, `Newly Listed`

- **Checkout & Settlements**:
  - Won Auctions modal with settlement tracking
  - Simulated payment card / escrow checkout with instant receipt generation

- **Role-Based Experience & 1-Click Demo Switcher**:
  - Instant demo pill in navbar to switch between `Bidder`, `Seller`, and `Admin`
  - Seller: Item listing creation form with real-time preview and image upload
  - Admin: Platform analytics KPI cards, User management (suspend/reinstate), Auction force cancellation, and Category creator

- **Resilient Fallback Mode**:
  - When the Spring Boot backend is running on `http://localhost:8080`, all requests seamlessly hit the live REST API and SockJS broker.
  - If the backend is offline, an integrated client simulator enables full interactive testing out of the box.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite
- **Styling**: Vanilla CSS design system with glassmorphism & curated HSL color palette
- **Icons**: Lucide React
- **Real-Time**: `@stomp/stompjs` + `sockjs-client`
- **Celebrations**: `canvas-confetti`

---

## 🏃 Running the Frontend

### 1. Install Dependencies
```bash
cd bidsphere-frontend
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

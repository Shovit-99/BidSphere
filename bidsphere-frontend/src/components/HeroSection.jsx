import React from 'react';
import { 
  Sparkles, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Flame, 
  Watch, 
  Car, 
  Palette, 
  Camera, 
  Layers, 
  Gem,
  Gavel
} from 'lucide-react';

export default function HeroSection({ 
  featuredAuction, 
  categories, 
  selectedCategory, 
  onSelectCategory,
  activeFilter,
  setActiveFilter,
  onOpenAuction
}) {
  const getCategoryIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('watch')) return Watch;
    if (n.includes('car') || n.includes('vehicle')) return Car;
    if (n.includes('art')) return Palette;
    if (n.includes('electronic') || n.includes('camera')) return Camera;
    if (n.includes('card') || n.includes('collectible')) return Layers;
    if (n.includes('jewel') || n.includes('gem')) return Gem;
    return Gavel;
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Hero Showcase Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: featuredAuction ? '1.2fr 1fr' : '1fr', 
        gap: 28, 
        alignItems: 'center',
        padding: '36px 0 24px'
      }}>
        {/* Left Column: Headlines & Value propositions */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: 18 }}>
            <Sparkles size={16} color="#818cf8" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c7d2fe', letterSpacing: '0.04em' }}>
              CONCURRENT LIVE BIDDING ENGINE
            </span>
          </div>

          <h1 style={{ fontSize: '3.1rem', fontWeight: 800, lineHeight: 1.12, marginBottom: 18, letterSpacing: '-0.03em' }}>
            Where Extraordinary Items Find Their <span style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>True Value</span>.
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 540, marginBottom: 28 }}>
            BidSphere brings Wall-Street grade concurrency to luxury auctions. Featuring automated <strong>anti-sniping protection</strong>, sub-millisecond WebSocket price updates, and verified provenance.
          </p>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={20} color="#10b981" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Anti-Sniping Engine</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={20} color="#6366f1" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Optimistic Locking</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Flame size={20} color="#f59e0b" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Zero-Lag STOMP Stream</span>
            </div>
          </div>
        </div>

        {/* Right Column: Featured Spotlight Live Card */}
        {featuredAuction && (
          <div 
            className="glass-panel" 
            onClick={() => onOpenAuction(featuredAuction)}
            style={{ 
              borderRadius: 'var(--radius-xl)', 
              overflow: 'hidden', 
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.25)',
              position: 'relative'
            }}
          >
            <div style={{ position: 'relative', height: 260 }}>
              <img 
                src={featuredAuction.imageUrl} 
                alt={featuredAuction.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.3) 50%, rgba(15, 23, 42, 0) 100%)'
              }}></div>

              <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 8 }}>
                <span className="live-indicator"><span className="live-dot"></span>FEATURED AUCTION</span>
                <span className="badge badge-gold">HIGH DEMAND</span>
              </div>
            </div>

            <div style={{ padding: 22 }}>
              <div style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                {featuredAuction.categoryName}
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {featuredAuction.title}
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginTop: 12 }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Current Bid</div>
                  <div className="mono-font" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>
                    {formatPrice(featuredAuction.currentPrice)}
                  </div>
                </div>

                <button className="btn btn-primary btn-sm" style={{ padding: '8px 16px' }}>
                  <Gavel size={15} />
                  <span>Join Live Room</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Pills Bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 10, 
        overflowX: 'auto', 
        padding: '12px 0 16px', 
        borderBottom: '1px solid var(--border-color)',
        scrollbarWidth: 'none'
      }}>
        <button
          onClick={() => onSelectCategory(null)}
          className={`btn btn-sm ${selectedCategory === null ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: 'var(--radius-full)', padding: '8px 16px', whiteSpace: 'nowrap' }}
        >
          All Categories
        </button>

        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.name);
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '8px 16px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Icon size={14} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Sort / Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { id: 'all', label: 'All Active' },
            { id: 'endingSoon', label: 'Ending Soon ⏱️' },
            { id: 'mostBids', label: 'Hot / Most Bids 🔥' },
            { id: 'newest', label: 'Newly Listed' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                background: activeFilter === f.id ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: activeFilter === f.id ? '#fff' : 'var(--text-muted)',
                border: activeFilter === f.id ? '1px solid var(--border-hover)' : '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

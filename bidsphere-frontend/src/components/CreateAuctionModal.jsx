import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import { X, Upload, Sparkles, Image, Clock, DollarSign, Tag, CheckCircle2 } from 'lucide-react';

export default function CreateAuctionModal({ categories, onClose, onCreated }) {
  const { addToast } = useNotifications();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 1);
  const [condition, setCondition] = useState('LIKE_NEW');
  const [startingPrice, setStartingPrice] = useState(500);
  const [minIncrement, setMinIncrement] = useState(25);
  const [durationDays, setDurationDays] = useState(3);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80');
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide an item title.');
      return;
    }

    setSubmitting(true);
    try {
      const endTime = new Date(Date.now() + durationDays * 24 * 3600 * 1000).toISOString();
      const startTime = new Date().toISOString();

      const auctionData = {
        title,
        description,
        categoryId: Number(categoryId),
        condition,
        startingPrice: Number(startingPrice),
        minIncrement: Number(minIncrement),
        startTime,
        endTime
      };

      const formData = new FormData();
      formData.append(
        'auction',
        new Blob([JSON.stringify(auctionData)], { type: 'application/json' })
      );

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await api.createAuction(formData);

      addToast({
        title: 'Listing Live! 🚀',
        message: `"${title}" has been successfully listed on BidSphere.`,
        type: 'success'
      });

      if (onCreated) onCreated(res);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to list auction. Check requirements.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 880, padding: 0 }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(15, 23, 42, 0.7)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>List an Item for Live Auction</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Fill in the parameters below. Real-time anti-sniping and automated closing will be enabled.
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Columns: Form + Real-time Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 0 }}>
          
          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: 24, maxHeight: '75vh', overflowY: 'auto' }}>
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                marginBottom: 16
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Item Title *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. 1967 Gibson Les Paul Custom 'Black Beauty'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Item Condition</label>
                <select 
                  className="form-select"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option value="NEW_UNWORN">Brand New / Unworn</option>
                  <option value="MINT_COLLECTOR">Mint Collector Condition</option>
                  <option value="LIKE_NEW">Like New</option>
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good Vintage</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Starting Price (₹ INR) *</label>
                <input 
                  type="number" 
                  className="form-input mono-font" 
                  min="1"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Min Bid Increment (₹ INR) *</label>
                <input 
                  type="number" 
                  className="form-input mono-font" 
                  min="1"
                  value={minIncrement}
                  onChange={(e) => setMinIncrement(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Auction Duration</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: '1 Day', days: 1 },
                  { label: '3 Days', days: 3 },
                  { label: '5 Days', days: 5 },
                  { label: '7 Days', days: 7 }
                ].map((item) => (
                  <button
                    key={item.days}
                    type="button"
                    className={`btn btn-sm ${durationDays === item.days ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setDurationDays(item.days)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Photo / Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageFileChange}
                style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4 }}>
                Or provide an image URL:
              </div>
              <input 
                type="url" 
                className="form-input" 
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description & Provenance</label>
              <textarea 
                className="form-textarea" 
                rows="3"
                placeholder="Detail history, specifications, serial numbers, box/papers included..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%', padding: '12px 0', fontSize: '1rem', marginTop: 8 }}
            >
              <Sparkles size={18} />
              <span>{submitting ? 'Creating Listing...' : 'Publish Live Auction'}</span>
            </button>
          </form>

          {/* Right Column: Live Card Preview */}
          <div style={{ padding: 24, background: 'rgba(0, 0, 0, 0.25)', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>
              Marketplace Preview
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
              <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={imageUrl} 
                  alt="preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'; }}
                />
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <span className="live-indicator"><span className="live-dot"></span>LIVE</span>
                </div>
                <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
                  <span className="badge badge-primary">{condition.replace('_', ' ')}</span>
                </div>
              </div>

              <div style={{ padding: 14 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                  {categories.find(c => c.id === Number(categoryId))?.name || 'Category'}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, margin: '4px 0 10px', height: 26, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {title || 'Your Item Title Goes Here'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Starting Bid</div>
                    <div className="mono-font" style={{ fontWeight: 800, color: '#fbbf24' }}>
                      ${Number(startingPrice || 0).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Duration</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{durationDays} Days</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 16, fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
              💡 <strong>Tip:</strong> Items with clear provenance, high-resolution photography, and transparent condition ratings receive 3.4x more bids.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

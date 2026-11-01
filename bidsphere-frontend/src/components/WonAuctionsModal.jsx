import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { formatINR } from '../lib/currency';
import confetti from 'canvas-confetti';
import { 
  X, 
  Trophy, 
  CreditCard, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  DollarSign, 
  ExternalLink,
  Receipt
} from 'lucide-react';

export default function WonAuctionsModal({ onClose }) {
  const { addToast } = useNotifications();
  const [wonAuctions, setWonAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingAuction, setPayingAuction] = useState(null);

  // Payment form state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [shippingAddress, setShippingAddress] = useState('742 Evergreen Terrace, Beverly Hills, CA 90210');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const loadWonItems = async () => {
    try {
      const res = await api.getWonAuctions();
      if (res && res.content) {
        setWonAuctions(res.content);
      }
    } catch (e) {
      console.warn('Failed to load won items', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWonItems();
  }, []);

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const paymentData = {
        paymentMethod: 'CREDIT_CARD',
        cardNumber: cardNumber.replace(/\s+/g, ''),
        cardExpiry,
        cardCvc,
        shippingAddress,
        phone
      };

      const res = await api.processPayment(payingAuction.id, paymentData);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setPaymentSuccess(res);
      addToast({
        title: 'Settlement Complete! 🎉',
        message: `Payment of ${formatINR(payingAuction.currentPrice)} processed successfully. Reference: ${res.transactionRef || 'TXN-SETTLED'}`,
        type: 'success'
      });

      // Update item status in local list
      setWonAuctions((prev) =>
        prev.map((item) => (item.id === payingAuction.id ? { ...item, paymentStatus: 'COMPLETED' } : item))
      );
    } catch (err) {
      addToast({
        title: 'Payment Failed',
        message: err.message || 'Payment simulation declined. Please re-check.',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (val) => {
    return formatINR(val);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 760, padding: 0, overflow: 'hidden' }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24'
            }}>
              <Trophy size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Won Auctions & Settlements</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Auctions where you placed the winning bid. Complete checkout to arrange delivery.
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 24, maxHeight: '75vh', overflowY: 'auto' }}>
          
          {/* If currently in payment sub-step */}
          {payingAuction ? (
            <div>
              {paymentSuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 16px' }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <CheckCircle2 size={36} />
                  </div>

                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6 }}>Payment Completed</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
                    Your transaction has been confirmed on the escrow settlement ledger.
                  </p>

                  <div className="glass-panel" style={{ textAlign: 'left', padding: 20, marginBottom: 24, maxWidth: 460, margin: '0 auto 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Transaction Reference:</span>
                      <strong className="mono-font" style={{ color: '#a5b4fc' }}>{paymentSuccess.transactionRef || 'TXN-9981-AP77'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Item Settled:</span>
                      <strong>{payingAuction.title}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
                      <strong className="mono-font" style={{ color: '#fbbf24' }}>{formatPrice(payingAuction.currentPrice)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Delivery To:</span>
                      <strong style={{ fontSize: '0.8rem' }}>{shippingAddress}</strong>
                    </div>
                  </div>

                  <button 
                    className="btn btn-secondary"
                    onClick={() => { setPayingAuction(null); setPaymentSuccess(null); }}
                  >
                    Back to Won Items
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProcessPayment}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Checkout for Item:</div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{payingAuction.title}</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Winning Bid Total</div>
                      <div className="mono-font" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>
                        {formatPrice(payingAuction.currentPrice)}
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Delivery Shipping Address *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Phone *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: 16,
                    margin: '16px 0'
                  }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CreditCard size={18} color="#6366f1" />
                      <span>Simulated Secure Payment Card</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input 
                        type="text" 
                        className="form-input mono-font" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input 
                          type="text" 
                          className="form-input mono-font" 
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVC / CVV</label>
                        <input 
                          type="text" 
                          className="form-input mono-font" 
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setPayingAuction(null)}
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isProcessing}
                      style={{ flex: 2 }}
                    >
                      <ShieldCheck size={18} />
                      <span>{isProcessing ? 'Settling Payment...' : `Confirm & Pay ${formatPrice(payingAuction.currentPrice)}`}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                  Loading won items...
                </div>
              ) : wonAuctions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Trophy size={48} color="#475569" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>No Won Auctions Yet</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: 360, margin: '0 auto' }}>
                    Place competitive bids in active auctions. When the timer expires as the highest bidder, your items will appear here for settlement.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {wonAuctions.map((item) => (
                    <div 
                      key={item.id}
                      className="glass-panel"
                      style={{
                        padding: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          style={{ width: 70, height: 70, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                        />
                        <div>
                          <span className="badge badge-gold" style={{ marginBottom: 4 }}>WON ITEM</span>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 2 }}>{item.title}</h4>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Winning Hammer Price: <strong className="mono-font" style={{ color: '#fbbf24' }}>{formatPrice(item.currentPrice)}</strong>
                          </div>
                        </div>
                      </div>

                      <div>
                        {item.paymentStatus === 'COMPLETED' ? (
                          <span className="badge badge-emerald" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                            <CheckCircle2 size={16} /> PAID & ESCROWED
                          </span>
                        ) : (
                          <button 
                            className="btn btn-gold"
                            onClick={() => setPayingAuction(item)}
                            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                          >
                            <CreditCard size={16} />
                            <span>Pay & Settle</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

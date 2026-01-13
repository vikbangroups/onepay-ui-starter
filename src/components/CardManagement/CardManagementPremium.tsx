/**
 * Card Management Premium Component
 * Enterprise-grade payment card management
 * Features: Add/Edit/Delete/Set Default, Verification, History
 */

import React, { useState } from 'react';
import '../../styles/card-management-premium.css';

interface Card {
  id: string;
  type: 'credit' | 'debit';
  cardNumber: string;
  cardName: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  issuer: string;
  last4: string;
  status: 'verified' | 'pending' | 'expired' | 'blocked';
  isDefault: boolean;
  addedDate: string;
  lastUsed: string;
  totalTransactions: number;
  totalSpent: number;
  cardLogo?: string;
}

interface TransactionRecord {
  id: string;
  cardId: string;
  description: string;
  amount: number;
  date: string;
  status: 'success' | 'failed';
  merchant: string;
}

interface FormData {
  cardNumber: string;
  cardName: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

const CardManagementPremium: React.FC = () => {
  // ==================== STATE ====================
  const [cards, setCards] = useState<Card[]>([
    {
      id: 'CARD_001',
      type: 'credit',
      cardNumber: '4532',
      cardName: 'My Primary Card',
      holderName: 'John Doe',
      expiryMonth: '12',
      expiryYear: '2026',
      issuer: 'ICICI Bank',
      last4: '1234',
      status: 'verified',
      isDefault: true,
      addedDate: '2025-06-15',
      lastUsed: '2026-01-08',
      totalTransactions: 45,
      totalSpent: 125000,
      cardLogo: '💳',
    },
    {
      id: 'CARD_002',
      type: 'debit',
      cardNumber: '5412',
      cardName: 'HDFC Debit Card',
      holderName: 'John Doe',
      expiryMonth: '08',
      expiryYear: '2027',
      issuer: 'HDFC Bank',
      last4: '5678',
      status: 'verified',
      isDefault: false,
      addedDate: '2025-08-20',
      lastUsed: '2026-01-07',
      totalTransactions: 28,
      totalSpent: 87500,
      cardLogo: '🏦',
    },
    {
      id: 'CARD_003',
      type: 'credit',
      cardNumber: '3782',
      cardName: 'Travel Card',
      holderName: 'John Doe',
      expiryMonth: '05',
      expiryYear: '2025',
      issuer: 'Axis Bank',
      last4: '2222',
      status: 'expired',
      isDefault: false,
      addedDate: '2023-05-10',
      lastUsed: '2024-12-25',
      totalTransactions: 12,
      totalSpent: 45000,
      cardLogo: '✈️',
    },
  ]);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'otp' | 'cvv'>('otp');
  const [verificationCode, setVerificationCode] = useState('');
  const [cardTransactions] = useState<TransactionRecord[]>([
    { id: 'TXN001', cardId: 'CARD_001', description: 'Amazon Purchase', amount: 5000, date: '2026-01-08', status: 'success', merchant: 'Amazon' },
    { id: 'TXN002', cardId: 'CARD_001', description: 'Uber Ride', amount: 350, date: '2026-01-08', status: 'success', merchant: 'Uber' },
    { id: 'TXN003', cardId: 'CARD_001', description: 'Restaurant Payment', amount: 1200, date: '2026-01-07', status: 'success', merchant: 'Zomato' },
    { id: 'TXN004', cardId: 'CARD_002', description: 'ATM Withdrawal', amount: 10000, date: '2026-01-07', status: 'success', merchant: 'HDFC ATM' },
    { id: 'TXN005', cardId: 'CARD_001', description: 'Failed Payment', amount: 2000, date: '2026-01-06', status: 'failed', merchant: 'Unknown' },
  ]);

  const [formData, setFormData] = useState<FormData>({
    cardNumber: '',
    cardName: '',
    holderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // ==================== HANDLERS ====================

  const handleAddCard = async () => {
    if (!formData.cardNumber || !formData.cardName || !formData.holderName || !formData.expiryMonth || !formData.expiryYear || !formData.cvv) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    if (formData.cardNumber.length < 13 || formData.cardNumber.length > 19) {
      setMessage({ type: 'error', text: 'Invalid card number' });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newCard: Card = {
        id: `CARD_${String(cards.length + 1).padStart(3, '0')}`,
        type: formData.cardNumber.startsWith('4') ? 'credit' : 'debit',
        cardNumber: formData.cardNumber,
        cardName: formData.cardName,
        holderName: formData.holderName,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        issuer: 'Bank Name',
        last4: formData.cardNumber.slice(-4),
        status: 'pending',
        isDefault: false,
        addedDate: new Date().toISOString().split('T')[0],
        lastUsed: 'Never',
        totalTransactions: 0,
        totalSpent: 0,
      };

      setCards([...cards, newCard]);
      setMessage({ type: 'success', text: 'Card added successfully! Verification pending.' });
      setFormData({ cardNumber: '', cardName: '', holderName: '', expiryMonth: '', expiryYear: '', cvv: '' });
      setShowAddForm(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add card' });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (card: Card) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCards(cards.map(c => ({
        ...c,
        isDefault: c.id === card.id,
      })));
      
      setMessage({ type: 'success', text: `${card.cardName} set as default card` });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to set default card' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!cardToDelete) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCards(cards.filter(c => c.id !== cardToDelete.id));
      setMessage({ type: 'success', text: 'Card deleted successfully' });
      setShowDeleteConfirm(false);
      setCardToDelete(null);
      setSelectedCard(null);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete card' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCard = async () => {
    if (verificationCode.length < 4) {
      setMessage({ type: 'error', text: 'Enter valid code' });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setCards(cards.map(c =>
        c.id === selectedCard?.id ? { ...c, status: 'verified' } : c
      ));
      
      setSelectedCard(prev => prev ? { ...prev, status: 'verified' } : null);
      setMessage({ type: 'success', text: 'Card verified successfully!' });
      setShowVerification(false);
      setVerificationCode('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Verification failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleBlockCard = async (card: Card) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCards(cards.map(c =>
        c.id === card.id ? { ...c, status: 'blocked' } : c
      ));
      
      setMessage({ type: 'success', text: 'Card blocked successfully' });
      if (selectedCard?.id === card.id) {
        setSelectedCard(prev => prev ? { ...prev, status: 'blocked' } : null);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to block card' });
    } finally {
      setLoading(false);
    }
  };

  const getCardColor = (type: string) => {
    return type === 'credit' ? 'gradient-credit' : 'gradient-debit';
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { class: string; icon: string; label: string }> = {
      verified: { class: 'verified', icon: '✓', label: 'Verified' },
      pending: { class: 'pending', icon: '⏱', label: 'Pending' },
      expired: { class: 'expired', icon: '⚠️', label: 'Expired' },
      blocked: { class: 'blocked', icon: '🚫', label: 'Blocked' },
    };
    return config[status] || { class: '', icon: '', label: '' };
  };

  const selectedCardTransactions = selectedCard 
    ? cardTransactions.filter(t => t.cardId === selectedCard.id)
    : [];

  // ==================== RENDER ====================

  return (
    <div className="card-management-container">
      <div className="card-header">
        <h1>💳 Card Management</h1>
        <p>Manage your payment cards securely</p>
      </div>

      {message && (
        <div className={`message-banner ${message.type}`}>
          <span>{message.type === 'success' ? '✓' : '✕'} {message.text}</span>
          <button onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      {/* ==================== TOOLBAR ==================== */}
      <div className="card-toolbar">
        <button className="btn-add-card" onClick={() => setShowAddForm(true)}>
          ➕ Add New Card
        </button>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            ⊞ Grid
          </button>
          <button
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            ≡ List
          </button>
        </div>
      </div>

      {/* ==================== CARDS DISPLAY ==================== */}
      <div className={`cards-container cards-${viewMode}`}>
        {cards.length > 0 ? (
          cards.map(card => (
            <div
              key={card.id}
              className={`card-item ${getCardColor(card.type)} ${card.isDefault ? 'default' : ''}`}
              onClick={() => {
                setSelectedCard(card);
                setShowCardDetails(true);
              }}
            >
              <div className="card-display">
                <div className="card-header-row">
                  <div className="card-type-badge">
                    {card.type === 'credit' ? '💳 CREDIT' : '🏦 DEBIT'}
                  </div>
                  {card.isDefault && <span className="default-badge">⭐ Default</span>}
                </div>

                <div className="card-number">
                  •••• •••• •••• {card.last4}
                </div>

                <div className="card-details-row">
                  <div>
                    <p className="card-label">Card Name</p>
                    <p className="card-value">{card.cardName}</p>
                  </div>
                  <div>
                    <p className="card-label">Holder Name</p>
                    <p className="card-value">{card.holderName}</p>
                  </div>
                </div>

                <div className="card-footer-row">
                  <div>
                    <p className="card-label">Expiry</p>
                    <p className="card-value">{card.expiryMonth}/{card.expiryYear}</p>
                  </div>
                  <span className={`status-badge ${getStatusBadge(card.status).class}`}>
                    {getStatusBadge(card.status).icon} {getStatusBadge(card.status).label}
                  </span>
                </div>
              </div>

              <button className="card-menu-btn" onClick={(e) => {
                e.stopPropagation();
                setSelectedCard(card);
              }}>
                ⋮
              </button>
            </div>
          ))
        ) : (
          <div className="no-cards">
            <p>📭 No cards added yet</p>
            <button className="btn-add-card" onClick={() => setShowAddForm(true)}>
              ➕ Add Your First Card
            </button>
          </div>
        )}
      </div>

      {/* ==================== ADD CARD FORM ==================== */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Add New Card</h2>
              <button className="modal-close" onClick={() => setShowAddForm(false)}>✕</button>
            </div>

            <div className="form-content">
              <div className="form-group">
                <label>Card Number *</label>
                <input
                  type="text"
                  placeholder="Enter 13-19 digit card number"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\D/g, '') })}
                  maxLength={19}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Cardholder Name *</label>
                <input
                  type="text"
                  placeholder="As shown on card"
                  value={formData.holderName}
                  onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Card Nickname *</label>
                  <input
                    type="text"
                    placeholder="e.g., My Primary Card"
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>CVV *</label>
                  <input
                    type="password"
                    placeholder="3-4 digit code"
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                    maxLength={4}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Expiry Month *</label>
                  <select value={formData.expiryMonth} onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })} className="form-input">
                    <option value="">Select Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Expiry Year *</label>
                  <select value={formData.expiryYear} onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })} className="form-input">
                    <option value="">Select Year</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return <option key={year} value={String(year)}>{year}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div className="form-note">
                🔒 Your card details are encrypted and stored securely
              </div>

              <div className="form-buttons">
                <button className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleAddCard} disabled={loading}>
                  {loading ? 'Adding...' : 'Add Card'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CARD DETAILS MODAL ==================== */}
      {showCardDetails && selectedCard && (
        <div className="modal-overlay" onClick={() => setShowCardDetails(false)}>
          <div className="modal-content card-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💳 Card Details</h2>
              <button className="modal-close" onClick={() => setShowCardDetails(false)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Card Preview */}
              <div className={`card-preview ${getCardColor(selectedCard.type)}`}>
                <div className="preview-header">
                  <span className="card-issuer">{selectedCard.issuer}</span>
                  {selectedCard.isDefault && <span className="preview-default">⭐ Default</span>}
                </div>
                <div className="preview-number">•••• •••• •••• {selectedCard.last4}</div>
                <div className="preview-footer">
                  <span>{selectedCard.holderName}</span>
                  <span>{selectedCard.expiryMonth}/{selectedCard.expiryYear}</span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="details-grid">
                <div className="detail-item">
                  <p className="detail-label">Card Name</p>
                  <p className="detail-value">{selectedCard.cardName}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Status</p>
                  <span className={`status-badge ${getStatusBadge(selectedCard.status).class}`}>
                    {getStatusBadge(selectedCard.status).icon} {getStatusBadge(selectedCard.status).label}
                  </span>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Total Transactions</p>
                  <p className="detail-value">{selectedCard.totalTransactions}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Total Spent</p>
                  <p className="detail-value">₹{selectedCard.totalSpent.toLocaleString()}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Added Date</p>
                  <p className="detail-value">{selectedCard.addedDate}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Last Used</p>
                  <p className="detail-value">{selectedCard.lastUsed}</p>
                </div>
              </div>

              {/* Transaction History */}
              <div className="transaction-section">
                <h3>📊 Recent Transactions</h3>
                <div className="transactions-list">
                  {selectedCardTransactions.length > 0 ? (
                    selectedCardTransactions.slice(0, 5).map(txn => (
                      <div key={txn.id} className={`transaction-item ${txn.status}`}>
                        <div className="txn-info">
                          <p className="txn-description">{txn.description}</p>
                          <p className="txn-merchant">{txn.merchant}</p>
                        </div>
                        <div className="txn-amount">₹{txn.amount}</div>
                        <p className="txn-date">{txn.date}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-transactions">No transactions yet</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                {selectedCard.status === 'pending' && (
                  <button className="btn-verify" onClick={() => {
                    setShowVerification(true);
                    setShowCardDetails(false);
                  }}>
                    ✓ Verify Card
                  </button>
                )}
                
                {selectedCard.status === 'verified' && !selectedCard.isDefault && (
                  <button className="btn-default" onClick={() => handleSetDefault(selectedCard)}>
                    ⭐ Set as Default
                  </button>
                )}

                {selectedCard.status !== 'blocked' && selectedCard.status !== 'expired' && (
                  <button className="btn-block" onClick={() => handleBlockCard(selectedCard)}>
                    🚫 Block Card
                  </button>
                )}

                <button className="btn-delete" onClick={() => {
                  setCardToDelete(selectedCard);
                  setShowDeleteConfirm(true);
                  setShowCardDetails(false);
                }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== VERIFICATION MODAL ==================== */}
      {showVerification && selectedCard && (
        <div className="modal-overlay" onClick={() => setShowVerification(false)}>
          <div className="modal-content verification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔐 Verify Card</h2>
              <button className="modal-close" onClick={() => setShowVerification(false)}>✕</button>
            </div>

            <div className="verification-content">
              <div className="verification-tabs">
                <button
                  className={`verification-tab ${verificationStep === 'otp' ? 'active' : ''}`}
                  onClick={() => setVerificationStep('otp')}
                >
                  📨 OTP
                </button>
                <button
                  className={`verification-tab ${verificationStep === 'cvv' ? 'active' : ''}`}
                  onClick={() => setVerificationStep('cvv')}
                >
                  🔒 CVV
                </button>
              </div>

              {verificationStep === 'otp' && (
                <div className="verification-step">
                  <p>Enter the OTP sent to your registered mobile number</p>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    className="verification-input otp-input"
                  />
                </div>
              )}

              {verificationStep === 'cvv' && (
                <div className="verification-step">
                  <p>Enter the CVV from the back of your card</p>
                  <input
                    type="password"
                    placeholder="Enter 3-4 digit CVV"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                    className="verification-input"
                  />
                </div>
              )}

              <div className="verification-buttons">
                <button className="btn-secondary" onClick={() => setShowVerification(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleVerifyCard} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DELETE CONFIRMATION ==================== */}
      {showDeleteConfirm && cardToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚠️ Delete Card</h2>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>✕</button>
            </div>

            <div className="confirmation-content">
              <p>Are you sure you want to delete <strong>{cardToDelete.cardName}</strong>?</p>
              <p className="confirmation-warning">This action cannot be undone.</p>

              <div className="confirmation-buttons">
                <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
                <button className="btn-danger" onClick={handleDeleteCard} disabled={loading}>
                  {loading ? 'Deleting...' : 'Delete Card'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardManagementPremium;

/**
 * Beneficiary Management Premium Component
 * Enterprise-grade payment recipient management
 * Features: Add/Edit/Manage/Verify, Multi-account, Favorites, History
 */

import React, { useState, useMemo } from 'react';
import '../../styles/beneficiary-management-premium.css';

interface BankAccount {
  id: string;
  accountNumber: string;
  accountType: 'savings' | 'current';
  accountHolder: string;
  ifscCode: string;
  bankName: string;
  isDefault: boolean;
  verified: boolean;
}

interface Beneficiary {
  id: string;
  name: string;
  email: string;
  phone: string;
  upiId?: string;
  bankAccounts: BankAccount[];
  relationship?: string;
  status: 'verified' | 'pending' | 'failed';
  isFavorite: boolean;
  addedDate: string;
  lastTransaction?: string;
  totalTransactions: number;
  totalAmount: number;
  kycStatus: 'verified' | 'pending' | 'failed';
  profileImage?: string;
}

interface TransactionHistory {
  id: string;
  beneficiaryId: string;
  amount: number;
  date: string;
  status: 'success' | 'failed';
  method: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  upiId: string;
  relationship: string;
  accountNumber: string;
  accountHolder: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
}

const BeneficiaryManagementPremium: React.FC = () => {
  // ==================== STATE ====================
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: 'BEN_001',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+919876543210',
      relationship: 'Brother',
      bankAccounts: [
        { id: 'ACC_001', accountNumber: '1234567890123456', accountType: 'savings', accountHolder: 'Rajesh Kumar', ifscCode: 'HDFC0001234', bankName: 'HDFC Bank', isDefault: true, verified: true }
      ],
      status: 'verified',
      isFavorite: true,
      addedDate: '2025-08-15',
      lastTransaction: '2026-01-07',
      totalTransactions: 12,
      totalAmount: 125000,
      kycStatus: 'verified',
    },
    {
      id: 'BEN_002',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+919988776655',
      upiId: 'priya@upi',
      relationship: 'Sister',
      bankAccounts: [],
      status: 'verified',
      isFavorite: false,
      addedDate: '2025-10-20',
      lastTransaction: '2026-01-06',
      totalTransactions: 8,
      totalAmount: 75000,
      kycStatus: 'verified',
    },
    {
      id: 'BEN_003',
      name: 'Amit Patel',
      email: 'amit@example.com',
      phone: '+919765432109',
      bankAccounts: [
        { id: 'ACC_002', accountNumber: '9876543210987654', accountType: 'current', accountHolder: 'Amit Patel', ifscCode: 'ICIC0000001', bankName: 'ICICI Bank', isDefault: true, verified: false }
      ],
      status: 'pending',
      isFavorite: false,
      addedDate: '2026-01-05',
      totalTransactions: 0,
      totalAmount: 0,
      kycStatus: 'pending',
    },
  ]);

  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [beneficiaryToDelete, setBeneficiaryToDelete] = useState<Beneficiary | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'sms' | 'email'>('sms');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    upiId: '',
    relationship: '',
    accountNumber: '',
    accountHolder: '',
    ifscCode: '',
    accountType: 'savings',
  });

  const [transactionHistory] = useState<TransactionHistory[]>([
    { id: 'TXN001', beneficiaryId: 'BEN_001', amount: 10000, date: '2026-01-07', status: 'success', method: 'NEFT' },
    { id: 'TXN002', beneficiaryId: 'BEN_001', amount: 15000, date: '2026-01-05', status: 'success', method: 'IMPS' },
    { id: 'TXN003', beneficiaryId: 'BEN_002', amount: 25000, date: '2026-01-06', status: 'success', method: 'UPI' },
    { id: 'TXN004', beneficiaryId: 'BEN_001', amount: 5000, date: '2026-01-04', status: 'failed', method: 'NEFT' },
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ==================== FILTERING ====================

  const filteredBeneficiaries = useMemo(() => {
    let result = [...beneficiaries];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(b =>
        b.name.toLowerCase().includes(term) ||
        b.email.toLowerCase().includes(term) ||
        b.phone.includes(term) ||
        b.upiId?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(b => b.status === filterStatus);
    }

    return result;
  }, [beneficiaries, searchTerm, filterStatus]);

  // ==================== HANDLERS ====================

  const handleAddBeneficiary = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setMessage({ type: 'error', text: 'Please fill required fields' });
      return;
    }

    if (!formData.upiId && !formData.accountNumber) {
      setMessage({ type: 'error', text: 'Add UPI ID or Bank Account' });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newBeneficiary: Beneficiary = {
        id: `BEN_${String(beneficiaries.length + 1).padStart(3, '0')}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        upiId: formData.upiId || undefined,
        relationship: formData.relationship || undefined,
        bankAccounts: formData.accountNumber
          ? [{
              id: `ACC_${Date.now()}`,
              accountNumber: formData.accountNumber,
              accountType: formData.accountType,
              accountHolder: formData.accountHolder,
              ifscCode: formData.ifscCode,
              bankName: 'Bank Name',
              isDefault: true,
              verified: false,
            }]
          : [],
        status: 'pending',
        isFavorite: false,
        addedDate: new Date().toISOString().split('T')[0],
        totalTransactions: 0,
        totalAmount: 0,
        kycStatus: 'pending',
      };

      setBeneficiaries([...beneficiaries, newBeneficiary]);
      setMessage({ type: 'success', text: 'Beneficiary added! Verification pending.' });
      setFormData({ name: '', email: '', phone: '', upiId: '', relationship: '', accountNumber: '', accountHolder: '', ifscCode: '', accountType: 'savings' });
      setShowAddForm(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add beneficiary' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBeneficiary = async () => {
    if (verificationCode.length < 4) {
      setMessage({ type: 'error', text: 'Enter valid verification code' });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      setBeneficiaries(beneficiaries.map(b =>
        b.id === selectedBeneficiary?.id
          ? { ...b, status: 'verified', kycStatus: 'verified' }
          : b
      ));

      setSelectedBeneficiary(prev =>
        prev ? { ...prev, status: 'verified', kycStatus: 'verified' } : null
      );

      setMessage({ type: 'success', text: 'Beneficiary verified successfully!' });
      setShowVerification(false);
      setVerificationCode('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Verification failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (beneficiary: Beneficiary) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setBeneficiaries(beneficiaries.map(b =>
        b.id === beneficiary.id ? { ...b, isFavorite: !b.isFavorite } : b
      ));

      setSelectedBeneficiary(prev =>
        prev?.id === beneficiary.id ? { ...prev, isFavorite: !prev.isFavorite } : prev
      );

      setMessage({
        type: 'success',
        text: !beneficiary.isFavorite ? 'Added to favorites' : 'Removed from favorites',
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update favorite' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBeneficiary = async () => {
    if (!beneficiaryToDelete) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setBeneficiaries(beneficiaries.filter(b => b.id !== beneficiaryToDelete.id));
      setMessage({ type: 'success', text: 'Beneficiary deleted' });
      setShowDeleteConfirm(false);
      setBeneficiaryToDelete(null);
      setSelectedBeneficiary(null);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete beneficiary' });
    } finally {
      setLoading(false);
    }
  };

  const selectedBeneficiaryTransactions = selectedBeneficiary
    ? transactionHistory.filter(t => t.beneficiaryId === selectedBeneficiary.id)
    : [];

  const getStatusBadge = (status: string) => {
    const config: Record<string, { class: string; icon: string; label: string }> = {
      verified: { class: 'verified', icon: '✓', label: 'Verified' },
      pending: { class: 'pending', icon: '⏱', label: 'Pending' },
      failed: { class: 'failed', icon: '✕', label: 'Failed' },
    };
    return config[status] || { class: '', icon: '', label: '' };
  };

  // ==================== RENDER ====================

  return (
    <div className="beneficiary-management-container">
      <div className="beneficiary-header">
        <h1>👥 Beneficiary Management</h1>
        <p>Add and manage your payment recipients securely</p>
      </div>

      {message && (
        <div className={`message-banner ${message.type}`}>
          <span>{message.type === 'success' ? '✓' : '✕'} {message.text}</span>
          <button onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      {/* ==================== TOOLBAR ==================== */}
      <div className="beneficiary-toolbar">
        <button className="btn-add-beneficiary" onClick={() => setShowAddForm(true)}>
          ➕ Add Beneficiary
        </button>

        <div className="toolbar-middle">
          <input
            type="text"
            placeholder="🔍 Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
        </div>

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

      {/* ==================== BENEFICIARY LIST ==================== */}
      <div className={`beneficiary-container beneficiary-${viewMode}`}>
        {filteredBeneficiaries.length > 0 ? (
          filteredBeneficiaries.map(beneficiary => (
            <div
              key={beneficiary.id}
              className={`beneficiary-card ${beneficiary.status}`}
              onClick={() => {
                setSelectedBeneficiary(beneficiary);
                setShowDetails(true);
              }}
            >
              <div className="card-header">
                <div className="beneficiary-avatar">
                  {beneficiary.name.charAt(0).toUpperCase()}
                </div>
                <div className="card-title">
                  <h3>{beneficiary.name}</h3>
                  <p className="relationship">{beneficiary.relationship || 'Contact'}</p>
                </div>
                <button
                  className={`favorite-btn ${beneficiary.isFavorite ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(beneficiary);
                  }}
                >
                  ⭐
                </button>
              </div>

              <div className="card-content">
                <div className="contact-info">
                  <p className="info-item">📧 {beneficiary.email}</p>
                  <p className="info-item">📱 {beneficiary.phone}</p>
                  {beneficiary.upiId && <p className="info-item">💳 {beneficiary.upiId}</p>}
                </div>

                <div className="card-stats">
                  <div className="stat">
                    <span className="stat-label">Transactions</span>
                    <span className="stat-value">{beneficiary.totalTransactions}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Total Sent</span>
                    <span className="stat-value">₹{beneficiary.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <span className={`status-badge ${getStatusBadge(beneficiary.status).class}`}>
                    {getStatusBadge(beneficiary.status).icon} {getStatusBadge(beneficiary.status).label}
                  </span>
                  {beneficiary.lastTransaction && (
                    <span className="last-transaction">Last: {beneficiary.lastTransaction}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-beneficiaries">
            <p>👥 No beneficiaries found</p>
            <button className="btn-add-beneficiary" onClick={() => setShowAddForm(true)}>
              ➕ Add Your First Beneficiary
            </button>
          </div>
        )}
      </div>

      {/* ==================== ADD BENEFICIARY FORM ==================== */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Add New Beneficiary</h2>
              <button className="modal-close" onClick={() => setShowAddForm(false)}>✕</button>
            </div>

            <div className="form-content">
              <div className="form-section">
                <h3>📋 Personal Information</h3>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter beneficiary name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Relationship</label>
                  <select value={formData.relationship} onChange={(e) => setFormData({ ...formData, relationship: e.target.value })} className="form-input">
                    <option value="">Select relationship</option>
                    <option value="Family">Family Member</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Business">Business Contact</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-section">
                <h3>💰 Payment Method</h3>
                <div className="form-group">
                  <label>UPI ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="username@bankname"
                    value={formData.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="divider">or</div>

                <div className="form-group">
                  <label>Bank Account Number</label>
                  <input
                    type="text"
                    placeholder="16-18 digit account number"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
                    className="form-input"
                  />
                </div>

                {formData.accountNumber && (
                  <>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Account Holder Name</label>
                        <input
                          type="text"
                          placeholder="As shown in bank"
                          value={formData.accountHolder}
                          onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>IFSC Code</label>
                        <input
                          type="text"
                          placeholder="HDFC0001234"
                          value={formData.ifscCode}
                          onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Account Type</label>
                      <select value={formData.accountType} onChange={(e) => setFormData({ ...formData, accountType: e.target.value as any })} className="form-input">
                        <option value="savings">Savings</option>
                        <option value="current">Current</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="form-note">
                🔒 Your beneficiary details are encrypted and verified before transactions
              </div>

              <div className="form-buttons">
                <button className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleAddBeneficiary} disabled={loading}>
                  {loading ? 'Adding...' : 'Add Beneficiary'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== BENEFICIARY DETAILS MODAL ==================== */}
      {showDetails && selectedBeneficiary && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>👤 Beneficiary Details</h2>
              <button className="modal-close" onClick={() => setShowDetails(false)}>✕</button>
            </div>

            <div className="details-content">
              {/* Profile Section */}
              <div className="profile-section">
                <div className="profile-avatar">{selectedBeneficiary.name.charAt(0)}</div>
                <div className="profile-info">
                  <h3>{selectedBeneficiary.name}</h3>
                  <p>{selectedBeneficiary.relationship || 'Contact'}</p>
                  <button
                    className={`favorite-btn ${selectedBeneficiary.isFavorite ? 'active' : ''}`}
                    onClick={() => handleToggleFavorite(selectedBeneficiary)}
                  >
                    {selectedBeneficiary.isFavorite ? '⭐ Remove from Favorites' : '☆ Add to Favorites'}
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="info-section">
                <h4>📋 Contact Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Email</label>
                    <p>{selectedBeneficiary.email}</p>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <p>{selectedBeneficiary.phone}</p>
                  </div>
                  {selectedBeneficiary.upiId && (
                    <div className="info-item">
                      <label>UPI ID</label>
                      <p>{selectedBeneficiary.upiId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bank Accounts */}
              {selectedBeneficiary.bankAccounts.length > 0 && (
                <div className="info-section">
                  <h4>🏦 Bank Accounts</h4>
                  {selectedBeneficiary.bankAccounts.map(account => (
                    <div key={account.id} className="account-card">
                      <div className="account-header">
                        <span className="account-type">{account.accountType.toUpperCase()}</span>
                        {account.isDefault && <span className="default-label">DEFAULT</span>}
                      </div>
                      <p className="account-number">•••• •••• •••• {account.accountNumber.slice(-4)}</p>
                      <div className="account-details">
                        <p><strong>Holder:</strong> {account.accountHolder}</p>
                        <p><strong>IFSC:</strong> {account.ifscCode}</p>
                        <p><strong>Bank:</strong> {account.bankName}</p>
                      </div>
                      <span className={`verify-badge ${account.verified ? 'verified' : 'unverified'}`}>
                        {account.verified ? '✓ Verified' : '⏱ Pending Verification'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Status & KYC */}
              <div className="status-section">
                <div className="status-item">
                  <label>Verification Status</label>
                  <span className={`status-badge ${getStatusBadge(selectedBeneficiary.status).class}`}>
                    {getStatusBadge(selectedBeneficiary.status).icon} {getStatusBadge(selectedBeneficiary.status).label}
                  </span>
                </div>
                <div className="status-item">
                  <label>KYC Status</label>
                  <span className={`status-badge ${getStatusBadge(selectedBeneficiary.kycStatus).class}`}>
                    {getStatusBadge(selectedBeneficiary.kycStatus).icon} {getStatusBadge(selectedBeneficiary.kycStatus).label}
                  </span>
                </div>
              </div>

              {/* Statistics */}
              <div className="stats-section">
                <div className="stat-card">
                  <p className="stat-label">Total Transactions</p>
                  <p className="stat-value">{selectedBeneficiary.totalTransactions}</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Total Sent</p>
                  <p className="stat-value">₹{selectedBeneficiary.totalAmount.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Added Date</p>
                  <p className="stat-value">{selectedBeneficiary.addedDate}</p>
                </div>
                {selectedBeneficiary.lastTransaction && (
                  <div className="stat-card">
                    <p className="stat-label">Last Transaction</p>
                    <p className="stat-value">{selectedBeneficiary.lastTransaction}</p>
                  </div>
                )}
              </div>

              {/* Transaction History */}
              {selectedBeneficiaryTransactions.length > 0 && (
                <div className="info-section">
                  <h4>📊 Recent Transactions</h4>
                  <div className="transactions-list">
                    {selectedBeneficiaryTransactions.slice(0, 5).map(txn => (
                      <div key={txn.id} className={`transaction-item ${txn.status}`}>
                        <div>
                          <p className="txn-method">{txn.method}</p>
                          <p className="txn-date">{txn.date}</p>
                        </div>
                        <p className="txn-amount">₹{txn.amount}</p>
                        <span className="txn-status">{txn.status === 'success' ? '✓' : '✕'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                {selectedBeneficiary.status === 'pending' && (
                  <button className="btn-verify" onClick={() => {
                    setShowVerification(true);
                    setShowDetails(false);
                  }}>
                    ✓ Verify Beneficiary
                  </button>
                )}

                <button className="btn-delete" onClick={() => {
                  setBeneficiaryToDelete(selectedBeneficiary);
                  setShowDeleteConfirm(true);
                  setShowDetails(false);
                }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== VERIFICATION MODAL ==================== */}
      {showVerification && selectedBeneficiary && (
        <div className="modal-overlay" onClick={() => setShowVerification(false)}>
          <div className="modal-content verification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔐 Verify Beneficiary</h2>
              <button className="modal-close" onClick={() => setShowVerification(false)}>✕</button>
            </div>

            <div className="verification-content">
              <div className="verification-tabs">
                <button
                  className={`verification-tab ${verificationMethod === 'sms' ? 'active' : ''}`}
                  onClick={() => setVerificationMethod('sms')}
                >
                  📨 SMS OTP
                </button>
                <button
                  className={`verification-tab ${verificationMethod === 'email' ? 'active' : ''}`}
                  onClick={() => setVerificationMethod('email')}
                >
                  ✉️ Email OTP
                </button>
              </div>

              <p className="verification-info">
                {verificationMethod === 'sms'
                  ? `OTP sent to ${selectedBeneficiary.phone}`
                  : `OTP sent to ${selectedBeneficiary.email}`}
              </p>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                className="verification-input otp-input"
              />

              <div className="verification-buttons">
                <button className="btn-secondary" onClick={() => setShowVerification(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleVerifyBeneficiary} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DELETE CONFIRMATION ==================== */}
      {showDeleteConfirm && beneficiaryToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚠️ Delete Beneficiary</h2>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>✕</button>
            </div>

            <div className="confirmation-content">
              <p>Are you sure you want to delete <strong>{beneficiaryToDelete.name}</strong>?</p>
              <p className="confirmation-warning">This action cannot be undone.</p>

              <div className="confirmation-buttons">
                <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button className="btn-danger" onClick={handleDeleteBeneficiary} disabled={loading}>
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryManagementPremium;

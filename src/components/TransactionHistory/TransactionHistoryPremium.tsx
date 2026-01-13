/**
 * Transaction History Premium Component
 * Enterprise-grade transaction management
 * Features: Advanced filtering, pagination, export, analytics
 * Integrated with mockService for user-specific transaction data
 * Supports filtering by: phone number, user ID, dates, status, type
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockService } from '../../services/mockService';
import { mockUsers } from '../../mock/data/users';
import '../../styles/transaction-history-premium.css';

interface TransactionFilters {
  search: string;
  type: 'all' | 'credit' | 'debit' | 'transfer' | 'refund';
  status: 'all' | 'success' | 'pending' | 'failed' | 'reversed';
  dateFrom: string;
  dateTo: string;
  amountFrom: number | '';
  amountTo: number | '';
  sortBy: 'recent' | 'oldest' | 'amount-high' | 'amount-low';
}

interface Transaction {
  id: string;
  userId?: string;
  phone?: string;
  type: 'credit' | 'debit' | 'transfer' | 'refund';
  status: 'success' | 'pending' | 'failed' | 'reversed';
  amount: number;
  fee: number;
  description: string;
  beneficiary: string;
  accountNumber?: string;
  ifscCode?: string;
  timestamp: string;
  paymentMethod?: string;
  upiId?: string;
  reference?: string;
  notes?: string;
}

const TRANSACTIONS_PER_PAGE = 10;

const TransactionHistoryPremium: React.FC = () => {
  const { user } = useAuth();
  
  // ==================== STATE ====================
  const [filters, setFilters] = useState<TransactionFilters>({
    search: '',
    type: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    amountFrom: '',
    amountTo: '',
    sortBy: 'recent',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | null>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'>('month');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==================== FETCH TRANSACTIONS FROM MOCK SERVICE ====================
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        if (user) {
          let txns: any[] = [];
          
          // Admins get ALL transactions, regular users get only their own
          if (user.role === 'admin') {
            txns = await mockService.getAllTransactions();
          } else {
            txns = await mockService.getTransactions(String(user.id), user.role);
          }
          
          // Transform from mockService format to Transaction interface
          const formattedTxns: Transaction[] = (txns || []).map((t: any) => ({
            id: t.id || 'TXN-' + Math.random().toString(36).substr(2, 9),
            userId: t.userId,
            phone: t.phone,
            type: (t.type === 'AddMoney' ? 'credit' : 'debit') as any,
            status: (t.status === 'success' ? 'success' : 'failed') as any,
            amount: t.amount || 0,
            fee: t.fee || 0,
            description: t.description || 'Transaction',
            beneficiary: t.description || 'Beneficiary',
            timestamp: new Date(t.date).toLocaleString(),
            reference: t.reference,
            notes: t.description,
          }));
          
          setTransactions(formattedTxns);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  // ==================== FILTER HANDLERS ====================

  const handleFilterChange = useCallback((field: keyof TransactionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  }, []);

  const handleDateRangePreset = useCallback((range: string) => {
    const today = new Date();
    let from = new Date();

    switch (range) {
      case 'today':
        from.setDate(today.getDate());
        break;
      case 'week':
        from.setDate(today.getDate() - 7);
        break;
      case 'month':
        from.setMonth(today.getMonth() - 1);
        break;
      case 'quarter':
        from.setMonth(today.getMonth() - 3);
        break;
      case 'year':
        from.setFullYear(today.getFullYear() - 1);
        break;
    }

    setDateRange(range as any);
    if (range !== 'custom') {
      setFilters(prev => ({
        ...prev,
        dateFrom: from.toISOString().split('T')[0],
        dateTo: today.toISOString().split('T')[0],
      }));
      setCurrentPage(1);
    }
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      type: 'all',
      status: 'all',
      dateFrom: '',
      dateTo: '',
      amountFrom: '',
      amountTo: '',
      sortBy: 'recent',
    });
    setCurrentPage(1);
    setDateRange('month');
  }, []);

  // ==================== FILTERING & SORTING ====================

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search filter - support filtering by transaction ID, description, user ID, or phone number
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(t => {
        // Search in transaction fields
        if (t.id.toLowerCase().includes(search) ||
            t.description.toLowerCase().includes(search) ||
            t.beneficiary.toLowerCase().includes(search) ||
            t.reference?.toLowerCase().includes(search)) {
          return true;
        }
        
        // Search by user ID field
        if (t.userId && t.userId.toLowerCase().includes(search)) {
          return true;
        }
        
        // Search by phone number field
        if (t.phone && (t.phone.toLowerCase().includes(search) || 
            t.phone.replace('+91', '').includes(search.replace('+91', '')))) {
          return true;
        }
        
        return false;
      });
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }

    // Date range filter
    if (filters.dateFrom) {
      result = result.filter(t => {
        try {
          return new Date(t.timestamp) >= new Date(filters.dateFrom);
        } catch {
          return true;
        }
      });
    }
    if (filters.dateTo) {
      result = result.filter(t => {
        try {
          return new Date(t.timestamp) <= new Date(filters.dateTo);
        } catch {
          return true;
        }
      });
    }

    // Amount range filter
    if (filters.amountFrom !== '') {
      result = result.filter(t => t.amount >= Number(filters.amountFrom));
    }
    if (filters.amountTo !== '') {
      result = result.filter(t => t.amount <= Number(filters.amountTo));
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'recent':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'amount-high':
          return b.amount - a.amount;
        case 'amount-low':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return result;
  }, [filters, transactions, user, mockUsers]);

  // ==================== PAGINATION ====================

  const totalPages = Math.ceil(filteredTransactions.length / TRANSACTIONS_PER_PAGE);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
    return filteredTransactions.slice(start, start + TRANSACTIONS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  // ==================== ANALYTICS ====================

  const analytics = useMemo(() => {
    const totalTransactions = filteredTransactions.length;
    const totalCredit = filteredTransactions
      .filter(t => (t.type === 'credit' || t.type === 'refund') && t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalDebit = filteredTransactions
      .filter(t => (t.type === 'debit' || t.type === 'transfer') && t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalFees = filteredTransactions
      .filter(t => t.status === 'success')
      .reduce((sum, t) => sum + t.fee, 0);
    const successCount = filteredTransactions.filter(t => t.status === 'success').length;
    const failedCount = filteredTransactions.filter(t => t.status === 'failed').length;

    return {
      totalTransactions,
      totalCredit,
      totalDebit,
      netAmount: totalCredit - totalDebit,
      totalFees,
      successRate: totalTransactions > 0 ? ((successCount / totalTransactions) * 100).toFixed(1) : '0',
      failedCount,
    };
  }, [filteredTransactions]);

  // ==================== EXPORT ====================

  const handleExport = useCallback((format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const headers = ['Transaction ID', 'Type', 'Status', 'Amount', 'Fee', 'Net', 'Description', 'Beneficiary', 'Date'];
      const rows = filteredTransactions.map(t => [
        t.id,
        t.type.toUpperCase(),
        t.status.toUpperCase(),
        `₹${t.amount.toFixed(2)}`,
        `₹${t.fee.toFixed(2)}`,
        `₹${(t.amount - t.fee).toFixed(2)}`,
        t.description,
        t.beneficiary,
        t.timestamp,
      ]);

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else if (format === 'pdf') {
      // Trigger print dialog (browser will print to PDF)
      window.print();
    }

    setExportFormat(null);
  }, [filteredTransactions]);

  // ==================== STATUS BADGE ====================

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { class: string; icon: string }> = {
      success: { class: 'success', icon: '✓' },
      pending: { class: 'pending', icon: '⏱' },
      failed: { class: 'failed', icon: '✕' },
      reversed: { class: 'reversed', icon: '↻' },
    };
    return statusConfig[status] || { class: '', icon: '' };
  };

  const getTypeBadge = (type: string) => {
    const typeConfig: Record<string, { class: string; icon: string; label: string }> = {
      credit: { class: 'credit', icon: '↓', label: 'Credit' },
      debit: { class: 'debit', icon: '↑', label: 'Debit' },
      transfer: { class: 'transfer', icon: '⇄', label: 'Transfer' },
      refund: { class: 'refund', icon: '↶', label: 'Refund' },
    };
    return typeConfig[type] || { class: '', icon: '', label: '' };
  };

  // ==================== RENDER ====================

  if (loading) {
    return (
      <div className="transaction-history-container">
        <div className="transaction-header">
          <h1>💳 Transaction History</h1>
          <p>Complete record of all your financial transactions</p>
        </div>
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#6B7280' }}>
          Loading your transactions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history-container">
        <div className="transaction-header">
          <h1>💳 Transaction History</h1>
          <p>Complete record of all your financial transactions</p>
        </div>
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#EF4444' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-history-container">
      <div className="transaction-header">
        <h1>💳 Transaction History</h1>
        <p>Complete record of all your financial transactions</p>
      </div>

      {/* ==================== ANALYTICS CARDS ==================== */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-icon">💰</div>
          <div className="analytics-content">
            <p className="analytics-label">Total Credited</p>
            <p className="analytics-value">₹{analytics.totalCredit.toLocaleString()}</p>
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-icon">📤</div>
          <div className="analytics-content">
            <p className="analytics-label">Total Debited</p>
            <p className="analytics-value">₹{analytics.totalDebit.toLocaleString()}</p>
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-icon">✓</div>
          <div className="analytics-content">
            <p className="analytics-label">Success Rate</p>
            <p className="analytics-value">{analytics.successRate}%</p>
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-icon">⚙️</div>
          <div className="analytics-content">
            <p className="analytics-label">Total Fees</p>
            <p className="analytics-value">₹{analytics.totalFees.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* ==================== INQUIRY FORM SECTION ==================== */}
      <div className="inquiry-section">
        <h3>🔍 Search Transactions</h3>
        <div className="inquiry-form">
          {/* Primary Search Fields */}
          <div className="inquiry-row primary">
            <div className="inquiry-field">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="inquiry-input"
              />
            </div>

            <div className="inquiry-field">
              <label>User ID</label>
              <input
                type="text"
                placeholder="e.g., USR-001, USR-002"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="inquiry-input"
              />
            </div>

            <div className="inquiry-field">
              <label>Date Range</label>
              <select value={dateRange} onChange={(e) => handleDateRangePreset(e.target.value)} className="inquiry-select">
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <div className="inquiry-row secondary">
              <div className="inquiry-field">
                <label>From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="inquiry-input"
                />
              </div>
              <div className="inquiry-field">
                <label>To Date</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="inquiry-input"
                />
              </div>
            </div>
          )}

          {/* Advanced Filters */}
          <div className="inquiry-row secondary">
            <div className="inquiry-field">
              <label>Transaction Type</label>
              <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)} className="inquiry-select">
                <option value="all">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
                <option value="transfer">Transfer</option>
                <option value="refund">Refund</option>
              </select>
            </div>

            <div className="inquiry-field">
              <label>Status</label>
              <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} className="inquiry-select">
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="reversed">Reversed</option>
              </select>
            </div>

            <div className="inquiry-field">
              <label>Amount Range (₹)</label>
              <div className="amount-range-inquiry">
                <input
                  type="number"
                  placeholder="From"
                  value={filters.amountFrom}
                  onChange={(e) => handleFilterChange('amountFrom', e.target.value ? Number(e.target.value) : '')}
                  className="inquiry-input-small"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="To"
                  value={filters.amountTo}
                  onChange={(e) => handleFilterChange('amountTo', e.target.value ? Number(e.target.value) : '')}
                  className="inquiry-input-small"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="inquiry-actions">
            <button className="btn-search" onClick={() => setCurrentPage(1)}>
              🔍 Search Transactions
            </button>
            <button className="btn-reset" onClick={clearFilters}>
              ↻ Reset
            </button>
            <button className="btn-export" onClick={() => setExportFormat(exportFormat ? null : 'csv')}>
              📥 Export
            </button>
            {exportFormat !== null && (
              <div className="export-menu-inquiry">
                <button onClick={() => handleExport('csv')}>📄 CSV</button>
                <button onClick={() => handleExport('pdf')}>📋 PDF</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== RESULTS INFO ==================== */}
      <div className="results-info">
        <p>Showing <strong>{(currentPage - 1) * TRANSACTIONS_PER_PAGE + 1}</strong> to <strong>{Math.min(currentPage * TRANSACTIONS_PER_PAGE, filteredTransactions.length)}</strong> of <strong>{filteredTransactions.length}</strong> transactions</p>
      </div>

      {/* ==================== TABLE VIEW (Desktop & Mobile) ==================== */}
      <div className="transactions-table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Phone</th>
              <th>Transaction ID</th>
              <th>Type</th>
              <th>Description</th>
              <th>Beneficiary</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date & Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map(transaction => {
                const typeInfo = getTypeBadge(transaction.type);
                const statusInfo = getStatusBadge(transaction.status);
                return (
                  <tr key={transaction.id} className={`tx-row-${transaction.type}`}>
                    <td className="tx-userid">{transaction.userId || 'N/A'}</td>
                    <td className="tx-phone">{transaction.phone || 'N/A'}</td>
                    <td className="tx-id">{transaction.id}</td>
                    <td>
                      <span className={`type-badge ${typeInfo.class}`}>
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                    </td>
                    <td className="tx-description">{transaction.description}</td>
                    <td className="tx-beneficiary">{transaction.beneficiary}</td>
                    <td className={`tx-amount ${transaction.type === 'debit' || transaction.type === 'transfer' ? 'negative' : 'positive'}`}>
                      {transaction.type === 'debit' || transaction.type === 'transfer' ? '-' : '+'}₹{transaction.amount.toFixed(2)}
                      <span className="tx-fee">({transaction.fee > 0 ? `₹${transaction.fee.toFixed(2)} fee` : 'No fee'})</span>
                    </td>
                    <td>
                      <span className={`status-badge ${statusInfo.class}`}>
                        {statusInfo.icon} {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="tx-timestamp">{transaction.timestamp}</td>
                    <td>
                      <button
                        className="btn-view-details"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="no-transactions">
                  <p>📭 No transactions found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==================== PAGINATION ==================== */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))
              .map(page => (
                <button
                  key={page}
                  className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            {currentPage + 1 < totalPages && <span className="pagination-dots">...</span>}
          </div>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {/* ==================== DETAIL MODAL ==================== */}
      {selectedTransaction && (
        <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
          <div className="modal-content transaction-detail-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <h2>💳 Transaction Details</h2>
              <button className="modal-close" onClick={() => setSelectedTransaction(null)}>✕</button>
            </div>

            {/* Filter Section at Top */}
            <div className="modal-filter-section">
              <div className="modal-filter-group">
                <label>User ID</label>
                <input 
                  type="text" 
                  value={selectedTransaction.userId || ''} 
                  readOnly 
                  className="modal-filter-input"
                />
              </div>
              <div className="modal-filter-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  value={selectedTransaction.phone || ''} 
                  readOnly 
                  className="modal-filter-input"
                />
              </div>
              <div className="modal-filter-group">
                <label>Date</label>
                <input 
                  type="text" 
                  value={selectedTransaction.timestamp || ''} 
                  readOnly 
                  className="modal-filter-input"
                />
              </div>
            </div>

            {/* Transaction Details Table */}
            <div className="modal-details-table-wrapper">
              <table className="modal-details-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="field-label">Transaction ID</td>
                    <td className="field-value">{selectedTransaction.id}</td>
                  </tr>
                  <tr>
                    <td className="field-label">Type</td>
                    <td className="field-value">
                      <span className={`type-badge ${getTypeBadge(selectedTransaction.type).class}`}>
                        {getTypeBadge(selectedTransaction.type).icon} {getTypeBadge(selectedTransaction.type).label}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="field-label">Status</td>
                    <td className="field-value">
                      <span className={`status-badge ${getStatusBadge(selectedTransaction.status).class}`}>
                        {getStatusBadge(selectedTransaction.status).icon} {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="field-label">Description</td>
                    <td className="field-value">{selectedTransaction.description}</td>
                  </tr>
                  <tr>
                    <td className="field-label">Beneficiary</td>
                    <td className="field-value">{selectedTransaction.beneficiary}</td>
                  </tr>
                  <tr>
                    <td className="field-label">Amount</td>
                    <td className="field-value amount-highlight">
                      {selectedTransaction.type === 'debit' || selectedTransaction.type === 'transfer' ? '-' : '+'}₹{selectedTransaction.amount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="field-label">Transaction Fee</td>
                    <td className="field-value">₹{selectedTransaction.fee.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="field-label">Net Amount</td>
                    <td className="field-value amount-highlight">
                      ₹{(selectedTransaction.amount - selectedTransaction.fee).toFixed(2)}
                    </td>
                  </tr>
                  {selectedTransaction.accountNumber && (
                    <tr>
                      <td className="field-label">Account Number</td>
                      <td className="field-value">{selectedTransaction.accountNumber}</td>
                    </tr>
                  )}
                  {selectedTransaction.ifscCode && (
                    <tr>
                      <td className="field-label">IFSC Code</td>
                      <td className="field-value">{selectedTransaction.ifscCode}</td>
                    </tr>
                  )}
                  {selectedTransaction.upiId && (
                    <tr>
                      <td className="field-label">UPI ID</td>
                      <td className="field-value">{selectedTransaction.upiId}</td>
                    </tr>
                  )}
                  {selectedTransaction.paymentMethod && (
                    <tr>
                      <td className="field-label">Payment Method</td>
                      <td className="field-value">{selectedTransaction.paymentMethod}</td>
                    </tr>
                  )}
                  {selectedTransaction.reference && (
                    <tr>
                      <td className="field-label">Reference</td>
                      <td className="field-value">{selectedTransaction.reference}</td>
                    </tr>
                  )}
                  {selectedTransaction.notes && (
                    <tr>
                      <td className="field-label">Notes</td>
                      <td className="field-value">{selectedTransaction.notes}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedTransaction(null)}>Close</button>
              <button className="btn-primary">📥 Download Receipt</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryPremium;

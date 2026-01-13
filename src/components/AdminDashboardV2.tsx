/**
 * Admin Dashboard V2 - Production Grade
 * Complete redesign with proper data model, filters, and user management
 */

import React, { useState, useEffect } from 'react';
import { mockUsers, getActiveUsers, getNewlyRegisteredUsers } from '../mock/data/users';
import { mockTransactions } from '../mock/data/transactions';
import '../styles/admin-dashboard-v2.css';

interface KPICard {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  onClick: () => void;
}

interface FilterState {
  users: {
    nameSearch: string;
    phoneSearch: string;
    role: string;
    status: string;
  };
  transactions: {
    phoneNumber: string;
    dateFrom: string;
    dateTo: string;
    mode: string;
  };
  wallet: {
    phoneNumber: string;
    role: string;
  };
}

const AdminDashboardV2: React.FC = () => {
  // ==================== STATE MANAGEMENT ====================

  // Modal visibility
  const [activeModal, setActiveModal] = useState<'users' | 'credits' | 'debits' | 'failed' | 'wallet' | null>(null);
  const [showApprovalSection, setShowApprovalSection] = useState(true);

  // Data states
  const [analytics, setAnalytics] = useState<any>(null);
  const [newlyRegisteredUsers, setNewlyRegisteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [pagination, setPagination] = useState({
    users: { page: 1, pageSize: 15 },
    transactions: { page: 1, pageSize: 20 },
    wallet: { page: 1, pageSize: 15 },
  });

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    users: { nameSearch: '', phoneSearch: '', role: '', status: 'Active' },
    transactions: { phoneNumber: '', dateFrom: '2026-01-01', dateTo: '2026-01-31', mode: '' },
    wallet: { phoneNumber: '', role: '' },
  });

  // ==================== EFFECTS ====================

  // Initial data load
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load analytics and initially display Active users
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const activeUsers = getActiveUsers();
      const newReg = getNewlyRegisteredUsers();
      
      const credits = mockTransactions.filter(t => t.transactionType === 'Credit' && t.status === 'Success');
      const debits = mockTransactions.filter(t => t.transactionType === 'Debit' && t.status === 'Success');
      const failed = mockTransactions.filter(t => t.status === 'Failed');
      
      const totalCredits = credits.reduce((sum, t) => sum + t.amount, 0);
      const totalDebits = debits.reduce((sum, t) => sum + t.amount, 0);
      const totalFees = mockTransactions.reduce((sum, t) => sum + t.fee, 0);
      const walletBalance = Math.max(0, totalCredits - totalDebits - totalFees);
      
      const analyticsData = {
        totalActiveUsers: activeUsers.length,
        totalNewlyRegistered: newReg.length,
        totalCredits,
        totalDebits,
        totalFees,
        walletBalance,
        failedTransactions: failed.length,
        totalTransactions: mockTransactions.length,
        successRate: (((mockTransactions.length - failed.length) / mockTransactions.length) * 100).toFixed(2),
        failureRate: ((failed.length / mockTransactions.length) * 100).toFixed(2),
      };

      setAnalytics(analyticsData);
      setNewlyRegisteredUsers(newReg);

      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      setLoading(false);
    }
  };

  // ==================== DATA FETCHING ====================

  const getFilteredUsers = () => {
    let result = mockUsers;
    if (filters.users.nameSearch) {
      result = result.filter(u => u.name.toLowerCase().includes(filters.users.nameSearch.toLowerCase()));
    }
    if (filters.users.phoneSearch) {
      result = result.filter(u => u.phone.includes(filters.users.phoneSearch));
    }
    if (filters.users.role) {
      result = result.filter(u => u.role === filters.users.role);
    }
    if (filters.users.status) {
      result = result.filter(u => u.status === filters.users.status);
    }
    return result;
  };

  const getPaginatedData = (data: any[], pageNumber: number, pageSize: number) => {
    const start = (pageNumber - 1) * pageSize;
    return {
      items: data.slice(start, start + pageSize),
      total: data.length,
      page: pageNumber,
      pageSize,
      totalPages: Math.ceil(data.length / pageSize)
    };
  };

  // ==================== EVENT HANDLERS ====================

  const handleApproveUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) user.status = 'Active';
    setNewlyRegisteredUsers(prev => prev.filter(u => u.id !== userId));
    loadDashboardData();
  };

  const handleRejectUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) user.status = 'Rejected';
    setNewlyRegisteredUsers(prev => prev.filter(u => u.id !== userId));
    loadDashboardData();
  };

  const handleOnHoldUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) user.status = 'On Hold';
    setNewlyRegisteredUsers(prev => prev.filter(u => u.id !== userId));
    loadDashboardData();
  };

  const handleFilterChange = (category: 'users' | 'transactions' | 'wallet', key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: value }
    }));
    setPagination(prev => ({
      ...prev,
      [category]: { ...prev[category], page: 1 }
    }));
  };

  const handleResetFilters = (category: 'users' | 'transactions' | 'wallet') => {
    if (category === 'users') {
      setFilters(prev => ({
        ...prev,
        users: { nameSearch: '', phoneSearch: '', role: '', status: 'Active' }
      }));
    } else if (category === 'transactions') {
      setFilters(prev => ({
        ...prev,
        transactions: { phoneNumber: '', dateFrom: '2026-01-01', dateTo: '2026-01-31', mode: '' }
      }));
    } else if (category === 'wallet') {
      setFilters(prev => ({
        ...prev,
        wallet: { phoneNumber: '', role: '' }
      }));
    }
    setPagination(prev => ({
      ...prev,
      [category]: { ...prev[category], page: 1 }
    }));
  };

  // ==================== RENDER HELPERS ====================

  const renderKPICards = () => {
    if (!analytics) return null;

    const cards: KPICard[] = [
      {
        label: 'Active Users',
        value: analytics.totalActiveUsers,
        icon: '👥',
        color: '#10B981',
        onClick: () => {
          setFilters(prev => ({ ...prev, users: { ...prev.users, status: 'Active' } }));
          setActiveModal('users');
        }
      },
      {
        label: 'Total Credits',
        value: `₹${analytics.totalCredits.toLocaleString('en-IN')}`,
        icon: '💚',
        color: '#059669',
        onClick: () => setActiveModal('credits')
      },
      {
        label: 'Total Debits',
        value: `₹${analytics.totalDebits.toLocaleString('en-IN')}`,
        icon: '❤️',
        color: '#DC2626',
        onClick: () => setActiveModal('debits')
      },
      {
        label: 'Failed Txns',
        value: analytics.failedTransactions,
        icon: '⚠️',
        color: '#F59E0B',
        onClick: () => setActiveModal('failed')
      },
      {
        label: 'Wallet Balance',
        value: `₹${analytics.walletBalance.toLocaleString('en-IN')}`,
        icon: '💰',
        color: '#8B5CF6',
        onClick: () => setActiveModal('wallet')
      }
    ];

    return (
      <div className="kpi-cards-container">
        {cards.map((card, idx) => (
          <div key={idx} className="kpi-card" style={{ borderLeftColor: card.color }}>
            <div className="kpi-header">
              <span className="kpi-icon">{card.icon}</span>
              <span className="kpi-label">{card.label}</span>
            </div>
            <div className="kpi-value">{card.value}</div>
            <button
              className="kpi-action-btn"
              onClick={card.onClick}
              style={{ borderColor: card.color, color: card.color }}
            >
              View Details →
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderApprovalSection = () => {
    return (
      <div className="approval-section">
        <div className="section-header">
          <h3>🎯 Newly Registered Users ({newlyRegisteredUsers.length})</h3>
          <button
            className="collapse-btn"
            onClick={() => setShowApprovalSection(!showApprovalSection)}
          >
            {showApprovalSection ? '−' : '+'}
          </button>
        </div>

        {showApprovalSection && (
          <div className="approval-content">
            {newlyRegisteredUsers.length === 0 ? (
              <div className="empty-state">
                <p>✓ All users have been processed</p>
              </div>
            ) : (
              <div className="approval-table-wrapper">
                <table className="approval-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newlyRegisteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.phone}</td>
                        <td><span className="role-badge" style={{ background: getRoleColor(user.role) }}>{user.role}</span></td>
                        <td>{user.companyName}</td>
                        <td><span className="status-badge" style={{ background: getStatusColor(user.status) }}>{user.status}</span></td>
                        <td>
                          <button className="btn-approve" onClick={() => handleApproveUser(user.id)}>Accept</button>
                          <button className="btn-reject" onClick={() => handleRejectUser(user.id)}>Reject</button>
                          <button className="btn-hold" onClick={() => handleOnHoldUser(user.id)}>Hold</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderModal = () => {
    if (!activeModal) return null;

    let title = '';
    let renderContent: () => JSX.Element = () => <></>;

    if (activeModal === 'users') {
      title = 'Active Users';
      const filtered = getFilteredUsers();
      const paginated = getPaginatedData(filtered, pagination.users.page, pagination.users.pageSize);

      renderContent = () => (
        <>
          <div className="modal-filters">
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.users.nameSearch}
              onChange={(e) => handleFilterChange('users', 'nameSearch', e.target.value)}
              className="filter-input"
            />
            <input
              type="text"
              placeholder="Search by phone..."
              value={filters.users.phoneSearch}
              onChange={(e) => handleFilterChange('users', 'phoneSearch', e.target.value)}
              className="filter-input"
            />
            <select
              value={filters.users.role}
              onChange={(e) => handleFilterChange('users', 'role', e.target.value)}
              className="filter-select"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="merchant">Merchant</option>
              <option value="accountant">Accountant</option>
              <option value="viewer">Viewer</option>
            </select>
            <select
              value={filters.users.status}
              onChange={(e) => handleFilterChange('users', 'status', e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Registered">Registered</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
              <option value="On Hold">On Hold</option>
            </select>
            <button className="btn-reset" onClick={() => handleResetFilters('users')}>Reset</button>
          </div>

          <div className="modal-table-wrapper">
            <table className="modal-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Company</th>
                </tr>
              </thead>
              <tbody>
                {paginated.items.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td><span className="role-badge" style={{ background: getRoleColor(user.role) }}>{user.role}</span></td>
                    <td><span className="status-badge" style={{ background: getStatusColor(user.status) }}>{user.status}</span></td>
                    <td>{user.companyName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="modal-pagination">
            <button disabled={paginated.page === 1} onClick={() => setPagination(prev => ({ ...prev, users: { ...prev.users, page: prev.users.page - 1 } }))}>
              ← Previous
            </button>
            <span>Page {paginated.page} of {paginated.totalPages} ({paginated.total} total)</span>
            <button disabled={paginated.page === paginated.totalPages} onClick={() => setPagination(prev => ({ ...prev, users: { ...prev.users, page: prev.users.page + 1 } }))}>
              Next →
            </button>
          </div>
        </>
      );
    } else if (activeModal === 'credits') {
      title = 'Credit Transactions';
      let credits = mockTransactions.filter(t => t.transactionType === 'Credit');
      if (filters.transactions.phoneNumber) {
        credits = credits.filter(t => t.userPhone.includes(filters.transactions.phoneNumber));
      }
      if (filters.transactions.mode) {
        credits = credits.filter(t => t.mode === filters.transactions.mode);
      }
      const paginated = getPaginatedData(credits, pagination.transactions.page, pagination.transactions.pageSize);

      renderContent = () => (
        <>
          <div className="modal-filters">
            <input
              type="text"
              placeholder="Filter by phone..."
              value={filters.transactions.phoneNumber}
              onChange={(e) => handleFilterChange('transactions', 'phoneNumber', e.target.value)}
              className="filter-input"
            />
            <select
              value={filters.transactions.mode}
              onChange={(e) => handleFilterChange('transactions', 'mode', e.target.value)}
              className="filter-select"
            >
              <option value="">All Modes</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="NetBanking">NetBanking</option>
              <option value="Wallet">Wallet</option>
            </select>
            <button className="btn-reset" onClick={() => handleResetFilters('transactions')}>Reset</button>
          </div>

          <div className="modal-table-wrapper">
            <table className="modal-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Fee</th>
                  <th>Net</th>
                  <th>Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginated.items.map(txn => (
                  <tr key={txn.id}>
                    <td>{txn.id}</td>
                    <td>{txn.userPhone}</td>
                    <td>{new Date(txn.dateTime).toLocaleDateString()}</td>
                    <td>₹{txn.amount.toLocaleString('en-IN')}</td>
                    <td>₹{txn.fee.toLocaleString('en-IN')}</td>
                    <td>₹{txn.netAmount.toLocaleString('en-IN')}</td>
                    <td>{txn.mode}</td>
                    <td><span className={`status-badge ${txn.status.toLowerCase()}`}>{txn.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="modal-pagination">
            <button disabled={paginated.page === 1} onClick={() => setPagination(prev => ({ ...prev, transactions: { ...prev.transactions, page: prev.transactions.page - 1 } }))}>
              ← Previous
            </button>
            <span>Page {paginated.page} of {paginated.totalPages}</span>
            <button disabled={paginated.page === paginated.totalPages} onClick={() => setPagination(prev => ({ ...prev, transactions: { ...prev.transactions, page: prev.transactions.page + 1 } }))}>
              Next →
            </button>
          </div>
        </>
      );
    } else if (activeModal === 'debits') {
      title = 'Debit Transactions';
      let debits = mockTransactions.filter(t => t.transactionType === 'Debit');
      if (filters.transactions.phoneNumber) {
        debits = debits.filter(t => t.userPhone.includes(filters.transactions.phoneNumber));
      }
      if (filters.transactions.mode) {
        debits = debits.filter(t => t.mode === filters.transactions.mode);
      }
      const paginated = getPaginatedData(debits, pagination.transactions.page, pagination.transactions.pageSize);

      renderContent = () => (
        <>
          <div className="modal-filters">
            <input
              type="text"
              placeholder="Filter by phone..."
              value={filters.transactions.phoneNumber}
              onChange={(e) => handleFilterChange('transactions', 'phoneNumber', e.target.value)}
              className="filter-input"
            />
            <select
              value={filters.transactions.mode}
              onChange={(e) => handleFilterChange('transactions', 'mode', e.target.value)}
              className="filter-select"
            >
              <option value="">All Modes</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="NetBanking">NetBanking</option>
              <option value="Wallet">Wallet</option>
            </select>
            <button className="btn-reset" onClick={() => handleResetFilters('transactions')}>Reset</button>
          </div>

          <div className="modal-table-wrapper">
            <table className="modal-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Fee</th>
                  <th>Net</th>
                  <th>Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginated.items.map(txn => (
                  <tr key={txn.transactionId}>
                    <td>{txn.transactionId}</td>
                    <td>{txn.phoneNumber}</td>
                    <td>{new Date(txn.dateTime).toLocaleDateString()}</td>
                    <td>₹{txn.amount.toLocaleString('en-IN')}</td>
                    <td>₹{txn.fee.toLocaleString('en-IN')}</td>
                    <td>₹{txn.netAmount.toLocaleString('en-IN')}</td>
                    <td>{txn.mode}</td>
                    <td><span className={`status-badge ${txn.status.toLowerCase()}`}>{txn.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="modal-pagination">
            <button disabled={paginated.page === 1} onClick={() => setPagination(prev => ({ ...prev, transactions: { ...prev.transactions, page: prev.transactions.page - 1 } }))}>
              ← Previous
            </button>
            <span>Page {paginated.page} of {paginated.totalPages}</span>
            <button disabled={paginated.page === paginated.totalPages} onClick={() => setPagination(prev => ({ ...prev, transactions: { ...prev.transactions, page: prev.transactions.page + 1 } }))}>
              Next →
            </button>
          </div>
        </>
      );
    } else if (activeModal === 'failed') {
      title = 'Failed Transactions';
      let failed = mockTransactions.filter(t => t.status === 'Failed');
      if (filters.transactions.phoneNumber) {
        failed = failed.filter(t => t.userPhone.includes(filters.transactions.phoneNumber));
      }
      if (filters.transactions.mode) {
        failed = failed.filter(t => t.mode === filters.transactions.mode);
      }
      const paginated = getPaginatedData(failed, pagination.transactions.page, pagination.transactions.pageSize);

      renderContent = () => (
        <>
          <div className="modal-filters">
            <input
              type="text"
              placeholder="Filter by phone..."
              value={filters.transactions.phoneNumber}
              onChange={(e) => handleFilterChange('transactions', 'phoneNumber', e.target.value)}
              className="filter-input"
            />
            <select
              value={filters.transactions.mode}
              onChange={(e) => handleFilterChange('transactions', 'mode', e.target.value)}
              className="filter-select"
            >
              <option value="">All Modes</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="NetBanking">NetBanking</option>
              <option value="Wallet">Wallet</option>
            </select>
            <button className="btn-reset" onClick={() => handleResetFilters('transactions')}>Reset</button>
          </div>

          <div className="modal-table-wrapper">
            <table className="modal-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {paginated.items.map(txn => (
                  <tr key={txn.id}>
                    <td>{txn.id}</td>
                    <td>{txn.userPhone}</td>
                    <td>{new Date(txn.dateTime).toLocaleDateString()}</td>
                    <td>₹{txn.amount.toLocaleString('en-IN')}</td>
                    <td>{txn.mode}</td>
                    <td>{txn.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="modal-pagination">
            <button disabled={paginated.page === 1} onClick={() => setPagination(prev => ({ ...prev, transactions: { ...prev.transactions, page: prev.transactions.page - 1 } }))}>
              ← Previous
            </button>
            <span>Page {paginated.page} of {paginated.totalPages}</span>
            <button disabled={paginated.page === paginated.totalPages} onClick={() => setPagination(prev => ({ ...prev, transactions: { ...prev.transactions, page: prev.transactions.page + 1 } }))}>
              Next →
            </button>
          </div>
        </>
      );
    }

    return (
      <div className="modal-overlay" onClick={() => setActiveModal(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="modal-close" onClick={() => setActiveModal(null)}>✕</button>
          </div>
          {renderContent()}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard-v2">
      {/* Header */}
      <div className="dashboard-header-section">
        <div className="header-content">
          <h1>📊 Admin Dashboard</h1>
          <p>Platform Overview & User Management</p>
        </div>
      </div>

      {/* KPI Cards */}
      {renderKPICards()}

      {/* Approval Section */}
      {renderApprovalSection()}

      {/* Analytics Footer */}
      {analytics && (
        <div className="analytics-footer">
          <div className="stat-item">
            <label>Success Rate</label>
            <div className="stat-value">{analytics.successRate}%</div>
          </div>
          <div className="stat-item">
            <label>Failure Rate</label>
            <div className="stat-value">{analytics.failureRate}%</div>
          </div>
          <div className="stat-item">
            <label>Total Users</label>
            <div className="stat-value">{analytics.totalActiveUsers + analytics.totalNewlyRegistered}</div>
          </div>
          <div className="stat-item">
            <label>Total Transactions</label>
            <div className="stat-value">{analytics.totalTransactions}</div>
          </div>
        </div>
      )}

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

// Helper functions
const getRoleColor = (role: string): string => {
  const colors: { [key: string]: string } = {
    admin: '#7C3AED',
    merchant: '#3B82F6',
    accountant: '#F59E0B',
    viewer: '#8B5CF6'
  };
  return colors[role] || '#6B7280';
};

const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    'Active': '#10B981',
    'Registered': '#3B82F6',
    'Pending': '#F59E0B',
    'Rejected': '#EF4444',
    'On Hold': '#8B5CF6'
  };
  return colors[status] || '#6B7280';
};

export default AdminDashboardV2;

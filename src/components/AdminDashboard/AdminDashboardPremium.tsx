/**
 * Premium Enterprise Admin Dashboard
 * Advanced analytics, user management, and platform monitoring
 */

import { FC, useState, useMemo } from 'react';
import { mockUsers, getActiveUsers, getNewlyRegisteredUsers } from '../../mock/data/users';
import { mockTransactions } from '../../mock/data/transactions';
import '../../styles/admin-dashboard-premium.css';

interface Filter {
  search: string;
  role: string;
  status: string;
}

const AdminDashboardPremium: FC = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<'credits' | 'debits' | 'failed' | null>(null);
  const [filter, setFilter] = useState<Filter>({ search: '', role: '', status: '' });
  const [transactionFilters, setTransactionFilters] = useState({ phone: '', date: '', transactionId: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 15;
  const usersPerPage = 10;

  // Analytics Calculations
  const activeUsers = getActiveUsers();
  const pendingUsers = getNewlyRegisteredUsers();
  const totalCredits = mockTransactions
    .filter(t => t.transactionType === 'Credit' && t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = mockTransactions
    .filter(t => t.transactionType === 'Debit' && t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);
  const failedTransactions = mockTransactions.filter(t => t.status === 'Failed').length;
  const walletBalance = totalCredits - totalDebits;
  const successRate = ((mockTransactions.filter(t => t.status === 'Success').length / mockTransactions.length) * 100).toFixed(2);

  // User Filtering
  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(filter.search.toLowerCase()) ||
        user.phone.includes(filter.search) ||
        user.email.toLowerCase().includes(filter.search.toLowerCase());
      const matchesRole = !filter.role || user.role === filter.role;
      const matchesStatus = !filter.status || user.status === filter.status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [filter]);

  // Get transactions for modal
  const getFilteredTransactions = (type: 'credits' | 'debits' | 'failed') => {
    let transactions = mockTransactions;

    // Filter by type
    if (type === 'credits') {
      transactions = transactions.filter(t => t.transactionType === 'Credit' && t.status === 'Success');
    } else if (type === 'debits') {
      transactions = transactions.filter(t => t.transactionType === 'Debit' && t.status === 'Success');
    } else if (type === 'failed') {
      transactions = transactions.filter(t => t.status === 'Failed');
    }

    // Filter by phone
    if (transactionFilters.phone) {
      transactions = transactions.filter(t => t.userPhone?.includes(transactionFilters.phone));
    }

    // Filter by date
    if (transactionFilters.date) {
      transactions = transactions.filter(t => t.dateTime?.startsWith(transactionFilters.date));
    }

    // Filter by transaction ID
    if (transactionFilters.transactionId) {
      transactions = transactions.filter(t => t.id?.includes(transactionFilters.transactionId));
    }

    return transactions;
  };

  const modalTransactions = useMemo(() => {
    if (!activeModal) return [];
    return getFilteredTransactions(activeModal);
  }, [activeModal, transactionFilters]);

  const paginatedModalTransactions = modalTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Approval Handlers
  const handleApproveUser = (userId: string, action: 'approve' | 'reject' | 'hold') => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.status = action === 'approve' ? 'Active' : action === 'reject' ? 'Rejected' : 'On Hold';
      setSelectedUser(null);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get role badge color
  const getRoleBadgeClass = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: 'badge-admin',
      merchant: 'badge-merchant',
      viewer: 'badge-viewer',
      accountant: 'badge-accountant',
    };
    return roleColors[role] || 'badge-default';
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    const statusColors: Record<string, string> = {
      'Active': 'status-active',
      'Pending': 'status-pending',
      'Registered': 'status-registered',
      'Rejected': 'status-rejected',
      'On Hold': 'status-hold',
      'Disabled': 'status-disabled',
    };
    return statusColors[status] || 'status-default';
  };

  return (
    <div className="admin-premium-container">
      {/* Header */}
      <div className="premium-header">
        <div className="header-gradient"></div>
        <div className="header-content">
          <div className="header-title">
            <h1>Admin Dashboard</h1>
            <p>Platform Analytics & User Management</p>
          </div>
          <div className="header-stats">
            <div className="stat-chip">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{mockUsers.length}</span>
            </div>
            <div className="stat-chip">
              <span className="stat-label">Active</span>
              <span className="stat-value active">{activeUsers.length}</span>
            </div>
            <div className="stat-chip">
              <span className="stat-label">Pending</span>
              <span className="stat-value pending">{pendingUsers.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-section">
        <div className="kpi-grid">
          {/* Total Users Card */}
          <div className="kpi-card kpi-users">
            <div className="kpi-icon">👥</div>
            <div className="kpi-content">
              <h3>Active Users</h3>
              <div className="kpi-value">{activeUsers.length}</div>
              <p className="kpi-subtitle">Out of {mockUsers.length} total users</p>
              <div className="kpi-progress">
                <div className="progress-bar" style={{width: `${(activeUsers.length / mockUsers.length) * 100}%`}}></div>
              </div>
            </div>
          </div>

          {/* Total Credits Card */}
          <div className="kpi-card kpi-credits" onClick={() => { setActiveModal('credits'); setCurrentPage(1); setTransactionFilters({ phone: '', date: '', transactionId: '' }); }} style={{ cursor: 'pointer' }}>
            <div className="kpi-icon">📈</div>
            <div className="kpi-content">
              <h3>Total Credits</h3>
              <div className="kpi-value">{formatCurrency(totalCredits)}</div>
              <p className="kpi-subtitle">Incoming transactions</p>
              <div className="kpi-meta">From {mockTransactions.filter(t => t.transactionType === 'Credit').length} transactions</div>
            </div>
          </div>

          {/* Total Debits Card */}
          <div className="kpi-card kpi-debits" onClick={() => { setActiveModal('debits'); setCurrentPage(1); setTransactionFilters({ phone: '', date: '', transactionId: '' }); }} style={{ cursor: 'pointer' }}>
            <div className="kpi-icon">📉</div>
            <div className="kpi-content">
              <h3>Total Debits</h3>
              <div className="kpi-value">{formatCurrency(totalDebits)}</div>
              <p className="kpi-subtitle">Outgoing transactions</p>
              <div className="kpi-meta">From {mockTransactions.filter(t => t.transactionType === 'Debit').length} transactions</div>
            </div>
          </div>

          {/* Success Rate Card */}
          <div className="kpi-card kpi-success">
            <div className="kpi-icon">✅</div>
            <div className="kpi-content">
              <h3>Success Rate</h3>
              <div className="kpi-value">{successRate}%</div>
              <p className="kpi-subtitle">Transaction success rate</p>
              <div className="kpi-meta">Failed: {failedTransactions}</div>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="kpi-card kpi-balance">
            <div className="kpi-icon">💰</div>
            <div className="kpi-content">
              <h3>Net Balance</h3>
              <div className="kpi-value">{formatCurrency(walletBalance)}</div>
              <p className="kpi-subtitle">Platform wallet balance</p>
            </div>
          </div>

          {/* Failed Transactions Card */}
          <div className="kpi-card kpi-failed" onClick={() => { setActiveModal('failed'); setCurrentPage(1); setTransactionFilters({ phone: '', date: '', transactionId: '' }); }} style={{ cursor: 'pointer' }}>
            <div className="kpi-icon">⚠️</div>
            <div className="kpi-content">
              <h3>Failed Transactions</h3>
              <div className="kpi-value">{failedTransactions}</div>
              <p className="kpi-subtitle">Require investigation</p>
              <div className="kpi-meta">{((failedTransactions / mockTransactions.length) * 100).toFixed(1)}% failure rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Section */}
      <div className="approval-section">
        <div className="section-header">
          <h2>User Approvals</h2>
          <span className="badge-count">{pendingUsers.length} Pending</span>
        </div>
        {pendingUsers.length > 0 ? (
          <div className="approval-grid">
            {pendingUsers.map(user => (
              <div key={user.id} className="approval-card">
                <div className="approval-header">
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(user.status)}`}>
                    {user.status}
                  </span>
                </div>
                <div className="user-details">
                  <div className="detail-row">
                    <span>Phone:</span>
                    <strong>{user.phone}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Role:</span>
                    <strong>{user.role}</strong>
                  </div>
                  <div className="detail-row">
                    <span>KYC Status:</span>
                    <span className={`kyc-badge ${user.kycStatus}`}>{user.kycStatus}</span>
                  </div>
                </div>
                <div className="approval-actions">
                  <button 
                    className="btn btn-approve" 
                    onClick={() => handleApproveUser(user.id, 'approve')}
                  >
                    ✓ Approve
                  </button>
                  <button 
                    className="btn btn-hold" 
                    onClick={() => handleApproveUser(user.id, 'hold')}
                  >
                    ⏸ Hold
                  </button>
                  <button 
                    className="btn btn-reject" 
                    onClick={() => handleApproveUser(user.id, 'reject')}
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No pending approvals. All users are approved!</p>
          </div>
        )}
      </div>

      {/* User Management Section */}
      <div className="user-management-section">
        <div className="section-header">
          <h2>User Management</h2>
          <span className="result-count">Showing {paginatedUsers.length} of {filteredUsers.length} users</span>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <div className="filter-group">
            <input
              type="text"
              placeholder="🔍 Search by name, phone, or email..."
              value={filter.search}
              onChange={(e) => {
                setFilter({ ...filter, search: e.target.value });
                setCurrentPage(1);
              }}
              className="filter-input search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={filter.role}
              onChange={(e) => {
                setFilter({ ...filter, role: e.target.value });
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="merchant">Merchant</option>
              <option value="accountant">Accountant</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="filter-group">
            <select
              value={filter.status}
              onChange={(e) => {
                setFilter({ ...filter, status: e.target.value });
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Registered">Registered</option>
              <option value="Rejected">Rejected</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name & Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>KYC</th>
                <th>Joined</th>
                <th>Last Login</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
                <tr key={user.id} className="table-row">
                  <td className="cell-id">
                    <code>{user.id}</code>
                  </td>
                  <td className="cell-user">
                    <div className="user-cell">
                      <div className="avatar">{user.name.charAt(0)}</div>
                      <div>
                        <strong>{user.name}</strong>
                        <p>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="cell-phone">{user.phone}</td>
                  <td className="cell-role">
                    <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="cell-status">
                    <span className={`status-badge ${getStatusBadgeClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="cell-kyc">
                    <span className={`kyc-badge ${user.kycStatus}`}>
                      {user.kycStatus}
                    </span>
                  </td>
                  <td className="cell-date">{user.createdAt}</td>
                  <td className="cell-date">{user.lastLogin}</td>
                  <td className="cell-action">
                    <button 
                      className="btn-view"
                      onClick={() => setSelectedUser(user)}
                      title="View details"
                    >
                      📋
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ← Previous
          </button>
          <div className="pagination-info">
            Page {currentPage} of {totalPages} ({filteredUsers.length} users)
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button 
                className="btn-close"
                onClick={() => setSelectedUser(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>User ID</label>
                    <div>{selectedUser.id}</div>
                  </div>
                  <div className="detail-item">
                    <label>Name</label>
                    <div>{selectedUser.name}</div>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <div>{selectedUser.email}</div>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <div>{selectedUser.phone}</div>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h3>Account Status</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Role</label>
                    <div>
                      <span className={`role-badge ${getRoleBadgeClass(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <div>
                      <span className={`status-badge ${getStatusBadgeClass(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>KYC Status</label>
                    <div>
                      <span className={`kyc-badge ${selectedUser.kycStatus}`}>
                        {selectedUser.kycStatus}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Wallet Linked</label>
                    <div>{selectedUser.walletLinked ? '✓ Yes' : '✕ No'}</div>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h3>Timeline</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Joined</label>
                    <div>{selectedUser.createdAt}</div>
                  </div>
                  <div className="detail-item">
                    <label>Last Login</label>
                    <div>{selectedUser.lastLogin}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {activeModal === 'credits' && '📈 Credit Transactions'}
                {activeModal === 'debits' && '📉 Debit Transactions'}
                {activeModal === 'failed' && '⚠️ Failed Transactions'}
              </h2>
              <button className="btn-close" onClick={() => setActiveModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              {/* Filters */}
              <div className="filter-bar" style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Filter by phone number"
                  value={transactionFilters.phone}
                  onChange={(e) => { setTransactionFilters({ ...transactionFilters, phone: e.target.value }); setCurrentPage(1); }}
                  className="filter-input"
                />
                <input
                  type="date"
                  placeholder="Filter by date"
                  value={transactionFilters.date}
                  onChange={(e) => { setTransactionFilters({ ...transactionFilters, date: e.target.value }); setCurrentPage(1); }}
                  className="filter-input"
                />
                <input
                  type="text"
                  placeholder="Filter by transaction ID"
                  value={transactionFilters.transactionId}
                  onChange={(e) => { setTransactionFilters({ ...transactionFilters, transactionId: e.target.value }); setCurrentPage(1); }}
                  className="filter-input"
                />
              </div>

              {/* Transactions Table */}
              {modalTransactions.length > 0 ? (
                <>
                  <div className="users-table-container">
                    <table className="users-table">
                      <thead>
                        <tr>
                          <th>Transaction ID</th>
                          <th>Phone</th>
                          <th>Amount</th>
                          <th>Mode</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedModalTransactions.map((tx: any) => (
                          <tr key={tx.id}>
                            <td><code style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>{tx.id}</code></td>
                            <td>{tx.phone}</td>
                            <td>{formatCurrency(tx.amount)}</td>
                            <td>{tx.mode}</td>
                            <td>{tx.dateTime}</td>
                            <td>
                              <span className={`status-badge ${tx.status === 'Success' ? 'status-active' : 'status-rejected'}`}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="pagination">
                    <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>← Previous</button>
                    <span className="pagination-info">Page {currentPage} of {Math.ceil(modalTransactions.length / transactionsPerPage)}</span>
                    <button className="pagination-btn" disabled={currentPage >= Math.ceil(modalTransactions.length / transactionsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Next →</button>
                  </div>
                </>
              ) : (
                <div className="empty-state"><p>No transactions found</p></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPremium;

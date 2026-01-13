/**
 * Admin Dashboard Component - Premium Edition
 * Platform Admin View - All Users Data
 * Shows platform-level aggregates with date and user filters
 */

import React, { useState, useEffect } from 'react';
import { mockService } from '../services/mockService';
import { Transaction } from '../types';

const AdminDashboard: React.FC = () => {
  const [showFailuresModal, setShowFailuresModal] = useState(false);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [paginatedUsers, setPaginatedUsers] = useState<any[]>([]);
  const [paginatedFailures, setPaginatedFailures] = useState<Transaction[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Pagination states
  const [usersPage, setUsersPage] = useState(1);
  const [usersPageSize] = useState(10); // Show 10 users per page
  const [totalUsers, setTotalUsers] = useState(0);
  const [failuresPage, setFailuresPage] = useState(1);
  const [failuresPageSize] = useState(15); // Show 15 failed transactions per page
  const [totalFailures, setTotalFailures] = useState(0);

  // Filter states
  const [failuresDateFilter, setFailuresDateFilter] = useState<{ from: string; to: string }>({
    from: '2026-01-01',
    to: '2026-01-31'
  });
  const [failuresUserFilter, setFailuresUserFilter] = useState<string>('all');

  // Fetch all platform data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);

        // Get all transactions and users for metrics
        const transactionsData = await mockService.getAllTransactions();
        const allUsersData = await mockService.getAllUsers();

        setAllTransactions(transactionsData || []);
        setAllUsers(allUsersData || []);
        setTotalUsers(allUsersData?.length || 0);
        
        // Get paginated users for first page
        const paginatedUsersData = await (mockService as any).getPaginatedUsers(1, usersPageSize);
        setPaginatedUsers(paginatedUsersData.data || []);

        // Get paginated failed transactions
        const paginatedFailuresData = await (mockService as any).getPaginatedFailedTransactions(1, failuresPageSize);
        setPaginatedFailures(paginatedFailuresData.data || []);
        setTotalFailures(paginatedFailuresData.total || 0);

        setDataError(null);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        setDataError('Failed to load dashboard data');
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [usersPageSize, failuresPageSize]);

  // Handle users page change (lazy loading)
  useEffect(() => {
    const fetchPaginatedUsers = async () => {
      try {
        const data = await (mockService as any).getPaginatedUsers(usersPage, usersPageSize);
        setPaginatedUsers(data.data || []);
      } catch (error) {
        console.error('Error fetching paginated users:', error);
      }
    };
    fetchPaginatedUsers();
  }, [usersPage, usersPageSize]);

  // Handle failures page change (lazy loading)
  useEffect(() => {
    const fetchPaginatedFailures = async () => {
      try {
        const data = await (mockService as any).getPaginatedFailedTransactions(
          failuresPage,
          failuresPageSize,
          failuresUserFilter !== 'all' ? failuresUserFilter : undefined,
          failuresDateFilter.from,
          failuresDateFilter.to
        );
        setPaginatedFailures(data.data || []);
        setTotalFailures(data.total || 0);
      } catch (error) {
        console.error('Error fetching paginated failures:', error);
      }
    };
    fetchPaginatedFailures();
  }, [failuresPage, failuresPageSize, failuresUserFilter, failuresDateFilter]);

  if (dataError) {
    return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#EF4444' }}>Error: {dataError}</div>;
  }

  if (dataLoading) {
    return <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading dashboard...</div>;
  }

  // Calculate platform-level metrics
  const totalTransactions = allTransactions.length;
  const successTransactions = allTransactions.filter(t => t.status === 'success' || t.status === 'Success').length;
  const failedTransactions = allTransactions.filter(t => t.status === 'failed' || t.status === 'Failed').length;

  // Total wallet balance from all users
  const totalWalletBalance = allUsers.reduce((sum, user) => sum + (user.wallet?.balance || 0), 0);

  // Total credits (sum of all users' credited amounts)
  const totalCredits = allUsers.reduce((sum, user) => sum + (user.wallet?.credited || 0), 0);

  // Total debits (sum of all users' debited amounts)
  const totalDebits = allUsers.reduce((sum, user) => sum + (user.wallet?.debited || 0), 0);

  // Calculate success and failure rates
  const successRate = totalTransactions > 0 ? ((successTransactions / totalTransactions) * 100).toFixed(1) : '0';
  const failureRate = totalTransactions > 0 ? ((failedTransactions / totalTransactions) * 100).toFixed(1) : '0';

  return (
    <div className="dashboard fade-slide-in-up" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: 'var(--space-6)' }}>
      {/* Dashboard Header */}
      <div className="dashboard-section" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="dashboard-header" style={{
          background: 'linear-gradient(135deg, #2D1B69 0%, #1e1236 100%)',
          color: 'white',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div>
            <h1 className="dashboard-title" style={{ color: 'white', margin: '0 0 var(--space-2) 0' }}>👥 Admin Dashboard</h1>
            <p className="dashboard-subtitle" style={{ color: '#e0e7ff', margin: 0 }}>Platform Overview - All Users Data</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginTop: 'var(--space-4)' }}>
            <div style={{
              backgroundColor: 'rgba(209, 250, 229, 0.15)',
              padding: 'var(--space-3) var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              backdropFilter: 'blur(10px)',
            }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: '#a7f3d0', fontWeight: '600', textTransform: 'uppercase' }}>✅ Success Rate</p>
              <h3 style={{ margin: 'var(--space-1) 0 0 0', fontSize: 'var(--font-size-3xl)', color: '#6ee7b7', fontWeight: 'bold' }}>{successRate}%</h3>
            </div>
            <div style={{
              backgroundColor: 'rgba(254, 226, 226, 0.15)',
              padding: 'var(--space-3) var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              backdropFilter: 'blur(10px)',
            }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: '#fca5a5', fontWeight: '600', textTransform: 'uppercase' }}>❌ Failure Rate</p>
              <h3 style={{ margin: 'var(--space-1) 0 0 0', fontSize: 'var(--font-size-3xl)', color: '#f87171', fontWeight: 'bold' }}>{failureRate}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards - Platform Aggregates */}
      <div className="dashboard-section" style={{ marginBottom: 'var(--space-8)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-4)', marginTop: 0 }}>💰 Platform Metrics</h3>
        <div className="grid-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-5)', gridAutoRows: '1fr' }}>

          {/* Total Transactions */}
          <div
            className="card-entrance hover-lift"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              color: 'white',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '80px', opacity: 0.1 }}>📊</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', opacity: 0.9, textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)', fontWeight: '600' }}>
                📋 Total Transactions
              </p>
              <h3 style={{ margin: 'var(--space-3) 0 0 0', fontSize: 'var(--font-size-4xl)', fontWeight: 'bold', lineHeight: 'var(--line-height-tight)' }}>
                {totalTransactions}
              </h3>
              <p style={{ margin: 'var(--space-2) 0 0 0', fontSize: 'var(--font-size-xs)', opacity: 0.85 }}>
                All users combined
              </p>
            </div>
          </div>

          {/* Total Credits */}
          <div
            className="card-entrance hover-lift"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '80px', opacity: 0.1 }}>📈</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', opacity: 0.9, textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)', fontWeight: '600' }}>
                💳 Total Credits
              </p>
              <h3 style={{ margin: 'var(--space-3) 0 0 0', fontSize: 'var(--font-size-4xl)', fontWeight: 'bold', lineHeight: 'var(--line-height-tight)' }}>
                ₹{(totalCredits / 100000).toFixed(2)}L
              </h3>
              <p style={{ margin: 'var(--space-2) 0 0 0', fontSize: 'var(--font-size-xs)', opacity: 0.85 }}>
                Inbound funds
              </p>
            </div>
          </div>

          {/* Total Debits */}
          <div
            className="card-entrance hover-lift"
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: 'white',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '80px', opacity: 0.1 }}>📉</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', opacity: 0.9, textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)', fontWeight: '600' }}>
                💸 Total Debits
              </p>
              <h3 style={{ margin: 'var(--space-3) 0 0 0', fontSize: 'var(--font-size-4xl)', fontWeight: 'bold', lineHeight: 'var(--line-height-tight)' }}>
                ₹{(totalDebits / 100000).toFixed(2)}L
              </h3>
              <p style={{ margin: 'var(--space-2) 0 0 0', fontSize: 'var(--font-size-xs)', opacity: 0.85 }}>
                Outbound funds
              </p>
            </div>
          </div>

          {/* Total Wallet Balance */}
          <div
            className="card-entrance hover-lift"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
              color: 'white',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '80px', opacity: 0.1 }}>💰</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', opacity: 0.9, textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)', fontWeight: '600' }}>
                💎 Total Wallet Balance
              </p>
              <h3 style={{ margin: 'var(--space-3) 0 0 0', fontSize: 'var(--font-size-4xl)', fontWeight: 'bold', lineHeight: 'var(--line-height-tight)' }}>
                ₹{(totalWalletBalance / 100000).toFixed(2)}L
              </h3>
              <p style={{ margin: 'var(--space-2) 0 0 0', fontSize: 'var(--font-size-xs)', opacity: 0.85 }}>
                All users' balance
              </p>
            </div>
          </div>

          {/* Failed Transactions Count */}
          <div
            className="card-entrance hover-lift"
            onClick={() => setShowFailuresModal(true)}
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: 'white',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '80px', opacity: 0.1 }}>❌</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', opacity: 0.9, textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)', fontWeight: '600' }}>
                ⚠️ Failed Transactions
              </p>
              <h3 style={{ margin: 'var(--space-3) 0 0 0', fontSize: 'var(--font-size-4xl)', fontWeight: 'bold', lineHeight: 'var(--line-height-tight)' }}>
                {failedTransactions}
              </h3>
              <p style={{ margin: 'var(--space-2) 0 0 0', fontSize: 'var(--font-size-xs)', opacity: 0.85 }}>
                Click to view details
              </p>
            </div>
          </div>

          {/* Users Count */}
          <div
            className="card-entrance hover-lift"
            style={{
              background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
              color: 'white',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '80px', opacity: 0.1 }}>👥</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', opacity: 0.9, textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)', fontWeight: '600' }}>
                👥 Total Users
              </p>
              <h3 style={{ margin: 'var(--space-3) 0 0 0', fontSize: 'var(--font-size-4xl)', fontWeight: 'bold', lineHeight: 'var(--line-height-tight)' }}>
                {allUsers.length}
              </h3>
              <p style={{ margin: 'var(--space-2) 0 0 0', fontSize: 'var(--font-size-xs)', opacity: 0.85 }}>
                Active users
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* All Users Summary with Lazy Loading */}
      <div className="dashboard-section" style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', color: '#1f2937', margin: 0 }}>📊 All Users Summary (Page {usersPage})</h3>
          <span style={{ fontSize: 'var(--font-size-sm)', color: '#6b7280' }}>Total: {totalUsers} users</span>
        </div>
        <div className="premium-card" style={{ boxShadow: 'var(--shadow-md)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr style={{ backgroundColor: '#2D1B69', color: 'white' }}>
                  <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: '600' }}>User ID</th>
                  <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: '600' }}>Role</th>
                  <th style={{ padding: 'var(--space-4)', textAlign: 'right', fontWeight: '600' }}>Wallet Balance</th>
                  <th style={{ padding: 'var(--space-4)', textAlign: 'right', fontWeight: '600' }}>Total Credits</th>
                  <th style={{ padding: 'var(--space-4)', textAlign: 'right', fontWeight: '600' }}>Total Debits</th>
                  <th style={{ padding: 'var(--space-4)', textAlign: 'center', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, idx) => (
                  <tr key={user.user?.userId || idx} style={{
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                  }}>
                    <td style={{ padding: 'var(--space-4)', fontWeight: '500' }}>{user.user?.userId || 'N/A'}</td>
                    <td style={{ padding: 'var(--space-4)', color: '#6b7280' }}>{user.user?.name || 'N/A'}</td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <span className="status-badge info" style={{
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        padding: 'var(--space-1) var(--space-3)',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: '600',
                      }}>{user.user?.role}</span>
                    </td>
                    <td style={{ padding: 'var(--space-4)', textAlign: 'right', fontWeight: '600', color: '#1f2937' }}>₹{(user.wallet?.balance || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: 'var(--space-4)', textAlign: 'right', color: '#059669', fontWeight: '600' }}>₹{(user.wallet?.credited || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: 'var(--space-4)', textAlign: 'right', color: '#dc2626', fontWeight: '600' }}>₹{(user.wallet?.debited || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: 'var(--space-1) var(--space-3)',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: '600',
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                      }}>✓ Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                onClick={() => setUsersPage(Math.max(1, usersPage - 1))}
                disabled={usersPage === 1}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  border: '1px solid #d1d5db',
                  background: usersPage === 1 ? '#f3f4f6' : 'white',
                  color: usersPage === 1 ? '#9ca3af' : '#374151',
                  borderRadius: 'var(--radius-lg)',
                  cursor: usersPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                }}
              >
                ← Previous
              </button>
              <button
                onClick={() => setUsersPage(usersPage + 1)}
                disabled={usersPage * usersPageSize >= totalUsers}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  border: '1px solid #d1d5db',
                  background: usersPage * usersPageSize >= totalUsers ? '#f3f4f6' : 'white',
                  color: usersPage * usersPageSize >= totalUsers ? '#9ca3af' : '#374151',
                  borderRadius: 'var(--radius-lg)',
                  cursor: usersPage * usersPageSize >= totalUsers ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                }}
              >
                Next →
              </button>
            </div>
            <span style={{ fontSize: 'var(--font-size-sm)', color: '#6b7280' }}>
              Page {usersPage} of {Math.ceil(totalUsers / usersPageSize)} ({paginatedUsers.length} items)
            </span>
          </div>
        </div>
      </div>

      {/* Failed Transactions Modal with Filters */}
      {showFailuresModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '270px',
            zIndex: 1000,
          }}
          onClick={() => setShowFailuresModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-2xl)',
              maxWidth: '1000px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: 'var(--space-8)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ margin: 0, color: '#EF4444' }}>❌ Failed Transactions - All Users</h2>
              <button
                onClick={() => setShowFailuresModal(false)}
                style={{
                  background: '#ef4444',
                  border: 'none',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Filters: Date Range and User Selection */}
            <div style={{ backgroundColor: '#f9fafb', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
              <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--font-size-md)', fontWeight: '600', color: '#1f2937' }}>🔍 Filters</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
                {/* Date Range Filter */}
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500', fontSize: 'var(--font-size-sm)', color: '#374151' }}>📅 From Date</label>
                  <input
                    type="date"
                    value={failuresDateFilter.from}
                    onChange={(e) => setFailuresDateFilter({ ...failuresDateFilter, from: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2) var(--space-3)',
                      border: '1px solid #d1d5db',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: 'var(--font-size-sm)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500', fontSize: 'var(--font-size-sm)', color: '#374151' }}>📅 To Date</label>
                  <input
                    type="date"
                    value={failuresDateFilter.to}
                    onChange={(e) => setFailuresDateFilter({ ...failuresDateFilter, to: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2) var(--space-3)',
                      border: '1px solid #d1d5db',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: 'var(--font-size-sm)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* User Filter */}
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500', fontSize: 'var(--font-size-sm)', color: '#374151' }}>👤 Select User</label>
                  <select
                    value={failuresUserFilter}
                    onChange={(e) => setFailuresUserFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2) var(--space-3)',
                      border: '1px solid #d1d5db',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: 'var(--font-size-sm)',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="all">All Users</option>
                    {allUsers.map((user: any) => (
                      <option key={user.user?.userId} value={user.user?.userId}>{user.user?.userId}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Failed Transactions Table with Pagination */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: '#6b7280' }}>Page {failuresPage} of {Math.ceil(totalFailures / failuresPageSize)} (Total: {totalFailures} failed transactions)</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontWeight: '600', color: '#374151' }}>User ID</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Transaction ID</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Type</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Amount</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Mode</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFailures.map((txn, index) => (
                    <tr key={txn.id} style={{
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                    }}>
                      <td style={{ padding: 'var(--space-3)', fontWeight: '500', color: '#1f2937' }}>{txn.userId}</td>
                      <td style={{ padding: 'var(--space-3)', fontWeight: '500', color: '#1f2937' }}>{txn.id}</td>
                      <td style={{ padding: 'var(--space-3)', color: '#6b7280' }}>{txn.type}</td>
                      <td style={{ padding: 'var(--space-3)', color: '#1f2937', fontWeight: '500' }}>₹{txn.amount.toLocaleString()}</td>
                      <td style={{ padding: 'var(--space-3)', color: '#6b7280' }}>{txn.mode}</td>
                      <td style={{ padding: 'var(--space-3)', color: '#6b7280', fontSize: 'var(--font-size-sm)' }}>{new Date(txn.date).toLocaleDateString()}</td>
                      <td style={{ padding: 'var(--space-3)', color: '#ef4444', fontSize: 'var(--font-size-sm)' }}>{txn.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginatedFailures.length === 0 && (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: '#9ca3af' }}>
                <p>No failed transactions found for the selected filters</p>
              </div>
            )}

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  onClick={() => setFailuresPage(Math.max(1, failuresPage - 1))}
                  disabled={failuresPage === 1}
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    border: '1px solid #d1d5db',
                    background: failuresPage === 1 ? '#f3f4f6' : 'white',
                    color: failuresPage === 1 ? '#9ca3af' : '#374151',
                    borderRadius: 'var(--radius-lg)',
                    cursor: failuresPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                  }}
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setFailuresPage(failuresPage + 1)}
                  disabled={failuresPage * failuresPageSize >= totalFailures}
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    border: '1px solid #d1d5db',
                    background: failuresPage * failuresPageSize >= totalFailures ? '#f3f4f6' : 'white',
                    color: failuresPage * failuresPageSize >= totalFailures ? '#9ca3af' : '#374151',
                    borderRadius: 'var(--radius-lg)',
                    cursor: failuresPage * failuresPageSize >= totalFailures ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                  }}
                >
                  Next →
                </button>
              </div>
              <span style={{ fontSize: 'var(--font-size-sm)', color: '#6b7280' }}>
                Page {failuresPage} of {Math.ceil(totalFailures / failuresPageSize)} ({paginatedFailures.length} items)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

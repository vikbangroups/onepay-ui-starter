/**
 * Viewer Dashboard Component
 * Read-only analytics dashboard for viewers
 * Integrated with Mock APIs
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logger } from '../lib/logger';
import { mockService } from '../services/mockService';
import { Wallet, Notification as NotificationType, Transaction } from '../types';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: string;
  read: boolean;
}

const ViewerDashboard: React.FC = () => {
  const [isWalletVisible, setIsWalletVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const { user, loading } = useAuth();

  // Fetch dashboard data from mock API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        
        // Set user context in mockService
        if (user) {
          mockService.setCurrentUser(String(user.id) || 'viewer-001', user.role || 'viewer');
        }
        
        // Fetch all data in parallel - pass userId and role for viewer-specific data
        const [walletData, notificationsData, transactionsData] = await Promise.all([
          mockService.getWallet(String(user?.id), user?.role),
          mockService.getNotifications(String(user?.id), user?.role),
          mockService.getTransactions(String(user?.id), user?.role),
        ]);

        setWallet(walletData);
        setTransactions(transactionsData || []);
        
        const transformedNotifications: Notification[] = (notificationsData || []).map((notif: NotificationType, index: number) => ({
          id: index + 1,
          message: notif.message || 'New notification',
          type: (notif.type as 'success' | 'warning' | 'error' | 'info') || 'info',
          timestamp: notif.timestamp || 'Just now',
          read: index > 0,
        }));
        
        setNotifications(transformedNotifications);
        setDataError(null);
      } catch (error) {
        console.error('Error fetching viewer dashboard data:', error);
        setDataError('Failed to load dashboard data');
      } finally {
        setDataLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleNotificationClick = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  if (loading) {
    return <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading user data...</div>;
  }

  if (!user) {
    return <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>User data not found</div>;
  }

  if (dataError) {
    return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#EF4444' }}>Error: {dataError}</div>;
  }

  if (dataLoading || !wallet) {
    return <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading dashboard...</div>;
  }

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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 'var(--space-4)',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 className="dashboard-title" style={{ color: 'white', margin: '0 0 var(--space-2) 0' }}>👁️ Analytics Dashboard</h1>
            <p className="dashboard-subtitle" style={{ color: '#e0e7ff', margin: 0 }}>View-only platform analytics & reports</p>
          </div>
          <div style={{ position: 'relative', flexShrink: 0, width: 'auto' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '28px',
                cursor: 'pointer',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-3)',
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              title="View notifications"
            >
              🔔
              {notifications.filter(n => !n.read).length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'bold',
                  border: '2px solid #2D1B69',
                }}>
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                ...(window.innerWidth <= 768 ? { left: '16px', right: '16px', width: 'calc(100vw - 32px)' } : { right: 0, width: 'auto' }),
                backgroundColor: 'white',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-2xl)',
                zIndex: 1000,
                minWidth: '320px',
                maxWidth: '400px',
                maxHeight: '400px',
                overflow: 'hidden',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-4)',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #e5e7eb',
                }}>
                  <h3 style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 'bold', color: '#1f2937' }}>Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '20px',
                      cursor: 'pointer',
                      color: '#6b7280',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#1f2937'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        style={{
                          padding: 'var(--space-4)',
                          borderBottom: '1px solid #e5e7eb',
                          backgroundColor: notif.read ? '#ffffff' : '#f0f9ff',
                          transition: 'background-color 0.2s ease',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleNotificationClick(notif.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = notif.read ? '#f9fafb' : '#e0f2fe';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = notif.read ? '#ffffff' : '#f0f9ff';
                        }}
                      >
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                          <div style={{
                            fontSize: '20px',
                            marginTop: '2px',
                          }}>
                            {notif.type === 'success' && '✓'}
                            {notif.type === 'warning' && '⚠'}
                            {notif.type === 'error' && '✕'}
                            {notif.type === 'info' && 'ℹ'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', fontWeight: '500', color: '#1f2937' }}>{notif.message}</p>
                            <p style={{ margin: 'var(--space-1) 0 0 0', fontSize: 'var(--font-size-xs)', color: '#9ca3af' }}>{notif.timestamp}</p>
                          </div>
                          {!notif.read && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#3B82F6',
                              marginTop: '6px',
                            }}></div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      padding: 'var(--space-6)',
                      textAlign: 'center',
                      color: '#9ca3af',
                      fontSize: 'var(--font-size-sm)',
                    }}>
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards - Analytics View */}
      <div className="dashboard-section" style={{ marginBottom: 'var(--space-8)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-4)', marginTop: 0 }}>📊 Platform Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)', gridAutoRows: '1fr' }}>
          {/* Wallet Balance */}
          <div 
            className="card-entrance hover-lift" 
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              color: 'white',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onClick={() => logger.info('Total transactions clicked')}
          >
            <div style={{ position: 'absolute', top: '-15px', right: '-15px', fontSize: '60px', opacity: 0.1 }}>💰</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', opacity: 0.9, textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)', fontWeight: '600' }}>💳 Wallet Balance</p>
                <button
                  onClick={() => setIsWalletVisible(!isWalletVisible)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'; }}
                  title={isWalletVisible ? 'Hide balance' : 'Show balance'}
                >
                  {isWalletVisible ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <h3 style={{ margin: 'var(--space-3) 0 0 0', fontSize: 'var(--font-size-4xl)', fontWeight: 'bold' }}>{isWalletVisible ? `₹${wallet?.balance?.toLocaleString() || '0'}` : '●●●●●'}</h3>
              <p style={{ margin: 'var(--space-2) 0 0 0', fontSize: 'var(--font-size-xs)', opacity: 0.85 }}>Available funds</p>
            </div>
          </div>

          {/* Credited Amount */}
          <div 
            className="card-entrance hover-lift" 
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onClick={() => logger.info('Total users clicked')}
          >
            <div style={{ position: 'absolute', top: '-15px', right: '-15px', fontSize: '60px', opacity: 0.1 }}>➕</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', opacity: 0.9, textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)', fontWeight: '600' }}>➕ Credited Amount</p>
              <h3 style={{ margin: 'var(--space-3) 0 0 0', fontSize: 'var(--font-size-4xl)', fontWeight: 'bold' }}>₹{wallet?.credited?.toLocaleString() || '0'}</h3>
              <p style={{ margin: 'var(--space-2) 0 0 0', fontSize: 'var(--font-size-xs)', opacity: 0.85 }}>This month</p>
            </div>
          </div>

          {/* Debited Amount */}
          <div 
            className="card-entrance hover-lift" 
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: 'white',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onClick={() => logger.info('Platform revenue clicked')}
          >
            <div style={{ position: 'absolute', top: '-15px', right: '-15px', fontSize: '60px', opacity: 0.1 }}>➖</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', opacity: 0.9, textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)', fontWeight: '600' }}>➖ Debited Amount</p>
              <h3 style={{ margin: 'var(--space-3) 0 0 0', fontSize: 'var(--font-size-4xl)', fontWeight: 'bold' }}>₹{wallet?.debited?.toLocaleString() || '0'}</h3>
              <p style={{ margin: 'var(--space-2) 0 0 0', fontSize: 'var(--font-size-xs)', opacity: 0.85 }}>This month</p>
            </div>
          </div>

          {/* Failed Transactions */}
          <div 
            className="card-entrance hover-lift" 
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: 'white',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
          >
            <div style={{ position: 'absolute', top: '-15px', right: '-15px', fontSize: '60px', opacity: 0.1 }}>❌</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', opacity: 0.9, textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)', fontWeight: '600' }}>❌ Failed Transactions</p>
              <h3 style={{ margin: 'var(--space-3) 0 0 0', fontSize: 'var(--font-size-4xl)', fontWeight: 'bold' }}>{transactions?.filter(t => t.status === 'failed').length || '0'}</h3>
              <p style={{ margin: 'var(--space-2) 0 0 0', fontSize: 'var(--font-size-xs)', opacity: 0.85 }}>Needs attention</p>
            </div>
          </div>


        </div>
      </div>

      {/* Available Reports */}
      <div className="dashboard-section" style={{ marginBottom: 'var(--space-8)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-4)', marginTop: 0 }}>📑 Available Reports</h3>
        <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-5)' }}>
          <div className="premium-card flex items-center justify-center" style={{ minHeight: '140px', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', opacity: 0.8, cursor: 'not-allowed' }}><div><div style={{ fontSize: '40px', marginBottom: 'var(--space-2)' }}>📊</div><p style={{ margin: 0, fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>Reports</p><p style={{ margin: 'var(--space-1) 0 0 0', fontSize: 'var(--font-size-xs)', opacity: 0.8 }}>Read-only</p></div></div>
          <div className="premium-card flex items-center justify-center" style={{ minHeight: '140px', textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', opacity: 0.8, cursor: 'not-allowed' }}><div><div style={{ fontSize: '40px', marginBottom: 'var(--space-2)' }}>📈</div><p style={{ margin: 0, fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>Analytics</p><p style={{ margin: 'var(--space-1) 0 0 0', fontSize: 'var(--font-size-xs)', opacity: 0.8 }}>Read-only</p></div></div>
          <div className="premium-card flex items-center justify-center" style={{ minHeight: '140px', textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', opacity: 0.8, cursor: 'not-allowed' }}><div><div style={{ fontSize: '40px', marginBottom: 'var(--space-2)' }}>📋</div><p style={{ margin: 0, fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>Transactions</p><p style={{ margin: 'var(--space-1) 0 0 0', fontSize: 'var(--font-size-xs)', opacity: 0.8 }}>Read-only</p></div></div>
        </div>
      </div>

      {/* Status Info */}
      <div className="premium-card" style={{ backgroundColor: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderLeft: '4px solid var(--color-info)', boxShadow: 'var(--shadow-md)' }}>
        <h3 className="section-title" style={{ color: 'var(--color-info)', marginTop: 0, marginBottom: 'var(--space-4)' }}>ℹ️ Viewer Access Info</h3>
        <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)' }}>
          <div style={{ padding: 'var(--space-4)', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 'var(--radius-lg)' }}><p className="body-small" style={{ margin: 0, marginBottom: 'var(--space-2)', color: '#0369a1', fontWeight: '600', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase' }}>📋 Access Level</p><p style={{ margin: 0, fontSize: 'var(--font-size-md)', fontWeight: '500', color: '#1f2937' }}>Read-Only</p></div>
          <div style={{ padding: 'var(--space-4)', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 'var(--radius-lg)' }}><p className="body-small" style={{ margin: 0, marginBottom: 'var(--space-2)', color: '#0369a1', fontWeight: '600', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase' }}>📊 Available Reports</p><p style={{ margin: 0, fontSize: 'var(--font-size-md)', fontWeight: '500', color: '#1f2937' }}>23</p></div>
          <div style={{ padding: 'var(--space-4)', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 'var(--radius-lg)' }}><p className="body-small" style={{ margin: 0, marginBottom: 'var(--space-2)', color: '#0369a1', fontWeight: '600', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase' }}>✅ Account Status</p><p style={{ margin: 0, fontSize: 'var(--font-size-md)', fontWeight: '500', color: '#1f2937', textTransform: 'capitalize' }}>{user.status}</p></div>
        </div>
      </div>
    </div>
  );
};

export default ViewerDashboard;

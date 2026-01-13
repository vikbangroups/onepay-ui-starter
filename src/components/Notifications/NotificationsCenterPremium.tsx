/**
 * Notifications Center Premium Component
 * Enterprise-grade notification management & alerts
 * Features: Real-time alerts, message history, filtering, marking as read
 */

import React, { useState, useMemo } from 'react';
import '../../styles/notifications-center-premium.css';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'transaction';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NotificationsCenterPremium: React.FC = () => {
  // ==================== STATE ====================
  const [notifications] = useState<Notification[]>([
    {
      id: 'N001',
      type: 'success',
      title: 'Payment Received',
      message: 'You have received ₹5,000 from Rahul Kumar via UPI',
      timestamp: new Date(Date.now() - 5 * 60000).toLocaleString(),
      read: false,
      icon: '✓',
    },
    {
      id: 'N002',
      type: 'transaction',
      title: 'Transfer Initiated',
      message: 'Your transfer of ₹25,000 to Priya Sharma has been initiated',
      timestamp: new Date(Date.now() - 15 * 60000).toLocaleString(),
      read: false,
      icon: '→',
    },
    {
      id: 'N003',
      type: 'warning',
      title: 'Verification Required',
      message: 'Your bank account verification is pending. Complete it within 24 hours.',
      timestamp: new Date(Date.now() - 1 * 3600000).toLocaleString(),
      read: false,
      icon: '⚠',
    },
    {
      id: 'N004',
      type: 'info',
      title: 'Security Update',
      message: 'Your account security settings have been updated successfully',
      timestamp: new Date(Date.now() - 2 * 3600000).toLocaleString(),
      read: true,
      icon: 'ℹ',
    },
    {
      id: 'N005',
      type: 'error',
      title: 'Transaction Failed',
      message: 'Your payment of ₹2,000 failed due to insufficient balance. Retry now.',
      timestamp: new Date(Date.now() - 3 * 3600000).toLocaleString(),
      read: true,
      icon: '✕',
    },
    {
      id: 'N006',
      type: 'success',
      title: 'Withdrawal Completed',
      message: 'Your withdrawal of ₹10,000 has been successfully processed',
      timestamp: new Date(Date.now() - 5 * 3600000).toLocaleString(),
      read: true,
      icon: '✓',
    },
    {
      id: 'N007',
      type: 'transaction',
      title: 'Beneficiary Added',
      message: 'New beneficiary "Ajay Patel" has been added successfully',
      timestamp: new Date(Date.now() - 1 * 86400000).toLocaleString(),
      read: true,
      icon: '→',
    },
    {
      id: 'N008',
      type: 'info',
      title: 'Feature Update',
      message: 'New "Scheduled Payments" feature is now available in your account',
      timestamp: new Date(Date.now() - 2 * 86400000).toLocaleString(),
      read: true,
      icon: 'ℹ',
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'success' | 'error' | 'warning' | 'info'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [markAsRead, setMarkAsRead] = useState<Record<string, boolean>>({});

  // ==================== FILTERING ====================

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    if (selectedFilter === 'unread') {
      result = result.filter(n => !n.read && !markAsRead[n.id]);
    } else if (selectedFilter !== 'all') {
      result = result.filter(n => n.type === selectedFilter);
    }

    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notifications, selectedFilter, markAsRead]);

  // ==================== HANDLERS ====================

  const handleMarkAsRead = (id: string) => {
    setMarkAsRead(prev => ({ ...prev, [id]: true }));
  };

  const handleMarkAllAsRead = () => {
    const newMarkAsRead: Record<string, boolean> = {};
    filteredNotifications.forEach(n => {
      newMarkAsRead[n.id] = true;
    });
    setMarkAsRead(newMarkAsRead);
  };

  const handleDelete = (id: string) => {
    setMarkAsRead(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  // ==================== RENDER HELPERS ====================

  const getNotificationBadgeClass = (type: string) => {
    const config: Record<string, string> = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info',
      transaction: 'transaction',
    };
    return config[type] || 'info';
  };

  const unreadCount = filteredNotifications.filter(n => !n.read && !markAsRead[n.id]).length;

  // ==================== RENDER ====================

  return (
    <div className="notifications-center-container">
      <div className="notifications-header">
        <h1>🔔 Notifications Center</h1>
        <p>Stay updated with all your alerts and messages</p>
      </div>

      {/* ==================== TOOLBAR ==================== */}
      <div className="notifications-toolbar">
        <div className="toolbar-left">
          <button className="btn-mark-all" onClick={handleMarkAllAsRead}>
            ✓ Mark All as Read
          </button>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} Unread</span>
          )}
        </div>

        <div className="toolbar-middle">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="success">Success</option>
            <option value="error">Errors</option>
            <option value="warning">Warnings</option>
            <option value="info">Information</option>
          </select>
        </div>

        <div className="toolbar-right">
          <button
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            ≡ List
          </button>
          <button
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            ⊞ Grid
          </button>
        </div>
      </div>

      {/* ==================== NOTIFICATIONS LIST ==================== */}
      <div className={`notifications-container notifications-${viewMode}`}>
        {filteredNotifications.length > 0 ? (
          viewMode === 'list' ? (
            <div className="notifications-list">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${getNotificationBadgeClass(notification.type)} ${
                    !notification.read && !markAsRead[notification.id] ? 'unread' : 'read'
                  }`}
                >
                  <div className="notification-badge">
                    <span className={`badge-icon ${getNotificationBadgeClass(notification.type)}`}>
                      {notification.icon}
                    </span>
                  </div>

                  <div className="notification-content">
                    <div className="notification-header">
                      <h3>{notification.title}</h3>
                      <span className="notification-time">
                        {new Date(notification.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-date">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="notification-actions">
                    {!notification.read && !markAsRead[notification.id] && (
                      <button
                        className="btn-mark-read"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        ●
                      </button>
                    )}
                    {notification.action && (
                      <button className="btn-action" onClick={notification.action.onClick}>
                        {notification.action.label}
                      </button>
                    )}
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(notification.id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="notifications-grid">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-card ${getNotificationBadgeClass(notification.type)} ${
                    !notification.read && !markAsRead[notification.id] ? 'unread' : 'read'
                  }`}
                >
                  <div className="card-badge">
                    <span className={`badge-icon ${getNotificationBadgeClass(notification.type)}`}>
                      {notification.icon}
                    </span>
                  </div>
                  <div className="card-content">
                    <h3>{notification.title}</h3>
                    <p>{notification.message}</p>
                    <span className="card-time">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="card-footer">
                    {!notification.read && !markAsRead[notification.id] && (
                      <button
                        className="btn-mark-read-card"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      className="btn-delete-card"
                      onClick={() => handleDelete(notification.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="no-notifications">
            <p>📭 No notifications to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsCenterPremium;

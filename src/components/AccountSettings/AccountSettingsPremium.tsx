/**
 * Account Settings Premium Component
 * Complete user profile management
 * Tabs: Basic Info, Security, KYC Documents, Preferences
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/account-settings.css';

interface NotificationPrefs {
  transactionAlerts: boolean;
  emailUpdates: boolean;
  smsNotifications: boolean;
  promotionalEmails: boolean;
  pushNotifications: boolean;
}

interface KYCDocument {
  type: 'aadhar' | 'pan' | 'bank' | 'passport';
  status: 'pending' | 'verified' | 'rejected';
  uploadedDate: string;
  expiryDate?: string;
}

interface LoginHistory {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'failed';
}

const AccountSettingsPremium: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'basic' | 'security' | 'kyc' | 'preferences'>('basic');
  
  // ==================== BASIC INFO STATE ====================
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || 'John',
    lastName: user?.name?.split(' ')[1] || 'Doe',
    email: user?.email || 'john@example.com',
    phone: user?.phone || '+919876543210',
    dob: '1990-01-15',
    address: '123 Main Street, Mumbai, MH 400001',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    profilePicture: null as File | null,
  });
  const [profilePreview, setProfilePreview] = useState('https://via.placeholder.com/150');

  // ==================== SECURITY STATE ====================
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showTwoFASetup, setShowTwoFASetup] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  
  const [loginHistory] = useState<LoginHistory[]>([
    { id: '1', device: 'Chrome on MacOS', location: 'Mumbai, India', ipAddress: '192.168.1.1', timestamp: '2026-01-08 10:30 AM', status: 'success' },
    { id: '2', device: 'Safari on iPhone', location: 'Pune, India', ipAddress: '192.168.1.2', timestamp: '2026-01-07 08:15 PM', status: 'success' },
    { id: '3', device: 'Chrome on Windows', location: 'Delhi, India', ipAddress: '192.168.1.3', timestamp: '2026-01-06 05:45 PM', status: 'failed' },
  ]);

  // ==================== KYC STATE ====================
  const [kycDocuments] = useState<KYCDocument[]>([
    { type: 'aadhar', status: 'verified', uploadedDate: '2025-12-15', expiryDate: '2035-12-15' },
    { type: 'pan', status: 'verified', uploadedDate: '2025-12-20' },
    { type: 'bank', status: 'pending', uploadedDate: '2026-01-05' },
  ]);
  const [showKYCUpload, setShowKYCUpload] = useState<string | null>(null);

  // ==================== PREFERENCES STATE ====================
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    transactionAlerts: true,
    emailUpdates: true,
    smsNotifications: true,
    promotionalEmails: false,
    pushNotifications: true,
  });
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState('light');

  // ==================== UI STATE ====================
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ==================== HANDLERS ====================

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, profilePicture: file });
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBasicInfoChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSaveBasicInfo = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditMode(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleSetup2FA = async () => {
    if (twoFACode.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter a valid 6-digit code' });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFAEnabled(true);
      setMessage({ type: 'success', text: '2FA enabled successfully!' });
      setShowTwoFASetup(false);
      setTwoFACode('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to enable 2FA' });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Preferences saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save preferences' });
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER METHODS ====================

  const renderBasicInfo = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Basic Information</h2>
        <button
          className="btn-edit"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? '✕ Cancel' : '✎ Edit'}
        </button>
      </div>

      <div className="profile-picture-section">
        <div className="profile-picture-container">
          <img src={profilePreview} alt="Profile" className="profile-picture" />
          {editMode && (
            <label className="upload-overlay">
              <input type="file" accept="image/*" onChange={handleProfilePictureChange} hidden />
              📸 Change Photo
            </label>
          )}
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>First Name *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleBasicInfoChange('firstName', e.target.value)}
            disabled={!editMode}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleBasicInfoChange('lastName', e.target.value)}
            disabled={!editMode}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleBasicInfoChange('email', e.target.value)}
            disabled={!editMode}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleBasicInfoChange('phone', e.target.value)}
            disabled={!editMode}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => handleBasicInfoChange('dob', e.target.value)}
            disabled={!editMode}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleBasicInfoChange('city', e.target.value)}
            disabled={!editMode}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleBasicInfoChange('state', e.target.value)}
            disabled={!editMode}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>PIN Code</label>
          <input
            type="text"
            value={formData.pincode}
            onChange={(e) => handleBasicInfoChange('pincode', e.target.value)}
            disabled={!editMode}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group full-width">
        <label>Address</label>
        <textarea
          value={formData.address}
          onChange={(e) => handleBasicInfoChange('address', e.target.value)}
          disabled={!editMode}
          className="form-input"
          rows={3}
        />
      </div>

      {editMode && (
        <button className="btn-primary" onClick={handleSaveBasicInfo} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      )}
    </div>
  );

  const renderSecurity = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Security Settings</h2>
      </div>

      {/* Change Password */}
      <div className="security-card">
        <div className="card-header">
          <h3>🔐 Change Password</h3>
          {!showPasswordForm && (
            <button className="btn-change" onClick={() => setShowPasswordForm(true)}>
              Change
            </button>
          )}
        </div>

        {showPasswordForm && (
          <div className="card-body">
            <div className="form-group">
              <label>Current Password *</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>New Password *</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="form-input"
                placeholder="Min 8 characters"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="button-group">
              <button className="btn-secondary" onClick={() => setShowPasswordForm(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleChangePassword} disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="security-card">
        <div className="card-header">
          <h3>🔑 Two-Factor Authentication</h3>
          <div className={`status-badge ${twoFAEnabled ? 'enabled' : 'disabled'}`}>
            {twoFAEnabled ? '✓ Enabled' : '○ Disabled'}
          </div>
        </div>

        {!twoFAEnabled && !showTwoFASetup && (
          <div className="card-body">
            <p>Add an extra layer of security to your account</p>
            <button className="btn-primary" onClick={() => setShowTwoFASetup(true)}>
              Enable 2FA
            </button>
          </div>
        )}

        {showTwoFASetup && (
          <div className="card-body">
            <div className="qr-section">
              <p>1. Scan this QR code with your authenticator app:</p>
              <div className="qr-placeholder">📱 QR Code</div>
            </div>
            <div className="form-group">
              <label>Enter 6-digit code from your app *</label>
              <input
                type="text"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                placeholder="000000"
                className="form-input otp-input"
              />
            </div>
            <div className="button-group">
              <button className="btn-secondary" onClick={() => setShowTwoFASetup(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSetup2FA} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Login History */}
      <div className="security-card">
        <div className="card-header">
          <h3>📋 Login History</h3>
        </div>
        <div className="login-history">
          {loginHistory.map(login => (
            <div key={login.id} className="login-entry">
              <div className="login-info">
                <p className="device">{login.device}</p>
                <p className="location">{login.location} • {login.ipAddress}</p>
                <p className="timestamp">{login.timestamp}</p>
              </div>
              <div className={`login-status ${login.status}`}>
                {login.status === 'success' ? '✓ Success' : '✕ Failed'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderKYC = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>KYC Documents</h2>
        <p className="subtitle">Complete your KYC for higher transaction limits</p>
      </div>

      <div className="kyc-status-card">
        <h3>Verification Status: <span className={`status-pill ${kycDocuments.every(d => d.status === 'verified') ? 'verified' : 'pending'}`}>
          {kycDocuments.every(d => d.status === 'verified') ? '✓ Fully Verified' : '○ Partially Verified'}
        </span></h3>
      </div>

      <div className="kyc-documents-grid">
        {[
          { type: 'aadhar', label: 'Aadhar Card', icon: '🆔' },
          { type: 'pan', label: 'PAN Card', icon: '📄' },
          { type: 'bank', label: 'Bank Details', icon: '🏦' }
        ].map(doc => {
          const uploadedDoc = kycDocuments.find(d => d.type === doc.type as any);
          return (
            <div key={doc.type} className="kyc-card">
              <div className="kyc-icon">{doc.icon}</div>
              <h4>{doc.label}</h4>
              
              {uploadedDoc ? (
                <div className="kyc-status">
                  <p className={`status ${uploadedDoc.status}`}>
                    {uploadedDoc.status === 'verified' ? '✓ Verified' : '○ Pending Review'}
                  </p>
                  <p className="date">Uploaded: {uploadedDoc.uploadedDate}</p>
                </div>
              ) : (
                <button
                  className="btn-upload"
                  onClick={() => setShowKYCUpload(doc.type)}
                >
                  Upload
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showKYCUpload && (
        <div className="upload-section">
          <h3>Upload {showKYCUpload === 'aadhar' ? 'Aadhar' : showKYCUpload === 'pan' ? 'PAN' : 'Bank'} Document</h3>
          <div className="upload-area">
            <input type="file" accept="image/*,.pdf" hidden id="kyc-file" />
            <label htmlFor="kyc-file" className="upload-label">
              📁 Click to upload or drag & drop
            </label>
          </div>
          <div className="button-group">
            <button className="btn-secondary" onClick={() => setShowKYCUpload(null)}>
              Cancel
            </button>
            <button className="btn-primary">
              Upload Document
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderPreferences = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Preferences</h2>
      </div>

      {/* Notification Preferences */}
      <div className="preference-card">
        <h3>🔔 Notification Preferences</h3>
        <div className="toggle-list">
          {Object.entries(notificationPrefs).map(([key, value]) => (
            <div key={key} className="toggle-item">
              <div>
                <p className="toggle-label">
                  {key === 'transactionAlerts' && 'Transaction Alerts'}
                  {key === 'emailUpdates' && 'Email Updates'}
                  {key === 'smsNotifications' && 'SMS Notifications'}
                  {key === 'promotionalEmails' && 'Promotional Emails'}
                  {key === 'pushNotifications' && 'Push Notifications'}
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotificationPrefs({
                    ...notificationPrefs,
                    [key]: e.target.checked
                  })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Language & Theme */}
      <div className="preference-card">
        <h3>⚙️ Display Settings</h3>
        <div className="settings-grid">
          <div className="form-group">
            <label>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="form-input">
              <option>English</option>
              <option>Hindi</option>
              <option>Marathi</option>
              <option>Tamil</option>
              <option>Telugu</option>
            </select>
          </div>
          <div className="form-group">
            <label>Theme</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="form-input">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="preference-card">
        <h3>🔒 Privacy & Data</h3>
        <div className="privacy-options">
          <button className="btn-secondary">📥 Download My Data</button>
          <button className="btn-secondary">📋 View Privacy Policy</button>
          <button className="btn-secondary">📝 Terms of Service</button>
        </div>
      </div>

      <button className="btn-primary" onClick={handleSavePreferences} disabled={loading}>
        {loading ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );

  return (
    <div className="account-settings-container">
      <div className="settings-header">
        <h1>⚙️ Account Settings</h1>
        <p>Manage your profile, security, and preferences</p>
      </div>

      {message && (
        <div className={`message-banner ${message.type}`}>
          <span>{message.type === 'success' ? '✓' : '✕'} {message.text}</span>
          <button onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      <div className="settings-tabs">
        <button
          className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          👤 Basic Info
        </button>
        <button
          className={`tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          🔐 Security
        </button>
        <button
          className={`tab ${activeTab === 'kyc' ? 'active' : ''}`}
          onClick={() => setActiveTab('kyc')}
        >
          📋 KYC
        </button>
        <button
          className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          🔔 Preferences
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'basic' && renderBasicInfo()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'kyc' && renderKYC()}
        {activeTab === 'preferences' && renderPreferences()}
      </div>
    </div>
  );
};

export default AccountSettingsPremium;

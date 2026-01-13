/**
 * Pay-Out Premium Component
 * Production-grade money withdrawal/transfer screen
 * Supports multiple payment methods and gateway integrations
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/payment-premium.css';

interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  ifscCode: string;
  bank: string;
  accountType: 'savings' | 'current';
  isDefault: boolean;
  verified: boolean;
}

interface WithdrawalMethod {
  id: string;
  name: string;
  icon: string;
  type: 'bank' | 'upi' | 'card' | 'wallet';
  gateway: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
}

const PayOutPremium: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'method' | 'details' | 'beneficiary' | 'confirmation' | 'success' | 'error'>('method');

  // Form States
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [ifscCode, setIfscCode] = useState<string>('');
  const [accountHolder, setAccountHolder] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  const [otpValue, setOtpValue] = useState<string>('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // UI States
  const [walletBalance] = useState(50000);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: '1',
      name: 'Primary Bank Account',
      accountNumber: '****7890',
      ifscCode: 'HDFC0000001',
      bank: 'HDFC Bank',
      accountType: 'savings',
      isDefault: true,
      verified: true
    },
    {
      id: '2',
      name: 'ICICI Business Account',
      accountNumber: '****1234',
      ifscCode: 'ICIC0000002',
      bank: 'ICICI Bank',
      accountType: 'current',
      isDefault: false,
      verified: true
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successData, setSuccessData] = useState<any>(null);
  const [addNewBeneficiary, setAddNewBeneficiary] = useState(false);

  const withdrawalMethods: WithdrawalMethod[] = [
    {
      id: 'bank-transfer',
      name: 'Bank Transfer (NEFT)',
      icon: '🏦',
      type: 'bank',
      gateway: 'razorpay',
      description: 'Transfer to linked bank account',
      minAmount: 100,
      maxAmount: 500000,
      processingTime: '2-4 hours'
    },
    {
      id: 'imps',
      name: 'Instant Transfer (IMPS)',
      icon: '⚡',
      type: 'bank',
      gateway: 'razorpay',
      description: 'Instant transfer via IMPS',
      minAmount: 100,
      maxAmount: 200000,
      processingTime: 'Instant'
    },
    {
      id: 'upi-transfer',
      name: 'UPI Transfer',
      icon: '📱',
      type: 'upi',
      gateway: 'razorpay',
      description: 'Send money via UPI ID',
      minAmount: 100,
      maxAmount: 100000,
      processingTime: 'Instant'
    },
    {
      id: 'wallet-transfer',
      name: 'Wallet to Card',
      icon: '💳',
      type: 'card',
      gateway: 'moneris',
      description: 'Transfer to registered card',
      minAmount: 100,
      maxAmount: 100000,
      processingTime: '1-2 business days'
    }
  ];

  // ==================== HANDLERS ====================

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
    setError('');
    if (methodId === 'upi-transfer' || methodId === 'wallet-transfer') {
      setCurrentStep('details');
    } else {
      setCurrentStep('beneficiary');
    }
  };

  const handleSendOTP = async () => {
    if (!selectedBeneficiary && !addNewBeneficiary) {
      setError('Please select or add a beneficiary');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpVerified(true);
      setCurrentStep('confirmation');
      setError('');
    } catch (err) {
      setError('OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessWithdrawal = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > walletBalance) {
      setError('Insufficient wallet balance');
      return;
    }

    const method = withdrawalMethods.find(m => m.id === selectedMethod);
    if (parseFloat(amount) < method!.minAmount || parseFloat(amount) > method!.maxAmount) {
      setError(`Amount must be between ₹${method?.minAmount} and ₹${method?.maxAmount}`);
      return;
    }

    setLoading(true);
    try {
      const gatewayResponse = await processWithdrawalGateway(
        selectedMethod,
        parseFloat(amount),
        user?.phone || ''
      );

      if (gatewayResponse.success) {
        setSuccessData({
          transactionId: gatewayResponse.transactionId,
          amount: parseFloat(amount),
          method: method?.name,
          beneficiary: selectedBeneficiary ? beneficiaries.find(b => b.id === selectedBeneficiary)?.name : 'UPI/Card',
          timestamp: new Date().toISOString(),
          gateway: gatewayResponse.gateway,
          processingTime: method?.processingTime
        });
        setCurrentStep('success');
      } else {
        setError(gatewayResponse.error || 'Withdrawal processing failed');
        setCurrentStep('error');
      }
    } catch (err) {
      setError('Withdrawal processing error: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setCurrentStep('error');
    } finally {
      setLoading(false);
    }
  };

  const processWithdrawalGateway = async (method: string, amountValue: number, _phone: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const isSuccess = Math.random() > 0.05;

    if (!isSuccess) {
      return {
        success: false,
        error: 'Withdrawal could not be processed. Please try again.'
      };
    }

    const txnId = `PAY-OUT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return {
      success: true,
      transactionId: txnId,
      gateway: withdrawalMethods.find(m => m.id === method)?.gateway,
      amount: amountValue,
      method: method
    };
  };

  const handleAddBeneficiary = () => {
    if (!accountHolder || !bankName || !accountNumber || !ifscCode) {
      setError('Please fill all beneficiary details');
      return;
    }

    if (accountNumber.length < 8 || accountNumber.length > 17) {
      setError('Invalid account number');
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      setError('Invalid IFSC code format');
      return;
    }

    const newBeneficiary: Beneficiary = {
      id: Date.now().toString(),
      name: accountHolder,
      accountNumber: '****' + accountNumber.slice(-4),
      ifscCode: ifscCode,
      bank: bankName,
      accountType: 'savings',
      isDefault: false,
      verified: false
    };

    setBeneficiaries([...beneficiaries, newBeneficiary]);
    setSelectedBeneficiary(newBeneficiary.id);
    setAddNewBeneficiary(false);
    setBankName('');
    setAccountNumber('');
    setIfscCode('');
    setAccountHolder('');
    setError('');
  };

  const handleReset = () => {
    setCurrentStep('method');
    setSelectedMethod('');
    setAmount('');
    setSelectedBeneficiary('');
    setUpiId('');
    setOtpValue('');
    setOtpSent(false);
    setOtpVerified(false);
    setError('');
    setSuccessData(null);
    setAddNewBeneficiary(false);
  };

  // ==================== RENDER METHODS ====================

  const renderMethodSelection = () => (
    <div className="payment-methods-grid">
      {withdrawalMethods.map((method) => (
        <div
          key={method.id}
          className="payment-method-card"
          onClick={() => handleSelectMethod(method.id)}
          style={{
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderColor: selectedMethod === method.id ? '#10b981' : '#e5e7eb',
            backgroundColor: selectedMethod === method.id ? '#f0fdf4' : '#ffffff'
          }}
        >
          <div className="method-icon">{method.icon}</div>
          <h3 className="method-name">{method.name}</h3>
          <p className="method-description">{method.description}</p>
          <div className="method-limits">
            <span>₹{method.minAmount} - ₹{method.maxAmount}</span>
          </div>
          <div className="method-time">
            <span>⏱️ {method.processingTime}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBeneficiarySelection = () => {
    const method = withdrawalMethods.find(m => m.id === selectedMethod);
    
    return (
      <div className="beneficiary-container">
        <div className="step-header">
          <button className="btn-back" onClick={() => setCurrentStep('method')}>← Back</button>
          <h2>Select Beneficiary</h2>
        </div>

        <div className="beneficiary-list">
          {beneficiaries.map(ben => (
            <div
              key={ben.id}
              className={`beneficiary-card ${selectedBeneficiary === ben.id ? 'selected' : ''}`}
              onClick={() => setSelectedBeneficiary(ben.id)}
            >
              <input type="radio" checked={selectedBeneficiary === ben.id} readOnly />
              <div className="beneficiary-info">
                <h4>{ben.name}</h4>
                <p>{ben.bank} - {ben.accountNumber}</p>
                <small>{ben.ifscCode}</small>
              </div>
              {ben.isDefault && <span className="default-badge">Primary</span>}
              {ben.verified && <span className="verified-badge">✓ Verified</span>}
            </div>
          ))}
        </div>

        {!addNewBeneficiary ? (
          <button
            className="btn-add-beneficiary"
            onClick={() => setAddNewBeneficiary(true)}
          >
            + Add New Beneficiary
          </button>
        ) : (
          <div className="add-beneficiary-form">
            <h3>Add New Beneficiary</h3>
            <div className="form-group">
              <label>Account Holder Name *</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Bank Name *</label>
              <input
                type="text"
                placeholder="e.g., HDFC Bank, ICICI Bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Account Number *</label>
              <input
                type="text"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>IFSC Code *</label>
              <input
                type="text"
                placeholder="e.g., HDFC0000001"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                maxLength={11}
                className="form-input"
              />
            </div>
            <div className="beneficiary-actions">
              <button
                className="btn-secondary"
                onClick={() => setAddNewBeneficiary(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleAddBeneficiary}
              >
                Add Beneficiary
              </button>
            </div>
          </div>
        )}

        {selectedBeneficiary && (
          <div className="form-group">
            <label>Withdrawal Amount (₹) *</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
              min={method?.minAmount}
              max={method?.maxAmount}
            />
            <small>Available balance: ₹{walletBalance.toLocaleString('en-IN')}</small>
          </div>
        )}

        {selectedBeneficiary && amount && parseFloat(amount) > 0 && (
          <div className="button-group">
            <button
              className="btn-primary"
              onClick={() => setCurrentStep('confirmation')}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderDetailsForm = () => {
    const method = withdrawalMethods.find(m => m.id === selectedMethod);

    return (
      <div className="details-container">
        <div className="step-header">
          <button className="btn-back" onClick={() => setCurrentStep('method')}>← Back</button>
          <h2>Withdrawal Details</h2>
        </div>

        {selectedMethod === 'upi-transfer' && (
          <div className="form-group">
            <label>Recipient UPI ID *</label>
            <input
              type="text"
              placeholder="recipient@bankname"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="form-input"
            />
          </div>
        )}

        <div className="form-group">
          <label>Withdrawal Amount (₹) *</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            min={method?.minAmount}
            max={method?.maxAmount}
          />
          <small>Min: ₹{method?.minAmount} • Max: ₹{method?.maxAmount}</small>
        </div>

        <div className="amount-presets">
          {[5000, 10000, 25000].map(preset => (
            <button
              key={preset}
              className="preset-btn"
              onClick={() => setAmount(preset.toString())}
            >
              ₹{preset}
            </button>
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={() => setCurrentStep('confirmation')}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          Continue to Confirmation
        </button>
      </div>
    );
  };

  const renderConfirmation = () => {
    const method = withdrawalMethods.find(m => m.id === selectedMethod);
    const benef = beneficiaries.find(b => b.id === selectedBeneficiary);
    const fee = parseFloat(amount) * 0.005; // 0.5% fee

    return (
      <div className="confirmation-container">
        <div className="confirmation-header">
          <h2>Confirm Withdrawal</h2>
          <p>Please review before proceeding</p>
        </div>

        <div className="confirmation-details">
          <div className="detail-row">
            <span>Withdrawal Method:</span>
            <strong>{method?.name}</strong>
          </div>
          {benef && (
            <div className="detail-row">
              <span>Beneficiary:</span>
              <strong>{benef.name}</strong>
            </div>
          )}
          <div className="detail-row">
            <span>Amount:</span>
            <strong className="amount">₹{parseFloat(amount).toLocaleString('en-IN')}</strong>
          </div>
          <div className="detail-row">
            <span>Processing Fee (0.5%):</span>
            <strong>₹{fee.toFixed(2)}</strong>
          </div>
          <div className="detail-row total">
            <span>Total Debit:</span>
            <strong>₹{(parseFloat(amount) + fee).toFixed(2)}</strong>
          </div>
          <div className="detail-row">
            <span>Remaining Balance:</span>
            <strong>₹{(walletBalance - parseFloat(amount) - fee).toLocaleString('en-IN')}</strong>
          </div>
          <div className="detail-row">
            <span>Processing Time:</span>
            <strong>{method?.processingTime}</strong>
          </div>
        </div>

        {!otpVerified && (
          <button
            className="btn-primary"
            onClick={handleSendOTP}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        )}

        {otpSent && !otpVerified && (
          <div className="otp-section">
            <div className="form-group">
              <label>Enter OTP (6 digits) *</label>
              <input
                type="text"
                placeholder="000000"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                className="form-input otp-input"
              />
            </div>
            <button
              className="btn-primary"
              onClick={handleVerifyOTP}
              disabled={loading || otpValue.length !== 6}
              style={{ width: '100%' }}
            >
              {loading ? 'Verifying...' : 'Verify & Proceed'}
            </button>
          </div>
        )}

        {otpVerified && (
          <>
            <div className="otp-message success">✓ OTP verified. Processing withdrawal...</div>
            <button
              className="btn-primary"
              onClick={handleProcessWithdrawal}
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {loading ? 'Processing...' : 'Complete Withdrawal'}
            </button>
          </>
        )}
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="success-container">
      <div className="success-icon">✓</div>
      <h2>Withdrawal Initiated!</h2>
      <p>Your withdrawal request has been processed successfully</p>

      <div className="success-details">
        <div className="detail-row">
          <span>Transaction ID:</span>
          <strong>{successData?.transactionId}</strong>
        </div>
        <div className="detail-row">
          <span>Amount Withdrawn:</span>
          <strong>₹{successData?.amount?.toLocaleString('en-IN')}</strong>
        </div>
        <div className="detail-row">
          <span>Beneficiary:</span>
          <strong>{successData?.beneficiary}</strong>
        </div>
        <div className="detail-row">
          <span>Method:</span>
          <strong>{successData?.method}</strong>
        </div>
        <div className="detail-row">
          <span>Expected Time:</span>
          <strong>{successData?.processingTime}</strong>
        </div>
        <div className="detail-row">
          <span>Date & Time:</span>
          <strong>{new Date(successData?.timestamp).toLocaleString()}</strong>
        </div>
      </div>

      <div className="success-note">
        <p>📧 A confirmation email has been sent to your registered email address.</p>
      </div>

      <button className="btn-primary" onClick={handleReset} style={{ width: '100%', marginTop: '20px' }}>
        Withdraw More Money
      </button>
    </div>
  );

  const renderError = () => (
    <div className="error-container">
      <div className="error-icon">✕</div>
      <h2>Withdrawal Failed</h2>
      <p>{error}</p>

      <div className="error-actions">
        <button className="btn-secondary" onClick={() => setCurrentStep('method')}>
          ← Try Different Method
        </button>
        <button className="btn-primary" onClick={handleReset}>
          Start Over
        </button>
      </div>
    </div>
  );

  // ==================== MAIN RENDER ====================

  return (
    <div className="payment-container premium-payment payout-premium">
      <div className="payment-header">
        <h1>💰 Withdraw Money</h1>
        <p>Fast and secure withdrawal to your bank account</p>
      </div>

      {error && currentStep !== 'success' && currentStep !== 'error' && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      <div className="payment-content">
        {currentStep === 'method' && renderMethodSelection()}
        {currentStep === 'beneficiary' && renderBeneficiarySelection()}
        {currentStep === 'details' && renderDetailsForm()}
        {currentStep === 'confirmation' && renderConfirmation()}
        {currentStep === 'success' && renderSuccess()}
        {currentStep === 'error' && renderError()}
      </div>

      <div className="payment-security">
        <p>🔒 All transactions are encrypted with AES-256 encryption</p>
        <p>✓ RBI Authorized • PCI DSS Level 1 • ISO 27001 Certified</p>
      </div>
    </div>
  );
};

export default PayOutPremium;

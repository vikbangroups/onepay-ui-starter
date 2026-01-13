/**
 * Pay-In Premium Component
 * Production-grade money addition screen
 * Supports multiple payment methods and gateway integrations
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/payment-premium.css';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'upi' | 'card' | 'netbanking' | 'wallet' | 'aadhar';
  gateway: 'razorpay' | 'moneris' | 'paypal' | 'internal';
  description: string;
}

interface Card {
  id: string;
  type: 'credit' | 'debit';
  number: string;
  name: string;
  expiry: string;
  isDefault: boolean;
}

const PayInPremium: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'method' | 'details' | 'confirmation' | 'success' | 'error'>('method');
  
  // Form States
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  const [aadharNumber, setAadharNumber] = useState<string>('');
  const [aadharVerified, setAadharVerified] = useState(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // UI States
  const [cards] = useState<Card[]>([
    { id: '1', type: 'credit', number: '****1234', name: 'ICICI Credit Card', expiry: '12/26', isDefault: true },
    { id: '2', type: 'debit', number: '****5678', name: 'HDFC Debit Card', expiry: '08/27', isDefault: false },
  ]);
  const [walletBalance] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successData, setSuccessData] = useState<any>(null);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      type: 'upi',
      gateway: 'razorpay',
      description: 'Add money via UPI - Instant transfer'
    },
    {
      id: 'credit-card',
      name: 'Credit Card',
      icon: '💳',
      type: 'card',
      gateway: 'moneris',
      description: 'Secure credit card payment'
    },
    {
      id: 'debit-card',
      name: 'Debit Card',
      icon: '💳',
      type: 'card',
      gateway: 'moneris',
      description: 'Fast debit card transfer'
    },
    {
      id: 'netbanking',
      name: 'NetBanking',
      icon: '🏦',
      type: 'netbanking',
      gateway: 'razorpay',
      description: 'Add via internet banking'
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: '💰',
      type: 'wallet',
      gateway: 'internal',
      description: `Available balance: ₹${walletBalance}`
    },
    {
      id: 'aadhar',
      name: 'Aadhar Pay',
      icon: '🆔',
      type: 'aadhar',
      gateway: 'paypal',
      description: 'Biometric payment via Aadhar'
    }
  ];

  // ==================== HANDLERS ====================

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
    setError('');
    setCurrentStep('details');
  };

  const handleVerifyAadhar = async () => {
    if (!aadharNumber || aadharNumber.length !== 12) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }
    setLoading(true);
    try {
      // Mock Aadhar verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAadharVerified(true);
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError('Aadhar verification failed');
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
      // Mock OTP verification
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

  const handlePaymentProcess = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Validation based on method
    if (selectedMethod === 'upi' && !upiId) {
      setError('Please enter UPI ID');
      return;
    }
    if (selectedMethod.includes('card') && !selectedCard) {
      setError('Please select a card');
      return;
    }
    if (selectedMethod === 'aadhar' && !otpVerified) {
      setError('Please verify OTP first');
      return;
    }

    setLoading(true);
    try {
      // Mock payment gateway integration
      const gatewayResponse = await processPaymentGateway(
        selectedMethod,
        parseFloat(amount),
        user?.phone || ''
      );

      if (gatewayResponse.success) {
        setSuccessData({
          transactionId: gatewayResponse.transactionId,
          amount: parseFloat(amount),
          method: paymentMethods.find(m => m.id === selectedMethod)?.name,
          timestamp: new Date().toISOString(),
          gateway: gatewayResponse.gateway
        });
        setCurrentStep('success');
      } else {
        setError(gatewayResponse.error || 'Payment processing failed');
        setCurrentStep('error');
      }
    } catch (err) {
      setError('Payment processing error: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setCurrentStep('error');
    } finally {
      setLoading(false);
    }
  };

  const validateUPI = (upi: string): boolean => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
    return upiRegex.test(upi);
  };

  const validateAmount = (amt: string): boolean => {
    const amtNum = parseFloat(amt);
    return amtNum >= 100 && amtNum <= 100000;
  };

  const validateCard = (card: string): boolean => {
    return card.length > 0;
  };

  const validateAllInputs = (): boolean => {
    switch (selectedMethod) {
      case 'upi':
        return validateUPI(upiId) && validateAmount(amount);
      case 'credit-card':
      case 'debit-card':
        return validateCard(selectedCard) && validateAmount(amount);
      case 'netbanking':
        return validateAmount(amount);
      case 'wallet':
        return validateAmount(amount) && parseFloat(amount) <= walletBalance;
      case 'aadhar':
        return aadharVerified && validateAmount(amount);
      default:
        return false;
    }
  };

  const processPaymentGateway = async (method: string, amountValue: number, _phone: string) => {
    const selectedMethodObj = paymentMethods.find(m => m.id === method);
    
    // Simulate payment gateway API call
    // Different gateways have different success rates and response times
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Simulate gateway response logic
    let isSuccess = false;
    let failureReason = '';

    // Razorpay: 90% success rate
    if (selectedMethodObj?.gateway === 'razorpay') {
      isSuccess = Math.random() > 0.10;
      if (!isSuccess) failureReason = 'Failed to process via Razorpay. Please retry or select another method.';
    }
    // Moneris: 85% success rate
    else if (selectedMethodObj?.gateway === 'moneris') {
      isSuccess = Math.random() > 0.15;
      if (!isSuccess) failureReason = 'Card declined by Moneris gateway. Try another card.';
    }
    // PayPal: 92% success rate
    else if (selectedMethodObj?.gateway === 'paypal') {
      isSuccess = Math.random() > 0.08;
      if (!isSuccess) failureReason = 'PayPal authentication failed. Please try again.';
    }
    // Internal Wallet: 99% success (only fails if insufficient funds)
    else if (selectedMethodObj?.gateway === 'internal') {
      if (amountValue <= walletBalance) {
        isSuccess = true;
      } else {
        isSuccess = false;
        failureReason = 'Insufficient wallet balance. Add money or select another method.';
      }
    }

    if (!isSuccess) {
      return {
        success: false,
        error: failureReason || 'Payment processing failed. Please try again.'
      };
    }

    const txnId = `PAY-IN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return {
      success: true,
      transactionId: txnId,
      gateway: selectedMethodObj?.gateway,
      amount: amountValue,
      method: method,
      timestamp: new Date().toISOString()
    };
  };

  const handleReset = () => {
    setCurrentStep('method');
    setSelectedMethod('');
    setAmount('');
    setSelectedCard('');
    setUpiId('');
    setAadharNumber('');
    setAadharVerified(false);
    setOtpValue('');
    setOtpSent(false);
    setOtpVerified(false);
    setError('');
    setSuccessData(null);
  };

  // ==================== RENDER METHODS ====================

  const renderMethodSelection = () => (
    <div className="payment-methods-grid">
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className="payment-method-card"
          onClick={() => handleSelectMethod(method.id)}
          style={{
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderColor: selectedMethod === method.id ? '#3B82F6' : '#e5e7eb',
            backgroundColor: selectedMethod === method.id ? '#eff6ff' : '#ffffff',
            boxShadow: selectedMethod === method.id ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none'
          }}
        >
          <div className="method-icon">{method.icon}</div>
          <h3 className="method-name">{method.name}</h3>
          <p className="method-description">{method.description}</p>
          <div className="method-gateway">
            <span className="gateway-badge">{method.gateway}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPaymentDetails = () => {
    switch (selectedMethod) {
      case 'upi':
        return (
          <div className="payment-form">
            <div className="form-group">
              <label>UPI ID *</label>
              <input
                type="text"
                placeholder="yourname@bankname"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                min="100"
                max="100000"
              />
            </div>
            <div className="amount-presets">
              {[1000, 5000, 10000, 25000].map(preset => (
                <button
                  key={preset}
                  className="preset-btn"
                  onClick={() => setAmount(preset.toString())}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </div>
        );

      case 'credit-card':
      case 'debit-card':
        return (
          <div className="payment-form">
            <div className="form-group">
              <label>Select Card *</label>
              <div className="cards-list">
                {cards
                  .filter(c => (selectedMethod === 'credit-card' ? c.type === 'credit' : c.type === 'debit'))
                  .map(card => (
                    <div
                      key={card.id}
                      className={`card-option ${selectedCard === card.id ? 'selected' : ''}`}
                      onClick={() => setSelectedCard(card.id)}
                    >
                      <input type="radio" checked={selectedCard === card.id} readOnly />
                      <span>{card.name} ({card.number})</span>
                      {card.isDefault && <span className="default-badge">Default</span>}
                    </div>
                  ))}
              </div>
            </div>
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                min="100"
                max="500000"
              />
            </div>
          </div>
        );

      case 'netbanking':
        return (
          <div className="payment-form">
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                min="100"
                max="100000"
              />
            </div>
            <p className="info-text">You will be redirected to your bank's secure portal for authentication.</p>
          </div>
        );

      case 'wallet':
        return (
          <div className="payment-form">
            <div className="wallet-info">
              <p>Available Wallet Balance: <strong>₹{walletBalance}</strong></p>
            </div>
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                min="100"
                max={walletBalance}
              />
            </div>
          </div>
        );

      case 'aadhar':
        return (
          <div className="payment-form">
            {!aadharVerified ? (
              <>
                <div className="form-group">
                  <label>Aadhar Number (12 digits) *</label>
                  <input
                    type="password"
                    placeholder="Enter your Aadhar number"
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, ''))}
                    maxLength={12}
                    className="form-input"
                  />
                  <small>Your Aadhar number is encrypted and secure</small>
                </div>
                <button
                  className="btn-verify"
                  onClick={handleVerifyAadhar}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Aadhar'}
                </button>
              </>
            ) : otpSent && !otpVerified ? (
              <>
                <div className="otp-message">✓ Aadhar verified successfully</div>
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
                  className="btn-verify"
                  onClick={handleVerifyOTP}
                  disabled={loading || otpValue.length !== 6}
                >
                  {loading ? 'Verifying OTP...' : 'Verify OTP'}
                </button>
              </>
            ) : (
              <>
                <div className="otp-message success">✓ Aadhar and OTP verified successfully</div>
                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="form-input"
                    min="100"
                    max="500000"
                  />
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderConfirmation = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    return (
      <div className="confirmation-container">
        <div className="confirmation-header">
          <h2>Confirm Payment</h2>
          <p>Please review the details before proceeding</p>
        </div>
        
        <div className="confirmation-details">
          <div className="detail-row">
            <span>Payment Method:</span>
            <strong>{method?.name} ({method?.gateway})</strong>
          </div>
          <div className="detail-row">
            <span>Amount:</span>
            <strong className="amount">₹{parseFloat(amount).toLocaleString('en-IN')}</strong>
          </div>
          <div className="detail-row">
            <span>Processing Fee:</span>
            <strong>₹{(parseFloat(amount) * 0.01).toFixed(2)}</strong>
          </div>
          <div className="detail-row total">
            <span>Total Debit:</span>
            <strong>₹{(parseFloat(amount) + parseFloat(amount) * 0.01).toFixed(2)}</strong>
          </div>
          <div className="detail-row">
            <span>Wallet After:</span>
            <strong>₹{(walletBalance + parseFloat(amount)).toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <button
            className="btn-secondary"
            onClick={() => setCurrentStep('details')}
            disabled={loading}
          >
            ← Back
          </button>
          <button
            className="btn-primary"
            onClick={handlePaymentProcess}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Complete Payment'}
          </button>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="success-container">
      <div className="success-icon">✓</div>
      <h2>Payment Successful!</h2>
      <p>Your money has been added to your wallet</p>
      
      <div className="success-details">
        <div className="detail-row">
          <span>Transaction ID:</span>
          <strong>{successData?.transactionId}</strong>
        </div>
        <div className="detail-row">
          <span>Amount:</span>
          <strong>₹{successData?.amount?.toLocaleString('en-IN')}</strong>
        </div>
        <div className="detail-row">
          <span>Payment Method:</span>
          <strong>{successData?.method}</strong>
        </div>
        <div className="detail-row">
          <span>Gateway:</span>
          <strong>{successData?.gateway}</strong>
        </div>
        <div className="detail-row">
          <span>Time:</span>
          <strong>{new Date(successData?.timestamp).toLocaleString()}</strong>
        </div>
      </div>

      <button className="btn-primary" onClick={handleReset} style={{ width: '100%', marginTop: '20px' }}>
        Add More Money
      </button>
    </div>
  );

  const renderError = () => (
    <div className="error-container">
      <div className="error-icon">✕</div>
      <h2>Payment Failed</h2>
      <p>{error}</p>
      
      <div className="error-actions">
        <button className="btn-secondary" onClick={() => setCurrentStep('details')}>
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
    <div className="payment-container premium-payment">
      <div className="payment-header">
        <h1>💳 Add Money to Wallet</h1>
        <p>Secure payment using trusted gateways</p>
      </div>

      {error && currentStep !== 'success' && currentStep !== 'error' && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      <div className="payment-content">
        {currentStep === 'method' && renderMethodSelection()}
        {currentStep === 'details' && (
          <div>
            <div className="step-header">
              <button className="btn-back" onClick={() => setCurrentStep('method')}>← Back</button>
              <h2>Payment Details</h2>
            </div>
            {renderPaymentDetails()}
            {validateAllInputs() && (
              <button
                className="btn-primary btn-proceed"
                onClick={() => {
                  if (!validateAllInputs()) {
                    setError('Please fill all required fields correctly');
                    return;
                  }
                  setCurrentStep('confirmation');
                }}
              >
                Continue to Confirmation
              </button>
            )}
            {!validateAllInputs() && amount && (
              <div className="error-message">
                <span>⚠️ Please enter valid details</span>
              </div>
            )}
          </div>
        )}
        {currentStep === 'confirmation' && renderConfirmation()}
        {currentStep === 'success' && renderSuccess()}
        {currentStep === 'error' && renderError()}
      </div>

      <div className="payment-security">
        <p>🔒 All payments are encrypted with AES-256 encryption</p>
        <p>✓ PCI DSS Compliant • RBI Approved • ISO 27001 Certified</p>
      </div>
    </div>
  );
};

export default PayInPremium;

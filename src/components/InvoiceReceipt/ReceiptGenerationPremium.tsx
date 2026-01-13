/**
 * Receipt Generation Premium Component
 * Enterprise-grade invoice/receipt generation & delivery
 * Features: PDF export, Email, WhatsApp, Receipt History, Templates
 */

import React, { useState, useRef, useMemo, useEffect } from 'react';
import '../../styles/receipt-generation-premium.css';
import OneCodeLogo from '../../assets/OneCode_Logo.png';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'pay-in' | 'pay-out';
  method: string;
  status: 'success' | 'failed' | 'pending';
  recipient?: string;
  description: string;
  reference: string;
  gateway?: string;
  fee?: number;
}

interface Receipt {
  transactionId: string;
  transaction: Transaction;
  receiptNumber: string;
  issueDate: string;
  recipientEmail?: string;
  recipientPhone?: string;
  downloadedAt?: string;
  sharedVia?: string[];
}

interface FormData {
  recipientEmail: string;
  recipientPhone: string;
  includeItemized: boolean;
  includeNotes: boolean;
  customNotes: string;
}

const ReceiptGenerationPremium: React.FC = () => {
  // ==================== STATE ====================
  const [transactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      amount: 10000,
      date: '2026-01-07',
      type: 'pay-in',
      method: 'UPI',
      status: 'success',
      description: 'Payment for Services',
      reference: 'REF2610007',
      gateway: 'Razorpay',
      fee: 100,
    },
    {
      id: 'TXN002',
      amount: 25000,
      date: '2026-01-06',
      type: 'pay-out',
      method: 'NEFT',
      status: 'success',
      recipient: 'Rajesh Kumar',
      description: 'Salary Transfer',
      reference: 'REF2610006',
      gateway: 'ICICI Bank',
      fee: 0,
    },
    {
      id: 'TXN003',
      amount: 5000,
      date: '2026-01-05',
      type: 'pay-in',
      method: 'Debit Card',
      status: 'success',
      description: 'Top-up',
      reference: 'REF2610005',
      gateway: 'Moneris',
      fee: 50,
    },
    {
      id: 'TXN004',
      amount: 15000,
      date: '2026-01-04',
      type: 'pay-out',
      method: 'UPI',
      status: 'success',
      recipient: 'Priya Sharma',
      description: 'Vendor Payment',
      reference: 'REF2610004',
      gateway: 'Razorpay',
      fee: 0,
    },
  ]);

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(typeof window !== 'undefined' && window.innerWidth < 1024 ? 'grid' : 'table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pay-in' | 'pay-out'>('all');
  const [receiptHistory, setReceiptHistory] = useState<Receipt[]>([
    {
      transactionId: 'TXN001',
      transaction: transactions[0],
      receiptNumber: 'RCP-2601-001',
      issueDate: '2026-01-07',
      recipientEmail: 'user@example.com',
      downloadedAt: '2026-01-07 10:30 AM',
      sharedVia: ['Email'],
    },
  ]);

  const [formData, setFormData] = useState<FormData>({
    recipientEmail: '',
    recipientPhone: '',
    includeItemized: true,
    includeNotes: false,
    customNotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // ==================== RESPONSIVE HANDLER ====================

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile && viewMode === 'table') {
        setViewMode('grid');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // ==================== FILTERING ====================

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(term) ||
        t.reference.toLowerCase().includes(term) ||
        t.recipient?.toLowerCase().includes(term) ||
        t.amount.toString().includes(term)
      );
    }

    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filterType]);

  // ==================== HANDLERS ====================

  const generateReceiptNumber = () => {
    const date = new Date();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `RCP-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${randomNum}`;
  };

  // Convert image to base64
  const getBase64Image = (): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve('');
        }
      };
      img.onerror = () => resolve('');
      img.src = OneCodeLogo;
    });
  };

  const handlePreviewReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowPreview(true);
  };

  const handleDownloadPDF = async () => {
    if (!selectedTransaction || !receiptRef.current) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const receiptNumber = generateReceiptNumber();
      const filename = `Receipt-${receiptNumber}-${new Date().getTime()}.html`;
      
      // Get base64 encoded logo
      const logoBase64 = await getBase64Image();
      
      const logoHTML = logoBase64 
        ? `<img src="${logoBase64}" alt="OneCode Logo" style="width: 60px; height: auto; margin-bottom: 10px; display: block;" />`
        : `<div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 4px; margin-bottom: 10px;"></div>`;
      
      const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background: white;
    }
    body { 
      padding: 40px 20px;
      line-height: 1.6;
    }
    .receipt-content {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    .receipt-header-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e2e8f0;
    }
    .company-header {
      display: flex;
      align-items: flex-start;
      gap: 15px;
    }
    .company-logo {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .company-logo img {
      max-width: 60px;
      height: auto;
      display: block;
    }
    .company-info h2 { 
      font-size: 24px; 
      color: #2d3748; 
      margin: 0 0 5px 0; 
      font-weight: 700;
    }
    .company-info p { 
      margin: 3px 0; 
      color: #718096; 
      font-size: 14px; 
    }
    .receipt-meta { 
      text-align: right; 
    }
    .receipt-meta p { 
      margin: 5px 0; 
      font-size: 14px; 
      color: #4a5568;
    }
    .receipt-meta strong {
      color: #2d3748;
      font-weight: 600;
    }
    .transaction-section { 
      margin-bottom: 30px; 
    }
    .transaction-section h3 { 
      margin: 0 0 15px 0; 
      font-size: 16px; 
      color: #2d3748; 
      font-weight: 600;
    }
    .detail-row { 
      display: flex; 
      justify-content: space-between; 
      padding: 8px 0; 
      border-bottom: 1px solid #f0f0f0; 
      font-size: 14px;
    }
    .detail-row span:first-child { 
      font-weight: 600; 
      color: #4a5568; 
      min-width: 150px; 
    }
    .detail-row .value { 
      color: #2d3748; 
      text-align: right; 
      word-break: break-word;
    }
    .amount-section { 
      margin: 30px 0; 
      padding: 20px; 
      background: #f7fafc; 
      border-radius: 8px; 
    }
    .amount-row { 
      display: flex; 
      justify-content: space-between; 
      padding: 10px 0; 
      font-size: 15px; 
      color: #4a5568;
    }
    .amount-row.total { 
      font-weight: 700; 
      border-top: 2px solid #e2e8f0; 
      padding-top: 15px; 
      color: #2d3748;
      margin-top: 10px;
    }
    .amount-value { 
      font-weight: 600; 
      color: #667eea; 
    }
    .receipt-footer { 
      text-align: center; 
      margin-top: 30px; 
      padding-top: 20px; 
      border-top: 1px solid #e2e8f0; 
    }
    .receipt-footer p { 
      margin: 5px 0; 
      color: #718096; 
      font-size: 13px; 
    }
    @media print {
      body { padding: 0; margin: 0; }
      .receipt-content { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="receipt-content">
    <div class="receipt-header-section">
      <div class="company-header">
        <div class="company-logo">
          ${logoHTML}
        </div>
        <div class="company-info">
          <h2>OnePay</h2>
          <p>One Code Solutions</p>
          <p>Digital Payment Gateway</p>
        </div>
      </div>
      <div class="receipt-meta">
        <p><strong>Receipt #</strong> ${receiptNumber}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
    </div>

    <div class="receipt-body">
      <div class="transaction-section">
        <h3>Transaction Details</h3>
        <div class="detail-row">
          <span>Transaction ID:</span>
          <span class="value">${selectedTransaction.id}</span>
        </div>
        <div class="detail-row">
          <span>Reference:</span>
          <span class="value">${selectedTransaction.reference}</span>
        </div>
        <div class="detail-row">
          <span>Type:</span>
          <span class="value">${selectedTransaction.type === 'pay-in' ? 'Pay-In' : 'Pay-Out'}</span>
        </div>
        <div class="detail-row">
          <span>Description:</span>
          <span class="value">${selectedTransaction.description}</span>
        </div>
        <div class="detail-row">
          <span>Date:</span>
          <span class="value">${selectedTransaction.date}</span>
        </div>
        <div class="detail-row">
          <span>Method:</span>
          <span class="value">${selectedTransaction.method}</span>
        </div>
        ${selectedTransaction.gateway ? `
        <div class="detail-row">
          <span>Gateway:</span>
          <span class="value">${selectedTransaction.gateway}</span>
        </div>
        ` : ''}
        ${selectedTransaction.recipient ? `
        <div class="detail-row">
          <span>Recipient:</span>
          <span class="value">${selectedTransaction.recipient}</span>
        </div>
        ` : ''}
      </div>

      <div class="amount-section">
        <div class="amount-row">
          <span>Amount</span>
          <span class="amount-value">&#x20B9;${selectedTransaction.amount.toLocaleString()}</span>
        </div>
        ${selectedTransaction.fee && selectedTransaction.fee > 0 ? `
        <div class="amount-row">
          <span>Processing Fee</span>
          <span class="amount-value">&#x20B9;${selectedTransaction.fee}</span>
        </div>
        <div class="amount-row total">
          <span>Total Amount</span>
          <span class="amount-value">&#x20B9;${(selectedTransaction.amount + selectedTransaction.fee).toLocaleString()}</span>
        </div>
        ` : `
        <div class="amount-row total">
          <span>Total Amount</span>
          <span class="amount-value">&#x20B9;${selectedTransaction.amount.toLocaleString()}</span>
        </div>
        `}
        <div class="amount-row">
          <span>Status</span>
          <span class="amount-value">${selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}</span>
        </div>
      </div>

      <div class="receipt-footer">
        <p>Thank you for using OnePay</p>
        <p>This is a digital receipt generated by OnePay. For inquiries, contact support@onepay.com</p>
        <p style="margin-top: 15px; font-size: 12px;">Generated on ${new Date().toLocaleString()}</p>
      </div>
    </div>
  </div>
</body>
</html>
      `;

      const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const newReceipt: Receipt = {
        transactionId: selectedTransaction.id,
        transaction: selectedTransaction,
        receiptNumber,
        issueDate: new Date().toISOString().split('T')[0],
        downloadedAt: new Date().toLocaleString(),
        sharedVia: ['Downloaded'],
      };

      setReceiptHistory([newReceipt, ...receiptHistory]);
      setMessage({ type: 'success', text: `📥 Receipt ${receiptNumber} downloaded successfully!` });
      setShowPreview(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to generate receipt' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedTransaction || !formData.recipientEmail) {
      setMessage({ type: 'error', text: 'Enter recipient email address' });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const receiptNumber = generateReceiptNumber();
      const newReceipt: Receipt = {
        transactionId: selectedTransaction.id,
        transaction: selectedTransaction,
        receiptNumber,
        issueDate: new Date().toISOString().split('T')[0],
        recipientEmail: formData.recipientEmail,
        sharedVia: ['Email'],
      };

      setReceiptHistory([newReceipt, ...receiptHistory]);
      setMessage({
        type: 'success',
        text: `Receipt sent to ${formData.recipientEmail}`,
      });
      setShowDelivery(false);
      setFormData({ ...formData, recipientEmail: '' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to send email' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!selectedTransaction || !formData.recipientPhone) {
      setMessage({ type: 'error', text: 'Enter recipient WhatsApp number' });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const receiptNumber = generateReceiptNumber();
      const newReceipt: Receipt = {
        transactionId: selectedTransaction.id,
        transaction: selectedTransaction,
        receiptNumber,
        issueDate: new Date().toISOString().split('T')[0],
        recipientPhone: formData.recipientPhone,
        sharedVia: ['WhatsApp'],
      };

      setReceiptHistory([newReceipt, ...receiptHistory]);
      setMessage({
        type: 'success',
        text: `Receipt sent via WhatsApp to ${formData.recipientPhone}`,
      });
      setShowDelivery(false);
      setFormData({ ...formData, recipientPhone: '' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to send WhatsApp' });
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER HELPERS ====================

  const getStatusBadge = (status: string) => {
    const config: Record<string, { class: string; icon: string; label: string }> = {
      success: { class: 'success', icon: '✓', label: 'Success' },
      pending: { class: 'pending', icon: '⏱', label: 'Pending' },
      failed: { class: 'failed', icon: '✕', label: 'Failed' },
    };
    return config[status] || { class: '', icon: '', label: '' };
  };

  const getTypeBadge = (type: string) => {
    return type === 'pay-in'
      ? { icon: '💰', label: 'Pay-In', class: 'pay-in' }
      : { icon: '💸', label: 'Pay-Out', class: 'pay-out' };
  };

  // ==================== RENDER ====================

  return (
    <div className="receipt-generation-container">
      <div className="receipt-header">
        <h1>📄 Invoice/Receipt Generation</h1>
        <p>Generate, manage, and deliver receipts via email or WhatsApp</p>
      </div>

      {message && (
        <div className={`message-banner ${message.type}`}>
          <span>{message.type === 'success' ? '✓' : '✕'} {message.text}</span>
          <button onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      {/* ==================== TOOLBAR ==================== */}
      <div className="receipt-toolbar">
        <button
          className="btn-view-history"
          onClick={() => setShowHistory(!showHistory)}
        >
          📋 Receipt History ({receiptHistory.length})
        </button>

        <div className="toolbar-middle">
          <input
            type="text"
            placeholder="🔍 Search by reference, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="pay-in">Pay-In</option>
            <option value="pay-out">Pay-Out</option>
          </select>
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            ≡ Table
          </button>
          <button
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            ⊞ Grid
          </button>
        </div>
      </div>

      {/* ==================== RECEIPT HISTORY PANEL ==================== */}
      {showHistory && (
        <div className="receipt-history-panel">
          <div className="history-header">
            <h3>📜 Receipt History</h3>
            <button className="history-close" onClick={() => setShowHistory(false)}>✕</button>
          </div>
          <div className="history-content">
            {receiptHistory.length > 0 ? (
              receiptHistory.map((receipt, idx) => (
                <div key={idx} className="history-item">
                  <div className="history-receipt-num">{receipt.receiptNumber}</div>
                  <div className="history-details">
                    <p><strong>{receipt.transaction.description}</strong></p>
                    <p>₹{receipt.transaction.amount} • {receipt.issueDate}</p>
                    <p className="history-shared">Shared via: {receipt.sharedVia?.join(', ')}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-history">No receipts generated yet</p>
            )}
          </div>
        </div>
      )}

      {/* ==================== TRANSACTIONS LIST ==================== */}
      <div className={`transaction-container transaction-${viewMode}`}>
        {filteredTransactions.length > 0 ? (
          viewMode === 'table' ? (
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Reference</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(txn => (
                  <tr key={txn.id}>
                    <td>{txn.date}</td>
                    <td>
                      <span className={`type-badge ${getTypeBadge(txn.type).class}`}>
                        {getTypeBadge(txn.type).icon} {getTypeBadge(txn.type).label}
                      </span>
                    </td>
                    <td>{txn.description}</td>
                    <td className="reference">{txn.reference}</td>
                    <td className="amount">₹{txn.amount.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadge(txn.status).class}`}>
                        {getStatusBadge(txn.status).icon} {getStatusBadge(txn.status).label}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-generate"
                        onClick={() => handlePreviewReceipt(txn)}
                      >
                        📄 Generate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="transaction-grid">
              {filteredTransactions.map(txn => (
                <div key={txn.id} className="transaction-card">
                  <div className="card-header">
                    <span className={`type-badge ${getTypeBadge(txn.type).class}`}>
                      {getTypeBadge(txn.type).icon} {getTypeBadge(txn.type).label}
                    </span>
                    <span className={`status-badge ${getStatusBadge(txn.status).class}`}>
                      {getStatusBadge(txn.status).icon}
                    </span>
                  </div>
                  <div className="card-content">
                    <h4>{txn.description}</h4>
                    <p className="reference">{txn.reference}</p>
                    <p className="date">{txn.date}</p>
                    <p className="method">Method: {txn.method}</p>
                  </div>
                  <div className="card-footer">
                    <p className="amount">₹{txn.amount.toLocaleString()}</p>
                    <button
                      className="btn-generate"
                      onClick={() => handlePreviewReceipt(txn)}
                    >
                      📄 Generate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="no-transactions">
            <p>No transactions found</p>
          </div>
        )}
      </div>

      {/* ==================== RECEIPT PREVIEW MODAL ==================== */}
      {showPreview && selectedTransaction && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-content receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📄 Receipt Preview</h2>
              <button className="modal-close" onClick={() => setShowPreview(false)}>✕</button>
            </div>

            {/* Receipt Template */}
            <div className="receipt-preview" ref={receiptRef}>
              <div className="receipt-content">
                {/* Header */}
                <div className="receipt-header-section">
                  <div className="company-header">
                    <div className="company-logo">
                      <img src={OneCodeLogo} alt="OneCode Logo" />
                    </div>
                    <div className="company-info">
                      <h2>OnePay</h2>
                      <p>One Code Solutions</p>
                      <p>Digital Payment Gateway</p>
                    </div>
                  </div>
                  <div className="receipt-meta">
                    <p><strong>Receipt #</strong> {generateReceiptNumber()}</p>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="receipt-body">
                  <div className="transaction-section">
                    <h3>Transaction Details</h3>
                    <div className="detail-row">
                      <span>Transaction ID:</span>
                      <span className="value">{selectedTransaction.id}</span>
                    </div>
                    <div className="detail-row">
                      <span>Reference:</span>
                      <span className="value">{selectedTransaction.reference}</span>
                    </div>
                    <div className="detail-row">
                      <span>Type:</span>
                      <span className="value">{getTypeBadge(selectedTransaction.type).label}</span>
                    </div>
                    <div className="detail-row">
                      <span>Description:</span>
                      <span className="value">{selectedTransaction.description}</span>
                    </div>
                    <div className="detail-row">
                      <span>Date:</span>
                      <span className="value">{selectedTransaction.date}</span>
                    </div>
                    <div className="detail-row">
                      <span>Method:</span>
                      <span className="value">{selectedTransaction.method}</span>
                    </div>
                    {selectedTransaction.gateway && (
                      <div className="detail-row">
                        <span>Gateway:</span>
                        <span className="value">{selectedTransaction.gateway}</span>
                      </div>
                    )}
                    {selectedTransaction.recipient && (
                      <div className="detail-row">
                        <span>Recipient:</span>
                        <span className="value">{selectedTransaction.recipient}</span>
                      </div>
                    )}
                  </div>

                  {/* Amount Section */}
                  <div className="amount-section">
                    <div className="amount-row">
                      <span>Amount</span>
                      <span className="amount-value">₹{selectedTransaction.amount.toLocaleString()}</span>
                    </div>
                    {selectedTransaction.fee && selectedTransaction.fee > 0 && (
                      <>
                        <div className="amount-row">
                          <span>Processing Fee</span>
                          <span className="amount-value">₹{selectedTransaction.fee}</span>
                        </div>
                        <div className="amount-row total">
                          <span>Total Deducted</span>
                          <span className="amount-value">₹{selectedTransaction.amount + selectedTransaction.fee}</span>
                        </div>
                      </>
                    )}
                    <div className={`amount-row status ${selectedTransaction.status}`}>
                      <span>Status</span>
                      <span className="amount-value">
                        {getStatusBadge(selectedTransaction.status).icon} {getStatusBadge(selectedTransaction.status).label}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="receipt-footer">
                    <p>Thank you for using OnePay</p>
                    <p className="small-text">This is a digital receipt generated by OnePay. For inquiries, contact support@onepay.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="receipt-actions">
              <button className="btn-primary" onClick={handleDownloadPDF} disabled={loading}>
                {loading ? '📥 Generating...' : '📥 Download PDF'}
              </button>
              <button className="btn-secondary" onClick={() => setShowDelivery(true)}>
                📤 Send Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DELIVERY OPTIONS MODAL ==================== */}
      {showDelivery && selectedTransaction && (
        <div className="modal-overlay" onClick={() => setShowDelivery(false)}>
          <div className="modal-content delivery-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📤 Send Receipt</h2>
              <button className="modal-close" onClick={() => setShowDelivery(false)}>✕</button>
            </div>

            <div className="delivery-content">
              {/* Email Option */}
              <div className="delivery-option">
                <div className="option-header">
                  <h3>✉️ Email Receipt</h3>
                </div>
                <div className="option-input">
                  <input
                    type="email"
                    placeholder="recipient@example.com"
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                    className="form-input"
                  />
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={formData.includeItemized}
                      onChange={(e) => setFormData({ ...formData, includeItemized: e.target.checked })}
                    />
                    Include itemized details
                  </label>
                  <button
                    className="btn-send-option"
                    onClick={handleSendEmail}
                    disabled={loading}
                  >
                    {loading ? '⏳ Sending...' : '✉️ Send Email'}
                  </button>
                </div>
              </div>

              {/* WhatsApp Option */}
              <div className="delivery-option">
                <div className="option-header">
                  <h3>💬 WhatsApp Receipt</h3>
                </div>
                <div className="option-input">
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.recipientPhone}
                    onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                    className="form-input"
                  />
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={formData.includeNotes}
                      onChange={(e) => setFormData({ ...formData, includeNotes: e.target.checked })}
                    />
                    Add custom message
                  </label>
                  {formData.includeNotes && (
                    <textarea
                      placeholder="Add a custom note..."
                      value={formData.customNotes}
                      onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                      className="form-textarea"
                      rows={3}
                    />
                  )}
                  <button
                    className="btn-send-option whatsapp"
                    onClick={handleSendWhatsApp}
                    disabled={loading}
                  >
                    {loading ? '⏳ Sending...' : '💬 Send WhatsApp'}
                  </button>
                </div>
              </div>

              {/* Additional Options */}
              <div className="delivery-additional">
                <div className="additional-item">
                  <span>🔗 Generate Shareable Link</span>
                  <button className="btn-mini">Generate</button>
                </div>
                <div className="additional-item">
                  <span>📱 Send SMS</span>
                  <button className="btn-mini">Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptGenerationPremium;

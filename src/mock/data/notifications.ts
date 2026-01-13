/**
 * Mock Notifications Data
 * Different types of notifications (payments, KYC, payouts, alerts)
 */

export interface MockNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  icon?: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export const mockNotifications: MockNotification[] = [
  // Payment successful
  {
    id: 'notif-001',
    userId: 'merchant-001',
    type: 'payment_success',
    title: 'Payment Received',
    message: '₹5,000 received from customer. Ref: TXN-123',
    icon: 'check-circle',
    data: { transactionId: 'txn-001', amount: 5000 },
    read: false,
    createdAt: '2025-12-28T14:30:00Z',
  },

  // Payment failed
  {
    id: 'notif-002',
    userId: 'merchant-002',
    type: 'payment_failed',
    title: 'Payment Failed',
    message: 'Payment of ₹10,000 failed. Reason: Insufficient funds',
    icon: 'alert-circle',
    actionUrl: '/retry-payment',
    read: false,
    createdAt: '2025-12-29T10:00:00Z',
  },

  // KYC pending
  {
    id: 'notif-003',
    userId: 'merchant-002',
    type: 'kyc_pending',
    title: 'KYC Verification Pending',
    message: 'Your KYC is under review. Expected completion: Dec 31',
    icon: 'info-circle',
    actionUrl: '/kyc-status',
    read: false,
    createdAt: '2025-12-25T09:00:00Z',
  },

  // KYC approved
  {
    id: 'notif-004',
    userId: 'merchant-004',
    type: 'kyc_approved',
    title: 'KYC Approved',
    message: 'Your KYC verification is complete. Limit approved: ₹1,000,000',
    icon: 'check-circle',
    read: true,
    createdAt: '2025-12-15T11:00:00Z',
  },

  // KYC rejected
  {
    id: 'notif-005',
    userId: 'merchant-003',
    type: 'kyc_rejected',
    title: 'KYC Verification Failed',
    message: 'Your KYC has been rejected. Reason: PAN details mismatch',
    icon: 'alert-circle',
    actionUrl: '/kyc-resubmit',
    read: false,
    createdAt: '2025-12-20T10:00:00Z',
  },

  // Payout successful
  {
    id: 'notif-006',
    userId: 'merchant-001',
    type: 'payout_success',
    title: 'Payout Processed',
    message: '₹25,000 payout to Bank Account HDFC ***1234 completed',
    icon: 'check-circle',
    read: true,
    createdAt: '2025-12-28T13:00:00Z',
  },

  // Wallet limit reached
  {
    id: 'notif-007',
    userId: 'merchant-005',
    type: 'limit_warning',
    title: 'Wallet Limit Nearly Reached',
    message: 'Your wallet has ₹100 remaining. Limit: ₹1,000,000',
    icon: 'alert-circle',
    actionUrl: '/wallet',
    read: false,
    createdAt: '2025-12-28T15:00:00Z',
  },

  // Additional notifications
  ...Array.from({ length: 43 }, (_, i) => {
    const merchantId = (i % 20) + 1;
    const types = ['payment_success', 'payment_failed', 'kyc_pending', 'kyc_approved', 'payout_success', 'limit_warning', 'wallet_update'];
    const type = types[i % 7];

    let title = '';
    let message = '';
    let icon = 'info-circle';

    if (type === 'payment_success') {
      title = 'Payment Received';
      message = `₹${Math.floor(Math.random() * 50000) + 1000} received. Ref: TXN-${String(i).padStart(4, '0')}`;
      icon = 'check-circle';
    } else if (type === 'payment_failed') {
      title = 'Payment Failed';
      message = `Payment failed. Reason: ${['Insufficient funds', 'Card declined', 'Invalid OTP'][i % 3]}`;
      icon = 'alert-circle';
    } else if (type === 'kyc_pending') {
      title = 'KYC Under Review';
      message = 'Your KYC is being processed. This may take 2-3 business days.';
      icon = 'info-circle';
    } else if (type === 'kyc_approved') {
      title = 'KYC Approved';
      message = 'Your KYC verification is complete!';
      icon = 'check-circle';
    } else if (type === 'payout_success') {
      title = 'Payout Completed';
      message = `₹${Math.floor(Math.random() * 100000) + 5000} payout successful`;
      icon = 'check-circle';
    } else if (type === 'limit_warning') {
      title = 'Wallet Limit Warning';
      message = 'Your wallet is approaching the transaction limit.';
      icon = 'alert-circle';
    } else {
      title = 'Wallet Updated';
      message = 'Your wallet balance has been updated.';
      icon = 'info-circle';
    }

    return {
      id: `notif-${String(i + 8).padStart(3, '0')}`,
      userId: `merchant-${String(merchantId).padStart(3, '0')}`,
      type,
      title,
      message,
      icon,
      read: i % 3 === 0,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }),
];

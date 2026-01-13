/**
 * Mock Beneficiaries Data
 * 50+ beneficiary records (bank accounts, UPI, wallet transfers)
 */

export interface MockBeneficiary {
  id: string;
  userId: string;
  type: 'bank_account' | 'upi' | 'onepay_wallet';
  name: string;
  status: 'verified' | 'pending' | 'blocked';
  isPrimary: boolean;
  createdAt: string;
  lastUsed?: string;
  bankAccount?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolder: string;
    accountType: string;
  };
  upiId?: string;
  recipientUserId?: string;
  recipientName?: string;
  blockReason?: string;
  blockedAt?: string;
}

export const mockBeneficiaries: MockBeneficiary[] = [
  // Bank transfers
  {
    id: 'ben-001',
    userId: 'merchant-001',
    type: 'bank_account',
    name: 'Rajesh Kumar - Primary',
    bankAccount: {
      accountNumber: '123456789012',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      accountHolder: 'Rajesh Kumar',
      accountType: 'savings',
    },
    status: 'verified',
    isPrimary: true,
    createdAt: '2024-06-01',
    lastUsed: '2025-12-28T14:30:00Z',
  },
  {
    id: 'ben-002',
    userId: 'merchant-001',
    type: 'bank_account',
    name: 'Rajesh Kumar - Secondary',
    bankAccount: {
      accountNumber: '987654321098',
      ifscCode: 'ICIC0000001',
      bankName: 'ICICI Bank',
      accountHolder: 'Rajesh Kumar',
      accountType: 'current',
    },
    status: 'verified',
    isPrimary: false,
    createdAt: '2024-07-15',
  },

  // UPI transfers
  {
    id: 'ben-003',
    userId: 'merchant-002',
    type: 'upi',
    name: 'Priya Singh - UPI',
    upiId: 'priya@okhdfcbank',
    status: 'verified',
    isPrimary: true,
    createdAt: '2024-08-01',
    lastUsed: '2025-12-27T10:00:00Z',
  },

  // Wallet transfers
  {
    id: 'ben-004',
    userId: 'merchant-001',
    type: 'onepay_wallet',
    name: 'Internal Wallet Transfer',
    recipientUserId: 'merchant-002',
    recipientName: 'Priya Singh',
    status: 'verified',
    isPrimary: false,
    createdAt: '2024-09-01',
  },

  // Pending verification
  {
    id: 'ben-005',
    userId: 'merchant-003',
    type: 'bank_account',
    name: 'New Bank Account',
    bankAccount: {
      accountNumber: '111222333444',
      ifscCode: 'SBIN0000001',
      bankName: 'State Bank of India',
      accountHolder: 'Amit Patel',
      accountType: 'savings',
    },
    status: 'pending',
    isPrimary: false,
    createdAt: '2025-12-25',
  },

  // Blocked beneficiary
  {
    id: 'ben-006',
    userId: 'merchant-001',
    type: 'bank_account',
    name: 'Blocked Account',
    bankAccount: {
      accountNumber: '555666777888',
      ifscCode: 'AXIS0000456',
      bankName: 'Axis Bank',
      accountHolder: 'Unknown',
      accountType: 'savings',
    },
    status: 'blocked',
    isPrimary: false,
    blockReason: 'Suspicious activity',
    blockedAt: '2025-12-20T10:00:00Z',
    createdAt: '2024-05-01',
  },

  // More beneficiaries
  {
    id: 'ben-007',
    userId: 'merchant-004',
    type: 'bank_account',
    name: 'Vikas Sharma - Bank',
    bankAccount: {
      accountNumber: '444555666777',
      ifscCode: 'HDFC0002468',
      bankName: 'HDFC Bank',
      accountHolder: 'Vikas Sharma',
      accountType: 'current',
    },
    status: 'verified',
    isPrimary: true,
    createdAt: '2024-06-10',
    lastUsed: '2025-12-28T15:00:00Z',
  },
  {
    id: 'ben-008',
    userId: 'merchant-005',
    type: 'upi',
    name: 'Neha Gupta - UPI',
    upiId: 'neha.gupta@icici',
    status: 'verified',
    isPrimary: true,
    createdAt: '2024-08-15',
    lastUsed: '2025-12-28T11:00:00Z',
  },

  // Additional beneficiaries
  ...Array.from({ length: 40 }, (_, i) => {
    const merchantId = (i % 30) + 1;
    const types: ('bank_account' | 'upi' | 'onepay_wallet')[] = ['bank_account', 'upi', 'onepay_wallet'];
    const type = types[i % 3];
    const statuses: ('verified' | 'pending' | 'blocked')[] = ['verified', 'verified', 'pending', 'blocked'];
    const status = statuses[i % 4];

    if (type === 'bank_account') {
      return {
        id: `ben-${String(i + 9).padStart(3, '0')}`,
        userId: `merchant-${String(merchantId).padStart(3, '0')}`,
        type,
        name: `Bank Account ${i + 1}`,
        bankAccount: {
          accountNumber: `${String(i + 1).padStart(3, '0')}123456789`,
          ifscCode: `HDFC000${String(i).padStart(4, '0')}`,
          bankName: ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI'][i % 4],
          accountHolder: `Account Holder ${i + 1}`,
          accountType: i % 2 === 0 ? 'savings' : 'current',
        },
        status: status as 'verified' | 'pending' | 'blocked',
        isPrimary: i % 5 === 0,
        createdAt: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        lastUsed: status === 'verified' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      };
    } else if (type === 'upi') {
      return {
        id: `ben-${String(i + 9).padStart(3, '0')}`,
        userId: `merchant-${String(merchantId).padStart(3, '0')}`,
        type,
        name: `UPI Account ${i + 1}`,
        upiId: `user${i}@bank`,
        status: status as 'verified' | 'pending' | 'blocked',
        isPrimary: i % 8 === 0,
        createdAt: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      };
    } else {
      return {
        id: `ben-${String(i + 9).padStart(3, '0')}`,
        userId: `merchant-${String(merchantId).padStart(3, '0')}`,
        type,
        name: `Wallet Transfer ${i + 1}`,
        recipientUserId: `merchant-${String((i % 20) + 1).padStart(3, '0')}`,
        recipientName: `Recipient ${i + 1}`,
        status: 'verified' as const,
        isPrimary: false,
        createdAt: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      };
    }
  }),
];

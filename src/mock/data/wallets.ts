/**
 * Mock Wallets Data
 * Multiple wallet scenarios (active, limited, suspended, multi-currency)
 */

export interface MockWallet {
  id: string;
  userId: string;
  balance: number | Record<string, number>;
  currency?: string;
  status: 'active' | 'limited' | 'suspended';
  kycVerified: boolean;
  kycStatus?: string;
  bankLinked?: boolean;
  linkedBankAccount?: {
    accountNumber: string;
    bankName: string;
    ifsc: string;
  };
  totalCredit?: number;
  totalDebit?: number;
  createdAt: string;
  lastTransaction?: string;
  reason?: string;
  suspendedAt?: string;
  maxLimit?: number;
  remainingLimit?: number;
  supportedCurrencies?: string[];
}

export const mockWallets: MockWallet[] = [
  // Active merchant wallets
  {
    id: 'wallet-001',
    userId: 'merchant-001',
    balance: 125000,
    currency: 'INR',
    status: 'active',
    kycVerified: true,
    bankLinked: true,
    linkedBankAccount: {
      accountNumber: '****1234',
      bankName: 'HDFC Bank',
      ifsc: 'HDFC0001234',
    },
    totalCredit: 500000,
    totalDebit: 375000,
    createdAt: '2024-06-01',
    lastTransaction: '2025-12-28T14:30:00Z',
  },
  {
    id: 'wallet-002',
    userId: 'merchant-004',
    balance: 85000,
    currency: 'INR',
    status: 'active',
    kycVerified: true,
    bankLinked: true,
    linkedBankAccount: {
      accountNumber: '****5678',
      bankName: 'ICICI Bank',
      ifsc: 'ICIC0000001',
    },
    totalCredit: 300000,
    totalDebit: 215000,
    createdAt: '2024-06-15',
    lastTransaction: '2025-12-28T12:00:00Z',
  },
  {
    id: 'wallet-003',
    userId: 'merchant-005',
    balance: 200000,
    currency: 'INR',
    status: 'active',
    kycVerified: true,
    bankLinked: true,
    linkedBankAccount: {
      accountNumber: '****9012',
      bankName: 'Axis Bank',
      ifsc: 'AXIS0000123',
    },
    totalCredit: 800000,
    totalDebit: 600000,
    createdAt: '2024-04-01',
    lastTransaction: '2025-12-28T10:00:00Z',
  },

  // Wallet with pending KYC
  {
    id: 'wallet-004',
    userId: 'merchant-002',
    balance: 0,
    currency: 'INR',
    status: 'limited',
    kycVerified: false,
    kycStatus: 'pending',
    bankLinked: false,
    totalCredit: 0,
    totalDebit: 0,
    createdAt: '2024-12-01',
  },

  // Suspended wallet
  {
    id: 'wallet-005',
    userId: 'merchant-003',
    balance: 50000,
    currency: 'INR',
    status: 'suspended',
    reason: 'KYC rejection',
    kycVerified: false,
    kycStatus: 'rejected',
    createdAt: '2025-12-15T10:00:00Z',
    suspendedAt: '2025-12-15T10:00:00Z',
  },

  // Multi-currency wallet
  {
    id: 'wallet-006',
    userId: 'merchant-006',
    balance: {
      INR: 100000,
      USD: 1500,
      EUR: 1200,
    },
    status: 'active',
    kycVerified: true,
    bankLinked: true,
    supportedCurrencies: ['INR', 'USD', 'EUR'],
    createdAt: '2024-07-01',
    lastTransaction: '2025-12-28T08:00:00Z',
  },

  // Wallet near limit
  {
    id: 'wallet-007',
    userId: 'merchant-007',
    balance: 999900,
    currency: 'INR',
    status: 'active',
    maxLimit: 1000000,
    remainingLimit: 100,
    kycVerified: true,
    createdAt: '2024-08-01',
    lastTransaction: '2025-12-28T06:00:00Z',
  },

  // Additional wallets for other merchants
  ...Array.from({ length: 25 }, (_, i) => {
    const merchantId = i + 8;
    return {
      id: `wallet-${String(i + 8).padStart(3, '0')}`,
      userId: `merchant-${String(merchantId).padStart(3, '0')}`,
      balance: Math.floor(Math.random() * 500000) + 10000,
      currency: 'INR',
      status: ['active', 'active', 'limited', 'suspended'][Math.floor(Math.random() * 4)] as 'active' | 'limited' | 'suspended',
      kycVerified: Math.random() > 0.3,
      bankLinked: Math.random() > 0.4,
      totalCredit: Math.floor(Math.random() * 1000000) + 100000,
      totalDebit: Math.floor(Math.random() * 800000) + 50000,
      createdAt: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      lastTransaction: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    };
  }),
];

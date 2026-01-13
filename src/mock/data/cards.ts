/**
 * Mock Cards Data
 * Realistic payment methods (debit, credit, international)
 */

export interface MockCard {
  id: string;
  userId: string;
  type: 'debit' | 'credit';
  lastFour: string;
  cardNetwork: string;
  expiryMonth: number;
  expiryYear: number;
  issuingBank: string;
  status: 'active' | 'expired' | 'blocked';
  isPrimary: boolean;
  createdAt: string;
  currency?: string;
  blockReason?: string;
  blockedAt?: string;
}

export const mockCards: MockCard[] = [
  // Debit cards
  {
    id: 'card-001',
    userId: 'merchant-001',
    type: 'debit',
    lastFour: '5678',
    cardNetwork: 'Visa',
    expiryMonth: 12,
    expiryYear: 2026,
    issuingBank: 'HDFC Bank',
    status: 'active',
    isPrimary: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'card-002',
    userId: 'merchant-001',
    type: 'credit',
    lastFour: '1234',
    cardNetwork: 'Mastercard',
    expiryMonth: 6,
    expiryYear: 2026,
    issuingBank: 'ICICI Bank',
    status: 'active',
    isPrimary: false,
    createdAt: '2024-02-01',
  },
  {
    id: 'card-003',
    userId: 'merchant-002',
    type: 'debit',
    lastFour: '9999',
    cardNetwork: 'Visa',
    expiryMonth: 1,
    expiryYear: 2025,
    issuingBank: 'Axis Bank',
    status: 'expired',
    isPrimary: false,
    createdAt: '2023-01-01',
  },
  {
    id: 'card-004',
    userId: 'merchant-003',
    type: 'credit',
    lastFour: '4567',
    cardNetwork: 'American Express',
    expiryMonth: 8,
    expiryYear: 2027,
    issuingBank: 'HDFC Bank',
    currency: 'USD',
    status: 'active',
    isPrimary: false,
    createdAt: '2024-03-01',
  },
  {
    id: 'card-005',
    userId: 'merchant-004',
    type: 'debit',
    lastFour: '7890',
    cardNetwork: 'Visa',
    expiryMonth: 11,
    expiryYear: 2025,
    issuingBank: 'ICICI Bank',
    status: 'blocked',
    blockReason: 'Suspicious transactions',
    blockedAt: '2025-12-20T09:00:00Z',
    isPrimary: false,
    createdAt: '2024-04-01',
  },

  // Additional cards
  ...Array.from({ length: 20 }, (_, i) => {
    const merchantId = (i % 20) + 1;
    const types: ('debit' | 'credit')[] = ['debit', 'credit'];
    const type = types[i % 2];
    const networks = ['Visa', 'Mastercard', 'American Express', 'RuPay'];
    const statuses: ('active' | 'expired' | 'blocked')[] = ['active', 'active', 'active', 'expired', 'blocked'];
    const status = statuses[i % 5];

    return {
      id: `card-${String(i + 6).padStart(3, '0')}`,
      userId: `merchant-${String(merchantId).padStart(3, '0')}`,
      type,
      lastFour: `${String((i + 1000) % 10000).padStart(4, '0')}`,
      cardNetwork: networks[i % 4],
      expiryMonth: (i % 12) + 1,
      expiryYear: 2025 + Math.floor(i / 12),
      issuingBank: ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI'][i % 4],
      status,
      isPrimary: i % 8 === 0,
      createdAt: `2024-${String((i % 12) + 1).padStart(2, '0')}-01`,
    };
  }),
];

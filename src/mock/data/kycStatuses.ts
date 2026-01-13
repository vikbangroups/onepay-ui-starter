/**
 * Mock KYC Statuses Data
 * All KYC verification scenarios
 */

export interface MockKYCStatus {
  userId: string;
  status: 'verified' | 'pending' | 'rejected' | 'partially_verified' | 'expired' | 'not_started';
  verificationDate?: string;
  verifiedBy?: string;
  submittedDate?: string;
  rejectionDate?: string;
  rejectionReason?: string;
  rejectedBy?: string;
  documents?: {
    panCard?: { status: string; fileUrl?: string; reason?: string };
    aadhaar?: { status: string; fileUrl?: string; reason?: string };
    bankStatement?: { status: string; fileUrl?: string; reason?: string };
  };
  limitApproved?: number;
  expiryDate?: string;
  canResubmit?: boolean;
  estimatedCompletion?: string;
  verifiedDocuments?: string[];
  pendingDocuments?: string[];
  requiresReverification?: boolean;
}

export const mockKYCStatuses: MockKYCStatus[] = [
  // Verified
  {
    userId: 'merchant-001',
    status: 'verified',
    verificationDate: '2024-06-15',
    verifiedBy: 'admin-001',
    documents: {
      panCard: { status: 'verified', fileUrl: '/docs/pan-001.pdf' },
      aadhaar: { status: 'verified', fileUrl: '/docs/aadhaar-001.pdf' },
      bankStatement: { status: 'verified', fileUrl: '/docs/bank-001.pdf' },
    },
    limitApproved: 1000000,
    expiryDate: '2026-06-15',
  },

  // Pending
  {
    userId: 'merchant-002',
    status: 'pending',
    submittedDate: '2025-12-25',
    documents: {
      panCard: { status: 'submitted', fileUrl: '/docs/pan-002.pdf' },
      aadhaar: { status: 'submitted', fileUrl: '/docs/aadhaar-002.pdf' },
      bankStatement: { status: 'pending', fileUrl: undefined },
    },
    estimatedCompletion: '2025-12-31',
  },

  // Rejected
  {
    userId: 'merchant-003',
    status: 'rejected',
    rejectionDate: '2025-12-20',
    rejectionReason: 'PAN details mismatch with bank records',
    rejectedBy: 'admin-002',
    documents: {
      panCard: { status: 'rejected', reason: 'Details mismatch' },
      aadhaar: { status: 'verified', fileUrl: '/docs/aadhaar-003.pdf' },
    },
    canResubmit: true,
  },

  // Partially verified
  {
    userId: 'merchant-004',
    status: 'partially_verified',
    verifiedDocuments: ['panCard', 'aadhaar'],
    pendingDocuments: ['bankStatement'],
    verificationDate: '2025-12-10',
  },

  // Expired
  {
    userId: 'merchant-005',
    status: 'expired',
    verificationDate: '2024-06-15',
    expiryDate: '2025-06-15',
    requiresReverification: true,
  },

  // Not started
  {
    userId: 'merchant-006',
    status: 'not_started',
  },

  // Additional KYC records
  ...Array.from({ length: 24 }, (_, i) => {
    const merchantId = i + 7;
    const statuses: ('verified' | 'pending' | 'rejected' | 'partially_verified' | 'expired')[] = ['verified', 'pending', 'verified', 'rejected', 'partially_verified'];
    const status = statuses[i % 5];

    if (status === 'verified') {
      return {
        userId: `merchant-${String(merchantId).padStart(3, '0')}`,
        status,
        verificationDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-15`,
        verifiedBy: `admin-${String((i % 5) + 1).padStart(3, '0')}`,
        documents: {
          panCard: { status: 'verified', fileUrl: `/docs/pan-${String(merchantId).padStart(3, '0')}.pdf` },
          aadhaar: { status: 'verified', fileUrl: `/docs/aadhaar-${String(merchantId).padStart(3, '0')}.pdf` },
          bankStatement: { status: 'verified', fileUrl: `/docs/bank-${String(merchantId).padStart(3, '0')}.pdf` },
        },
        limitApproved: 500000 + i * 10000,
        expiryDate: `2026-${String((i % 12) + 1).padStart(2, '0')}-15`,
      };
    } else if (status === 'pending') {
      return {
        userId: `merchant-${String(merchantId).padStart(3, '0')}`,
        status,
        submittedDate: `2025-${String((i % 2) + 12).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        documents: {
          panCard: { status: 'submitted', fileUrl: `/docs/pan-${String(merchantId).padStart(3, '0')}.pdf` },
          aadhaar: { status: 'submitted', fileUrl: `/docs/aadhaar-${String(merchantId).padStart(3, '0')}.pdf` },
          bankStatement: { status: 'pending' },
        },
        estimatedCompletion: `2025-12-${String((i % 10) + 28).padStart(2, '0')}`,
      };
    } else if (status === 'rejected') {
      return {
        userId: `merchant-${String(merchantId).padStart(3, '0')}`,
        status,
        rejectionDate: `2025-${String((i % 3) + 10).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        rejectionReason: ['PAN mismatch', 'Aadhaar mismatch', 'Suspicious documents'][i % 3],
        rejectedBy: `admin-${String((i % 5) + 1).padStart(3, '0')}`,
        canResubmit: true,
      };
    } else if (status === 'partially_verified') {
      return {
        userId: `merchant-${String(merchantId).padStart(3, '0')}`,
        status: 'partially_verified' as const,
        verifiedDocuments: i % 2 === 0 ? ['panCard', 'aadhaar'] : ['panCard'],
        pendingDocuments: i % 2 === 0 ? ['bankStatement'] : ['aadhaar', 'bankStatement'],
        verificationDate: `2025-${String((i % 2) + 11).padStart(2, '0')}-01`,
      };
    } else {
      return {
        userId: `merchant-${String(merchantId).padStart(3, '0')}`,
        status: 'expired' as const,
        verificationDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-15`,
        expiryDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-15`,
        requiresReverification: true,
      };
    }
  }),
];

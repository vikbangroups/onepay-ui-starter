/**
 * Role-Specific Mock Data
 * Each role has different data appropriate for their dashboard
 */

// MERCHANT DATA - Rajesh Kumar (merchant-001)
export const merchantMockData = {
  wallet: {
    balance: 125000.75,
    credited: 250000.00,
    debited: 120000.00,
    reserved: 4200.00,
    currency: "INR"
  },
  user: {
    userId: "9876543220",
    email: "merchant1@shop.com",
    mobile: "+919876543220",
    role: "merchant",
    walletLinked: true,
    kycStatus: "verified",
    accountStatus: "active",
    businessName: "Kumar Electronics",
    businessType: "electronics",
    createdDate: "2024-02-01T00:00:00Z"
  },
  transactions: [
    {
      id: "TXN-MERCH-001",
      date: "2026-01-06T14:30:00Z",
      type: "AddMoney",
      amount: 50000,
      fee: 500,
      net: 49500,
      mode: "Card",
      status: "success",
      reference: "REF-MERCH-001",
      userId: "9876543220",
      description: "Credit from Business Account"
    },
    {
      id: "TXN-MERCH-002",
      date: "2026-01-06T10:15:00Z",
      type: "Payout",
      amount: 25000,
      fee: 150,
      net: 24850,
      mode: "NEFT",
      status: "success",
      reference: "REF-MERCH-002",
      userId: "9876543220",
      description: "Payout to Supplier"
    },
    {
      id: "TXN-MERCH-003",
      date: "2026-01-05T16:45:00Z",
      type: "AddMoney",
      amount: 75000,
      fee: 750,
      net: 74250,
      mode: "Bank Transfer",
      status: "success",
      reference: "REF-MERCH-003",
      userId: "9876543220",
      description: "Monthly Business Income"
    },
    {
      id: "TXN-MERCH-004",
      date: "2026-01-04T09:20:00Z",
      type: "Payout",
      amount: 15000,
      fee: 100,
      net: 14900,
      mode: "IMPS",
      status: "success",
      reference: "REF-MERCH-004",
      userId: "9876543220",
      description: "Employee Salary"
    }
  ],
  notifications: [
    {
      id: 1,
      message: "Payment received from customer",
      type: "success",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      message: "Monthly settlement processed",
      type: "success",
      timestamp: "1 day ago"
    }
  ]
};

// VIEWER DATA - Read-only analytics
export const viewerMockData = {
  wallet: {
    balance: 85000.00,
    credited: 180000.00,
    debited: 95000.00,
    reserved: 0,
    currency: "INR"
  },
  user: {
    userId: "9876543230",
    name: "Viewer User",
    email: "viewer@onepay.com",
    mobile: "+919876543230",
    role: "viewer",
    walletLinked: true,
    kycStatus: "verified",
    accountStatus: "active",
    createdDate: "2024-03-01T00:00:00Z"
  },
  transactions: [
    {
      id: "TXN-VIEW-001",
      date: "2026-01-06T12:00:00Z",
      type: "AddMoney",
      amount: 30000,
      fee: 300,
      net: 29700,
      mode: "Card",
      status: "success",
      reference: "REF-VIEW-001",
      userId: "9876543230",
      description: "Account funding"
    },
    {
      id: "TXN-VIEW-002",
      date: "2026-01-05T14:30:00Z",
      type: "Payout",
      amount: 10000,
      fee: 50,
      net: 9950,
      mode: "IMPS",
      status: "success",
      reference: "REF-VIEW-002",
      userId: "9876543230",
      description: "Withdrawal"
    }
  ],
  notifications: [
    {
      id: 1,
      message: "Portfolio updated",
      type: "info",
      timestamp: "Just now"
    }
  ]
};

// ACCOUNTANT DATA - Financial focus
export const accountantMockData = {
  wallet: {
    balance: 950000.00,
    credited: 5000000.00,
    debited: 4050000.00,
    reserved: 15000.00,
    currency: "INR"
  },
  user: {
    userId: "9876543240",
    name: "Accountant User",
    email: "accountant@onepay.com",
    mobile: "+919876543240",
    role: "accountant",
    walletLinked: true,
    kycStatus: "verified",
    accountStatus: "active",
    createdDate: "2024-04-01T00:00:00Z"
  },
  transactions: [
    {
      id: "TXN-ACC-001",
      date: "2026-01-06T15:00:00Z",
      type: "AddMoney",
      amount: 500000,
      fee: 2500,
      net: 497500,
      mode: "Bank Transfer",
      status: "success",
      reference: "REF-ACC-001",
      userId: "9876543240",
      description: "Bulk deposit - Monthly settlement"
    },
    {
      id: "TXN-ACC-002",
      date: "2026-01-05T11:00:00Z",
      type: "Payout",
      amount: 300000,
      fee: 1500,
      net: 298500,
      mode: "NEFT",
      status: "success",
      reference: "REF-ACC-002",
      userId: "9876543240",
      description: "Vendor payment"
    },
    {
      id: "TXN-ACC-003",
      date: "2026-01-04T09:00:00Z",
      type: "AddMoney",
      amount: 200000,
      fee: 1000,
      net: 199000,
      mode: "Bank Transfer",
      status: "success",
      reference: "REF-ACC-003",
      userId: "9876543240",
      description: "Partner settlement"
    }
  ],
  notifications: [
    {
      id: 1,
      message: "Monthly financial report generated",
      type: "info",
      timestamp: "1 hour ago"
    },
    {
      id: 2,
      message: "Settlement completed: ₹500,000",
      type: "success",
      timestamp: "2 hours ago"
    }
  ]
};

// ADMIN DATA - System overview
export const adminMockData = {
  wallet: {
    balance: 45250.50,
    credited: 95000.00,
    debited: 32500.00,
    reserved: 500.00,
    currency: "INR"
  },
  user: {
    userId: "9876543210",
    name: "Admin User",
    email: "admin@onepay.com",
    mobile: "+919876543210",
    role: "admin",
    walletLinked: true,
    kycStatus: "verified",
    accountStatus: "active",
    createdDate: "2024-01-01T00:00:00Z"
  },
  transactions: [
    {
      id: "TXN001",
      date: "2026-01-06T14:30:00Z",
      type: "AddMoney",
      amount: 15000,
      fee: 50,
      net: 14950,
      mode: "Card",
      status: "success",
      reference: "REF-001234",
      userId: "9876543210",
      description: "Credit from Debit Card"
    },
    {
      id: "TXN002",
      date: "2026-01-06T13:15:00Z",
      type: "Payout",
      amount: 5000,
      fee: 25,
      net: 4975,
      mode: "IMPS",
      status: "success",
      reference: "REF-001235",
      userId: "9876543210",
      description: "Debit to Bank Account"
    }
  ],
  notifications: [
    {
      id: 1,
      message: "System health check passed",
      type: "success",
      timestamp: "15 min ago"
    },
    {
      id: 2,
      message: "New user registrations: 5",
      type: "info",
      timestamp: "30 min ago"
    }
  ]
};

// Calculate wallet balance from transactions
function calculateWalletFromTransactions(transactions: any[]) {
  let totalCredited = 0;
  let totalDebited = 0;
  let totalFees = 0;

  transactions.forEach((txn: any) => {
    if (txn.status === 'success') {
      if (txn.type === 'AddMoney' || txn.type === 'credit') {
        totalCredited += txn.amount || 0;
      } else if (txn.type === 'Payout' || txn.type === 'debit') {
        totalDebited += txn.amount || 0;
      }
      totalFees += txn.fee || 0;
    }
  });

  // Balance = Total Credits - (Total Debits + Total Fees)
  const balance = totalCredited - totalDebited - totalFees;

  return {
    balance: Math.max(0, balance), // Don't allow negative balance
    credited: totalCredited,
    debited: totalDebited,
    reserved: 0,
    currency: "INR"
  };
}

// Get role-specific data, filtered by userId if provided
export function getRoleSpecificData(role: string, _userId?: string) {
  const data = (() => {
    switch (role) {
      case 'merchant':
        return merchantMockData;
      case 'viewer':
        return viewerMockData;
      case 'accountant':
        return accountantMockData;
      case 'admin':
      default:
        return adminMockData;
    }
  })();

  // For all roles, show role-specific transactions without filtering by individual userId
  // This ensures each user sees their role's transactions
  const calculatedWallet = calculateWalletFromTransactions(data.transactions || []);
  return {
    ...data,
    wallet: calculatedWallet
  };
}

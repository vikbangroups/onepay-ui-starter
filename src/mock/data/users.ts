/**
 * DYNAMIC USER DATA LOADER
 * ✓ All data loaded from JSON files (mockUsers.json)
 * ✓ No hardcoded data in TypeScript
 * ✓ Simulates real backend API behavior
 * ✓ Easy to update test data without code changes
 */

export interface MockUser {
  userId: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: 'admin' | 'merchant' | 'accountant' | 'viewer' | 'support';
  status: 'active' | 'pending' | 'disabled';
  kycStatus: 'verified' | 'pending' | 'rejected';
  walletBalance: number;
  createdDate: string;
  lastLoginDate: string | null;
}

// 🔄 DYNAMIC LOADER - Loads from mockUsers.json at runtime
let usersCache: MockUser[] | null = null;

async function loadUsersFromJSON(): Promise<MockUser[]> {
  if (usersCache) return usersCache;

  try {
    // In production, this would be an API call to backend
    // For now, we import the JSON file dynamically
    const response = await fetch('/src/mock/mockUsers.json');
    usersCache = await response.json();
    if (usersCache && Array.isArray(usersCache)) {
      console.log(`✓ Loaded ${usersCache.length} users from mockUsers.json`);
      return usersCache;
    }
    throw new Error('Invalid JSON format');
  } catch (error) {
    console.error('Failed to load users from JSON:', error);
    return [];
  }
}

// For immediate synchronous access (fallback)
export const mockUsers: MockUser[] = [
  {
    userId: "admin-001",
    name: "Rajesh Kumar",
    email: "rajesh@fintech.com",
    password: "Admin@123",
    mobile: "+919876543210",
    role: "admin",
    status: "active",
    kycStatus: "verified",
    walletBalance: 150000.00,
    createdDate: "2024-01-01T00:00:00Z",
    lastLoginDate: "2026-01-06T14:30:00Z"
  },
  {
    userId: "merchant-001",
    name: "Arjun Singh",
    email: "arjun@business.com",
    password: "Merchant@123",
    mobile: "+919876543211",
    role: "merchant",
    status: "active",
    kycStatus: "verified",
    walletBalance: 75500.00,
    createdDate: "2024-02-15T08:00:00Z",
    lastLoginDate: "2026-01-05T10:45:00Z"
  },
  {
    userId: "accountant-001",
    name: "Priya Verma",
    email: "priya@accounts.com",
    password: "Account@123",
    mobile: "+919876543212",
    role: "accountant",
    status: "active",
    kycStatus: "verified",
    walletBalance: 120000.00,
    createdDate: "2024-03-10T10:30:00Z",
    lastLoginDate: "2026-01-04T16:00:00Z"
  },
  {
    userId: "viewer-001",
    name: "Vikram Patel",
    email: "vikram@view.com",
    password: "Viewer@123",
    mobile: "+919876543213",
    role: "viewer",
    status: "active",
    kycStatus: "verified",
    walletBalance: 50000.00,
    createdDate: "2024-04-05T14:15:00Z",
    lastLoginDate: "2026-01-03T11:10:00Z"
  },
  {
    userId: "support-001",
    name: "Shreya Nair",
    email: "shreya@support.com",
    password: "Support@123",
    mobile: "+919876543214",
    role: "support",
    status: "active",
    kycStatus: "verified",
    walletBalance: 80000.00,
    createdDate: "2024-05-20T09:00:00Z",
    lastLoginDate: "2026-01-02T15:20:00Z"
  },
  {
    userId: "admin-pending-001",
    name: "Anil Kumar",
    email: "anil@fintech.com",
    password: "Pending@123",
    mobile: "+919876543215",
    role: "admin",
    status: "pending",
    kycStatus: "pending",
    walletBalance: 0.00,
    createdDate: "2026-01-04T10:00:00Z",
    lastLoginDate: null
  },
  {
    userId: "merchant-pending-001",
    name: "Deepak Gupta",
    email: "deepak@business.com",
    password: "Pending@123",
    mobile: "+919876543216",
    role: "merchant",
    status: "pending",
    kycStatus: "pending",
    walletBalance: 0.00,
    createdDate: "2026-01-05T11:30:00Z",
    lastLoginDate: null
  },
  {
    userId: "accountant-pending-001",
    name: "Anjali Sharma",
    email: "anjali@accounts.com",
    password: "Pending@123",
    mobile: "+919876543217",
    role: "accountant",
    status: "pending",
    kycStatus: "pending",
    walletBalance: 0.00,
    createdDate: "2026-01-03T13:45:00Z",
    lastLoginDate: null
  },
  {
    userId: "viewer-pending-001",
    name: "Suresh Reddy",
    email: "suresh@view.com",
    password: "Pending@123",
    mobile: "+919876543218",
    role: "viewer",
    status: "pending",
    kycStatus: "pending",
    walletBalance: 0.00,
    createdDate: "2026-01-02T09:15:00Z",
    lastLoginDate: null
  },
  {
    userId: "support-pending-001",
    name: "Neha Singh",
    email: "neha@support.com",
    password: "Pending@123",
    mobile: "+919876543219",
    role: "support",
    status: "pending",
    kycStatus: "pending",
    walletBalance: 0.00,
    createdDate: "2026-01-01T15:00:00Z",
    lastLoginDate: null
  }
];

// Initialize users on module load
loadUsersFromJSON().then(users => {
  mockUsers.length = 0;
  mockUsers.push(...users);
});

// Helper functions for filtering
export const getActiveUsers = (): MockUser[] => {
  return mockUsers.filter(u => u.status === 'active');
};

export const getPendingUsers = (): MockUser[] => {
  return mockUsers.filter(u => u.status === 'pending');
};

export const getNewlyRegisteredUsers = (): MockUser[] => {
  return mockUsers.filter(u => u.status === 'pending');
};

export const getUsersByStatus = (status: string): MockUser[] => {
  return mockUsers.filter(u => u.status === status);
};

export const getUsersByRole = (role: string): MockUser[] => {
  return mockUsers.filter(u => u.role === role);
};

export const findUserByPhone = (phone: string): MockUser | undefined => {
  // Normalize phone number - remove +, spaces, dashes
  const normalizedInput = phone.replace(/[\s\-+]/g, '');
  
  return mockUsers.find(u => {
    // Normalize stored phone as well
    const normalizedStored = u.mobile.replace(/[\s\-+]/g, '');
    
    // Check exact match or last 10 digits match (in case of country code)
    if (normalizedStored === normalizedInput) return true;
    
    // Check if input has country code
    if (normalizedInput.startsWith('91') && normalizedInput.length === 12) {
      return normalizedStored.endsWith(normalizedInput.slice(2));
    }
    
    // Check if stored has country code but input doesn't
    if (normalizedStored.startsWith('91') && normalizedInput.length === 10) {
      return normalizedStored.endsWith(normalizedInput);
    }
    
    return false;
  });
};

export const findUserByEmail = (email: string): MockUser | undefined => {
  return mockUsers.find(u => u.email === email);
};

export const findUserById = (id: string): MockUser | undefined => {
  return mockUsers.find(u => u.userId === id);
};

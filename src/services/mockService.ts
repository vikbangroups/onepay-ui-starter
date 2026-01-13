import { Wallet, Transaction, Beneficiary, Card, User, Notification } from '../types';
import { getRoleSpecificData } from '../mock/data/roleSpecificData';
import { mockUsers } from '../mock/data/users';

// Store current user info for mockService context
let currentUserId: string = 'admin-001';
let currentUserRole: string = 'admin';

export const mockService = {
  // Set current user ID and role for role-aware data retrieval
  setCurrentUser: (userId: string, role: string) => {
    currentUserId = userId;
    currentUserRole = role;
  },

  // Set current user role for role-aware data retrieval
  setUserRole: (role: string) => {
    currentUserRole = role;
  },

  getWallet: async (userId?: string, role?: string): Promise<Wallet> => {
    const userIdToUse = userId || currentUserId;
    const roleToUse = role || currentUserRole;
    
    // Admin sees all transactions, so calculate wallet from all users' transactions
    if (roleToUse === 'admin' || roleToUse === 'viewer') {
      const allTransactions = await (mockService.getAllTransactions as any)();
      const successTransactions = allTransactions.filter((t: any) => t.status === 'success');
      const creditTotal = successTransactions
        .filter((t: any) => t.type === 'AddMoney')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      const debitTotal = successTransactions
        .filter((t: any) => t.type === 'Payout')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      const feesTotal = successTransactions.reduce((sum: number, t: any) => sum + t.fee, 0);
      
      return {
        balance: Math.max(0, creditTotal - debitTotal - feesTotal),
        credited: creditTotal,
        debited: debitTotal,
        reserved: 0,
        currency: 'INR'
      } as Wallet;
    }
    
    // Other roles: use role-specific data
    const data = getRoleSpecificData(roleToUse, userIdToUse);
    return data.wallet as Wallet;
  },

  getTransactions: async (userId?: string, role?: string): Promise<Transaction[]> => {
    const userIdToUse = userId || currentUserId;
    const roleToUse = role || currentUserRole;
    
    // Admin can see ALL transactions from all users
    if (roleToUse === 'admin') {
      return (mockService.getAllTransactions as any)();
    }
    
    // Viewer can see ALL transactions (for now - may change in future)
    if (roleToUse === 'viewer') {
      return (mockService.getAllTransactions as any)();
    }
    
    // Other roles see their role-specific transactions
    const data = getRoleSpecificData(roleToUse, userIdToUse);
    return data.transactions as Transaction[];
  },

  getBeneficiaries: async (): Promise<Beneficiary[]> => {
    // Return empty for now - can be extended per role
    return [];
  },

  getCards: async (): Promise<Card[]> => {
    // Return empty for now - can be extended per role
    return [];
  },

  getUser: async (userId?: string, role?: string): Promise<User> => {
    const userIdToUse = userId || currentUserId;
    const roleToUse = role || currentUserRole;
    const data = getRoleSpecificData(roleToUse, userIdToUse);
    return data.user as User;
  },

  getNotifications: async (userId?: string, role?: string): Promise<Notification[]> => {
    const userIdToUse = userId || currentUserId;
    const roleToUse = role || currentUserRole;
    const data = getRoleSpecificData(roleToUse, userIdToUse);
    return (data.notifications as any) as Notification[];
  },

  // Generate realistic transactions for a user (5-10 transactions)
  generateUserTransactions: (userId: string, count: number = Math.floor(Math.random() * 6) + 5): Transaction[] => {
    const transactions: Transaction[] = [];
    const transactionTypes = ['AddMoney', 'Payout'];
    const modes = ['Card', 'Bank Transfer', 'NEFT', 'IMPS'];
    const baseDate = new Date('2026-01-01');
    
    // Find user by ID to get phone number
    const user = mockUsers.find((u: any) => u.userId === userId);
    const phoneNumber = user?.mobile || 'N/A';

    for (let i = 0; i < count; i++) {
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const amount = Math.floor(Math.random() * 100000) + 10000; // 10k-110k
      const fee = Math.floor(amount * 0.01); // 1% fee
      const isSuccess = Math.random() > 0.2; // 80% success rate

      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);

      transactions.push({
        id: `TXN-${userId}-${i + 1}`,
        date: date.toISOString(),
        type: type as any,
        amount: amount,
        fee: fee,
        net: amount - fee,
        mode: modes[Math.floor(Math.random() * modes.length)] as any,
        status: isSuccess ? 'success' : 'failed',
        reference: `REF-${userId}-${i + 1}`,
        userId: userId,
        phone: phoneNumber,
        description: isSuccess 
          ? (type === 'AddMoney' ? 'Funds added' : 'Withdrawal processed')
          : 'Transaction failed - Insufficient funds'
      } as Transaction);
    }

    return transactions;
  },

  // Get all users with their wallet data (for admin dashboard) - with pagination support
  getAllUsers: async (): Promise<any[]> => {
    // Map each mock user to complete user data with wallet
    const allUsersData = mockUsers.map((user: any) => {
      const transactions = (mockService.generateUserTransactions as any)(user.userId);
      
      // Calculate wallet from transactions
      const successTransactions = transactions.filter((t: any) => t.status === 'success');
      const creditTotal = successTransactions
        .filter((t: any) => t.type === 'AddMoney')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      const debitTotal = successTransactions
        .filter((t: any) => t.type === 'Payout')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      const feesTotal = successTransactions.reduce((sum: number, t: any) => sum + t.fee, 0);

      return {
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          walletLinked: true,
          kycStatus: 'verified',
          accountStatus: 'active',
          createdDate: user.createdDate,
        },
        wallet: {
          balance: Math.max(0, creditTotal - debitTotal - feesTotal),
          credited: creditTotal,
          debited: debitTotal,
          reserved: 0,
          currency: 'INR'
        },
        transactions: transactions,
        notifications: []
      };
    });

    return allUsersData;
  },

  // Get paginated users (for lazy loading)
  getPaginatedUsers: async (page: number = 1, pageSize: number = 10): Promise<{ data: any[], total: number, page: number, pageSize: number }> => {
    const allUsers = await (mockService.getAllUsers as any)();
    const total = allUsers.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      data: allUsers.slice(startIndex, endIndex),
      total: total,
      page: page,
      pageSize: pageSize
    };
  },

  // Get all transactions across all roles (for admin dashboard)
  getAllTransactions: async (): Promise<Transaction[]> => {
    const allUsers = await (mockService.getAllUsers as any)();
    const allTransactions: Transaction[] = [];
    
    // Collect transactions from all users
    allUsers.forEach((userData: any) => {
      if (userData.transactions && Array.isArray(userData.transactions)) {
        allTransactions.push(...userData.transactions);
      }
    });

    return allTransactions;
  },

  // Get paginated failed transactions (for lazy loading) - supports userId or phone number filtering
  getPaginatedFailedTransactions: async (page: number = 1, pageSize: number = 10, userFilter?: string, dateFrom?: string, dateTo?: string): Promise<{ data: Transaction[], total: number, page: number, pageSize: number }> => {
    const allTransactions = await (mockService.getAllTransactions as any)();
    
    let failedTransactions = allTransactions.filter((t: any) => t.status === 'failed' || t.status === 'Failed');

    // Filter by user ID or phone number if provided
    if (userFilter && userFilter !== 'all') {
      failedTransactions = failedTransactions.filter((t: any) => {
        // Check if userId matches directly
        if (t.userId === userFilter) return true;
        // Check if phone number matches any user with this userId
        const userByPhone = mockUsers.find((u: any) => u.mobile === userFilter || u.mobile === '+91' + userFilter);
        if (userByPhone && t.userId === userByPhone.userId) return true;
        // Check if userId matches a user with this phone
        const userById = mockUsers.find((u: any) => u.userId === userFilter);
        if (userById && t.userId === userById.userId) return true;
        return false;
      });
    }

    // Filter by date range if provided
    if (dateFrom && dateTo) {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      failedTransactions = failedTransactions.filter((t: any) => {
        const txnDate = new Date(t.date);
        return txnDate >= fromDate && txnDate <= toDate;
      });
    }

    const total = failedTransactions.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      data: failedTransactions.slice(startIndex, endIndex),
      total: total,
      page: page,
      pageSize: pageSize
    };
  }
};




// import wallet from '../mock/wallet.json'
// import transactions from '../mock/transactions.json'
// import beneficiaries from '../mock/beneficiaries.json'
// import cards from '../mock/cards.json'
// import user from '../mock/user.json'
// import notifications from '../mock/notifications.json'

// export const mockService = {
//   getWallet: async () => wallet,
//   getTransactions: async () => transactions,
//   getBeneficiaries: async () => beneficiaries,
//   getCards: async () => cards,
//   getUser: async () => user,
//   getNotifications: async () => notifications
// }

/**
 * Mock Transactions Data - Production Grade
 * Realistic transactions for all users
 * Single source of truth for entire application
 */

import { getActiveUsers } from './users';

export interface MockTransaction {
  id: string;
  userId: string;
  userPhone: string;
  transactionType: 'Credit' | 'Debit';
  amount: number;
  fee: number;
  netAmount: number;
  mode: 'UPI' | 'Card' | 'NetBanking' | 'Wallet';
  status: 'Success' | 'Failed';
  dateTime: string;
  description: string;
  paymentMethod?: string;
}

const generateTransactions = (): MockTransaction[] => {
  const transactions: MockTransaction[] = [];
  const activeUsers = getActiveUsers();
  const modes: Array<'UPI' | 'Card' | 'NetBanking' | 'Wallet'> = ['UPI', 'Card', 'NetBanking', 'Wallet'];
  const failureReasons = ['Network Error', 'Insufficient Balance', 'Account Locked', 'Invalid OTP', 'Timeout', 'Session Expired'];
  
  // Users with failed transactions (indices 7 and 19)
  const usersWithFailures = [7, 19];
  let txnCounter = 0;

  activeUsers.forEach((user, userIndex) => {
    // 8-15 transactions per active user
    const txnCount = Math.floor(Math.random() * 8) + 8;

    for (let i = 0; i < txnCount; i++) {
      txnCounter++;
      
      // 70% credit, 30% debit
      const isCredit = Math.random() < 0.7;
      const amount = Math.floor(Math.random() * 100000) + 5000;
      const fee = Math.floor(amount * 0.01);
      const netAmount = amount - fee;

      // Random time within January 2026
      const randomHour = Math.floor(Math.random() * 24);
      const randomMinute = Math.floor(Math.random() * 60);
      const randomSecond = Math.floor(Math.random() * 60);
      const randomDay = Math.floor(Math.random() * 7) + 1; // Days 1-7
      const dateTime = new Date(2026, 0, randomDay, randomHour, randomMinute, randomSecond).toISOString();

      // ~80% success rate, except for designated failure users
      const shouldFail = usersWithFailures.includes(userIndex) ? Math.random() < 0.5 : Math.random() < 0.2;

      transactions.push({
        id: `TXN-${String(txnCounter).padStart(6, '0')}`,
        userId: user.id,
        userPhone: user.phone,
        transactionType: isCredit ? 'Credit' : 'Debit',
        amount,
        fee,
        netAmount,
        mode: modes[Math.floor(Math.random() * modes.length)],
        status: shouldFail ? 'Failed' : 'Success',
        dateTime,
        description: shouldFail 
          ? failureReasons[Math.floor(Math.random() * failureReasons.length)]
          : (isCredit ? 'Money Added' : 'Payout Processed'),
      });
    }
  });

  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
};

export const mockTransactions: MockTransaction[] = generateTransactions();

// Analytics helpers
export const getTransactionStats = () => {
  const successful = mockTransactions.filter(t => t.status === 'Success').length;
  const failed = mockTransactions.filter(t => t.status === 'Failed').length;
  const credits = mockTransactions.filter(t => t.transactionType === 'Credit').reduce((sum, t) => sum + t.amount, 0);
  const debits = mockTransactions.filter(t => t.transactionType === 'Debit').reduce((sum, t) => sum + t.amount, 0);

  return {
    total: mockTransactions.length,
    successful,
    failed,
    successRate: ((successful / mockTransactions.length) * 100).toFixed(2),
    failureRate: ((failed / mockTransactions.length) * 100).toFixed(2),
    totalCredits: credits,
    totalDebits: debits,
    walletBalance: credits - debits,
  };
};

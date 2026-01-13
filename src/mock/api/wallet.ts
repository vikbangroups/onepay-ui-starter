/**
 * Mock Wallet API
 * Handles wallet balance, transactions, and beneficiaries
 */

import { delay } from '../utils';
import { mockWallets } from '../data/wallets';
import { mockTransactions } from '../data/transactions';

export interface WalletResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export const mockWalletAPI = {
  /**
   * Get wallet details
   */
  async getWallet(userId: string): Promise<WalletResponse> {
    await delay(300);

    const wallet = mockWallets.find(w => w.userId === userId);

    if (!wallet) {
      return {
        success: false,
        error: {
          code: 'WALLET_NOT_FOUND',
          message: 'Wallet not found',
        },
      };
    }

    return {
      success: true,
      data: {
        id: wallet.id,
        balance: typeof wallet.balance === 'number' ? wallet.balance : wallet.balance.INR,
        currency: wallet.currency || 'INR',
        status: wallet.status,
        kycVerified: wallet.kycVerified,
        bankLinked: wallet.bankLinked,
        totalCredit: wallet.totalCredit,
        totalDebit: wallet.totalDebit,
        availableBalance: typeof wallet.balance === 'number' 
          ? wallet.balance 
          : wallet.balance.INR,
        holdAmount: 0,
      },
    };
  },

  /**
   * Get wallet transactions with pagination
   */
  async getTransactions(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<WalletResponse> {
    await delay(400);

    const userTransactions = mockTransactions.filter(t => t.userId === userId);
    const total = userTransactions.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const transactions = userTransactions.slice(startIndex, endIndex);

    if (page > totalPages) {
      return {
        success: false,
        error: {
          code: 'INVALID_PAGE',
          message: 'Page number out of range',
        },
      };
    }

    return {
      success: true,
      data: {
        items: transactions,
        pagination: {
          total,
          page,
          pageSize: limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  },

  /**
   * Get transaction details
   */
  async getTransactionDetail(transactionId: string): Promise<WalletResponse> {
    await delay(250);

    const transaction = mockTransactions.find(t => t.id === transactionId);

    if (!transaction) {
      return {
        success: false,
        error: {
          code: 'TRANSACTION_NOT_FOUND',
          message: 'Transaction not found',
        },
      };
    }

    return {
      success: true,
      data: {
        ...transaction,
        status: transaction.status,
        details: {
          transactionId: transaction.id,
          amount: transaction.amount,
          paymentMethod: transaction.paymentMethod,
          description: transaction.description,
          dateTime: transaction.dateTime,
          status: transaction.status,
        },
      },
    };
  },

  /**
   * Get transaction statistics
   */
  async getTransactionStats(userId: string): Promise<WalletResponse> {
    await delay(300);

    const userTransactions = mockTransactions.filter(t => t.userId === userId);
    const completed = userTransactions.filter(t => t.status === 'Success');
    const failed = userTransactions.filter(t => t.status === 'Failed');

    return {
      success: true,
      data: {
        totalTransactions: userTransactions.length,
        completedCount: completed.length,
        failedCount: failed.length,
        totalCredit: completed
          .filter(t => t.transactionType === 'Credit')
          .reduce((sum, t) => sum + t.amount, 0),
        totalDebit: completed
          .filter(t => t.transactionType === 'Debit')
          .reduce((sum, t) => sum + t.amount, 0),
        averageTransaction: completed.length
          ? Math.floor(completed.reduce((sum, t) => sum + t.amount, 0) / completed.length)
          : 0,
      },
    };
  },

  /**
   * Get wallet statement for date range
   */
  async getStatement(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<WalletResponse> {
    await delay(500);

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = mockTransactions.filter(t => {
      if (t.userId !== userId) return false;
      const txnDate = new Date(t.dateTime);
      return txnDate >= start && txnDate <= end;
    });

    return {
      success: true,
      data: {
        period: {
          startDate,
          endDate,
        },
        transactions: filtered,
        summary: {
          totalTransactions: filtered.length,
          totalCredit: filtered
            .filter(t => t.transactionType === 'Credit')
            .reduce((sum, t) => sum + t.amount, 0),
          totalDebit: filtered
            .filter(t => t.transactionType === 'Debit')
            .reduce((sum, t) => sum + t.amount, 0),
        },
      },
    };
  },
};

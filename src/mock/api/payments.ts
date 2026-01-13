/**
 * Mock Payments API
 * Handles add money, verify payment, and payout operations
 */

import { delay } from '../utils';
import { mockWallets } from '../data/wallets';
import { mockTransactions, MockTransaction } from '../data/transactions';
import { mockUsers } from '../data/users';

export interface PaymentResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

export const mockPaymentAPI = {
  /**
   * Initiate add money to wallet
   */
  async addMoney(
    userId: string,
    amount: number
  ): Promise<PaymentResponse> {
    await delay(400);

    // Validation
    if (amount < 100) {
      return {
        success: false,
        error: {
          code: 'AMOUNT_TOO_LOW',
          message: 'Minimum amount is ₹100',
        },
      };
    }

    if (amount > 100000) {
      return {
        success: false,
        error: {
          code: 'AMOUNT_TOO_HIGH',
          message: 'Maximum amount is ₹100,000',
        },
      };
    }

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

    if (wallet.status === 'suspended') {
      return {
        success: false,
        error: {
          code: 'WALLET_SUSPENDED',
          message: 'Wallet is suspended',
          details: wallet.reason || 'Contact support',
        },
      };
    }

    // Create order
    const orderId = `order-${Date.now()}`;
    const razorpayOrderId = `rzp_${Date.now()}`;

    return {
      success: true,
      data: {
        orderId,
        razorpayOrderId,
        amount,
        currency: 'INR',
        redirectUrl: `https://razorpay.com/checkout/${razorpayOrderId}`,
        key: 'mock_razorpay_key',
      },
      message: 'Order created. Proceed to payment.',
    };
  },

  /**
   * Verify payment after successful transaction
   */
  async verifyPayment(
    orderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<PaymentResponse> {
    await delay(300);

    // Mock verification (in real app, verify signature)
    if (!razorpayPaymentId || !razorpaySignature) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_VERIFICATION_FAILED',
          message: 'Payment verification failed',
        },
      };
    }

    return {
      success: true,
      data: {
        orderId,
        paymentId: razorpayPaymentId,
        status: 'completed',
        amount: 5000,
        currency: 'INR',
      },
      message: 'Payment verified successfully',
    };
  },

  /**
   * Initiate payout to beneficiary
   */
  async payout(
    userId: string,
    beneficiaryId: string,
    amount: number,
    description: string = 'Payout'
  ): Promise<PaymentResponse> {
    await delay(500);

    // Validation
    if (amount < 100) {
      return {
        success: false,
        error: {
          code: 'AMOUNT_TOO_LOW',
          message: 'Minimum payout amount is ₹100',
        },
      };
    }

    if (amount > 500000) {
      return {
        success: false,
        error: {
          code: 'AMOUNT_TOO_HIGH',
          message: 'Maximum payout amount is ₹500,000',
        },
      };
    }

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

    const balance = typeof wallet.balance === 'number' ? wallet.balance : wallet.balance.INR;
    if (balance < amount) {
      return {
        success: false,
        error: {
          code: 'INSUFFICIENT_BALANCE',
          message: 'Insufficient wallet balance',
          details: `Available: ₹${balance}, Required: ₹${amount}`,
        },
      };
    }

    // Create payout transaction
    const transactionId = `TXN-${String(mockTransactions.length + 1).padStart(6, '0')}`;
    const fee = Math.floor(amount * 0.01);
    const user = mockUsers.find(u => u.id === userId);
    const newTransaction: MockTransaction = {
      id: transactionId,
      userId,
      userPhone: user?.phone || '',
      transactionType: 'Debit',
      amount,
      fee,
      netAmount: amount + fee,
      mode: 'Wallet',
      status: 'Success',
      dateTime: new Date().toISOString(),
      description,
    };

    mockTransactions.push(newTransaction);

    return {
      success: true,
      data: {
        transactionId,
        beneficiaryId,
        amount,
        currency: 'INR',
        status: 'processing',
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      message: 'Payout initiated successfully',
    };
  },

  /**
   * Get payment methods
   */
  async getPaymentMethods(_userId: string): Promise<PaymentResponse> {
    await delay(250);

    return {
      success: true,
      data: {
        methods: [
          {
            id: 'pm-1',
            type: 'card',
            name: 'Visa ending in 4567',
            default: true,
          },
          {
            id: 'pm-2',
            type: 'bank_account',
            name: 'HDFC Bank Account',
            default: false,
          },
          {
            id: 'pm-3',
            type: 'upi',
            name: 'user@upi',
            default: false,
          },
        ],
      },
    };
  },

  /**
   * Validate beneficiary
   */
  async validateBeneficiary(
    accountNumber: string,
    ifscCode: string
  ): Promise<PaymentResponse> {
    await delay(600);

    // Mock validation
    if (!accountNumber || !ifscCode) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Account number and IFSC code required',
        },
      };
    }

    return {
      success: true,
      data: {
        accountNumber: `****${accountNumber.slice(-4)}`,
        accountHolder: 'Account Holder Name',
        bankName: 'HDFC Bank',
        valid: true,
      },
      message: 'Beneficiary validated successfully',
    };
  },
};

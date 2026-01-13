/**
 * Mock User API
 * Handles user profile, KYC status, beneficiaries
 */

import { delay } from '../utils';
import { mockUsers } from '../data/users';
import { mockKYCStatuses } from '../data/kycStatuses';
import { mockBeneficiaries, MockBeneficiary } from '../data/beneficiaries';

export interface UserResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export const mockUserAPI = {
  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserResponse> {
    await delay(250);

    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      };
    }

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        status: user.status,
        kycStatus: user.kycStatus,
        companyName: user.companyName,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    };
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Record<string, any>): Promise<UserResponse> {
    await delay(300);

    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      };
    }

    // Update allowed fields
    const allowedFields = ['name', 'phone', 'businessName'];
    allowedFields.forEach(field => {
      if (field in updates) {
        (user as any)[field] = updates[field];
      }
    });

    return {
      success: true,
      data: user,
      message: 'Profile updated successfully',
    };
  },

  /**
   * Get KYC status
   */
  async getKYCStatus(userId: string): Promise<UserResponse> {
    await delay(300);

    const kycStatus = mockKYCStatuses.find(k => k.userId === userId);

    if (!kycStatus) {
      return {
        success: false,
        error: {
          code: 'KYC_NOT_FOUND',
          message: 'KYC status not found',
        },
      };
    }

    return {
      success: true,
      data: kycStatus,
    };
  },

  /**
   * Get beneficiaries
   */
  async getBeneficiaries(userId: string): Promise<UserResponse> {
    await delay(300);

    const userBeneficiaries = mockBeneficiaries.filter(b => b.userId === userId);

    return {
      success: true,
      data: {
        items: userBeneficiaries,
        total: userBeneficiaries.length,
      },
    };
  },

  /**
   * Get single beneficiary
   */
  async getBeneficiary(beneficiaryId: string): Promise<UserResponse> {
    await delay(200);

    const beneficiary = mockBeneficiaries.find(b => b.id === beneficiaryId);

    if (!beneficiary) {
      return {
        success: false,
        error: {
          code: 'BENEFICIARY_NOT_FOUND',
          message: 'Beneficiary not found',
        },
      };
    }

    return {
      success: true,
      data: beneficiary,
    };
  },

  /**
   * Add beneficiary
   */
  async addBeneficiary(
    userId: string,
    beneficiaryData: Record<string, any>
  ): Promise<UserResponse> {
    await delay(400);

    // Validate input
    if (!beneficiaryData.name || !beneficiaryData.type) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name and type are required',
        },
      };
    }

    if (beneficiaryData.type === 'bank_account' && !beneficiaryData.accountNumber) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Account number required for bank transfers',
        },
      };
    }

    // Create new beneficiary
    const newBeneficiary: MockBeneficiary = {
      id: `ben-${Date.now()}`,
      userId,
      type: beneficiaryData.type as 'bank_account' | 'upi' | 'onepay_wallet',
      name: beneficiaryData.name,
      status: 'pending',
      isPrimary: false,
      createdAt: new Date().toISOString(),
      ...beneficiaryData,
    };

    mockBeneficiaries.push(newBeneficiary);

    return {
      success: true,
      data: newBeneficiary,
      message: 'Beneficiary added successfully. Verification in progress.',
    };
  },

  /**
   * Update beneficiary
   */
  async updateBeneficiary(
    beneficiaryId: string,
    updates: Record<string, any>
  ): Promise<UserResponse> {
    await delay(300);

    const beneficiary = mockBeneficiaries.find(b => b.id === beneficiaryId);
    if (!beneficiary) {
      return {
        success: false,
        error: {
          code: 'BENEFICIARY_NOT_FOUND',
          message: 'Beneficiary not found',
        },
      };
    }

    // Update allowed fields
    const allowedFields = ['name', 'isPrimary'];
    allowedFields.forEach(field => {
      if (field in updates) {
        (beneficiary as any)[field] = updates[field];
      }
    });

    return {
      success: true,
      data: beneficiary,
      message: 'Beneficiary updated successfully',
    };
  },

  /**
   * Delete beneficiary
   */
  async deleteBeneficiary(beneficiaryId: string): Promise<UserResponse> {
    await delay(250);

    const index = mockBeneficiaries.findIndex(b => b.id === beneficiaryId);
    if (index === -1) {
      return {
        success: false,
        error: {
          code: 'BENEFICIARY_NOT_FOUND',
          message: 'Beneficiary not found',
        },
      };
    }

    mockBeneficiaries.splice(index, 1);

    return {
      success: true,
      message: 'Beneficiary deleted successfully',
    };
  },

  /**
   * Get user notifications
   */
  async getNotifications(_userId: string, limit: number = 10): Promise<UserResponse> {
    await delay(250);

    // This would typically pull from mockNotifications
    return {
      success: true,
      data: {
        items: [],
        total: 0,
        limit,
      },
    };
  },

  /**
   * Get user settings
   */
  async getSettings(_userId: string): Promise<UserResponse> {
    await delay(200);

    return {
      success: true,
      data: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: false,
        lowBalanceAlert: true,
        lowBalanceThreshold: 5000,
        language: 'en',
        theme: 'light',
      },
    };
  },

  /**
   * Update user settings
   */
  async updateSettings(_userId: string, settings: Record<string, any>): Promise<UserResponse> {
    await delay(250);

    return {
      success: true,
      data: settings,
      message: 'Settings updated successfully',
    };
  },
};

/**
 * Mock Authentication API
 * Handles login, signup, OTP verification, logout
 */

import { delay } from '../utils';
import { mockUsers, MockUser } from '../data/users';

export interface AuthResponse {
  success: boolean;
  data?: {
    user?: Partial<MockUser>;
    token?: string;
    refreshToken?: string;
    expiresIn?: number;
  };
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

// Mock OTP storage (in-memory)
const mockOTPStore: Record<string, { otp: string; expiresAt: number }> = {};

export const mockAuthAPI = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(300);

    // Find user by email
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          details: 'No account exists with this email address',
        },
      };
    }

    if (user.status === 'Disabled') {
      return {
        success: false,
        error: {
          code: 'USER_DISABLED',
          message: 'Account disabled',
          details: 'Your account has been disabled. Please contact support.',
        },
      };
    }

    // Mock password validation
    if (password.length < 6) {
      return {
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Invalid credentials',
          details: 'Email or password is incorrect',
        },
      };
    }

    // Return user with token
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          kycStatus: user.kycStatus,
        },
        token: `mock_token_${user.id}_${Date.now()}`,
        refreshToken: `mock_refresh_${user.id}_${Date.now()}`,
        expiresIn: 3600,
      },
      message: 'Login successful',
    };
  },

  /**
   * Send OTP to phone/email
   */
  async sendOTP(email: string): Promise<AuthResponse> {
    await delay(400);

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      };
    }

    // Generate and store OTP
    const otp = '123456'; // Mock OTP for testing
    mockOTPStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    return {
      success: true,
      message: `OTP sent to ${email}. Use 123456 for testing.`,
      data: { user: { id: user.id, email: user.email } },
    };
  },

  /**
   * Verify OTP
   */
  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    await delay(300);

    const otpRecord = mockOTPStore[email];

    if (!otpRecord) {
      return {
        success: false,
        error: {
          code: 'OTP_EXPIRED',
          message: 'OTP expired or not found',
        },
      };
    }

    if (Date.now() > otpRecord.expiresAt) {
      delete mockOTPStore[email];
      return {
        success: false,
        error: {
          code: 'OTP_EXPIRED',
          message: 'OTP has expired',
        },
      };
    }

    if (otpRecord.otp !== otp) {
      return {
        success: false,
        error: {
          code: 'INVALID_OTP',
          message: 'Invalid OTP',
        },
      };
    }

    // OTP verified
    const user = mockUsers.find(u => u.email === email);
    delete mockOTPStore[email];

    return {
      success: true,
      data: {
        user: {
          id: user?.id,
          email: user?.email,
          name: user?.name,
        },
        token: `mock_token_${user?.id}_${Date.now()}`,
        refreshToken: `mock_refresh_${user?.id}_${Date.now()}`,
        expiresIn: 3600,
      },
      message: 'OTP verified successfully',
    };
  },

  /**
   * Signup new user
   */
  async signup(userData: {
    email: string;
    phone: string;
    name: string;
    password: string;
    businessName: string;
    businessType?: string;
    countryCode?: string;
    role: string;
  }): Promise<AuthResponse> {
    await delay(500);

    // Check if user exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User already exists',
          details: 'An account with this email already exists',
        },
      };
    }

    // Validate input
    if (!userData.email || !userData.password || userData.password.length < 8) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: 'Password must be at least 8 characters',
        },
      };
    }

    // Create new user
    const newUser: MockUser = {
      id: `merchant-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      password: userData.password,
      role: (userData.role as any) || 'merchant',
      status: 'Pending',
      kycStatus: 'pending',
      walletLinked: false,
      companyName: userData.businessName || 'New Company',
      countryCode: userData.countryCode || '+91',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString(),
    };

    // Add to mock users (in real app, this would be persisted)
    mockUsers.push(newUser);

    return {
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          status: newUser.status,
        },
        token: `mock_token_${newUser.id}_${Date.now()}`,
        expiresIn: 3600,
      },
      message: 'Signup successful. Please complete KYC verification.',
    };
  },

  /**
   * Reset password
   */
  async resetPassword(email: string, newPassword: string): Promise<AuthResponse> {
    await delay(400);

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      };
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Password too weak',
          details: 'Password must be at least 8 characters',
        },
      };
    }

    return {
      success: true,
      message: 'Password reset successful. Please login with new password.',
    };
  },

  /**
   * Logout
   */
  async logout(_token: string): Promise<AuthResponse> {
    await delay(200);

    return {
      success: true,
      message: 'Logout successful',
    };
  },

  /**
   * Refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    await delay(200);

    if (!refreshToken) {
      return {
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid refresh token',
        },
      };
    }

    return {
      success: true,
      data: {
        token: `mock_token_${Date.now()}`,
        expiresIn: 3600,
      },
    };
  },
};

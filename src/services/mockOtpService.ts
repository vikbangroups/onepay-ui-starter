/**
 * 🔐 Mock OTP & Authentication Service
 * Simulates backend API for login flows
 */

interface OtpSession {
  mobile: string;
  otp: string;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
}

// Store for simulated OTP sessions
const otpSessions: Map<string, OtpSession> = new Map();

// Demo credentials
const DEMO_MOBILE = '9876543210';
const DEMO_PASSWORD = 'password123';
const DEMO_OTP = '123456';

/**
 * Send OTP to mobile number (mocked)
 */
export const mockSendOtp = async (mobile: string): Promise<{
  success: boolean;
  message: string;
  otp?: string; // Only for demo/testing
}> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Create OTP session
  const otp = DEMO_OTP; // In production, generate random 6-digit number
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

  otpSessions.set(mobile, {
    mobile,
    otp,
    expiresAt,
    attempts: 0,
    maxAttempts: 3,
  });

  return {
    success: true,
    message: `OTP sent to ${mobile}`,
    otp, // Return OTP for testing (remove in production)
  };
};

/**
 * Verify OTP
 */
export const mockVerifyOtp = async (
  mobile: string,
  enteredOtp: string
): Promise<{
  success: boolean;
  message: string;
  token?: string;
}> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const session = otpSessions.get(mobile);

  if (!session) {
    return {
      success: false,
      message: 'OTP expired or not sent. Please request a new OTP.',
    };
  }

  // Check expiry
  if (Date.now() > session.expiresAt) {
    otpSessions.delete(mobile);
    return {
      success: false,
      message: 'OTP has expired. Please request a new one.',
    };
  }

  // Check attempts
  if (session.attempts >= session.maxAttempts) {
    otpSessions.delete(mobile);
    return {
      success: false,
      message: 'Maximum OTP attempts exceeded. Please request a new OTP.',
    };
  }

  // Verify OTP
  if (enteredOtp !== session.otp) {
    session.attempts += 1;
    const remaining = session.maxAttempts - session.attempts;
    return {
      success: false,
      message:
        remaining > 0
          ? `Invalid OTP. ${remaining} attempt(s) remaining.`
          : 'Maximum OTP attempts exceeded.',
    };
  }

  // OTP verified successfully
  otpSessions.delete(mobile);

  return {
    success: true,
    message: 'OTP verified successfully!',
    token: `token_otp_${mobile}_${Date.now()}`,
  };
};

/**
 * Login with mobile and password
 */
export const mockLoginWithPassword = async (
  mobile: string,
  password: string
): Promise<{
  success: boolean;
  message: string;
  token?: string;
  user?: { id: string; mobile: string; name: string };
}> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Demo credentials check
  if (mobile === DEMO_MOBILE && password === DEMO_PASSWORD) {
    return {
      success: true,
      message: 'Login successful!',
      token: `token_pwd_${mobile}_${Date.now()}`,
      user: {
        id: 'user_123',
        mobile,
        name: 'Demo User',
      },
    };
  }

  return {
    success: false,
    message: 'Invalid mobile number or password.',
  };
};

/**
 * Reset password (forgot password flow)
 */
export const mockResetPassword = async (
  mobile: string,
  otp: string,
  newPassword: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Verify OTP first
  const otpVerification = await mockVerifyOtp(mobile, otp);

  if (!otpVerification.success) {
    return {
      success: false,
      message: otpVerification.message,
    };
  }

  // Password would be updated in backend
  // For now, just confirm success
  return {
    success: true,
    message: 'Password reset successfully! Please login with your new password.',
  };
};

/**
 * Get demo credentials (for testing)
 */
export const getDemoCredentials = () => ({
  mobile: DEMO_MOBILE,
  password: DEMO_PASSWORD,
  otp: DEMO_OTP,
});

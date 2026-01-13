// src/services/authService.ts
import { api } from './api';
import { findUserByPhone, findUserByEmail } from '../mock/data/users';

export type UserRole = 'admin' | 'merchant' | 'viewer' | 'accountant' | 'support';

export interface AuthUser {
  id: string | number;
  username?: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  status: 'active' | 'pending' | 'disabled' | 'Registered' | 'Pending' | 'Active' | 'Rejected' | 'On Hold' | 'Disabled';
  kycStatus?: string;
}

/**
 * LOGIN - Dynamic validation against JSON data from mockUsers.json
 * ✓ No hardcoded data in code
 * ✓ Data loaded from JSON files at runtime
 * ✓ Simulates real backend API validation
 * In production, this would call backend API /auth/login
 * Backend would set httpOnly cookie with token
 */
export async function loginMock(phoneOrUsername: string, password: string): Promise<AuthUser> {
  try {
    // Try to find user by phone or email from JSON data
    let user = findUserByPhone(phoneOrUsername) || findUserByEmail(phoneOrUsername);

    if (!user) {
      throw new Error('Invalid phone/email or password');
    }

    // Verify password
    if (user.password !== password) {
      throw new Error('Invalid phone/email or password');
    }

    if (user.status === 'disabled') {
      throw new Error('Your account is disabled');
    }

    if (user.status !== 'active') {
      throw new Error(`Your account is ${user.status}. Please wait for admin approval.`);
    }

    if (user.kycStatus !== 'verified') {
      throw new Error(`KYC verification pending. Current status: ${user.kycStatus}`);
    }

    // Return user data (in real app, backend also sets httpOnly cookie)
    return {
      id: user.userId,
      name: user.name,
      email: user.email,
      phone: user.mobile,
      kycStatus: user.kycStatus,
    };
  } catch (err: any) {
    throw new Error(err.message || 'Login failed');
  }
}

/**
 * GET CURRENT USER - Fetch from mock data
 * In production, this would call backend API /auth/me
 * Backend would validate httpOnly cookie and return user data
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // Mock: return null (in real app, backend validates cookie)
    return null;
  } catch (err) {
    // Not authenticated or session expired
    return null;
  }
}

/**
 * LOGOUT - Backend clears httpOnly cookie
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    console.error('Logout failed:', err);
  }
}

/**
 * SIGNUP - API call to backend
 */
export async function signupMock(name: string, email: string, role: UserRole): Promise<{ status: 'pending'; id: number }> {
  try {
    const response = await api.post('/auth/signup', { name, email, role });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Signup failed');
  }
}

/**
 * ADMIN FUNCTIONS - API calls
 */
export async function listPending(): Promise<AuthUser[]> {
  try {
    const response = await api.get('/admin/pending-users');
    return response.data.users;
  } catch (err) {
    console.error('Failed to list pending users:', err);
    return [];
  }
}

export async function approveUser(id: number): Promise<void> {
  try {
    await api.post(`/admin/approve-user/${id}`);
  } catch (err) {
    console.error('Failed to approve user:', err);
    throw err;
  }
}

export async function rejectUser(id: number): Promise<void> {
  try {
    await api.post(`/admin/reject-user/${id}`);
  } catch (err) {
    console.error('Failed to reject user:', err);
    throw err;
  }
}


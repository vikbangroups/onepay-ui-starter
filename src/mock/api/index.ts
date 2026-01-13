/**
 * Mock API Index
 * Central export point for all mock API services
 */

export * from './auth';
export * from './wallet';
export * from './payments';
export * from './user';

import { mockAuthAPI } from './auth';
import { mockWalletAPI } from './wallet';
import { mockPaymentAPI } from './payments';
import { mockUserAPI } from './user';

/**
 * Combined mock API service
 * Use this to access all mock APIs
 */
export const mockApiService = {
  auth: mockAuthAPI,
  wallet: mockWalletAPI,
  payments: mockPaymentAPI,
  user: mockUserAPI,
};

export default mockApiService;

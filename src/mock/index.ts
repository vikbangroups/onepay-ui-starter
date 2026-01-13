/**
 * Mock API Interceptor & Setup
 * Enables/disables mock mode based on environment
 */

import { mockApiService } from './api/index';
export { mockApiService };

/**
 * Mock API Configuration
 */
export const mockConfig = {
  enabled: import.meta.env.VITE_USE_MOCK_API === 'true',
  delay: {
    min: 300,
    max: 800,
  },
};

/**
 * Initialize mock API (can be called in main.tsx)
 */
export const initializeMockAPI = () => {
  if (mockConfig.enabled) {
    console.log('🔄 Mock API Mode Enabled');
    console.log('Test Credentials:');
    console.log('  Email: merchant1@shop.com');
    console.log('  OTP: 123456');
  }
};

export * from './data/index';
export * from './api/index';
export * from './utils';

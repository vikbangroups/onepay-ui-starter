/**
 * Mock API Utilities
 * Helper functions for mock data and API responses
 */

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const generateRandomId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateRandomAmount = (min: number = 100, max: number = 50000): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateRandomDate = (daysBack: number = 30): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

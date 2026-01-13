/**
 * Formatting Utilities
 * Phone, date, and text formatting
 */

/**
 * Format phone input
 */
export const formatPhoneInput = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  // Limit to 10 digits
  return digits.slice(0, 10);
};

/**
 * Display phone number with formatting
 */
export const displayPhoneNumber = (phone: string): string => {
  const formatted = phone.replace(/(\d{5})(\d{5})/, '$1-$2');
  return `+91 ${formatted}`;
};

/**
 * Parse phone number
 */
export const parsePhoneNumber = (phone: string): { countryCode: string; number: string } => {
  const cleanPhone = phone.replace(/\D/g, '');
  // Assuming Indian phone numbers (country code +91)
  return {
    countryCode: '+91',
    number: cleanPhone.slice(0, 10),
  };
};

/**
 * Mask phone number for display
 */
export const maskPhoneNumber = (phone: string): string => {
  if (!phone || phone.length < 6) return phone;
  const firstTwo = phone.slice(0, 2);
  const lastFour = phone.slice(-4);
  const masked = '*'.repeat(4);
  return `${firstTwo}${masked}${lastFour}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Format datetime
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return formatDate(d);
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert camelCase to Title Case
 */
export const camelCaseToTitle = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

/**
 * Truncate string
 */
export const truncateString = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

/**
 * Generate initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format large numbers
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Convert snake_case to camelCase
 */
export const snakeToCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * Convert camelCase to snake_case
 */
export const camelToSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Input Sanitization Utilities
 * Prevents XSS (Cross-Site Scripting) attacks
 * Follows OWASP output encoding standards
 */

/**
 * Sanitizes HTML to prevent XSS attacks
 * Converts potentially dangerous characters to safe HTML entities
 * @param input - Raw user input
 * @returns Safe HTML string
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';

  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Sanitizes URLs to prevent javascript: and data: URIs
 * Only allows http and https protocols
 * @param url - URL to sanitize
 * @returns Safe URL or empty string
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      console.warn('Invalid URL protocol:', parsed.protocol);
      return '';
    }
    return url;
  } catch (error) {
    console.warn('Invalid URL format:', url);
    return '';
  }
}

/**
 * Removes all HTML tags from input
 * Useful for plaintext display
 * @param input - HTML string
 * @returns Plaintext without tags
 */
export function stripHtml(input: string): string {
  if (!input) return '';
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Escapes special characters for use in regular expressions
 * @param input - String to escape
 * @returns Escaped string safe for regex
 */
export function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sanitizes file names to prevent directory traversal attacks
 * Removes special characters and keeps only alphanumeric, dash, underscore, and dot
 * @param filename - Original filename
 * @returns Safe filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return '';

  return filename
    .replace(/\0/g, '') // Remove null bytes
    .replace(/\.\./g, '') // Remove directory traversal
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace invalid chars
    .substring(0, 255); // Limit length
}

/**
 * Sanitizes SQL-like strings to prevent injection
 * Note: Use parameterized queries on backend instead!
 * This is a defensive layer only
 * @param input - String to sanitize
 * @returns Escaped string
 */
export function sanitizeSqlInput(input: string): string {
  if (!input) return '';

  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/"/g, '""') // Escape double quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comments
    .substring(0, 1000); // Limit length
}

/**
 * Sanitizes JSON strings to prevent injection
 * @param input - String to sanitize
 * @returns Safe JSON-compatible string
 */
export function sanitizeJsonString(input: string): string {
  if (!input) return '';

  return input
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/"/g, '\\"') // Escape quotes
    .replace(/\n/g, '\\n') // Escape newlines
    .replace(/\r/g, '\\r') // Escape carriage returns
    .replace(/\t/g, '\\t'); // Escape tabs
}

/**
 * Validates and sanitizes email addresses
 * @param email - Email to sanitize
 * @returns Lowercase trimmed email or empty string
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  return email
    .trim()
    .toLowerCase()
    .replace(/[<>]/g, ''); // Remove angle brackets
}

/**
 * Sanitizes phone numbers (removes special chars except +)
 * @param phone - Phone number to sanitize
 * @returns Digits and + only
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return '';

  return phone.replace(/[^0-9+\-\s()]/g, '').trim();
}

/**
 * Sanitizes amount input (currency values)
 * Ensures valid numeric format
 * @param amount - Amount string
 * @returns Valid number or 0
 */
export function sanitizeAmount(amount: string | number): number {
  let numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Check if valid number
  if (isNaN(numAmount) || !isFinite(numAmount)) {
    return 0;
  }

  // Round to 2 decimal places (paise)
  return Math.round(numAmount * 100) / 100;
}

/**
 * Comprehensive input sanitizer
 * Applies multiple sanitization techniques
 * @param input - User input
 * @param type - Type of input (html, url, email, phone, plaintext)
 * @returns Sanitized output
 */
export function sanitizeInput(
  input: string | undefined,
  type: 'html' | 'url' | 'email' | 'phone' | 'plaintext' = 'plaintext'
): string {
  if (!input) return '';

  switch (type) {
    case 'html':
      return sanitizeHtml(input);
    case 'url':
      return sanitizeUrl(input);
    case 'email':
      return sanitizeEmail(input);
    case 'phone':
      return sanitizePhoneNumber(input);
    case 'plaintext':
    default:
      return stripHtml(input).trim();
  }
}

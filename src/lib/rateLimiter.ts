/**
 * Rate Limiter Utility
 * Implements client-side rate limiting to prevent brute force attacks
 * on login and other sensitive endpoints
 * 
 * Security: CWE-307 - Improper Restriction of Rendered UI Layers or Frames
 * OWASP: Brute Force Prevention
 */

interface RateLimitEntry {
  key: string;
  attempts: number[];
  isBlocked: boolean;
  blockedUntil?: number;
}

/**
 * RateLimiter class for tracking and enforcing rate limits
 * Default: 5 attempts per minute per key
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly MAX_ATTEMPTS: number;
  private readonly WINDOW_MS: number;
  private readonly CLEANUP_INTERVAL: number;

  /**
   * Initialize RateLimiter
   * @param maxAttempts - Maximum attempts allowed (default: 5)
   * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
   * @param cleanupInterval - Cleanup old entries interval (default: 300000 = 5 minutes)
   */
  constructor(maxAttempts: number = 5, windowMs: number = 60000, cleanupInterval: number = 300000) {
    this.MAX_ATTEMPTS = maxAttempts;
    this.WINDOW_MS = windowMs;
    this.CLEANUP_INTERVAL = cleanupInterval;

    // Cleanup old entries periodically
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  /**
   * Check if an action is allowed for a given key
   * @param key - Unique identifier (e.g., email, IP, or action type)
   * @returns true if allowed, false if rate limit exceeded
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove old attempts outside the time window
    const recentAttempts = attempts.filter((timestamp) => now - timestamp < this.WINDOW_MS);

    // Check if limit exceeded
    if (recentAttempts.length >= this.MAX_ATTEMPTS) {
      this.attempts.set(key, recentAttempts);
      return false;
    }

    // Record new attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  /**
   * Get remaining time (ms) before rate limit window resets
   * @param key - Unique identifier
   * @returns Milliseconds remaining until oldest attempt expires
   */
  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;

    const oldestAttempt = Math.min(...attempts);
    const remainingTime = this.WINDOW_MS - (Date.now() - oldestAttempt);
    return Math.max(0, remainingTime);
  }

  /**
   * Get current attempt count for a key
   * @param key - Unique identifier
   * @returns Current number of recent attempts
   */
  getAttemptCount(key: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    return attempts.filter((timestamp) => now - timestamp < this.WINDOW_MS).length;
  }

  /**
   * Reset attempts for a specific key
   * @param key - Unique identifier to reset
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clear all tracked attempts
   */
  clearAll(): void {
    this.attempts.clear();
  }

  /**
   * Remove old entries to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, attempts] of this.attempts.entries()) {
      // Keep only recent attempts
      const recentAttempts = attempts.filter((timestamp) => now - timestamp < this.WINDOW_MS);

      if (recentAttempts.length === 0) {
        keysToDelete.push(key);
      } else if (recentAttempts.length < attempts.length) {
        // Update if any attempts were removed
        this.attempts.set(key, recentAttempts);
      }
    }

    // Delete keys with no recent attempts
    keysToDelete.forEach((key) => this.attempts.delete(key));
  }

  /**
   * Get entry details for debugging
   * @param key - Unique identifier
   * @returns Entry details including attempt count and remaining time
   */
  getEntryDetails(key: string): RateLimitEntry {
    const attempts = this.attempts.get(key) || [];
    const now = Date.now();
    const recentAttempts = attempts.filter((timestamp) => now - timestamp < this.WINDOW_MS);
    const isBlocked = recentAttempts.length >= this.MAX_ATTEMPTS;
    const blockedUntil = isBlocked ? Math.min(...recentAttempts) + this.WINDOW_MS : undefined;

    return {
      key,
      attempts: recentAttempts,
      isBlocked,
      blockedUntil,
    };
  }
}

/**
 * Global rate limiter instance for login attempts
 * Default: 5 attempts per minute per user
 */
export const loginRateLimiter = new RateLimiter(5, 60000);

/**
 * Global rate limiter instance for payment attempts
 * Default: 3 attempts per minute per user
 */
export const paymentRateLimiter = new RateLimiter(3, 60000);

/**
 * Global rate limiter instance for OTP requests
 * Default: 5 attempts per 5 minutes per user
 */
export const otpRateLimiter = new RateLimiter(5, 300000);

/**
 * Global rate limiter instance for password reset
 * Default: 3 attempts per 30 minutes per user
 */
export const passwordResetRateLimiter = new RateLimiter(3, 1800000);

export default RateLimiter;

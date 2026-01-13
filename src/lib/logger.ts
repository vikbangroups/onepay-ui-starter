/**
 * Centralized logger for application
 * Supports different log levels and context
 * Configurable destination: local storage or Azure
 * OWASP: Proper logging is essential for security monitoring
 * CWE-532: Insertion of Sensitive Information into Log File
 */

import { getRuntimeLoggerConfig } from './loggerConfig';
import { localLoggerAdapter } from './loggers/localLogger';

enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  [key: string]: unknown;
}

const LOG_STORAGE_KEY = 'onepay_logs';
const SESSION_STORAGE_KEY = 'onepay_session';
const MAX_LOGS = 1000;

/**
 * Logger class - centralized logging with context support
 * Never log sensitive data (passwords, tokens, PII)
 */
class Logger {
  private context: LogContext = {};

  /**
   * Set context for all subsequent logs
   */
  setContext(ctx: LogContext): void {
    this.context = { ...this.context, ...ctx };
  }

  /**
   * Clear context
   */
  clearContext(): void {
    this.context = {};
  }

  /**
   * Format log entry with timestamp and context
   */
  private format(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
      ...(data && typeof data === 'object' ? data : { data }),
    };
  }

  /**
   * Route log entry based on configuration
   * Sends to local, Azure, or both based on config
   */
  private routeLog(entry: LogEntry): void {
    const config = getRuntimeLoggerConfig();

    // Route to local storage
    if (config.destination === 'local' || config.destination === 'both') {
      if (config.local.enabled) {
        localLoggerAdapter.saveLog(entry);
      }
    }

    // Route to Azure
    if (config.destination === 'azure' || config.destination === 'both') {
      if (config.azure.enabled) {
        if (entry.level === 'error') {
          azureLoggerAdapter.sendError(new Error(entry.message), entry);
        } else {
          azureLoggerAdapter.sendLog(entry);
        }
      }
    }
  }

  /**
   * Debug level - only in development
   */
  debug(message: string, data?: unknown): void {
    const entry = this.format(LogLevel.DEBUG, message, data);
    if (import.meta.env.DEV) {
      console.debug('[DEBUG]', entry);
      this.routeLog(entry);
    }
  }

  /**
   * Info level - general information
   */
  info(message: string, data?: unknown): void {
    const entry = this.format(LogLevel.INFO, message, data);
    const config = getRuntimeLoggerConfig();
    if (config.enableConsole) {
      console.log('[INFO]', entry);
    }
    this.routeLog(entry);
  }

  /**
   * Warn level - warning conditions
   */
  warn(message: string, data?: unknown): void {
    const entry = this.format(LogLevel.WARN, message, data);
    const config = getRuntimeLoggerConfig();
    if (config.enableConsole) {
      console.warn('[WARN]', entry);
    }
    this.routeLog(entry);
  }

  /**
   * Error level - error conditions
   * IMPORTANT: Never log passwords, tokens, or PII
   */
  error(message: string, error?: Error | unknown, data?: unknown): void {
    const errorInfo: Record<string, unknown> = {};

    if (error instanceof Error) {
      errorInfo.errorMessage = error.message;
      errorInfo.errorName = error.name;
      if (import.meta.env.DEV) {
        errorInfo.errorStack = error.stack;
      }
    } else if (error) {
      errorInfo.error = String(error);
    }

    const logData = {
      ...errorInfo,
      ...(data && typeof data === 'object' ? data : { data }),
    };

    const entry = this.format(LogLevel.ERROR, message, logData);
    const config = getRuntimeLoggerConfig();
    if (config.enableConsole) {
      console.error('[ERROR]', entry);
    }
    this.routeLog(entry);
  }

  /**
   * Get current context
   */
  getContext(): LogContext {
    return { ...this.context };
  }

  /**
   * Get all logs from localStorage
   */
  getLogsFromStorage(): LogEntry[] {
    try {
      const logs = localStorage.getItem(LOG_STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (err) {
      console.error('Failed to retrieve logs from localStorage:', err);
      return [];
    }
  }

  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.getLogsFromStorage().filter(log => log.level === level);
  }

  /**
   * Get logs for specific user
   */
  getLogsForUser(userId: string): LogEntry[] {
    return this.getLogsFromStorage().filter(log => log.userId === userId);
  }

  /**
   * Get recent logs (last N entries)
   */
  getRecentLogs(count: number = 50): LogEntry[] {
    const logs = this.getLogsFromStorage();
    return logs.slice(-count);
  }

  /**
   * Get all INFO level logs (successful operations)
   */
  getSuccessLogs(): LogEntry[] {
    return this.getLogsByLevel(LogLevel.INFO);
  }

  /**
   * Get all ERROR level logs (failed operations)
   */
  getErrorLogs(): LogEntry[] {
    return this.getLogsByLevel(LogLevel.ERROR);
  }

  /**
   * Clear all logs from localStorage
   */
  clearLogs(): void {
    try {
      localStorage.removeItem(LOG_STORAGE_KEY);
      console.log('[INFO] All logs cleared from localStorage');
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  }

  /**
   * Export logs as JSON file
   */
  exportLogs(): string {
    return JSON.stringify(this.getLogsFromStorage(), null, 2);
  }

  /**
   * Download logs as JSON file
   */
  downloadLogs(): void {
    try {
      const logs = this.getLogsFromStorage();
      const dataStr = JSON.stringify(logs, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `onepay-logs-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      console.error('Failed to download logs:', err);
    }
  }
}

export const logger = new Logger();

/**
 * Helper function - log error
 */
export function logError(error: Error, context?: unknown): void {
  logger.error(error.message, error, context);
}

/**
 * Helper function - log info
 */
export function logInfo(message: string, data?: unknown): void {
  logger.info(message, data);
}

/**
 * Helper function - log warning
 */
export function logWarn(message: string, data?: unknown): void {
  logger.warn(message, data);
}

/**
 * Helper function - log debug
 */
export function logDebug(message: string, data?: unknown): void {
  logger.debug(message, data);
}

/**
 * Set logger context (for tracking requests/users)
 */
export function setLoggerContext(context: LogContext): void {
  logger.setContext(context);
}

/**
 * Clear logger context
 */
export function clearLoggerContext(): void {
  logger.clearContext();
}

/**
 * Get logger context
 */
export function getLoggerContext(): LogContext {
  return logger.getContext();
}

/**
 * Get all logs from storage
 */
export function getAllLogs(): LogEntry[] {
  return localLoggerAdapter.getLogs();
}

/**
 * Get success logs (INFO level)
 */
export function getSuccessLogs(): LogEntry[] {
  return localLoggerAdapter.getLogsByLevel('info');
}

/**
 * Get error logs (ERROR level)
 */
export function getErrorLogs(): LogEntry[] {
  return localLoggerAdapter.getLogsByLevel('error');
}

/**
 * Get recent logs
 */
export function getRecentLogs(count?: number): LogEntry[] {
  return localLoggerAdapter.getRecentLogs(count);
}

/**
 * Export logs as JSON
 */
export function exportLogs(): string {
  return localLoggerAdapter.exportLogs();
}

/**
 * Download logs as file
 */
export function downloadLogs(): void {
  localLoggerAdapter.downloadLogs();
}

/**
 * Clear all logs
 */
export function clearAllLogs(): void {
  localLoggerAdapter.clearLogs();
}

/**
 * Session tracking for logged-in users
 */
interface SessionData {
  userId: string;
  name: string;
  role: string;
  loginTime: string;
  logoutTime?: string;
  duration?: number;
}

export function logUserSession(user: { id: string; name: string; role: string }): void {
  try {
    const session: SessionData = {
      userId: user.id,
      name: user.name,
      role: user.role,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    logger.info(`User logged in`, { userId: user.id, name: user.name, role: user.role });
  } catch (err) {
    console.error('Failed to log user session:', err);
  }
}

export function logUserLogout(): void {
  try {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    if (session) {
      const sessionData: SessionData = JSON.parse(session);
      sessionData.logoutTime = new Date().toISOString();
      const loginTime = new Date(sessionData.loginTime).getTime();
      const logoutTime = new Date(sessionData.logoutTime).getTime();
      sessionData.duration = Math.round((logoutTime - loginTime) / 1000);
      
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      logger.info(`User logged out`, { userId: sessionData.userId, sessionDuration: sessionData.duration });
    }
  } catch (err) {
    console.error('Failed to log user logout:', err);
  }
}

export function getCurrentSession(): SessionData | null {
  try {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
  } catch (err) {
    console.error('Failed to get current session:', err);
    return null;
  }
}

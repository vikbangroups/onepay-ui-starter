/**
 * Local Logger Adapter
 * Stores logs in browser's localStorage
 */

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  [key: string]: unknown;
}

const LOG_STORAGE_KEY = 'onepay_logs';

export class LocalLoggerAdapter {
  private maxLogs: number;

  constructor(maxLogs: number = 1000) {
    this.maxLogs = maxLogs;
  }

  /**
   * Save log entry to localStorage
   */
  saveLog(entry: LogEntry): void {
    try {
      const logs = this.getLogs();
      logs.push(entry);
      
      // Keep only last maxLogs entries
      if (logs.length > this.maxLogs) {
        logs.splice(0, logs.length - this.maxLogs);
      }
      
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
    } catch (err) {
      console.error('Failed to save log to localStorage:', err);
    }
  }

  /**
   * Get all logs from localStorage
   */
  getLogs(): LogEntry[] {
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
  getLogsByLevel(level: string): LogEntry[] {
    return this.getLogs().filter(log => log.level === level);
  }

  /**
   * Get logs for specific user
   */
  getLogsForUser(userId: string): LogEntry[] {
    return this.getLogs().filter(log => log.userId === userId);
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 50): LogEntry[] {
    const logs = this.getLogs();
    return logs.slice(-count);
  }

  /**
   * Get logs between dates
   */
  getLogsBetween(startDate: Date, endDate: Date): LogEntry[] {
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    return this.getLogs().filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= start && logTime <= end;
    });
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    try {
      localStorage.removeItem(LOG_STORAGE_KEY);
      console.log('[LOCAL LOGGER] All logs cleared');
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  }

  /**
   * Export logs as JSON string
   */
  exportLogs(): string {
    return JSON.stringify(this.getLogs(), null, 2);
  }

  /**
   * Download logs as file
   */
  downloadLogs(): void {
    try {
      const logs = this.getLogs();
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

  /**
   * Get storage size
   */
  getStorageSize(): { used: number; available: number; percentage: number } {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      // Approximate total localStorage limit (usually 5-10MB)
      const available = 5 * 1024 * 1024; // 5MB estimate
      return {
        used: total,
        available,
        percentage: (total / available) * 100,
      };
    } catch (err) {
      console.error('Failed to get storage size:', err);
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

export const localLoggerAdapter = new LocalLoggerAdapter();

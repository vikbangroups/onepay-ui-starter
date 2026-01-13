export interface Notification {
  id: string;
  title?: string;
  body?: string;
  message?: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  date?: string;
  timestamp?: string;
  read?: boolean;
}

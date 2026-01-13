// src/config/accessControl.ts
import type { UserRole } from '../services/authService';

export const AccessRules: Record<UserRole, string[]> = {
  admin: ['dashboard', 'add-money', 'payout', 'user-approvals', 'reports'],
  merchant: ['dashboard', 'add-money', 'payout'],
  viewer: ['dashboard'],
  accountant: ['dashboard', 'reports'],
  support: ['dashboard', 'user-approvals']
};

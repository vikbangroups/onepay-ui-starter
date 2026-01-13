// src/hooks/useAccess.ts
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { AccessRules } from '../config/accessControl';

export function useAccess() {
  const { user } = useAuth();

  const allowedScreens = useMemo(() => {
    if (!user) return [];
    return AccessRules[user.role] || [];
  }, [user]);

  const canAccess = (screenKey: string) => allowedScreens.includes(screenKey);

  return { canAccess, allowedScreens };
}

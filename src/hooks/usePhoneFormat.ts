/**
 * usePhoneFormat Hook
 * Handles phone number formatting and parsing
 */

import { useState, useCallback } from 'react';
import { formatPhoneInput, displayPhoneNumber, maskPhoneNumber } from '../utils/formatting';

export interface UsePhoneFormatReturn {
  phone: string;
  displayPhone: string;
  maskedPhone: string;
  setPhone: (value: string) => void;
  clear: () => void;
}

export const usePhoneFormat = (initialPhone: string = ''): UsePhoneFormatReturn => {
  const [phone, setPhoneState] = useState(initialPhone);

  const setPhone = useCallback((value: string) => {
    const formatted = formatPhoneInput(value);
    setPhoneState(formatted);
  }, []);

  const clear = useCallback(() => {
    setPhoneState('');
  }, []);

  return {
    phone,
    displayPhone: displayPhoneNumber(phone),
    maskedPhone: maskPhoneNumber(phone),
    setPhone,
    clear,
  };
};

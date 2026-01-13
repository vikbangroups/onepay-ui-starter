/**
 * Country Configuration
 * Supports India and US with country codes and phone formats
 */

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  phoneLength: number;
  phoneFormat: string;
}

export const COUNTRIES: Record<string, CountryConfig> = {
  IN: {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    dialCode: '+91',
    phoneLength: 10,
    phoneFormat: 'XXXXXXXXXX',
  },
  US: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    dialCode: '+1',
    phoneLength: 10,
    phoneFormat: '(XXX) XXX-XXXX',
  },
};

export const DEFAULT_COUNTRY = 'IN';

export const getCountryByCode = (code: string): CountryConfig | null => {
  return COUNTRIES[code] || null;
};

export const getCountryList = (): CountryConfig[] => {
  return Object.values(COUNTRIES);
};

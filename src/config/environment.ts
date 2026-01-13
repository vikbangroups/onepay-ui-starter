// src/config/environment.ts

export const ENV = {
  // =========================
  // API Configuration
  // =========================
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,

  // =========================
  // Authentication (Frontend Behavior Only)
  // =========================
  JWT_STORAGE: 'cookie', // DO NOT use localStorage
  TOKEN_EXPIRY: 3600,
  REFRESH_TOKEN_EXPIRY: 604800,
  SESSION_TIMEOUT: 900,

  // =========================
  // Payment Gateway
  // =========================
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  RAZORPAY_MODE: import.meta.env.VITE_RAZORPAY_MODE || 'test',

  // =========================
  // Azure
  // =========================
  AZURE_KEY_VAULT_URL: import.meta.env.VITE_AZURE_KEY_VAULT_URL || '',

  // =========================
  // Branding
  // =========================
  PRODUCT_NAME: import.meta.env.VITE_PRODUCT_NAME || 'OnePay',
  BRAND_NAME: import.meta.env.VITE_BRAND_NAME || 'One Code Solutions',
  LOGO_URL: import.meta.env.VITE_LOGO_URL || '/src/assets/OneCode_Logo.png',

  // =========================
  // Environment Flags
  // =========================
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,

  // =========================
  // Security
  // =========================
  CORS_ORIGIN: import.meta.env.VITE_CORS_ORIGIN || '',
  ENABLE_LOGGING: !import.meta.env.PROD,
};

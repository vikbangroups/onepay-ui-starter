/**
 * Logger Configuration
 * Controls where logs are stored/sent
 * Options: 'local' | 'azure' | 'both'
 */

export type LogDestination = 'local' | 'azure' | 'both';

export interface LoggerConfig {
  // Primary logging destination
  destination: LogDestination;
  
  // Enable console output
  enableConsole: boolean;
  
  // Local storage settings
  local: {
    enabled: boolean;
    maxLogs: number;
  };
  
  // Azure Application Insights settings
  azure: {
    enabled: boolean;
    connectionString?: string;
    instrumentationKey?: string;
  };
}

/**
 * Default configuration - logs to LOCAL storage
 * Change destination to 'azure' or 'both' when ready
 */
export const defaultLoggerConfig: LoggerConfig = {
  // TEMPORARY: Set to 'local' for development
  // TODO: Change to 'azure' or 'both' for production
  destination: 'local',
  
  enableConsole: true,
  
  local: {
    enabled: true,
    maxLogs: 1000,
  },
  
  azure: {
    enabled: false,
    // Add Azure connection details when moving to production
    // connectionString: process.env.VITE_AZURE_CONNECTION_STRING,
    // instrumentationKey: process.env.VITE_AZURE_INSTRUMENTATION_KEY,
  },
};

/**
 * Get current logger configuration
 * Can be overridden via environment variables
 */
export function getLoggerConfig(): LoggerConfig {
  const config = { ...defaultLoggerConfig };
  
  // Override from environment variables
  if (import.meta.env.VITE_LOG_DESTINATION) {
    config.destination = import.meta.env.VITE_LOG_DESTINATION as LogDestination;
  }
  
  if (import.meta.env.VITE_AZURE_CONNECTION_STRING) {
    config.azure.connectionString = import.meta.env.VITE_AZURE_CONNECTION_STRING;
    config.azure.enabled = true;
  }
  
  if (import.meta.env.VITE_AZURE_INSTRUMENTATION_KEY) {
    config.azure.instrumentationKey = import.meta.env.VITE_AZURE_INSTRUMENTATION_KEY;
    config.azure.enabled = true;
  }
  
  return config;
}

/**
 * Update logger configuration at runtime
 */
let runtimeConfig = getLoggerConfig();

export function setLoggerConfig(config: Partial<LoggerConfig>): void {
  runtimeConfig = { ...runtimeConfig, ...config };
  console.log('[LOGGER CONFIG]', 'Configuration updated:', runtimeConfig);
}

export function getRuntimeLoggerConfig(): LoggerConfig {
  return runtimeConfig;
}

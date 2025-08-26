import type { LogLevel } from './logger';

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = BYTES_PER_KB * BYTES_PER_KB;
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

const ONE_KB = BYTES_PER_KB;
const ONE_MB = BYTES_PER_MB;
const ONE_MINUTE = MS_PER_MINUTE;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;
const TEN_MB_MULTIPLIER = 10;

const SEVEN_DAYS = DAYS_PER_WEEK * MS_PER_DAY;
const THIRTY_DAYS = DAYS_PER_MONTH * MS_PER_DAY;
const TEN_MB = TEN_MB_MULTIPLIER * ONE_MB;

export type LoggerConfig = {
  level: LogLevel;
  enableConsole: boolean;
  enableStructured: boolean;
  enableExternalService: boolean;
  externalServiceUrl?: string;
  externalServiceApiKey?: string;
  maxLogSize: number;
  logRetention: number;
};

const developmentConfig: LoggerConfig = {
  level: 'debug',
  enableConsole: true,
  enableStructured: false,
  enableExternalService: false,
  maxLogSize: ONE_MB,
  logRetention: SEVEN_DAYS,
};

const productionConfig: LoggerConfig = {
  level: 'info',
  enableConsole: true,
  enableStructured: true,
  enableExternalService: true,
  externalServiceUrl: process.env.LOG_SERVICE_URL,
  externalServiceApiKey: process.env.LOG_SERVICE_API_KEY,
  maxLogSize: TEN_MB,
  logRetention: THIRTY_DAYS,
};

const testConfig: LoggerConfig = {
  level: 'error',
  enableConsole: false,
  enableStructured: false,
  enableExternalService: false,
  maxLogSize: ONE_KB,
  logRetention: ONE_MINUTE,
};

export function getLoggerConfig(): LoggerConfig {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const logLevel = process.env.LOG_LEVEL;

  let baseConfig: LoggerConfig;

  switch (nodeEnv) {
    case 'production':
      baseConfig = productionConfig;
      break;
    case 'test':
      baseConfig = testConfig;
      break;
    default:
      baseConfig = developmentConfig;
  }

  if (logLevel) {
    const levelMap: Record<string, LogLevel> = {
      debug: 'debug',
      info: 'info',
      warn: 'warn',
      error: 'error',
      none: 'none',
    };

    const parsedLevel = levelMap[logLevel.toLowerCase()];
    if (parsedLevel !== undefined) {
      baseConfig.level = parsedLevel;
    }
  }

  if (process.env.LOG_ENABLE_EXTERNAL === 'true') {
    baseConfig.enableExternalService = true;
  }

  if (process.env.LOG_DISABLE_CONSOLE === 'true') {
    baseConfig.enableConsole = false;
  }

  if (process.env.LOG_STRUCTURED === 'true') {
    baseConfig.enableStructured = true;
  }

  return baseConfig;
}

export const LOG_ENV_VARS = {
  LOG_LEVEL: 'LOG_LEVEL', // 'debug', 'info', 'warn', 'error', 'none'
  NODE_ENV: 'NODE_ENV', // 'development', 'production', 'test'
  LOG_DISABLE_CONSOLE: 'LOG_DISABLE_CONSOLE', // 'true' to disable
  LOG_STRUCTURED: 'LOG_STRUCTURED', // 'true' to enable JSON structured logs
  LOG_ENABLE_EXTERNAL: 'LOG_ENABLE_EXTERNAL', // 'true' to enable
  LOG_SERVICE_URL: 'LOG_SERVICE_URL', // External logging service URL
  LOG_SERVICE_API_KEY: 'LOG_SERVICE_API_KEY', // API key for external service
  LOG_MAX_SIZE: 'LOG_MAX_SIZE', // Maximum log size in bytes
  LOG_RETENTION: 'LOG_RETENTION', // Log retention in milliseconds
} as const;

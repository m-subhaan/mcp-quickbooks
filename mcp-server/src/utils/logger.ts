import winston from 'winston';

const logLevel = process.env['LOG_LEVEL'] || 'info';

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'quickbooks-mcp-server' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Sanitize sensitive data from logs
export const sanitizeLogData = (data: any): any => {
  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data };
    const sensitiveKeys = ['access_token', 'refresh_token', 'client_secret', 'password'];
    
    for (const key of sensitiveKeys) {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
  return data;
};

// Log function that automatically sanitizes sensitive data
export const safeLog = (level: 'info' | 'error' | 'warn' | 'debug', message: string, data?: any) => {
  if (data) {
    logger.log(level, message, sanitizeLogData(data));
  } else {
    logger.log(level, message);
  }
};

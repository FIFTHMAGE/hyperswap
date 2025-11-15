/**
 * Service logger for structured logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class ServiceLogger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  log(level: LogLevel, service: string, message: string, data?: unknown): void {
    if (!this.isDevelopment && level === 'debug') return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      service,
      message,
      ...(data && { data }),
    };

    switch (level) {
      case 'error':
        console.error(`[${timestamp}] [${service}]`, message, data);
        break;
      case 'warn':
        console.warn(`[${timestamp}] [${service}]`, message, data);
        break;
      default:
        if (this.isDevelopment) {
          console.log(`[${timestamp}] [${service}]`, message, data);
        }
    }
  }

  debug(service: string, message: string, data?: unknown): void {
    this.log('debug', service, message, data);
  }

  info(service: string, message: string, data?: unknown): void {
    this.log('info', service, message, data);
  }

  warn(service: string, message: string, data?: unknown): void {
    this.log('warn', service, message, data);
  }

  error(service: string, message: string, error?: unknown): void {
    this.log('error', service, message, error);
  }
}

export const logger = new ServiceLogger();


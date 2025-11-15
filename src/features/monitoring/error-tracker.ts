export interface ErrorLog {
  timestamp: number;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorTracker {
  private errors: ErrorLog[] = [];
  private maxErrors: number = 100;

  log(error: Error, context?: Record<string, any>, severity: ErrorLog['severity'] = 'medium'): void {
    const errorLog: ErrorLog = {
      timestamp: Date.now(),
      message: error.message,
      stack: error.stack,
      context,
      severity,
    };

    this.errors.unshift(errorLog);
    
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorTracker]', errorLog);
    }

    // In production, send to monitoring service
    this.sendToMonitoring(errorLog);
  }

  private sendToMonitoring(error: ErrorLog): void {
    // Placeholder for Sentry, Datadog, etc.
    // Example: Sentry.captureException(error);
  }

  getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }
}

export const errorTracker = new ErrorTracker();


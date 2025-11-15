/**
 * Higher-Order Component for error boundary
 */

import React, { Component, ComponentType, ReactNode } from 'react';
import { ErrorState } from '../patterns/ErrorState';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
): ComponentType<P> {
  return class WithErrorBoundary extends Component<P, ErrorBoundaryState> {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
      console.error('Component error:', error, errorInfo);
      onError?.(error, errorInfo);
    }

    handleReset = (): void => {
      this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
      if (this.state.hasError && this.state.error) {
        return <ErrorState error={this.state.error} onRetry={this.handleReset} />;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}


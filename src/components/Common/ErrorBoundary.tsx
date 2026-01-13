import React, { ReactNode } from 'react';
import { logError } from '../../lib/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

/**
 * Global Error Boundary Component
 * Catches React component errors and displays fallback UI
 * Logs errors to monitoring service for debugging
 * 
 * OWASP: Proper error handling prevents information disclosure
 * CWE-209: Information Exposure Through an Error Message
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    };
  }

  /**
   * Update state when an error is caught
   * Called during render phase
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details for debugging
   * Called during commit phase after render
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Store component stack in state
    this.setState({
      errorInfo: errorInfo.componentStack || undefined,
    });

    // Log error to monitoring service
    logError(error, {
      componentStack: errorInfo.componentStack,
      severity: 'error',
      type: 'React Component Error',
      timestamp: new Date().toISOString(),
    });

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

  /**
   * Reset error state - allows user to try again
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback" role="alert" aria-live="assertive">
          <div className="error-container">
            <div className="error-icon">⚠️</div>

            <h1 className="error-title">Oops! Something Went Wrong</h1>

            <p className="error-message">
              We're sorry, but something unexpected happened. Our team has been
              notified and will look into it shortly.
            </p>

            <div className="error-actions">
              <button
                className="btn btn-primary"
                onClick={() => (window.location.href = '/dashboard')}
                aria-label="Go to dashboard"
              >
                Go to Dashboard
              </button>

              <button
                className="btn btn-secondary"
                onClick={this.handleReset}
                aria-label="Try again"
              >
                Try Again
              </button>
            </div>

            {/* Dev-only error details */}
            {import.meta.env.DEV && this.state.error && (
              <details
                className="error-details"
                style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  Error Details (Development Only)
                </summary>

                <div style={{ marginTop: '10px', fontSize: '12px', fontFamily: 'monospace' }}>
                  <strong>Error Message:</strong>
                  <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {this.state.error.message}
                  </pre>

                  {this.state.error.stack && (
                    <>
                      <strong>Stack Trace:</strong>
                      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                        {this.state.error.stack}
                      </pre>
                    </>
                  )}

                  {this.state.errorInfo && (
                    <>
                      <strong>Component Stack:</strong>
                      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                        {this.state.errorInfo}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}

            {/* Support information */}
            <p className="error-support" style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
              Error ID: {this.state.error?.message?.substring(0, 8) || 'unknown'}
              <br />
              If this problem persists, please contact support at support@onepay.com
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

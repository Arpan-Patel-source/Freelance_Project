import React from 'react';
import { Button } from './ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-destructive mb-4">
              Something went wrong
            </h1>
            <div className="bg-muted p-4 rounded-lg mb-4 text-left">
              <p className="font-semibold mb-2">Error:</p>
              <pre className="text-sm overflow-auto">
                {this.state.error && this.state.error.toString()}
              </pre>
              {this.state.errorInfo && (
                <>
                  <p className="font-semibold mt-4 mb-2">Stack Trace:</p>
                  <pre className="text-xs overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </>
              )}
            </div>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.reload();
              }}
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

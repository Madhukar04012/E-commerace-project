import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    // Store the error object directly in state
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // Capture and store the error details in state
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log the actual error details to help with debugging
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo?.componentStack);
    
    // Additional logging for more context if available
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }
    
    // Log any additional error properties that might be useful
    if (error.message) {
      console.error('Error message:', error.message);
    }
    
    // You could also send this error to an error reporting service
    // reportErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but there was an error loading this page.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Reload Page
            </button>
            
            {/* Always show more detailed error information in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6">
                <details className="cursor-pointer">
                  <summary className="text-sm font-medium text-gray-700 mb-2">Error details (development only)</summary>
                  <div className="mt-2 space-y-4">
                    {this.state.error && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">Error Message:</h3>
                        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto mt-1">
                          {this.state.error.toString()}
                        </pre>
                      </div>
                    )}
                    
                    {this.state.errorInfo && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">Component Stack:</h3>
                        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
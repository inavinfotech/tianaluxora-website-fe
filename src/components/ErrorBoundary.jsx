import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-white/40 backdrop-blur-md rounded-3xl m-6 border border-primary/10 shadow-lg animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 text-2xl">
            ⚠️
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-primary/70 max-w-md mb-6 leading-relaxed">
            We apologize for the inconvenience. An unexpected error occurred while rendering this view.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-md hover:opacity-90 transition-all cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

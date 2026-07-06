'use client';

import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';

// Reusable premium fallback view component
export function ErrorView({ error, resetErrorBoundary }) {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyDetails = () => {
    const errorDetails = `
Error: ${error?.message || 'Unknown error'}
Stack Trace: ${error?.stack || 'No stack trace available'}
    `.trim();

    navigator.clipboard.writeText(errorDetails).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-4 md:p-8 select-none">
      <div className="w-full max-w-2xl bg-white dark:bg-darkMode-menu border border-lightMode-border dark:border-darkMode-border rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.01]">
        
        {/* Header section with warning icon and gradient background */}
        <div className="relative p-6 md:p-8 flex flex-col items-center text-center border-b border-lightMode-border dark:border-darkMode-border bg-gradient-to-br from-red-50/50 via-white to-lightMode-menu dark:from-red-950/20 dark:via-darkMode-menu dark:to-black">
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </div>

          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4 mt-2 text-red-500 dark:text-red-400 animate-bounce">
            <AlertTriangle size={48} strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-lightMode-fg dark:text-darkMode-fg tracking-tight font-arabic">
            عذراً، حدث خطأ غير متوقع
          </h2>
          <h3 className="text-md md:text-lg font-medium text-lightMode-text dark:text-darkMode-text mt-1">
            Something went wrong
          </h3>
          
          <p className="text-lightMode-textSoft dark:text-darkMode-textSoft mt-3 max-w-md text-sm md:text-base leading-relaxed">
            An unexpected error occurred while rendering this component. We apologize for the inconvenience.
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 flex flex-col sm:flex-row gap-4 justify-center items-center bg-lightMode-menu/40 dark:bg-black/20">
          <button
            onClick={resetErrorBoundary}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-lightMode-text to-indigo-600 hover:from-indigo-600 hover:to-lightMode-text text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md shadow-indigo-500/10 dark:from-darkMode-text dark:to-amber-500 dark:hover:from-amber-500 dark:hover:to-darkMode-text dark:text-black dark:font-semibold"
          >
            <RefreshCw size={18} className="animate-spin-slow" />
            <span>إعادة المحاولة / Try Again</span>
          </button>

          <a
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-darkMode-menu border border-lightMode-border dark:border-darkMode-border hover:bg-lightMode-menu dark:hover:bg-black text-lightMode-text2 dark:text-darkMode-textSoft font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm"
          >
            <Home size={18} />
            <span>الرئيسية / Go Home</span>
          </a>
        </div>

        {/* Error stack trace details accordion */}
        <div className="border-t border-lightMode-border dark:border-darkMode-border bg-white dark:bg-darkMode-menu">
          <button
            onClick={() => setIsDetailsExpanded(prev => !prev)}
            className="w-full px-6 py-4 flex items-center justify-between text-left text-sm font-medium text-lightMode-text2 dark:text-darkMode-textSoft hover:bg-lightMode-menu/50 dark:hover:bg-black/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              {isDetailsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span>تفاصيل المشكلة / Technical Details</span>
            </span>
            <span className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-mono">
              {error?.name || 'Error'}
            </span>
          </button>

          {isDetailsExpanded && (
            <div className="px-6 pb-6 pt-2 border-t border-lightMode-border/50 dark:border-darkMode-border/50 bg-lightMode-menu/20 dark:bg-black/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-lightMode-textSoft dark:text-darkMode-textSoft font-mono">
                  {error?.message}
                </span>
                <button
                  onClick={handleCopyDetails}
                  className="p-2 rounded hover:bg-lightMode-border dark:hover:bg-darkMode-border text-lightMode-textSoft dark:text-darkMode-textSoft hover:text-lightMode-fg dark:hover:text-darkMode-fg transition-all flex items-center gap-1.5 text-xs"
                  title="Copy stack trace"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-green-500" />
                      <span className="text-green-500">تم النسخ / Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>نسخ / Copy</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="w-full max-h-48 overflow-auto rounded-lg bg-gray-50 dark:bg-black border border-lightMode-border dark:border-darkMode-border p-3 text-[11px] font-mono text-red-600 dark:text-red-400 whitespace-pre-wrap leading-relaxed">
                {error?.stack || 'No stack trace available'}
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;

      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback({
            error: this.state.error,
            resetErrorBoundary: this.resetErrorBoundary,
          });
        }
        return fallback;
      }

      return (
        <ErrorView
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: this.generateErrorId(),
    };
  }

  private generateErrorId(): string {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught an Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };

    console.log('Error reported:', errorReport);
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: this.generateErrorId(),
    });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  private copyErrorDetails = () => {
    const errorDetails = `
Error ID: ${this.state.errorId}
Error: ${this.state.error?.message || 'Unknown error'}
Stack: ${this.state.error?.stack || 'No stack trace'}
Component Stack: ${this.state.errorInfo?.componentStack || 'No component stack'}
Time: ${new Date().toISOString()}
URL: ${typeof window !== 'undefined' ? window.location.href : 'Unknown'}
    `.trim();

    if (navigator.clipboard) {
      navigator.clipboard.writeText(errorDetails);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Oops! Algo deu errado
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Encontramos um erro inesperado. Nossa equipe foi notificada.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Bug className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Detalhes do Erro
                </h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ID do Erro:
                  </label>
                  <p className="font-mono text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    {this.state.errorId}
                  </p>
                </div>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Mensagem:
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      {this.state.error.message}
                    </p>
                  </div>
                )}

                <button
                  onClick={this.copyErrorDetails}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  📋 Copiar detalhes para reportar
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                onClick={this.handleRetry}
                className="flex-1 flex items-center justify-center gap-2"
                variant="default"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar Novamente
              </Button>

              <Button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2"
                variant="outline"
              >
                <RefreshCw className="w-4 h-4" />
                Recarregar Página
              </Button>

              <Button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2"
                variant="outline"
              >
                <Home className="w-4 h-4" />
                Ir para Home
              </Button>
            </motion.div>

            {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
              <motion.details
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 bg-gray-900 text-gray-100 p-4 rounded-lg text-xs"
              >
                <summary className="cursor-pointer mb-2 font-semibold">
                  🔧 Stack Trace (Desenvolvimento)
                </summary>
                <pre className="whitespace-pre-wrap overflow-x-auto">
                  {this.state.error.stack}
                </pre>
              </motion.details>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6"
            >
              Se o problema persistir, entre em contato com o suporte técnico
            </motion.p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

export const useErrorReporting = () => {
  const reportError = (error: Error, context?: string) => {
    const errorReport = {
      errorId: `MAN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('Manual Error Report:', errorReport);
    }

    console.log('Manual error reported:', errorReport);
  };

  return { reportError };
};

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console or error reporting service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // Example: Sentry.captureException(error);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
              {/* Error Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>

              {/* Error Title */}
              <h1 className="text-2xl font-bold text-white mb-4">
                Oups ! Une erreur s'est produite
              </h1>

              {/* Error Description */}
              <p className="text-slate-300 mb-8">
                Quelque chose s'est mal passé. Notre équipe a été notifiée et travaille 
                sur une solution. Vous pouvez essayer de recharger la page ou retourner à l'accueil.
              </p>

              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
                  <h3 className="text-red-400 font-semibold mb-2">Détails de l'erreur (dev):</h3>
                  <pre className="text-xs text-red-300 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReload}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-102 transition-transform duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  Recharger la page
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 bg-white/10 border border-white/20 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors duration-200"
                >
                  <Home className="w-4 h-4" />
                  Accueil
                </button>
              </div>

              {/* Support Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-slate-400">
                  Si le problème persiste, contactez le support technique.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
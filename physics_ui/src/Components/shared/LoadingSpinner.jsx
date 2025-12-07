import React from 'react';
import { Atom } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        {/* Animated Physics Lab Logo */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-full mb-6 relative animate-pulse">
            <Atom className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-full blur-md opacity-50"></div>
          </div>
          
          {/* Orbiting particles */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="absolute w-32 h-32">
              <div className="absolute inset-0 border border-purple-400/30 rounded-full animate-spin" style={{animationDuration: '4s'}}></div>
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full transform -translate-x-1 animate-spin" style={{animationDuration: '4s'}}></div>
            </div>
            
            <div className="absolute w-40 h-40">
              <div className="absolute inset-0 border border-blue-400/20 rounded-full animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}></div>
              <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full transform -translate-x-0.5 animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}></div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          PhysicsLab
        </h2>
        
        <div className="flex items-center justify-center gap-2 text-slate-300">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
        
        <p className="text-slate-400 text-sm mt-4 animate-pulse">
          Initialisation de la plateforme...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
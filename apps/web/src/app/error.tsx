'use client';

import { useEffect } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('TNEA Insight Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#070B1A] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 text-center relative overflow-hidden border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
        
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
        <p className="text-gray-400 mb-8 text-sm">
          We encountered an unexpected error. Our systems have logged the issue and our team will look into it.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => reset()}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-medium transition-colors border border-white/10 flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
          <Link
            href="/"
            className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

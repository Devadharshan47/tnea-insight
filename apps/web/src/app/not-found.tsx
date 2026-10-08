import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070B1A] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        
        <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping opacity-50"></div>
          <FileQuestion className="h-10 w-10 text-indigo-400 relative z-10" />
        </div>
        
        <h2 className="text-6xl font-black text-white mb-2 tracking-tighter">404</h2>
        <h3 className="text-xl font-bold text-gray-300 mb-3">Page Not Found</h3>
        <p className="text-gray-400 mb-8 text-sm">
          The page you are looking for doesn't exist or has been moved to another location in the TNEA portal.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

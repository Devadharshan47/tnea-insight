import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="relative">
        <div className="absolute inset-0 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full w-16 h-16 animate-spin"></div>
        <div className="absolute inset-2 border-4 border-purple-500/20 border-b-purple-500 rounded-full w-12 h-12 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
      </div>
      <p className="mt-8 text-indigo-400/80 text-sm font-medium animate-pulse tracking-widest uppercase">Loading...</p>
    </div>
  );
}

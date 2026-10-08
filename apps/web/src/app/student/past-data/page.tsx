'use client';

import { BarChart2 } from 'lucide-react';

export default function PastDataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Past Cutoff Data</h1>
        <p className="text-gray-600">View previous year cutoff trends and statistics</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <BarChart2 className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Historical Data Visualization</h2>
        <p className="text-gray-600">Analyze past year cutoff trends (mock charts)</p>
      </div>
    </div>
  );
}

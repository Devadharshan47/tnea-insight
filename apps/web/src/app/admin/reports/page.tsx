'use client';

import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">View counselling progress reports and analytics</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <BarChart3 className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Comprehensive reports on registrations, allotments, and trends</p>
      </div>
    </div>
  );
}

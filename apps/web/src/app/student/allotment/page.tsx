'use client';

import { Award } from 'lucide-react';

export default function AllotmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seat Allotment Result</h1>
        <p className="text-gray-600">Check your seat allotment status</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Award className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Allotment Result</h2>
        <p className="text-gray-600">Results will be published after Round 2 completion</p>
      </div>
    </div>
  );
}

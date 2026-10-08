'use client';

import { CreditCard } from 'lucide-react';

export default function FeesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Collection Status</h1>
        <p className="text-gray-600">Track counselling and admission fee payments</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <CreditCard className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Fee Collection Dashboard</h2>
        <p className="text-gray-600">Monitor payment status, pending fees, and generate collection reports</p>
      </div>
    </div>
  );
}

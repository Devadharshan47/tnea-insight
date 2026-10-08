'use client';

import React, { useState } from 'react';
import { Award, Users, CheckCircle, Download } from 'lucide-react';

export default function AllotmentPage() {
  const [allotmentRound, setAllotmentRound] = useState('Round 2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [allotmentPublished, setAllotmentPublished] = useState(false);

  const handleRunAllotment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('Seat allotment completed successfully!');
    }, 3000);
  };

  const handlePublishResults = () => {
    setAllotmentPublished(true);
    alert('Allotment results published! Students can now view their allocated seats.');
  };

  const allotmentStats = [
    { label: 'Total Applicants', value: '45,234' },
    { label: 'Seats Available', value: '42,000' },
    { label: 'Seats Allotted', value: '38,567' },
    { label: 'Vacant Seats', value: '3,433' },
  ];

  const categoryWise = [
    { category: 'General', applied: 25000, allotted: 22500, percentage: 90 },
    { category: 'OBC', applied: 12000, allotted: 10800, percentage: 90 },
    { category: 'SC', applied: 5000, allotted: 4200, percentage: 84 },
    { category: 'ST', applied: 3234, allotted: 2067, percentage: 64 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seat Allotment Module</h1>
        <p className="text-gray-600">Run seat allocation algorithm and publish results</p>
      </div>

      {/* Allotment Control */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Allotment Control Panel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Round</label>
            <select
              value={allotmentRound}
              onChange={(e) => setAllotmentRound(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>Round 1</option>
              <option>Round 2</option>
              <option>Round 3</option>
              <option>Mop-up Round</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleRunAllotment}
            disabled={isProcessing}
            className={`px-6 py-3 rounded-md font-medium ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Allotment...
              </span>
            ) : (
              'Run Seat Allotment Algorithm'
            )}
          </button>
          <button
            onClick={handlePublishResults}
            disabled={!isProcessing && !allotmentPublished}
            className={`px-6 py-3 rounded-md font-medium ${
              allotmentPublished
                ? 'bg-green-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {allotmentPublished ? 'Results Published ✓' : 'Publish Results'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {allotmentStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-700 font-medium mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Category-wise Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Category-wise Allotment</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Applied</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Allotted</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Percentage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Progress</th>
              </tr>
            </thead>
            <tbody>
              {categoryWise.map((item) => (
                <tr key={item.category} className="border-b">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.applied.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.allotted.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.percentage}%</td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Download Reports</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="h-6 w-6 text-indigo-600 mb-2" />
            <span className="text-sm text-gray-700">Allotment List</span>
          </button>
          <button className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="h-6 w-6 text-indigo-600 mb-2" />
            <span className="text-sm text-gray-700">Vacant Seats</span>
          </button>
          <button className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="h-6 w-6 text-indigo-600 mb-2" />
            <span className="text-sm text-gray-700">College-wise</span>
          </button>
          <button className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="h-6 w-6 text-indigo-600 mb-2" />
            <span className="text-sm text-gray-700">Summary Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Calendar, Bell, Play, Pause, CheckCircle } from 'lucide-react';

export default function CounsellingManagementPage() {
  const [notification, setNotification] = useState({
    phase: 'Round 3',
    startDate: '2024-07-15',
    endDate: '2024-07-25',
    description: 'Third round of counselling for engineering admissions'
  });

  const [registrationStatus, setRegistrationStatus] = useState<'open' | 'closed'>('open');
  const [choiceFillingStatus, setChoiceFillingStatus] = useState<'enabled' | 'disabled'>('enabled');

  const counsellingPhases = [
    { id: 1, name: 'Registration', status: 'Completed', startDate: '2024-06-01', endDate: '2024-06-15' },
    { id: 2, name: 'Document Verification', status: 'Completed', startDate: '2024-06-16', endDate: '2024-06-30' },
    { id: 3, name: 'Choice Filling - Round 1', status: 'Completed', startDate: '2024-07-01', endDate: '2024-07-10' },
    { id: 4, name: 'Allotment - Round 1', status: 'Completed', startDate: '2024-07-11', endDate: '2024-07-12' },
    { id: 5, name: 'Choice Filling - Round 2', status: 'In Progress', startDate: '2024-07-15', endDate: '2024-07-25' },
    { id: 6, name: 'Allotment - Round 2', status: 'Scheduled', startDate: '2024-07-26', endDate: '2024-07-27' },
  ];

  const handleReleaseNotification = () => {
    alert(`Notification released for ${notification.phase}!\nStart: ${notification.startDate}\nEnd: ${notification.endDate}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Counselling Workflow Management</h1>
        <p className="text-gray-600">Manage counselling phases, notifications, and registration status</p>
      </div>

      {/* Release Notification Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Bell className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Release Counselling Notification</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phase/Round Name</label>
            <input
              type="text"
              value={notification.phase}
              onChange={(e) => setNotification({...notification, phase: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={notification.startDate}
              onChange={(e) => setNotification({...notification, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={notification.endDate}
              onChange={(e) => setNotification({...notification, endDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              value={notification.description}
              onChange={(e) => setNotification({...notification, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <button
          onClick={handleReleaseNotification}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Release Notification
        </button>
      </div>

      {/* Registration Status Control */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Registration Status</h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Current Status</p>
              <p className={`text-lg font-bold ${registrationStatus === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                {registrationStatus === 'open' ? 'OPEN' : 'CLOSED'}
              </p>
            </div>
            <button
              onClick={() => setRegistrationStatus(registrationStatus === 'open' ? 'closed' : 'open')}
              className={`px-4 py-2 rounded-md font-medium ${
                registrationStatus === 'open' 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {registrationStatus === 'open' ? 'Close Registration' : 'Open Registration'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Choice Filling Control</h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Current Status</p>
              <p className={`text-lg font-bold ${choiceFillingStatus === 'enabled' ? 'text-green-600' : 'text-gray-600'}`}>
                {choiceFillingStatus === 'enabled' ? 'ENABLED' : 'DISABLED'}
              </p>
            </div>
            <button
              onClick={() => setChoiceFillingStatus(choiceFillingStatus === 'enabled' ? 'disabled' : 'enabled')}
              className={`px-4 py-2 rounded-md font-medium ${
                choiceFillingStatus === 'enabled' 
                  ? 'bg-gray-600 text-white hover:bg-gray-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {choiceFillingStatus === 'enabled' ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      {/* Counselling Phases Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Counselling Phases Timeline</h2>
        <div className="space-y-4">
          {counsellingPhases.map((phase, index) => (
            <div key={phase.id} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-0">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  phase.status === 'Completed' ? 'bg-green-100' :
                  phase.status === 'In Progress' ? 'bg-blue-100' :
                  'bg-gray-100'
                }`}>
                  {phase.status === 'Completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : phase.status === 'In Progress' ? (
                    <Play className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Pause className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-gray-900">{phase.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    phase.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    phase.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {phase.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{phase.startDate} to {phase.endDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

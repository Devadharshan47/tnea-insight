import React from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function FormSection({ title, description, icon, children }: FormSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-start mb-6">
        {icon && (
          <div className="flex-shrink-0 mr-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

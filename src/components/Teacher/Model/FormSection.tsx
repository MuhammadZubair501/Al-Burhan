import React from 'react';

interface FormSectionProps {
  title: string;
  number: number;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, number, children }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
      <span className="w-7 h-7 rounded-full bg-yellow-400/20 flex items-center justify-center text-sm">
        {number}
      </span>
      {title}
    </h3>
    {children}
  </div>
);
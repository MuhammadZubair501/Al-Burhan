import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  error,
  className = '',
  ...props
}) => (
  <div className="mb-1">
    <label className="text-emerald-100 text-sm mb-1 block font-medium">
      {label}
    </label>
    <textarea
      {...props}
      className={`w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 
        text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 
        outline-none resize-none transition ${className}`}
    />
    {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
  </div>
);
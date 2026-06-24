import React from 'react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  error?: string;
  placeholder?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  error,
  placeholder = 'Select',
  className = '',
  ...props
}) => (
  <div className="mb-1">
    <label className="text-emerald-100 text-sm mb-1 block font-medium">
      {label}
    </label>
    <select
      {...props}
      className={`w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 
        text-white focus:ring-2 focus:ring-yellow-400 outline-none appearance-none 
        cursor-pointer ${className}`}
    >
      <option value="" className="bg-emerald-900">
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-emerald-900">
          {opt}
        </option>
      ))}
    </select>
    {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
  </div>
);
// components/SelectInput.tsx
import React from 'react';

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  required,
  className = ''
}) => {
  return (
    <div className={className}>
      <label className="text-emerald-100 text-sm mb-1 block">
        {label} {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
          error ? 'border-red-400' : 'border-white/20'
        } text-white focus:ring-2 focus:ring-yellow-400 outline-none transition`}
      >
        <option value="" className="bg-emerald-900">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-emerald-900">
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
    </div>
  );
};
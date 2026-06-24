// components/RadioGroup.tsx
import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  error?: string;
  required?: boolean;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required,
  className = ''
}) => {
  return (
    <div className={className}>
      <label className="text-emerald-100 text-sm mb-1 block">
        {label} {required && '*'}
      </label>
      <div className="flex flex-wrap gap-4 mt-1">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 accent-yellow-400"
            />
            <span className="text-white capitalize">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
    </div>
  );
};
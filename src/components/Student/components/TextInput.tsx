// components/TextInput.tsx
import React from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'date' | 'tel';
  icon?: React.ReactNode;
  max?: string;
  className?: string;
  autoComplete?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
  type = 'text',
  icon,
  max,
  className = '',
  autoComplete
}) => {
  return (
    <div className={className}>
      <label className="text-emerald-100 text-sm mb-1 block">
        {label} {required && '*'}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          max={max}
          autoComplete={autoComplete}
          className={`w-full ${icon ? 'pl-12' : 'px-4'} py-3 rounded-xl bg-white/10 border ${
            error ? 'border-red-400' : 'border-white/20'
          } text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 outline-none transition`}
        />
      </div>
      {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
    </div>
  );
};
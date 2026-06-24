import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ElementType;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}) => (
  <div className="mb-1">
    <label className="text-emerald-100 text-sm mb-1 block font-medium">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300/70"
        />
      )}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl 
          bg-white/10 border border-white/20 text-white placeholder-white/40 
          focus:ring-2 focus:ring-yellow-400 outline-none transition 
          disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      />
    </div>
    {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
  </div>
);
import React from 'react';
import type { LucideIcon } from 'lucide-react';

// 1. Define the types for your parameters
interface CustomInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  Icon: LucideIcon; // Type for Lucide icons
}

// 2. Apply the types to the component
const CustomInputField: React.FC<CustomInputProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  Icon 
}) => {
  return (
    <div className="relative">
      {/* Icon */}
      {Icon && (
        <Icon 
          size={18} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300" 
        />
      )}
      
      {/* Input Field */}
      <input 
        type="text"
        value={value}  
        onChange={onChange} 
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
    </div>
  );
};

export default CustomInputField;

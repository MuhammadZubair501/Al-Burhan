import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface RadioGroupProps {
  selectedValue: string;
  onChange: (value: string) => void;
  options: string[];
  name: string; // Keeps radio groups separated safely
  Icon: LucideIcon;
}

const CustomRadioGroup: React.FC<RadioGroupProps> = ({
  selectedValue,
  onChange,
  options,
  name,
  Icon
}) => {
  return (
    <div className="relative flex items-center min-h-[48px]">
      {/* Dynamic Icon */}
      {Icon && (
        <Icon 
          size={18} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300" 
        />
      )}
      
      {/* Options Layout */}
      <div className="pl-12 text-white flex flex-col sm:flex-row gap-4">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium">
            <input
              type="radio"
              name={name}
              value={opt}
              className="w-4 h-4 accent-yellow-300 cursor-pointer focus:ring-0"
              checked={selectedValue === opt}
              onChange={(e) => onChange(e.target.value)}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CustomRadioGroup;

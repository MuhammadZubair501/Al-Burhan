import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface CheckboxGroupProps {
  selectedValues: string[];
  onChange: (updatedValues: string[]) => void;
  options: string[];
  Icon: LucideIcon;
}

const CustomCheckboxGroup: React.FC<CheckboxGroupProps> = ({
  selectedValues,
  onChange,
  options,
  Icon
}) => {
  const handleCheckboxChange = (option: string, isChecked: boolean) => {
    if (isChecked) {
      onChange([...selectedValues, option]);
    } else {
      onChange(selectedValues.filter((item) => item !== option));
    }
  };

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
      <div className="pl-12 flex flex-col sm:flex-row gap-4 text-white">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-yellow-300 cursor-pointer focus:ring-0" 
              checked={selectedValues.includes(opt)}
              onChange={(e) => handleCheckboxChange(opt, e.target.checked)}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CustomCheckboxGroup;

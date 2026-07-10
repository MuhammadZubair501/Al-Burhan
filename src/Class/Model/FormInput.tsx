import type { LucideIcon } from "lucide-react";

interface FormInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange?: (value: string) => void;
  icon: LucideIcon;
  disabled?: boolean;
}

export default function FormInput({
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  disabled = false,
}: FormInputProps) {
  return (
    <div>
      <label className="text-green-100 text-sm font-medium mb-1.5 block">{label}</label>
      <div className="relative">
        <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300" />
        <input
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full py-2.5 sm:py-3 pl-10 pr-3
            rounded-xl sm:rounded-2xl
            ${disabled 
              ? 'bg-white/5 border border-white/10 text-white/70 cursor-not-allowed'
              : 'bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-yellow-400'
            }
            outline-none text-sm sm:text-base
            placeholder-white/40
          `}
        />
      </div>
    </div>
  );
}
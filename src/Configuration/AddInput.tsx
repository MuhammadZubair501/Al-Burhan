import { Check, X } from "lucide-react";

type AddInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  placeholder: string;
};

export default function AddInput({
  value,
  onChange,
  onSave,
  onCancel,
  placeholder,
}: AddInputProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus
        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/10 border border-yellow-400/30 text-white outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave();
          if (e.key === "Escape") onCancel();
        }}
      />

      <button
        onClick={onSave}
        className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-green-500/20 text-green-300 hover:bg-green-500/30 flex items-center justify-center transition flex-shrink-0"
      >
        <Check size={16} />
      </button>

      <button
        onClick={onCancel}
        className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 flex items-center justify-center transition flex-shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
}
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
    <div className="flex items-center gap-2 mb-3">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus
        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-yellow-400/30 text-white outline-none"
      />

      <button
        onClick={onSave}
        className="w-10 h-10 rounded-xl bg-green-500/20 text-green-300 hover:bg-green-500/30 flex items-center justify-center"
      >
        <Check size={18} />
      </button>

      <button
        onClick={onCancel}
        className="w-10 h-10 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 flex items-center justify-center"
      >
        <X size={18} />
      </button>
    </div>
  );
}
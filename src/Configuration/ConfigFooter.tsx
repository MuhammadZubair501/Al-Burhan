import { Plus } from "lucide-react";

type FooterProps = {
  title: string;
  onAdd: () => void;
};

export default function ConfigFooter({ title, onAdd }: FooterProps) {
  return (
    <div className="p-4 border-t border-white/10">
      <button
        onClick={onAdd}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Add {title.slice(0, -1)}
      </button>
    </div>
  );
}
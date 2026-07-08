import { Pencil, Trash2, Check, X } from "lucide-react";

type Item = {
  id: number;
  name: string;
};

type ItemProps = {
  item: Item;
  isEditing: boolean;
  editingValue: string;
  onEditChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ConfigItem({
  item,
  isEditing,
  editingValue,
  onEditChange,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: ItemProps) {
  return (
    <div className="group bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 hover:border-yellow-400/40 hover:bg-white/10 transition-all">
      <div className="flex justify-between items-center gap-1.5 sm:gap-2">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 flex-1 min-w-0">
          {isEditing ? (
            <>
              <input
                value={editingValue}
                onChange={(e) => onEditChange(e.target.value)}
                autoFocus
                className="flex-1 min-w-0 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl bg-white/10 border border-yellow-400/30 text-white outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSave();
                  if (e.key === "Escape") onCancel();
                }}
              />

              <button
                onClick={onSave}
                className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-green-500/20 text-green-300 hover:bg-green-500/30 flex items-center justify-center transition flex-shrink-0"
              >
                <Check size={14} />
              </button>

              <button
                onClick={onCancel}
                className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 flex items-center justify-center transition flex-shrink-0"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <h3 className="text-white font-semibold text-sm sm:text-base truncate flex-1">
              {item.name}
            </h3>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-1 sm:gap-2 flex-shrink-0 ml-1">
            <button
              onClick={onEdit}
              className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20 flex items-center justify-center transition"
            >
              <Pencil size={13} />
            </button>

            <button
              onClick={onDelete}
              className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500/20 flex items-center justify-center transition cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
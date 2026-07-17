import React, { useState, useMemo } from 'react';
import { X, Plus } from 'lucide-react';

interface MultiSelectChipsProps {
  label: string;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  options: string[];
  chipColor: string;
  searchPlaceholder?: string;
}

export const MultiSelectChips: React.FC<MultiSelectChipsProps> = ({
  label,
  items,
  onAdd,
  onRemove,
  options,
  chipColor,
  searchPlaceholder = 'Search...',
}) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    return options.filter(
      (opt) =>
        opt.toLowerCase().includes(search.toLowerCase()) &&
        !items.includes(opt)
    );
  }, [search, items, options]);

  const handleAdd = (item: string) => {
    onAdd(item);
    setSearch('');
  };

  return (
    <div className="mt-3">
      <label className="text-emerald-100 text-sm block font-medium mb-1.5">{label}</label>
      <div className="relative">
        <div
          className="flex flex-wrap gap-2 min-h-[50px] p-2 rounded-xl 
            bg-white/5 border border-white/20 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {items.map((item) => (
            <span
              key={item}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${chipColor} text-sm`}
            >
              {item}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item);
                }}
                className="cursor-pointer hover:text-red-300 transition"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full 
              bg-white/10 text-white/70 text-sm hover:bg-white/20 transition cursor-pointer"
          >
            <Plus size={14} /> Add
          </button>
        </div>

        {isOpen && (
          <div
            className="absolute z-20 w-full mt-1 rounded-xl bg-emerald-800 
              border border-white/20 shadow-lg overflow-hidden"
          >
            {/* Search and Close Header Box */}
            <div className="p-2 border-b border-white/10 flex gap-2 items-center">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white 
                  placeholder-white/40 outline-none text-sm"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 
                  transition cursor-pointer flex items-center justify-center aspect-square"
                title="Close dropdown"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="max-h-40 overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => handleAdd(opt)}
                    className="px-4 py-2 text-white hover:bg-yellow-400/20 
                      cursor-pointer transition text-sm"
                  >
                    {opt}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-white/50 text-sm">No options available</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

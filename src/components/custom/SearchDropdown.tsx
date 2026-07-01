import { Search } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface Option {
  id: number;
  name: string;
}

interface Props {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  dropUp?: boolean;
  hideSearch?: boolean;
  className?: string;
  labelClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  inputClassName?: string;
  triggerClassName?: string;
  iconClassName?: string;
  maxHeight?: string;
  autoFocus?: boolean;
  closeOnSelect?: boolean;
}

export default function SearchDropdown({
  label,
  placeholder,
  icon,
  options,
  value,
  onChange,
  isOpen = false,
  onToggle,
  onClose,
  dropUp = false,
  hideSearch = false,
  className = "",
  labelClassName = "text-green-100 text-xs sm:text-sm mb-2 block",
  dropdownClassName = "",
  optionClassName = "px-4 py-3 text-white hover:bg-yellow-400/20 cursor-pointer text-sm sm:text-base",
  inputClassName = "w-full px-3 py-2 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base",
  triggerClassName = "w-full px-4 py-3 sm:py-4 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm sm:text-base",
  iconClassName = "text-yellow-300 flex-shrink-0 ml-2",
  maxHeight = "max-h-52",
  autoFocus = true,
  closeOnSelect = true,
}: Props) {
  const [search, setSearch] = useState("");
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [, setShouldDropUp] = useState(dropUp);

  const filtered = useMemo(() => {
    if (hideSearch) return options;
    return options.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options, hideSearch]);

  // Compute position whenever isOpen changes
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 300; // approximate
      const up = dropUp || (spaceBelow < dropdownHeight && rect.top > spaceBelow);

      setShouldDropUp(up);
      setDropdownPosition({
        top: up ? rect.top - 10 : rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen, dropUp]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        if (isOpen && onClose) {
          onClose();
        }
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        if (onClose) onClose();
        setSearch("");
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleToggle = () => {
    if (onToggle) onToggle();
    if (!isOpen) setSearch("");
  };

  const handleSelect = (item: Option) => {
    onChange(item.name);
    if (closeOnSelect && onClose) onClose();
    setSearch("");
  };

  return (
    <div className={className}>
      {label && <label className={labelClassName}>{label}</label>}

      <div ref={triggerRef} onClick={handleToggle} className={triggerClassName}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="flex-shrink-0">{icon}</span>
          <span className={`truncate ${value ? "text-white" : "text-white/50"}`}>
            {value || placeholder}
          </span>
        </div>
        <Search size={16} className={iconClassName} />
      </div>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 99999,
            }}
            className={`
              rounded-2xl
              bg-emerald-950/95
              backdrop-blur-2xl
              border border-white/20
              shadow-2xl
              overflow-hidden
              ${dropdownClassName}
            `}
          >
            {!hideSearch && (
              <div className="p-3 border-b border-white/10">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${label}`}
                  className={inputClassName}
                  autoFocus={autoFocus}
                />
              </div>
            )}

            <div className={`${maxHeight} overflow-y-auto`}>
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={optionClassName}
                  >
                    {item.name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-white/50 text-sm sm:text-base">
                  No results found
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
import { BookOpen, Building2, Layers3, Sunrise } from "lucide-react";
import SearchDropdown from "../../components/custom/SearchDropdown";
import FormInput from "./FormInput";

interface ClassFormProps {
  className: string;
  setClassName: (value: string) => void;
  campusName: string;
  department: string;
  setDepartment: (value: string) => void;
  batch: string;
  setBatch: (value: string) => void;
  shift: string;
  setShift: (value: string) => void;
  openDropdown: string | null;
  onDropdownToggle: (name: string) => void;
  departments: { id: number; name: string }[];
  batches: { id: number; name: string }[];
  shifts: { id: number; name: string }[];
}

export default function ClassForm({
  className,
  setClassName,
  campusName,
  department,
  setDepartment,
  batch,
  setBatch,
  shift,
  setShift,
  openDropdown,
  onDropdownToggle,
  departments,
  batches,
  shifts,
}: ClassFormProps) {
  return (
    <div className="px-4 sm:px-8 pb-2 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
      {/* Class Name Input */}
      <FormInput
        label="Class Name"
        placeholder="e.g. Al-Aula"
        value={className}
        onChange={setClassName}
        icon={BookOpen}
      />

      {/* Campus Input (disabled) */}
      <FormInput
        label="Campus Name"
        value={campusName}
        icon={Building2}
        disabled
      />

      <SearchDropdown
        label="Department"
        placeholder="Select Department"
        icon={<Building2 size={18} className="text-yellow-300" />}
        options={departments}
        value={department}
        onChange={setDepartment}
        isOpen={openDropdown === "department"}
        onToggle={() => onDropdownToggle("department")}
        onClose={() => onDropdownToggle("department")}
      />

      <SearchDropdown
        label="Batch"
        placeholder="Select Batch"
        icon={<Layers3 size={18} className="text-yellow-300" />}
        options={batches}
        value={batch}
        onChange={setBatch}
        isOpen={openDropdown === "batch"}
        onToggle={() => onDropdownToggle("batch")}
        onClose={() => onDropdownToggle("batch")}
      />

      <SearchDropdown
        label="Shift"
        placeholder="Select Shift"
        icon={<Sunrise size={18} className="text-yellow-300" />}
        options={shifts}
        value={shift}
        onChange={setShift}
        isOpen={openDropdown === "shift"}
        onToggle={() => onDropdownToggle("shift")}
        onClose={() => onDropdownToggle("shift")}
        dropUp={true}
        hideSearch={true}
      />
    </div>
  );
}
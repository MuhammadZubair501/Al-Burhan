// Class/Model/ClassModal.tsx
import { useEffect, useState } from "react";
import {
  X,
  School,
  BookOpen,
  Building2,
  Layers3,
  Sunrise,
} from "lucide-react";

import SearchDropdown from "../../components/custom/SearchDropdown";
import ApiRoutes from "../../services/ApiRoutes";
import type { CampusType } from "../../types/CampusType";
import loadDepartments from "../../types/Department";
import loadBatches from "../../types/Batch";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    className: string;
    department: string;
    batch: string;
    shift: string;
  }) => void;
  editData?: any;
  mode?: 'create' | 'edit';
}

const shifts = [
  { id: 1, name: "Morning" },
  { id: 2, name: "Evening" },
];

export default function ClassModal({
  isOpen,
  onClose,
  onSave,
  editData,
  mode = 'create'
}: Props) {
  const [className, setClassName] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [shift, setShift] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const [campus, setCampus] = useState<CampusType | null>(null);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [batches, setBatches] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const campusId = Number(window.CampusID);

  // Fetch data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchAllModalData = async () => {
      setLoading(true);
      try {
        // Fetch Campus Details
        const url = ApiRoutes.campusById(campusId);
        const campusRes = await fetch(url);
        const campusData = await campusRes.json();
        setCampus(campusData);

        // Fetch Departments
        const fetchedDepartments = await loadDepartments(campusId);
        console.log("Departments successfully fetched:", fetchedDepartments);
        setDepartments(fetchedDepartments);

        // Fetch Batches
        const fetchedBatches = await loadBatches(campusId);
        console.log("Batches successfully fetched:", fetchedBatches);
        setBatches(fetchedBatches);

        // If in edit mode, populate form data
        if (mode === 'edit' && editData) {
          populateEditData();
        }
      } catch (err) {
        console.error("Error loading modal data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllModalData();
  }, [isOpen, campusId, mode, editData]);

  // Populate form with edit data
  const populateEditData = () => {
    if (editData) {
      setClassName(editData.class_name || "");
      setDepartment(editData.department_name || "");
      setBatch(editData.batch_name || "");
      setShift(editData.shift || "");
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setClassName("");
    setDepartment("");
    setBatch("");
    setShift("");
    setOpenDropdown(null);
    onClose();
  };

  if (!isOpen) return null;

  const isValid = className && department && batch && shift;

  const handleSubmit = () => {
    if (!isValid) return;

    onSave({
      className,
      department,
      batch,
      shift,
    });

    // Reset form after save
    setClassName("");
    setDepartment("");
    setBatch("");
    setShift("");
    setOpenDropdown(null);
    onClose();
  };

  const handleDropdownToggle = (dropdownName: string) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdownName);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
          <span>Loading data...</span>
        </div>
      </div>
    );
  }

  if (!campus) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 text-white">
        <div className="bg-red-500/20 p-6 rounded-2xl border border-red-500/50">
          <p className="text-red-300">Campus data could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Glow - hidden on small screens */}
      <div className="absolute w-[650px] h-[650px] bg-yellow-400/10 blur-3xl rounded-full hidden sm:block" />

      {/* Modal */}
      <div
        className="
          relative
          w-full
          max-w-2xl
          rounded-[32px]
          bg-white/10
          backdrop-blur-2xl
          border border-white/20
          shadow-[0_25px_70px_rgba(0,0,0,0.45)]
          overflow-visible
          max-h-[95vh]
          flex flex-col
        "
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="
            absolute top-4 right-4
            w-10 h-10
            rounded-xl
            bg-white/10
            text-white
            hover:bg-red-500/20
            flex items-center justify-center
            z-10
          "
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 text-center flex-shrink-0">
          <div
            className="
              mx-auto w-16 h-16 sm:w-20 sm:h-20
              rounded-2xl sm:rounded-3xl
              bg-gradient-to-r
              from-yellow-400
              to-amber-500
              flex items-center justify-center
              shadow-xl
            "
          >
            <School
              size={32}
              className="text-green-950 sm:w-10 sm:h-10"
            />
          </div>

          <h2 className="mt-4 sm:mt-5 text-2xl sm:text-3xl font-bold text-white">
            {mode === 'edit' ? 'Edit Class' : 'Create Class'}
          </h2>

          <p className="text-green-100 mt-1 sm:mt-2 text-sm sm:text-base">
            {mode === 'edit' ? 'Update class information' : 'Add class information and academic details'}
          </p>
        </div>

        {/* Form - Scrollable */}
        <div className="px-4 sm:px-8 pb-2 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Class Name */}
          <div>
            <label className="text-green-100 text-xs sm:text-sm mb-2 block">
              Class Name
            </label>

            <div className="relative">
              <BookOpen
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300"
              />

              <input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. Al-Aula"
                className="
                  w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-4
                  rounded-2xl
                  bg-white/10
                  border border-white/20
                  text-white
                  outline-none
                  focus:ring-2 focus:ring-yellow-400
                  text-sm sm:text-base
                "
              />
            </div>
          </div>

          {/* Campus */}
          <div>
            <label className="text-green-100 text-xs sm:text-sm mb-2 block">
              Campus Name
            </label>

            <div className="relative">
              <Building2
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300"
              />

              <input
                disabled
                value={campus.campus_name}
                className="
                  w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-4
                  rounded-2xl
                  bg-white/5
                  border border-white/10
                  text-white/70
                  cursor-not-allowed
                  text-sm sm:text-base
                "
              />
            </div>
          </div>

          {/* Department Dropdown */}
          <SearchDropdown
            label="Department"
            placeholder="Select Department"
            icon={<Building2 size={18} className="text-yellow-300" />}
            options={departments}
            value={department}
            onChange={setDepartment}
            isOpen={openDropdown === "department"}
            onToggle={() => handleDropdownToggle("department")}
            onClose={() => setOpenDropdown(null)}
          />

          {/* Batch Dropdown */}
          <SearchDropdown
            label="Batch"
            placeholder="Select Batch"
            icon={<Layers3 size={18} className="text-yellow-300" />}
            options={batches}
            value={batch}
            onChange={setBatch}
            isOpen={openDropdown === "batch"}
            onToggle={() => handleDropdownToggle("batch")}
            onClose={() => setOpenDropdown(null)}
          />

          {/* Shift Dropdown */}
          <SearchDropdown
            label="Shift"
            placeholder="Select Shift"
            icon={<Sunrise size={18} className="text-yellow-300" />}
            options={shifts}
            value={shift}
            onChange={setShift}
            isOpen={openDropdown === "shift"}
            onToggle={() => handleDropdownToggle("shift")}
            onClose={() => setOpenDropdown(null)}
            dropUp={true}
            hideSearch={true}
          />
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-8 py-4 sm:py-8 flex flex-col sm:flex-row justify-end gap-3 flex-shrink-0 border-t border-white/10">
          <button
            onClick={handleClose}
            className="
              w-full sm:w-auto
              px-6 py-3
              rounded-2xl
              bg-white/10
              text-white
              hover:bg-white/20
              text-sm sm:text-base
              transition-colors
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="
              w-full sm:w-auto
              px-8 py-3
              rounded-2xl
              bg-gradient-to-r
              from-yellow-400
              to-amber-500
              text-green-950
              font-bold
              hover:scale-105
              transition
              disabled:opacity-40
              disabled:hover:scale-100
              text-sm sm:text-base
              cursor-pointer
            "
          >
            {mode === 'edit' ? 'Update Class' : 'Save Class'}
          </button>
        </div>
      </div>
    </div>
  );
}
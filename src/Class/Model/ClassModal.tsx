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
import Portal from "../../components/common/Portal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    className: string;
    department: string;
    batch: string;
    shift: string;
    campusId: number; // Make it required, not optional
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get campus ID from window object with proper fallback
  const getCampusId = (): number => {
    const id = window.CampusID;
    if (!id) {
      console.error('CampusID not found in window object');
      return 0;
    }
    const parsedId = Number(id);
    if (isNaN(parsedId) || parsedId === 0) {
      console.error('Invalid CampusID:', id);
      return 0;
    }
    return parsedId;
  };

  const campusId = getCampusId();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard shortcut - Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting]);

  // Fetch data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchAllModalData = async () => {
      setLoading(true);
      try {
        // Check if campusId is valid
        if (!campusId || campusId === 0) {
          console.error('Invalid campus ID:', campusId);
          setLoading(false);
          return;
        }

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
    if (!isValid || isSubmitting) return;

    // Validate campus ID before submitting
    const finalCampusId = campus?.campus_id || campusId || window.CampusID;
    
    if (!finalCampusId) {
      console.error('No campus ID available for submission');
      setIsSubmitting(false);
      return;
    }

    const numericCampusId = Number(finalCampusId);
    if (isNaN(numericCampusId) || numericCampusId === 0) {
      console.error('Invalid campus ID for submission:', finalCampusId);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting with campusId:', numericCampusId); // Debug log
      
      onSave({
        className,
        department,
        batch,
        shift,
        campusId: numericCampusId
      });

      // Reset form after save
      setClassName("");
      setDepartment("");
      setBatch("");
      setShift("");
      setOpenDropdown(null);
      onClose();
    } catch (error) {
      console.error('Error saving class:', error);
    } finally {
      setIsSubmitting(false);
    }
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
      <Portal>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-yellow-400 border-t-transparent"></div>
            <span className="text-white text-sm sm:text-base">Loading data...</span>
          </div>
        </div>
      </Portal>
    );
  }

  if (!campus) {
    return (
      <Portal>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-red-500/20 p-4 sm:p-6 rounded-2xl border border-red-500/50 max-w-md mx-4">
            <p className="text-red-300 text-sm sm:text-base">
              Campus data could not be found. Please refresh the page.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-yellow-400 text-green-950 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Portal>
    );
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center p-2 sm:p-3 md:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-2xl my-1 sm:my-2 md:my-4" onClick={e => e.stopPropagation()}>
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[98vh] sm:max-h-[95vh] md:max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="
                absolute top-3 right-3 z-20
                w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
                rounded-xl
                bg-white/10
                text-white
                hover:bg-red-500/30
                flex items-center justify-center
                transition
                disabled:opacity-50
              "
            >
              <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>

            {/* Header - Fixed */}
            <div className="flex-shrink-0 sticky top-0 z-10 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900/95 backdrop-blur-xl px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 text-center border-b border-white/10">
              <div
                className="
                  mx-auto w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20
                  rounded-2xl sm:rounded-3xl
                  bg-gradient-to-r
                  from-yellow-400
                  to-amber-500
                  flex items-center justify-center
                  shadow-xl
                "
              >
                <School
                  size={28}
                  className="text-green-950 sm:w-8 sm:h-8 md:w-10 md:h-10"
                />
              </div>

              <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl font-bold text-white">
                {mode === 'edit' ? 'Edit Class' : 'Create Class'}
              </h2>

              <p className="text-green-100 mt-1 text-sm sm:text-base">
                {mode === 'edit' ? 'Update class information' : 'Add class information and academic details'}
              </p>
            </div>

            {/* Form - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5 custom-scrollbar">
              {/* Class Name */}
              <div>
                <label className="text-green-100 text-sm font-medium mb-1.5 block">
                  Class Name
                </label>
                <div className="relative">
                  <BookOpen
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300"
                  />
                  <input
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="e.g. Al-Aula"
                    disabled={isSubmitting}
                    className="
                      w-full py-2.5 sm:py-3 pl-10 pr-3
                      rounded-xl sm:rounded-2xl
                      bg-white/10
                      border border-white/20
                      text-white
                      outline-none
                      focus:ring-2 focus:ring-yellow-400
                      text-sm sm:text-base
                      placeholder-white/40
                      disabled:opacity-50
                    "
                  />
                </div>
              </div>

              {/* Campus */}
              <div>
                <label className="text-green-100 text-sm font-medium mb-1.5 block">
                  Campus Name
                </label>
                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300"
                  />
                  <input
                    disabled
                    value={campus.campus_name}
                    className="
                      w-full py-2.5 sm:py-3 pl-10 pr-3
                      rounded-xl sm:rounded-2xl
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
                dropUp={false}
                hideSearch={false}
                className="w-full"
                triggerClassName="w-full px-3 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm sm:text-base"
                dropdownClassName="w-full"
                optionClassName="px-3 py-2.5 text-white hover:bg-yellow-400/20 cursor-pointer text-sm sm:text-base"
           
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
                dropUp={false}
                hideSearch={false}
                className="w-full"
                triggerClassName="w-full px-3 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm sm:text-base"
                dropdownClassName="w-full"
                optionClassName="px-3 py-2.5 text-white hover:bg-yellow-400/20 cursor-pointer text-sm sm:text-base"
           
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
                className="w-full"
                triggerClassName="w-full px-3 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm sm:text-base"
                dropdownClassName="w-full"
                optionClassName="px-3 py-2.5 text-white hover:bg-yellow-400/20 cursor-pointer text-sm sm:text-base"
               
              />
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 sticky bottom-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900/95 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 border-t border-white/10">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="
                  w-full sm:w-auto
                  px-4 sm:px-6 py-2.5 sm:py-3
                  rounded-xl sm:rounded-2xl
                  bg-white/10
                  text-white
                  hover:bg-white/20
                  text-sm sm:text-base
                  transition-colors
                  disabled:opacity-50
                  order-2 sm:order-1
                "
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                className="
                  w-full sm:w-auto
                  px-6 sm:px-8 py-2.5 sm:py-3
                  rounded-xl sm:rounded-2xl
                  bg-gradient-to-r
                  from-yellow-400
                  to-amber-500
                  text-green-950
                  font-bold
                  hover:scale-[1.02]
                  transition-all
                  disabled:opacity-40
                  disabled:hover:scale-100
                  text-sm sm:text-base
                  flex items-center justify-center gap-2
                  order-1 sm:order-2
                  shadow-lg shadow-yellow-500/20
                "
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-green-950 border-t-transparent"></span>
                    {mode === 'edit' ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  mode === 'edit' ? 'Update Class' : 'Save Class'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.4);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.6);
        }
      `}</style>
    </Portal>
  );
}
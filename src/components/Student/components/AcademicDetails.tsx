// components/Student/components/AcademicDetails.tsx
import React from 'react';
import { TextInput } from './TextInput';
import SearchDropdown from '../../custom/SearchDropdown';
import type { StudentFormData } from '../types/student';
import { Layers3, BookOpen, GraduationCap } from 'lucide-react';

interface AcademicDetailsProps {
  formData: StudentFormData;
  updateField: (field: string, value: any) => void;
  errors: Record<string, string>;
  batches?: { id: number; name: string }[];
  loadingBatches?: boolean;
  classes?: { id: number; name: string }[];
  loadingClasses?: boolean;
  degrees?: { id: number; name: string }[];
  loadingDegrees?: boolean;
  openDropdown?: string | null;
  onDropdownToggle?: (dropdown: string) => void;
  onDropdownClose?: () => void;
  campusId?: number;
}

export const AcademicDetails: React.FC<AcademicDetailsProps> = ({
  formData,
  updateField,
  errors,
  batches = [],
  loadingBatches = false,
  classes = [],
  loadingClasses = false,
  degrees = [],
  loadingDegrees = false,
  openDropdown = null,
  onDropdownToggle,
  onDropdownClose,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-base sm:text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center text-xs">2</span>
        Academic Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Roll / Admission Number"
          value={formData.admissionNumber}
          onChange={(v) => updateField('admissionNumber', v)}
          error={errors.admissionNumber}
          required
          placeholder="Enter admission number"
        />

        {/* Enrollment Class Dropdown */}
        <div>
          <SearchDropdown
            label="Enrollment Class"
            placeholder={loadingClasses ? "Loading classes..." : "Select Class"}
            icon={<BookOpen size={18} className="text-yellow-300" />}
            options={classes}
            value={formData.enrollmentClass}
            onChange={(v) => updateField('enrollmentClass', v)}
            isOpen={openDropdown === "enrollmentClass"}
            onToggle={() => onDropdownToggle && onDropdownToggle("enrollmentClass")}
            onClose={onDropdownClose}
            dropUp={true}
            hideSearch={false}
            className="w-full"
            triggerClassName="w-full px-4 py-3 sm:py-4 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm sm:text-base"
            inputClassName="w-full px-3 py-2 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
            optionClassName="px-4 py-3 text-white hover:bg-yellow-400/20 cursor-pointer text-sm sm:text-base"
          />
          {errors.enrollmentClass && <p className="text-red-300 text-xs mt-1">{errors.enrollmentClass}</p>}
        </div>

        {/* Batch Dropdown */}
        <div>
          <SearchDropdown
            label="Batch"
            placeholder={loadingBatches ? "Loading batches..." : "Select Batch"}
            icon={<Layers3 size={18} className="text-yellow-300" />}
            options={batches}
            value={formData.batch}
            onChange={(v) => updateField('batch', v)}
            isOpen={openDropdown === "batch"}
            onToggle={() => onDropdownToggle && onDropdownToggle("batch")}
            onClose={onDropdownClose}
            dropUp={true}
            hideSearch={false}
            className="w-full"
            triggerClassName="w-full px-4 py-3 sm:py-4 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm sm:text-base"
            inputClassName="w-full px-3 py-2 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
            optionClassName="px-4 py-3 text-white hover:bg-yellow-400/20 cursor-pointer text-sm sm:text-base"
          />
          {errors.batch && <p className="text-red-300 text-xs mt-1">{errors.batch}</p>}
        </div>

        {/* Highest Qualification Dropdown (Degrees from DB) */}
        <div>
          <SearchDropdown
            label="Highest Qualification"
            placeholder={loadingDegrees ? "Loading degrees..." : "Select Degree"}
            icon={<GraduationCap size={18} className="text-yellow-300" />}
            options={degrees}
            value={formData.highestQualification}
            onChange={(v) => updateField('highestQualification', v)}
            isOpen={openDropdown === "degree"}
            onToggle={() => onDropdownToggle && onDropdownToggle("degree")}
            onClose={onDropdownClose}
            dropUp={true}
            hideSearch={false}
            className="w-full"
            triggerClassName="w-full px-4 py-3 sm:py-4 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm sm:text-base"
            inputClassName="w-full px-3 py-2 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
            optionClassName="px-4 py-3 text-white hover:bg-yellow-400/20 cursor-pointer text-sm sm:text-base"
          />
          {errors.highestQualification && <p className="text-red-300 text-xs mt-1">{errors.highestQualification}</p>}
        </div>
      </div>
    </div>
  );
};
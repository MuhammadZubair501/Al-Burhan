// components/AdditionalDetails.tsx
import React from 'react';
import { type StudentFormData } from '../types/student';

interface AdditionalDetailsProps {
  formData: StudentFormData;
  updateField: (field: keyof StudentFormData | string, value: any) => void;
  errors: Record<string, string>;
}

export const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  formData,
  updateField,
  // errors
}) => {
  // const todayDate = new Date().toISOString().split('T')[0];

  return (
    <div className="mb-6 mt-6">
      <h3 className="text-base sm:text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center text-xs">3</span>
        Additional Details
      </h3>
{/* 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       

        <TextInput
          label="Joining Date"
          value={formData.joiningDate}
          onChange={(v) => updateField('joiningDate', v)}
          error={errors.joiningDate}
          required
          type="date"
          max={todayDate}
        />
      </div> */}

      <div className="mt-4">
        <label className="text-emerald-100 text-sm mb-1 block">Extra Details</label>
        <textarea
          value={formData.extraDetails}
          onChange={(e) => updateField('extraDetails', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
          placeholder="Any additional information about the student..."
        />
      </div>
    </div>
  );
};
// components/Student/components/PersonalDetails.tsx
import React from 'react';
import { User, Phone, Mail, IdCard } from 'lucide-react';
import { TextInput } from './TextInput';
import { RadioGroup } from './RadioGroup';
import { ImageUpload } from './ImageUpload';
import type { StudentFormData } from '../types/student';
import { 
  validateCNIC, 
  validatePhone, 
  validateEmail, 
  formatCNIC, 
  formatPakPhone 
} from '../utils/validation';

interface PersonalDetailsProps {
  formData: StudentFormData;
  updateField: (field: string, value: any) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  formData,
  updateField,
  errors,
  setErrors
}) => {
  const todayDate = new Date().toISOString().split('T')[0];

  const handlePhoneChange = (value: string) => {
    const formatted = formatPakPhone(value);
    updateField('phone', formatted);
    
    if (formatted.replace(/\s/g, '').length > 0 && !validatePhone(formatted)) {
      setErrors({ ...errors, phone: 'Invalid phone format (e.g., +92 300 1234567)' });
    } else {
      setErrors({ ...errors, phone: '' });
    }
  };

  const handleCNICChange = (value: string) => {
    const formatted = formatCNIC(value);
    updateField('cnic', formatted);
    
    if (formatted.length === 15 && !validateCNIC(formatted)) {
      setErrors({ ...errors, cnic: 'Invalid CNIC format (e.g., 42000-1234567-1)' });
    } else {
      setErrors({ ...errors, cnic: '' });
    }
  };

  const handleEmergencyChange = (value: string) => {
    const formatted = formatPakPhone(value);
    updateField('emergencyContact', formatted);
    
    if (formatted.replace(/\s/g, '').length > 0 && !validatePhone(formatted)) {
      setErrors({ ...errors, emergencyContact: 'Invalid phone format (e.g., +92 300 1234567)' });
    } else {
      setErrors({ ...errors, emergencyContact: '' });
    }
  };

  const handleImageChange = (file: File | null, preview: string) => {
    updateField('studentPicture', file);
    updateField('studentPreview', preview);
  };

  return (
    <div className="mb-6">
      <h3 className="text-base sm:text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center text-xs">1</span>
        Personal Details
      </h3>

      <ImageUpload
        value={formData.studentPreview}
        onChange={handleImageChange}
        error={errors.studentPicture}
        className="mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="First Name"
          value={formData.firstName}
          onChange={(v) => updateField('firstName', v)}
          error={errors.firstName}
          required
          icon={<User size={18} />}
          placeholder="John"
        />

        <TextInput
          label="Last Name"
          value={formData.lastName}
          onChange={(v) => updateField('lastName', v)}
          error={errors.lastName}
          required
          icon={<User size={18} />}
          placeholder="Doe"
        />

        <TextInput
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={(v) => updateField('dateOfBirth', v)}
          error={errors.dateOfBirth}
          required
          type="date"
          max={todayDate}
        />

        <RadioGroup
          label="Gender"
          value={formData.gender}
          onChange={(v) => updateField('gender', v)}
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ]}
          error={errors.gender}
          required
        />

        <TextInput
          label="CNIC"
          value={formData.cnic}
          onChange={handleCNICChange}
          error={errors.cnic}
          required
          icon={<IdCard size={18} />}
          placeholder="42000-1234567-1"
        />

        <TextInput
          label="Phone Number"
          value={formData.phone}
          onChange={handlePhoneChange}
          error={errors.phone}
          required
          icon={<Phone size={18} />}
          placeholder="+92 300 1234567"
        />

        <TextInput
          label="Email Address"
          value={formData.email}
          onChange={(v) => {
            updateField('email', v);
            if (v && !validateEmail(v)) {
              setErrors({ ...errors, email: 'Invalid email format' });
            } else {
              setErrors({ ...errors, email: '' });
            }
          }}
          error={errors.email}
          required
          icon={<Mail size={18} />}
          placeholder="student@school.edu"
          type="email"
        />

        <TextInput
          label="Emergency Contact Number"
          value={formData.emergencyContact}
          onChange={handleEmergencyChange}
          error={errors.emergencyContact}
          required
          icon={<Phone size={18} />}
          placeholder="+92 300 1234567"
        />
      </div>
    </div>
  );
};
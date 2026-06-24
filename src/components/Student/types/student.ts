// types/student.ts
export interface StudentFormData {
  // Personal Details
  studentPicture: File | null;
  studentPreview: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
  cnic: string;
  phone: string;
  email: string;
  emergencyContact: string;
  
  // Academic Enrollment
  admissionNumber: string;
  enrollmentClass: string;
  batch: string;
  highestQualification: string;
  
  // Additional
  shift: 'morning' | 'evening' | '';
  joiningDate: string;
  extraDetails: string;
}

export const SHIFTS = ['morning', 'evening'] as const;
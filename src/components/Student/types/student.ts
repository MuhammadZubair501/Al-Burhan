// types/student.ts
// types/student.ts
export interface StudentResponse {
  student_id: number;
  section_id: number;
  batch_id: number | null;
  roll_number: string | null;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  cnic: string;
  phone_number: string;
  email_address: string;
  emergency_contact_number: string;
  last_previous_highest_qualification: string | null;
  shift: string;
  joining_date: string;
  profile_image_path: string | null;
  extra_details: string | null;
  campus_id: number;
  is_active: boolean; // Add this field
  // Joined fields
  section_name?: string;
  class_id?: number;
  class_name?: string;
  batch_name?: string;
  campus_name?: string;
}

export interface StudentFormData {
  studentId?: number;
  className?: string;
  sectionName?: string;
  batchName?: string;
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
  admissionNumber: string;
  enrollmentClass: string;
  batch: string;
  highestQualification: string;
  shift: 'morning' | 'evening' | '';
  joiningDate: string;
  extraDetails: string;
  is_active: boolean; // Add this field
}
export const SHIFTS = ['morning', 'evening'] as const;
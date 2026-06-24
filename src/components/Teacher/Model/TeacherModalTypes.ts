export interface CampusType {
  id: number;
  campus_name: string;
  campus_code?: string;
  address?: string;
  city?: string;
}

export interface TeacherModalData {
  // Basic Information
  profilePicture: File | null;
  profilePreview: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | '';
  cnic: string;
  emergencyNumber: string;
  // Professional Details
  teacherId: string;
  joiningDate: string;
  department: string;
  assignedClasses: string[];
  subjectsTaught: string[];
  shift: 'morning' | 'evening' | '';
  campus: string;
  campusId?: number;
  // Qualifications & Files
  highestDegree: string;
  extraDetail: string;
}

export interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TeacherModalData) => void;
  initialData?: Partial<TeacherModalData>;
  mode?: 'create' | 'edit';
}
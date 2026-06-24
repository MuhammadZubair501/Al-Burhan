// StudentModel.tsx
import { useState, useEffect } from 'react';
import { X, GraduationCap } from 'lucide-react';
import { PersonalDetails } from './components/PersonalDetails';
import { AcademicDetails } from './components/AcademicDetails';
import { AdditionalDetails } from './components/AdditionalDetails';
import type { StudentFormData } from './types/student';
import { validateEmail, validatePhone, validateCNIC } from './utils/validation';
import { studentService } from '../../services/studentService';
import ApiRoutes from '../../services/ApiRoutes';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StudentFormData) => void;
  initialData?: Partial<StudentFormData>;
  lastAdmissionNumber?: number;
  campusId?: number;
}

const initialFormData: StudentFormData = {
  studentPicture: null,
  studentPreview: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  cnic: '',
  phone: '',
  email: '',
  emergencyContact: '',
  admissionNumber: '',
  enrollmentClass: '',
  batch: '',
  highestQualification: '',
  shift: '',
  joiningDate: '',
  extraDetails: ''
};

export default function StudentForm({
  isOpen,
  onClose,
  onSave,
  initialData,
  lastAdmissionNumber = 24001,
  campusId
}: StudentFormProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    ...initialFormData,
    ...initialData,
    admissionNumber: initialData?.admissionNumber || String(lastAdmissionNumber)
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [batches, setBatches] = useState<{ id: number; name: string }[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Get campus ID from props or window
  const currentCampusId = campusId || Number(window.CampusID) || 1;

  // Load batches and classes when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      // Load Batches
      setLoadingBatches(true);
      try {
        const response = await fetch(ApiRoutes.BATCH);
        const data = await response.json();
        console.log("Batches loaded:", data);
        const mappedBatches = data.map((item: any) => ({
          id: Number(item.batch_id || item.id),
          name: String(item.batch_name || item.name),
        }));
        setBatches(mappedBatches);
      } catch (err) {
        console.error("Error loading batches:", err);
      } finally {
        setLoadingBatches(false);
      }

      // Load Classes
      setLoadingClasses(true);
      try {
        console.log(`Fetching sections/classes for Campus ID: ${currentCampusId}...`);
        const response = await fetch(ApiRoutes.sectionByCampusId(currentCampusId));
        const data = await response.json();
        console.log('Classes fetched:', data);
        
        const mappedClasses = data.map((item: any) => ({
          id: Number(item.section_id || item.id),
          name: `${item.class_name}${item.section_name ? ` - ${item.section_name}` : ''}`,
        }));
        setClasses(mappedClasses);
      } catch (err) {
        console.error("Error loading classes:", err);
      } finally {
        setLoadingClasses(false);
      }
    };

    loadData();
  }, [isOpen, currentCampusId]);

  if (!isOpen) return null;

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDropdownToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Personal Details Validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Please select gender';
    if (!formData.cnic) newErrors.cnic = 'CNIC is required';
    else if (!validateCNIC(formData.cnic)) newErrors.cnic = 'Invalid CNIC format (e.g., 42000-1234567-1)';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Invalid phone format (e.g., +92 300 1234567)';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.emergencyContact) newErrors.emergencyContact = 'Emergency contact is required';
    else if (!validatePhone(formData.emergencyContact)) newErrors.emergencyContact = 'Invalid phone format';
    
    // Academic Details Validation
    if (!formData.admissionNumber) newErrors.admissionNumber = 'Admission number is required';
    if (!formData.enrollmentClass) newErrors.enrollmentClass = 'Please select enrollment class';
    if (!formData.batch) newErrors.batch = 'Please select batch';
    if (!formData.highestQualification) newErrors.highestQualification = 'Please select qualification';
    
    // Additional Details Validation
    if (!formData.shift) newErrors.shift = 'Please select shift';
    if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper to get section_id from class name
  const getSectionIdFromClassName = (className: string): number | null => {
    const classItem = classes.find(c => c.name === className);
    return classItem ? classItem.id : null;
  };

  // Helper to get batch_id from batch name
  const getBatchIdFromName = (batchName: string): number | null => {
    const batchItem = batches.find(b => b.name === batchName);
    return batchItem ? batchItem.id : null;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get section_id from the selected class name
      const sectionId = getSectionIdFromClassName(formData.enrollmentClass);
      if (!sectionId) {
        setSubmitError('Please select a valid class');
        setIsSubmitting(false);
        return;
      }

      // Get batch_id from the selected batch name
      const batchId = getBatchIdFromName(formData.batch);
      if (!batchId) {
        setSubmitError('Please select a valid batch');
        setIsSubmitting(false);
        return;
      }

      // Map form data to API expected format
      const apiData = {
        section_id: sectionId,
        batch_id: batchId,
        roll_number: formData.admissionNumber,
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        cnic: formData.cnic,
        phone_number: formData.phone.replace(/\s/g, ''),
        email_address: formData.email,
        emergency_contact_number: formData.emergencyContact.replace(/\s/g, ''),
        last_previous_highest_qualification: formData.highestQualification,
        shift: formData.shift,
        joining_date: formData.joiningDate,
        extra_details: formData.extraDetails || '',
        campus_id: currentCampusId,
        password: '123456',
        role: 'student'
      };

      console.log('Sending data to API:', apiData);

      const response = await studentService.createStudent(apiData);
      console.log('API Response:', response);
      
      if (response.success) {
        onSave(formData);
        onClose();
      } else {
        setSubmitError(response.message || 'Failed to enroll student. Please try again.');
      }
    } catch (error: any) {
      console.error('Error enrolling student:', error);
      setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl my-8">
        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 border border-white/20 shadow-2xl overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-xl bg-white/10 text-white hover:bg-red-500/30 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="px-4 sm:px-8 pt-6 pb-4 text-center border-b border-white/10">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-xl">
              <GraduationCap size={28} className="text-emerald-900" />
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">Student Enrollment</h2>
            <p className="text-emerald-100 mt-1 text-sm">Register new student with complete details</p>
          </div>

          {/* Form Content */}
          <div className="px-4 sm:px-8 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {submitError && (
              <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200">
                <p className="font-semibold">Error Enrolling Student</p>
                <p className="text-sm">{submitError}</p>
              </div>
            )}

            <PersonalDetails
              formData={formData}
              updateField={updateField}
              errors={errors}
              setErrors={setErrors}
            />
            
            <AcademicDetails
              formData={formData}
              updateField={updateField}
              errors={errors}
              batches={batches}
              loadingBatches={loadingBatches}
              classes={classes}
              loadingClasses={loadingClasses}
              openDropdown={openDropdown}
              onDropdownToggle={handleDropdownToggle}
              onDropdownClose={handleDropdownClose}
              campusId={currentCampusId}
            />
            
            <AdditionalDetails
              formData={formData}
              updateField={updateField}
              errors={errors}
            />
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-8 py-4 bg-black/20 flex flex-col sm:flex-row justify-end gap-3 border-t border-white/10">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-950 font-bold hover:scale-105 transition shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-950 border-t-transparent"></span>
                  Enrolling...
                </>
              ) : (
                'Enroll Student'
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
}
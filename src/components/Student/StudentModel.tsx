// StudentModel.tsx
import { useState, useEffect } from 'react';
import { X, GraduationCap, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2'; // <-- ADDED
import { PersonalDetails } from './components/PersonalDetails';
import { AcademicDetails } from './components/AcademicDetails';
import { AdditionalDetails } from './components/AdditionalDetails';
import type { StudentFormData } from './types/student';
import { validateEmail, validatePhone, validateCNIC } from './utils/validation';
import { studentService } from '../../services/studentService';
import ApiRoutes from '../../services/ApiRoutes';
import loadDegrees from '../../types/Degree';

interface BatchResponse {
  batch_id?: number;
  id?: number;
  batch_name?: string;
  name?: string;
}

interface SectionResponse {
  section_id?: number;
  id?: number;
  class_name?: string;
  section_name?: string;
  class_id?: number;
}

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StudentFormData) => void;
  onDelete?: (studentId: number) => void; // <-- ADDED optional delete callback
  initialData?: Partial<StudentFormData> & {
    studentId?: number;
    className?: string;
    sectionName?: string;
    batchName?: string;
    classId?: number;
    sectionId?: number;
    batchId?: number;
  };
  lastAdmissionNumber?: number;
  campusId?: number;
}

const initialFormData: StudentFormData = {
  studentId: undefined,
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
  onDelete,
  initialData,
  lastAdmissionNumber = 24001,
  campusId
}: StudentFormProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    ...initialFormData,
    ...initialData,
    admissionNumber: initialData?.admissionNumber || String(lastAdmissionNumber),
    studentPreview: initialData?.studentPreview || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [batches, setBatches] = useState<{ id: number; name: string }[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [degrees, setDegrees] = useState<{ id: number; name: string }[]>([]);
  const [loadingDegrees, setLoadingDegrees] = useState(false);
  const [classes, setClasses] = useState<{
    id: number;
    name: string;
    className: string;
    sectionName: string;
    classId: number;
    sectionId: number;
  }[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const currentCampusId = campusId || Number(window.CampusID) || 1;
  const isEditMode = !!initialData?.studentId;

  // Load batches, classes, and degrees when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setIsDataLoading(true);

      let loadedBatches: { id: number; name: string }[] = [];
      let loadedClasses: {
        id: number;
        name: string;
        className: string;
        sectionName: string;
        classId: number;
        sectionId: number;
      }[] = [];

      // Load Batches
      setLoadingBatches(true);
      try {
        const response = await fetch(ApiRoutes.BATCH);
        const data = await response.json();
        loadedBatches = (data as BatchResponse[]).map((item: BatchResponse) => ({
          id: Number(item.batch_id || item.id || 0),
          name: String(item.batch_name || item.name || ''),
        }));
        setBatches(loadedBatches);
      } catch (err) {
        console.error("Error loading batches:", err);
      } finally {
        setLoadingBatches(false);
      }

      // Load Degrees
      setLoadingDegrees(true);
      try {
        const degs = await loadDegrees();
        setDegrees(degs);
      } catch (err) {
        console.error("Error loading degrees:", err);
      } finally {
        setLoadingDegrees(false);
      }

      // Load Classes
      setLoadingClasses(true);
      try {
        const response = await fetch(ApiRoutes.sectionByCampusId(currentCampusId));
        const data = await response.json();
        loadedClasses = (data as SectionResponse[]).map((item: SectionResponse) => ({
          id: Number(item.section_id || item.id || 0),
          name: `${item.class_name || ''}${item.section_name ? ` - ${item.section_name}` : ''}`,
          className: item.class_name || '',
          sectionName: item.section_name || '',
          classId: Number(item.class_id || 0),
          sectionId: Number(item.section_id || item.id || 0)
        }));
        setClasses(loadedClasses);
      } catch (err) {
        console.error("Error loading classes:", err);
      } finally {
        setLoadingClasses(false);
      }

      // After all loads complete, set form data for edit mode
      if (isEditMode && initialData) {
        const updatedFormData: any = {
          firstName: initialData.firstName || '',
          lastName: initialData.lastName || '',
          dateOfBirth: initialData.dateOfBirth || '',
          gender: initialData.gender || '',
          cnic: initialData.cnic || '',
          phone: initialData.phone || '',
          email: initialData.email || '',
          emergencyContact: initialData.emergencyContact || '',
          admissionNumber: initialData.admissionNumber || String(lastAdmissionNumber),
          highestQualification: initialData.highestQualification || '',
          shift: initialData.shift || '',
          joiningDate: initialData.joiningDate || '',
          extraDetails: initialData.extraDetails || '',
          studentPreview: initialData.studentPreview || '',
          studentId: initialData.studentId
        };

        // Find matching class
        let matchingClassName = '';
        if (initialData.classId) {
          const classById = loadedClasses.find(c => c.classId === initialData.classId);
          if (classById) matchingClassName = classById.name;
        }
        if (!matchingClassName && initialData.sectionId) {
          const classBySectionId = loadedClasses.find(c => c.sectionId === initialData.sectionId);
          if (classBySectionId) matchingClassName = classBySectionId.name;
        }
        if (!matchingClassName && initialData.className) {
          const classByName = loadedClasses.find(c =>
            c.className === initialData.className &&
            (initialData.sectionName ? c.sectionName === initialData.sectionName : true)
          );
          if (classByName) matchingClassName = classByName.name;
        }
        if (!matchingClassName && initialData.enrollmentClass) {
          const classByDisplayName = loadedClasses.find(c => c.name === initialData.enrollmentClass);
          if (classByDisplayName) matchingClassName = classByDisplayName.name;
        }

        // Find matching batch
        let matchingBatchName = '';
        if (initialData.batchId) {
          const batchById = loadedBatches.find(b => b.id === initialData.batchId);
          if (batchById) matchingBatchName = batchById.name;
        }
        if (!matchingBatchName && initialData.batchName) {
          const batchByName = loadedBatches.find(b => b.name === initialData.batchName);
          if (batchByName) matchingBatchName = batchByName.name;
        }
        if (!matchingBatchName && initialData.batch) {
          const batchByDisplayName = loadedBatches.find(b => b.name === initialData.batch);
          if (batchByDisplayName) matchingBatchName = batchByDisplayName.name;
        }

        setFormData({
          ...updatedFormData,
          enrollmentClass: matchingClassName || updatedFormData.enrollmentClass || '',
          batch: matchingBatchName || updatedFormData.batch || ''
        });
      } else {
        setFormData(prev => ({
          ...prev,
          admissionNumber: String(lastAdmissionNumber)
        }));
      }

      setIsDataLoading(false);
    };

    loadData();
  }, [isOpen, currentCampusId, isEditMode, initialData, lastAdmissionNumber]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        ...initialFormData,
        admissionNumber: String(lastAdmissionNumber),
        studentPreview: ''
      });
      setErrors({});
      setSubmitError(null);
      setIsDataLoading(false);
    }
  }, [isOpen, lastAdmissionNumber]);

  if (!isOpen) return null;

  if (isEditMode && isDataLoading) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-4xl my-8">
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 border border-white/20 shadow-2xl overflow-hidden p-12">
            <div className="flex flex-col items-center justify-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mb-4"></div>
              <p className="text-white/70">Loading student data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    if (!formData.admissionNumber) newErrors.admissionNumber = 'Admission number is required';
    if (!formData.enrollmentClass) newErrors.enrollmentClass = 'Please select enrollment class';
    if (!formData.batch) newErrors.batch = 'Please select batch';
    if (!formData.highestQualification) newErrors.highestQualification = 'Please select qualification';
    if (!formData.shift) newErrors.shift = 'Please select shift';
    if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getSectionIdFromClassName = (className: string): number | null => {
    const classItem = classes.find(c => c.name === className);
    return classItem ? classItem.id : null;
  };

  const getBatchIdFromName = (batchName: string): number | null => {
    const batchItem = batches.find(b => b.name === batchName);
    return batchItem ? batchItem.id : null;
  };

  // Show confirmation before saving
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // SweetAlert confirmation
    const confirmResult = await Swal.fire({
      title: isEditMode ? 'Update Student?' : 'Enroll Student?',
      text: isEditMode 
        ? 'Are you sure you want to update this student\'s information?' 
        : 'Are you sure you want to enroll this student?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: isEditMode ? 'Yes, update' : 'Yes, enroll',
      cancelButtonText: 'Cancel'
    });

    if (!confirmResult.isConfirmed) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const sectionId = getSectionIdFromClassName(formData.enrollmentClass);
      if (!sectionId) {
        setSubmitError('Please select a valid class');
        setIsSubmitting(false);
        return;
      }

      const batchId = getBatchIdFromName(formData.batch);
      if (!batchId) {
        setSubmitError('Please select a valid batch');
        setIsSubmitting(false);
        return;
      }

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
        role: 'student',
        profile_image: formData.studentPicture
      };

      let response;
      if (isEditMode && initialData?.studentId) {
        response = await studentService.updateStudent(initialData.studentId, apiData);
      } else {
        response = await studentService.createStudent(apiData);
      }

      if (response.success) {
        // Success toast
        await Swal.fire({
          icon: 'success',
          title: isEditMode ? 'Student Updated!' : 'Student Enrolled!',
          text: isEditMode ? 'The student record has been updated successfully.' : 'New student has been enrolled successfully.',
          timer: 3000,
          showConfirmButton: false
        });
        onSave(formData);
        onClose();
      } else {
        setSubmitError(response.message || 'Failed to save student. Please try again.');
        // Error toast
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.message || 'Failed to save student. Please try again.'
        });
      }
    } catch (error: any) {
      console.error('Error saving student:', error);
      setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'An unexpected error occurred.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete with SweetAlert
  const handleDelete = async () => {
    if (!initialData?.studentId) return;

    const confirmResult = await Swal.fire({
      title: 'Delete Student?',
      text: 'This action cannot be undone. Are you sure you want to delete this student?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });

    if (!confirmResult.isConfirmed) return;

    setIsSubmitting(true);
    try {
      if (onDelete) {
        // Use provided callback
        onDelete(initialData.studentId);
      } else {
        // Fallback: call service directly
        await studentService.deleteStudent(initialData.studentId);
      }
      // Show success
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Student record has been deleted.',
        timer: 2000,
        showConfirmButton: false
      });
      onClose();
    } catch (error: any) {
      console.error('Error deleting student:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete student.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl my-8">
        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 border border-white/20 shadow-2xl overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-xl bg-white/10 text-white hover:bg-red-500/30 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>

          <div className="px-4 sm:px-8 pt-6 pb-4 text-center border-b border-white/10">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-xl">
              <GraduationCap size={28} className="text-emerald-900" />
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
              {isEditMode ? 'Edit Student' : 'Student Enrollment'}
            </h2>
            <p className="text-emerald-100 mt-1 text-sm">
              {isEditMode ? 'Update student information' : 'Register new student with complete details'}
            </p>
          </div>

          <div className="px-4 sm:px-8 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {submitError && (
              <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200">
                <p className="font-semibold">Error Saving Student</p>
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
              degrees={degrees}
              loadingDegrees={loadingDegrees}
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

          <div className="px-4 sm:px-8 py-4 bg-black/20 flex flex-col sm:flex-row justify-end gap-3 border-t border-white/10">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            {isEditMode && (
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/40 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-950 font-bold hover:scale-105 transition shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-950 border-t-transparent"></span>
                  {isEditMode ? 'Updating...' : 'Enrolling...'}
                </>
              ) : (
                isEditMode ? 'Update Student' : 'Enroll Student'
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
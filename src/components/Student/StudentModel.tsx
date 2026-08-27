// StudentModel.tsx
import { useState, useEffect } from 'react';
import { X, GraduationCap, Trash2, Power, PowerOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { PersonalDetails } from './components/PersonalDetails';
import { AcademicDetails } from './components/AcademicDetails';
import { AdditionalDetails } from './components/AdditionalDetails';
import type { StudentFormData } from './types/student';
import { validateEmail, validatePhone, validateCNIC } from './utils/validation';
import { studentService } from '../../services/studentService';
import ApiRoutes from '../../services/ApiRoutes';
import loadDegrees from '../../types/Degree';
import Portal from '../../components/common/Portal';
import SearchDropdown from '../custom/SearchDropdown';
import { formatDateForInput } from '../../utils/dateUtils';
import { TextInput } from './components/TextInput';

// Role options
const ROLE_OPTIONS = [
  { id: 1, name: 'Student' },
  { id: 2, name: 'Naqeeb' }
];

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
  onDelete?: (studentId: number) => void;
  initialData?: Partial<StudentFormData> & {
    studentId?: number;
    className?: string;
    sectionName?: string;
    batchName?: string;
    classId?: number;
    sectionId?: number;
    batchId?: number;
    is_active?: boolean;
    role?: string;
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
  extraDetails: '',
  is_active: true,
  role: 'student',
};

// Shift options with number ids (to match Option type)
const SHIFT_OPTIONS = [
  { id: 1, name: 'Morning' },
  { id: 2, name: 'Evening' }
];

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
    studentPreview: initialData?.studentPreview || '',
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
    role: initialData?.role || 'student',
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

  // Shift and Role dropdown states
  const [isShiftDropdownOpen, setIsShiftDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const currentCampusId = campusId || Number(window.CampusID) || 1;
  const isEditMode = !!initialData?.studentId;

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
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

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
          dateOfBirth: formatDateForInput(initialData.dateOfBirth),
          gender: initialData.gender ? initialData.gender.toLowerCase() : '',
          cnic: initialData.cnic || '',
          phone: initialData.phone || '',
          email: initialData.email || '',
          emergencyContact: initialData.emergencyContact || '',
          admissionNumber: initialData.admissionNumber || String(lastAdmissionNumber),
          highestQualification: initialData.highestQualification || '',
          shift: initialData.shift ? initialData.shift.toLowerCase() : '',
          joiningDate: formatDateForInput(initialData.joiningDate),
          extraDetails: initialData.extraDetails || '',
          studentPreview: initialData.studentPreview || '',
          studentId: initialData.studentId,
          is_active: initialData.is_active !== undefined ? initialData.is_active : true,
          role: initialData.role || 'student',
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
          admissionNumber: String(lastAdmissionNumber),
          is_active: true,
          role: 'student',
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
        studentPreview: '',
        is_active: true,
        role: 'student',
      });
      setErrors({});
      setSubmitError(null);
      setIsDataLoading(false);
    }
  }, [isOpen, lastAdmissionNumber]);

  if (!isOpen) return null;

  if (isEditMode && isDataLoading) {
    return (
      <Portal>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl my-4 sm:my-8">
            <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 border border-white/20 shadow-2xl overflow-hidden p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center text-white">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-yellow-400 border-t-transparent mb-4"></div>
                <p className="text-white/70 text-sm sm:text-base">Loading student data...</p>
              </div>
            </div>
          </div>
        </div>
      </Portal>
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

  // Shift dropdown handlers
  const handleShiftSelect = (value: string) => {
    const shift = SHIFT_OPTIONS.find(s => s.name === value);
    if (shift) {
      updateField('shift', shift.name.toLowerCase());
    }
    setIsShiftDropdownOpen(false);
  };

  // Role dropdown handlers
  const handleRoleSelect = (value: string) => {
    const role = ROLE_OPTIONS.find(r => r.name === value);
    if (role) {
      updateField('role', role.name.toLowerCase());
    }
    setIsRoleDropdownOpen(false);
  };

  const todayDate = new Date().toISOString().split('T')[0];
  
  // Get display name for selected shift
  const selectedShiftName = formData.shift
    ? SHIFT_OPTIONS.find(s => s.name.toLowerCase() === formData.shift.toLowerCase())?.name || ''
    : '';

  // Get display name for selected role
  const selectedRoleName = (() => {
    if (!formData.role) return '';
    const role = ROLE_OPTIONS.find(r => r.name.toLowerCase() === formData.role.toLowerCase());
    return role?.name || '';
  })();

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
    if (!formData.role) newErrors.role = 'Please select a role';
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
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-2xl p-4 sm:p-6',
        title: 'text-base sm:text-lg',
        htmlContainer: 'text-sm sm:text-base',
        confirmButton: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
        cancelButton: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
      }
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
        phone: formData.phone.replace(/\s/g, ''),
        email_address: formData.email,
        emergency_contact_number: formData.emergencyContact.replace(/\s/g, ''),
        last_previous_highest_qualification: formData.highestQualification,
        shift: formData.shift,
        joining_date: formData.joiningDate,
        extra_details: formData.extraDetails || '',
        campus_id: currentCampusId,
        password: '123456',
        role: formData.role || 'student',
        profile_image: formData.studentPicture,
        is_active: formData.is_active !== undefined ? formData.is_active : true,
      };

      let response;
      if (isEditMode && initialData?.studentId) {
        response = await studentService.updateStudent(initialData.studentId, apiData);
      } else {
        response = await studentService.createStudent(apiData);
      }

      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: isEditMode ? 'Student Updated!' : 'Student Enrolled!',
          text: isEditMode ? 'The student record has been updated successfully.' : 'New student has been enrolled successfully.',
          timer: 3000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-2xl p-4 sm:p-6',
            title: 'text-base sm:text-lg',
            htmlContainer: 'text-sm sm:text-base',
          }
        });
        onSave(formData);
        onClose();
      } else {
        setSubmitError(response.message || 'Failed to save student. Please try again.');
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.message || 'Failed to save student. Please try again.',
          customClass: {
            popup: 'rounded-2xl p-4 sm:p-6',
            title: 'text-base sm:text-lg',
            htmlContainer: 'text-sm sm:text-base',
            confirmButton: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
          }
        });
      }
    } catch (error: any) {
      console.error('Error saving student:', error);
      setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'An unexpected error occurred.',
        customClass: {
          popup: 'rounded-2xl p-4 sm:p-6',
          title: 'text-base sm:text-lg',
          htmlContainer: 'text-sm sm:text-base',
          confirmButton: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
        }
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
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-2xl p-4 sm:p-6',
        title: 'text-base sm:text-lg',
        htmlContainer: 'text-sm sm:text-base',
        confirmButton: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
        cancelButton: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
      }
    });

    if (!confirmResult.isConfirmed) return;

    setIsSubmitting(true);
    try {
      if (onDelete) {
        onDelete(initialData.studentId);
      } else {
        await studentService.deleteStudent(initialData.studentId);
      }
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Student record has been deleted.',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl p-4 sm:p-6',
          title: 'text-base sm:text-lg',
          htmlContainer: 'text-sm sm:text-base',
        }
      });
      onClose();
    } catch (error: any) {
      console.error('Error deleting student:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete student.',
        customClass: {
          popup: 'rounded-2xl p-4 sm:p-6',
          title: 'text-base sm:text-lg',
          htmlContainer: 'text-sm sm:text-base',
          confirmButton: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center p-2 sm:p-3 md:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-4xl my-1 sm:my-2 md:my-4" onClick={e => e.stopPropagation()}>
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[98vh] sm:max-h-[95vh] md:max-h-[90vh]">
            
            {/* Header - Fixed */}
            <div className="flex-shrink-0 sticky top-0 z-10 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900/95 backdrop-blur-xl px-3 sm:px-4 md:px-8 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 text-center border-b border-white/10">
              <button
                onClick={onClose}
                className="cursor-pointer absolute top-3 right-3 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 text-white hover:bg-red-500/30 flex items-center justify-center transition"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>

              <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-xl">
                <GraduationCap size={22} className="sm:w-6 sm:h-6 md:w-7 md:h-7 text-emerald-900" />
              </div>
              <h2 className="mt-2 sm:mt-3 text-lg sm:text-xl md:text-2xl font-bold text-white">
                {isEditMode ? 'Edit Student' : 'Student Enrollment'}
              </h2>
              <p className="text-emerald-100 mt-0.5 sm:mt-1 text-xs sm:text-sm">
                {isEditMode ? 'Update student information' : 'Register new student with complete details'}
              </p>
            </div>

            {/* Scrollable Content - Takes remaining space */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-8 py-3 sm:py-4 custom-scrollbar">
              {submitError && (
                <div className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200">
                  <p className="font-semibold text-xs sm:text-sm">Error Saving Student</p>
                  <p className="text-[10px] sm:text-xs">{submitError}</p>
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

              {/* Shift Field with SearchDropdown */}
              <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start">
                {/* Shift Dropdown Container */}
                <div className="w-full sm:w-1/2">
                  <label className="text-emerald-100 text-sm font-medium block mb-1.5">
                    Shift <span className="text-red-400">*</span>
                  </label>
                  <SearchDropdown
                    label=""
                    placeholder="Select Shift"
                    icon={null}
                    options={SHIFT_OPTIONS}
                    value={selectedShiftName}
                    onChange={handleShiftSelect}
                    isOpen={isShiftDropdownOpen}
                    onToggle={() => setIsShiftDropdownOpen(!isShiftDropdownOpen)}
                    onClose={() => setIsShiftDropdownOpen(false)}
                    dropUp={false}
                    hideSearch={false}
                    className="w-full"
                    triggerClassName="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm sm:text-base"
                    dropdownClassName="w-full"
                    optionClassName="px-3 py-2 text-white hover:bg-yellow-400/20 cursor-pointer text-sm sm:text-base"
                  />
                  {errors.shift && (
                    <p className="text-red-300 text-xs mt-1">{errors.shift}</p>
                  )}
                </div>

                {/* Joining Date Container */}
                <div className="w-full sm:w-1/2">
                  <TextInput
                    label="Joining Date"
                    value={formData.joiningDate}
                    onChange={(v) => updateField('joiningDate', v)}
                    error={errors.joiningDate}
                    required
                    type="date"
                    max={todayDate}
                  />
                </div>
              </div>

              {/* Role Field with SearchDropdown */}
              <div className="mt-4">
                <div className="w-full">
                  <label className="text-emerald-100 text-sm font-medium block mb-1.5">
                    Role <span className="text-red-400">*</span>
                  </label>
                  <SearchDropdown
                    label=""
                    placeholder="Select Role"
                    icon={null}
                    options={ROLE_OPTIONS}
                    value={selectedRoleName}
                    onChange={handleRoleSelect}
                    isOpen={isRoleDropdownOpen}
                    onToggle={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    onClose={() => setIsRoleDropdownOpen(false)}
                    dropUp={false}
                    hideSearch={false}
                    className="w-full"
                    triggerClassName="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm sm:text-base"
                    dropdownClassName="w-full"
                    optionClassName="px-3 py-2 text-white hover:bg-yellow-400/20 cursor-pointer text-sm sm:text-base"
                  />
                  {errors.role && (
                    <p className="text-red-300 text-xs mt-1">{errors.role}</p>
                  )}
                </div>
              </div>

              {/* Status Toggle */}
              <div className="mt-4">
                <label className="text-emerald-100 text-sm font-medium block mb-1.5">
                  Student Status
                </label>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => updateField('is_active', !formData.is_active)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
                      formData.is_active ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        formData.is_active ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                  <div className="flex items-center gap-2">
                    {formData.is_active ? (
                      <Power size={16} className="text-green-400" />
                    ) : (
                      <PowerOff size={16} className="text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      formData.is_active ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {formData.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <span className="text-xs text-white/40 ml-2">
                    {formData.is_active 
                      ? 'Student will appear in attendance and dashboards' 
                      : 'Student will be hidden from attendance and dashboards'}
                  </span>
                </div>
              </div>

              <AdditionalDetails
                formData={formData}
                updateField={updateField}
                errors={errors}
              />
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="flex-shrink-0 sticky bottom-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900/95 backdrop-blur-xl px-3 sm:px-4 md:px-8 py-3 sm:py-4 border-t border-white/10">
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="cursor-pointer w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-2 sm:order-1"
                >
                  Cancel
                </button>
                {isEditMode && (
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="cursor-pointer w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2.5 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/40 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base order-3 sm:order-2"
                  >
                    <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    Delete
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="cursor-pointer w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-950 font-bold hover:scale-105 transition shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-4"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-emerald-950 border-t-transparent"></span>
                      <span className="hidden xs:inline">{isEditMode ? 'Updating...' : 'Enrolling...'}</span>
                      <span className="xs:hidden">...</span>
                    </>
                  ) : (
                    isEditMode ? 'Update Student' : 'Enroll Student'
                  )}
                </button>
              </div>
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
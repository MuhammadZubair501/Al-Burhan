import React, { useState, useCallback, useEffect } from 'react';
import { Mail, Phone, PhoneCall, FileUser, Calendar, Building2, GraduationCap, Layers } from 'lucide-react';
import Portal from '../../components/common/Portal';

// Import types
import type { CampusType, TeacherModalData, TeacherModalProps } from './Model/TeacherModalTypes';

// Import validation helpers
import {
  validateEmail,
  validatePhone,
  validateCNIC,
  formatPakPhone,
  formatCNIC,
  formatEmergencyNumber,
  validateEmergencyNumber,
} from './Model/ValidationHelpers';

// Import components
import { FormInput } from './Model/TeacherInputField';
import { FormTextarea } from './Model/FormTextarea';
import { MultiSelectChips } from './Model/MultiSelectChips';
import { ProfileUpload } from './Model/ProfileUpload';
import { FormSection } from './Model/FormSection';
import { ModalHeader } from './Model/ModalHeader';
import { ModalFooter } from './Model/ModalFooter';
import ApiRoutes from '../../services/ApiRoutes';
import { teacherService, type TeacherFormData } from '../../services/teacherService';

// Degree loader
import loadDegrees from '../../types/Degree';
// SearchDropdown component
import SearchDropdown from '../custom/SearchDropdown';
// Date formatter
import { formatDateForInput } from '../../utils/dateUtils';

// Department type
interface Department {
  id: number;
  name: string;
}

// Subject type
interface Subject {
  id: number;
  name: string;
}

// Class/Section type
interface ClassItem {
  id: number;
  name: string;
}

// Degree type
interface Degree {
  id: number;
  name: string;
}

// Shift options with number ids
const SHIFT_OPTIONS = [
  { id: 1, name: 'Morning' },
  { id: 2, name: 'Evening' }
];

export default function TeacherModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = 'create',
}: TeacherModalProps) {
  // --- State ---
  const [formData, setFormData] = useState<TeacherModalData>({
    profilePicture: null,
    profilePreview: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    cnic: '',
    emergencyNumber: '',
    teacherId: '',
    joiningDate: new Date().toISOString().split('T')[0],
    department: '',
    assignedClasses: [],
    subjectsTaught: [],
    shift: '',
    campus: '',
    campusId: Number(window.CampusID) || 0,
    highestDegree: '',
    extraDetail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [cnicDisplay, setCnicDisplay] = useState('');
  const [cnicError, setCnicError] = useState('');
  const [emergencyDisplay, setEmergencyDisplay] = useState('');
  const [emergencyError, setEmergencyError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Dropdown states for SearchDropdown
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false);
  const [isShiftDropdownOpen, setIsShiftDropdownOpen] = useState(false);
  const [isDegreeDropdownOpen, setIsDegreeDropdownOpen] = useState(false);

  // Campus state
  const [campus, setCampus] = useState<CampusType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Departments state
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState<boolean>(true);

  // Subjects state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState<boolean>(true);

  // Classes state
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [classesLoading, setClassesLoading] = useState<boolean>(true);

  // Degrees state
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [degreesLoading, setDegreesLoading] = useState<boolean>(true);

  // --- Reset form when modal opens ---
  useEffect(() => {
    if (!isOpen) return;

    console.log('🔄 TeacherModal useEffect triggered', { mode, initialData });

    if (mode === 'edit' && initialData) {
      console.log('📝 Editing teacher with data:', initialData);
      
      // Format dates for input fields
      const formattedJoiningDate = formatDateForInput(initialData.joiningDate);
      
      // Normalize values
      const normalizedGender = initialData.gender ? initialData.gender.toLowerCase() : '';
      const normalizedShift = initialData.shift ? initialData.shift.toLowerCase() : '';
      
      console.log('🔹 Normalized values:', {
        gender: normalizedGender,
        shift: normalizedShift,
        joiningDate: formattedJoiningDate
      });
      
      setFormData({
        profilePicture: null,
        profilePreview: initialData.profilePreview || '',
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        gender: normalizedGender as 'male' | 'female' | 'other' | '',
        cnic: initialData.cnic || '',
        emergencyNumber: initialData.emergencyNumber || '',
        teacherId: initialData.teacherId || '',
        joiningDate: formattedJoiningDate || new Date().toISOString().split('T')[0],
        department: initialData.department || '',
        assignedClasses: initialData.assignedClasses || [],
        subjectsTaught: initialData.subjectsTaught || [],
        shift: normalizedShift as 'morning' | 'evening' | '',
        campus: initialData.campus || '',
        campusId: initialData.campusId || Number(window.CampusID) || 0,
        highestDegree: initialData.highestDegree || '',
        extraDetail: initialData.extraDetail || '',
      });
      
      setPhoneDisplay(initialData.phone || '');
      setCnicDisplay(initialData.cnic || '');
      setEmergencyDisplay(initialData.emergencyNumber || '');
    } else {
      console.log('📝 Creating new teacher');
      setFormData({
        profilePicture: null,
        profilePreview: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        cnic: '',
        emergencyNumber: '',
        teacherId: '',
        joiningDate: new Date().toISOString().split('T')[0],
        department: '',
        assignedClasses: [],
        subjectsTaught: [],
        shift: '',
        campus: '',
        campusId: Number(window.CampusID) || 0,
        highestDegree: '',
        extraDetail: '',
      });
      setPhoneDisplay('');
      setCnicDisplay('');
      setEmergencyDisplay('');
    }
    setErrors({});
    setSubmitError(null);
  }, [isOpen, mode, initialData]);

  // --- Prevent body scroll when modal is open ---
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

  // --- Keyboard shortcut - Escape key to close ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting]);

  // --- Fetch Campus, Departments, Subjects, Classes, Degrees ---
  useEffect(() => {
    if (!isOpen) return;

    const fetchCampusData = async () => {
      setLoading(true);
      try {
        const campusId = formData.campusId || Number(window.CampusID) || 1;
        const response = await fetch(ApiRoutes.campusById(campusId));
        const data = await response.json();
        setCampus(data);
        if (data?.campus_name) updateField('campus', data.campus_name);
      } catch (err) {
        console.error('Error fetching campus:', err);
        setCampus({ id: 0, campus_name: 'Main Campus' });
        updateField('campus', 'Main Campus');
      } finally {
        setLoading(false);
      }
    };

    const fetchDepartments = async () => {
      setDepartmentsLoading(true);
      try {
        const campusId = formData.campusId || Number(window.CampusID) || 1;
        const res = await fetch(ApiRoutes.departmentByCampusId(campusId));
        const data = await res.json();
        const mapped = data.map((d: any) => ({
          id: d.department_id || d.id,
          name: d.department_name || d.name,
        }));
        setDepartments(mapped);
        if (mode === 'edit' && initialData?.department) {
          const exists = mapped.some((d: Department) => d.name === initialData.department);
          if (exists) updateField('department', initialData.department);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setDepartments([]);
      } finally {
        setDepartmentsLoading(false);
      }
    };

    const fetchSubjects = async () => {
      setSubjectsLoading(true);
      try {
        const res = await fetch(ApiRoutes.SUBJECT);
        const data = await res.json();
        const mapped = data.map((s: any) => ({
          id: s.subject_id || s.id,
          name: s.subject_name || s.name,
        }));
        setSubjects(mapped);
        if (mode === 'edit' && initialData?.subjectsTaught?.length) {
          const valid = initialData.subjectsTaught.filter(name =>
            mapped.some((s: Subject) => s.name === name)
          );
          if (valid.length) updateField('subjectsTaught', valid);
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setSubjects([]);
      } finally {
        setSubjectsLoading(false);
      }
    };

    const fetchClasses = async () => {
      if (!window.CampusID) { setClasses([]); return; }
      setClassesLoading(true);
      try {
        const res = await fetch(ApiRoutes.sectionByCampusId(window.CampusID));
        const data = await res.json();
        const mapped = data.map((item: any) => ({
          id: item.section_id || item.id,
          name: `${item.class_name}`,
        }));
        setClasses(mapped);
        const assigned = initialData?.assignedClasses || [];
        if (mode === 'edit' && assigned.length) {
          const valid = assigned.filter(name =>
            mapped.some((c: ClassItem) => c.name === name)
          );
          if (valid.length) updateField('assignedClasses', valid);
        }
      } catch (err) {
        console.error('Error fetching classes:', err);
        setClasses([]);
      } finally {
        setClassesLoading(false);
      }
    };

    const fetchDegrees = async () => {
      setDegreesLoading(true);
      try {
        const degs = await loadDegrees();
        setDegrees(degs);
        if (mode === 'edit' && initialData?.highestDegree) {
          const exists = degs.some(d => d.name === initialData.highestDegree);
          if (exists) updateField('highestDegree', initialData.highestDegree);
        }
      } catch (err) {
        console.error('Error loading degrees:', err);
        setDegrees([]);
      } finally {
        setDegreesLoading(false);
      }
    };

    fetchCampusData();
    fetchDepartments();
    fetchSubjects();
    fetchClasses();
    fetchDegrees();
  }, [isOpen, formData.campusId, mode, initialData]);

  // --- Handlers ---
  const updateField = <K extends keyof TeacherModalData>(
    field: K,
    value: TeacherModalData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleProfileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profilePicture: 'Image must be less than 2MB' }));
        return;
      }
      const preview = URL.createObjectURL(file);
      updateField('profilePicture', file);
      updateField('profilePreview', preview);
      setErrors(prev => ({ ...prev, profilePicture: '' }));
    } else {
      setErrors(prev => ({ ...prev, profilePicture: 'Please upload an image file' }));
    }
  }, []);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profilePicture: 'Image must be less than 2MB' }));
        return;
      }
      const preview = URL.createObjectURL(file);
      updateField('profilePicture', file);
      updateField('profilePreview', preview);
      setErrors(prev => ({ ...prev, profilePicture: '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPakPhone(e.target.value);
    setPhoneDisplay(formatted);
    const digits = formatted.replace(/\D/g, '');
    if (digits.length < 12) {
      setPhoneError('Invalid phone number (format: +92 300 1234567)');
      updateField('phone', '');
    } else {
      setPhoneError('');
      updateField('phone', formatted);
    }
  };

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNIC(e.target.value);
    setCnicDisplay(formatted);
    updateField('cnic', formatted);
    if (formatted.length === 15 && !validateCNIC(formatted)) {
      setCnicError('Invalid CNIC (format: 42000-1234567-1)');
    } else {
      setCnicError('');
    }
  };

  const handleEmergencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEmergencyNumber(e.target.value);
    setEmergencyDisplay(formatted);
    updateField('emergencyNumber', formatted);
    const digits = formatted.replace(/\D/g, '');
    if (digits.length < 12) {
      setEmergencyError('Invalid emergency number (format: +92 300 1234567)');
    } else {
      setEmergencyError('');
    }
  };

  // Department handlers
  const handleDepartmentSelect = (value: string) => {
    console.log('📋 Department selected:', value);
    updateField('department', value);
    setIsDepartmentDropdownOpen(false);
  };

  // Shift handlers
  const handleShiftSelect = (value: string) => {
    console.log('🕐 Shift selected:', value);
    const shift = SHIFT_OPTIONS.find(s => s.name === value);
    console.log('🔍 Found shift:', shift);
    if (shift) {
      const normalizedShift = shift.name.toLowerCase() as 'morning' | 'evening' | '';
      console.log('📝 Setting shift to:', normalizedShift);
      updateField('shift', normalizedShift);
    }
    setIsShiftDropdownOpen(false);
  };

  // Degree handlers
  const handleDegreeSelect = (value: string) => {
    console.log('🎓 Degree selected:', value);
    updateField('highestDegree', value);
    setIsDegreeDropdownOpen(false);
  };

  const addSubject = (subject: string) => {
    if (!formData.subjectsTaught.includes(subject)) {
      updateField('subjectsTaught', [...formData.subjectsTaught, subject]);
    }
  };
  const removeSubject = (subject: string) => {
    updateField('subjectsTaught', formData.subjectsTaught.filter(s => s !== subject));
  };

  const addClass = (cls: string) => {
    if (!formData.assignedClasses.includes(cls)) {
      updateField('assignedClasses', [...formData.assignedClasses, cls]);
    }
  };
  const removeClass = (cls: string) => {
    updateField('assignedClasses', formData.assignedClasses.filter(c => c !== cls));
  };

  // Get display names for dropdowns
  const selectedDepartmentName = formData.department || '';
  
  // Get display name for shift - find the capitalized version
  const selectedShiftName = (() => {
    if (!formData.shift) {
      return '';
    }
    const found = SHIFT_OPTIONS.find(s => s.name.toLowerCase() === formData.shift.toLowerCase());
    console.log('🔄 Shift mapping for display:', {
      formShift: formData.shift,
      foundShift: found?.name || 'NOT FOUND',
      allOptions: SHIFT_OPTIONS.map(s => s.name)
    });
    return found?.name || '';
  })();
  
  const selectedDegreeName = formData.highestDegree || '';

  // Log current form state
  console.log('🎯 Current form state:', {
    gender: formData.gender,
    shift: formData.shift,
    shiftDisplayName: selectedShiftName,
    genderType: typeof formData.gender,
    shiftType: typeof formData.shift
  });

  // --- Validation and Submit ---
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Use format: +92 300 1234567 or 03001234567';
    if (!formData.cnic) newErrors.cnic = 'CNIC is required';
    else if (!validateCNIC(formData.cnic)) newErrors.cnic = 'Invalid CNIC (format: 42000-1234567-1)';
    if (!formData.emergencyNumber) newErrors.emergencyNumber = 'Emergency number is required';
    else if (!validateEmergencyNumber(formData.emergencyNumber)) {
      newErrors.emergencyNumber = 'Use format: +92 300 1234567 or 03001234567';
    }
    if (!formData.department) newErrors.department = 'Please select a department';
    if (!formData.highestDegree) newErrors.highestDegree = 'Please select highest degree';
    if (!formData.shift) newErrors.shift = 'Please select a shift';
    if (formData.subjectsTaught.length === 0) newErrors.subjectsTaught = 'Please select at least one subject';
    if (formData.assignedClasses.length === 0) newErrors.assignedClasses = 'Please select at least one class';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const departmentObj = departments.find(d => d.name === formData.department);
      const departmentId = departmentObj?.id || '';

      const sectionIds = formData.assignedClasses
        .map(className => {
          let classItem = classes.find(c => c.name === className);
          if (!classItem) {
            const parts = className.split(' - ');
            const sectionName = parts.length > 1 ? parts[1] : className;
            classItem = classes.find(c => c.name.includes(sectionName));
          }
          return classItem?.id;
        })
        .filter(id => id !== undefined && id !== null) as number[];

      const subjectIds = formData.subjectsTaught
        .map(subjectName => {
          const subjectItem = subjects.find(s => s.name === subjectName);
          return subjectItem?.id;
        })
        .filter(id => id !== undefined && id !== null) as number[];

      const teacherData: TeacherFormData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email_address: formData.email,
        phone_number: formData.phone.replace(/\s/g, ''),
        gender: formData.gender as 'male' | 'female' | 'other' | '',
        cnic_number: formData.cnic,
        emergency_number: formData.emergencyNumber.replace(/\s/g, ''),
        joining_date: formData.joiningDate,
        department_id: departmentId,
        shift: formData.shift,
        campus_id: formData.campusId || Number(window.CampusID) || 1,
        highest_education: formData.highestDegree,
        extra_details: formData.extraDetail || '',
        sections: sectionIds,
        subjects: subjectIds,
        profile_image: formData.profilePicture,
        role: 'teacher',
        password: '123456'
      };

      console.log('📤 Submitting teacher data:', teacherData);

      if (mode === 'edit' && formData.teacherId) {
        await teacherService.updateTeacher(formData.teacherId, teacherData);
      } else {
        await teacherService.createTeacher(teacherData);
      }

      onSave(formData);
      onClose();
    } catch (error: any) {
      console.error('Error saving teacher:', error);
      if (error.message?.includes('Duplicate entry') || error.message?.includes('already exists')) {
        setSubmitError('This email, CNIC, or phone number already exists. Please use unique values.');
      } else {
        setSubmitError(error.message || 'Failed to save teacher. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setErrors({});
    setSubmitError(null);
    onClose();
  };

  if (!isOpen) return null;

  if (loading || departmentsLoading || subjectsLoading || classesLoading || degreesLoading) {
    return (
      <Portal>
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-yellow-400 border-t-transparent"></div>
            <span className="text-white text-sm sm:text-base">Loading data...</span>
          </div>
        </div>
      </Portal>
    );
  }

  const subjectNames = subjects.map(s => s.name);
  const classNames = classes.map(c => c.name);

  return (
    <Portal>
      <div className="fixed inset-0 z-[9998] flex items-start justify-center p-2 sm:p-3 md:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-4xl my-1 sm:my-2 md:my-4" onClick={e => e.stopPropagation()}>
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[98vh] sm:max-h-[95vh] md:max-h-[90vh]">
            
            {/* Header - Fixed */}
            <div className="flex-shrink-0">
              <ModalHeader onClose={handleClose} />
            </div>

            {/* Scrollable Content - Takes remaining space */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 custom-scrollbar">
              {submitError && (
                <div className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200">
                  <p className="font-semibold text-sm">Error Saving Teacher</p>
                  <p className="text-xs sm:text-sm">{submitError}</p>
                </div>
              )}

              {/* SECTION 1: Basic Information */}
              <FormSection title="Basic Information" number={1}>
                <ProfileUpload
                  preview={formData.profilePreview}
                  error={errors.profilePicture}
                  onDrop={handleProfileDrop}
                  onUpload={handleProfileUpload}
                  dragActive={dragActive}
                  setDragActive={setDragActive}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormInput
                    label="First Name *"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="John"
                    error={errors.firstName}
                    className="text-sm sm:text-base"
                  />
                  <FormInput
                    label="Last Name *"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Doe"
                    error={errors.lastName}
                    className="text-sm sm:text-base"
                  />
                  <FormInput
                    label="Email Address *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="teacher@school.edu"
                    error={errors.email}
                    icon={Mail}
                    className="text-sm sm:text-base"
                  />
                  <div>
                    <label className="text-emerald-100 text-sm font-medium mb-1.5 block">Phone Number *</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300/70" />
                      <input
                        type="text"
                        value={phoneDisplay}
                        onChange={handlePhoneChange}
                        placeholder="+92 300 1234567"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base"
                      />
                    </div>
                    {phoneError && <p className="text-red-300 text-xs mt-1">{phoneError}</p>}
                    {errors.phone && <p className="text-red-300 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="text-emerald-100 text-sm font-medium mb-1.5 block">CNIC *</label>
                    <div className="relative">
                      <FileUser size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300/70" />
                      <input
                        type="text"
                        value={cnicDisplay}
                        onChange={handleCnicChange}
                        placeholder="42000-1234567-1"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base"
                      />
                    </div>
                    {cnicError && <p className="text-red-300 text-xs mt-1">{cnicError}</p>}
                    {errors.cnic && <p className="text-red-300 text-xs mt-1">{errors.cnic}</p>}
                  </div>
                  <div>
                    <label className="text-emerald-100 text-sm font-medium mb-1.5 block">Gender</label>
                    <div className="flex gap-4 mt-1">
                      {['male', 'female'].map(g => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer text-white capitalize text-sm sm:text-base">
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={formData.gender === g}
                            onChange={(e) => updateField('gender', e.target.value as any)}
                            className="accent-yellow-400 w-4 h-4"
                          />
                          {g}
                        </label>
                      ))}
                    </div>
                    {errors.gender && <p className="text-red-300 text-xs mt-1">{errors.gender}</p>}
                  </div>
                  <div>
                    <label className="text-emerald-100 text-sm font-medium mb-1.5 block">Emergency Number *</label>
                    <div className="relative">
                      <PhoneCall size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300/70" />
                      <input
                        type="text"
                        value={emergencyDisplay}
                        onChange={handleEmergencyChange}
                        placeholder="+92 300 1234567"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base"
                      />
                    </div>
                    {emergencyError && <p className="text-red-300 text-xs mt-1">{emergencyError}</p>}
                    {errors.emergencyNumber && <p className="text-red-300 text-xs mt-1">{errors.emergencyNumber}</p>}
                  </div>
                </div>
              </FormSection>

              {/* SECTION 2: Professional Details */}
              <FormSection title="Professional Details" number={2}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-emerald-100 text-sm font-medium mb-1.5 block">Joining Date</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300/70" />
                      <input
                        type="date"
                        value={formData.joiningDate}
                        onChange={(e) => updateField('joiningDate', e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base"
                      />
                    </div>
                    {errors.joiningDate && <p className="text-red-300 text-xs mt-1">{errors.joiningDate}</p>}
                  </div>
                  <div>
                    <label className="text-emerald-100 text-sm font-medium mb-1.5 block">Campus Name</label>
                    <div className="relative">
                      <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300/70" />
                      <input
                        disabled
                        value={campus?.campus_name || formData.campus || 'Not Available'}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 cursor-not-allowed text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-emerald-100 text-sm font-medium mb-1.5 block">Department *</label>
                    <SearchDropdown
                      label=""
                      placeholder={departmentsLoading ? "Loading departments..." : "Select Department"}
                      icon={<Building2 size={18} className="text-yellow-300" />}
                      options={departments}
                      value={selectedDepartmentName}
                      onChange={handleDepartmentSelect}
                      isOpen={isDepartmentDropdownOpen}
                      onToggle={() => setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)}
                      onClose={() => setIsDepartmentDropdownOpen(false)}
                      dropUp={false}
                      hideSearch={false}
                      className="w-full"
                      triggerClassName="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm sm:text-base"
                      dropdownClassName="w-full"
                      optionClassName="px-3 py-2.5 text-white hover:bg-yellow-400/20 cursor-pointer text-sm sm:text-base"
                    />
                    {errors.department && <p className="text-red-300 text-xs mt-1">{errors.department}</p>}
                  </div>
                  <div>
                    <label className="text-emerald-100 text-sm font-medium mb-1.5 block">Shift *</label>
                    <SearchDropdown
                      label=""
                      placeholder="Select Shift"
                      icon={<Layers size={18} className="text-yellow-300" />}
                      options={SHIFT_OPTIONS}
                      value={selectedShiftName}
                      onChange={handleShiftSelect}
                      isOpen={isShiftDropdownOpen}
                      onToggle={() => setIsShiftDropdownOpen(!isShiftDropdownOpen)}
                      onClose={() => setIsShiftDropdownOpen(false)}
                      dropUp={false}
                      hideSearch={false}
                      className="w-full"
                      triggerClassName="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm sm:text-base"
                      dropdownClassName="w-full"
                      optionClassName="px-3 py-2.5 text-white hover:bg-yellow-400/20 cursor-pointer text-sm sm:text-base"
                    />
                    {errors.shift && <p className="text-red-300 text-xs mt-1">{errors.shift}</p>}
                  </div>
                </div>

                <MultiSelectChips
                  label="Assigned Classes *"
                  items={formData.assignedClasses}
                  onAdd={addClass}
                  onRemove={removeClass}
                  options={classNames}
                  chipColor="bg-yellow-400/20 text-yellow-200"
                  searchPlaceholder="Search classes..."
                />
                {errors.assignedClasses && <p className="text-red-300 text-xs mt-1">{errors.assignedClasses}</p>}

                <MultiSelectChips
                  label="Subjects Taught *"
                  items={formData.subjectsTaught}
                  onAdd={addSubject}
                  onRemove={removeSubject}
                  options={subjectNames}
                  chipColor="bg-cyan-400/20 text-cyan-200"
                  searchPlaceholder="Search subjects..."
                />
                {errors.subjectsTaught && <p className="text-red-300 text-xs mt-1">{errors.subjectsTaught}</p>}
              </FormSection>

              {/* SECTION 3: Qualifications & Extra */}
              <FormSection title="Qualifications & Extra" number={3}>
                <div className="grid grid-cols-1 gap-3 pb-2">
                  <div>
                    <label className="text-emerald-100 text-sm font-medium mb-1.5 block">Highest Degree *</label>
                    <SearchDropdown
                      label=""
                      placeholder={degreesLoading ? "Loading degrees..." : "Select Degree"}
                      icon={<GraduationCap size={18} className="text-yellow-300" />}
                      options={degrees}
                      value={selectedDegreeName}
                      onChange={handleDegreeSelect}
                      isOpen={isDegreeDropdownOpen}
                      onToggle={() => setIsDegreeDropdownOpen(!isDegreeDropdownOpen)}
                      onClose={() => setIsDegreeDropdownOpen(false)}
                      dropUp={false}
                      hideSearch={false}
                      className="w-full"
                      triggerClassName="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm sm:text-base"
                      dropdownClassName="w-full"
                      optionClassName="px-3 py-2.5 text-white hover:bg-yellow-400/20 cursor-pointer text-sm sm:text-base"
                    />
                    {errors.highestDegree && <p className="text-red-300 text-xs mt-1">{errors.highestDegree}</p>}
                  </div>
                </div>

                <FormTextarea
                  label="Extra Details"
                  value={formData.extraDetail}
                  onChange={(e) => updateField('extraDetail', e.target.value)}
                  placeholder="Additional notes, achievements, certifications, etc."
                  rows={2}
                  className="text-sm sm:text-base"
                />
              </FormSection>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="flex-shrink-0">
              <ModalFooter onClose={handleClose} onSubmit={handleSubmit} isSubmitting={isSubmitting} mode={mode} />
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
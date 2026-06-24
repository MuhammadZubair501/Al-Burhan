import React, { useState, useCallback, useEffect } from 'react';
import { Mail, Phone, PhoneCall, FileUser, Calendar, Building2 } from 'lucide-react';

// Import types
import type { CampusType, TeacherModalData, TeacherModalProps } from './Model/TeacherModalTypes';

// Import constants
import { DEGREES, SHIFTS } from './Model/TeacherConstants';

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
import { FormSelect } from './Model/TeacherSelectFeild';
import { FormTextarea } from './Model/FormTextarea';
import { MultiSelectChips } from './Model/MultiSelectChips';
import { ProfileUpload } from './Model/ProfileUpload';
import { FormSection } from './Model/FormSection';
import { ModalHeader } from './Model/ModalHeader';
import { ModalFooter } from './Model/ModalFooter';
import ApiRoutes from '../../services/ApiRoutes';
import { teacherService, type TeacherFormData } from '../../services/teacherService';

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

  // --- Reset form when modal opens with initialData ---
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    console.log('🔵 Modal opened - Mode:', mode);
    console.log('🔵 InitialData received:', initialData);

    // Reset form based on mode
    if (mode === 'edit' && initialData) {
      console.log('🟢 Populating form with edit data');
      console.log('🟢 Gender value:', initialData.gender);
      console.log('🟢 Joining Date:', initialData.joiningDate);
      console.log('🟢 Assigned Classes:', initialData.assignedClasses);
      console.log('🟢 Subjects Taught:', initialData.subjectsTaught);
      
      setFormData({
        profilePicture: null,
        profilePreview: initialData.profilePreview || '',
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        gender: initialData.gender || '',
        cnic: initialData.cnic || '',
        emergencyNumber: initialData.emergencyNumber || '',
        teacherId: initialData.teacherId || '',
        joiningDate: initialData.joiningDate || new Date().toISOString().split('T')[0],
        department: initialData.department || '',
        assignedClasses: initialData.assignedClasses || [],
        subjectsTaught: initialData.subjectsTaught || [],
        shift: initialData.shift || '',
        campus: initialData.campus || '',
        campusId: initialData.campusId || Number(window.CampusID) || 0,
        highestDegree: initialData.highestDegree || '',
        extraDetail: initialData.extraDetail || '',
      });
      
      setPhoneDisplay(initialData.phone || '');
      setCnicDisplay(initialData.cnic || '');
      setEmergencyDisplay(initialData.emergencyNumber || '');
    } else {
      console.log('🟡 Resetting form for create mode');
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

    // Clear errors
    setErrors({});
    setSubmitError(null);
  }, [isOpen, mode, initialData]);

  // --- Fetch Campus Data ---
  useEffect(() => {
    if (!isOpen) return;

    const fetchCampusData = async () => {
      setLoading(true);
      try {
        const campusId = formData.campusId || Number(window.CampusID) || 1;
        console.log('Fetching campus data for ID:', campusId);
        const response = await fetch(ApiRoutes.campusById(campusId));
        const data = await response.json();
        console.log('Campus data fetched:', data);
        setCampus(data);
        if (data?.campus_name) {
          updateField('campus', data.campus_name);
        }
      } catch (err) {
        console.error('Error fetching campus data:', err);
        if (initialData?.campus) {
          setCampus({ id: 0, campus_name: initialData.campus });
          updateField('campus', initialData.campus);
        } else {
          setCampus({ id: 0, campus_name: 'Main Campus' });
          updateField('campus', 'Main Campus');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCampusData();
  }, [isOpen, formData.campusId]);

  // --- Fetch Departments ---
  useEffect(() => {
    if (!isOpen) return;

    const fetchDepartments = async () => {
      setDepartmentsLoading(true);
      try {
        const campusId = formData.campusId || Number(window.CampusID) || 1;
        console.log('Fetching departments for campus ID:', campusId);
        const response = await fetch(ApiRoutes.departmentByCampusId(campusId));
        const data = await response.json();
        console.log('Departments fetched:', data);
        
        const mappedDepartments = data.map((dept: any) => ({
          id: dept.department_id || dept.id,
          name: dept.department_name || dept.name,
        }));
        setDepartments(mappedDepartments);
        
        if (mode === 'edit' && initialData?.department) {
          const exists = mappedDepartments.some(
            (dept: Department) => dept.name === initialData.department
          );
          if (exists) {
            updateField('department', initialData.department);
          }
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setDepartments([]);
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
  }, [isOpen, formData.campusId]);

  // --- Fetch Subjects ---
  useEffect(() => {
    if (!isOpen) return;

    const fetchSubjects = async () => {
      setSubjectsLoading(true);
      try {
        console.log('Fetching all subjects...');
        const response = await fetch(ApiRoutes.SUBJECT);
        const data = await response.json();
        console.log('Subjects fetched:', data);
        
        const mappedSubjects = data.map((subject: any) => ({
          id: subject.subject_id || subject.id,
          name: subject.subject_name || subject.name,
        }));
        setSubjects(mappedSubjects);
        
        if (mode === 'edit' && initialData?.subjectsTaught && initialData.subjectsTaught.length > 0) {
          const validSubjects = initialData.subjectsTaught.filter((subjectName: string) =>
            mappedSubjects.some((s: Subject) => s.name === subjectName)
          );
          if (validSubjects.length > 0) {
            updateField('subjectsTaught', validSubjects);
          }
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setSubjects([]);
      } finally {
        setSubjectsLoading(false);
      }
    };

    fetchSubjects();
  }, [isOpen, mode, initialData?.subjectsTaught]);

  // --- Fetch Classes ---
  useEffect(() => {
    if (!isOpen) return;

    const fetchClasses = async () => {
      if (!window.CampusID) {
        setClasses([]);
        return;
      }

      setClassesLoading(true);
      try {
        console.log(`Fetching sections/classes for Campus ID: ${window.CampusID}...`);
        const response = await fetch(ApiRoutes.sectionByCampusId(window.CampusID));
        const data = await response.json();
        console.log('Classes fetched:', data);
        
        // Create class names with "Class - Section" format
        const mappedClasses = data.map((item: any) => ({
          id: item.section_id || item.id,
          name: `${item.class_name}`,
        }));
        setClasses(mappedClasses);
        
        // If in edit mode and have classes, validate them
        // FIXED: Added proper null check for initialData?.assignedClasses
        const assignedClasses = initialData?.assignedClasses || [];
        if (mode === 'edit' && assignedClasses.length > 0) {
          // Check if the assigned classes exist in the fetched list
          const validClasses = assignedClasses.filter((className: string) =>
            mappedClasses.some((c: ClassItem) => c.name === className)
          );
          
          // If the assigned classes don't match the format, try to match by section
          if (validClasses.length === 0 && assignedClasses.length > 0) {
            // Try to match by partial name (just the section name or class name)
            const matchedClasses = mappedClasses.filter((c: ClassItem) => {
              return assignedClasses.some((assigned: string) => {
                // Check if the assigned name is contained in the mapped name
                return c.name.includes(assigned) || assigned.includes(c.name);
              });
            });
            
            if (matchedClasses.length > 0) {
              updateField('assignedClasses', matchedClasses.map((c: ClassItem) => c.name));
            }
          } else if (validClasses.length > 0) {
            updateField('assignedClasses', validClasses);
          }
        }
      } catch (err) {
        console.error('Error fetching classes:', err);
        setClasses([]);
      } finally {
        setClassesLoading(false);
      }
    };

    fetchClasses();
  }, [isOpen, mode, initialData]);

  // --- Handlers ---
  const updateField = <K extends keyof TeacherModalData>(
    field: K,
    value: TeacherModalData[K]
  ) => {
    console.log(`📝 Updating field ${String(field)}:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Profile Picture
  const handleProfileDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        if (file.size > 2 * 1024 * 1024) {
          setErrors((prev) => ({ ...prev, profilePicture: 'Image must be less than 2MB' }));
          return;
        }
        const preview = URL.createObjectURL(file);
        updateField('profilePicture', file);
        updateField('profilePreview', preview);
        setErrors((prev) => ({ ...prev, profilePicture: '' }));
      } else {
        setErrors((prev) => ({ ...prev, profilePicture: 'Please upload an image file' }));
      }
    },
    []
  );

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profilePicture: 'Image must be less than 2MB' }));
        return;
      }
      const preview = URL.createObjectURL(file);
      updateField('profilePicture', file);
      updateField('profilePreview', preview);
      setErrors((prev) => ({ ...prev, profilePicture: '' }));
    }
  };

  // Phone
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

  // CNIC
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

  // Emergency Number
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

  // Multi-select for Subjects
  const addSubject = (subject: string) => {
    if (!formData.subjectsTaught.includes(subject)) {
      updateField('subjectsTaught', [...formData.subjectsTaught, subject]);
    }
  };

  const removeSubject = (subject: string) => {
    updateField(
      'subjectsTaught',
      formData.subjectsTaught.filter((s) => s !== subject)
    );
  };

  // Multi-select for Classes
  const addClass = (cls: string) => {
    if (!formData.assignedClasses.includes(cls)) {
      updateField('assignedClasses', [...formData.assignedClasses, cls]);
    }
  };

  const removeClass = (cls: string) => {
    updateField(
      'assignedClasses',
      formData.assignedClasses.filter((c) => c !== cls)
    );
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Use format: +92 300 1234567 or 03001234567';
    }
    if (!formData.cnic) newErrors.cnic = 'CNIC is required';
    else if (!validateCNIC(formData.cnic)) {
      newErrors.cnic = 'Invalid CNIC (format: 42000-1234567-1)';
    }
    if (!formData.emergencyNumber) {
      newErrors.emergencyNumber = 'Emergency number is required';
    } else if (!validateEmergencyNumber(formData.emergencyNumber)) {
      newErrors.emergencyNumber = 'Use format: +92 300 1234567 or 03001234567';
    }
    if (!formData.department) newErrors.department = 'Please select a department';
    if (!formData.highestDegree) newErrors.highestDegree = 'Please select highest degree';
    if (!formData.shift) newErrors.shift = 'Please select a shift';
    if (formData.subjectsTaught.length === 0) {
      newErrors.subjectsTaught = 'Please select at least one subject';
    }
    if (formData.assignedClasses.length === 0) {
      newErrors.assignedClasses = 'Please select at least one class';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const departmentObj = departments.find(d => d.name === formData.department);
      const departmentId = departmentObj?.id || '';

      // Get section IDs from class names (format: "Class X - Section Y")
      const sectionIds = formData.assignedClasses
        .map(className => {
          // Try to find the class by exact match
          let classItem = classes.find(c => c.name === className);
          
          // If not found, try to find by partial match
          if (!classItem) {
            // Extract section name from the assigned class name
            const parts = className.split(' - ');
            const sectionName = parts.length > 1 ? parts[1] : className;
            
            classItem = classes.find(c => c.name.includes(sectionName));
          }
          
          return classItem?.id;
        })
        .filter(id => id !== undefined && id !== null) as number[];

      // Get subject IDs from names
      const subjectIds = formData.subjectsTaught
        .map(subjectName => {
          const subjectItem = subjects.find(s => s.name === subjectName);
          return subjectItem?.id;
        })
        .filter(id => id !== undefined && id !== null) as number[];

      console.log('Saving teacher data:', { sectionIds, subjectIds, departmentId, mode });

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

      let result;
      
      if (mode === 'edit' && formData.teacherId) {
        console.log('Updating teacher with ID:', formData.teacherId);
        result = await teacherService.updateTeacher(formData.teacherId, teacherData);
      } else {
        console.log('Creating new teacher...');
        result = await teacherService.createTeacher(teacherData);
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

  if (loading || departmentsLoading || subjectsLoading || classesLoading) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
          <span className="text-white text-lg">Loading data...</span>
        </div>
      </div>
    );
  }

  const subjectNames = subjects.map((s) => s.name);
  const classNames = classes.map((c) => c.name);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 
        bg-black/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        className="relative w-full max-w-4xl my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative rounded-3xl bg-gradient-to-br from-emerald-900 
            via-teal-900 to-cyan-900 border border-white/20 shadow-2xl 
            overflow-hidden"
        >
          <ModalHeader onClose={handleClose} />

          <div className="px-8 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {submitError && (
              <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200">
                <p className="font-semibold">Error Saving Teacher</p>
                <p className="text-sm">{submitError}</p>
              </div>
            )}

            {/* ===== SECTION 1: Basic Information ===== */}
            <FormSection title="Basic Information" number={1}>
              <ProfileUpload
                preview={formData.profilePreview}
                error={errors.profilePicture}
                onDrop={handleProfileDrop}
                onUpload={handleProfileUpload}
                dragActive={dragActive}
                setDragActive={setDragActive}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="First Name *"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="John"
                  error={errors.firstName}
                />

                <FormInput
                  label="Last Name *"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Doe"
                  error={errors.lastName}
                />

                <FormInput
                  label="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="teacher@school.edu"
                  error={errors.email}
                  icon={Mail}
                />

                <div>
                  <label className="text-emerald-100 text-sm mb-1 block font-medium">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 
                        text-yellow-300/70"
                    />
                    <input
                      type="text"
                      value={phoneDisplay}
                      onChange={handlePhoneChange}
                      placeholder="+92 300 1234567"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 
                        border border-white/20 text-white placeholder-white/40 
                        focus:ring-2 focus:ring-yellow-400 outline-none"
                    />
                  </div>
                  {phoneError && (
                    <p className="text-red-300 text-xs mt-1">{phoneError}</p>
                  )}
                  {errors.phone && (
                    <p className="text-red-300 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-emerald-100 text-sm mb-1 block font-medium">
                    CNIC *
                  </label>
                  <div className="relative">
                    <FileUser
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 
                        text-yellow-300/70"
                    />
                    <input
                      type="text"
                      value={cnicDisplay}
                      onChange={handleCnicChange}
                      placeholder="42000-1234567-1"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 
                        border border-white/20 text-white placeholder-white/40 
                        focus:ring-2 focus:ring-yellow-400 outline-none"
                    />
                  </div>
                  {cnicError && (
                    <p className="text-red-300 text-xs mt-1">{cnicError}</p>
                  )}
                  {errors.cnic && (
                    <p className="text-red-300 text-xs mt-1">{errors.cnic}</p>
                  )}
                </div>

                <div>
                  <label className="text-emerald-100 text-sm mb-1 block font-medium">
                    Gender
                  </label>
                  <div className="flex gap-4 mt-1.5">
                    {['male', 'female'].map((g) => (
                      <label
                        key={g}
                        className="flex items-center gap-2 cursor-pointer 
                          text-white capitalize"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.gender === g}
                          onChange={(e) => {
                            updateField('gender', e.target.value as 'male' | 'female' | 'other' | '');
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="text-red-300 text-xs mt-1">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <label className="text-emerald-100 text-sm mb-1 block font-medium">
                    Emergency Number *
                  </label>
                  <div className="relative">
                    <PhoneCall
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 
                        text-yellow-300/70"
                    />
                    <input
                      type="text"
                      value={emergencyDisplay}
                      onChange={handleEmergencyChange}
                      placeholder="+92 300 1234567"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 
                        border border-white/20 text-white placeholder-white/40 
                        focus:ring-2 focus:ring-yellow-400 outline-none"
                    />
                  </div>
                  {emergencyError && (
                    <p className="text-red-300 text-xs mt-1">{emergencyError}</p>
                  )}
                  {errors.emergencyNumber && (
                    <p className="text-red-300 text-xs mt-1">{errors.emergencyNumber}</p>
                  )}
                </div>
              </div>
            </FormSection>

            {/* ===== SECTION 2: Professional Details ===== */}
            <FormSection title="Professional Details" number={2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block font-medium">
                    Joining Date
                  </label>
                  <div className="relative">
                    <Calendar
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 
                        text-yellow-300/70"
                    />
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => {
                        updateField('joiningDate', e.target.value);
                      }}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 
                        border border-white/20 text-white placeholder-white/40 
                        focus:ring-2 focus:ring-yellow-400 outline-none"
                    />
                  </div>
                  {errors.joiningDate && (
                    <p className="text-red-300 text-xs mt-1">{errors.joiningDate}</p>
                  )}
                </div>

                <div>
                  <label className="text-emerald-100 text-sm mb-1 block font-medium">
                    Campus Name
                  </label>
                  <div className="relative">
                    <Building2
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 
                        text-yellow-300/70"
                    />
                    <input
                      disabled
                      value={campus?.campus_name || formData.campus || 'Not Available'}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 
                        border border-white/10 text-white/70 cursor-not-allowed
                        text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="mb-1">
                  <label className="text-emerald-100 text-sm mb-1 block font-medium">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => updateField('department', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 
                      text-white focus:ring-2 focus:ring-yellow-400 outline-none appearance-none 
                      cursor-pointer"
                  >
                    <option value="" className="bg-emerald-900">
                      Select Department
                    </option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name} className="bg-emerald-900">
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="text-red-300 text-xs mt-1">{errors.department}</p>
                  )}
                </div>

                <FormSelect
                  label="Shift *"
                  value={formData.shift}
                  onChange={(e) => updateField('shift', e.target.value as any)}
                  options={SHIFTS}
                  error={errors.shift}
                  placeholder="Select Shift"
                />
              </div>

              {/* Classes - Dynamic from API */}
              <MultiSelectChips
                label="Assigned Classes *"
                items={formData.assignedClasses}
                onAdd={addClass}
                onRemove={removeClass}
                options={classNames}
                chipColor="bg-yellow-400/20 text-yellow-200"
                searchPlaceholder="Search classes..."
              />
              {errors.assignedClasses && (
                <p className="text-red-300 text-xs mt-1">{errors.assignedClasses}</p>
              )}

              {/* Subjects - Dynamic from API */}
              <MultiSelectChips
                label="Subjects Taught *"
                items={formData.subjectsTaught}
                onAdd={addSubject}
                onRemove={removeSubject}
                options={subjectNames}
                chipColor="bg-cyan-400/20 text-cyan-200"
                searchPlaceholder="Search subjects..."
              />
              {errors.subjectsTaught && (
                <p className="text-red-300 text-xs mt-1">{errors.subjectsTaught}</p>
              )}
            </FormSection>

            {/* ===== SECTION 3: Qualifications & Extra ===== */}
            <FormSection title="Qualifications & Extra" number={3}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  label="Highest Degree *"
                  value={formData.highestDegree}
                  onChange={(e) => updateField('highestDegree', e.target.value)}
                  options={DEGREES}
                  error={errors.highestDegree}
                />
              </div>

              <FormTextarea
                label="Extra Details"
                value={formData.extraDetail}
                onChange={(e) => updateField('extraDetail', e.target.value)}
                placeholder="Additional notes, achievements, certifications, etc."
                rows={3}
              />
            </FormSection>
          </div>

          <ModalFooter 
            onClose={handleClose} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            mode={mode}
          />
        </div>
      </div>
    </div>
  );
}
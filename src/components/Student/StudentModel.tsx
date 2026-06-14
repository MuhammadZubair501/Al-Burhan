import React, { useState, useRef, useCallback, useMemo } from 'react';
import { 
  X, Upload, Calendar, ChevronDown, Check, Search, 
  Plus, Trash2, User, Mail, Phone, Heart, BookOpen,
  FileText, Award, Clock, Users, BookMarked, AlertCircle,
  Briefcase, GraduationCap, Activity, PhoneCall, UserCheck
} from 'lucide-react';

// ==================== Types ====================
interface StudentFormData {
  // Personal Details
  studentPicture: File | null;
  studentPreview: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
  phone: string;
  email: string;
  
  // Academic Enrollment
  admissionNumber: string;
  enrollmentClass: string;
  section: string;
  extraCurriculars: string[];
  
  // Guardian & Emergency Information
  primaryGuardianName: string;
  relationship: string;
  emergencyPhone: string;
  medicalDisclosures: string;
  
  // Qualifications & Files
  highestDegree: string;
}

// Available options
const CLASSES = [
  'Pre-KG', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

const EXTRA_CURRICULARS = [
  'Sports (Cricket)', 'Sports (Football)', 'Sports (Basketball)', 'Swimming',
  'Music (Vocal)', 'Music (Instrumental)', 'Dance', 'Drama / Theatre',
  'Art & Painting', 'Debate Club', 'Science Club', 'Robotics Club',
  'Chess Club', 'Quiz Club', 'Environmental Club', 'Student Council'
];

const RELATIONSHIPS = ['Father', 'Mother', 'Guardian', 'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Sibling'];

const DEGREES = ['Nursery', 'Kindergarten', 'Primary School', 'Middle School', 'High School', 'Bachelor\'s', 'Master\'s', 'PhD', 'Diploma'];

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StudentFormData) => void;
  initialData?: Partial<StudentFormData>;
  lastAdmissionNumber?: number;
}

// ==================== Helper Functions ====================
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+92|0)[0-9]{10}$|^\+92 [0-9]{3} [0-9]{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const formatPhoneInput = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length > 2) {
    if (digits.length <= 5) return `+${digits}`;
    if (digits.length <= 8) return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  }
  if (digits.startsWith('0') && digits.length > 1) {
    if (digits.length <= 5) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  }
  return digits;
};

const formatPakPhone = (value: string) => {
  let digits = value.replace(/\D/g, "");
  if (!digits.startsWith("92")) {
    if (digits.startsWith("0")) {
      digits = "92" + digits.slice(1);
    }
  }
  digits = digits.slice(0, 12);
  let formatted = "+";
  if (digits.length > 0) {
    formatted += digits.slice(0, 2);
  }
  if (digits.length > 2) {
    formatted += " " + digits.slice(2, 5);
  }
  if (digits.length > 5) {
    formatted += " " + digits.slice(5);
  }
  return formatted;
};

const formatDateForPicker = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// ==================== Main Component ====================
export default function StudentForm({ isOpen, onClose, onSave, initialData, lastAdmissionNumber = 24001 }: StudentFormProps) {
  // Form State
  const [formData, setFormData] = useState<StudentFormData>({
    studentPicture: null,
    studentPreview: '',
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    gender: initialData?.gender || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    admissionNumber: initialData?.admissionNumber || String(lastAdmissionNumber),
    enrollmentClass: initialData?.enrollmentClass || '',
    section: initialData?.section || '',
    extraCurriculars: initialData?.extraCurriculars || [],
    primaryGuardianName: initialData?.primaryGuardianName || '',
    relationship: initialData?.relationship || '',
    emergencyPhone: initialData?.emergencyPhone || '',
    medicalDisclosures: initialData?.medicalDisclosures || '',
    highestDegree: initialData?.highestDegree || ''
  });

  // UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [extraCurricularSearch, setExtraCurricularSearch] = useState('');
  const [openExtraDropdown, setOpenExtraDropdown] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [countryCode, setCountryCode] = useState('+92');
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyPhoneError, setEmergencyPhoneError] = useState("");

  // Refs
  const pictureInputRef = useRef<HTMLInputElement>(null);

  // Filtered extra-curriculars
  const filteredExtras = useMemo(() => {
    return EXTRA_CURRICULARS.filter(e => 
      e.toLowerCase().includes(extraCurricularSearch.toLowerCase()) &&
      !formData.extraCurriculars.includes(e)
    );
  }, [extraCurricularSearch, formData.extraCurriculars]);

  // Handlers
  const updateField = <K extends keyof StudentFormData>(field: K, value: StudentFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Student Picture Handler
  const handlePictureDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, studentPicture: 'Image must be less than 2MB' }));
        return;
      }
      const preview = URL.createObjectURL(file);
      updateField('studentPicture', file);
      updateField('studentPreview', preview);
      setErrors(prev => ({ ...prev, studentPicture: '' }));
    } else {
      setErrors(prev => ({ ...prev, studentPicture: 'Please upload an image file' }));
    }
  }, []);

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, studentPicture: 'Image must be less than 2MB' }));
        return;
      }
      const preview = URL.createObjectURL(file);
      updateField('studentPicture', file);
      updateField('studentPreview', preview);
      setErrors(prev => ({ ...prev, studentPicture: '' }));
    }
  };

  const addExtraCurricular = (activity: string) => {
    if (!formData.extraCurriculars.includes(activity)) {
      updateField('extraCurriculars', [...formData.extraCurriculars, activity]);
    }
    setExtraCurricularSearch('');
  };

  const removeExtraCurricular = (activity: string) => {
    updateField('extraCurriculars', formData.extraCurriculars.filter(a => a !== activity));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Please select gender';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Use format: +92 300 1234567 or 03001234567';
    if (!formData.admissionNumber) newErrors.admissionNumber = 'Admission number is required';
    if (!formData.enrollmentClass) newErrors.enrollmentClass = 'Please select enrollment class';
    if (!formData.section) newErrors.section = 'Please select section';
    if (!formData.primaryGuardianName) newErrors.primaryGuardianName = 'Guardian name is required';
    if (!formData.relationship) newErrors.relationship = 'Please select relationship';
    if (!formData.emergencyPhone) newErrors.emergencyPhone = 'Emergency contact is required';
    else if (!validatePhone(formData.emergencyPhone)) newErrors.emergencyPhone = 'Use valid phone format';
    if (!formData.highestDegree) newErrors.highestDegree = 'Please select highest qualification';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const todayDate = formatDateForPicker(new Date());

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl my-8">
        {/* Modal - Matching Teacher Theme */}
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 border border-white/20 shadow-2xl overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-red-500/30 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-white/10">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-xl">
              <GraduationCap size={40} className="text-emerald-900" />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-white">Student Enrollment</h2>
            <p className="text-emerald-100 mt-1">Register new student with complete details</p>
          </div>

          {/* Form Content */}
          <div className="px-8 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            {/* 1. Personal Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-yellow-400/20 flex items-center justify-center text-sm">1</span>
                Personal Details
              </h3>
              
              {/* Student Picture - Circular Drag & Drop */}
              <div className="flex justify-center mb-6">
                <div
                  className={`relative w-32 h-32 rounded-full border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                    dragActive ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/40 bg-white/5'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handlePictureDrop}
                  onClick={() => pictureInputRef.current?.click()}
                >
                  {formData.studentPreview ? (
                    <img src={formData.studentPreview} alt="Student" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/60">
                      <Upload size={28} />
                      <span className="text-[10px] mt-1">Upload</span>
                    </div>
                  )}
                </div>
                <input ref={pictureInputRef} type="file" accept="image/*" className="hidden" onChange={handlePictureUpload} />
              </div>
              {errors.studentPicture && <p className="text-red-300 text-xs text-center">{errors.studentPicture}</p>}
              <p className="text-white/50 text-xs text-center mb-4">Student photo (PNG, JPG up to 2MB)</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">First Name *</label>
                  <input
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 outline-none"
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-red-300 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Last Name *</label>
                  <input
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 outline-none"
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-red-300 text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Date of Birth *</label>
                  <input
                    type="date"
                    max={todayDate}
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                  />
                  {errors.dateOfBirth && <p className="text-red-300 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Gender *</label>
                  <div className="flex gap-3 mt-1">
                    {['male', 'female', 'other'].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.gender === g}
                          onChange={(e) => updateField('gender', e.target.value as any)}
                          className="w-4 h-4 accent-yellow-400"
                        />
                        <span className="text-white capitalize">{g}</span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && <p className="text-red-300 text-xs mt-1">{errors.gender}</p>}
                </div>
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Phone Number *</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        const formatted = formatPakPhone(e.target.value);
                        setPhone(formatted);
                        updateField('phone', formatted);
                        const digits = formatted.replace(/\D/g, "");
                        if (digits.length < 12) {
                          setPhoneError("Invalid phone number (format: +92 300 1234567)");
                        } else {
                          setPhoneError("");
                        }
                      }}
                      placeholder="+92 300 1234567"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 outline-none"
                    />
                  </div>
                  {(phoneError || errors.phone) && <p className="text-red-300 text-xs mt-1">{phoneError || errors.phone}</p>}
                </div>
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 outline-none"
                    placeholder="student@school.edu"
                  />
                  {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* 2. Academic Enrollment */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-yellow-400/20 flex items-center justify-center text-sm">2</span>
                Academic Enrollment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Roll / Admission Number *</label>
                  <input
                    value={formData.admissionNumber}
                    onChange={(e) => updateField('admissionNumber', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                    placeholder="Auto-generated or manual"
                  />
                  {errors.admissionNumber && <p className="text-red-300 text-xs mt-1">{errors.admissionNumber}</p>}
                </div>
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Enrollment Class *</label>
                  <select
                    value={formData.enrollmentClass}
                    onChange={(e) => updateField('enrollmentClass', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                  >
                    <option value="" className="bg-emerald-900">Select Class</option>
                    {CLASSES.map(cls => <option key={cls} value={cls} className="bg-emerald-900">{cls}</option>)}
                  </select>
                  {errors.enrollmentClass && <p className="text-red-300 text-xs mt-1">{errors.enrollmentClass}</p>}
                </div>
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Section / Batch *</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {SECTIONS.map(sec => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => updateField('section', sec)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          formData.section === sec
                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-950 font-semibold shadow-lg'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        Section {sec}
                      </button>
                    ))}
                  </div>
                  {errors.section && <p className="text-red-300 text-xs mt-1">{errors.section}</p>}
                </div>
              </div>

              {/* Extra-Curriculars - Multi-select chips */}
              <div className="mt-4">
                <label className="text-emerald-100 text-sm mb-1 block">Extra-Curricular Activities</label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[50px] p-2 rounded-xl bg-white/5 border border-white/20">
                    {formData.extraCurriculars.map(activity => (
                      <span key={activity} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-200 text-sm">
                        {activity}
                        <button onClick={() => removeExtraCurricular(activity)} className="hover:text-red-300"><X size={14} /></button>
                      </span>
                    ))}
                    <button
                      onClick={() => setOpenExtraDropdown(!openExtraDropdown)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm hover:bg-white/20"
                    >
                      <Plus size={14} /> Add Activity
                    </button>
                  </div>
                  {openExtraDropdown && (
                    <div className="absolute z-10 w-full mt-1 rounded-xl bg-emerald-800 border border-white/20 shadow-lg overflow-hidden">
                      <div className="p-2 border-b border-white/10">
                        <input
                          value={extraCurricularSearch}
                          onChange={(e) => setExtraCurricularSearch(e.target.value)}
                          placeholder="Search activities..."
                          className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {filteredExtras.map(activity => (
                          <div key={activity} onClick={() => addExtraCurricular(activity)} className="px-4 py-2 text-white hover:bg-yellow-400/20 cursor-pointer">
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Guardian & Emergency Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-yellow-400/20 flex items-center justify-center text-sm">3</span>
                Guardian & Emergency Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Primary Guardian Name *</label>
                  <input
                    value={formData.primaryGuardianName}
                    onChange={(e) => updateField('primaryGuardianName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 outline-none"
                    placeholder="Full name of parent/guardian"
                  />
                  {errors.primaryGuardianName && <p className="text-red-300 text-xs mt-1">{errors.primaryGuardianName}</p>}
                </div>
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Relationship *</label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => updateField('relationship', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                  >
                    <option value="" className="bg-emerald-900">Select Relationship</option>
                    {RELATIONSHIPS.map(rel => <option key={rel} value={rel} className="bg-emerald-900">{rel}</option>)}
                  </select>
                  {errors.relationship && <p className="text-red-300 text-xs mt-1">{errors.relationship}</p>}
                </div>
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Emergency Contact Phone *</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300" />
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => {
                        const formatted = formatPakPhone(e.target.value);
                        setEmergencyPhone(formatted);
                        updateField('emergencyPhone', formatted);
                        const digits = formatted.replace(/\D/g, "");
                        if (digits.length < 12) {
                          setEmergencyPhoneError("Invalid phone number (format: +92 300 1234567)");
                        } else {
                          setEmergencyPhoneError("");
                        }
                      }}
                      placeholder="+92 300 1234567"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 outline-none"
                    />
                  </div>
                  {(emergencyPhoneError || errors.emergencyPhone) && <p className="text-red-300 text-xs mt-1">{emergencyPhoneError || errors.emergencyPhone}</p>}
                </div>
              </div>
              <div className="mt-4">
                <label className="text-emerald-100 text-sm mb-1 block">Medical Disclosures (Allergies/Conditions)</label>
                <textarea
                  value={formData.medicalDisclosures}
                  onChange={(e) => updateField('medicalDisclosures', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
                  placeholder="List any allergies, medical conditions, or special requirements..."
                />
              </div>
            </div>

            {/* 4. Qualifications & Files */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-yellow-400/20 flex items-center justify-center text-sm">4</span>
                Previous Qualifications
              </h3>
              <div>
                <label className="text-emerald-100 text-sm mb-1 block">Highest Qualification *</label>
                <select
                  value={formData.highestDegree}
                  onChange={(e) => updateField('highestDegree', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                >
                  <option value="" className="bg-emerald-900">Select Qualification</option>
                  {DEGREES.map(deg => <option key={deg} value={deg} className="bg-emerald-900">{deg}</option>)}
                </select>
                {errors.highestDegree && <p className="text-red-300 text-xs mt-1">{errors.highestDegree}</p>}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="px-8 py-6 bg-black/20 flex justify-end gap-3 border-t border-white/10">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition">
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-950 font-bold hover:scale-105 transition shadow-lg">
              Enroll Student
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
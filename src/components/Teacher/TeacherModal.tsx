import React, { useState, useRef, useCallback, useMemo } from 'react';
import { 
  X, Upload, Calendar, ChevronDown, Check, Search, 
  Plus, Trash2, User, Mail, Phone, Briefcase, GraduationCap,
  BookOpen, FileText, Award, Clock, Users, BookMarked
} from 'lucide-react';

// ==================== Types ====================
interface TeacherModalData {
  // Basic Information
  profilePicture: File | null;
  profilePreview: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Professional Details
  teacherId: string;
  joiningDate: string;
  department: string;
  assignedClasses: string[];
  subjectsTaught: string[];
  // Qualifications & Files
  highestDegree: string;
  experience: number;
  cvFile: File | null;
  cvFileName: string;
}

// Available options
const DEPARTMENTS = [
  'Mathematics', 'Science', 'English', 'Urdu', 'Islamic Studies',
  'Computer Science', 'Physics', 'Chemistry', 'Biology', 'Social Studies'
];

const CLASSES = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
];

const SUBJECTS = [
  'Mathematics', 'Algebra', 'Geometry', 'Physics', 'Chemistry', 'Biology',
  'English Literature', 'English Grammar', 'Urdu', 'Islamic Studies',
  'Computer Science', 'Programming', 'History', 'Geography', 'Economics'
];

const DEGREES = ['Bachelor\'s', 'Master\'s', 'MPhil', 'PhD', 'Diploma', 'Associate Degree'];

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TeacherModalData) => void;
  initialData?: Partial<TeacherModalData>;
}

// ==================== Helper Functions ====================
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  // Supports: +92 300 1234567, +923001234567, 03001234567
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

// ==================== Main Component ====================
export default function TeacherModal({ isOpen, onClose, onSave, initialData }: TeacherModalProps) {
  // Form State
  const [formData, setFormData] = useState<TeacherModalData>({
    profilePicture: null,
    profilePreview: '',
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    teacherId: initialData?.teacherId || Math.floor(10000 + Math.random() * 90000).toString(),
    joiningDate: initialData?.joiningDate || new Date().toISOString().split('T')[0],
    department: initialData?.department || '',
    assignedClasses: initialData?.assignedClasses || [],
    subjectsTaught: initialData?.subjectsTaught || [],
    highestDegree: initialData?.highestDegree || '',
    experience: initialData?.experience || 0,
    cvFile: null,
    cvFileName: ''
  });

  // UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subjectSearch, setSubjectSearch] = useState('');
  const [classSearch, setClassSearch] = useState('');
  const [openSubjectDropdown, setOpenSubjectDropdown] = useState(false);
  const [openClassDropdown, setOpenClassDropdown] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [cvDragActive, setCvDragActive] = useState(false);
const [phone, setPhone] = useState("");
const [phoneError, setPhoneError] = useState("");
  // Refs
  const profileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // Filtered options
  const filteredSubjects = useMemo(() => {
    return SUBJECTS.filter(s => 
      s.toLowerCase().includes(subjectSearch.toLowerCase()) &&
      !formData.subjectsTaught.includes(s)
    );
  }, [subjectSearch, formData.subjectsTaught]);

  const filteredClasses = useMemo(() => {
    return CLASSES.filter(c => 
      c.toLowerCase().includes(classSearch.toLowerCase()) &&
      !formData.assignedClasses.includes(c)
    );
  }, [classSearch, formData.assignedClasses]);

  // Handlers
  const updateField = <K extends keyof TeacherModalData>(field: K, value: TeacherModalData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Profile Picture Handler (Circular drag & drop with size limit - 2MB)
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

  // CV Upload Handler (PDF/DOCX)
  const handleCvDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setCvDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx'))) {
      updateField('cvFile', file);
      updateField('cvFileName', file.name);
      setErrors(prev => ({ ...prev, cvFile: '' }));
    } else {
      setErrors(prev => ({ ...prev, cvFile: 'Only PDF and DOCX files are allowed' }));
    }
  }, []);

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        updateField('cvFile', file);
        updateField('cvFileName', file.name);
        setErrors(prev => ({ ...prev, cvFile: '' }));
      } else {
        setErrors(prev => ({ ...prev, cvFile: 'Only PDF and DOCX files are allowed' }));
      }
    }
  };

  // Multi-select chips handlers
  const addSubject = (subject: string) => {
    if (!formData.subjectsTaught.includes(subject)) {
      updateField('subjectsTaught', [...formData.subjectsTaught, subject]);
    }
    setSubjectSearch('');
  };

  const removeSubject = (subject: string) => {
    updateField('subjectsTaught', formData.subjectsTaught.filter(s => s !== subject));
  };

  const addClass = (className: string) => {
    if (!formData.assignedClasses.includes(className)) {
      updateField('assignedClasses', [...formData.assignedClasses, className]);
    }
    setClassSearch('');
  };

  const removeClass = (className: string) => {
    updateField('assignedClasses', formData.assignedClasses.filter(c => c !== className));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Use format: +92 300 1234567 or 03001234567';
    if (!formData.department) newErrors.department = 'Please select a department';
    if (!formData.highestDegree) newErrors.highestDegree = 'Please select highest degree';
    if (!formData.cvFile) newErrors.cvFile = 'CV/Resume is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };
const formatPakPhone = (value: string) => {
  // Remove everything except numbers
  let digits = value.replace(/\D/g, "");

  // Ensure starts with 92
  if (!digits.startsWith("92")) {
    if (digits.startsWith("0")) {
      digits = "92" + digits.slice(1);
    }
  }

  // Limit to 12 digits (92 + 10 digits)
  digits = digits.slice(0, 12);

  // Format: +92 300 1234567
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl my-8">
        {/* Modal */}
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
              <User size={40} className="text-emerald-900" />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-white">Teacher Profile</h2>
            <p className="text-emerald-100 mt-1">Complete your professional information</p>
          </div>

          {/* Form Content */}
          <div className="px-8 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            {/* 1. Basic Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-yellow-400/20 flex items-center justify-center text-sm">1</span>
                Basic Information
              </h3>
              
              {/* Profile Picture - Circular Drag & Drop */}
              <div className="flex justify-center mb-6">
                <div
                  className={`relative w-32 h-32 rounded-full border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                    dragActive ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/40 bg-white/5'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleProfileDrop}
                  onClick={() => profileInputRef.current?.click()}
                >
                  {formData.profilePreview ? (
                    <img src={formData.profilePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/60">
                      <Upload size={28} />
                      <span className="text-[10px] mt-1">Upload</span>
                    </div>
                  )}
                </div>
                <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
              </div>
              {errors.profilePicture && <p className="text-red-300 text-xs text-center">{errors.profilePicture}</p>}
              <p className="text-white/50 text-xs text-center mb-4">PNG, JPG up to 2MB (Circular)</p>

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
                  <label className="text-emerald-100 text-sm mb-1 block">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 outline-none"
                    placeholder="teacher@school.edu"
                  />
                  {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
  <label className="block text-green-100 text-sm mb-2">
    Phone Number
  </label>

  <div className="relative">
    <Phone
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300"
    />

    <input
      type="text"
      value={phone}
      onChange={(e) => {
        const formatted = formatPakPhone(e.target.value);
        setPhone(formatted);

        const digits = formatted.replace(/\D/g, "");
        if (digits.length < 12) {
          setPhoneError("Invalid phone number (format: +92 300 1234567)");
        } else {
          setPhoneError("");
        }
      }}
      placeholder="+92 300 1234567"
      className="
        w-full
        pl-12
        pr-4
        py-4
        rounded-2xl
        bg-white/10
        border
        border-white/20
        text-white
        placeholder-green-200
        focus:outline-none
        focus:ring-2
        focus:ring-yellow-400
      "
    />
  </div>

  {/* 👇 ADD ERROR MESSAGE HERE (RIGHT UNDER INPUT) */}
  {phoneError && (
    <p className="text-red-300 text-xs mt-2">
      {phoneError}
    </p>
  )}
</div>
              </div>
            </div>

            {/* 2. Professional Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-yellow-400/20 flex items-center justify-center text-sm">2</span>
                Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Teacher ID</label>
                  <input
                    value={formData.teacherId}
                    onChange={(e) => updateField('teacherId', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Joining Date</label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => updateField('joiningDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => updateField('department', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                  >
                    <option value="" className="bg-emerald-900">Select Department</option>
                    {DEPARTMENTS.map(dept => <option key={dept} value={dept} className="bg-emerald-900">{dept}</option>)}
                  </select>
                  {errors.department && <p className="text-red-300 text-xs mt-1">{errors.department}</p>}
                </div>
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={(e) => updateField('experience', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                  />
                </div>
              </div>

              {/* Assigned Classes - Multi-select chips */}
              <div className="mt-4">
                <label className="text-emerald-100 text-sm mb-1 block">Assigned Classes</label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[50px] p-2 rounded-xl bg-white/5 border border-white/20">
                    {formData.assignedClasses.map(cls => (
                      <span key={cls} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-200 text-sm">
                        {cls}
                        <button onClick={() => removeClass(cls)} className="hover:text-red-300"><X size={14} /></button>
                      </span>
                    ))}
                    <button
                      onClick={() => setOpenClassDropdown(!openClassDropdown)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm hover:bg-white/20"
                    >
                      <Plus size={14} /> Add Class
                    </button>
                  </div>
                  {openClassDropdown && (
                    <div className="absolute z-10 w-full mt-1 rounded-xl bg-emerald-800 border border-white/20 shadow-lg overflow-hidden">
                      <div className="p-2 border-b border-white/10">
                        <input
                          value={classSearch}
                          onChange={(e) => setClassSearch(e.target.value)}
                          placeholder="Search classes..."
                          className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 outline-none"
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {filteredClasses.map(cls => (
                          <div key={cls} onClick={() => addClass(cls)} className="px-4 py-2 text-white hover:bg-yellow-400/20 cursor-pointer">
                            {cls}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Subjects Taught - Searchable multi-select */}
              <div className="mt-4">
                <label className="text-emerald-100 text-sm mb-1 block">Subjects Taught</label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[50px] p-2 rounded-xl bg-white/5 border border-white/20">
                    {formData.subjectsTaught.map(subj => (
                      <span key={subj} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-sm">
                        {subj}
                        <button onClick={() => removeSubject(subj)}><X size={14} /></button>
                      </span>
                    ))}
                    <button
                      onClick={() => setOpenSubjectDropdown(!openSubjectDropdown)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm"
                    >
                      <Plus size={14} /> Add Subject
                    </button>
                  </div>
                  {openSubjectDropdown && (
                    <div className="absolute z-10 w-full mt-1 rounded-xl bg-emerald-800 border border-white/20 shadow-lg overflow-hidden">
                      <div className="p-2 border-b border-white/10">
                        <input
                          value={subjectSearch}
                          onChange={(e) => setSubjectSearch(e.target.value)}
                          placeholder="Search subjects..."
                          className="w-full px-3 py-2 rounded-lg bg-white/10 text-white outline-none"
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {filteredSubjects.map(subj => (
                          <div key={subj} onClick={() => addSubject(subj)} className="px-4 py-2 text-white hover:bg-yellow-400/20 cursor-pointer">
                            {subj}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Qualifications & Files */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-yellow-400/20 flex items-center justify-center text-sm">3</span>
                Qualifications & Files
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-emerald-100 text-sm mb-1 block">Highest Degree *</label>
                  <select
                    value={formData.highestDegree}
                    onChange={(e) => updateField('highestDegree', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                  >
                    <option value="" className="bg-emerald-900">Select Degree</option>
                    {DEGREES.map(deg => <option key={deg} value={deg} className="bg-emerald-900">{deg}</option>)}
                  </select>
                  {errors.highestDegree && <p className="text-red-300 text-xs mt-1">{errors.highestDegree}</p>}
                </div>
              </div>

              {/* CV Upload Dropzone */}
              <div className="mt-4">
                <label className="text-emerald-100 text-sm mb-1 block">CV / Resume (PDF/DOCX) *</label>
                <div
                  className={`mt-1 p-6 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer ${
                    cvDragActive ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/30 bg-white/5'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setCvDragActive(true); }}
                  onDragLeave={() => setCvDragActive(false)}
                  onDrop={handleCvDrop}
                  onClick={() => cvInputRef.current?.click()}
                >
                  <FileText size={32} className="mx-auto text-white/50 mb-2" />
                  <p className="text-white/70 text-sm">
                    {formData.cvFileName || 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-white/40 text-xs mt-1">PDF or DOCX only</p>
                </div>
                <input ref={cvInputRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={handleCvUpload} />
                {errors.cvFile && <p className="text-red-300 text-xs mt-1">{errors.cvFile}</p>}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="px-8 py-6 bg-black/20 flex justify-end gap-3 border-t border-white/10">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition">
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-950 font-bold hover:scale-105 transition shadow-lg">
              Save Teacher Profile
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

import { API_BASE_URL }  from "../config/api";

export default class ApiRoutes {
  // Campus routes
  static CAMPUS = `${API_BASE_URL}/campus`;

  static campusById(id: number | string) {
    return `${API_BASE_URL}/campus/${id}`;
  }

  // Batch routes
  static BATCH = `${API_BASE_URL}/batch`;
  
  static batchById(id: number | string) {
    return `${API_BASE_URL}/batch/${id}`;
  }

  // Subject routes
  static SUBJECT = `${API_BASE_URL}/subject`;
  
  static subjectById(id: number | string) {
    return `${API_BASE_URL}/subject/${id}`;
  }

  // Department routes
  static DEPARTMENT = `${API_BASE_URL}/department`;
  
  static departmentById(id: number | string) {
    return `${API_BASE_URL}/department/${id}`;
  }

  // Fetch departments filtered by a campus ID
  static departmentByCampusId(campusId: number | string) {
    return `${API_BASE_URL}/department/campus/${campusId}`;
  }

  // Section routes
  static SECTION = `${API_BASE_URL}/section`;
  static SECTION_WITH_CLASS_NAMES = `${API_BASE_URL}/section/with-class-names`;

  static sectionById(id: number | string) {
    return `${API_BASE_URL}/section/${id}`;
  }

  static sectionByClassId(classId: number | string) {
    return `${API_BASE_URL}/section/class/${classId}`;
  }

  // Added: Fetch sections with class names filtered by a campus ID
  static sectionByCampusId(campusId: number | string) {
    return `${API_BASE_URL}/section/with-class-names?campusId=${campusId}`;
  }


 // Teacher routes setup
  static TEACHER = `${API_BASE_URL}/teacher`;
  static teacherById(id: number | string) {
    return `${API_BASE_URL}/teacher/${id}`;
  }

static teacherCountByCampus(campusId: number | string) {
  return `${API_BASE_URL}/teacher/count/campus/${campusId}`;
}

  // Student routes
  static STUDENT = `${API_BASE_URL}/student`;
  static studentById(id: number | string) {
    return `${API_BASE_URL}/student/${id}`;
  }
  static studentByCampusId(campusId: number | string) {
    return `${API_BASE_URL}/student/campus/${campusId}`;
  }
// Student Count Routes
static studentCountByCampus(campusId: number | string) {
  return `${API_BASE_URL}/student/count/campus/${campusId}`;
}

static studentCountByClass(classId: number | string) {
  return `${API_BASE_URL}/student/count/class/${classId}`;
}

static studentCountBySection(sectionId: number | string) {
  return `${API_BASE_URL}/student/count/section/${sectionId}`;
}

static STUDENT_ATTENDANCE = `${API_BASE_URL}/student-attendance`;

static studentAttendanceByRange(campusId: number | string, startDate: string, endDate: string, sectionId?: number | string) {
  let url = `${this.STUDENT_ATTENDANCE}/range?campusId=${campusId}&start_date=${startDate}&end_date=${endDate}`;
  if (sectionId) url += `&sectionId=${sectionId}`;
  return url;
}

static studentAttendanceByDateAndCampus(campusId: number | string, date: string, sectionId?: number | string) {
  let url = `${this.STUDENT_ATTENDANCE}?campusId=${campusId}&date=${date}`;
  if (sectionId) url += `&sectionId=${sectionId}`;
  return url;
}

static studentAttendanceBySection(sectionId: number | string) {
  return `${this.STUDENT_ATTENDANCE}/section/${sectionId}`;
}

static studentAttendanceById(id: number | string) {
  return `${this.STUDENT_ATTENDANCE}/${id}`;
}

// Sections with class names (already exists? if not, add)
static sectionsWithClassByCampus(campusId: number | string) {
  return `${API_BASE_URL}/section/with-class-names?campusId=${campusId}`;
}
// ApiRoutes.ts – add this line inside the student attendance section

// Student Attendance routes


// ... other endpoints ...

// Get sections with students in a campus (for attendance dropdown)
static studentAttendanceSections(campusId: number | string) {
  return `${this.STUDENT_ATTENDANCE}/sections/campus/${campusId}`;
}

// Degree routes

static DEGREE = `${API_BASE_URL}/degree`;

static degreeById(id: number | string) {
  return `${API_BASE_URL}/degree/${id}`;
}


 // ============================================
  // MEGA File Management Routes
  // ============================================
  static MEGA_FILES = `${API_BASE_URL}/files`;
  static MEGA_FOLDERS = `${API_BASE_URL}/folders`;
  static MEGA_PROGRESS = `${API_BASE_URL}/progress`;
  
  static megaUploadFile() {
    return `${this.MEGA_FILES}/upload`;
  }
  
  static megaDeleteFile() {
    return `${this.MEGA_FILES}/delete`;
  }
  
  static megaDownloadFile(path: string, name: string) {
    // Properly encode the path and name for URL
    const encodedPath = encodeURIComponent(path);
    const encodedName = encodeURIComponent(name);
    return `${this.MEGA_FILES}/download?path=${encodedPath}&name=${encodedName}`;
  }
  
  static megaDownloadFolder(path: string) {
    const encodedPath = encodeURIComponent(path);
    return `${this.MEGA_FILES}/download-folder?path=${encodedPath}`;
  }
  
  static megaDownloadZip(jobId: string) {
    return `${this.MEGA_FILES}/download-zip/${jobId}`;
  }
  
  static megaProgress(jobId: string) {
    return `${this.MEGA_PROGRESS}/${jobId}`;
  }
  
  static megaGetFolder(path: string = '') {
    const encodedPath = encodeURIComponent(path);
    return `${this.MEGA_FOLDERS}?path=${encodedPath}`;
  }
  
  static megaCreateFolder() {
    return `${this.MEGA_FOLDERS}`;
  }
  
  static megaDeleteFolder() {
    return `${this.MEGA_FOLDERS}`;
  }


 // ============================================
  // AUTH ROUTES
  // ============================================
  static AUTH = `${API_BASE_URL}/auth`;
  
  static login() {
    return `${this.AUTH}/login`;
  }
  
  static profile() {
    return `${this.AUTH}/profile`;
  }
  
  static changePassword() {
    return `${this.AUTH}/change-password`;
  }
  
  static getUserByEmail() {
    return `${this.AUTH}/get-user-by-email`;
  }
  
  static resetPassword() {
    return `${this.AUTH}/reset-password`;
  }

  // ============================================
  // OTP ROUTES
  // ============================================
  static OTP = `${API_BASE_URL}/otp`;
  
  static sendOTP() {
    return `${this.OTP}/send`;
  }
  
  static verifyOTP() {
    return `${this.OTP}/verify`;
  }


}

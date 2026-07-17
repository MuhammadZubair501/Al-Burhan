import { API_BASE_URL } from "../config/api";

export default class ApiRoutes {
  // ============================================
  // CAMPUS ROUTES
  // ============================================
  static CAMPUS = `${API_BASE_URL}/campus`;

  static campusById(id: number | string) {
    return `${API_BASE_URL}/campus/${id}`;
  }

  // ============================================
  // BATCH ROUTES
  // ============================================
  static BATCH = `${API_BASE_URL}/batch`;
  
  static batchById(id: number | string) {
    return `${API_BASE_URL}/batch/${id}`;
  }

  // ============================================
  // SUBJECT ROUTES
  // ============================================
  static SUBJECT = `${API_BASE_URL}/subject`;
  
  static subjectById(id: number | string) {
    return `${API_BASE_URL}/subject/${id}`;
  }

  // ============================================
  // DEPARTMENT ROUTES
  // ============================================
  static DEPARTMENT = `${API_BASE_URL}/department`;
  
  static departmentById(id: number | string) {
    return `${API_BASE_URL}/department/${id}`;
  }

  static departmentByCampusId(campusId: number | string) {
    return `${API_BASE_URL}/department/campus/${campusId}`;
  }

  // ============================================
  // SECTION ROUTES
  // ============================================
  static SECTION = `${API_BASE_URL}/section`;
  static SECTION_WITH_CLASS_NAMES = `${API_BASE_URL}/section/with-class-names`;

  static sectionById(id: number | string) {
    return `${API_BASE_URL}/section/${id}`;
  }

  static sectionByClassId(classId: number | string) {
    return `${API_BASE_URL}/section/class/${classId}`;
  }

  static sectionByCampusId(campusId: number | string) {
    return `${API_BASE_URL}/section/with-class-names?campusId=${campusId}`;
  }

  static sectionsWithClassByCampus(campusId: number | string) {
    return `${API_BASE_URL}/section/with-class-names?campusId=${campusId}`;
  }

  // ============================================
  // TEACHER ROUTES
  // ============================================
  static TEACHER = `${API_BASE_URL}/teacher`;
  
  static teacherById(id: number | string) {
    return `${API_BASE_URL}/teacher/${id}`;
  }

  static teacherCountByCampus(campusId: number | string) {
    return `${API_BASE_URL}/teacher/count/campus/${campusId}`;
  }

  // ============================================
  // STUDENT ROUTES
  // ============================================
  static STUDENT = `${API_BASE_URL}/student`;
  
  static studentById(id: number | string) {
    return `${API_BASE_URL}/student/${id}`;
  }
  
  static studentByCampusId(campusId: number | string) {
    return `${API_BASE_URL}/student/campus/${campusId}`;
  }

  static studentCountByCampus(campusId: number | string) {
    return `${API_BASE_URL}/student/count/campus/${campusId}`;
  }

  static studentCountByClass(classId: number | string) {
    return `${API_BASE_URL}/student/count/class/${classId}`;
  }

  static studentCountBySection(sectionId: number | string) {
    return `${API_BASE_URL}/student/count/section/${sectionId}`;
  }

  // ============================================
  // STUDENT ATTENDANCE ROUTES
  // ============================================
  static STUDENT_ATTENDANCE = `${API_BASE_URL}/student-attendance`;

  static studentAttendanceByRange(
    campusId: number | string, 
    startDate: string, 
    endDate: string, 
    sectionId?: number | string
  ) {
    let url = `${this.STUDENT_ATTENDANCE}/range?campusId=${campusId}&start_date=${startDate}&end_date=${endDate}`;
    if (sectionId) url += `&sectionId=${sectionId}`;
    return url;
  }

  static studentAttendanceByDateAndCampus(
    campusId: number | string, 
    date: string, 
    sectionId?: number | string
  ) {
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

  static studentAttendanceSections(campusId: number | string) {
    return `${this.STUDENT_ATTENDANCE}/sections/campus/${campusId}`;
  }

  // ============================================
  // DEGREE ROUTES
  // ============================================
  static DEGREE = `${API_BASE_URL}/degree`;

  static degreeById(id: number | string) {
    return `${API_BASE_URL}/degree/${id}`;
  }

  // ============================================
  // MEGA FILE MANAGEMENT ROUTES
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

  // EXTEND SESSION ROUTE - ADD THIS
  static extendSession() {
    return `${this.AUTH}/extend-session`;
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

// ApiRoutes.ts (add these static methods)

static importStudents() {
  return `${API_BASE_URL}/section/import-students`;
}

static deleteClassStudentsAndSections(classId: number | string) {
  return `${API_BASE_URL}/section/class/${classId}/delete-all`;
}


}
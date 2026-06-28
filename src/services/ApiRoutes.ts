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

}

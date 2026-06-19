import API_BASE_URL from "../config/api";

export default class ApiRoutes {
  
  
static CAMPUS = `${API_BASE_URL}/campus`;

 // Campus routes
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



}
// services/studentService.ts
import ApiRoutes from "./ApiRoutes";

export interface StudentFormData {
  studentId?: number;
  section_id?: number;
  batch_id?: number;
  roll_number?: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other' | '';
  cnic: string;
  phone_number: string;
  email_address: string;
  emergency_contact_number: string;
  last_previous_highest_qualification?: string;
  shift: string;
  joining_date: string;
  profile_image?: File | null;
  extra_details?: string;
  campus_id: number;
  password?: string;
  role?: string;
  is_active?: boolean;
}

export interface StudentResponse {
  student_id: number;
  section_id: number;
  batch_id: number | null;
  roll_number: string | null;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  cnic: string;
  phone_number: string;
  email_address: string;
  emergency_contact_number: string;
  last_previous_highest_qualification: string | null;
  shift: string;
  joining_date: string;
  profile_image_path: string | null;
  extra_details: string | null;
  campus_id: number;
  is_active: boolean | number;
  role?: string; // Added role field
  section_name?: string;
  class_name?: string;
  class_id?: number;
  batch_name?: string;
  department_name?: string;
  department_id?: number;
  campus_name?: string;
  className?: string;
  sectionName?: string;
  batchName?: string;
}

// Helper function to convert is_active to boolean
const convertIsActive = (student: any): any => {
  return {
    ...student,
    is_active: student.is_active === 1 || student.is_active === true
  };
};

export const studentService = {
  createStudent: async (data: any): Promise<any> => {
    const formData = new FormData();
    
    const jsonData: any = {};
    const excludeKeys = ['profile_image'];
    
    Object.keys(data).forEach(key => {
      if (!excludeKeys.includes(key) && data[key] !== undefined && data[key] !== null) {
        jsonData[key] = data[key];
      }
    });
    
    formData.append('data', JSON.stringify(jsonData));
    
    if (data.profile_image && data.profile_image instanceof File) {
      formData.append('profile_image', data.profile_image);
    }
    
    const response = await fetch(ApiRoutes.STUDENT, {
      method: 'POST',
      body: formData,
    });
    
    return response.json();
  },
  
  getStudentsByCampus: async (campusId: number, includeInactive?: boolean): Promise<{ success: boolean; data: StudentResponse[]; count: number }> => {
    const url = ApiRoutes.studentByCampusId(campusId);
    const params = new URLSearchParams();
    if (includeInactive === true) {
      params.append('includeInactive', 'true');
    }
    const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
    console.log('📊 Fetching students from URL:', fullUrl);
    
    const response = await fetch(fullUrl);
    const result = await response.json();
    console.log('📊 Students response before conversion:', result);
    
    // Convert is_active to boolean for each student
    if (result.success && result.data) {
      result.data = result.data.map(convertIsActive);
    }
    console.log('📊 Students response after conversion:', result);
    return result;
  },
  
  getAllStudents: async (campusId?: number, includeInactive?: boolean): Promise<{ success: boolean; data: StudentResponse[]; count: number }> => {
    let url = ApiRoutes.STUDENT;
    const params = new URLSearchParams();
    if (campusId) params.append('campusId', String(campusId));
    if (includeInactive === true) params.append('includeInactive', 'true');
    if (params.toString()) url += `?${params.toString()}`;
    const response = await fetch(url);
    const result = await response.json();
    
    // Convert is_active to boolean for each student
    if (result.success && result.data) {
      result.data = result.data.map(convertIsActive);
    }
    return result;
  },

  getAllStudentsByCampusNoFilter: async (campusId: number): Promise<{ success: boolean; data: StudentResponse[]; count: number }> => {
    const url = ApiRoutes.studentAllByCampusId(campusId);
    console.log('📊 Fetching ALL students from URL:', url);
    const response = await fetch(url);
    const result = await response.json();
    console.log('📊 All students response before conversion:', result);
    
    // Convert is_active to boolean for each student
    if (result.success && result.data) {
      result.data = result.data.map(convertIsActive);
    }
    console.log('📊 All students response after conversion:', result);
    return result;
  },
  
  getStudentById: async (id: number): Promise<{ success: boolean; data: StudentResponse }> => {
    const response = await fetch(ApiRoutes.studentById(id));
    const result = await response.json();
    
    // Convert is_active to boolean
    if (result.success && result.data) {
      result.data = convertIsActive(result.data);
    }
    return result;
  },
  
  updateStudent: async (id: number, data: any): Promise<any> => {
    const formData = new FormData();
    
    const jsonData: any = {};
    const excludeKeys = ['profile_image'];
    
    Object.keys(data).forEach(key => {
      if (!excludeKeys.includes(key) && data[key] !== undefined && data[key] !== null) {
        jsonData[key] = data[key];
      }
    });
    
    formData.append('data', JSON.stringify(jsonData));
    
    if (data.profile_image && data.profile_image instanceof File) {
      formData.append('profile_image', data.profile_image);
    }
    
    const response = await fetch(ApiRoutes.studentById(id), {
      method: 'PUT',
      body: formData,
    });
    
    return response.json();
  },
  
  deleteStudent: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(ApiRoutes.studentById(id), {
      method: 'DELETE',
    });
    return response.json();
  },

  getStudentCountByCampus: async (
    campusId: number
  ): Promise<{
    success: boolean;
    campus_id: number;
    total_students: number;
  }> => {
    const response = await fetch(ApiRoutes.studentCountByCampus(campusId));
    return response.json();
  },

  getStudentCountByClass: async (
    classId: number
  ): Promise<{
    success: boolean;
    class_id: number;
    total_students: number;
  }> => {
    const response = await fetch(ApiRoutes.studentCountByClass(classId));
    return response.json();
  },

  getStudentCountBySection: async (
    sectionId: number
  ): Promise<{
    success: boolean;
    section_id: number;
    total_students: number;
  }> => {
    const response = await fetch(ApiRoutes.studentCountBySection(sectionId));
    return response.json();
  }
};
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
  is_active: boolean;
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
    let url = ApiRoutes.studentByCampusId(campusId);
    if (includeInactive) {
      url += `?includeInactive=true`;
    }
    const response = await fetch(url);
    return response.json();
  },
  
  getAllStudents: async (campusId?: number, includeInactive?: boolean): Promise<{ success: boolean; data: StudentResponse[]; count: number }> => {
    let url = ApiRoutes.STUDENT;
    const params = new URLSearchParams();
    if (campusId) params.append('campusId', String(campusId));
    if (includeInactive) params.append('includeInactive', 'true');
    if (params.toString()) url += `?${params.toString()}`;
    const response = await fetch(url);
    return response.json();
  },
  
  getStudentById: async (id: number): Promise<{ success: boolean; data: StudentResponse }> => {
    const response = await fetch(ApiRoutes.studentById(id));
    return response.json();
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
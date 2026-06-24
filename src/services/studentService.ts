// services/studentService.ts
import ApiRoutes from "./ApiRoutes";

export interface StudentFormData {
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
  section_name?: string;
  class_name?: string;
  class_id?: number;
  batch_name?: string;
  department_name?: string;
  department_id?: number;
  campus_name?: string;
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
    
    if (data.profile_image) {
      formData.append('profile_image', data.profile_image);
    }
    
    const response = await fetch(ApiRoutes.STUDENT, {
      method: 'POST',
      body: formData,
    });
    
    return response.json();
  },
  
  getStudentsByCampus: async (campusId: number): Promise<{ success: boolean; data: StudentResponse[]; count: number }> => {
    const response = await fetch(ApiRoutes.studentByCampusId(campusId));
    return response.json();
  },
  
  getAllStudents: async (campusId?: number): Promise<{ success: boolean; data: StudentResponse[]; count: number }> => {
    const url = campusId ? `${ApiRoutes.STUDENT}?campusId=${campusId}` : ApiRoutes.STUDENT;
    const response = await fetch(url);
    return response.json();
  },
  
  getStudentById: async (id: number): Promise<{ success: boolean; data: StudentResponse }> => {
    const response = await fetch(ApiRoutes.studentById(id));
    return response.json();
  },
  
  updateStudent: async (id: number, data: Partial<StudentFormData>): Promise<any> => {
    const formData = new FormData();
    
    const jsonData: any = {};
    const excludeKeys = ['profile_image'];
    
    Object.keys(data).forEach(key => {
      if (!excludeKeys.includes(key) && data[key as keyof StudentFormData] !== undefined) {
        jsonData[key] = data[key as keyof StudentFormData];
      }
    });
    
    formData.append('data', JSON.stringify(jsonData));
    
    if (data.profile_image) {
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
  }
};
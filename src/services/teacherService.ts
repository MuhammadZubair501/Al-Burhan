import ApiRoutes from "./ApiRoutes";

export interface TeacherFormData {
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  gender: 'male' | 'female' | 'other' | '';
  cnic_number: string;
  emergency_number: string;
  joining_date: string;
  department_id: number | string;
  shift: string;
  campus_id: number | string;
  highest_education: string;
  extra_details: string;
  sections: (string | number)[];
  subjects: (string | number)[];
  profile_image?: File | null;
  password?: string;
  role?: string;
}

export const teacherService = {
  async getTeachers() {
    const res = await fetch(ApiRoutes.TEACHER);
    if (!res.ok) throw new Error('Failed to fetch teachers');
    return await res.json();
  },

  async getTeacherById(id: number | string) {
    const res = await fetch(ApiRoutes.teacherById(id));
    if (!res.ok) throw new Error('Failed to fetch teacher');
    return await res.json();
  },

  async createTeacher(data: TeacherFormData) {
    const formData = new FormData();
    
    const payload: any = {
      first_name: data.first_name,
      last_name: data.last_name,
      email_address: data.email_address,
      phone_number: data.phone_number,
      gender: data.gender,
      cnic_number: data.cnic_number,
      emergency_number: data.emergency_number,
      joining_date: data.joining_date,
      department_id: data.department_id,
      shift: data.shift,
      campus_id: data.campus_id,
      highest_education: data.highest_education,
      extra_details: data.extra_details || '',
      sections: data.sections || [],
      subjects: data.subjects || [],
      role: data.role || 'teacher',
      password: data.password || '123456'
    };

    formData.append('data', JSON.stringify(payload));

    if (data.profile_image instanceof File) {
      formData.append('profile_image', data.profile_image);
    }

    const response = await fetch(ApiRoutes.TEACHER, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create teacher');
    }
    return result;
  },

  async updateTeacher(id: number | string, data: TeacherFormData) {
    const formData = new FormData();
    
    const payload: any = {
      first_name: data.first_name,
      last_name: data.last_name,
      email_address: data.email_address,
      phone_number: data.phone_number,
      gender: data.gender,
      cnic_number: data.cnic_number,
      emergency_number: data.emergency_number,
      joining_date: data.joining_date,
      department_id: data.department_id,
      shift: data.shift,
      campus_id: data.campus_id,
      highest_education: data.highest_education,
      extra_details: data.extra_details || '',
      sections: data.sections || [],
      subjects: data.subjects || [],
    };

    formData.append('data', JSON.stringify(payload));

    if (data.profile_image instanceof File) {
      formData.append('profile_image', data.profile_image);
    }

    const response = await fetch(ApiRoutes.teacherById(id), {
      method: 'PUT',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update teacher');
    }
    return result;
  },

  async deleteTeacher(id: number | string) {
    const response = await fetch(ApiRoutes.teacherById(id), {
      method: 'DELETE',
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete teacher');
    }
    return result;
  },

  async getTeacherCountByCampus(campusId: number | string) {
  const response = await fetch(ApiRoutes.teacherCountByCampus(campusId));

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch teacher count");
  }

  return result;
},
};

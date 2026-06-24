// services/classService.js

import API_BASE_URL from "../config/api";

export const classService = {
  // Get all classes
  async getClasses() {
    const response = await fetch(`${API_BASE_URL}/class`);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error || 'Failed to fetch classes');
    }
    return data;
  },

  // Get single class
  async getClass(id: any) {
    const response = await fetch(`${API_BASE_URL}/class/${id}`);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error || 'Failed to fetch class');
    }
    return data;
  },

  // Create class
  async createClass(classData: { className: any; department: any; batch: any; shift: any; }) {
    const payload = {
      className: classData.className,
      department: classData.department,
      batch: classData.batch,
      shift: classData.shift,
    };

    const response = await fetch(`${API_BASE_URL}/class`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.status !== 201) {
      throw new Error(data.error || 'Failed to create class');
    }
    return data;
  },

  // Update class
  async updateClass(id: number, classData: { className: any; department: any; batch: any; shift: any; }) {
    const payload = {
      className: classData.className,
      department: classData.department,
      batch: classData.batch,
      shift: classData.shift,
    };

    const response = await fetch(`${API_BASE_URL}/class/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error || 'Failed to update class');
    }
    return data;
  },

  // Delete class
  async deleteClass(id: number) {
    const response = await fetch(`${API_BASE_URL}/class/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error || 'Failed to delete class');
    }
    return data;
  },

  // Get classes by department
  async getClassesByDepartment(departmentId: any) {
    const response = await fetch(`${API_BASE_URL}/class/department/${departmentId}`);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error || 'Failed to fetch classes by department');
    }
    return data;
  },

  // Get classes by batch
  async getClassesByBatch(batchId: any) {
    const response = await fetch(`${API_BASE_URL}/class/batch/${batchId}`);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error || 'Failed to fetch classes by batch');
    }
    return data;
  },

  // Get classes by campus (Fetches via relation table)
  async getClassesByCampus(campusId: any) {
    const response = await fetch(`${API_BASE_URL}/class/campus/${campusId}`);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error || 'Failed to fetch classes by campus');
    }
    return data;
  }

};
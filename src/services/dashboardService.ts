// services/dashboardService.ts

import { API_BASE_URL } from '../config/api';
import { getAuthHeaders } from '../config/api';
import type { DashboardFilters, DashboardData } from '../types/dashboard';

export const dashboardService = {
  async fetchDashboardData(
    filters: DashboardFilters, 
    campusId: number
  ): Promise<{ success: boolean; data: DashboardData }> {
    try {
      let url = `${API_BASE_URL}/dashboard?campusId=${campusId}`;
      url += `&date=${filters.date}`;
      url += `&fromDate=${filters.fromDate}`;
      url += `&toDate=${filters.toDate}`;
      
      if (filters.classId) {
        url += `&classId=${filters.classId}`;
      }

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch dashboard data');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};
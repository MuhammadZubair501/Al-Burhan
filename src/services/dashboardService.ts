// services/dashboardService.ts

import { API_BASE_URL } from '../config/api';
import { getAuthHeaders } from '../config/api';
import type { DashboardFilters, DashboardData } from '../types/dashboard';

export const dashboardService = {
  async fetchDashboardData(filters: DashboardFilters, campusId: number): Promise<{ success: boolean; data: DashboardData }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard?campusId=${campusId}&date=${filters.date}`,
        {
          headers: getAuthHeaders(),
        }
      );

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
  },

  async getAvailableDates(campusId: number): Promise<string[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard/dates?campusId=${campusId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch available dates');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching available dates:', error);
      throw error;
    }
  }
};
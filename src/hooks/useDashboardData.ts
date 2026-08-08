// hooks/useDashboardData.ts

import { useState, useEffect } from 'react';
import type { DashboardFilters, DashboardData } from '../types/dashboard';
import { dashboardService } from '../services/dashboardService';

export function useDashboardData(filters: DashboardFilters) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const campusId = Number(window.CampusID) || 1;

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const dates = await dashboardService.getAvailableDates(campusId);
        setAvailableDates(dates);
      } catch (err) {
        console.error('Error fetching available dates:', err);
      }
    };
    fetchAvailableDates();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await dashboardService.fetchDashboardData(filters, campusId);
        setData(result.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (filters.date) {
      fetchData();
    }
  }, [filters, campusId]);

  return { data, loading, error, availableDates };
}
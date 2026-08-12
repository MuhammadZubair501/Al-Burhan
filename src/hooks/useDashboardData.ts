// hooks/useDashboardData.ts

import { useState, useEffect } from 'react';
import type { DashboardFilters, DashboardData } from '../types/dashboard';
import { dashboardService } from '../services/dashboardService';

export function useDashboardData(filters: DashboardFilters) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: number; name: string }>>([]);

  const campusId = Number(window.CampusID) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await dashboardService.fetchDashboardData(
          filters, 
          campusId
        );
        setData(result.data);
        if (result.data.availableClasses) {
          setAvailableClasses(result.data.availableClasses);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (filters.date && filters.fromDate && filters.toDate) {
      fetchData();
    }
  }, [filters, campusId]);

  return { data, loading, error, availableClasses };
}
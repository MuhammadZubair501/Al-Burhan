import { useState, useEffect } from 'react';
import type { DashboardFilters, DashboardData } from '../types/dashboard';
import { dashboardService } from '../services/dashboardService';

export function useDashboardData(filters: DashboardFilters) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await dashboardService.fetchAll(filters);
        setData(result);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  return { data, loading, error };
}
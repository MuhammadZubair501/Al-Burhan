// hooks/useDashboardData.ts

import { useState, useEffect, useRef, useCallback } from 'react';
import type { DashboardFilters, DashboardData } from '../types/dashboard';
import { dashboardService } from '../services/dashboardService';

export function useDashboardData(filters: DashboardFilters) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: number; name: string }>>([]);
  
  const campusId = Number(window.CampusID) || 1;
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const fetchData = useCallback(async (showLoading: boolean = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    
    try {
      const result = await dashboardService.fetchDashboardData(filters, campusId);
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
  }, [filters, campusId]);

  useEffect(() => {
    // Clear any pending timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Validate filters
    if (!filters.date || !filters.fromDate || !filters.toDate) {
      setLoading(false);
      return;
    }

    // On first render, fetch immediately with loading
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData(true);
      return;
    }

    // On subsequent renders, debounce the fetch to prevent flicker
    setLoading(true);
    fetchTimeoutRef.current = setTimeout(() => {
      fetchData(false);
    }, 300);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [filters, fetchData]);

  return { data, loading, error, availableClasses };
}
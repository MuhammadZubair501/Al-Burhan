// components/common/FilterBar.tsx

import type { DashboardFilters } from '../../types/dashboard';

interface FilterBarProps {
  filters: DashboardFilters;
  onFilterChange: (key: keyof DashboardFilters, value: any) => void;
  availableDates?: string[];
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Date Input */}
        <div className="w-full sm:w-auto">
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onFilterChange('date', e.target.value)}
            className="w-full bg-[#1a2a3a] text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
    </div>
  );
}
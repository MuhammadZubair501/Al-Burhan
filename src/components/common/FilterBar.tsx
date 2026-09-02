// components/common/FilterBar.tsx

import type { DashboardFilters } from '../../types/dashboard';

interface FilterBarProps {
  filters: DashboardFilters;
  onFilterChange: (key: keyof DashboardFilters, value: any) => void;
}

export function FilterBar({ 
  filters, 
  onFilterChange
}: FilterBarProps) {
  // Prevent form submission and page reload
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Single Date Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
        <div className="w-full sm:w-56">
          <label className="text-green-100/80 text-xs font-medium block mb-1.5">
            Select Date
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onFilterChange('date', e.target.value)}
            className="w-full bg-white/10 text-white rounded-xl px-4 py-2.5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-sm"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
    </form>
  );
}
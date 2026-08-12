// components/common/FilterBar.tsx

import { X } from 'lucide-react';
import type { DashboardFilters } from '../../types/dashboard';

interface FilterBarProps {
  filters: DashboardFilters;
  onFilterChange: (key: keyof DashboardFilters, value: any) => void;
  availableClasses?: Array<{ id: number; name: string }>;
}

export function FilterBar({ 
  filters, 
  onFilterChange, 
  availableClasses = [] 
}: FilterBarProps) {
  return (
    <div className="space-y-4">
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

        <div className="w-full sm:w-56">
          <label className="text-green-100/80 text-xs font-medium block mb-1.5">
            Class
          </label>
          <select
            value={filters.classId || ''}
            onChange={(e) => {
              const value = e.target.value;
              onFilterChange('classId', value ? parseInt(value) : null);
            }}
            className="w-full bg-white/10 text-white rounded-xl px-4 py-2.5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-sm"
          >
            <option value="" className="bg-emerald-800">All Classes</option>
            {availableClasses.map((cls) => (
              <option key={cls.id} value={cls.id} className="bg-emerald-800">
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {filters.classId && (
          <div className="flex items-end">
            <button
              onClick={() => onFilterChange('classId', null)}
              className="px-4 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition flex items-center gap-2 text-sm font-medium border border-red-500/20"
            >
              <X size={16} />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap pt-4 border-t border-white/10">
        <div className="w-full sm:w-56">
          <label className="text-green-100/80 text-xs font-medium block mb-1.5">
            From Date
          </label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => onFilterChange('fromDate', e.target.value)}
            className="w-full bg-white/10 text-white rounded-xl px-4 py-2.5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-sm"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="w-full sm:w-56">
          <label className="text-green-100/80 text-xs font-medium block mb-1.5">
            To Date
          </label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => onFilterChange('toDate', e.target.value)}
            className="w-full bg-white/10 text-white rounded-xl px-4 py-2.5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-sm"
            max={new Date().toISOString().split('T')[0]}
            min={filters.fromDate}
          />
        </div>
      </div>
    </div>
  );
}
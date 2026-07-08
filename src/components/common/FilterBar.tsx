import SearchDropdown from '../custom/SearchDropdown';
import { CalendarIcon, Users, Layers, BookOpen, RefreshCw } from 'lucide-react';
import type { DashboardFilters } from '../../types/dashboard';

const academicYears = [{ id: 1, name: '2025-2026' }, { id: 2, name: '2024-2025' }];
const campuses = [{ id: 1, name: 'Main Campus' }, { id: 2, name: 'North Campus' }];
const departments = [{ id: 1, name: 'Science' }, { id: 2, name: 'Arts' }];
const classes = [{ id: 1, name: 'Grade 10' }, { id: 2, name: 'Grade 9' }];
const sections = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];

interface FilterBarProps {
  filters: DashboardFilters;
  onFilterChange: (key: keyof DashboardFilters, value: any) => void;
  onReset: () => void;
}

export function FilterBar({ filters, onFilterChange, onReset }: FilterBarProps) {
  const getSelectedName = (list: any[], id: number | null) => {
    if (!id) return '';
    const item = list.find(item => item.id === id);
    return item ? item.name : '';
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl mb-4 sm:mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 sm:gap-4">
        {/* Academic Year */}
        <div className="sm:col-span-1 lg:flex-1 min-w-[160px]">
          <SearchDropdown
            label=""
            placeholder="Academic Year"
            icon={<CalendarIcon size={18} className="text-yellow-300" />}
            options={academicYears.map(y => ({ id: y.id, name: y.name }))}
            value={getSelectedName(academicYears, filters.academicYear)}
            onChange={(name) => {
              const year = academicYears.find(y => y.name === name);
              onFilterChange('academicYear', year ? year.id : null);
            }}
            className="w-full"
            dropdownClassName="bg-emerald-950/95"
            triggerClassName="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-base"
            inputClassName="w-full px-4 py-3 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-yellow-400 text-base"
            optionClassName="px-4 py-3 text-white hover:bg-yellow-400/20 cursor-pointer text-base"
            iconClassName="text-yellow-300 flex-shrink-0 ml-2"
            maxHeight="max-h-52"
            autoFocus={false}
            closeOnSelect={true}
            hideSearch={false}
            dropUp={false}
          />
        </div>

        {/* Campus */}
        <div className="sm:col-span-1 lg:flex-1 min-w-[160px]">
          <SearchDropdown
            label=""
            placeholder="Campus"
            icon={<Users size={18} className="text-yellow-300" />}
            options={campuses.map(c => ({ id: c.id, name: c.name }))}
            value={getSelectedName(campuses, filters.campusId)}
            onChange={(name) => {
              const campus = campuses.find(c => c.name === name);
              onFilterChange('campusId', campus ? campus.id : null);
            }}
            className="w-full"
            dropdownClassName="bg-emerald-950/95"
            triggerClassName="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-base"
            inputClassName="w-full px-4 py-3 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-yellow-400 text-base"
            optionClassName="px-4 py-3 text-white hover:bg-yellow-400/20 cursor-pointer text-base"
            iconClassName="text-yellow-300 flex-shrink-0 ml-2"
            maxHeight="max-h-52"
            autoFocus={false}
            closeOnSelect={true}
            hideSearch={false}
            dropUp={false}
          />
        </div>

        {/* Department */}
        <div className="sm:col-span-1 lg:flex-1 min-w-[160px]">
          <SearchDropdown
            label=""
            placeholder="Department"
            icon={<Layers size={18} className="text-yellow-300" />}
            options={departments.map(d => ({ id: d.id, name: d.name }))}
            value={getSelectedName(departments, filters.departmentId)}
            onChange={(name) => {
              const dept = departments.find(d => d.name === name);
              onFilterChange('departmentId', dept ? dept.id : null);
            }}
            className="w-full"
            dropdownClassName="bg-emerald-950/95"
            triggerClassName="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-base"
            inputClassName="w-full px-4 py-3 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-yellow-400 text-base"
            optionClassName="px-4 py-3 text-white hover:bg-yellow-400/20 cursor-pointer text-base"
            iconClassName="text-yellow-300 flex-shrink-0 ml-2"
            maxHeight="max-h-52"
            autoFocus={false}
            closeOnSelect={true}
            hideSearch={false}
            dropUp={false}
          />
        </div>

        {/* Class */}
        <div className="sm:col-span-1 lg:flex-1 min-w-[160px]">
          <SearchDropdown
            label=""
            placeholder="Class"
            icon={<BookOpen size={18} className="text-yellow-300" />}
            options={classes.map(c => ({ id: c.id, name: c.name }))}
            value={getSelectedName(classes, filters.classId)}
            onChange={(name) => {
              const cls = classes.find(c => c.name === name);
              onFilterChange('classId', cls ? cls.id : null);
            }}
            className="w-full"
            dropdownClassName="bg-emerald-950/95"
            triggerClassName="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-base"
            inputClassName="w-full px-4 py-3 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-yellow-400 text-base"
            optionClassName="px-4 py-3 text-white hover:bg-yellow-400/20 cursor-pointer text-base"
            iconClassName="text-yellow-300 flex-shrink-0 ml-2"
            maxHeight="max-h-52"
            autoFocus={false}
            closeOnSelect={true}
            hideSearch={false}
            dropUp={false}
          />
        </div>

        {/* Section */}
        <div className="sm:col-span-1 lg:flex-1 min-w-[140px]">
          <SearchDropdown
            label=""
            placeholder="Section"
            icon={<Layers size={18} className="text-yellow-300" />}
            options={sections.map(s => ({ id: s.id, name: s.name }))}
            value={getSelectedName(sections, filters.sectionId)}
            onChange={(name) => {
              const sec = sections.find(s => s.name === name);
              onFilterChange('sectionId', sec ? sec.id : null);
            }}
            className="w-full"
            dropdownClassName="bg-emerald-950/95"
            triggerClassName="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-base"
            inputClassName="w-full px-4 py-3 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-yellow-400 text-base"
            optionClassName="px-4 py-3 text-white hover:bg-yellow-400/20 cursor-pointer text-base"
            iconClassName="text-yellow-300 flex-shrink-0 ml-2"
            maxHeight="max-h-52"
            autoFocus={false}
            closeOnSelect={true}
            hideSearch={false}
            dropUp={false}
          />
        </div>

        {/* Date Input */}
        <div className="sm:col-span-1 lg:flex-1 min-w-[160px]">
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onFilterChange('date', e.target.value)}
            className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base"
          />
        </div>

        {/* Reset Button */}
        <div className="sm:col-span-2 lg:flex-none">
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition flex items-center justify-center gap-2 text-base font-medium"
          >
            <RefreshCw size={18} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
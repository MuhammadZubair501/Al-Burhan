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

  // Common styles - keeping original colors
  const triggerClass = "w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm sm:text-base";
  const inputClass = "w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base";
  const optionClass = "px-3 sm:px-4 py-2.5 sm:py-3 text-white hover:bg-yellow-400/20 cursor-pointer text-sm sm:text-base";
  const iconClass = "text-yellow-300 flex-shrink-0 ml-2";

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
        {/* Academic Year */}
        <div className="w-full sm:w-auto sm:flex-1 min-w-[140px]">
          <SearchDropdown
            label=""
            placeholder="Academic Year"
            icon={<CalendarIcon size={16} className="text-yellow-300 sm:w-5 sm:h-5" />}
            options={academicYears.map(y => ({ id: y.id, name: y.name }))}
            value={getSelectedName(academicYears, filters.academicYear)}
            onChange={(name) => {
              const year = academicYears.find(y => y.name === name);
              onFilterChange('academicYear', year ? year.id : null);
            }}
            className="w-full"
            dropdownClassName="bg-emerald-950/95"
            triggerClassName={triggerClass}
            inputClassName={inputClass}
            optionClassName={optionClass}
            iconClassName={iconClass}
            maxHeight="max-h-52"
            autoFocus={false}
            closeOnSelect={true}
            hideSearch={false}
            dropUp={false}
          />
        </div>

        {/* Campus */}
        <div className="w-full sm:w-auto sm:flex-1 min-w-[140px]">
          <SearchDropdown
            label=""
            placeholder="Campus"
            icon={<Users size={16} className="text-yellow-300 sm:w-5 sm:h-5" />}
            options={campuses.map(c => ({ id: c.id, name: c.name }))}
            value={getSelectedName(campuses, filters.campusId)}
            onChange={(name) => {
              const campus = campuses.find(c => c.name === name);
              onFilterChange('campusId', campus ? campus.id : null);
            }}
            className="w-full"
            dropdownClassName="bg-emerald-950/95"
            triggerClassName={triggerClass}
            inputClassName={inputClass}
            optionClassName={optionClass}
            iconClassName={iconClass}
            maxHeight="max-h-52"
            autoFocus={false}
            closeOnSelect={true}
            hideSearch={false}
            dropUp={false}
          />
        </div>

        {/* Department */}
        <div className="w-full sm:w-auto sm:flex-1 min-w-[140px]">
          <SearchDropdown
            label=""
            placeholder="Department"
            icon={<Layers size={16} className="text-yellow-300 sm:w-5 sm:h-5" />}
            options={departments.map(d => ({ id: d.id, name: d.name }))}
            value={getSelectedName(departments, filters.departmentId)}
            onChange={(name) => {
              const dept = departments.find(d => d.name === name);
              onFilterChange('departmentId', dept ? dept.id : null);
            }}
            className="w-full"
            dropdownClassName="bg-emerald-950/95"
            triggerClassName={triggerClass}
            inputClassName={inputClass}
            optionClassName={optionClass}
            iconClassName={iconClass}
            maxHeight="max-h-52"
            autoFocus={false}
            closeOnSelect={true}
            hideSearch={false}
            dropUp={false}
          />
        </div>

        {/* Class */}
        <div className="w-full sm:w-auto sm:flex-1 min-w-[140px]">
          <SearchDropdown
            label=""
            placeholder="Class"
            icon={<BookOpen size={16} className="text-yellow-300 sm:w-5 sm:h-5" />}
            options={classes.map(c => ({ id: c.id, name: c.name }))}
            value={getSelectedName(classes, filters.classId)}
            onChange={(name) => {
              const cls = classes.find(c => c.name === name);
              onFilterChange('classId', cls ? cls.id : null);
            }}
            className="w-full"
            dropdownClassName="bg-emerald-950/95"
            triggerClassName={triggerClass}
            inputClassName={inputClass}
            optionClassName={optionClass}
            iconClassName={iconClass}
            maxHeight="max-h-52"
            autoFocus={false}
            closeOnSelect={true}
            hideSearch={false}
            dropUp={false}
          />
        </div>

        {/* Section */}
        <div className="w-full sm:w-auto sm:flex-1 min-w-[120px]">
          <SearchDropdown
            label=""
            placeholder="Section"
            icon={<Layers size={16} className="text-yellow-300 sm:w-5 sm:h-5" />}
            options={sections.map(s => ({ id: s.id, name: s.name }))}
            value={getSelectedName(sections, filters.sectionId)}
            onChange={(name) => {
              const sec = sections.find(s => s.name === name);
              onFilterChange('sectionId', sec ? sec.id : null);
            }}
            className="w-full"
            dropdownClassName="bg-emerald-950/95"
            triggerClassName={triggerClass}
            inputClassName={inputClass}
            optionClassName={optionClass}
            iconClassName={iconClass}
            maxHeight="max-h-52"
            autoFocus={false}
            closeOnSelect={true}
            hideSearch={false}
            dropUp={false}
          />
        </div>

        {/* Date Input */}
        <div className="w-full sm:w-auto sm:flex-1 min-w-[140px]">
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onFilterChange('date', e.target.value)}
            className="w-full bg-white/10 text-white rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
          />
        </div>

        {/* Reset Button */}
        <div className="w-full sm:w-auto">
          <button
            onClick={onReset}
            className="w-full sm:px-6 py-2 sm:py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
          >
            <RefreshCw size={16} className="sm:w-5 sm:h-5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
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
    <div className="bg-white/5 border border-white/10 rounded-xl p-2 mb-3">
      <div className="grid grid-cols-2 gap-1.5">
        {/* Academic Year */}
        <SearchDropdown
          label=""
          placeholder="Year"
          icon={<CalendarIcon size={12} className="text-yellow-300" />}
          options={academicYears.map(y => ({ id: y.id, name: y.name }))}
          value={getSelectedName(academicYears, filters.academicYear)}
          onChange={(name) => {
            const year = academicYears.find(y => y.name === name);
            onFilterChange('academicYear', year ? year.id : null);
          }}
          className="w-full"
          dropdownClassName="bg-emerald-950/95"
          triggerClassName="w-full px-1.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-between cursor-pointer text-[10px]"
          inputClassName="w-full px-1.5 py-1 rounded-lg bg-white/5 text-white outline-none focus:ring-1 focus:ring-yellow-400 text-[10px]"
          optionClassName="px-2 py-1.5 text-white hover:bg-yellow-400/20 cursor-pointer text-[10px]"
          iconClassName="text-yellow-300 flex-shrink-0 ml-0.5"
          maxHeight="max-h-40"
          autoFocus={false}
          closeOnSelect={true}
          hideSearch={false}
          dropUp={false}
        />

        {/* Campus */}
        <SearchDropdown
          label=""
          placeholder="Campus"
          icon={<Users size={12} className="text-yellow-300" />}
          options={campuses.map(c => ({ id: c.id, name: c.name }))}
          value={getSelectedName(campuses, filters.campusId)}
          onChange={(name) => {
            const campus = campuses.find(c => c.name === name);
            onFilterChange('campusId', campus ? campus.id : null);
          }}
          className="w-full"
          dropdownClassName="bg-emerald-950/95"
          triggerClassName="w-full px-1.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-between cursor-pointer text-[10px]"
          inputClassName="w-full px-1.5 py-1 rounded-lg bg-white/5 text-white outline-none focus:ring-1 focus:ring-yellow-400 text-[10px]"
          optionClassName="px-2 py-1.5 text-white hover:bg-yellow-400/20 cursor-pointer text-[10px]"
          iconClassName="text-yellow-300 flex-shrink-0 ml-0.5"
          maxHeight="max-h-40"
          autoFocus={false}
          closeOnSelect={true}
          hideSearch={false}
          dropUp={false}
        />

        {/* Department */}
        <SearchDropdown
          label=""
          placeholder="Dept"
          icon={<Layers size={12} className="text-yellow-300" />}
          options={departments.map(d => ({ id: d.id, name: d.name }))}
          value={getSelectedName(departments, filters.departmentId)}
          onChange={(name) => {
            const dept = departments.find(d => d.name === name);
            onFilterChange('departmentId', dept ? dept.id : null);
          }}
          className="w-full"
          dropdownClassName="bg-emerald-950/95"
          triggerClassName="w-full px-1.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-between cursor-pointer text-[10px]"
          inputClassName="w-full px-1.5 py-1 rounded-lg bg-white/5 text-white outline-none focus:ring-1 focus:ring-yellow-400 text-[10px]"
          optionClassName="px-2 py-1.5 text-white hover:bg-yellow-400/20 cursor-pointer text-[10px]"
          iconClassName="text-yellow-300 flex-shrink-0 ml-0.5"
          maxHeight="max-h-40"
          autoFocus={false}
          closeOnSelect={true}
          hideSearch={false}
          dropUp={false}
        />

        {/* Class */}
        <SearchDropdown
          label=""
          placeholder="Class"
          icon={<BookOpen size={12} className="text-yellow-300" />}
          options={classes.map(c => ({ id: c.id, name: c.name }))}
          value={getSelectedName(classes, filters.classId)}
          onChange={(name) => {
            const cls = classes.find(c => c.name === name);
            onFilterChange('classId', cls ? cls.id : null);
          }}
          className="w-full"
          dropdownClassName="bg-emerald-950/95"
          triggerClassName="w-full px-1.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-between cursor-pointer text-[10px]"
          inputClassName="w-full px-1.5 py-1 rounded-lg bg-white/5 text-white outline-none focus:ring-1 focus:ring-yellow-400 text-[10px]"
          optionClassName="px-2 py-1.5 text-white hover:bg-yellow-400/20 cursor-pointer text-[10px]"
          iconClassName="text-yellow-300 flex-shrink-0 ml-0.5"
          maxHeight="max-h-40"
          autoFocus={false}
          closeOnSelect={true}
          hideSearch={false}
          dropUp={false}
        />

        {/* Section */}
        <SearchDropdown
          label=""
          placeholder="Sec"
          icon={<Layers size={12} className="text-yellow-300" />}
          options={sections.map(s => ({ id: s.id, name: s.name }))}
          value={getSelectedName(sections, filters.sectionId)}
          onChange={(name) => {
            const sec = sections.find(s => s.name === name);
            onFilterChange('sectionId', sec ? sec.id : null);
          }}
          className="w-full"
          dropdownClassName="bg-emerald-950/95"
          triggerClassName="w-full px-1.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-between cursor-pointer text-[10px]"
          inputClassName="w-full px-1.5 py-1 rounded-lg bg-white/5 text-white outline-none focus:ring-1 focus:ring-yellow-400 text-[10px]"
          optionClassName="px-2 py-1.5 text-white hover:bg-yellow-400/20 cursor-pointer text-[10px]"
          iconClassName="text-yellow-300 flex-shrink-0 ml-0.5"
          maxHeight="max-h-40"
          autoFocus={false}
          closeOnSelect={true}
          hideSearch={false}
          dropUp={false}
        />

        {/* Date Input */}
        <input
          type="date"
          value={filters.date}
          onChange={(e) => onFilterChange('date', e.target.value)}
          className="col-span-1 bg-white/5 text-white rounded-lg px-1.5 py-1 border border-white/10 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-[10px]"
        />

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="col-span-2 bg-red-500/20 text-red-400 rounded-lg px-1.5 py-1 text-[10px] flex items-center justify-center gap-0.5 hover:bg-red-500/30 transition"
        >
          <RefreshCw size={12} /> ↻
        </button>
      </div>
    </div>
  );
}
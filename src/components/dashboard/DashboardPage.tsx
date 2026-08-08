// DashboardPage.tsx

import { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { FilterBar } from '../common/FilterBar';
import PageHeader from '../PageHeader';
import { StudentSummary } from '../dashboard/StudentSummary';
import { TeacherSummary } from '../dashboard/TeacherSummary';
import { StudentAttendanceTable } from '../dashboard/StudentAttendanceTable';
import { ChartsSection } from '../dashboard/ChartsSection';
import { SkeletonLoader } from '../common/SkeletonLoader';
import type { DashboardFilters } from '../../types/dashboard';

export default function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFilters>({
    date: new Date().toISOString().split('T')[0],
  });

  const { data, loading, error, availableDates } = useDashboardData(filters);

  const handleFilterChange = (key: keyof DashboardFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (error) {
    return (
      <div className="p-4 sm:p-8 text-red-400">
        <div className="bg-red-500/20 p-6 rounded-2xl border border-red-500/50">
          <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <PageHeader
          title="Dashboard"
          description="Student & Teacher Attendance Overview"
          Icon={LayoutDashboard}
        />

        <FilterBar 
          filters={filters} 
          onFilterChange={handleFilterChange}
          availableDates={availableDates}
        />

        {loading ? (
          <>
            <SkeletonLoader count={5} />
            <div className="my-6">
              <SkeletonLoader count={5} />
            </div>
            <div className="my-6">
              <SkeletonLoader count={2} />
            </div>
          </>
        ) : (
          data && (
            <>
              {/* Student Summary */}
              <h2 className="text-lg font-semibold text-white mb-3">Students</h2>
              <StudentSummary data={data.studentSummary} />
              
              {/* Teacher Summary */}
              <h2 className="text-lg font-semibold text-white mb-3 mt-6">Teachers</h2>
              <TeacherSummary data={data.teacherSummary} />

              {/* Tables */}
              <div className="grid grid-cols-1 xl:grid-cols-1 gap-4 sm:gap-6 mb-6 mt-6">
                <StudentAttendanceTable data={data.studentAttendanceTable} />
                {/* <TeacherAttendanceTable data={data.teacherAttendanceTable} /> */}
              </div>

              {/* Charts */}
              <ChartsSection 
                studentData={data.studentCharts} 
                teacherData={data.teacherCharts} 
              />
            </>
          )
        )}
      </div>
    </div>
  );
}
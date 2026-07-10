import { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { FilterBar } from '../common/FilterBar';
import PageHeader from '../PageHeader';
import { StudentSummary } from '../dashboard/StudentSummary';
import { TeacherSummary } from '../dashboard/TeacherSummary';
import { StudentAttendanceTable } from '../dashboard/StudentAttendanceTable';
import { TeacherAttendanceTable } from '../dashboard/TeacherAttendanceTable';
import { ChartsSection } from '../dashboard/ChartsSection';
import { SkeletonLoader } from '../common/SkeletonLoader';
import type { DashboardFilters } from '../../types/dashboard';

export default function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFilters>({
    academicYear: 1,
    campusId: null,
    departmentId: null,
    classId: null,
    sectionId: null,
    date: new Date().toISOString().split('T')[0],
  });

  const { data, loading, error } = useDashboardData(filters);

  const handleFilterChange = (key: keyof DashboardFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      academicYear: 1,
      campusId: null,
      departmentId: null,
      classId: null,
      sectionId: null,
      date: new Date().toISOString().split('T')[0],
    });
  };

  if (error) {
    return <div className="p-4 sm:p-8 text-red-400">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <PageHeader
          title="Dashboard"
          description="School Management Overview"
          Icon={LayoutDashboard}
        />

        <FilterBar filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />

        {loading ? (
          <>
            <SkeletonLoader count={6} />
            <div className="my-6">
              <SkeletonLoader count={3} />
            </div>
          </>
        ) : (
          <>
            <StudentSummary data={data!.studentSummary} />
            <TeacherSummary data={data!.teacherSummary} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <StudentAttendanceTable data={data!.studentAttendanceTable} />
              <TeacherAttendanceTable data={data!.teacherAttendanceTable} />
            </div>

            <ChartsSection studentData={data!.studentCharts} teacherData={data!.teacherCharts} />

          </>
        )}
      </div>
    </div>
  );
}
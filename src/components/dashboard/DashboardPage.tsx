// DashboardPage.tsx

import { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { FilterBar } from '../common/FilterBar';
import PageHeader from '../PageHeader';
import { StudentSummary } from '../dashboard/StudentSummary';
import { StudentAttendanceTable } from '../dashboard/StudentAttendanceTable';
import { DateRangeAttendanceTable } from '../dashboard/DateRangeAttendanceTable';
import { ChartsSection } from '../dashboard/ChartsSection';
import { SkeletonLoader } from '../common/SkeletonLoader';
import type { DashboardFilters } from '../../types/dashboard';

export default function DashboardPage() {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const [filters, setFilters] = useState<DashboardFilters>({
    date: today.toISOString().split('T')[0],
    fromDate: sevenDaysAgo.toISOString().split('T')[0],
    toDate: today.toISOString().split('T')[0],
    classId: null,
  });

  const { data, loading, error, availableClasses } = useDashboardData(filters);

  const handleFilterChange = (key: keyof DashboardFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-red-200 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 border-4 border-yellow-400 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 border-4 border-yellow-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 border-2 border-white rounded-full"></div>
        </div>

        <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {/* Page Header */}
          <PageHeader
            title="Dashboard"
            description="Student Attendance Overview"
            Icon={LayoutDashboard}
          />

          {/* Filter Bar - Glass Container */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
            <FilterBar 
              filters={filters} 
              onFilterChange={handleFilterChange}
              availableClasses={availableClasses}
            />
          </div>

          {loading ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <SkeletonLoader key={i} count={1} />
                ))}
              </div>
              <div className="my-6">
                <SkeletonLoader count={3} />
              </div>
              <div className="my-6">
                <SkeletonLoader count={2} />
              </div>
            </>
          ) : (
            data && (
              <>
                {/* Student Summary - Glass Container */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">
                      Students - {new Date(filters.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h2>
                  </div>
                  <StudentSummary data={data.studentSummary} />
                </div>

                {/* Student Table - Glass Container */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
                  <h3 className="text-md sm:text-lg font-semibold text-green-300 mb-4">
                    Students by Class
                  </h3>
                  <StudentAttendanceTable data={data.studentAttendanceTable} />
                </div>

                {/* Charts - Glass Container */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
                  <ChartsSection studentData={data.studentCharts} />
                </div>

                {/* Date Range Attendance Table - Glass Container */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
                    Daily Attendance ({filters.fromDate} to {filters.toDate})
                  </h2>
                  <DateRangeAttendanceTable data={data.dateRangeAttendance} />
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
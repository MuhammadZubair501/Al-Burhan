// components/dashboard/DateRangeAttendanceTable.tsx

import type { DashboardData } from '../../types/dashboard';
import { Calendar } from 'lucide-react';

interface DateRangeAttendanceTableProps {
  data: DashboardData['dateRangeAttendance'];
}

export function DateRangeAttendanceTable({ data }: DateRangeAttendanceTableProps) {
  if (!data || data.data.length === 0) {
    return (
      <div className="w-full backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
        <div className="flex flex-col items-center gap-3">
          <Calendar className="w-12 h-12 text-green-100/30" />
          <p className="text-green-100/50 text-sm">No attendance data available for the selected period</p>
        </div>
      </div>
    );
  }

  // Format date for display (e.g., "2nd May 2026")
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';
    
    return `${day}${suffix} ${month} ${year}`;
  };

  // Calculate totals for each date
  const getDateTotals = () => {
    const totals: { [key: string]: number } = {};
    data.dates.forEach(date => {
      totals[date] = data.data.reduce((sum, row) => sum + (row[date] as number || 0), 0);
    });
    return totals;
  };

  const dateTotals = getDateTotals();

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-green-300 whitespace-nowrap">
                  Class
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-green-300 whitespace-nowrap">
                  Section
                </th>
                <th className="px-4 py-3 text-center text-xs sm:text-sm font-semibold text-yellow-300 whitespace-nowrap">
                  Total
                </th>
                {data.dates.map((date, index) => (
                  <th 
                    key={date} 
                    className="px-3 py-3 text-center text-xs sm:text-sm font-semibold text-blue-300 whitespace-nowrap min-w-[100px] sm:min-w-[120px]"
                  >
                    {data.dateHeaders[index] || formatDateDisplay(date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((row, rowIndex) => (
                <tr 
                  key={`${row.className}-${row.sectionName}`}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                    rowIndex % 2 === 0 ? 'bg-white/5' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-xs sm:text-sm text-white/90 whitespace-nowrap font-medium">
                    {row.className}
                  </td>
                  <td className="px-4 py-3 text-xs sm:text-sm text-white/80 whitespace-nowrap">
                    {row.sectionName}
                  </td>
                  <td className="px-4 py-3 text-center text-xs sm:text-sm text-yellow-300 font-semibold whitespace-nowrap">
                    {row.total}
                  </td>
                  {data.dates.map((date) => (
                    <td 
                      key={date} 
                      className="px-3 py-3 text-center text-xs sm:text-sm text-green-400 font-medium whitespace-nowrap"
                    >
                      {row[date] as number || 0}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Footer Row - Totals */}
              <tr className="bg-gradient-to-r from-yellow-400/10 to-amber-500/10 border-t-2 border-yellow-400/30">
                <td className="px-4 py-3 text-xs sm:text-sm font-bold text-yellow-300 whitespace-nowrap" colSpan={2}>
                  Total Present
                </td>
                <td className="px-4 py-3 text-center text-xs sm:text-sm font-bold text-yellow-300 whitespace-nowrap">
                  {data.data.reduce((sum, row) => sum + (row.total as number || 0), 0)}
                </td>
                {data.dates.map((date) => (
                  <td 
                    key={date} 
                    className="px-3 py-3 text-center text-xs sm:text-sm font-bold text-green-300 whitespace-nowrap"
                  >
                    {dateTotals[date] || 0}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile-friendly summary cards */}
        <div className="sm:hidden p-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-green-100/50 text-[10px] uppercase tracking-wider">Total Classes</p>
              <p className="text-white font-bold text-lg">{data.data.length}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-green-100/50 text-[10px] uppercase tracking-wider">Total Students</p>
              <p className="text-yellow-300 font-bold text-lg">
                {data.data.reduce((sum, row) => sum + (row.total as number || 0), 0)}
              </p>
            </div>
            {data.dates.slice(0, 3).map((date) => (
              <div key={date} className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-green-100/50 text-[10px] uppercase tracking-wider truncate">
                  {formatDateDisplay(date).split(' ').slice(0, 2).join(' ')}
                </p>
                <p className="text-green-400 font-bold text-lg">{dateTotals[date] || 0}</p>
              </div>
            ))}
            {data.dates.length > 3 && (
              <div className="bg-white/5 rounded-xl p-3 text-center flex items-center justify-center">
                <p className="text-green-100/50 text-xs">+{data.dates.length - 3} more</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
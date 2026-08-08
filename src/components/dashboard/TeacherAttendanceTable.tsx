// components/dashboard/TeacherAttendanceTable.tsx

import { DataTable, type Column } from '../common/DataTable';
import type { DashboardData } from '../../types/dashboard';

export function TeacherAttendanceTable({ data }: { data: DashboardData['teacherAttendanceTable'] }) {
  const columns: Column[] = [
    { key: 'department', label: 'Department' },
    { key: 'teacherCount', label: 'Total Teachers' },
    { key: 'present', label: 'Present' },
    { key: 'absent', label: 'Absent' },
    { key: 'leave', label: 'Leave' },
    {
      key: 'percentage',
      label: 'Attendance %',
      render: (val) => (
        <span className={val >= 90 ? 'text-green-400' : val >= 75 ? 'text-yellow-400' : 'text-red-400'}>
          {val}%
        </span>
      ),
    },
  ];

  const footerRenderer = (data: any[]) => {
    const totals = data.reduce(
      (acc, row) => ({
        teacherCount: acc.teacherCount + row.teacherCount,
        present: acc.present + row.present,
        absent: acc.absent + row.absent,
        leave: acc.leave + row.leave,
      }),
      { teacherCount: 0, present: 0, absent: 0, leave: 0 }
    );
    const overall = data.length && totals.teacherCount > 0 ? ((totals.present / totals.teacherCount) * 100).toFixed(1) : 0;
    return (
      <>
        <td className="p-4 font-bold text-yellow-300" colSpan={2}>Totals</td>
        <td className="p-4 font-bold">{totals.teacherCount}</td>
        <td className="p-4 font-bold text-green-400">{totals.present}</td>
        <td className="p-4 font-bold text-red-400">{totals.absent}</td>
        <td className="p-4 font-bold text-yellow-400">{totals.leave}</td>
        <td className="p-4 font-bold">{overall}%</td>
      </>
    );
  };

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={data}
        keyField="department"
        searchPlaceholder="Search by department..."
        showFooter
        footerRenderer={footerRenderer}
      />
    </div>
  );
}
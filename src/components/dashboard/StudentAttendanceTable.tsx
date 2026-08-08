// components/dashboard/StudentAttendanceTable.tsx

import { DataTable, type Column } from '../common/DataTable';
import type { DashboardData } from '../../types/dashboard';

export function StudentAttendanceTable({ data }: { data: DashboardData['studentAttendanceTable'] }) {
  const columns: Column[] = [
    { key: 'className', label: 'Class' },
    { key: 'sectionName', label: 'Section' },
    { key: 'total', label: 'Total' },
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
        total: acc.total + row.total,
        present: acc.present + row.present,
        absent: acc.absent + row.absent,
        leave: acc.leave + row.leave,
      }),
      { total: 0, present: 0, absent: 0, leave: 0 }
    );
    const overall = data.length && totals.total > 0 ? ((totals.present / totals.total) * 100).toFixed(1) : 0;
    return (
      <>
        <td className="p-4 font-bold text-yellow-300" colSpan={2}>Totals</td>
        <td className="p-4 font-bold">{totals.total}</td>
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
        keyField="className"
        searchPlaceholder="Search by class or section..."
        showFooter
        footerRenderer={footerRenderer}
      />
    </div>
  );
}
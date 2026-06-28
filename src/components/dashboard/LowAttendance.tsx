import type { DashboardData } from '../../types/dashboard';

interface LowAttendanceProps {
  classes: DashboardData['lowClasses'];
  departments: DashboardData['lowDepartments'];
}

export function LowAttendance({ classes, departments }: LowAttendanceProps) {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">⚠️ Low Attendance</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <h4 className="text-red-300 text-sm font-medium mb-2">Lowest Classes</h4>
          {classes.map((cls, idx) => (
            <div key={idx} className="flex justify-between text-sm text-white/80 border-b border-white/10 py-1">
              <span>{cls.className} ({cls.section})</span>
              <span className="text-red-400 font-semibold">{cls.percentage}%</span>
            </div>
          ))}
        </div>
        <div>
          <h4 className="text-red-300 text-sm font-medium mb-2">Lowest Departments</h4>
          {departments.map((dept, idx) => (
            <div key={idx} className="flex justify-between text-sm text-white/80 border-b border-white/10 py-1">
              <span>{dept.department}</span>
              <span className="text-red-400 font-semibold">{dept.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
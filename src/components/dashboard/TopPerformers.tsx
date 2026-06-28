import type { DashboardData } from '../../types/dashboard';

interface TopPerformersProps {
  classes: DashboardData['topClasses'];
  departments: DashboardData['topDepartments'];
}

export function TopPerformers({ classes, departments }: TopPerformersProps) {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">🏆 Top Performers</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <h4 className="text-yellow-300 text-sm font-medium mb-2">Top Classes</h4>
          <div className="space-y-1">
            {classes.map((cls, idx) => (
              <div key={idx} className="flex justify-between text-sm text-white/80">
                <span>#{cls.rank} {cls.className} ({cls.section})</span>
                <span className="text-yellow-300 font-semibold">{cls.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-yellow-300 text-sm font-medium mb-2">Top Departments</h4>
          <div className="space-y-1">
            {departments.map((dept, idx) => (
              <div key={idx} className="flex justify-between text-sm text-white/80">
                <span>{dept.department}</span>
                <span className="text-yellow-300 font-semibold">{dept.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
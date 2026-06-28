import { UserX } from 'lucide-react';
import type { DashboardData } from '../../types/dashboard';

export function AbsentList({ students, teachers }: { students: DashboardData['absentStudents']; teachers: DashboardData['absentTeachers'] }) {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <UserX size={20} className="text-red-400" /> Absent Today
      </h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-yellow-300 text-sm font-medium mb-1">Students</h4>
          {students.length === 0 ? (
            <p className="text-green-200/60 text-sm">All students present</p>
          ) : (
            students.map((s, idx) => (
              <div key={idx} className="flex justify-between text-sm text-white/80 border-b border-white/10 py-1">
                <span>{s.name} ({s.class} {s.section})</span>
                <span className="text-red-300 text-xs">{s.reason}</span>
              </div>
            ))
          )}
        </div>
        <div>
          <h4 className="text-yellow-300 text-sm font-medium mb-1">Teachers</h4>
          {teachers.length === 0 ? (
            <p className="text-green-200/60 text-sm">All teachers present</p>
          ) : (
            teachers.map((t, idx) => (
              <div key={idx} className="flex justify-between text-sm text-white/80 border-b border-white/10 py-1">
                <span>{t.name} ({t.department})</span>
                <span className="text-red-300 text-xs">{t.reason}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
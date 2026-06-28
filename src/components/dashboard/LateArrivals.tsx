import { Clock } from 'lucide-react';
import type { DashboardData } from '../../types/dashboard';

export function LateArrivals({ students, teachers }: { students: DashboardData['lateStudents']; teachers: DashboardData['lateTeachers'] }) {
  const total = students.length + teachers.length;
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Clock size={20} className="text-yellow-400" /> Late Arrivals <span className="text-sm text-yellow-300">({total})</span>
      </h3>
      <div className="space-y-2">
        <div>
          <h4 className="text-yellow-300 text-sm font-medium mb-1">Students</h4>
          {students.length === 0 ? (
            <p className="text-green-200/60 text-sm">No late students</p>
          ) : (
            students.map((s, idx) => (
              <div key={idx} className="text-sm text-white/80 border-b border-white/10 py-1">
                {s.name} ({s.class} {s.section})
              </div>
            ))
          )}
        </div>
        <div>
          <h4 className="text-yellow-300 text-sm font-medium mb-1">Teachers</h4>
          {teachers.length === 0 ? (
            <p className="text-green-200/60 text-sm">No late teachers</p>
          ) : (
            teachers.map((t, idx) => (
              <div key={idx} className="text-sm text-white/80 border-b border-white/10 py-1">
                {t.name} ({t.department})
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
// components/dashboard/TeacherSummary.tsx

import { Users, UserCheck, UserX, UserMinus, TrendingUp } from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import type { DashboardData } from '../../types/dashboard';

export function TeacherSummary({ data }: { data: DashboardData['teacherSummary'] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <StatsCard label="Total Teachers" value={data.total} icon={<Users size={20} />} color="text-blue-400" />
      <StatsCard label="Present" value={data.present} icon={<UserCheck size={20} />} color="text-green-400" />
      <StatsCard label="Absent" value={data.absent} icon={<UserX size={20} />} color="text-red-400" />
      <StatsCard label="Leave" value={data.leave} icon={<UserMinus size={20} />} color="text-yellow-400" />
      <StatsCard label="Attendance %" value={`${data.percentage}%`} icon={<TrendingUp size={20} />} color="text-blue-400" />
    </div>
  );
}
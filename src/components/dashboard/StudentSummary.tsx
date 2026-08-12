// components/dashboard/StudentSummary.tsx

import { Users, UserCheck, UserX, UserMinus, TrendingUp } from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import type { DashboardData } from '../../types/dashboard';

export function StudentSummary({ data }: { data: DashboardData['studentSummary'] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      <StatsCard 
        label="Total Students" 
        value={data.total} 
        icon={<Users size={18} className="sm:w-5 sm:h-5" />} 
        bgColor="bg-blue-500/10"
        borderColor="border-blue-500/20"
        iconBg="bg-blue-500/20"
        textColor="text-blue-400"
      />
      <StatsCard 
        label="Present" 
        value={data.present} 
        icon={<UserCheck size={18} className="sm:w-5 sm:h-5" />} 
        bgColor="bg-green-500/10"
        borderColor="border-green-500/20"
        iconBg="bg-green-500/20"
        textColor="text-green-400"
      />
      <StatsCard 
        label="Absent" 
        value={data.absent} 
        icon={<UserX size={18} className="sm:w-5 sm:h-5" />} 
        bgColor="bg-red-500/10"
        borderColor="border-red-500/20"
        iconBg="bg-red-500/20"
        textColor="text-red-400"
      />
      <StatsCard 
        label="Leave" 
        value={data.leave} 
        icon={<UserMinus size={18} className="sm:w-5 sm:h-5" />} 
        bgColor="bg-yellow-500/10"
        borderColor="border-yellow-500/20"
        iconBg="bg-yellow-500/20"
        textColor="text-yellow-400"
      />
      <StatsCard 
        label="Attendance %" 
        value={`${data.percentage}%`} 
        icon={<TrendingUp size={18} className="sm:w-5 sm:h-5" />} 
        bgColor="bg-purple-500/10"
        borderColor="border-purple-500/20"
        iconBg="bg-purple-500/20"
        textColor="text-purple-400"
      />
    </div>
  );
}
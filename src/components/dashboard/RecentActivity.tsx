import { Clock } from 'lucide-react';
import type { DashboardData } from '../../types/dashboard';

export function RecentActivity({ activities }: { activities: DashboardData['recentActivities'] }) {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">🔄 Recent Activity</h3>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="border-b border-white/10 pb-2 last:border-0">
            <p className="text-white text-sm">{activity.action}</p>
            <div className="flex items-center gap-2 text-green-200/60 text-xs mt-1">
              <Clock size={12} />
              <span>{activity.timestamp}</span>
              {activity.user && <span>• {activity.user}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
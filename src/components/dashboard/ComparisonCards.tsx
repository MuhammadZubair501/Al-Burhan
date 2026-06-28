import { TrendingUp, TrendingDown } from 'lucide-react';
import type { DashboardData } from '../../types/dashboard';

export function ComparisonCards({ data }: { data: DashboardData['comparison'] }) {
  const items = [
    { label: 'Today', value: data.today, change: data.changes.today },
    { label: 'Yesterday', value: data.yesterday, change: data.changes.yesterday },
    { label: 'Last 7 Days', value: data.last7Days, change: data.changes.last7Days },
    { label: 'Last 30 Days', value: data.last30Days, change: data.changes.last30Days },
    { label: 'Monthly', value: data.monthly, change: data.changes.monthly },
    { label: 'Yearly', value: data.yearly, change: data.changes.yearly },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {items.map((item, index) => (
        <div key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
          <p className="text-green-100 text-sm">{item.label}</p>
          <p className="text-2xl font-bold text-white">{item.value}%</p>
          <div className="flex items-center gap-1 mt-1">
            {item.change >= 0 ? (
              <TrendingUp size={16} className="text-green-400" />
            ) : (
              <TrendingDown size={16} className="text-red-400" />
            )}
            <span className={item.change >= 0 ? 'text-green-400' : 'text-red-400'}>
              {item.change >= 0 ? '+' : ''}{item.change}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
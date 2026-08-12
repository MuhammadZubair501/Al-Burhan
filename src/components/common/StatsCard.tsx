// components/common/StatsCard.tsx

// components/common/StatsCard.tsx
import type { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  bgColor?: string;
  borderColor?: string;
  iconBg?: string;
  textColor?: string;
}

export function StatsCard({ 
  label, 
  value, 
  icon, 
  bgColor = 'bg-white/5',
  borderColor = 'border-white/10',
  iconBg = 'bg-white/10',
  textColor = 'text-white'
}: StatsCardProps) {
  return (
    <div className={`${bgColor} backdrop-blur-sm ${borderColor} border rounded-xl p-3 sm:p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-100/60 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
            {label}
          </p>
          <p className={`${textColor} text-lg sm:text-xl md:text-2xl font-bold mt-0.5 sm:mt-1`}>
            {value}
          </p>
        </div>
        <div className={`${iconBg} p-2 sm:p-2.5 rounded-xl`}>
          <div className="text-green-100">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
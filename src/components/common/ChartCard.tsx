// components/common/ChartCard.tsx

// components/common/ChartCard.tsx
import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-[#1a2a3a] rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-700/50">
      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3 md:mb-4">
        {title}
      </h3>
      <div className="w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
interface StatsCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
}

export function StatsCard({ label, value, icon, color = 'text-white' }: StatsCardProps) {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-yellow-400/20 rounded-xl">{icon}</div>
        <div>
          <p className="text-green-100 text-sm">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
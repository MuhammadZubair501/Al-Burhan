import { Lightbulb } from 'lucide-react';

export function Insights({ insights }: { insights: string[] }) {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl mb-6">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Lightbulb size={20} className="text-yellow-400" /> Insights
      </h3>
      <ul className="list-disc list-inside text-green-100 space-y-1">
        {insights.map((insight, idx) => (
          <li key={idx}>{insight}</li>
        ))}
      </ul>
    </div>
  );
}
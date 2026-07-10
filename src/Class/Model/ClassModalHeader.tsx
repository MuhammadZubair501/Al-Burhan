import type { LucideIcon } from "lucide-react";

interface ClassModalHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

export default function ClassModalHeader({ title, subtitle, icon: Icon }: ClassModalHeaderProps) {
  return (
    <div className="flex-shrink-0 sticky top-0 z-10 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900/95 backdrop-blur-xl px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 text-center border-b border-white/10">
      <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-xl">
        <Icon size={28} className="text-green-950 sm:w-8 sm:h-8 md:w-10 md:h-10" />
      </div>
      <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl font-bold text-white">{title}</h2>
      <p className="text-green-100 mt-1 text-sm sm:text-base">{subtitle}</p>
    </div>
  );
}
import type { LucideIcon } from "lucide-react";

interface ClassModalHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

export default function ClassModalHeader({ title, subtitle, icon: Icon }: ClassModalHeaderProps) {
  return (
    <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 text-center flex-shrink-0">
      <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-xl">
        <Icon size={32} className="text-green-950 sm:w-10 sm:h-10" />
      </div>
      <h2 className="mt-4 sm:mt-5 text-2xl sm:text-3xl font-bold text-white">{title}</h2>
      <p className="text-green-100 mt-1 sm:mt-2 text-sm sm:text-base">{subtitle}</p>
    </div>
  );
}
import { type LucideIcon } from 'lucide-react';
import ProfileButton from './ProfileButton';

interface PageHeaderProps {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export default function PageHeader({ title, description, Icon }: PageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Icon - Hidden on mobile */}
        <div className="hidden sm:flex w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/20 flex-shrink-0">
          <Icon size={18} className="text-green-950" strokeWidth={2.5} />
        </div>
        
        <div className="min-w-0">
          <h1 className="hidden sm:block text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white truncate">
            {title}
          </h1>
          {/* Description - Hidden on mobile */}
          <p className="hidden sm:block text-green-100/80 text-xs sm:text-sm md:text-base mt-0.5 truncate">
            {description}
          </p>
        </div>
      </div>
      
      {/* Profile button - Hidden on mobile (already in top bar) */}
      <div className="hidden sm:flex flex-shrink-0 self-start lg:self-center">
        <ProfileButton />
      </div>
    </div>
  );
}
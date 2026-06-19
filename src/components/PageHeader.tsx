import {  type LucideIcon } from 'lucide-react';
import ProfileButton from './ProfileButton'; // Adjust path based on your setup

// 1. Define the props for flexibility
interface PageHeaderProps {
  title: string;
  description: string;
  Icon: LucideIcon; // Type for Lucide icons
}

// 2. Create the dynamic component
export default function PageHeader({ title, description, Icon }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
     <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div
              className="
                w-16 h-16
                rounded-3xl
                bg-gradient-to-r
                from-yellow-400
                to-amber-500
                flex
                items-center
                justify-center
                shadow-xl
              "
            >
              <Icon
                size={32}
                className="text-green-950"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-white">
                {title}
              </h1>

              <p className="text-green-100 mt-1">
                {description}
              </p>
            </div>
          </div>
        </div>

      <ProfileButton />
    </div>
  );
}

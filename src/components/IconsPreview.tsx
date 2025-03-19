
import React from 'react';
import { allIcons } from '../utils/iconsList';
import * as LucideIcons from 'lucide-react';

const IconsPreview: React.FC = () => {
  // Create a mapping of icon names to Lucide components
  const iconComponents: Record<string, React.ComponentType<any>> = {
    'map-pin': LucideIcons.MapPin,
    'chevron-down': LucideIcons.ChevronDown,
    'bell': LucideIcons.Bell,
    'search': LucideIcons.Search,
    'users': LucideIcons.Users,
    'sparkles': LucideIcons.Sparkles,
    'graduation-cap': LucideIcons.GraduationCap,
    'briefcase': LucideIcons.Briefcase,
    'home': LucideIcons.Home,
    'camera': LucideIcons.Camera,
    'arrow-up-right': LucideIcons.ArrowUpRight,
    'message-circle': LucideIcons.MessageCircle,
    'award': LucideIcons.Award,
    'compass': LucideIcons.Compass,
    'plus': LucideIcons.Plus,
    'message-square': LucideIcons.MessageSquare,
    'user': LucideIcons.User,
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Icons for WeChat Mini Program</h1>
      <p className="mb-4 text-gray-600">
        These icons need to be saved as PNG files in the /assets/icons/ directory for the WeChat mini-program.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allIcons.map((icon) => {
          const IconComponent = iconComponents[icon.name];
          return (
            <div key={icon.name} className="border rounded-lg p-4 flex flex-col items-center">
              <div className="p-4 bg-gray-100 rounded-full mb-2">
                {IconComponent && <IconComponent size={24} className="text-gray-700" />}
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">{icon.name}</p>
                <p className="text-xs text-gray-500 mt-1">{icon.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-bold text-lg mb-2">For WeChat Mini Program:</h2>
        <p className="text-sm">Save these icons as PNG files with the following naming structure:</p>
        <ul className="mt-2 text-sm list-disc pl-5">
          <li>Normal state: <code>/assets/icons/[icon-name].png</code></li>
          <li>Active state (for tab bar): <code>/assets/icons/[icon-name]-active.png</code></li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">Example: /assets/icons/home.png, /assets/icons/home-active.png</p>
      </div>
    </div>
  );
};

export default IconsPreview;

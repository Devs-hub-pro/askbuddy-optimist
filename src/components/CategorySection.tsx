
import React from 'react';
import { GraduationCap, Briefcase, Home, Camera, Plane, Heart, TrendingUp, Smartphone, HelpCircle, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';

// Map icon names from DB to actual Lucide components
const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Briefcase,
  Home,
  Camera,
  Plane,
  Heart,
  TrendingUp,
  Smartphone,
  HelpCircle,
};

// Map category names to routes
const routeMap: Record<string, string> = {
  '教育学习': '/education',
  '职业发展': '/career',
  '生活服务': '/lifestyle',
  '兴趣技能': '/hobbies',
};

// Gradient styles for each position
const gradients = [
  'from-blue-400 to-indigo-500',
  'from-green-400 to-teal-500',
  'from-orange-400 to-amber-500',
  'from-pink-400 to-rose-500',
  'from-cyan-400 to-sky-500',
  'from-red-400 to-pink-500',
  'from-yellow-400 to-orange-500',
  'from-indigo-400 to-purple-500',
  'from-gray-400 to-slate-500',
];

// Fallback hardcoded categories
const fallbackCategories = [
  { id: 'education', name: '教育学习', icon: 'GraduationCap', gradient: 'from-blue-400 to-indigo-500', path: '/education' },
  { id: 'career', name: '职业发展', icon: 'Briefcase', gradient: 'from-green-400 to-teal-500', path: '/career' },
  { id: 'lifestyle', name: '生活服务', icon: 'Home', gradient: 'from-orange-400 to-amber-500', path: '/lifestyle' },
  { id: 'hobbies', name: '兴趣技能', icon: 'Camera', gradient: 'from-pink-400 to-rose-500', path: '/hobbies' },
];

const CategorySection: React.FC = () => {
  const navigate = useNavigate();
  const { data: dbCategories, isLoading } = useCategories();

  // Use first 4 categories for home page grid
  const categories = dbCategories && dbCategories.length > 0
    ? dbCategories.slice(0, 4).map((cat, index) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon || 'HelpCircle',
        gradient: gradients[index] || gradients[0],
        path: routeMap[cat.name] || `/search?category=${encodeURIComponent(cat.name)}`,
      }))
    : fallbackCategories;

  const handleCategoryClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="py-6 px-4 animate-fade-in animate-delay-1">
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category, index) => {
          const IconComponent = iconMap[category.icon] || HelpCircle;
          return (
            <div 
              key={category.id}
              className="flex flex-col items-center animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
              onClick={() => handleCategoryClick(category.path)}
            >
              <div className={`category-icon mb-2 bg-gradient-to-br ${category.gradient} shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 rounded-xl`}>
                <IconComponent size={20} />
              </div>
              <span className="text-xs text-center font-medium">{category.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySection;

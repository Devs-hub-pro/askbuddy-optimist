
import React from 'react';
import { GraduationCap, Briefcase, Home, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  path: string;
}

const categories: Category[] = [
  {
    id: 'education',
    name: '教育学习',
    icon: <GraduationCap size={20} />,
    color: 'bg-app-blue',
    gradient: 'from-blue-400 to-indigo-500',
    path: '/education'
  },
  {
    id: 'career',
    name: '职业发展',
    icon: <Briefcase size={20} />,
    color: 'bg-app-green',
    gradient: 'from-green-400 to-teal-500',
    path: '/career'
  },
  {
    id: 'lifestyle',
    name: '生活服务',
    icon: <Home size={20} />,
    color: 'bg-app-orange',
    gradient: 'from-orange-400 to-amber-500',
    path: '/lifestyle'
  },
  {
    id: 'hobbies',
    name: '兴趣技能',
    icon: <Camera size={20} />,
    color: 'bg-app-red',
    gradient: 'from-pink-400 to-rose-500',
    path: '/hobbies'
  }
];

const CategorySection: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="py-6 px-4 animate-fade-in animate-delay-1">
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category, index) => (
          <div 
            key={category.id}
            className="flex flex-col items-center animate-slide-up cursor-pointer"
            style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
            onClick={() => handleCategoryClick(category.path)}
          >
            <div className={`category-icon mb-2 bg-gradient-to-br ${category.gradient} shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 rounded-xl`}>
              {category.icon}
            </div>
            <span className="text-xs text-center font-medium">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;

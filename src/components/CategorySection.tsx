
import React from 'react';
import { GraduationCap, Briefcase, Home, Camera } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const categories: Category[] = [
  {
    id: 'education',
    name: '教育学习',
    icon: <GraduationCap size={24} />,
    color: 'bg-app-blue'
  },
  {
    id: 'career',
    name: '职业发展',
    icon: <Briefcase size={24} />,
    color: 'bg-app-green'
  },
  {
    id: 'lifestyle',
    name: '生活服务',
    icon: <Home size={24} />,
    color: 'bg-app-orange'
  },
  {
    id: 'hobbies',
    name: '兴趣技能',
    icon: <Camera size={24} />,
    color: 'bg-app-red'
  }
];

const CategorySection: React.FC = () => {
  return (
    <div className="py-6 px-4 animate-fade-in animate-delay-1">
      <div className="grid grid-cols-4 gap-2">
        {categories.map((category, index) => (
          <div 
            key={category.id}
            className="flex flex-col items-center animate-slide-up"
            style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
          >
            <div className={`category-icon mb-2 ${category.color}`}>
              {category.icon}
            </div>
            <span className="text-xs text-center">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;

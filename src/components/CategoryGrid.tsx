
import React from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoryGridProps {
  categories: Category[];
  onSelect: (categoryId: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-4 py-4">
      {categories.map(category => (
        <div 
          key={category.id} 
          className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
          onClick={() => onSelect(category.id)}
        >
          <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center shadow-sm mb-2`}>
            <span className="text-white text-xl">{category.icon}</span>
          </div>
          <span className="text-xs text-center">{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;

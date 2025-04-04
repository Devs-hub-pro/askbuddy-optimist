
import React from 'react';
import { Button } from '../ui/button';
import { Toggle } from '../ui/toggle';
import { iconComponents, downloadSvgFixed } from '../../utils/iconOperations';

interface IconCardProps {
  icon: { name: string; description: string };
  isSelected: boolean;
  downloadColor: string;
  onToggleSelection: (iconName: string) => void;
}

const IconCard: React.FC<IconCardProps> = ({ 
  icon, 
  isSelected, 
  downloadColor, 
  onToggleSelection 
}) => {
  const IconComponent = iconComponents[icon.name];
  
  if (!IconComponent) return null;
  
  return (
    <div 
      className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border-blue-300' : ''}`}
      onClick={() => onToggleSelection(icon.name)}
    >
      <div className="p-4 bg-gray-100 rounded-full mb-2">
        <IconComponent size={24} style={{color: downloadColor}} className="transition-colors" />
      </div>
      <div className="text-center">
        <p className="font-medium text-sm">{icon.name}</p>
        <p className="text-xs text-gray-500 mt-1">{icon.description}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation();
            downloadSvgFixed(icon.name, downloadColor);
          }}
        >
          下载SVG
        </Button>
        <Toggle
          pressed={isSelected}
          className="mt-2 w-full text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelection(icon.name);
          }}
        >
          {isSelected ? '已选择' : '选择'}
        </Toggle>
      </div>
    </div>
  );
};

export default IconCard;

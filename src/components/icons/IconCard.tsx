
import React from 'react';
import { Button } from '../ui/button';
import { Toggle } from '../ui/toggle';
import { iconComponents, downloadSvgFixed } from '../../utils/iconOperations';
import { Download } from 'lucide-react';

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
        <IconComponent size={24} color={downloadColor} className="text-gray-700" />
      </div>
      <div className="text-center w-full">
        <p className="font-medium text-sm">{icon.name}</p>
        <p className="text-xs text-gray-500 mt-1">{icon.description}</p>
        
        <div className="flex flex-col gap-2 mt-3 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              downloadSvgFixed(icon.name, downloadColor);
            }}
          >
            <Download size={14} className="mr-1" />
            下载SVG
          </Button>
          
          <Toggle
            pressed={isSelected}
            className="w-full text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelection(icon.name);
            }}
          >
            {isSelected ? '已选择' : '选择'}
          </Toggle>
        </div>
      </div>
    </div>
  );
};

export default IconCard;

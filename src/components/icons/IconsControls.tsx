
import React from 'react';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

interface IconsControlsProps {
  selectedCount: number;
  downloadColor: string;
  onColorChange: (color: string) => void;
  onToggleSelectAll: () => void;
  onDownloadSelected: () => void;
  isAllSelected: boolean;
}

const IconsControls: React.FC<IconsControlsProps> = ({
  selectedCount,
  downloadColor,
  onColorChange,
  onToggleSelectAll,
  onDownloadSelected,
  isAllSelected
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onToggleSelectAll} variant="outline" className="flex items-center gap-2">
          {isAllSelected ? '取消全选' : '全选'}
        </Button>
        
        <Button 
          onClick={onDownloadSelected} 
          disabled={selectedCount === 0}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          下载选中的图标 ({selectedCount})
        </Button>
        
        <div className="flex items-center gap-2 ml-2">
          <span className="text-sm">颜色:</span>
          <input 
            type="color" 
            value={downloadColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-8 h-8 p-0 border-0"
          />
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        提示：点击图标卡片可以选择/取消选择图标。下载后，您可以使用在线工具将SVG转换为PNG格式。
      </p>
    </div>
  );
};

export default IconsControls;

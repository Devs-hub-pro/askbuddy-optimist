
import React from 'react';
import { Button } from '../ui/button';
import { Download, DownloadCloud } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Checkbox } from '../ui/checkbox';

interface IconsControlsProps {
  selectedCount: number;
  downloadColor: string;
  onColorChange: (color: string) => void;
  onToggleSelectAll: () => void;
  onDownloadSelected: () => void;
  onDownloadAll: () => void;
  isAllSelected: boolean;
  totalIconsCount: number;
}

const IconsControls: React.FC<IconsControlsProps> = ({
  selectedCount,
  downloadColor,
  onColorChange,
  onToggleSelectAll,
  onDownloadSelected,
  onDownloadAll,
  isAllSelected,
  totalIconsCount
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onToggleSelectAll} variant="outline" className="flex items-center gap-2">
          <Checkbox checked={isAllSelected} />
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
        
        <Button 
          onClick={onDownloadAll} 
          variant="secondary"
          className="flex items-center gap-2"
        >
          <DownloadCloud size={16} />
          一键下载全部图标 ({totalIconsCount})
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
      
      <ScrollArea className="w-full mb-2 max-w-full" orientation="horizontal">
        <div className="inline-flex space-x-2 py-1 px-1">
          {selectedCount > 0 && (
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
              已选择 {selectedCount} 个图标
            </div>
          )}
          {selectedCount === 0 && (
            <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center">
              请选择需要下载的图标
            </div>
          )}
        </div>
      </ScrollArea>
      
      <p className="text-sm text-gray-500">
        提示：点击图标卡片可以选择/取消选择图标。下载后，您可以使用在线工具将SVG转换为PNG格式。
      </p>
    </div>
  );
};

export default IconsControls;

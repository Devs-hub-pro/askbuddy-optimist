
import React, { useState } from 'react';
import { allIcons } from '../utils/iconsList';
import { downloadSvgFixed } from '../utils/iconOperations';
import IconCard from './icons/IconCard';
import IconsControls from './icons/IconsControls';
import IconsInstructions from './icons/IconsInstructions';
import { toast } from 'sonner';

const IconsPreview: React.FC = () => {
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());
  const [downloadColor, setDownloadColor] = useState('#000000');

  // Toggle selection of an icon
  const toggleIconSelection = (iconName: string) => {
    const newSelection = new Set(selectedIcons);
    if (newSelection.has(iconName)) {
      newSelection.delete(iconName);
    } else {
      newSelection.add(iconName);
    }
    setSelectedIcons(newSelection);
  };

  // Select or deselect all icons
  const toggleSelectAll = () => {
    if (selectedIcons.size === allIcons.length) {
      setSelectedIcons(new Set());
    } else {
      setSelectedIcons(new Set(allIcons.map(icon => icon.name)));
    }
  };

  // Function to download multiple SVGs at once
  const downloadSelectedIcons = () => {
    if (selectedIcons.size === 0) {
      toast.error('请先选择要下载的图标');
      return;
    }
    
    // Download selected icons with a small delay between each
    const selectedIconsList = Array.from(selectedIcons);
    
    toast.success(`将下载 ${selectedIconsList.length} 个图标`);
    
    selectedIconsList.forEach((iconName, index) => {
      setTimeout(() => {
        try {
          downloadSvgFixed(iconName, downloadColor);
        } catch (error) {
          console.error(`下载图标 ${iconName} 失败:`, error);
          toast.error(`下载图标 ${iconName} 失败`);
        }
      }, index * 300); // Add a delay between downloads to avoid browser limitations
    });
  };

  // Function to download all icons at once
  const downloadAllIcons = () => {
    const allIconNames = allIcons.map(icon => icon.name);
    
    toast.success(`将下载所有 ${allIconNames.length} 个图标`);
    
    allIconNames.forEach((iconName, index) => {
      setTimeout(() => {
        try {
          downloadSvgFixed(iconName, downloadColor);
        } catch (error) {
          console.error(`下载图标 ${iconName} 失败:`, error);
          toast.error(`下载图标 ${iconName} 失败`);
        }
      }, index * 300); // Add a delay between downloads to avoid browser limitations
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Icons for WeChat Mini Program</h1>
      <p className="mb-4 text-gray-600">
        这些图标需要保存为PNG格式，放在WeChat小程序的 /assets/icons/ 目录中使用。
      </p>
      
      <IconsControls 
        selectedCount={selectedIcons.size}
        downloadColor={downloadColor}
        onColorChange={setDownloadColor}
        onToggleSelectAll={toggleSelectAll}
        onDownloadSelected={downloadSelectedIcons}
        onDownloadAll={downloadAllIcons}
        isAllSelected={selectedIcons.size === allIcons.length}
        totalIconsCount={allIcons.length}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allIcons.map((icon) => (
          <IconCard
            key={icon.name}
            icon={icon}
            isSelected={selectedIcons.has(icon.name)}
            downloadColor={downloadColor}
            onToggleSelection={toggleIconSelection}
          />
        ))}
      </div>
      
      <IconsInstructions />
    </div>
  );
};

export default IconsPreview;

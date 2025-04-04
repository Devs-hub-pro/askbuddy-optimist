
import React, { useState } from 'react';
import { allIcons } from '../utils/iconsList';
import { downloadSvgFixed } from '../utils/iconOperations';
import IconCard from './icons/IconCard';
import IconsControls from './icons/IconsControls';
import IconsInstructions from './icons/IconsInstructions';

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
      alert('请先选择要下载的图标');
      return;
    }
    
    // Since browsers can't create zip files directly, 
    // we'll download icons one by one with a small delay between each
    const selectedIconsList = Array.from(selectedIcons);
    
    alert(`将依次下载 ${selectedIconsList.length} 个图标，请稍等...`);
    
    selectedIconsList.forEach((iconName, index) => {
      setTimeout(() => {
        try {
          // Try the fixed method with known structure
          downloadSvgFixed(iconName, downloadColor);
        } catch (error) {
          console.error(`下载图标 ${iconName} 失败:`, error);
        }
      }, index * 300); // Add a delay between downloads to avoid browser limitations
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Icons for WeChat Mini Program</h1>
      <p className="mb-4 text-gray-600">
        These icons need to be saved as PNG files in the /assets/icons/ directory for the WeChat mini-program.
      </p>
      
      <IconsControls 
        selectedCount={selectedIcons.size}
        downloadColor={downloadColor}
        onColorChange={setDownloadColor}
        onToggleSelectAll={toggleSelectAll}
        onDownloadSelected={downloadSelectedIcons}
        isAllSelected={selectedIcons.size === allIcons.length}
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


import React, { useState } from 'react';
import { allIcons } from '../utils/iconsList';
import { downloadSvgFixed, downloadIconAsPng } from '../utils/iconOperations';
import IconCard from './icons/IconCard';
import IconsControls from './icons/IconsControls';
import IconsInstructions from './icons/IconsInstructions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LogoGenerator from './logo/LogoGenerator';
import Logo from './logo/Logo';

const IconsPreview: React.FC = () => {
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());
  const [downloadColor, setDownloadColor] = useState('#000000');
  const [downloadFormat, setDownloadFormat] = useState<'svg' | 'png'>('svg');
  const [pngSize, setPngSize] = useState(48);

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

  // Function to download multiple icons at once
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
          if (downloadFormat === 'svg') {
            downloadSvgFixed(iconName, downloadColor);
          } else {
            downloadIconAsPng(iconName, downloadColor, pngSize);
          }
        } catch (error) {
          console.error(`下载图标 ${iconName} 失败:`, error);
        }
      }, index * 300); // Add a delay between downloads to avoid browser limitations
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Logo size="sm" />
        <span>品牌资源中心</span>
      </h1>
      
      <Tabs defaultValue="icons" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="icons">小程序图标</TabsTrigger>
          <TabsTrigger value="logo">品牌Logo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="icons">
          <p className="mb-4 text-gray-600">
            这些图标需要保存为PNG文件并放在 /assets/icons/ 目录中供微信小程序使用。
          </p>
          
          <IconsControls 
            selectedCount={selectedIcons.size}
            downloadColor={downloadColor}
            onColorChange={setDownloadColor}
            onToggleSelectAll={toggleSelectAll}
            onDownloadSelected={downloadSelectedIcons}
            isAllSelected={selectedIcons.size === allIcons.length}
          />
          
          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">格式:</span>
              <select 
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value as 'svg' | 'png')}
                className="p-2 border rounded-md"
              >
                <option value="svg">SVG</option>
                <option value="png">PNG</option>
              </select>
            </div>
            
            {downloadFormat === 'png' && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">尺寸:</span>
                <select 
                  value={pngSize}
                  onChange={(e) => setPngSize(Number(e.target.value))}
                  className="p-2 border rounded-md"
                >
                  <option value="24">24px</option>
                  <option value="48">48px</option>
                  <option value="64">64px</option>
                  <option value="96">96px</option>
                </select>
              </div>
            )}
          </div>
          
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
        </TabsContent>
        
        <TabsContent value="logo">
          <LogoGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IconsPreview;

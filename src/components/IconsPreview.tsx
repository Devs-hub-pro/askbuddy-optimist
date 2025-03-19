
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { allIcons } from '../utils/iconsList';
import * as LucideIcons from 'lucide-react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { Toggle } from './ui/toggle';

const IconsPreview: React.FC = () => {
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());
  const [downloadColor, setDownloadColor] = useState('#000000');

  // Create a mapping of icon names to Lucide components
  const iconComponents: Record<string, React.ComponentType<any>> = {
    'map-pin': LucideIcons.MapPin,
    'chevron-down': LucideIcons.ChevronDown,
    'bell': LucideIcons.Bell,
    'search': LucideIcons.Search,
    'users': LucideIcons.Users,
    'sparkles': LucideIcons.Sparkles,
    'graduation-cap': LucideIcons.GraduationCap,
    'briefcase': LucideIcons.Briefcase,
    'home': LucideIcons.Home,
    'camera': LucideIcons.Camera,
    'arrow-up-right': LucideIcons.ArrowUpRight,
    'message-circle': LucideIcons.MessageCircle,
    'award': LucideIcons.Award,
    'compass': LucideIcons.Compass,
    'plus': LucideIcons.Plus,
    'message-square': LucideIcons.MessageSquare,
    'user': LucideIcons.User,
  };

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

  // Function to create SVG content for an icon
  const createSvgContent = (iconName: string, color: string = '#000000') => {
    const IconComponent = iconComponents[iconName];
    if (!IconComponent) return null;
    
    // Create a temporary element to render the icon
    const tempDiv = document.createElement('div');
    const tempReactElement = document.createElement('div');
    tempDiv.appendChild(tempReactElement);
    
    // Render the icon into the temp element using createRoot
    const iconInstance = React.createElement(IconComponent, { color });
    const root = createRoot(tempReactElement);
    root.render(iconInstance);
    
    // Get the SVG from the rendered element
    const svgElement = tempReactElement.querySelector('svg');
    if (!svgElement) return null;
    
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${svgElement.innerHTML}
      </svg>
    `;
  };

  // Function to download SVG
  const downloadSvg = (iconName: string, color: string = '#000000') => {
    const IconComponent = iconComponents[iconName];
    if (!IconComponent) return;
    
    // Get the SVG element from the component
    const element = document.createElement('div');
    const reactElement = React.createElement(IconComponent, { color });
    
    // Use createRoot instead of React.render
    const root = createRoot(element);
    root.render(reactElement);
    
    const svgElement = element.querySelector('svg');
    if (!svgElement) return;
    
    // Get the SVG content
    const svgContent = svgElement.outerHTML;
    
    // Create blob and download
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${iconName}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Using a more compatible approach for rendering and extracting SVG
  const downloadSvgFixed = (iconName: string, color: string = '#000000') => {
    const IconComponent = iconComponents[iconName];
    if (!IconComponent) return;
    
    // Create SVG content directly using the known structure and renderToStaticMarkup
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${iconName}">
        ${renderToStaticMarkup(React.createElement(IconComponent, { color })).replace(/<svg[^>]*>|<\/svg>/g, '')}
      </svg>
    `;
    
    // Create blob and download
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${iconName}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={toggleSelectAll} variant="outline" className="flex items-center gap-2">
            {selectedIcons.size === allIcons.length ? '取消全选' : '全选'}
          </Button>
          
          <Button 
            onClick={downloadSelectedIcons} 
            disabled={selectedIcons.size === 0}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            下载选中的图标 ({selectedIcons.size})
          </Button>
          
          <div className="flex items-center gap-2 ml-2">
            <span className="text-sm">颜色:</span>
            <input 
              type="color" 
              value={downloadColor}
              onChange={(e) => setDownloadColor(e.target.value)}
              className="w-8 h-8 p-0 border-0"
            />
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          提示：点击图标卡片可以选择/取消选择图标。下载后，您可以使用在线工具将SVG转换为PNG格式。
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allIcons.map((icon) => {
          const IconComponent = iconComponents[icon.name];
          const isSelected = selectedIcons.has(icon.name);
          
          return (
            <div 
              key={icon.name} 
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border-blue-300' : ''}`}
              onClick={() => toggleIconSelection(icon.name)}
            >
              <div className="p-4 bg-gray-100 rounded-full mb-2">
                {IconComponent && <IconComponent size={24} className="text-gray-700" />}
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
                    toggleIconSelection(icon.name);
                  }}
                >
                  {isSelected ? '已选择' : '选择'}
                </Toggle>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-bold text-lg mb-2">For WeChat Mini Program:</h2>
        <p className="text-sm">Save these icons as PNG files with the following naming structure:</p>
        <ul className="mt-2 text-sm list-disc pl-5">
          <li>Normal state: <code>/assets/icons/[icon-name].png</code></li>
          <li>Active state (for tab bar): <code>/assets/icons/[icon-name]-active.png</code></li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">Example: /assets/icons/home.png, /assets/icons/home-active.png</p>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-medium text-sm mb-1">SVG到PNG转换说明：</h3>
          <p className="text-xs text-gray-700">
            1. 下载SVG图标后，您可以使用在线工具如 <a href="https://cloudconvert.com/svg-to-png" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">CloudConvert</a> 将它们转换为PNG格式。<br/>
            2. 对于底部导航栏的活跃状态图标，您可以在转换时设置不同的颜色（如#4FD1C5）。<br/>
            3. 确保所有图标都保存在微信小程序项目的 /assets/icons/ 目录中。
          </p>
        </div>
      </div>
    </div>
  );
};

export default IconsPreview;

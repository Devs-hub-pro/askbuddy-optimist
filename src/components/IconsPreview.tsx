
import React from 'react';
import { allIcons } from '../utils/iconsList';
import * as LucideIcons from 'lucide-react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

const IconsPreview: React.FC = () => {
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

  // Function to download SVG
  const downloadSvg = (iconName: string, color: string = '#000000') => {
    const IconComponent = iconComponents[iconName];
    if (!IconComponent) return;

    // Create SVG content
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${IconComponent({}).props.children}
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

  // Function to download all icons as a zip
  const downloadAllIcons = () => {
    // Create a message for users since we can't create a zip file directly in browser
    alert('由于浏览器限制，无法直接下载所有图标为zip包。请逐个下载图标，或访问 https://lucide.dev/icons/ 搜索并下载所需图标。');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Icons for WeChat Mini Program</h1>
      <p className="mb-4 text-gray-600">
        These icons need to be saved as PNG files in the /assets/icons/ directory for the WeChat mini-program.
      </p>
      
      <div className="mb-6">
        <Button onClick={downloadAllIcons} className="flex items-center gap-2">
          <Download size={16} />
          尝试下载所有图标
        </Button>
        <p className="mt-2 text-sm text-gray-500">
          注意：请点击每个图标下方的"下载SVG"按钮来下载单个图标。下载后，您可以使用在线工具将SVG转换为PNG格式。
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allIcons.map((icon) => {
          const IconComponent = iconComponents[icon.name];
          return (
            <div key={icon.name} className="border rounded-lg p-4 flex flex-col items-center">
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
                  onClick={() => downloadSvg(icon.name)}
                >
                  下载SVG
                </Button>
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

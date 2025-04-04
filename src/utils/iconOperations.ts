
import React from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import * as LucideIcons from 'lucide-react';

// Create a mapping of icon names to Lucide components
export const iconComponents: Record<string, React.ComponentType<any>> = {
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

// Function to create SVG content for an icon
export const createSvgContent = (iconName: string, color: string = '#000000') => {
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

// Function to download SVG using static markup
export const downloadSvgFixed = (iconName: string, color: string = '#000000') => {
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

// Function to download all icons
export const downloadAllIcons = (color: string = '#000000') => {
  const iconNames = Object.keys(iconComponents);
  
  // Notify the user about the download
  alert(`将依次下载 ${iconNames.length} 个图标，请稍等...`);
  
  // Download each icon with a small delay to avoid browser limitations
  iconNames.forEach((iconName, index) => {
    setTimeout(() => {
      try {
        downloadSvgFixed(iconName, color);
      } catch (error) {
        console.error(`下载图标 ${iconName} 失败:`, error);
      }
    }, index * 300); // Add a delay between downloads
  });
};

// Function to create a ZIP file with all icons (requires JSZip library)
// This is a placeholder for future implementation if needed
export const downloadIconsAsZip = (iconNames: string[], color: string = '#000000') => {
  // Requires JSZip library to be installed
  // This would create a single ZIP file with all selected icons
  alert('批量下载功能需要安装额外的依赖库，目前使用的是逐个下载的方式。');
};

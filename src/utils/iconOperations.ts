
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

// Convert SVG string to PNG using a canvas.
export const svgStringToPngBlob = async (svgString: string, size: number = 24): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const svg = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svg);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create PNG'));
      }, 'image/png');
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to render SVG to PNG'));
    };

    img.src = url;
  });
};

// 下载指定icon的PNG
export const downloadPngFromIcon = async (iconName: string, color: string = '#000000', size: number = 24) => {
  const IconComponent = iconComponents[iconName];
  if (!IconComponent) return;

  // 生成SVG字符串
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${iconName}">
      ${renderToStaticMarkup(React.createElement(IconComponent, { color })).replace(/<svg[^>]*>|<\/svg>/g, '')}
    </svg>
  `;

  // 转PNG并下载
  const pngBlob = await svgStringToPngBlob(svgString, size);
  const url = URL.createObjectURL(pngBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${iconName}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 批量下载
export const batchDownloadPngFromIcons = async (iconNames: string[], color: string = '#000000', size: number = 24) => {
  for (let i = 0; i < iconNames.length; i++) {
    await downloadPngFromIcon(iconNames[i], color, size);
  }
};

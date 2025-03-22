
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
  'calendar': LucideIcons.Calendar,
  'check': LucideIcons.Check,
  'x': LucideIcons.X,
  'arrow-left': LucideIcons.ArrowLeft,
  'arrow-right': LucideIcons.ArrowRight,
  'download': LucideIcons.Download,
  'copy': LucideIcons.Copy,
  'sun': LucideIcons.Sun,
  'share': LucideIcons.Share,
  'thumbs-up': LucideIcons.ThumbsUp,
  'thumbs-down': LucideIcons.ThumbsDown,
  'comment': LucideIcons.MessageCircle,
  'clock': LucideIcons.Clock,
  'heart': LucideIcons.Heart,
  'edit': LucideIcons.Edit,
  'trash': LucideIcons.Trash,
  'settings': LucideIcons.Settings,
  'info': LucideIcons.Info,
  'alert-circle': LucideIcons.AlertCircle,
  'check-circle': LucideIcons.CheckCircle,
  'circle': LucideIcons.Circle,
  'close': LucideIcons.X,
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

// Convert SVG to PNG (lower quality, but useful for preview)
export const svgToPng = async (svgString: string, width = 48, height = 48): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      const pngUrl = canvas.toDataURL('image/png');
      URL.revokeObjectURL(url);
      resolve(pngUrl);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image loading failed'));
    };
    
    img.src = url;
  });
};

// Download icon as PNG
export const downloadIconAsPng = async (iconName: string, color: string = '#000000', size = 48) => {
  const IconComponent = iconComponents[iconName];
  if (!IconComponent) return;
  
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${iconName}">
      ${renderToStaticMarkup(React.createElement(IconComponent, { color })).replace(/<svg[^>]*>|<\/svg>/g, '')}
    </svg>
  `;
  
  try {
    const pngUrl = await svgToPng(svgString, size, size);
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `${iconName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Failed to convert SVG to PNG:', error);
  }
};

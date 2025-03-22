
import React from 'react';
import { Users, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'light' | 'dark';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'default',
  showText = true
}) => {
  // Size mapping
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16'
  };
  
  // Icon size mapping
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
  };
  
  // Color variants
  const colorVariants = {
    default: {
      bg: 'bg-gradient-to-r from-blue-500 to-app-teal',
      text: 'text-slate-800',
      tagline: 'text-gray-600'
    },
    light: {
      bg: 'bg-white',
      text: 'text-slate-800',
      tagline: 'text-gray-600'
    },
    dark: {
      bg: 'bg-slate-800',
      text: 'text-white',
      tagline: 'text-gray-300'
    }
  };
  
  const colors = colorVariants[variant];
  
  return (
    <div className="flex items-center">
      <div className={`${sizeClasses[size]} aspect-square rounded-lg ${colors.bg} flex items-center justify-center shadow-sm overflow-hidden relative`}>
        <Users size={iconSizes[size]} className="text-white absolute" />
        <Sparkles size={iconSizes[size] * 0.7} className="text-yellow-300 absolute -right-1 -top-1" />
      </div>
      
      {showText && (
        <div className="ml-2">
          <div className={`font-bold ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-3xl'} ${colors.text}`}>
            找人问问
          </div>
          <div className={`text-xs ${colors.tagline}`}>
            AI无法回答的，人来回答！
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;

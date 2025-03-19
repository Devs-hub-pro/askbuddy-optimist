
import React, { useState } from 'react';
import { MapPin, ChevronDown, Bell } from 'lucide-react';

interface NavbarProps {
  location?: string;
}

const Navbar: React.FC<NavbarProps> = ({ location = "深圳" }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-app-teal to-blue-300 animate-fade-in shadow-sm">
      <div className="flex items-center justify-between h-12 px-4">
        <div className="text-white font-medium text-sm">问问</div>
        
        <div className="flex items-center gap-3">
          <button className="relative">
            <Bell size={18} className="text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button 
            className="flex items-center space-x-1 text-white font-medium text-sm px-2 py-1 rounded-full bg-white/20"
            onClick={() => setIsOpen(!isOpen)}
          >
            <MapPin size={14} className="text-white" />
            <span>{location}</span>
            <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute top-12 right-0 w-32 bg-white rounded-md shadow-xl p-2 animate-scale origin-top-right">
          <ul>
            {['北京', '上海', '广州', '深圳', '杭州'].map((city) => (
              <li key={city}>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${city === location ? 'bg-green-50 text-app-green' : 'hover:bg-gray-50'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {city}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;

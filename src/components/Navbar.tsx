
import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

interface NavbarProps {
  location?: string;
}

const Navbar: React.FC<NavbarProps> = ({ location = "深圳" }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-app-teal animate-fade-in">
      <div className="flex items-center justify-end h-12 px-4">
        <button 
          className="flex items-center space-x-1 text-slate-800 font-medium"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MapPin size={18} className="text-app-blue" />
          <span>{location}</span>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute top-12 right-0 w-32 bg-white rounded-md shadow-md p-2 animate-scale origin-top-right">
          <ul>
            {['北京', '上海', '广州', '深圳', '杭州'].map((city) => (
              <li key={city}>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${city === location ? 'bg-blue-50 text-app-blue' : 'hover:bg-gray-50'}`}
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

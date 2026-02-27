
import React, { useState } from 'react';
import { MapPin, ChevronDown, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  location?: string;
}

const Navbar: React.FC<NavbarProps> = ({ location = "深圳" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLocationSelect = () => {
    setIsOpen(false);
    navigate('/city-selector');
  };
  
  return (
    <header className="sticky top-0 z-50 bg-app-teal shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex items-center justify-between h-11 px-4">
        <div className="text-white font-semibold text-base">问问</div>
        
        <div className="flex items-center gap-2">
          <button className="relative p-1.5">
            <Bell size={18} className="text-white" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-destructive rounded-full"></span>
          </button>
          
          <button 
            className="flex items-center gap-1 text-white text-xs px-2 py-1 rounded-full bg-white/20"
            onClick={handleLocationSelect}
          >
            <MapPin size={12} className="text-white" />
            <span>{location}</span>
            <ChevronDown size={12} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

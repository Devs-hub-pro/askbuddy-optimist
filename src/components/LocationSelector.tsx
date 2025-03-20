
import React from 'react';
import { MapPin, ChevronDown, ChevronUp, Search } from 'lucide-react';

interface LocationSelectorProps {
  location: string;
  cities: string[];
  locationMenuOpen: boolean;
  recentCities: string[];
  onToggle: () => void;
  onSelect: (city: string) => void;
  onShowSelector: () => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  location,
  cities,
  locationMenuOpen,
  recentCities,
  onToggle,
  onSelect,
  onShowSelector
}) => {
  return (
    <div className="relative">
      <button 
        className="flex items-center text-white"
        onClick={onToggle}
      >
        <MapPin size={18} className="mr-1" />
        <span>{location}</span>
        {locationMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      
      {locationMenuOpen && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-64 z-50 overflow-hidden">
          <div className="p-3 border-b">
            <h3 className="font-medium text-sm mb-2">当前城市</h3>
            <div 
              className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm cursor-pointer"
              onClick={() => onSelect(location)}
            >
              {location}
            </div>
          </div>
          
          {recentCities.length > 0 && (
            <div className="p-3 border-b">
              <h3 className="font-medium text-sm mb-2">最近访问</h3>
              <div className="flex flex-wrap gap-2">
                {recentCities.map(city => (
                  <div 
                    key={city} 
                    className="inline-block px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-100"
                    onClick={() => onSelect(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="p-3 border-b">
            <h3 className="font-medium text-sm mb-2">热门城市</h3>
            <div className="grid grid-cols-3 gap-2">
              {cities.slice(0, 6).map(city => (
                <div 
                  key={city} 
                  className="text-center py-1 bg-gray-50 text-gray-700 rounded text-sm cursor-pointer hover:bg-gray-100"
                  onClick={() => onSelect(city)}
                >
                  {city}
                </div>
              ))}
            </div>
          </div>
          
          <div 
            className="p-3 flex items-center justify-center text-sm text-app-teal cursor-pointer hover:bg-gray-50"
            onClick={onShowSelector}
          >
            <Search size={16} className="mr-1" />
            <span>查看更多城市</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;

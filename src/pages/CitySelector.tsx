import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MapPin, X } from 'lucide-react';
import { mainlandCities, overseasRegions, alphabet, hotLocations } from '../utils/locationData';
import { Input } from '@/components/ui/input';

const CitySelector = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'mainland' | 'overseas'>('mainland');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState('深圳');
  const [recentLocations, setRecentLocations] = useState<string[]>([]);
  const [scrollToLetter, setScrollToLetter] = useState('');
  const letterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  useEffect(() => {
    // Get stored location data
    const storedLocation = localStorage.getItem('currentLocation') || '深圳';
    const storedRecentLocations = JSON.parse(localStorage.getItem('recentLocations') || '[]');
    
    setCurrentLocation(storedLocation);
    setRecentLocations(storedRecentLocations);
  }, []);

  useEffect(() => {
    if (scrollToLetter && letterRefs.current[scrollToLetter]) {
      letterRefs.current[scrollToLetter]?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollToLetter]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    
    if (!value.trim()) {
      setFilteredLocations([]);
      return;
    }
    
    // Search in mainland cities
    const mainlandResults = Object.values(mainlandCities)
      .flat()
      .filter(city => city.toLowerCase().includes(value.toLowerCase()));
    
    // Search in overseas locations
    const overseasResults = Object.values(overseasRegions)
      .flat()
      .filter(country => country.toLowerCase().includes(value.toLowerCase()));
    
    setFilteredLocations([...mainlandResults, ...overseasResults]);
  };

  const clearSearch = () => {
    setSearchKeyword('');
    setFilteredLocations([]);
  };

  const selectLocation = (location: string) => {
    // Update current location
    localStorage.setItem('currentLocation', location);
    
    // Update recent locations
    let updatedRecentLocations = [...recentLocations];
    // Remove if already exists
    updatedRecentLocations = updatedRecentLocations.filter(loc => loc !== location);
    // Add to beginning
    updatedRecentLocations.unshift(location);
    // Keep only 5 most recent
    updatedRecentLocations = updatedRecentLocations.slice(0, 5);
    
    localStorage.setItem('recentLocations', JSON.stringify(updatedRecentLocations));
    
    // Navigate back to home page
    navigate('/', { state: { location } });
  };

  const useCurrentLocation = () => {
    // In a real app, would use geolocation APIs
    console.log('Using current location');
    // For demo, we'll just select Shenzhen
    selectLocation('深圳');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="flex items-center h-12 px-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 mr-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-medium">选择城市</h1>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 py-2 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              value={searchKeyword}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="搜索城市、国家"
              className="pl-10 pr-10 py-2 h-10 bg-gray-100 border-none"
            />
            {searchKeyword && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>
        
        {/* Tabs for Mainland/Overseas */}
        {!searchKeyword && (
          <div className="flex border-b">
            <button 
              className={`flex-1 py-2 font-medium text-sm relative ${activeTab === 'mainland' ? 'text-app-teal' : 'text-gray-500'}`}
              onClick={() => setActiveTab('mainland')}
            >
              中国大陆
              {activeTab === 'mainland' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-app-teal"></div>
              )}
            </button>
            <button 
              className={`flex-1 py-2 font-medium text-sm relative ${activeTab === 'overseas' ? 'text-app-teal' : 'text-gray-500'}`}
              onClick={() => setActiveTab('overseas')}
            >
              海外地区
              {activeTab === 'overseas' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-app-teal"></div>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Search Results */}
      {searchKeyword && (
        <div className="bg-white p-4">
          <h2 className="text-sm text-gray-500 mb-2">搜索结果</h2>
          {filteredLocations.length > 0 ? (
            <div className="divide-y">
              {filteredLocations.map((location) => (
                <button
                  key={location}
                  className="w-full py-3 text-left text-sm"
                  onClick={() => selectLocation(location)}
                >
                  {location}
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              未找到匹配的城市或国家
            </div>
          )}
        </div>
      )}
      
      {!searchKeyword && (
        <>
          {/* Current Location */}
          <div className="bg-white mt-2 px-4 py-3 flex justify-between items-center">
            <div className="font-medium">当前城市：{currentLocation}</div>
            <button 
              onClick={useCurrentLocation}
              className="flex items-center text-app-teal text-sm gap-1"
            >
              <MapPin size={14} />
              <span>重新定位</span>
            </button>
          </div>
          
          {/* Recent Locations */}
          {recentLocations.length > 0 && (
            <div className="bg-white mt-2 p-4">
              <h2 className="text-sm text-gray-500 mb-2">最近访问</h2>
              <div className="flex flex-wrap gap-3">
                {recentLocations.map((location) => (
                  <button
                    key={location}
                    className="px-4 py-2 bg-gray-100 rounded-md text-sm"
                    onClick={() => selectLocation(location)}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Hot Locations */}
          <div className="bg-white mt-2 p-4">
            <h2 className="text-sm text-gray-500 mb-2">热门城市</h2>
            <div className="flex flex-wrap gap-3">
              {hotLocations.map((location) => (
                <button
                  key={location}
                  className="px-4 py-2 bg-gray-100 rounded-md text-sm"
                  onClick={() => selectLocation(location)}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mainland Cities */}
          {activeTab === 'mainland' && (
            <div className="relative bg-white mt-2">
              {/* Alphabetical Index */}
              <div className="fixed right-1 top-1/2 transform -translate-y-1/2 flex flex-col z-30 py-1 px-1 rounded-full bg-gray-100/80 text-xs">
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    className="w-5 h-5 flex items-center justify-center text-gray-500"
                    onClick={() => setScrollToLetter(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              
              {/* City List */}
              <div className="pb-24">
                {alphabet.map((letter) => (
                  mainlandCities[letter] && mainlandCities[letter].length > 0 && (
                    <div key={letter} className="city-section">
                      <div 
                        ref={(el) => letterRefs.current[letter] = el}
                        className="sticky top-[104px] z-20 px-4 py-1 bg-gray-100 text-sm text-gray-500"
                      >
                        {letter}
                      </div>
                      <div className="divide-y px-4">
                        {mainlandCities[letter].map((city) => (
                          <button
                            key={city}
                            className="w-full py-3 text-left text-sm"
                            onClick={() => selectLocation(city)}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
          
          {/* Overseas Regions */}
          {activeTab === 'overseas' && (
            <div className="bg-white mt-2 pb-24">
              {Object.entries(overseasRegions).map(([region, countries]) => (
                <div key={region}>
                  <div className="sticky top-[104px] z-20 px-4 py-1 bg-gray-100 text-sm text-gray-500">
                    {region}
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-3">
                      {countries.map((country) => (
                        <button
                          key={country}
                          className="px-4 py-2 bg-gray-100 rounded-md text-sm"
                          onClick={() => selectLocation(country)}
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CitySelector;

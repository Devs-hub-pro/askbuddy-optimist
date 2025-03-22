
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEducation?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "搜索问题/达人/话题", 
  className = "",
  value,
  onChange,
  isEducation = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setSearchValue(value);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    
    if (onChange) {
      onChange(e);
    }
    
    if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (searchValue.trim() === '') return;
    
    // If we're already on a search page, use the provided onSearch function
    if (location.pathname.includes('/search')) {
      if (onSearch) {
        onSearch(searchValue);
      }
    } else {
      // Navigate to the appropriate search page
      if (isEducation) {
        navigate(`/education/search?q=${encodeURIComponent(searchValue)}`);
      } else {
        // Global search
        navigate(`/search?q=${encodeURIComponent(searchValue)}`);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Navigate directly to search page when focusing on the search bar
    if (!location.pathname.includes('/search')) {
      if (isEducation) {
        navigate('/education/search');
      } else {
        navigate('/search');
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`px-4 py-3 ${className}`}>
      <div className={`relative ${isFocused ? 'ring-2 ring-app-teal/30 rounded-md' : ''}`}>
        <Input
          type="text"
          value={value !== undefined ? value : searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="search-input pr-10 focus:ring-2 focus:ring-app-teal/30 shadow-sm"
        />
        <Search 
          size={18} 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
          onClick={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;

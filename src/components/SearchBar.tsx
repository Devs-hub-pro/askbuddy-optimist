
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEducation?: boolean;
  clickToNavigate?: boolean;
  accentRingClassName?: string;
  inputAccentClassName?: string;
  inputBorderClassName?: string;
  iconClassName?: string;
  navigateToPath?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "搜索问题/达人/话题", 
  className = "",
  value,
  onChange,
  isEducation = false,
  clickToNavigate = false,
  accentRingClassName = 'ring-app-teal/25',
  inputAccentClassName = 'focus-visible:ring-app-teal/25 focus-visible:border-app-teal/30',
  inputBorderClassName = 'border-gray-200',
  iconClassName = 'text-gray-400',
  navigateToPath,
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
      if (navigateToPath) {
        const separator = navigateToPath.includes('?') ? '&' : '?';
        navigate(`${navigateToPath}${separator}q=${encodeURIComponent(searchValue)}`);
        return;
      }

      // Navigate to the appropriate search page
      if (isEducation) {
        navigate(`/education/search?q=${encodeURIComponent(searchValue)}`);
      } else {
        // Global search
        navigate(`/search?q=${encodeURIComponent(searchValue)}`);
      }
    }
  };

  const handleNavigateToSearch = () => {
    if (location.pathname.includes('/search')) return;
    if (navigateToPath) {
      navigate(navigateToPath);
      return;
    }
    if (isEducation) {
      navigate('/education/search');
      return;
    }
    navigate('/search');
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`px-4 py-2.5 ${className}`}>
      <div
        className={`relative ${isFocused ? `ring-2 ${accentRingClassName} rounded-2xl` : ''}`}
        onClick={clickToNavigate ? handleNavigateToSearch : undefined}
      >
        <Input
          type="text"
          value={value !== undefined ? value : searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          readOnly={clickToNavigate}
          className={`search-input pr-10 shadow-sm focus-visible:ring-2 ${inputBorderClassName} ${inputAccentClassName}`}
        />
        <Search 
          size={18} 
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer ${iconClassName}`} 
          onClick={clickToNavigate ? handleNavigateToSearch : handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;

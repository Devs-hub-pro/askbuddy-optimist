
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "搜索问题/达人/话题", 
  className = ""
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`px-4 py-4 ${className}`}>
      <div className="relative">
        <Input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-input pr-10 focus:ring-2 focus:ring-app-teal/30 shadow-md"
        />
        <Search 
          size={18} 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
      </div>
    </div>
  );
};

export default SearchBar;


import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "搜索问题/达人/话题", 
  value,
  onChange
}) => {
  const [searchValue, setSearchValue] = useState(value || '');
  
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : searchValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setSearchValue(e.target.value);
    }
    onChange && onChange(e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(currentValue);
  };

  return (
    <div className="px-4 py-3">
      <form 
        className="relative w-full"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-app-teal focus:ring-1 focus:ring-app-teal"
          placeholder={placeholder}
          value={currentValue}
          onChange={handleChange}
        />
        <button 
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          <Search size={18} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

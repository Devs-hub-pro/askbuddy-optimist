
import React from 'react';
import { Search, Users } from 'lucide-react';

const SearchBar: React.FC = () => {
  return (
    <div className="px-4 py-6 bg-app-light-bg animate-fade-in">
      <div className="flex items-center space-x-2 mb-4">
        <Users size={24} className="text-app-blue" />
        <h1 className="text-xl font-bold">找人问问</h1>
        <span className="text-gray-600 text-sm">AI无法回答的，人来回答！</span>
      </div>
      
      <div className="relative">
        <input
          type="text"
          placeholder="搜索问题/达人/话题"
          className="search-input pr-10"
        />
        <Search 
          size={20} 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
      </div>
    </div>
  );
};

export default SearchBar;

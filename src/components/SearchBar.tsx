
import React from 'react';
import { Search, Users, Sparkles } from 'lucide-react';

const SearchBar: React.FC = () => {
  return (
    <div className="px-4 py-6 bg-gradient-to-b from-app-teal/10 to-transparent animate-fade-in">
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex items-center gap-1">
          <Users size={20} className="text-app-blue" />
          <h1 className="text-lg font-bold">找人问问</h1>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full text-blue-600">
          <Sparkles size={12} />
          <span className="text-xs font-medium">AI无法回答的，人来回答！</span>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="text"
          placeholder="搜索问题/达人/话题"
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

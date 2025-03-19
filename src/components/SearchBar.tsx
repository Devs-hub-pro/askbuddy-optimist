
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, User, MessageSquare, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator
} from '@/components/ui/command';

interface SearchBarProps {
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  context?: 'global' | 'education';
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "搜索问题/达人/话题", 
  className = "",
  value,
  onChange,
  context = 'global'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSearchValue(value);
    }
  }, [value]);

  // Mock data - in a real app this would be fetched from API based on search query
  const experts = context === 'education' ? [
    {
      id: '1',
      name: '张同学',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      title: '北大硕士 | 出国党',
      keywords: ['留学', '文书', '面试']
    },
    {
      id: '2',
      name: '刘导师',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      title: '清华博士 | 考研规划',
      keywords: ['考研', '数学', '专业课']
    }
  ] : [
    {
      id: '1',
      name: '张同学',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      title: '北大硕士 | 出国党',
      keywords: ['留学', '文书', '面试']
    },
    {
      id: '2',
      name: '刘导师',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      title: '清华博士 | 考研规划',
      keywords: ['考研', '数学', '专业课']
    },
    {
      id: '3',
      name: '王老师',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: '高考志愿规划师',
      keywords: ['高考', '志愿填报', '专业选择']
    },
    {
      id: '4',
      name: '李医生',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      title: '三甲医院 | 心理咨询师',
      keywords: ['心理健康', '情绪管理', '压力舒缓']
    }
  ];

  const questions = context === 'education' ? [
    {
      id: '1',
      title: '如何有效管理考研复习时间？',
      tags: ['考研', '时间管理']
    },
    {
      id: '2',
      title: '美国本科留学需要准备哪些标化考试？',
      tags: ['留学', '标化考试']
    }
  ] : [
    {
      id: '1',
      title: '如何有效管理考研复习时间？',
      tags: ['考研', '时间管理']
    },
    {
      id: '2',
      title: '美国本科留学需要准备哪些标化考试？',
      tags: ['留学', '标化考试']
    },
    {
      id: '3',
      title: '初创公司如何找到第一批种子用户？',
      tags: ['创业', '用户增长']
    },
    {
      id: '4',
      title: '婴儿湿疹的居家护理方法有哪些？',
      tags: ['育儿', '医疗']
    }
  ];

  const popularTopics = [
    '考研备考', '留学申请', '高考志愿', '就业规划', '论文写作', 
    '职场晋升', '创业融资', '育儿经验', '心理健康'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    
    if (onChange) {
      onChange(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (searchValue.trim() === '') return;
    
    if (onSearch) {
      onSearch(searchValue);
      setIsOpen(false);
    } else {
      // Navigate to the appropriate search page
      const searchPath = context === 'education' 
        ? `/education/search?q=${encodeURIComponent(searchValue)}`
        : `/search?q=${encodeURIComponent(searchValue)}`;
      
      navigate(searchPath);
      setIsOpen(false);
    }
  };

  const handleExpertClick = (expertId: string) => {
    navigate(`/expert-profile/${expertId}`);
    setIsOpen(false);
  };

  const handleQuestionClick = (questionId: string) => {
    navigate(`/question/${questionId}`);
    setIsOpen(false);
  };

  const handleTopicClick = (topic: string) => {
    setSearchValue(topic);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className={`px-4 py-3 ${className}`}>
        <div className={`relative ${isFocused ? 'ring-2 ring-app-teal/30 rounded-md' : ''}`}>
          <Input
            ref={inputRef}
            type="text"
            value={value !== undefined ? value : searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput 
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder={placeholder}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
          {searchValue && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setSearchValue('')}
            >
              <X size={16} className="opacity-50" />
            </Button>
          )}
        </div>
        <CommandList>
          {searchValue ? (
            <>
              <CommandGroup heading="推荐回答者">
                {experts.filter(expert => {
                  const lowerQuery = searchValue.toLowerCase();
                  return expert.name.toLowerCase().includes(lowerQuery) || 
                    expert.title.toLowerCase().includes(lowerQuery) ||
                    expert.keywords.some(k => k.toLowerCase().includes(lowerQuery));
                }).map(expert => (
                  <CommandItem 
                    key={expert.id} 
                    onSelect={() => handleExpertClick(expert.id)}
                    className="py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={expert.avatar} />
                        <AvatarFallback>{expert.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{expert.name}</p>
                        <p className="text-xs text-green-600">{expert.title}</p>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <CommandSeparator />
              
              <CommandGroup heading="相关问题">
                {questions.filter(q => 
                  q.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                  q.tags.some(t => t.toLowerCase().includes(searchValue.toLowerCase()))
                ).map(question => (
                  <CommandItem 
                    key={question.id} 
                    onSelect={() => handleQuestionClick(question.id)}
                    className="py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <MessageSquare size={16} className="mr-2 text-gray-400" />
                      <div>
                        <p className="text-sm">{question.title}</p>
                        <div className="flex gap-1 mt-1">
                          {question.tags.map((tag, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup>
                <CommandItem 
                  onSelect={handleSearch}
                  className="py-2 cursor-pointer hover:bg-gray-100 justify-between"
                >
                  <div className="flex items-center">
                    <Search size={16} className="mr-2 text-gray-400" />
                    <span>搜索 "{searchValue}"</span>
                  </div>
                  <span className="text-xs text-gray-400">Enter</span>
                </CommandItem>
              </CommandGroup>
            </>
          ) : (
            <>
              <CommandEmpty>开始输入以搜索</CommandEmpty>
              <CommandGroup heading="热门话题">
                <div className="flex flex-wrap gap-2 p-2">
                  {popularTopics.map((topic, index) => (
                    <div 
                      key={index}
                      onClick={() => handleTopicClick(topic)}
                      className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full cursor-pointer transition-colors"
                    >
                      {topic}
                    </div>
                  ))}
                </div>
              </CommandGroup>
              
              <CommandSeparator />
              
              <CommandGroup heading="推荐回答者">
                {experts.slice(0, 3).map(expert => (
                  <CommandItem 
                    key={expert.id} 
                    onSelect={() => handleExpertClick(expert.id)}
                    className="py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={expert.avatar} />
                        <AvatarFallback>{expert.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{expert.name}</p>
                        <p className="text-xs text-green-600">{expert.title}</p>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;

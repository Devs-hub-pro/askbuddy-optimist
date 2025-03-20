
import React, { useState } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import BottomNav from '../components/BottomNav';

// Define event type
interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time?: string;
  category: 'education' | 'career' | 'lifestyle' | 'hobbies' | 'other';
  completed: boolean;
}

const CalendarPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Determine default category based on route
  const getDefaultCategory = () => {
    if (location.pathname.includes('education')) return 'education';
    if (location.pathname.includes('career')) return 'career'; 
    if (location.pathname.includes('lifestyle')) return 'lifestyle';
    if (location.pathname.includes('hobbies')) return 'hobbies';
    return 'other';
  };

  // Sample events data for demonstration
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: '雅思冲刺班',
      description: '雅思听力训练课程',
      date: new Date(),
      time: '14:00-16:00',
      category: 'education',
      completed: false
    },
    {
      id: '2',
      title: '考研英语词汇复习',
      description: '重点词汇复习',
      date: new Date(),
      time: '19:00-20:30',
      category: 'education',
      completed: false
    },
    {
      id: '3',
      title: '职业规划咨询',
      description: '与张老师的职业规划咨询',
      date: addDays(new Date(), 1),
      time: '10:00-11:00',
      category: 'career',
      completed: false
    },
    {
      id: '4',
      title: '简历优化',
      date: addDays(new Date(), 2),
      time: '14:00-15:00',
      category: 'career',
      completed: false
    },
    {
      id: '5',
      title: '瑜伽课程',
      date: addDays(new Date(), 1),
      time: '18:00-19:00',
      category: 'lifestyle',
      completed: false
    }
  ]);

  // Toggle event completion status
  const toggleEventCompletion = (id: string) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, completed: !event.completed } : event
    ));
  };

  // Filter events for the selected date
  const filteredEvents = events.filter(event => 
    isSameDay(event.date, selectedDate)
  );

  // Format date for display
  const formatDateHeader = (date: Date) => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    if (isSameDay(date, today)) {
      return '今天';
    } else if (isSameDay(date, tomorrow)) {
      return '明天';
    } else {
      return format(date, 'MM月dd日');
    }
  };

  // Get events for the next 7 days for the week view
  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(new Date(), i);
      const dayEvents = events.filter(event => isSameDay(event.date, day));
      days.push({
        date: day,
        events: dayEvents
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  // Get category style
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'education':
        return 'bg-blue-100 text-blue-800';
      case 'career':
        return 'bg-purple-100 text-purple-800';
      case 'lifestyle':
        return 'bg-green-100 text-green-800';
      case 'hobbies':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Navigate to previous/next day
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? addDays(selectedDate, -1) 
      : addDays(selectedDate, 1);
    setSelectedDate(newDate);
  };

  // Add new event (placeholder)
  const handleAddEvent = () => {
    toast({
      title: "添加日程",
      description: "此功能正在开发中"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-app-blue shadow-sm">
        <div className="pt-12 pb-3">
          <div className="flex justify-between items-center px-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2 text-white hover:bg-white/10"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={24} />
              </Button>
              <h1 className="text-xl font-medium text-white">日程安排</h1>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10"
              onClick={handleAddEvent}
            >
              <Plus size={24} />
            </Button>
          </div>
        </div>
      </div>

      {/* Date selector */}
      <div className="bg-white p-4 flex items-center justify-between sticky top-20 z-10 shadow-sm">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigateDate('prev')}
        >
          <ChevronLeft size={20} />
        </Button>
        
        <Popover open={showCalendar} onOpenChange={setShowCalendar}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2 font-medium text-lg"
            >
              <span>{formatDateHeader(selectedDate)}</span>
              <span className="text-gray-500 text-base">
                {format(selectedDate, 'EEEE')}
              </span>
              <CalendarIcon size={18} className="ml-1 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigateDate('next')}
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Week view */}
      <div className="p-4 bg-white mb-3">
        <h2 className="text-sm font-medium text-gray-500 mb-3">本周日程</h2>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {weekDays.map((day, index) => (
            <div 
              key={index}
              className={cn(
                "flex flex-col items-center min-w-[60px] p-2 rounded-lg cursor-pointer",
                isSameDay(day.date, selectedDate) 
                  ? "bg-app-blue text-white" 
                  : "bg-gray-100"
              )}
              onClick={() => setSelectedDate(day.date)}
            >
              <span className="text-xs">
                {format(day.date, 'EEE')}
              </span>
              <span className="font-medium mt-1">
                {format(day.date, 'd')}
              </span>
              {day.events.length > 0 && (
                <div className="mt-1 flex">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isSameDay(day.date, selectedDate) ? "bg-white" : "bg-app-blue"
                  )}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Events for selected date */}
      <div className="px-4">
        <h2 className="text-base font-medium mb-3">日程安排</h2>
        
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center">
            <CalendarIcon size={36} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">今天没有安排</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map(event => (
              <div 
                key={event.id}
                className={cn(
                  "bg-white rounded-lg p-4 border-l-4",
                  event.completed ? "border-gray-300" : `border-${event.category === 'education' ? 'blue' : event.category === 'career' ? 'purple' : event.category === 'lifestyle' ? 'green' : 'amber'}-500`
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={cn(
                      "font-medium",
                      event.completed ? "text-gray-500 line-through" : "text-gray-800"
                    )}>
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {event.description}
                      </p>
                    )}
                    {event.time && (
                      <p className="text-sm text-gray-500 mt-1">
                        {event.time}
                      </p>
                    )}
                  </div>
                  <div 
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      getCategoryStyle(event.category)
                    )}
                  >
                    {event.category === 'education' ? '教育' : 
                      event.category === 'career' ? '职业' : 
                      event.category === 'lifestyle' ? '生活' : 
                      event.category === 'hobbies' ? '兴趣' : '其他'}
                  </div>
                </div>
                <div className="mt-3 flex justify-between">
                  <button 
                    className={cn(
                      "text-sm",
                      event.completed ? "text-gray-500" : "text-app-blue"
                    )}
                    onClick={() => toggleEventCompletion(event.id)}
                  >
                    {event.completed ? "标记为未完成" : "标记为已完成"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default CalendarPage;

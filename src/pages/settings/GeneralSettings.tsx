
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';

const GeneralSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/profile')}
          className="mr-2"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">通用设置</h1>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center p-8 mt-20">
        <Settings size={64} className="text-gray-300 mb-4" />
        <p className="text-gray-500 mb-2">通用设置功能开发中</p>
      </div>

      <BottomNav />
    </div>
  );
};

export default GeneralSettings;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, DollarSign, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';

const MyEarnings = () => {
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
        <h1 className="text-xl font-semibold">我的收益</h1>
      </div>

      {/* Balance Card */}
      <div className="p-4 mt-2">
        <Card className="bg-gradient-to-r from-app-blue to-app-teal text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <Wallet className="mr-2" />
              <h2 className="text-lg font-semibold">我的钱包</h2>
            </div>
            <div className="flex items-end space-x-1 mb-3">
              <span className="text-3xl font-bold">¥0.00</span>
              <span className="text-white/70 mb-1">可提现</span>
            </div>
            <Button className="bg-white/20 hover:bg-white/30 border-none mt-2 w-full">
              提现到微信/支付宝
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Empty Transaction State */}
      <div className="flex flex-col items-center justify-center p-8 mt-10">
        <DollarSign size={64} className="text-gray-300 mb-4" />
        <p className="text-gray-500 mb-2">暂无收益记录</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/discover')}
          className="mt-2"
        >
          了解如何赚取收益
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default MyEarnings;

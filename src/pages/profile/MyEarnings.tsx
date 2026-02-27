
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { useMyEarnings } from '@/hooks/useProfileData';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const MyEarnings = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: transactions, isLoading } = useMyEarnings();

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch { return '刚刚'; }
  };

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="mr-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">我的收益</h1>
      </div>

      <div className="p-4 mt-2">
        <Card className="bg-gradient-to-r from-app-blue to-app-teal text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <Wallet className="mr-2" />
              <h2 className="text-lg font-semibold">我的积分</h2>
            </div>
            <div className="flex items-end space-x-1 mb-3">
              <span className="text-3xl font-bold">{profile?.points_balance || 0}</span>
              <span className="text-white/70 mb-1">积分</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : transactions && transactions.length > 0 ? (
        <div className="p-4 space-y-3">
          <h3 className="font-medium text-sm text-gray-600 mb-2">积分流水</h3>
          {transactions.map((tx: any) => (
            <div key={tx.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{tx.description || tx.type}</p>
                <p className="text-xs text-gray-400">{formatTime(tx.created_at)}</p>
              </div>
              <span className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 mt-10">
          <DollarSign size={64} className="text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">暂无积分记录</p>
          <Button variant="outline" onClick={() => navigate('/discover')} className="mt-2">
            了解如何赚取积分
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default MyEarnings;

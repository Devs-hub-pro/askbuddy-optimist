
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Wallet, Coins, TrendingUp, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useMyEarnings } from '@/hooks/useProfileData';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import SubPageHeader from '@/components/layout/SubPageHeader';
import PageStateCard from '@/components/common/PageStateCard';
import { buildFromState } from '@/utils/navigation';

interface PointsTransactionItem {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
}

const MyEarnings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const { data: transactions, isLoading, error, refetch } = useMyEarnings();

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch { return '刚刚'; }
  };

  const resolvedTransactions = (transactions || []) as PointsTransactionItem[];
  const positiveTransactions = resolvedTransactions.filter((tx) => tx.amount > 0);
  const monthlyIncome = positiveTransactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const totalRecords = transactions?.length || 0;

  return (
    <div className="pb-8 min-h-[100dvh] bg-slate-50">
      <SubPageHeader title="我的收益" />

      <div className="p-5 pt-4 space-y-4">
        <Card className="border-none bg-gradient-to-r from-[rgb(121,213,199)] to-[rgb(160,237,224)] text-white">
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <Wallet className="mr-2" />
              <h2 className="text-lg font-semibold">我的积分</h2>
            </div>
            <div className="flex items-end space-x-1 mb-3">
              <span className="text-3xl font-bold">{profile?.points_balance || 0}</span>
              <span className="text-white/70 mb-1">积分</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full"
              onClick={() => navigate('/profile/recharge', { state: buildFromState(location) })}
            >
              <Coins size={14} className="mr-1" />
              充值积分
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="surface-card rounded-3xl border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <TrendingUp size={16} />
                <span className="text-xs font-medium">累计入账</span>
              </div>
              <p className="mt-2 text-xl font-semibold text-slate-900">{monthlyIncome}</p>
              <p className="mt-1 text-xs text-slate-500">当前可用积分收益</p>
            </CardContent>
          </Card>
          <Card className="surface-card rounded-3xl border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sky-600">
                <Receipt size={16} />
                <span className="text-xs font-medium">流水笔数</span>
              </div>
              <p className="mt-2 text-xl font-semibold text-slate-900">{totalRecords}</p>
              <p className="mt-1 text-xs text-slate-500">最近收入与支出记录</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {isLoading ? (
        <div className="px-5 py-6">
          <PageStateCard variant="loading" compact title="正在加载积分流水…" />
        </div>
      ) : error ? (
        <div className="mx-5 mt-2">
          <PageStateCard
            compact
            variant="error"
            title="积分流水加载失败"
            description={error instanceof Error ? error.message : '请检查网络后重试'}
            actionLabel="重试"
            onAction={() => refetch()}
          />
        </div>
      ) : transactions && transactions.length > 0 ? (
        <div className="px-5 pb-5 space-y-3">
          <div className="px-1">
            <h3 className="text-sm font-medium text-slate-600">积分流水</h3>
            <p className="mt-1 text-xs text-slate-400">按时间倒序展示你的收入、奖励和扣费记录。</p>
          </div>
          {resolvedTransactions.map((tx) => (
            <div key={tx.id} className="surface-card rounded-3xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">{tx.description || tx.type}</p>
                <p className="text-xs text-slate-400">{formatTime(tx.created_at)}</p>
              </div>
              <span className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-5 mt-2">
          <PageStateCard
            compact
            title="暂无积分记录"
            description="你可以先去广场参与互动，或发布内容获取收益。"
            actionLabel="去发现页"
            onAction={() => navigate('/discover', { state: buildFromState(location) })}
          />
        </div>
      )}

    </div>
  );
};

export default MyEarnings;


import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock3, CheckCircle2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMyOrders } from '@/hooks/useProfileData';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import PageStateCard from '@/components/common/PageStateCard';
import { buildFromState } from '@/utils/navigation';

const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
  paid: {
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    text: "已支付",
    icon: <CheckCircle2 size={14} className="mr-1 text-emerald-500" />,
  },
  pending_payment: {
    color: "bg-amber-50 text-amber-600 border-amber-100",
    text: "待支付",
    icon: <Clock3 size={14} className="mr-1 text-amber-500" />,
  },
  in_service: {
    color: "bg-sky-50 text-sky-600 border-sky-100",
    text: "服务中",
    icon: <Clock3 size={14} className="mr-1 text-sky-500" />,
  },
  completed: {
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    text: "已完成",
    icon: <CheckCircle2 size={14} className="mr-1 text-emerald-500" />,
  },
  refunded: {
    color: "bg-violet-50 text-violet-600 border-violet-100",
    text: "已退款",
    icon: <CheckCircle2 size={14} className="mr-1 text-violet-500" />,
  },
  closed: {
    color: "bg-slate-100 text-slate-600 border-slate-200",
    text: "已关闭",
    icon: <Clock3 size={14} className="mr-1 text-slate-500" />,
  },
};

const tabs = [
  { key: "all", label: "全部" },
  { key: "pending_payment", label: "待支付" },
  { key: "paid", label: "已支付" },
];

interface OrderItem {
  id: string;
  buyer_id: string;
  seller_id: string | null;
  status: string;
  order_type: string;
  title?: string | null;
  amount: number;
  currency?: string | null;
  point_amount?: number | null;
  created_at: string;
}

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [tab, setTab] = useState<string>("all");
  const { data: orders, isLoading } = useMyOrders(tab);

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch { return '刚刚'; }
  };

  return (
    <div className="px-5 py-5">
      <div className="surface-card rounded-3xl p-1 shadow-sm">
        <div className="grid grid-cols-3 gap-1">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'app-soft-surface-bg app-accent-text'
                : 'text-muted-foreground hover:bg-muted/50'
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <PageStateCard variant="loading" compact title="正在加载订单…" className="w-full max-w-sm" />
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="mt-5 space-y-4">
          {(orders as OrderItem[]).map((order) => {
            const status = statusMap[order.status] || statusMap.pending_payment;
            const roleLabel = order.buyer_id === user?.id ? '我买的' : '我卖的';
            const orderTitle =
              order.title ||
              (order.order_type === 'question_reward'
                ? '付费提问'
                : order.order_type === 'points_recharge'
                  ? '积分充值'
                  : order.order_type === 'skill_service'
                    ? '技能服务'
                    : order.order_type === 'system_adjustment'
                      ? '系统调整'
                      : order.order_type);
            return (
              <Card key={order.id} className="surface-card rounded-3xl border-none shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-foreground">
                          {orderTitle}
                        </h3>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium bg-slate-50 text-slate-600 border-slate-100">
                          {roleLabel}
                        </span>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${status.color}`}>
                          {status.icon}
                          {status.text}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">订单创建于 {formatTime(order.created_at)}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-muted-foreground">订单金额</p>
                      <p className="mt-1 text-base font-semibold text-foreground">
                        {order.currency || 'CNY'} {Number(order.amount || 0).toFixed(2)}
                        {Number(order.point_amount || 0) > 0 && (
                          <span className="ml-1 text-xs text-muted-foreground">+ {order.point_amount} 积分</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-2xl bg-muted px-4 py-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">订单编号</p>
                      <p className="mt-1 text-xs text-foreground">{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-muted-foreground">支付方式</p>
                      <p className="mt-1 text-xs text-foreground">
                        {order.order_type === 'points_recharge' ? '积分充值' : '站内结算'}
                      </p>
                    </div>
                  </div>

                  {order.status === "pending_payment" ? (
                    <div className="mt-4 flex justify-end">
                      <Button
                        size="sm"
                        className="h-10 rounded-full px-4 text-sm font-medium shadow-sm"
                        onClick={() => {
                          if (order.order_type === 'points_recharge') {
                            navigate('/profile/recharge', { state: buildFromState(location) });
                            return;
                          }
                          window.alert('当前订单支付入口仍待接入');
                        }}
                      >
                        去支付
                        <ArrowRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-4 flex justify-end">
                      <span className="text-xs text-muted-foreground">订单已完成，可在记录中查看详情</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="mt-5">
          <PageStateCard
            title="还没有相关订单"
            description="后续提问、咨询或充值后，会在这里查看记录。"
            icon={<ShoppingCart size={56} className="mx-auto text-muted-foreground/30" />}
          />
        </div>
      )}
    </div>
  );
};

export default OrderList;

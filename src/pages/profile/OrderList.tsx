
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock3, CheckCircle2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMyOrders } from '@/hooks/useProfileData';
import { formatTime } from '@/utils/format';
import PageStateCard from '@/components/common/PageStateCard';

const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
  paid: {
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    text: "已支付",
    icon: <CheckCircle2 size={14} className="mr-1 text-emerald-500" />,
  },
  pending: {
    color: "bg-amber-50 text-amber-600 border-amber-100",
    text: "待支付",
    icon: <Clock3 size={14} className="mr-1 text-amber-500" />,
  },
};

const tabs = [
  { key: "all", label: "全部" },
  { key: "pending", label: "待支付" },
  { key: "paid", label: "已支付" },
];

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>("all");
  const { data: orders, isLoading } = useMyOrders(tab);


  return (
    <div className="px-5 py-5">
      <div className="surface-card rounded-3xl p-1 shadow-sm">
        <div className="grid grid-cols-3 gap-1">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-[rgb(236,251,247)] text-[rgb(73,170,155)]'
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
          {orders.map((order) => {
            const status = statusMap[order.status] || statusMap.pending;
            return (
              <Card key={order.id} className="surface-card rounded-3xl border-none shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-foreground">
                          {order.order_type === 'question'
                            ? '提问订单'
                            : order.order_type === 'recharge'
                              ? '积分充值'
                              : order.order_type}
                        </h3>
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
                        ￥{typeof (order as any).cash_amount === 'number' ? (order as any).cash_amount : order.amount}
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
                        {order.order_type === 'recharge' ? '积分充值' : '站内结算'}
                      </p>
                    </div>
                  </div>

                  {order.status === "pending" ? (
                    <div className="mt-4 flex justify-end">
                      <Button
                        size="sm"
                        className="h-10 rounded-full px-4 text-sm font-medium shadow-sm"
                        onClick={() => {
                          if (order.order_type === 'recharge') {
                            navigate('/profile/recharge');
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

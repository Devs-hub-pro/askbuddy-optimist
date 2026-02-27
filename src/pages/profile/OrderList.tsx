
import React, { useState } from 'react';
import { ArrowRight, Clock, CheckCircle, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMyOrders } from '@/hooks/useProfileData';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
  paid: {
    color: "bg-green-50 text-green-600 border-green-100",
    text: "已支付",
    icon: <CheckCircle size={15} className="mr-1 text-green-500" />,
  },
  pending: {
    color: "bg-orange-50 text-orange-600 border-orange-100",
    text: "待支付",
    icon: <Clock size={15} className="mr-1 text-orange-500" />,
  },
};

const tabs = [
  { key: "all", label: "全部" },
  { key: "pending", label: "待支付" },
  { key: "paid", label: "已支付" },
];

const OrderList: React.FC = () => {
  const [tab, setTab] = useState<string>("all");
  const { data: orders, isLoading } = useMyOrders(tab);

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch { return '刚刚'; }
  };

  return (
    <div className="max-w-lg mx-auto py-4">
      <div className="flex bg-white rounded-lg shadow overflow-hidden mb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`flex-1 py-3 font-medium text-sm
              ${tab === t.key ? 'text-app-blue border-b-2 border-app-blue bg-blue-50' : 'text-gray-500 bg-white'}
              transition`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4 px-4">
          {orders.map((order) => {
            const status = statusMap[order.status] || statusMap.pending;
            return (
              <div key={order.id} className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate mb-1 text-gray-900">
                    {order.order_type === 'question' ? '提问订单' : order.order_type}
                  </div>
                  <div className="text-xs text-gray-400">{formatTime(order.created_at)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center px-2.5 py-0.5 rounded-full border text-xs ${status.color}`}>
                    {status.icon}
                    {status.text}
                  </span>
                  <span className="text-app-blue text-xs ml-2">￥{order.amount}</span>
                </div>
                {order.status === "pending" && (
                  <Button
                    size="sm"
                    className="ml-4 bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-1 rounded-full text-white font-medium"
                    onClick={() => window.alert('跳转支付流程（待接入支付接口）')}
                  >
                    去支付 <ArrowRight size={14} className="ml-1" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-400 py-20">
          <ShoppingCart size={56} className="mb-3" />
          <div className="text-sm">暂无相关问题订单</div>
        </div>
      )}
    </div>
  );
};

export default OrderList;

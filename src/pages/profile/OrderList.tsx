
import React, { useState } from 'react';
import { Tag, ArrowRight, Clock, CheckCircle, XCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderItem {
  id: string;
  question: string;
  createdAt: string;
  status: "pending" | "paid";
  amount?: number;
}

const mockOrders: OrderItem[] = [
  {
    id: "1",
    question: "英国本科申请时间节点有哪些要注意的？",
    createdAt: "2024-06-01 13:22",
    status: "paid",
    amount: 58,
  },
  {
    id: "2",
    question: "如何准备雅思写作以达到7分？",
    createdAt: "2024-06-09 09:35",
    status: "pending",
    amount: 48,
  },
  {
    id: "3",
    question: "留学签证面试常见问题有哪些？",
    createdAt: "2024-05-26 19:12",
    status: "paid",
    amount: 68,
  },
];

const statusMap = {
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
  const [tab, setTab] = useState<"all" | "pending" | "paid">("all");

  const orders = tab === "all"
    ? mockOrders
    : mockOrders.filter(order => order.status === tab);

  return (
    <div className="max-w-lg mx-auto py-4">
      {/* Tab Bar */}
      <div className="flex bg-white rounded-lg shadow overflow-hidden mb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`flex-1 py-3 font-medium text-sm
              ${tab === t.key ? 'text-app-blue border-b-2 border-app-blue bg-blue-50' : 'text-gray-500 bg-white'}
              transition`}
            onClick={() => setTab(t.key as any)}
            aria-label={t.label}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Order List */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center text-gray-400 py-20">
          <ShoppingCart size={56} className="mb-3" />
          <div className="text-sm">暂无相关问题订单</div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
              {/* 问题内容和时间 */}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate mb-1 text-gray-900">{order.question}</div>
                <div className="text-xs text-gray-400">{order.createdAt}</div>
              </div>
              {/* 状态&金额 */}
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center px-2.5 py-0.5 rounded-full border text-xs ${statusMap[order.status].color}`}
                >
                  {statusMap[order.status].icon}
                  {statusMap[order.status].text}
                </span>
                {typeof order.amount === "number" &&
                  <span className="text-app-blue text-xs ml-2">￥{order.amount}</span>}
              </div>
              {/* 操作按钮 */}
              {order.status === "pending" && (
                <Button
                  size="sm"
                  className="ml-4 bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-1 rounded-full text-white font-medium"
                  aria-label="去支付"
                  onClick={() => window.alert('跳转支付流程（待接入支付接口）')}
                >
                  去支付 <ArrowRight size={14} className="ml-1" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;

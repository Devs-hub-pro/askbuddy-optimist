
import React from 'react';
import OrderList from './OrderList';
import SubPageHeader from '@/components/layout/SubPageHeader';

const MyOrders = () => {
  return (
    <div className="pb-8 min-h-[100dvh] bg-gray-50">
      <SubPageHeader title="我的提问订单" />

      {/* 内容主体 */}
      <OrderList />

    </div>
  );
};

export default MyOrders;

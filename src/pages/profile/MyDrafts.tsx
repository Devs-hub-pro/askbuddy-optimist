
import React from 'react';
import DraftList from './DraftList';
import SubPageHeader from '@/components/layout/SubPageHeader';

const MyDrafts = () => {
  return (
    <div className="pb-8 min-h-[100dvh] bg-slate-50">
      <SubPageHeader title="草稿箱" />

      {/* 草稿列表组件 */}
      <DraftList />

    </div>
  );
};

export default MyDrafts;

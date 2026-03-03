import React from 'react';

const ChannelQuestionSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="surface-card animate-pulse-soft rounded-2xl p-4 shadow-sm">
          <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
          <div className="mb-3 h-10 w-full rounded bg-gray-200" />
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div>
                <div className="h-3 w-20 rounded bg-gray-200" />
                <div className="mt-1 h-3 w-16 rounded bg-gray-200" />
              </div>
            </div>
            <div className="h-5 w-16 rounded-full bg-gray-200" />
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1">
              <div className="h-4 w-12 rounded-full bg-gray-200" />
              <div className="h-4 w-12 rounded-full bg-gray-200" />
            </div>
            <div className="h-6 w-16 rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChannelQuestionSkeleton;

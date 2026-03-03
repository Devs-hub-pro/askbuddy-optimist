import React from 'react';

const ChannelExpertSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="surface-card animate-pulse-soft rounded-2xl p-3 shadow-sm">
          <div className="mb-2 flex items-center">
            <div className="mr-2 h-10 w-10 rounded-full bg-gray-200" />
            <div>
              <div className="mb-1 h-3 w-16 rounded bg-gray-200" />
              <div className="h-2 w-24 rounded bg-gray-200" />
            </div>
          </div>
          <div className="h-10 w-full rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
};

export default ChannelExpertSkeleton;

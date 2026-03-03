import React from 'react';
import { Sparkles } from 'lucide-react';

const BrandSplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[120] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(223,245,239,0.95),_rgba(255,255,255,0.98)_58%)]">
      <div className="absolute inset-x-0 top-0 h-52 bg-[linear-gradient(180deg,rgba(121,213,199,0.28),rgba(121,213,199,0))]" />
      <div className="relative flex flex-col items-center px-8 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[rgb(121,213,199)] text-white shadow-[0_14px_30px_rgba(121,213,199,0.28)]">
          <Sparkles size={34} />
        </div>
        <h1 className="text-2xl font-semibold tracking-[0.08em] text-slate-900">问问</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">让提问、交流和咨询更直接</p>
      </div>
    </div>
  );
};

export default BrandSplashScreen;

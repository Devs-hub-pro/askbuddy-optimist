import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navigateBackOr } from '@/utils/navigation';
import { isNativeApp } from '@/utils/platform';

interface SubPageHeaderProps {
  title: string;
  right?: React.ReactNode;
  onBack?: () => void;
  headerClassName?: string;
}

const SubPageHeader: React.FC<SubPageHeaderProps> = ({ title, right, onBack, headerClassName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const nativeMode = isNativeApp();

  return (
    <>
      <div
        className={`fixed top-0 z-[90] w-full border-b border-white/20 app-header-bg text-white shadow-sm ${nativeMode ? 'left-0' : 'left-1/2 max-w-md -translate-x-1/2'} ${headerClassName || ''}`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex h-12 items-center justify-between px-4">
          <div className="flex min-w-0 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack || (() => navigateBackOr(navigate, '/', { location }))}
              className="mr-2 shrink-0 text-white hover:bg-white/15 hover:text-white"
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="truncate text-lg font-semibold">{title}</h1>
          </div>
          {right ? <div className="ml-3 shrink-0">{right}</div> : <div className="w-10 shrink-0" />}
        </div>
      </div>
      <div aria-hidden style={{ height: 'calc(env(safe-area-inset-top) + 3rem)' }} />
    </>
  );
};

export default SubPageHeader;

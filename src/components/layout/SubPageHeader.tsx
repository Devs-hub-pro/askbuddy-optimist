import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navigateBackOr } from '@/utils/navigation';

interface SubPageHeaderProps {
  title: string;
  right?: React.ReactNode;
  onBack?: () => void;
  headerClassName?: string;
}

const SubPageHeader: React.FC<SubPageHeaderProps> = ({ title, right, onBack, headerClassName }) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`fixed left-1/2 top-0 z-[90] w-full max-w-md -translate-x-1/2 border-b border-white/20 app-header-bg text-white shadow-sm ${headerClassName || ''}`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex min-w-0 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack || (() => navigateBackOr(navigate, '/'))}
              className="mr-2 shrink-0 text-white hover:bg-white/15 hover:text-white"
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="truncate text-lg font-semibold">{title}</h1>
          </div>
          {right ? <div className="ml-3 shrink-0">{right}</div> : <div className="w-10 shrink-0" />}
        </div>
      </div>
      <div aria-hidden style={{ height: 'calc(env(safe-area-inset-top) + 4.25rem)' }} />
    </>
  );
};

export default SubPageHeader;

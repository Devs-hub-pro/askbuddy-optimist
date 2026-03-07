import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navigateBackOr } from '@/utils/navigation';

interface SubPageHeaderProps {
  title: string;
  right?: React.ReactNode;
  onBack?: () => void;
}

const SubPageHeader: React.FC<SubPageHeaderProps> = ({ title, right, onBack }) => {
  const navigate = useNavigate();
<<<<<<< HEAD
  const handleBack = onBack || (() => navigateBackOr(navigate, '/'));

  return (
    <div
      className="sticky top-0 z-20 border-b border-white/20 bg-[rgb(121,213,199)] text-white"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex min-w-0 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-2 shrink-0 text-white hover:bg-white/15 hover:text-white"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="truncate text-lg font-semibold">{title}</h1>
        </div>
        {right ? <div className="ml-3 shrink-0">{right}</div> : <div className="w-10 shrink-0" />}
      </div>
    </div>
=======

  return (
    <>
      <div
        className="fixed left-1/2 top-0 z-[90] w-full max-w-md -translate-x-1/2 border-b border-white/20 bg-[rgb(121,213,199)] text-white shadow-sm"
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
>>>>>>> a04765d (Update from local working directory)
  );
};

export default SubPageHeader;

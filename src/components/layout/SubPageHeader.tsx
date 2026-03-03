import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubPageHeaderProps {
  title: string;
  right?: React.ReactNode;
  onBack?: () => void;
}

const SubPageHeader: React.FC<SubPageHeaderProps> = ({ title, right, onBack }) => {
  const navigate = useNavigate();

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
            onClick={onBack || (() => navigate(-1))}
            className="mr-2 shrink-0 text-white hover:bg-white/15 hover:text-white"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="truncate text-xl font-semibold">{title}</h1>
        </div>
        {right ? <div className="ml-3 shrink-0">{right}</div> : <div className="w-10 shrink-0" />}
      </div>
    </div>
  );
};

export default SubPageHeader;

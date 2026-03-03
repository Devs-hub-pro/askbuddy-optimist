import React from 'react';
import { Clock3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SubPageHeader from '@/components/layout/SubPageHeader';

interface SettingsPlaceholderPageProps {
  title: string;
  description: string;
}

const SettingsPlaceholderPage: React.FC<SettingsPlaceholderPageProps> = ({ title, description }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SubPageHeader title={title} />
      <div className="p-4">
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(223,245,239)]">
              <Clock3 className="h-7 w-7 text-[rgb(121,213,199)]" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPlaceholderPage;

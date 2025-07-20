import React from 'react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t('footer.copyright')}
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            {t('footer.builtWith')}
          </p>
        </div>
      </div>
    </footer>
  );
}; 
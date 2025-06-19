'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import {Locale} from '@/i18n/config'
import {setUserLocale} from '@/i18n/cookies';

export function LanguageSelector() {
  const t = useTranslations();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      setUserLocale(newLocale as Locale)
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('header.language')}>
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleLocaleChange('en')}
          className={locale === 'en' ? 'bg-accent' : ''}
        >
          {t('languageSelector.en')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLocaleChange('vi')}
          className={locale === 'vi' ? 'bg-accent' : ''}
        >
          {t('languageSelector.vi')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
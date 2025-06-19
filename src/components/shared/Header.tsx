'use client';

import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/shared/LanguageSelector';
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold">CS Skins</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">{t('header.home')}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/admin">{t('header.admin')}</Link>
          </Button>
          <LanguageSelector />
        </nav>
      </div>
    </header>
  );
}

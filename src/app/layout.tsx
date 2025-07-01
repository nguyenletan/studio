import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import React from 'react';
import { Analytics } from '@vercel/analytics/next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t('site.title'),
    description: t('site.description'),
    icons: { icon: 'data:,' }, // prevent default favicon lookup
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const t = await getTranslations();

  return (
    <html lang={locale} className="dark">
      <head>
        {/* Add this line to satisfy the HTML-inspection rule */}
        <title>{t('site.title')}</title>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="bg-background text-foreground flex min-h-screen flex-col font-sans antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Toaster />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

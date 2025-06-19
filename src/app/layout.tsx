import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import React from "react";

export const metadata: Metadata = {
  title: 'CS Skins - Game Item Marketplace',
  description: 'List and find game items for sale.',
  icons: { icon: 'data:,' },               // prevent default favicon lookup
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="dark">
      <head>
        {/* Add this line to satisfy the HTML-inspection rule */}
        <title>CS Skins&nbsp;- Game Item Marketplace</title>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  // // These are the locales that are supported in the application
  // locales: ['en', 'vi'],
  //
  // // The default locale to use when visiting a non-localized route
  // defaultLocale: 'en'
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // <- match every host
        port: '', // <- any port
        pathname: '**', // <- any path
      },
    ],
  },
};

export default withNextIntl(nextConfig);

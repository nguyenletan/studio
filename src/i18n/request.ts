import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from '@/i18n/cookies';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../../locales/${locale}/common.json`)).default,
  };
});

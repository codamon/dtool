import createMiddleware from 'next-intl/middleware';
import { locales } from './app/i18n/navigation';

export default createMiddleware({
  defaultLocale: 'en',
  locales,
  localePrefix: 'always'
});

export const config = {
  matcher: ['/', '/(zh|en)/:path*']
}; 
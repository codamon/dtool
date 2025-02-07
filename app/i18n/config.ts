export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale = 'en' as const;

export function getSystemLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  const systemLocale = navigator.language.split('-')[0];
  return locales.includes(systemLocale as Locale) ? systemLocale as Locale : defaultLocale;
} 
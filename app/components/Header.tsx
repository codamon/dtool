'use client';
import { useTranslations } from 'next-intl';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  const t = useTranslations('header');

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-bold">{t('title')}</div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <a href="https://github.com" className="text-gray-600 hover:text-gray-900">
              {t('github')}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
} 
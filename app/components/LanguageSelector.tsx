'use client';
import { useRouter } from '../i18n/navigation';
import { useLocale } from 'next-intl';
import { locales, type Locale } from '../i18n/navigation';
import { usePathname } from '../i18n/navigation';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function LanguageSelector() {
  const router = useRouter();
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg 
                 text-gray-700 dark:text-gray-200 
                 hover:bg-gray-100 dark:hover:bg-gray-800 
                 transition-colors duration-200"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {currentLocale === 'en' ? 'English' : '中文'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg 
                      bg-white dark:bg-gray-800 
                      ring-1 ring-black ring-opacity-5 
                      dark:ring-gray-700">
          <div className="py-1">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                className={`w-full text-left px-4 py-2 text-sm
                          ${currentLocale === locale ? 
                            'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 
                            'text-gray-700 dark:text-gray-200'} 
                          hover:bg-gray-100 dark:hover:bg-gray-700
                          transition-colors duration-200`}
              >
                {locale === 'en' ? (
                  <div className="flex items-center gap-2">
                    <span>🇺🇸</span>
                    <span>English</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>🇨🇳</span>
                    <span>中文</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    loadTranslations(locale);
  }, [locale]);

  const loadTranslations = async (loc: Locale) => {
    try {
      const data = await import(`./translations/${loc}.json`);
      setTranslations(data.default || data);
    } catch (error) {
      console.error(`Failed to load translations for ${loc}:`, error);
      if (loc !== 'en') {
        loadTranslations('en'); // Fallback to English
      }
    }
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      document.documentElement.lang = newLocale;
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}


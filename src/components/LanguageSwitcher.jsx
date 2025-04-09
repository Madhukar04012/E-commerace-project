import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLang = i18n.language;
  
  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    es: { name: 'Español', flag: '🇪🇸' },
    fr: { name: 'Français', flag: '🇫🇷' }
  };
  
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 focus:outline-none"
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <span className="text-xl">{languages[currentLang]?.flag || '🌐'}</span>
        <span className="hidden md:inline">{languages[currentLang]?.name || 'Language'}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {Object.keys(languages).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`${
                  currentLang === lang ? 'bg-gray-100 text-blue-600' : 'text-gray-700'
                } group flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100`}
                role="menuitem"
              >
                <span className="mr-2 text-xl">{languages[lang].flag}</span>
                {languages[lang].name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
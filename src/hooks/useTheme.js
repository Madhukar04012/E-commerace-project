import { useState, useEffect } from 'react';

/**
 * Custom hook to manage theme switching
 * @param {string} defaultTheme - Default theme to use ('light' or 'dark')
 * @returns {Object} Theme management functions and current theme
 */
export const useTheme = (defaultTheme = 'light') => {
  // Use the saved theme from localStorage or default to user's preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check user preference from system
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return defaultTheme;
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  // Set theme in localStorage and update document
  const applyTheme = (newTheme) => {
    const root = window.document.documentElement;
    
    // Remove old theme and add new theme
    const oldTheme = newTheme === 'dark' ? 'light' : 'dark';
    root.classList.remove(oldTheme);
    root.classList.add(newTheme);
    
    // Update data-theme attribute for custom styling
    root.setAttribute('data-theme', newTheme);
    
    // Store the theme preference in localStorage
    localStorage.setItem('theme', newTheme);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Set specific theme
  const setSpecificTheme = (newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') {
      console.error('Theme must be either "light" or "dark"');
      return;
    }
    
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Apply the theme when the component mounts
  useEffect(() => {
    setMounted(true);
    applyTheme(theme);
  }, [theme]);

  // Detect system theme changes
  useEffect(() => {
    if (!mounted) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  return {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
};

export default useTheme; 
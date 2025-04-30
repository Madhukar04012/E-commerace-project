import React from 'react';
import { motion } from 'framer-motion';
import useTheme from '../hooks/useTheme';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`inline-flex items-center justify-center p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className} ${isDark ? 'bg-gray-800 bg-opacity-50' : ''}`}
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      {isDark ? (
        // Sun icon for dark mode
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-yellow-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ 
            filter: "drop-shadow(0 0 8px rgba(253, 224, 71, 0.7))",
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </motion.svg>
      ) : (
        // Moon icon for light mode
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ rotate: 90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </motion.svg>
      )}
    </motion.button>
  );
};

export default ThemeToggle; 
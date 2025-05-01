import { useContext } from 'react';
import SearchContext from '../context/SearchContext';

/**
 * Custom hook to access search functionality and filtered products
 * @returns {Object} Search context information
 */
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export default useSearch; 
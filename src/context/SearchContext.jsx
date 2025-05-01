import { createContext, useState, useCallback, useEffect } from "react";
import Fuse from "fuse.js";

// Create the context
const SearchContext = createContext(null);

export function SearchProvider({ children, products = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    rating: 0,
    category: "",
    inStock: false,
  });
  const [error, setError] = useState(null);

  // Initialize Fuse.js for fuzzy search
  const fuse = useCallback(() => {
    try {
      return new Fuse(products, {
        keys: ["name", "description", "category"],
        threshold: 0.3,
        includeScore: true,
      });
    } catch (err) {
      console.error("Error initializing Fuse:", err);
      setError("Error initializing search functionality");
      return null;
    }
  }, [products]);

  // Update filtered products when products change
  useEffect(() => {
    try {
      setFilteredProducts(products);
      setError(null);
    } catch (err) {
      console.error("Error setting initial products:", err);
      setError("Error loading products");
    }
  }, [products]);

  // Debounced search function
  const searchProducts = useCallback(
    (query) => {
      try {
        if (!query) {
          setFilteredProducts(products);
          return;
        }

        const searchInstance = fuse();
        if (!searchInstance) return;

        const results = searchInstance.search(query);
        setFilteredProducts(results.map((result) => result.item));
        setError(null);
      } catch (err) {
        console.error("Error searching products:", err);
        setError("Error searching products");
      }
    },
    [products, fuse]
  );

  // Apply filters
  const applyFilters = useCallback(
    (newFilters) => {
      try {
        setFilters(newFilters);
        let filtered = [...products];

        // Apply search if there's a query
        if (searchQuery) {
          const searchInstance = fuse();
          if (searchInstance) {
            const searchResults = searchInstance.search(searchQuery);
            filtered = searchResults.map((result) => result.item);
          }
        }

        // Apply price range filter
        filtered = filtered.filter(
          (product) => {
            const price = Number(product.price) || 0;
            return price >= newFilters.priceRange[0] && price <= newFilters.priceRange[1];
          }
        );

        // Apply rating filter
        if (newFilters.rating > 0) {
          filtered = filtered.filter(
            (product) => {
              const rating = product.ratings?.average || product.rating || 0;
              return rating >= newFilters.rating;
            }
          );
        }

        // Apply category filter
        if (newFilters.category) {
          filtered = filtered.filter(
            (product) => product.category === newFilters.category
          );
        }

        // Apply stock filter
        if (newFilters.inStock) {
          filtered = filtered.filter((product) => {
            const stock = product.stock !== undefined ? product.stock : (product.inStock ? 1 : 0);
            return stock > 0;
          });
        }

        setFilteredProducts(filtered);
        setError(null);
      } catch (err) {
        console.error("Error applying filters:", err);
        setError("Error applying filters");
      }
    },
    [products, searchQuery, fuse]
  );

  const value = {
    searchQuery,
    setSearchQuery,
    filteredProducts,
    filters,
    applyFilters,
    searchProducts,
    error
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export default SearchContext; 
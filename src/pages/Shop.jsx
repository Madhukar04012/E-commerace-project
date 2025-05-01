import React, { useState, useEffect } from "react";
import { useSearch } from "../hooks/useSearch";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { useInView } from "react-intersection-observer";

export default function Shop() {
  const { filteredProducts, error } = useSearch();
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const productsPerPage = 12;
  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Load more products when reaching the bottom
  useEffect(() => {
    if (inView && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, loading]);

  // Update displayed products when filtered products or page changes
  useEffect(() => {
    try {
      setLoading(true);
      const newProducts = filteredProducts.slice(0, page * productsPerPage);
      setDisplayedProducts(newProducts);
    } catch (err) {
      console.error("Error updating displayed products:", err);
    } finally {
      setLoading(false);
    }
  }, [filteredProducts, page]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="md:col-span-1">
          <ProductFilters />
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          {!loading && displayedProducts.length < filteredProducts.length && (
            <div
              ref={ref}
              className="h-20 flex items-center justify-center"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* No Results Message */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
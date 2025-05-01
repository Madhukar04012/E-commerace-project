import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useInView } from "react-intersection-observer";
import mockProducts from "../data/mockProducts";
import { Link } from "react-router-dom";

export default function Fitness() {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const productsPerPage = 12;
  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Filter products by Fitness category
  useEffect(() => {
    try {
      const fitnessProducts = mockProducts.filter(
        (product) => product.category === "Fitness"
      );
      setProducts(fitnessProducts);
    } catch (err) {
      console.error("Error filtering fitness products:", err);
    }
  }, []);

  // Load more products when reaching the bottom
  useEffect(() => {
    if (inView && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, loading]);

  // Update displayed products when page changes
  useEffect(() => {
    try {
      setLoading(true);
      const newProducts = products.slice(0, page * productsPerPage);
      setDisplayedProducts(newProducts);
    } catch (err) {
      console.error("Error updating displayed products:", err);
    } finally {
      setLoading(false);
    }
  }, [products, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link to="/shop" className="text-blue-600 hover:underline mr-2">
          Shop
        </Link>
        <span className="text-gray-500 mx-2">/</span>
        <h1 className="text-3xl font-bold">Fitness</h1>
      </div>

      <div className="mb-8">
        <p className="text-gray-600">
          Achieve your fitness goals with our premium exercise equipment and accessories.
          From yoga mats to adjustable dumbbell sets, we have everything you need for your workout routine.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      {!loading && displayedProducts.length < products.length && (
        <div ref={ref} className="h-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* No Results Message */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No fitness products found
          </h3>
          <p className="text-gray-500">
            We're currently updating our fitness selection. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
} 
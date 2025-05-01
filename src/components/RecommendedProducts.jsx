import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import mockProducts from '../data/mockProducts';

const RecommendedProducts = () => {
  // Add "top rated" flag to products with rating >= 4.7
  const productsWithFlags = mockProducts.map(product => ({
    ...product,
    isTopRated: product.rating >= 4.7
  }));
  
  // Sort by rating (highest first) and limit to 8
  const recommendedProducts = productsWithFlags
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Recommended For You</h2>
          <Link to="/shop" className="text-blue-600 hover:underline flex items-center">
            View All
            <svg className="w-4 h-4 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        <p className="text-gray-600">Based on your browsing history and top-rated items</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map(product => (
          <div key={product.id} className="relative">
            {product.isTopRated && (
              <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                🔥 Top Rated
              </div>
            )}
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts; 
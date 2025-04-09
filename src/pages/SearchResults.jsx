import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset loading state when query changes
    setLoading(true);
    
    // Simulate API delay for realism
    const timer = setTimeout(() => {
      if (query) {
        const searchTerms = query.toLowerCase().split(' ');
        const filtered = products.filter(product => {
          const nameMatch = searchTerms.some(term => 
            product.name.toLowerCase().includes(term)
          );
          
          const descriptionMatch = searchTerms.some(term => 
            product.description.toLowerCase().includes(term)
          );
          
          const categoryMatch = searchTerms.some(term => 
            product.category.toLowerCase().includes(term)
          );
          
          return nameMatch || descriptionMatch || categoryMatch;
        });
        
        setResults(filtered);
      } else {
        setResults([]);
      }
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-center">
        {query ? `Search results for "${query}"` : 'All Products'}
      </h1>
      
      <p className="text-gray-600 text-center mb-8">
        {results.length} {results.length === 1 ? 'product' : 'products'} found
      </p>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
} 
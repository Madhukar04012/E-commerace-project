import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import StarRating from './StarRating';
import { handleImageError } from "../utils/imageFallback";

export default function RelatedProducts({ currentProductId, category, limit = 4 }) {
  // Find related products (same category but not the current product)
  const relatedProducts = products
    .filter(product => 
      product.category === category && 
      product.id !== currentProductId
    )
    .slice(0, limit);
    
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-gray-200 pt-10">
      <h2 className="text-2xl font-bold mb-6">You might also like</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map(product => (
          <Link key={product.id} to={`/product/${product.id}`} className="block">
            <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-40 object-cover"
                onError={handleImageError}
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                
                {product.ratings && (
                  <div className="mb-2">
                    <StarRating rating={product.ratings.average} size="sm" />
                  </div>
                )}
                
                <div className="font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 
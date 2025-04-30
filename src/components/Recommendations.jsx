import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import mockProducts from "../data/mockProducts";
import { handleImageError } from "../utils/imageFallback";

const Recommendations = () => {
  // Mock personalization logic: 
  // 1. Include high-rated products (rating > 4.5)
  // 2. Include electronics products
  // 3. Mix in some other categories for variety
  // 4. Limit to 8 products
  const getRecommendedProducts = () => {
    const highRatedProducts = mockProducts.filter(product => product.rating >= 4.5);
    const electronicsProducts = mockProducts.filter(product => product.category === 'Electronics');
    
    // Combine the products, remove duplicates, and limit to 8
    const combined = [...highRatedProducts, ...electronicsProducts];
    const uniqueProducts = Array.from(new Map(combined.map(item => [item.id, item])).values());
    return uniqueProducts.slice(0, 8);
  };

  const recommendedProducts = getRecommendedProducts();

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Recommended For You</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Based on your browsing history and top-rated items</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {recommendedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Link to={`/product/${product.id}`} className="block h-full">
                <div className="relative overflow-hidden h-48">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    onError={handleImageError}
                  />
                  
                  {/* Conditional badges */}
                  {product.rating >= 4.7 && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 text-xs font-bold rounded-full flex items-center">
                      <span className="mr-1">🔥</span> Top Rated
                    </div>
                  )}
                  
                  {product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                      New Arrival
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</span>
                    
                    {/* Show stars based on rating */}
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">({product.numReviews || 0})</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  
                  <div className="mt-4">
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-10 text-center">
          <Link 
            to="/shop" 
            className="inline-block bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View All Recommendations
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Recommendations; 
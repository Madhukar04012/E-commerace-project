import React from 'react';
import { useCart } from '../context/CartContext';

export default function WishlistButton({ product, className = "" }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = (e) => {
    e.preventDefault(); // Prevent navigation if inside a link
    e.stopPropagation(); // Prevent event bubbling
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <button 
      onClick={toggleWishlist}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`transition-all duration-300 focus:outline-none ${className}`}
    >
      {isWishlisted ? (
        <svg 
          className="w-6 h-6 text-red-500 fill-current" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg 
          className="w-6 h-6 text-gray-400 hover:text-red-500" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      )}
    </button>
  );
} 
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import StarRating from '../components/StarRating';
import { handleImageError } from "../utils/imageFallback";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, moveToCart, moveAllToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Wishlist</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Your wishlist is empty</h2>
          <p className="mt-2 text-gray-600">
            Add items to your wishlist to keep track of products you're interested in.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Wishlist</h1>
        {wishlistItems.length > 0 && (
          <button
            onClick={moveAllToCart}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Add All to Cart
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row"
          >
            <div className="md:w-1/4 mb-4 md:mb-0">
              <Link to={`/product/${item.id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-contain rounded-md"
                  onError={handleImageError}
                />
              </Link>
            </div>
            <div className="md:w-3/4 md:pl-6 flex flex-col justify-between">
              <div>
                <Link to={`/product/${item.id}`} className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                  {item.name}
                </Link>
                
                {item.ratings && (
                  <div className="mt-1">
                    <StarRating rating={item.ratings.average} count={item.ratings.count} />
                  </div>
                )}
                
                <p className="mt-2 text-gray-700">{item.description}</p>
                <div className="mt-2 text-xl font-bold text-blue-600">${item.price.toFixed(2)}</div>
              </div>
              
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => moveToCart(item.id)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
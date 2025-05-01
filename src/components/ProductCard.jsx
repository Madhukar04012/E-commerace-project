// src/components/ProductCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import StarRating from "./StarRating";

export default function ProductCard({ product }) {
  const { addToCart, addToWishlist } = useCart();
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
    return null;
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };

  // Get all possible image sources for the product
  const getProductImages = () => {
    const productId = product.id.toString();
    const mainImage = product.image || "";
    // Path to the AI-generated image
    const aiGeneratedImage = `/images/products/${productId}.jpg`;
    // Path to SVG placeholder
    const placeholderImage = `/images/products/placeholders/${productId}.svg`;
    
    return [mainImage, aiGeneratedImage, placeholderImage];
  };

  // Get initials from the product name for fallback image
  const getInitials = () => {
    return product.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Generate a fallback SVG image with product initials
  const generateFallbackSVG = () => {
    const initials = getInitials();
    const hue = parseInt(product.id, 10) % 360;
    const color = `hsl(${hue}, 70%, 65%)`;
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='${encodeURIComponent(color)}'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='120' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${initials}%3C/text%3E%3C/svg%3E`;
  };

  // Handle image error by trying next image in sequence
  const handleImageError = (e) => {
    e.target.onerror = null;
    const images = getProductImages();
    
    // If there are more images to try
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      e.target.src = images[currentImageIndex + 1];
    } else {
      // If all images fail, use SVG fallback
      e.target.src = generateFallbackSVG();
      setImageError(true);
    }
  };

  // Safely get product properties with fallbacks
  const rating = product.ratings?.average || product.rating || 0;
  const reviewCount = product.ratings?.count || product.numReviews || 0;
  const price = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice) || (product.discount ? price / (1 - product.discount / 100) : 0);
  const imageToUse = getProductImages()[currentImageIndex];
  const name = product.name || "Unnamed Product";
  const description = product.description || "No description available";
  const category = product.category || "Uncategorized";
  const brand = product.brand || "Unknown";
  const hasDiscount = originalPrice > price;
  const inStock = product.stock > 0 || product.inStock === true;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="relative block h-48 overflow-hidden">
        <img
          src={imageToUse}
          alt={name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={handleAddToWishlist}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
            title="Add to Wishlist"
          >
            <svg
              className="w-5 h-5 text-gray-700"
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
          </button>
        </div>
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {Math.round((1 - price / originalPrice) * 100)}% OFF
          </div>
        )}
        
        {/* Top Rated Badge */}
        {product.isTopRated && (
          <div className="absolute bottom-2 left-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
            ⭐ Top Rated
          </div>
        )}
      </Link>
      
      {/* Product Details */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          {/* Category & Brand Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
              {category}
            </span>
            {brand !== "Unknown" && (
              <span className="text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-0.5">
                {brand}
              </span>
            )}
          </div>
          
          {/* Product Name */}
          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
              {name}
            </h3>
          </Link>
          
          {/* Description */}
          <p className="text-gray-600 mb-4 text-sm line-clamp-2">{description}</p>
          
          {/* Rating */}
          <div className="mb-2">
            <StarRating rating={rating} count={reviewCount} size="sm" />
          </div>
        </div>
        
        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-baseline mb-2">
            <span className="text-blue-600 font-bold text-lg">${price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="ml-2 text-gray-500 text-sm line-through">${originalPrice.toFixed(2)}</span>
            )}
          </div>
          
          {/* Stock Status */}
          {!inStock && (
            <div className="mb-2">
              <span className="text-red-500 text-sm font-medium">Out of Stock</span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                inStock 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } transition-colors`}
            >
              Add to Cart
            </button>
            <Link 
              to={`/product/${product.id}`}
              className="py-2 px-3 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
  
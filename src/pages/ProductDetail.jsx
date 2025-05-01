import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useReview } from "../hooks/useReview";
import mockProducts from "../data/mockProducts";
import StarRating from "../components/StarRating";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity, isInWishlist, addToWishlist, removeFromWishlist } = useCart();
  const { reviews, loadReviews, getAverageRating } = useReview();
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Find the product by ID from our data
  useEffect(() => {
    try {
      setLoading(true);
      const foundProduct = mockProducts.find(p => p.id === id || p.id.toString() === id);
      
      if (foundProduct) {
        setProductData(foundProduct);
        
        // Check if this product is in cart already, set initial quantity
        const cartItem = cartItems.find(item => item.id === id);
        if (cartItem) {
          setQuantity(cartItem.quantity);
        }

        // Load reviews for this product
        loadReviews(foundProduct.id.toString());
      } else {
        // If no product found, set error
        setError("Product not found");
        // Optionally navigate away after a delay
        setTimeout(() => navigate("/shop"), 3000);
      }
    } catch (err) {
      console.error("Error loading product:", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  }, [id, navigate, cartItems, loadReviews]);
  
  // Simulated multiple product images
  const getProductImages = () => {
    if (!productData) return [];
    
    // Check if AI-generated image exists
    const productId = productData.id.toString();
    const mainImage = productData.image;
    const aiGeneratedImage = `/images/products/${productId}.jpg`;
    const placeholderImage = `/images/products/placeholders/${productId}.svg`;
    
    // Return array with main image and variations
    // In a real app, there would be multiple unique images per product
    return [
      mainImage,
      aiGeneratedImage,
      placeholderImage
    ];
  };

  // Calculate estimated delivery date (5-7 days from now)
  const getEstimatedDelivery = () => {
    const today = new Date();
    const minDelivery = new Date(today);
    minDelivery.setDate(today.getDate() + 5);
    
    const maxDelivery = new Date(today);
    maxDelivery.setDate(today.getDate() + 7);
    
    const options = { month: 'short', day: 'numeric' };
    return `${minDelivery.toLocaleDateString('en-US', options)} - ${maxDelivery.toLocaleDateString('en-US', options)}`;
  };
  
  // Handle mouse move on image for zoom effect
  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width * 100;
    const y = (e.clientY - top) / height * 100;
    
    setZoomPosition({ x, y });
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show error state
  if (error || !productData) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md mx-auto">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{error || "Product Not Found"}</h2>
          <p className="text-gray-600 mb-4">We couldn't find the product you're looking for.</p>
          <Link to="/shop" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const productImages = getProductImages();
  const productId = productData.id.toString();
  const averageRating = getAverageRating() || productData.rating || 0;
  const discountPercent = productData.discount || (productData.originalPrice ? Math.round((1 - productData.price / productData.originalPrice) * 100) : 0);
  const hasDiscount = discountPercent > 0;
  const estimatedDelivery = getEstimatedDelivery();
  
  const handleAddToCart = () => {
    try {
      addToCart({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        image: productData.image,
        quantity
      });
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart. Please try again.");
    }
  };
  
  const handleBuyNow = () => {
    try {
      addToCart({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        image: productData.image,
        quantity
      });
      navigate("/checkout");
    } catch (err) {
      console.error("Error processing buy now:", err);
      alert("Failed to process your purchase. Please try again.");
    }
  };
  
  const handleQuantityChange = (e) => {
    try {
      const newQuantity = parseInt(e.target.value);
      if (isNaN(newQuantity) || newQuantity < 1) return;
      
      setQuantity(newQuantity);
      
      // If product is already in cart, update quantity
      const cartItem = cartItems.find(item => item.id === id);
      if (cartItem) {
        updateQuantity(id, newQuantity);
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };
  
  const handleToggleWishlist = () => {
    try {
      const inWishlist = isInWishlist(productData.id);
      
      if (inWishlist) {
        removeFromWishlist(productData.id);
      } else {
        addToWishlist({
          id: productData.id,
          name: productData.name,
          price: productData.price,
          image: productData.image,
          description: productData.description
        });
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500 flex items-center flex-wrap">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <svg className="w-3 h-3 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
        </svg>
        <Link to="/shop" className="hover:text-blue-500">Shop</Link>
        <svg className="w-3 h-3 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
        </svg>
        <Link to={`/category/${productData.category.toLowerCase()}`} className="hover:text-blue-500">
          {productData.category}
        </Link>
        <svg className="w-3 h-3 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
        </svg>
        <span className="text-gray-700 truncate max-w-[200px]">{productData.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          {/* Main Image with Zoom */}
          <div 
            className="relative h-96 overflow-hidden rounded-lg border border-gray-200 bg-white"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img 
              src={productImages[selectedImage]} 
              alt={productData.name} 
              className={`w-full h-full object-contain transition-transform duration-200 ${isZoomed ? 'scale-150' : ''}`}
              style={isZoomed ? { 
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` 
              } : {}}
              onError={(e) => {
                // If the image fails to load, try the next one in sequence
                e.target.onerror = null;
                
                // Find the current index of this image in the productImages array
                const currentIndex = productImages.indexOf(e.target.src);
                const nextImageIndex = currentIndex + 1;
                
                // Try the next image if available
                if (nextImageIndex < productImages.length) {
                  e.target.src = productImages[nextImageIndex];
                } else {
                  // If all images fail, use a colored placeholder with product initials
                  const initials = productData.name
                    .split(' ')
                    .map(word => word.charAt(0))
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();
                    
                  // Generate a unique color based on product ID
                  const hue = parseInt(productData.id, 10) % 360;
                  const color = `hsl(${hue}, 70%, 65%)`;
                  
                  // Create SVG placeholder
                  e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='${encodeURIComponent(color)}'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='120' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${initials}%3C/text%3E%3C/svg%3E`;
                }
              }}
            />
            
            {/* Discount badge */}
            {hasDiscount && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                {discountPercent}% OFF
              </div>
            )}
          </div>
          
          {/* Thumbnail Images */}
          <div className="flex space-x-2 overflow-x-auto">
            {productImages.map((image, index) => (
              <div 
                key={index}
                className={`w-20 h-20 border cursor-pointer transition-all duration-200 ${selectedImage === index ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    
                    // Generate a unique color based on product ID and index
                    const hue = (parseInt(productData.id, 10) + (index * 30)) % 360;
                    const color = `hsl(${hue}, 70%, 65%)`;
                    
                    // Create a simple colored placeholder for thumbnails
                    e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          {/* Product Title & Brand */}
          <div className="mb-2">
            <div className="flex items-center gap-3 mb-1">
              <Link 
                to={`/brand/${productData.brand?.toLowerCase()}`} 
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                {productData.brand}
              </Link>
              {productData.isTopRated && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  ⭐ Top Rated
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{productData.name}</h1>
          </div>
          
          {/* Ratings */}
          <div className="flex items-center mb-4">
            <StarRating rating={averageRating} size="md" />
            <span className="ml-2 text-gray-600">
              {reviews.length || productData.numReviews || 0} reviews
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-baseline mb-4">
            <span className="text-3xl font-bold text-gray-900">
              ${(productData.price || 0).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="ml-3 text-lg text-gray-500 line-through">
                ${(productData.originalPrice || 0).toFixed(2)}
              </span>
            )}
            {hasDiscount && (
              <span className="ml-3 text-sm font-medium text-green-600">
                Save ${((productData.originalPrice - productData.price) || 0).toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {productData.category}
            </span>
            {productData.brand && (
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {productData.brand}
              </span>
            )}
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
              (productData.stock > 0 || productData.inStock) 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {(productData.stock > 0 || productData.inStock) 
                ? productData.stock > 10 
                  ? 'In Stock' 
                  : `Only ${productData.stock} left` 
                : 'Out of Stock'
              }
            </span>
          </div>
          
          {/* Description Summary */}
          <p className="text-gray-700 mb-6">{productData.description}</p>
          
          {/* Delivery Info */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Free Delivery</h3>
                <p className="text-sm text-gray-600">
                  Estimated: <span className="font-medium">{estimatedDelivery}</span>
                </p>
              </div>
            </div>
            {(productData.stock > 0 || productData.inStock) && (
              <p className="text-sm text-green-600 mt-2">
                <span className="font-medium">Order within 4 hours 32 minutes</span> to receive by {estimatedDelivery}
              </p>
            )}
          </div>
          
          {/* Quantity & Action Buttons */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <div className="relative flex items-center">
                <button 
                  type="button" 
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={!(productData.stock > 0 || productData.inStock)}
                  className="p-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <input
                  type="text"
                  id="quantity"
                  value={quantity}
                  readOnly
                  className="p-2 w-12 text-center border-y border-gray-300 focus:outline-none focus:ring-0"
                  disabled={!(productData.stock > 0 || productData.inStock)}
                />
                <button 
                  type="button" 
                  onClick={() => quantity < 10 && setQuantity(quantity + 1)}
                  disabled={!(productData.stock > 0 || productData.inStock)}
                  className="p-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12M6 12h12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="col-span-9 flex items-end gap-2">
              <button
                onClick={handleAddToCart}
                disabled={!(productData.stock > 0 || productData.inStock)}
                className={`flex-1 py-3 px-6 text-white font-medium rounded-md flex items-center justify-center gap-2 ${
                  (productData.stock > 0 || productData.inStock) 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                } transition-colors`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItems.some(item => item.id === productData.id) ? 'Update Cart' : 'Add to Cart'}
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={!(productData.stock > 0 || productData.inStock)}
                className={`flex-1 py-3 px-6 font-medium rounded-md ${
                  (productData.stock > 0 || productData.inStock) 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-400 text-white cursor-not-allowed'
                } transition-colors`}
              >
                Buy Now
              </button>
              
              <button 
                onClick={handleToggleWishlist} 
                className={`p-3 rounded-md border ${
                  isInWishlist(productData.id)
                    ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } transition-colors`}
                aria-label={isInWishlist(productData.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isInWishlist(productData.id) ? (
                  <svg 
                    className="w-6 h-6 fill-current" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg 
                    className="w-6 h-6" 
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
            </div>
          </div>
          
          {/* Product Info */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Brand</p>
                <p className="font-medium text-gray-900">{productData.brand || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Category</p>
                <p className="font-medium text-gray-900">{productData.category}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">SKU</p>
                <p className="font-medium text-gray-900">{productData.id}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Availability</p>
                <p className="font-medium text-gray-900">
                  {(productData.stock > 0 || productData.inStock) ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mb-12">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`${
                activeTab === 'description'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`${
                activeTab === 'specifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Reviews ({reviews.length || productData.numReviews || 0})
            </button>
          </nav>
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="mb-4">{productData.description}</p>
              <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
              <p>Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div className="prose max-w-none">
              {productData.features && productData.features.length > 0 ? (
                <>
                  <h3 className="text-lg font-medium mb-4">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-1 mb-6">
                    {productData.features.map((feature, index) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-lg font-medium mb-4">Technical Specifications</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="divide-y divide-gray-200">
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Brand</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{productData.brand}</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Category</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{productData.category}</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Weight</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.5 kg</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Dimensions</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10 × 10 × 10 cm</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Material</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Premium Quality</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p>No specifications available for this product.</p>
              )}
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                    <div className="flex flex-col">
                      <StarRating rating={averageRating} size="md" />
                      <span className="text-sm text-gray-500">{reviews.length || productData.numReviews || 0} reviews</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 max-w-md">
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-gray-500 w-8">5★</span>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-500 w-8 ml-2">70%</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-gray-500 w-8">4★</span>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-500 w-8 ml-2">20%</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-gray-500 w-8">3★</span>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-500 w-8 ml-2">5%</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-gray-500 w-8">2★</span>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '3%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-500 w-8 ml-2">3%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 w-8">1★</span>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '2%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-500 w-8 ml-2">2%</span>
                    </div>
                  </div>
                </div>
              </div>
            
              <ReviewList reviews={reviews} />
              <ReviewForm productId={productId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
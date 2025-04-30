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
  const { getProductReviews, getAverageRating } = useReview();
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  }, [id, navigate, cartItems]);
  
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
  
  const productId = productData.id.toString();
  const reviews = getProductReviews(productId);
  const averageRating = getAverageRating(productId);
  
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
  
  const renderStars = (rating) => {
    return <StarRating rating={rating} size="md" />;
  };
  
  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-500">Home</Link> / 
        <Link to="/shop" className="mx-1 hover:text-blue-500">Shop</Link> / 
        <span className="text-gray-700">{productData.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img 
            src={productData.image} 
            alt={productData.name} 
            className="w-full h-auto object-cover rounded-lg shadow-md" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{productData.name}</h1>
          
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {renderStars(averageRating || productData.rating || 0)}
            </div>
            <span className="text-gray-600">({reviews.length || productData.numReviews || 0} reviews)</span>
          </div>
          
          <p className="text-2xl font-semibold text-blue-600 mb-4">
            ${(productData.price || 0).toFixed(2)}
          </p>
          
          <div className="mb-4">
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${(productData.stock > 0 || productData.inStock) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {(productData.stock > 0 || productData.inStock) ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <p className="text-gray-700 mb-6">{productData.description}</p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={(productData.stock > 0 || productData.inStock) ? 10 : 0}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={!(productData.stock > 0 || productData.inStock)}
              />
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!(productData.stock > 0 || productData.inStock)}
              className={`flex-grow px-6 py-3 text-white font-medium rounded-md ${(productData.stock > 0 || productData.inStock) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {cartItems.some(item => item.id === productData.id) ? 'Update Cart' : 'Add to Cart'}
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={!(productData.stock > 0 || productData.inStock)}
              className={`px-6 py-3 text-white font-medium rounded-md ${(productData.stock > 0 || productData.inStock) ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Buy Now
            </button>
            
            <button 
              onClick={handleToggleWishlist} 
              className="p-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              aria-label={isInWishlist(productData.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isInWishlist(productData.id) ? (
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
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Category:</span> {productData.category}</p>
            <p className="text-sm text-gray-600"><span className="font-medium">SKU:</span> {productData.id}</p>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`${
                activeTab === 'description'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Reviews ({reviews.length})
            </button>
          </nav>
        </div>

        <div className="py-6">
          {activeTab === 'description' ? (
            <div className="prose max-w-none">
              {productData.features && productData.features.length > 0 ? (
                <>
                  <p>{productData.description}</p>
                  <h3 className="text-lg font-medium mt-4 mb-2">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {productData.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>{productData.description}</p>
              )}
            </div>
          ) : (
            <div>
              <ReviewList reviews={reviews} />
              <ReviewForm productId={productId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
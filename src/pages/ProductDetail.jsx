import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useReviews } from "../context/ReviewContext";
import mockProducts from "../data/mockProducts";
import StarRating from "../components/StarRating";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import WishlistButton from "../components/WishlistButton";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { getProductReviews, getAverageRating } = useReviews();
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Find the product by ID from our data
  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === parseInt(id) || p.id === id);
    
    if (foundProduct) {
      setProductData(foundProduct);
      
      // Check if this product is in cart already, set initial quantity
      const cartItem = cartItems.find(item => item.id === id);
      if (cartItem) {
        setQuantity(cartItem.quantity);
      }
    } else {
      navigate("/");
    }
  }, [id, navigate, cartItems]);
  
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  
  if (!productData) return null;
  
  const productId = productData.id.toString();
  const reviews = getProductReviews(productId);
  const averageRating = getAverageRating(productId);
  
  const handleAddToCart = () => {
    addToCart({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      image: productData.image,
      quantity
    });
  };
  
  const handleBuyNow = () => {
    addToCart({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      image: productData.image,
      quantity
    });
    navigate("/checkout");
  };
  
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
    
    // If product is already in cart, update quantity
    const cartItem = cartItems.find(item => item.id === id);
    if (cartItem) {
      updateQuantity(id, newQuantity);
    }
  };
  
  const toggleWishlist = () => {
    if (wishlist.includes(productData.id)) {
      setWishlist(wishlist.filter(id => id !== productData.id));
    } else {
      setWishlist([...wishlist, productData.id]);
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
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{productData.name}</h1>
          
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {renderStars(averageRating || productData.ratings?.average || 0)}
            </div>
            <span className="text-gray-600">({reviews.length || productData.ratings?.count || 0} reviews)</span>
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
              onClick={toggleWishlist} 
              className="p-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {wishlist.includes(productData.id) ? (
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
              <p>{productData.description}</p>
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
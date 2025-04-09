// src/components/ProductCard.jsx
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import WishlistButton from "./WishlistButton";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  if (!product) {
    return null;
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addToCart({
        ...product,
        quantity: 1,
        price: Number(product.price) || 0
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Safely get product properties with fallbacks
  const rating = product.ratings?.average || product.rating || 0;
  const reviewCount = product.ratings?.count || product.numReviews || 0;
  const price = Number(product.price) || 0;
  const image = product.image || "https://via.placeholder.com/300x200?text=No+Image";
  const name = product.name || "Unnamed Product";
  const description = product.description || "No description available";

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
          <div className="absolute top-2 right-2">
            <WishlistButton product={product} />
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold">{name}</h2>
          
          <div className="mt-1 mb-1">
            <StarRating rating={rating} size="sm" />
            {reviewCount > 0 && (
              <span className="text-sm text-gray-500 ml-1">({reviewCount})</span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-blue-600 font-bold">${price.toFixed(2)}</span>
            <div className="flex space-x-2">
              <button 
                onClick={handleAddToCart}
                className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition-colors duration-200"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
  
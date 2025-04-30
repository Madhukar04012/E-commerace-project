import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { flashProducts } from "../data/flashProducts";

const CountdownTimer = ({ timeLeft }) => {
  const formatNumber = (num) => String(num).padStart(2, "0");
  
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-red-500 rounded-lg px-4 py-2 text-white">
      <div className="text-sm font-medium">Ends in:</div>
      <div className="flex gap-1 items-center">
        <div className="bg-black/20 rounded px-2 py-1 min-w-[2.2rem] text-center">
          {formatNumber(hours)}
        </div>
        <span>:</span>
        <div className="bg-black/20 rounded px-2 py-1 min-w-[2.2rem] text-center">
          {formatNumber(minutes)}
        </div>
        <span>:</span>
        <div className="bg-black/20 rounded px-2 py-1 min-w-[2.2rem] text-center">
          {formatNumber(seconds)}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="min-w-[280px] bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 snap-start"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-100">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            src={imageError ? fallbackImage : product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-sm font-bold rounded">
            {product.discount}% OFF
          </div>
          {product.stock <= 10 && (
            <div className="absolute bottom-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs font-bold rounded">
              Only {product.stock} left!
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-gray-800 line-clamp-2">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-red-500">
              ${product.salePrice.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for images
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollLeft = () => {
    const container = document.getElementById('flash-sale-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('flash-sale-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 space-y-4">
                  <div className="bg-gray-200 rounded-lg aspect-square"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              🔥 Flash Sale
            </h2>
            <p className="text-gray-600">Limited-time offers. Don't miss out!</p>
          </div>
          <CountdownTimer timeLeft={timeLeft} />
        </div>

        <div className="relative group">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            disabled={timeLeft <= 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div
            id="flash-sale-container"
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {flashProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            disabled={timeLeft <= 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {timeLeft <= 0 && (
          <div className="text-center mt-8">
            <p className="text-lg text-gray-600">This flash sale has ended!</p>
            <p className="text-sm text-gray-500">Check back later for more deals</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FlashSale; 
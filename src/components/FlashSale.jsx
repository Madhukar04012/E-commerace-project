import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 58, seconds: 31 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              // Sale ended, reset the timer for demo purposes
              hours = 1;
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (num) => {
    return num.toString().padStart(2, '0');
  };

  const flashSaleProducts = [
    {
      id: 'headphones-001',
      name: 'Sony WH-1000XM4 Wireless Headphones',
      price: 248.00,
      originalPrice: 349.99,
      discount: 30,
      description: 'Industry-leading noise canceling with Dual Noise Sensor technology',
      image: '/images/products/headphones.jpg',
      category: 'Electronics',
      brand: 'Sony',
      rating: 4.8,
      numReviews: 1254,
      stock: 25,
      inStock: true
    },
    {
      id: 'watch-002',
      name: 'Apple Watch Series 8',
      price: 299.99,
      originalPrice: 399.99,
      discount: 25,
      description: 'Always-On Retina display, GPS, Heart Rate Monitoring',
      image: '/images/products/smartwatch.jpg',
      category: 'Electronics',
      brand: 'Apple',
      rating: 4.7,
      numReviews: 862,
      stock: 18,
      inStock: true
    },
    {
      id: 'macbook-003',
      name: 'MacBook Air M2',
      price: 899.99,
      originalPrice: 1199.99,
      discount: 25,
      description: 'Apple M2 chip, 13.6-inch Liquid Retina display',
      image: '/images/products/laptop.jpg',
      category: 'Electronics',
      brand: 'Apple',
      rating: 4.9,
      numReviews: 423,
      stock: 8,
      inStock: true
    },
    {
      id: 'tv-004',
      name: 'Samsung 65" QLED 4K TV',
      price: 779.99,
      originalPrice: 1299.99,
      discount: 40,
      description: 'Quantum HDR, Smart TV with Alexa Built-in',
      image: '/images/products/tv.jpg',
      category: 'Electronics',
      brand: 'Samsung',
      rating: 4.6,
      numReviews: 351,
      stock: 15,
      inStock: true
    },
    {
      id: 'ipad-005',
      name: 'iPad Pro 12.9"',
      price: 879.99,
      originalPrice: 1099.99,
      discount: 20,
      description: 'M2 chip, Liquid Retina XDR display',
      image: '/images/products/tablet.jpg',
      category: 'Electronics',
      brand: 'Apple',
      rating: 4.8,
      numReviews: 278,
      stock: 20,
      inStock: true
    },
    {
      id: 'earbuds-006',
      name: 'Bose QuietComfort Earbuds II',
      price: 199.99,
      originalPrice: 299.99,
      discount: 33,
      description: 'Wireless Noise Cancelling Earbuds',
      image: '/images/products/earbuds.jpg',
      category: 'Electronics',
      brand: 'Bose',
      rating: 4.7,
      numReviews: 182,
      stock: 12,
      inStock: true
    }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-2xl">🔥</span>
            <h2 className="text-2xl font-bold">Flash Sale</h2>
          </div>
          <Link to="/shop" className="text-blue-600 hover:underline flex items-center">
            View All
            <svg className="w-4 h-4 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        <p className="text-gray-600 mb-4">Limited-time offers. Don't miss out!</p>
        
        <div className="bg-white p-3 rounded-lg shadow-sm inline-flex items-center text-gray-700 mb-4">
          <span className="mr-2">Ends in:</span>
          <span className="font-mono text-lg font-semibold">
            {formatTime(timeLeft.hours)}
            <span className="text-gray-400 mx-1">:</span>
            {formatTime(timeLeft.minutes)}
            <span className="text-gray-400 mx-1">:</span>
            {formatTime(timeLeft.seconds)}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashSaleProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FlashSale; 
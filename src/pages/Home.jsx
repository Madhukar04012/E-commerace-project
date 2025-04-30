// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import FlashSale from '../components/FlashSale';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import SummerSale from '../components/SummerSale';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />
      
      {/* Summer Sale Banner */}
      <div className="mb-8">
        <SummerSale />
      </div>
      
      {/* Flash Sale Section */}
      <div className="py-8">
        <FlashSale />
      </div>
      
      {/* Categories Section */}
      <div className="py-8">
        <Categories />
      </div>
      
      {/* Featured Products Section */}
      <div className="py-8">
        <FeaturedProducts />
      </div>
    </div>
  );
};

export default Home;

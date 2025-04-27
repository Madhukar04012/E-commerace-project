// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import FlashDeals from '../components/FlashDeals';
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
      
      {/* Flash Deals Section */}
      <div className="py-8">
        <FlashDeals />
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

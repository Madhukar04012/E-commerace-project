// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import FlashSale from '../components/FlashSale';
import Categories from '../components/Categories';
import SummerSale from '../components/SummerSale';
import FeaturedProducts from '../components/FeaturedProducts';
import RecommendedProducts from '../components/RecommendedProducts';
import BrandShowcase from '../components/BrandShowcase';
import ProductCard from '../components/ProductCard';
import mockProducts from '../data/mockProducts';

const Home = () => {
  // Group products by category
  const groupedProducts = mockProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section>
        <Hero />
      </section>
      
      {/* Summer Sale Banner */}
      <section className="container mx-auto px-4">
        <SummerSale />
      </section>
      
      {/* Flash Sale Section */}
      <section className="container mx-auto px-4">
        <FlashSale />
      </section>
      
      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <Categories />
      </section>
      
      {/* Recommended Products Section */}
      <section className="container mx-auto px-4">
        <RecommendedProducts />
      </section>
      
      {/* Shop By Brands Section */}
      <section className="container mx-auto px-4">
        <BrandShowcase />
      </section>

      {/* Products by Category Section */}
      {Object.keys(groupedProducts).map((category) => (
        <section key={category} className="container mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{category}</h2>
              <Link
                to={`/category/${category.toLowerCase()}`}
                className="text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                View All
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {groupedProducts[category].slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;

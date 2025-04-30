import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ImageWithFallback from './ImageWithFallback';

// Brand data with name and logo
const brands = [
  { id: 1, name: 'Apple', logo: '/images/brands/apple.webp' },
  { id: 2, name: 'Samsung', logo: '/images/brands/samsung.webp' },
  { id: 3, name: 'Nike', logo: '/images/brands/nike.webp' },
  { id: 4, name: 'Adidas', logo: '/images/brands/adidas.webp' },
  { id: 5, name: 'Sony', logo: '/images/brands/sony.webp' },
  { id: 6, name: 'Microsoft', logo: '/images/brands/microsoft.webp' },
  { id: 7, name: 'LG', logo: '/images/brands/lg.webp' },
  { id: 8, name: 'Dell', logo: '/images/brands/dell.webp' }
];

const Brands = () => {
  const navigate = useNavigate();

  // Handle click on brand
  const handleBrandClick = (brandName) => {
    navigate(`/shop?brand=${brandName}`);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Shop by Brands</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">Explore top brands loved by millions</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {brands.map((brand) => (
            <motion.div
              key={brand.id}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
              onClick={() => handleBrandClick(brand.name)}
              whileHover={{ 
                scale: 1.05,
                rotate: 1,
                z: 20,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: brand.id * 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
            >
              <div className="h-16 flex items-center justify-center">
                <ImageWithFallback
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="max-h-16 w-auto object-contain"
                  width={120}
                  height={60}
                />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-600">{brand.name}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10"
        >
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Browse All Brands
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Brands; 
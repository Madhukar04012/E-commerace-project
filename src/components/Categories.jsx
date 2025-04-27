import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop',
    itemCount: 1250,
    featured: ['Smartphones', 'Laptops', 'Accessories'],
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 2,
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=500&fit=crop',
    itemCount: 2340,
    featured: ['Men\'s Wear', 'Women\'s Wear', 'Kids'],
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 3,
    name: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&h=500&fit=crop',
    itemCount: 1890,
    featured: ['Furniture', 'Decor', 'Kitchen'],
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 4,
    name: 'Books',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500&h=500&fit=crop',
    itemCount: 3420,
    featured: ['Fiction', 'Non-Fiction', 'Academic'],
    color: 'from-emerald-500 to-green-500'
  },
  {
    id: 5,
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&h=500&fit=crop',
    itemCount: 890,
    featured: ['Equipment', 'Clothing', 'Accessories'],
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 6,
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=500&fit=crop',
    itemCount: 1670,
    featured: ['Skincare', 'Makeup', 'Fragrances'],
    color: 'from-violet-500 to-purple-500'
  }
];

const Categories = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="px-4 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Shop by Category
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Explore our wide range of products across various categories. Each category is carefully curated to bring you the best selection.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transform-gpu perspective-1000"
              variants={cardVariants}
              whileHover={{
                rotateX: 5,
                rotateY: 5,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <Link to={`/category/${category.id}`} className="block h-full">
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300`} />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2 group-hover:transform group-hover:-translate-y-1 transition-transform duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm opacity-90">{category.itemCount.toLocaleString()} items</p>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">Featured Collections:</h4>
                  <ul className="space-y-2">
                    {category.featured.map((item, index) => (
                      <li
                        key={index}
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories; 
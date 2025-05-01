import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categoryData = [
    {
      id: 'electronics',
      name: 'Electronics',
      description: '1,250 items',
      path: '/category/electronics',
      image: '/images/categories/electronics.jpg',
      collections: ['Smartphones', 'Laptops', 'Accessories']
    },
    {
      id: 'fashion',
      name: 'Fashion',
      description: '2,340 items',
      path: '/category/clothing',
      image: '/images/categories/fashion.jpg',
      collections: ["Men's Wear", "Women's Wear", 'Kids']
    },
    {
      id: 'home',
      name: 'Home & Living',
      description: '1,890 items',
      path: '/category/furniture',
      image: '/images/categories/home.jpg',
      collections: ['Furniture', 'Decor', 'Kitchen']
    },
    {
      id: 'books',
      name: 'Books',
      description: '3,420 items',
      path: '/shop?category=books',
      image: '/images/categories/books.jpg',
      collections: ['Fiction', 'Non-Fiction', 'Academic']
    },
    {
      id: 'sports',
      name: 'Sports',
      description: '890 items',
      path: '/category/fitness',
      image: '/images/categories/sports.jpg',
      collections: ['Equipment', 'Clothing', 'Accessories']
    },
    {
      id: 'beauty',
      name: 'Beauty',
      description: '1,670 items',
      path: '/shop?category=beauty',
      image: '/images/categories/beauty.jpg',
      collections: ['Skincare', 'Makeup', 'Fragrances']
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link to="/shop" className="text-blue-600 hover:underline flex items-center">
            View All Categories
            <svg className="w-4 h-4 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        <p className="text-gray-600">Explore our wide range of products across various categories. Each category is carefully curated to bring you the best selection.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryData.map(category => (
          <Link 
            key={category.id}
            to={category.path}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                style={{ 
                  backgroundImage: `url(${category.image})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-gray-200 text-sm">{category.description}</p>
                  
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Featured Collections:</p>
                    <ul className="flex flex-wrap gap-2">
                      {category.collections.map((collection, index) => (
                        <li 
                          key={index}
                          className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded"
                        >
                          {collection}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories; 
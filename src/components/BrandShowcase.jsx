import React from 'react';
import { Link } from 'react-router-dom';

const BrandShowcase = () => {
  const brands = [
    {
      id: 'apple',
      name: 'Apple',
      logo: '/images/brands/apple.svg',
      link: '/shop?brand=apple'
    },
    {
      id: 'samsung',
      name: 'Samsung',
      logo: '/images/brands/samsung.svg',
      link: '/shop?brand=samsung'
    },
    {
      id: 'nike',
      name: 'Nike',
      logo: '/images/brands/nike.svg',
      link: '/shop?brand=nike'
    },
    {
      id: 'adidas',
      name: 'Adidas',
      logo: '/images/brands/adidas.svg',
      link: '/shop?brand=adidas'
    },
    {
      id: 'sony',
      name: 'Sony',
      logo: '/images/brands/sony.svg',
      link: '/shop?brand=sony'
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      logo: '/images/brands/microsoft.svg',
      link: '/shop?brand=microsoft'
    },
    {
      id: 'lg',
      name: 'LG',
      logo: '/images/brands/lg.svg',
      link: '/shop?brand=lg'
    },
    {
      id: 'dell',
      name: 'Dell',
      logo: '/images/brands/dell.svg',
      link: '/shop?brand=dell'
    }
  ];

  // Generate a color for brands without logos
  const getBrandColor = (brandId) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-orange-500'
    ];
    
    // Generate a consistent color based on the brand ID
    const index = brandId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Shop by Brands</h2>
          <Link to="/shop" className="text-blue-600 hover:underline flex items-center">
            Browse All Brands
            <svg className="w-4 h-4 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        <p className="text-gray-600">Explore top brands loved by millions</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4">
        {brands.map(brand => (
          <Link 
            key={brand.id} 
            to={brand.link}
            className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            {brand.logo ? (
              <img 
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="h-12 w-12 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`${getBrandColor(brand.id)} h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-xl`}
              style={{ display: brand.logo ? 'none' : 'flex' }}
            >
              {brand.name.charAt(0)}
            </div>
            <span className="mt-2 text-gray-800 font-medium">{brand.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrandShowcase; 
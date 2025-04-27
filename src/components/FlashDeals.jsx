import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FlashDeals = () => {
  const [activeDeals, setActiveDeals] = useState([
    {
      id: 1,
      title: "Gaming Laptops",
      discount: "Up to 40% Off",
      image: "/images/gaming-mouse.jpg",
      startTime: new Date(Date.now() + 3600000).getTime(), // 1 hour from now
      endTime: new Date(Date.now() + 7200000).getTime(), // 2 hours from now
    },
    {
      id: 2,
      title: "Smart Watches",
      discount: "30% Off",
      image: "/images/smartwatch.jpg",
      startTime: new Date(Date.now() + 7200000).getTime(), // 2 hours from now
      endTime: new Date(Date.now() + 10800000).getTime(), // 3 hours from now
    },
    {
      id: 3,
      title: "Wireless Earbuds",
      discount: "25% Off",
      image: "/images/headphones.jpg",
      startTime: new Date(Date.now() + 10800000).getTime(), // 3 hours from now
      endTime: new Date(Date.now() + 14400000).getTime(), // 4 hours from now
    }
  ]);

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const times = {};
      
      activeDeals.forEach(deal => {
        const difference = deal.startTime - now;
        
        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          times[deal.id] = { hours, minutes, seconds };
        } else {
          times[deal.id] = { hours: 0, minutes: 0, seconds: 0 };
        }
      });
      
      setTimeLeft(times);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeDeals]);

  return (
    <section className="px-4 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Flash Deals</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDeals.map((deal) => (
            <motion.div
              key={deal.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative h-48">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-2 rounded-bl-lg">
                  {deal.discount}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{deal.title}</h3>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-600">
                    Starts in:
                  </div>
                  <div className="flex space-x-2">
                    <div className="bg-gray-100 px-2 py-1 rounded">
                      {String(timeLeft[deal.id]?.hours).padStart(2, '0')}h
                    </div>
                    <div className="bg-gray-100 px-2 py-1 rounded">
                      {String(timeLeft[deal.id]?.minutes).padStart(2, '0')}m
                    </div>
                    <div className="bg-gray-100 px-2 py-1 rounded">
                      {String(timeLeft[deal.id]?.seconds).padStart(2, '0')}s
                    </div>
                  </div>
                </div>
                
                <Link
                  to={`/products/${deal.id}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Remind Me
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashDeals; 
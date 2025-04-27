import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SummerSale = () => {
  const [timeLeft, setTimeLeft] = useState('');
  // Set end date to 3 days from component mount
  const [endDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate - now;
      
      // Check if the end date has passed
      if (difference <= 0) {
        setTimeLeft('0d 0h 0m 0s');
        clearInterval(timer);
        return;
      }
      
      // Calculate time units (only for positive difference)
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 300 + 50 + 'px',
              height: Math.random() * 300 + 50 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.3
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Summer Sale is LIVE!
            </h1>
            <p className="text-xl mb-6 text-white/90">
              Get up to 70% off on selected items. Limited time offer!
            </p>
            
            {/* Countdown Timer */}
            <div className="flex gap-4 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center min-w-[100px]">
                <div className="text-3xl font-bold font-mono">{timeLeft.split(' ')[0]}</div>
                <div className="text-sm">Days</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center min-w-[100px]">
                <div className="text-3xl font-bold font-mono">{timeLeft.split(' ')[1]}</div>
                <div className="text-sm">Hours</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center min-w-[100px]">
                <div className="text-3xl font-bold font-mono">{timeLeft.split(' ')[2]}</div>
                <div className="text-sm">Minutes</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center min-w-[100px]">
                <div className="text-3xl font-bold font-mono">{timeLeft.split(' ')[3]}</div>
                <div className="text-sm">Seconds</div>
              </div>
            </div>

            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/summer-sale">
                <motion.button
                  className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop Now
                </motion.button>
              </Link>
              <motion.button
                className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Featured Product */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop"
              alt="Summer Sale Featured Product"
              className="rounded-lg shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-500"
            />
            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
              -70% OFF
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SummerSale; 
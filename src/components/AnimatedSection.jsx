import React from 'react';
import { motion } from 'framer-motion';

// Animation variants for sections
const sectionVariants = {
  hidden: { 
    opacity: 0, 
    y: 50 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

// Children animation variants for staggered effect
const childVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const AnimatedSection = ({ 
  children, 
  className = "", 
  id = "", 
  customVariants = null,
  viewportOptions = { once: true, margin: "-100px 0px" }
}) => {
  return (
    <motion.section
      id={id}
      className={`py-20 px-6 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
      variants={customVariants || sectionVariants}
    >
      {children}
    </motion.section>
  );
};

// Animated components for standardized animation inside sections
export const AnimatedHeading = ({ children, className = "", ...props }) => (
  <motion.h2 
    className={`text-3xl font-extrabold mb-6 ${className}`}
    variants={childVariants}
    {...props}
  >
    {children}
  </motion.h2>
);

export const AnimatedText = ({ children, className = "", ...props }) => (
  <motion.p 
    className={`mb-6 ${className}`}
    variants={childVariants}
    {...props}
  >
    {children}
  </motion.p>
);

export const AnimatedItem = ({ children, className = "", ...props }) => (
  <motion.div
    className={className}
    variants={childVariants}
    {...props}
  >
    {children}
  </motion.div>
);

export const AnimatedButton = ({ children, className = "", ...props }) => (
  <motion.button
    className={`py-3 px-6 rounded-lg hover:scale-105 hover:shadow-xl transition-all duration-300 ${className}`}
    variants={childVariants}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
    {...props}
  >
    {children}
  </motion.button>
);

export default AnimatedSection; 
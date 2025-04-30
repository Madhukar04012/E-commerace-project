import React from 'react';
import { motion } from 'framer-motion';
import Categories from '../components/Categories';
import FlashSale from '../components/FlashSale';
import SummerSale from '../components/SummerSale';
import Recommendations from '../components/Recommendations';
import Brands from '../components/Brands';
import AnimatedSection, { AnimatedHeading, AnimatedText } from '../components/AnimatedSection';
import SEO from '../components/SEO';
import { useToast } from '../context/ToastContext';

// Stagger delay for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const Landing = () => {
  const toast = useToast();

  // Welcome toast when page loads
  React.useEffect(() => {
    // Only show welcome toast once per session
    const hasShownWelcome = sessionStorage.getItem('hasShownWelcome');
    if (!hasShownWelcome) {
      setTimeout(() => {
        toast.success('Welcome to StyleShop! Explore our latest collections.');
        sessionStorage.setItem('hasShownWelcome', 'true');
      }, 1000);
    }
  }, [toast]);

  return (
    <>
      <SEO 
        title="StyleShop - Premium Fashion & Lifestyle Products"
        description="Discover our curated collection of premium fashion, accessories, and lifestyle products with exceptional quality and style."
        keywords="fashion, clothing, accessories, lifestyle, premium, style, online shopping"
      />
      
      <motion.div 
        className="space-y-12 min-h-screen"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <AnimatedSection>
          <SummerSale />
        </AnimatedSection>
        
        <AnimatedSection>
          <AnimatedHeading className="text-center mb-10">Limited Time Offers</AnimatedHeading>
          <FlashSale />
        </AnimatedSection>
        
        <AnimatedSection>
          <AnimatedHeading className="text-center mb-10">Recommended For You</AnimatedHeading>
          <AnimatedText className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover products tailored to your preferences and style.
          </AnimatedText>
          <Recommendations />
        </AnimatedSection>
        
        <AnimatedSection>
          <AnimatedHeading className="text-center mb-10">Shop By Brands</AnimatedHeading>
          <AnimatedText className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore our collection of premium brands with exceptional quality and style.
          </AnimatedText>
          <Brands />
        </AnimatedSection>
        
        <AnimatedSection>
          <AnimatedHeading className="text-center mb-10">Shop By Categories</AnimatedHeading>
          <AnimatedText className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Browse our curated selection of products by category.
          </AnimatedText>
          <Categories />
        </AnimatedSection>
      </motion.div>
    </>
  );
};

export default Landing; 
import React, { createContext, useContext, useState, useEffect } from 'react';

const ReviewContext = createContext();

export const useReviews = () => useContext(ReviewContext);

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState({});
  
  // Load reviews from localStorage on mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('productReviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);
  
  // Save reviews to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('productReviews', JSON.stringify(reviews));
  }, [reviews]);
  
  // Add a new review
  const addReview = (productId, review) => {
    const newReview = {
      ...review,
      id: Date.now(),
      date: new Date().toISOString()
    };
    
    setReviews(prevReviews => {
      const productReviews = prevReviews[productId] || [];
      return {
        ...prevReviews,
        [productId]: [...productReviews, newReview]
      };
    });
  };
  
  // Edit an existing review
  const editReview = (productId, reviewId, updatedReview) => {
    setReviews(prevReviews => {
      const productReviews = prevReviews[productId] || [];
      const updatedReviews = productReviews.map(review => 
        review.id === reviewId ? { ...review, ...updatedReview } : review
      );
      
      return {
        ...prevReviews,
        [productId]: updatedReviews
      };
    });
  };
  
  // Delete a review
  const deleteReview = (productId, reviewId) => {
    setReviews(prevReviews => {
      const productReviews = prevReviews[productId] || [];
      const updatedReviews = productReviews.filter(review => review.id !== reviewId);
      
      return {
        ...prevReviews,
        [productId]: updatedReviews
      };
    });
  };
  
  // Get all reviews for a product
  const getProductReviews = (productId) => {
    return reviews[productId] || [];
  };
  
  // Calculate average rating for a product
  const getAverageRating = (productId) => {
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) return 0;
    
    const sum = productReviews.reduce((total, review) => total + review.rating, 0);
    return sum / productReviews.length;
  };
  
  const value = {
    reviews,
    addReview,
    editReview,
    deleteReview,
    getProductReviews,
    getAverageRating
  };
  
  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
}; 
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getReviews, addReview, updateReview, deleteReview } from '../services/reviewService';

// Create the context
const ReviewContext = createContext(null);

export const ReviewProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load reviews
  const loadReviews = useCallback(async (productId) => {
    try {
      setLoading(true);
      const reviewData = await getReviews(productId);
      setReviews(reviewData);
      setError(null);
    } catch (err) {
      console.error("Error loading reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new review
  const createReview = useCallback(async (productId, reviewData) => {
    if (!currentUser) {
      setError("You must be logged in to submit a review");
      return null;
    }

    try {
      setLoading(true);
      const newReview = await addReview(productId, {
        ...reviewData,
        userId: currentUser.uid,
        userName: currentUser.displayName || "Anonymous User"
      });
      
      setReviews(prev => [...prev, newReview]);
      setError(null);
      return newReview;
    } catch (err) {
      console.error("Error adding review:", err);
      setError("Failed to submit review");
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Update an existing review
  const editReview = useCallback(async (reviewId, reviewData) => {
    if (!currentUser) {
      setError("You must be logged in to edit a review");
      return false;
    }

    try {
      setLoading(true);
      const success = await updateReview(reviewId, reviewData, currentUser.uid);
      
      if (success) {
        setReviews(prev => 
          prev.map(review => 
            review.id === reviewId ? { ...review, ...reviewData, updatedAt: new Date() } : review
          )
        );
        setError(null);
      } else {
        setError("You can only edit your own reviews");
      }
      
      return success;
    } catch (err) {
      console.error("Error updating review:", err);
      setError("Failed to update review");
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Remove a review
  const removeReview = useCallback(async (reviewId) => {
    if (!currentUser) {
      setError("You must be logged in to delete a review");
      return false;
    }

    try {
      setLoading(true);
      const success = await deleteReview(reviewId, currentUser.uid);
      
      if (success) {
        setReviews(prev => prev.filter(review => review.id !== reviewId));
        setError(null);
      } else {
        setError("You can only delete your own reviews");
      }
      
      return success;
    } catch (err) {
      console.error("Error deleting review:", err);
      setError("Failed to delete review");
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Check if user can review (hasn't reviewed this product yet)
  const canReview = useCallback((productId) => {
    if (!currentUser) return false;
    
    return !reviews.some(review => 
      review.userId === currentUser.uid && review.productId === productId
    );
  }, [currentUser, reviews]);

  // Calculate average rating
  const getAverageRating = useCallback(() => {
    if (!reviews.length) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  // Value provided by the context
  const value = {
    reviews,
    loading,
    error,
    loadReviews,
    createReview,
    editReview,
    removeReview,
    canReview,
    getAverageRating
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};

export default ReviewContext; 
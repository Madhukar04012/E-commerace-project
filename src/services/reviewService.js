import { db } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Fetches reviews for a specific product
 * @param {string} productId - The ID of the product to get reviews for
 * @returns {Promise<Array>} Array of review objects
 */
export const getReviews = async (productId) => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('productId', '==', productId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

/**
 * Adds a new review for a product
 * @param {string} productId - The ID of the product being reviewed
 * @param {Object} reviewData - Review data (rating, text, userId, userName)
 * @returns {Promise<Object>} Newly created review
 */
export const addReview = async (productId, reviewData) => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const newReview = {
      ...reviewData,
      productId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(reviewsRef, newReview);
    return {
      id: docRef.id,
      ...newReview,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

/**
 * Updates an existing review
 * @param {string} reviewId - ID of review to update
 * @param {Object} reviewData - Updated review data
 * @param {string} userId - ID of user making the update
 * @returns {Promise<boolean>} Success status
 */
export const updateReview = async (reviewId, reviewData, userId) => {
  try {
    // First check if this user owns the review
    const reviewRef = doc(db, 'reviews', reviewId);
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const userReviews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const reviewToUpdate = userReviews.find(review => review.id === reviewId);
    
    if (!reviewToUpdate) {
      return false; // User doesn't own this review
    }
    
    await updateDoc(reviewRef, {
      ...reviewData,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

/**
 * Deletes a review
 * @param {string} reviewId - ID of review to delete
 * @param {string} userId - ID of user making the deletion request
 * @returns {Promise<boolean>} Success status
 */
export const deleteReview = async (reviewId, userId) => {
  try {
    // First check if this user owns the review
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const userReviews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const reviewToDelete = userReviews.find(review => review.id === reviewId);
    
    if (!reviewToDelete) {
      return false; // User doesn't own this review
    }
    
    const reviewRef = doc(db, 'reviews', reviewId);
    await deleteDoc(reviewRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}; 
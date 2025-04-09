import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AddReview({ productId, onAddReview }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }
    
    // Create new review object
    const newReview = {
      id: Date.now(), // Simple unique ID for demo purposes
      userId: currentUser?.uid || 'guest',
      userName: currentUser?.email?.split('@')[0] || 'Guest User',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
    };
    
    onAddReview(newReview);
    
    // Reset form
    setRating(0);
    setComment('');
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        className="focus:outline-none"
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        onClick={() => setRating(star)}
      >
        <svg 
          className={`w-8 h-8 ${
            (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
          } cursor-pointer`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    ));
  };

  if (!currentUser) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
        <p className="text-center text-gray-600">
          Please <a href="/login" className="text-blue-600 hover:underline">sign in</a> to leave a review.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Your Rating</label>
          <div className="flex">
            {renderStars()}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Share your experience with this product..."
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
} 
import React, { useState } from 'react';
import { useReview } from '../hooks/useReview';
import { useAuth } from '../hooks/useAuth';
import StarRating from './StarRating';

export default function ReviewList({ reviews = [] }) {
  const { removeReview } = useReview();
  const { currentUser } = useAuth();
  const [sortBy, setSortBy] = useState('newest');
  
  // Sort reviews based on user selection
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
    } else if (sortBy === 'highest') {
      return b.rating - a.rating;
    } else if (sortBy === 'lowest') {
      return a.rating - b.rating;
    }
    return 0;
  });
  
  const handleDelete = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      removeReview(reviewId);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (reviews.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Customer Reviews ({reviews.length})</h3>
        <div>
          <label htmlFor="sort-by" className="text-sm text-gray-600 mr-2">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start">
              <div>
                <StarRating rating={review.rating} size="sm" />
                <h4 className="font-medium mt-2">{review.title || 'Review'}</h4>
              </div>
              
              {(currentUser?.uid === review.userId || currentUser?.isAdmin) && (
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
            
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span className="font-medium">{review.userName || review.username || 'Anonymous'}</span>
              {review.verified && (
                <span className="ml-2 text-green-600 text-xs border border-green-600 px-2 py-0.5 rounded-full">
                  Verified Buyer
                </span>
              )}
              <span className="ml-2">• {formatDate(review.createdAt || review.date)}</span>
            </div>
            
            <p className="mt-3 text-gray-700">{review.comment || review.text || ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 
import React, { useState } from 'react';
import { useReview } from '../hooks/useReview';
import { useAuth } from '../hooks/useAuth';

export default function ReviewForm({ productId, onSuccess }) {
  const { createReview, canReview } = useReview();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseInt(value, 10) : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Review title is required';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Review comment is required';
    } else if (formData.comment.length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!currentUser) {
      setErrors({
        auth: 'You must be logged in to submit a review'
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const review = {
        rating: formData.rating,
        title: formData.title,
        text: formData.comment,
        verified: true
      };
      
      await createReview(productId, review);
      
      // Reset form
      setFormData({
        rating: 5,
        title: '',
        comment: ''
      });
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      setErrors({
        submit: 'Failed to submit review. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // If user has already reviewed, don't show the form
  if (!canReview || !canReview(productId)) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">You've already reviewed this product.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Write a Review</h3>
      
      {errors.auth && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md">
          {errors.auth}
        </div>
      )}
      
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rating</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Summarize your experience"
            className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Review</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Share your experience with this product"
            rows="4"
            className={`w-full p-2 border rounded-md ${errors.comment ? 'border-red-500' : 'border-gray-300'}`}
          ></textarea>
          {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className={`${
            submitting 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white py-2 px-4 rounded-md transition duration-200`}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
} 
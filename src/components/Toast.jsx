import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Toast types with their respective styles
const TOAST_TYPES = {
  success: {
    bgColor: 'bg-green-500',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
    )
  },
  error: {
    bgColor: 'bg-red-500',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    )
  },
  info: {
    bgColor: 'bg-blue-500',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    )
  },
  warning: {
    bgColor: 'bg-yellow-500',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    )
  }
};

// Animation variants
const toastVariants = {
  hidden: { opacity: 0, y: -100, x: '-50%' },
  visible: { opacity: 1, y: 0, x: '-50%' },
  exit: { opacity: 0, y: -100, x: '-50%' }
};

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { bgColor, icon } = TOAST_TYPES[type] || TOAST_TYPES.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300); // Allow exit animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center min-w-[250px] max-w-md`}
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <div className="mr-3 flex-shrink-0">
            {icon}
          </div>
          <div className="mr-8 flex-grow">{message}</div>
          <button 
            onClick={() => setIsVisible(false)} 
            className="absolute top-2 right-2 text-white"
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast container to manage multiple toasts
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none flex flex-col items-center">
      {toasts.map((toast) => (
        <div key={toast.id} className="mb-2 mt-2 pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default Toast; 
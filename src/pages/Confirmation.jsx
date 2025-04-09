import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { downloadInvoice } from "../utils/invoiceGenerator";
import { useTranslation } from "react-i18next";

export default function Confirmation() {
  const { t } = useTranslation();
  const location = useLocation();
  const { orderId, orderDate } = location.state || {};
  const [order, setOrder] = useState(null);
  
  // Format the date if it exists
  const formattedDate = orderDate 
    ? new Date(orderDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  // Load order details from localStorage
  useEffect(() => {
    if (orderId) {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = orders.find(o => o.id.toString() === orderId.toString());
      if (foundOrder) {
        setOrder(foundOrder);
      }
    }
  }, [orderId]);
  
  // Handle invoice download
  const handleDownloadInvoice = () => {
    if (order) {
      downloadInvoice(order);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {t('confirmation.title')}
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          {t('confirmation.thank_you')}
        </p>
        
        {orderId && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg inline-block mx-auto">
            <p className="text-gray-700">
              <span className="font-medium">{t('confirmation.order_id')}:</span> {orderId}
            </p>
            {formattedDate && (
              <p className="text-gray-700">
                <span className="font-medium">{t('confirmation.order_date')}:</span> {formattedDate}
              </p>
            )}
          </div>
        )}

        <div className="border-t border-gray-200 pt-6 mt-2">
          <h2 className="text-xl font-semibold mb-4">{t('confirmation.whats_next')}</h2>
          <div className="text-left max-w-md mx-auto">
            <ol className="space-y-3 list-decimal list-inside text-gray-700">
              <li>{t('confirmation.steps.step1')}</li>
              <li>{t('confirmation.steps.step2')}</li>
              <li>{t('confirmation.steps.step3')}</li>
              <li>{t('confirmation.steps.step4')}</li>
            </ol>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200"
          >
            {t('common.continue_shopping')}
          </Link>
          
          {order && (
            <button
              onClick={handleDownloadInvoice}
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition duration-200"
            >
              {t('confirmation.download_invoice')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 
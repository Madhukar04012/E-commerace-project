import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getStripe, processPayment } from "../services/stripeService";
import { sendOrderConfirmationEmail } from "../services/emailService";

// Styles for the Stripe card element
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

// The inner checkout form with Stripe elements
function CheckoutForm() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cardError, setCardError] = useState(null);

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "address", "city", "state", "zip"];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    // Validate email format
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardChange = (event) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!stripe || !elements) return;
    
    setLoading(true);
    
    // Get card element
    const cardElement = elements.getElement(CardElement);
    
    // Create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    
    if (error) {
      setCardError(error.message);
      setLoading(false);
      return;
    }
    
    // Calculate totals
    const subtotal = cartTotal;
    const shipping = 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    // Create order object
    const order = {
      id: Math.floor(Math.random() * 1000000),
      date: new Date().toISOString(),
      items: cartItems,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email
      },
      shipping: {
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        }
      },
      payment: {
        id: paymentMethod.id,
        cardBrand: paymentMethod.card.brand,
        cardLast4: paymentMethod.card.last4
      },
      status: 'pending'
    };
    
    try {
      // Process payment (in a real app, this would call your backend)
      const paymentResult = await processPayment(
        { cardNumber: paymentMethod.card.last4 },
        order
      );
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || "Payment failed");
      }
      
      // Update order with payment info
      order.payment.id = paymentResult.paymentId;
      
      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Send confirmation email
      const user = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email
      };
      sendOrderConfirmationEmail(order, user);
      
      // Clear cart
      clearCart();
      
      // Navigate to confirmation page with order details
      navigate('/confirmation', { 
        state: { 
          orderId: order.id,
          orderDate: order.date
        } 
      });
    } catch (error) {
      console.error('Error processing order:', error);
      setCardError(error.message);
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cartTotal;
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div className="mb-6">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
              </div>
              
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.zip ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.zip && <p className="mt-1 text-sm text-red-500">{errors.zip}</p>}
              </div>
            </div>
            
            <div className="mb-8">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
            
            <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
            
            <div className="mb-6">
              <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-1">
                Credit or Debit Card *
              </label>
              <div className="border border-gray-300 p-3 rounded-md">
                <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} onChange={handleCardChange} />
              </div>
              {cardError && <p className="mt-1 text-sm text-red-500">{cardError}</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading || !stripe}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition duration-200 ${
                (loading || !stripe) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
            
            <p className="mt-4 text-sm text-gray-500 text-center">
              Your payment is securely processed. We never store your full credit card details.
            </p>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="max-h-80 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center py-3 border-b border-gray-200">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150?text=Product";
                      }}
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <p>Shipping</p>
                <p>${shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <p>Tax</p>
                <p>${tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 pt-2 border-t border-gray-200">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper component to provide Stripe context
export default function Checkout() {
  const stripePromise = getStripe();
  
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
} 
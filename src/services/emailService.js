// This is a mock email service for demonstration purposes
// In a real application, you would use a service like SendGrid, Mailgun, AWS SES, etc.

// Mock function to simulate sending emails (stores them in localStorage for demo purposes)
export const sendEmail = (to, subject, body, type = 'transaction') => {
  try {
    // Create email object
    const email = {
      id: Date.now(),
      to,
      subject,
      body,
      type,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };
    
    // In a real app, this is where you would call your email API
    console.log('Sending email:', email);
    
    // Store in localStorage for demo purposes
    const sentEmails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
    sentEmails.push(email);
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));
    
    return {
      success: true,
      emailId: email.id
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Email templates
export const EmailTemplates = {
  // Order confirmation email
  orderConfirmation: (order, user) => {
    const itemsList = order.items.map(item => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');
    
    return {
      subject: `Order Confirmation #${order.id}`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #4A5568;">Thank you for your order!</h1>
            <p style="font-size: 18px;">Order #${order.id}</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${user.name},</p>
            <p>Thank you for your purchase. We're currently processing your order and will notify you once it ships.</p>
            
            <h2 style="color: #4A5568; margin-top: 30px;">Order Summary</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                  <th style="padding: 10px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                  <td style="padding: 10px; text-align: right;">$${order.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Shipping:</td>
                  <td style="padding: 10px; text-align: right;">$${order.shipping.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Tax:</td>
                  <td style="padding: 10px; text-align: right;">$${order.tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px;">Total:</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px;">$${order.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            
            <h2 style="color: #4A5568; margin-top: 30px;">Shipping Information</h2>
            <p>
              ${order.shipping?.address?.street}<br>
              ${order.shipping?.address?.city}, ${order.shipping?.address?.state} ${order.shipping?.address?.zip}<br>
              ${order.shipping?.address?.country}
            </p>
            
            <p style="margin-top: 30px;">If you have any questions about your order, please contact our customer service team.</p>
            
            <p>Thank you for shopping with us!</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #718096; font-size: 14px;">
            <p>&copy; ${new Date().getFullYear()} Your E-commerce Store. All rights reserved.</p>
          </div>
        </div>
      `
    };
  },
  
  // Order shipped email
  orderShipped: (order, user, trackingInfo) => {
    return {
      subject: `Your Order #${order.id} Has Shipped!`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #4A5568;">Your Order Has Shipped!</h1>
            <p style="font-size: 18px;">Order #${order.id}</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${user.name},</p>
            <p>Good news! Your order has been shipped and is on its way to you.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h2 style="color: #4A5568; margin-top: 0;">Tracking Information</h2>
              <p><strong>Carrier:</strong> ${trackingInfo.carrier}</p>
              <p><strong>Tracking Number:</strong> ${trackingInfo.trackingNumber}</p>
              <p><strong>Estimated Delivery:</strong> ${trackingInfo.estimatedDelivery}</p>
              <p><a href="${trackingInfo.trackingUrl}" style="color: #4299e1; text-decoration: none; font-weight: bold;">Track Your Package</a></p>
            </div>
            
            <p>If you have any questions about your order, please contact our customer service team.</p>
            
            <p>Thank you for shopping with us!</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #718096; font-size: 14px;">
            <p>&copy; ${new Date().getFullYear()} Your E-commerce Store. All rights reserved.</p>
          </div>
        </div>
      `
    };
  },
  
  // Order delivered email
  orderDelivered: (order, user) => {
    return {
      subject: `Your Order #${order.id} Has Been Delivered!`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #4A5568;">Your Order Has Been Delivered!</h1>
            <p style="font-size: 18px;">Order #${order.id}</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${user.name},</p>
            <p>Your order has been delivered! We hope you enjoy your purchase.</p>
            
            <div style="margin: 20px 0; text-align: center;">
              <a href="#" style="display: inline-block; background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Write a Review</a>
            </div>
            
            <p>If you have any questions or concerns about your order, please contact our customer service team.</p>
            
            <p>Thank you for shopping with us!</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #718096; font-size: 14px;">
            <p>&copy; ${new Date().getFullYear()} Your E-commerce Store. All rights reserved.</p>
          </div>
        </div>
      `
    };
  },
  
  // Welcome email
  welcome: (user) => {
    return {
      subject: 'Welcome to Our Store!',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #4A5568;">Welcome to Our Store!</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${user.name},</p>
            <p>Thank you for creating an account with us. We're excited to have you as part of our community!</p>
            
            <p>With your new account, you can:</p>
            <ul>
              <li>Track orders and view order history</li>
              <li>Create a wishlist of your favorite products</li>
              <li>Receive exclusive offers and promotions</li>
              <li>Checkout faster with saved shipping information</li>
            </ul>
            
            <div style="margin: 20px 0; text-align: center;">
              <a href="#" style="display: inline-block; background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Shopping Now</a>
            </div>
            
            <p>If you have any questions, please don't hesitate to contact our customer service team.</p>
            
            <p>Happy shopping!</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #718096; font-size: 14px;">
            <p>&copy; ${new Date().getFullYear()} Your E-commerce Store. All rights reserved.</p>
          </div>
        </div>
      `
    };
  },
  
  // Password reset email
  passwordReset: (user, resetToken) => {
    return {
      subject: 'Password Reset Request',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #4A5568;">Password Reset Request</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${user.name},</p>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            
            <div style="margin: 20px 0; text-align: center;">
              <a href="#reset-link-with-token-${resetToken}" style="display: inline-block; background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            
            <p>This password reset link will expire in 1 hour.</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #718096; font-size: 14px;">
            <p>&copy; ${new Date().getFullYear()} Your E-commerce Store. All rights reserved.</p>
          </div>
        </div>
      `
    };
  }
};

// Utility to send order confirmation emails
export const sendOrderConfirmationEmail = (order, user) => {
  const { subject, body } = EmailTemplates.orderConfirmation(order, user);
  return sendEmail(user.email, subject, body, 'order_confirmation');
};

// Utility to send shipping confirmation emails
export const sendOrderShippedEmail = (order, user, trackingInfo) => {
  const { subject, body } = EmailTemplates.orderShipped(order, user, trackingInfo);
  return sendEmail(user.email, subject, body, 'order_shipped');
};

// Utility to send delivery confirmation emails
export const sendOrderDeliveredEmail = (order, user) => {
  const { subject, body } = EmailTemplates.orderDelivered(order, user);
  return sendEmail(user.email, subject, body, 'order_delivered');
};

// Utility to send welcome emails
export const sendWelcomeEmail = (user) => {
  const { subject, body } = EmailTemplates.welcome(user);
  return sendEmail(user.email, subject, body, 'welcome');
};

// Utility to send password reset emails
export const sendPasswordResetEmail = (user, resetToken) => {
  const { subject, body } = EmailTemplates.passwordReset(user, resetToken);
  return sendEmail(user.email, subject, body, 'password_reset');
}; 
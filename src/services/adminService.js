/**
 * Admin service functions for handling admin-related functionality
 */

// Mock function to get admin status
// In a real app, this would check a database or authentication provider
export const getAdminStatus = async (userId) => {
  // For demo purposes, simulate checking admin status
  // You can replace this with a real implementation later
  
  // Simulating an API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock admin status check - returns true for specific IDs
  const adminIds = ['admin1', 'admin2', 'admin@example.com'];
  return adminIds.includes(userId);
};

// Get list of users (admin function)
export const getUsers = async () => {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock user data
  return [
    { id: 'user1', email: 'user1@example.com', role: 'user', createdAt: new Date().toISOString() },
    { id: 'user2', email: 'user2@example.com', role: 'user', createdAt: new Date().toISOString() },
    { id: 'admin1', email: 'admin@example.com', role: 'admin', createdAt: new Date().toISOString() }
  ];
};

// Update user role (admin function)
export const updateUserRole = async (userId, role) => {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // In a real app, this would update the user's role in the database
  console.log(`Updated user ${userId} to role ${role}`);
  return { success: true };
}; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  });
  
  // Load data from localStorage on mount
  useEffect(() => {
    // Load products
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    
    // Load orders
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    
    // Load users
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    // Calculate stats
    updateStats();
  }, []);
  
  // Calculate dashboard statistics
  const updateStats = () => {
    // Get orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Calculate total sales
    const totalSales = savedOrders.reduce((total, order) => total + order.total, 0);
    
    setStats({
      totalSales,
      totalOrders: savedOrders.length,
      totalUsers: savedUsers.length,
      totalProducts: savedProducts.length
    });
  };
  
  // Product Management
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts, newProduct];
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
    
    updateStats();
  };
  
  const updateProduct = (id, updatedData) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product => 
        product.id === id ? { ...product, ...updatedData } : product
      );
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };
  
  const deleteProduct = (id) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.filter(product => product.id !== id);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
    
    updateStats();
  };
  
  // Order Management
  const updateOrderStatus = (orderId, status) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => 
        order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  };
  
  // User Management
  const updateUserRole = (userId, role) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => 
        user.id === userId ? { ...user, role } : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };
  
  // Check if current user is admin
  const isAdmin = currentUser?.role === 'admin';
  
  const value = {
    isAdmin,
    products,
    orders,
    users,
    stats,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    updateUserRole,
    updateStats
  };
  
  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 
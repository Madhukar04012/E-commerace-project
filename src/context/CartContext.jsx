import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getCart, updateCart, clearCart as clearFirestoreCart } from "../services/userDataService";
import { addToWishlist, removeFromWishlist, getWishlist } from "../services/userDataService";
import { CartContext } from "../hooks/useCart";

export const CartProvider = ({ children }) => {
  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  
  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  
  const { currentUser } = useAuth();

  // Load cart and wishlist data when user changes
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (currentUser) {
          const userCart = await getCart(currentUser.uid);
          if (userCart) {
            setCartItems(userCart);
            // Calculate totals
            const total = userCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const count = userCart.reduce((sum, item) => sum + item.quantity, 0);
            setCartTotal(total);
            setItemCount(count);
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadWishlist = async () => {
      setWishlistLoading(true);
      try {
        if (currentUser) {
          const userWishlist = await getWishlist(currentUser.uid);
          if (userWishlist) {
            setWishlistItems(userWishlist);
          }
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setWishlistLoading(false);
      }
    };

    loadCart();
    loadWishlist();
  }, [currentUser]);

  // Update totals when cart changes
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    setCartTotal(total);
    setItemCount(count);
  }, [cartItems]);

  // Update local storage when wishlist changes
  useEffect(() => {
    if (wishlistItems.length > 0) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, currentUser]);

  // Cart functions
  const addToCart = async (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    
    let updatedCart;
    if (existingItem) {
      // Update quantity if item already exists
      updatedCart = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) }
          : item
      );
    } else {
      // Add new item with quantity
      updatedCart = [...cartItems, { ...product, quantity: product.quantity || 1 }];
    }
    
    // Update state immediately for better UX
    setCartItems(updatedCart);
    
    // Calculate new totals
    const newTotal = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
    
    setCartTotal(newTotal);
    setItemCount(newCount);

    // Update Firestore if logged in
    if (currentUser) {
      try {
        await updateCart(currentUser.uid, updatedCart);
      } catch (error) {
        console.error("Error updating cart in Firestore:", error);
      }
    }
  };

  const removeFromCart = async (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    
    // Update state immediately for better UX
    setCartItems(updatedCart);
    
    // Calculate new totals
    const newTotal = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
    
    setCartTotal(newTotal);
    setItemCount(newCount);

    // Update Firestore if logged in
    if (currentUser) {
      try {
        await updateCart(currentUser.uid, updatedCart);
      } catch (error) {
        console.error("Error removing from cart in Firestore:", error);
      }
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    // Update state immediately for better UX
    setCartItems(updatedCart);

    // Calculate new totals
    const newTotal = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
    
    setCartTotal(newTotal);
    setItemCount(newCount);

    // Update Firestore if logged in
    if (currentUser) {
      try {
        await updateCart(currentUser.uid, updatedCart);
      } catch (error) {
        console.error("Error updating quantity in Firestore:", error);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    setCartTotal(0);
    setItemCount(0);

    if (currentUser) {
      try {
        await clearFirestoreCart(currentUser.uid);
      } catch (error) {
        console.error("Error clearing cart in Firestore:", error);
      }
    }
  };

  // Wishlist functions
  const addToWishlistHandler = async (product) => {
    if (!wishlistItems.some(item => item.id === product.id)) {
      const updatedWishlist = [...wishlistItems, product];
      setWishlistItems(updatedWishlist);
      
      if (currentUser) {
        try {
          await addToWishlist(currentUser.uid, product);
        } catch (error) {
          console.error("Error adding to wishlist:", error);
        }
      }
    }
  };

  const removeFromWishlistHandler = async (productId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    
    if (currentUser) {
      try {
        await removeFromWishlist(currentUser.uid, productId);
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    }
  };

  const moveToCart = async (productId) => {
    const item = wishlistItems.find(item => item.id === productId);
    if (item) {
      await addToCart(item);
      await removeFromWishlistHandler(productId);
    }
  };

  const moveAllToCart = async () => {
    for (const item of wishlistItems) {
      await addToCart(item);
    }
    setWishlistItems([]);
    if (currentUser) {
      // Clear wishlist in Firestore
    }
  };

  const value = {
    cartItems,
    cartTotal,
    itemCount,
    loading,
    wishlistItems,
    wishlistLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist: addToWishlistHandler,
    removeFromWishlist: removeFromWishlistHandler,
    moveToCart,
    moveAllToCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider; 
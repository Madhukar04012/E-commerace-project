import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getCart, updateCart, clearCart as clearFirestoreCart } from "../services/userDataService";
import { addToWishlist, removeFromWishlist, getWishlist } from "../services/userDataService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  // Load cart from Firestore if logged in, localStorage if not
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (currentUser) {
          // User is logged in, get cart from Firestore
          const cartData = await getCart(currentUser.uid);
          setCartItems(cartData.items || []);
          setCartTotal(cartData.total || 0);
          setItemCount(cartData.itemCount || 0);
        } else {
          // User is not logged in, get cart from localStorage
          const savedCart = localStorage.getItem('cart');
          const parsedCart = savedCart ? JSON.parse(savedCart) : [];
          setCartItems(parsedCart);
          
          // Calculate totals
          const total = parsedCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
          const count = parsedCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
          
          setCartTotal(total);
          setItemCount(count);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
  }, [currentUser]);

  // Load wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      setWishlistLoading(true);
      try {
        if (currentUser) {
          // User is logged in, get wishlist from Firestore
          const wishlistData = await getWishlist(currentUser.uid);
          setWishlistItems(wishlistData || []);
        } else {
          // User is not logged in, get wishlist from localStorage
          const savedWishlist = localStorage.getItem('wishlist');
          setWishlistItems(savedWishlist ? JSON.parse(savedWishlist) : []);
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setWishlistLoading(false);
      }
    };
    
    loadWishlist();
  }, [currentUser]);

  // Save cart to localStorage when not logged in
  useEffect(() => {
    if (!currentUser && cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser]);

  // Save wishlist to localStorage when not logged in
  useEffect(() => {
    if (!currentUser && wishlistItems.length > 0) {
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
    
    // Clear localStorage if not logged in
    if (!currentUser) {
      localStorage.removeItem('cart');
    } else {
      // Clear cart in Firestore
      try {
        await clearFirestoreCart(currentUser.uid);
      } catch (error) {
        console.error("Error clearing cart in Firestore:", error);
      }
    }
  };

  // Wishlist functions
  const addToWishlistHandler = async (product) => {
    // Check if product is already in wishlist
    const isInWishlistAlready = wishlistItems.some(item => item.id === product.id);
    
    if (isInWishlistAlready) return;
    
    // Simplified product for wishlist
    const wishlistProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description
    };
    
    // Update state immediately for better UX
    setWishlistItems(prev => [...prev, wishlistProduct]);
    
    // Update Firestore if logged in
    if (currentUser) {
      try {
        await addToWishlist(currentUser.uid, wishlistProduct);
      } catch (error) {
        console.error("Error adding to wishlist in Firestore:", error);
        // Revert state on error
        setWishlistItems(prev => prev.filter(item => item.id !== product.id));
      }
    }
  };

  const removeFromWishlistHandler = async (productId) => {
    // Update state immediately for better UX
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    
    // Update Firestore if logged in
    if (currentUser) {
      try {
        await removeFromWishlist(currentUser.uid, productId);
      } catch (error) {
        console.error("Error removing from wishlist in Firestore:", error);
        // If error, reload wishlist to sync with server
        const wishlistData = await getWishlist(currentUser.uid);
        setWishlistItems(wishlistData || []);
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const moveToCart = async (productId) => {
    const item = wishlistItems.find(item => item.id === productId);
    if (item) {
      await addToCart({...item, quantity: 1});
      await removeFromWishlistHandler(productId);
    }
  };

  const moveAllToCart = async () => {
    for (const item of wishlistItems) {
      await addToCart({...item, quantity: 1});
    }
    // Clear wishlist
    setWishlistItems([]);
    if (currentUser) {
      try {
        // In a real implementation, this would be a batch operation
        for (const item of wishlistItems) {
          await removeFromWishlist(currentUser.uid, item.id);
        }
      } catch (error) {
        console.error("Error moving all items to cart:", error);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        cartTotal,
        wishlistItems,
        addToWishlist: addToWishlistHandler,
        removeFromWishlist: removeFromWishlistHandler,
        isInWishlist,
        moveToCart,
        moveAllToCart,
        loading,
        wishlistLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext); 
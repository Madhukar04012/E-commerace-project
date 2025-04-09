import { 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";

// Collection references
const USERS_COLLECTION = "users";
const CARTS_COLLECTION = "carts";
const WISHLISTS_COLLECTION = "wishlists";

/**
 * Get user profile data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile
 */
export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error("User profile not found");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<boolean>} Success status
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    
    // Add updatedAt timestamp
    const updates = {
      ...profileData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updates);
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Add/update a user address
 * @param {string} userId - User ID
 * @param {Object} address - Address data
 * @param {boolean} isDefault - Set as default address
 * @returns {Promise<boolean>} Success status
 */
export const addUserAddress = async (userId, address, isDefault = false) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userSnap.data();
    const addresses = userData.addresses || [];
    
    // Generate address ID if not provided
    const addressId = address.id || Date.now().toString();
    const newAddress = { ...address, id: addressId };
    
    // Check if address already exists
    const existingIndex = addresses.findIndex(addr => addr.id === addressId);
    
    let updatedAddresses;
    
    if (existingIndex >= 0) {
      // Update existing address
      updatedAddresses = [...addresses];
      updatedAddresses[existingIndex] = newAddress;
    } else {
      // Add new address
      updatedAddresses = [...addresses, newAddress];
    }
    
    // Set default if requested
    if (isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
    }
    
    await updateDoc(userRef, {
      addresses: updatedAddresses,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error adding/updating address:", error);
    throw error;
  }
};

/**
 * Remove a user address
 * @param {string} userId - User ID
 * @param {string} addressId - Address ID
 * @returns {Promise<boolean>} Success status
 */
export const removeUserAddress = async (userId, addressId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userSnap.data();
    const addresses = userData.addresses || [];
    
    // Filter out the address to remove
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    
    await updateDoc(userRef, {
      addresses: updatedAddresses,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error removing address:", error);
    throw error;
  }
};

/**
 * Get user's wishlist
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Wishlist items
 */
export const getWishlist = async (userId) => {
  try {
    const docRef = doc(db, WISHLISTS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().items || [];
    } else {
      // Create empty wishlist if it doesn't exist
      await setDoc(docRef, { 
        items: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return [];
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};

/**
 * Add item to wishlist
 * @param {string} userId - User ID
 * @param {Object} product - Product to add
 * @returns {Promise<boolean>} Success status
 */
export const addToWishlist = async (userId, product) => {
  try {
    const docRef = doc(db, WISHLISTS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Update existing wishlist
      await updateDoc(docRef, {
        items: arrayUnion({ 
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          addedAt: new Date().toISOString()
        }),
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new wishlist
      await setDoc(docRef, {
        items: [{ 
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          addedAt: new Date().toISOString()
        }],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

/**
 * Remove item from wishlist
 * @param {string} userId - User ID
 * @param {string} productId - Product ID to remove
 * @returns {Promise<boolean>} Success status
 */
export const removeFromWishlist = async (userId, productId) => {
  try {
    const docRef = doc(db, WISHLISTS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return true; // Already not in wishlist
    }
    
    const wishlist = docSnap.data();
    const itemToRemove = wishlist.items.find(item => item.id === productId);
    
    if (!itemToRemove) {
      return true; // Already not in wishlist
    }
    
    await updateDoc(docRef, {
      items: arrayRemove(itemToRemove),
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};

/**
 * Get user's cart
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Cart data
 */
export const getCart = async (userId) => {
  try {
    const docRef = doc(db, CARTS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      // Create empty cart if it doesn't exist
      const emptyCart = { 
        items: [],
        total: 0,
        itemCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(docRef, emptyCart);
      return {
        id: userId,
        ...emptyCart
      };
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

/**
 * Update cart
 * @param {string} userId - User ID
 * @param {Array} items - Cart items
 * @returns {Promise<Object>} Updated cart
 */
export const updateCart = async (userId, items) => {
  try {
    const docRef = doc(db, CARTS_COLLECTION, userId);
    
    // Calculate totals
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const total = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const cartData = {
      items,
      itemCount,
      total,
      updatedAt: serverTimestamp()
    };
    
    // Check if cart exists
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      await updateDoc(docRef, cartData);
    } else {
      await setDoc(docRef, {
        ...cartData,
        createdAt: serverTimestamp()
      });
    }
    
    return {
      id: userId,
      ...cartData,
      items
    };
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

/**
 * Clear cart
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const clearCart = async (userId) => {
  try {
    const docRef = doc(db, CARTS_COLLECTION, userId);
    
    await updateDoc(docRef, {
      items: [],
      total: 0,
      itemCount: 0,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
}; 
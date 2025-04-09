import { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy
} from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create new user account
  async function signup(email, password, displayName) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: displayName || '',
        createdAt: new Date().toISOString(),
        role: 'customer',
        wishlist: [],
        addresses: []
      });
      
      return user;
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.message);
      throw error;
    }
  }

  // Login existing user
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.message);
      throw error;
    }
  }

  // Logout user
  async function logout() {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error("Error during logout:", error);
      setError(error.message);
      throw error;
    }
  }

  // Add a new order
  async function addOrder(orderData) {
    try {
      if (!currentUser) throw new Error("User must be logged in to place an order");
      
      // Create order document with user reference
      const orderRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        status: "pending"
      });
      
      // Return order with ID
      return {
        id: orderRef.id,
        ...orderData
      };
    } catch (error) {
      console.error("Error adding order:", error);
      setError(error.message);
      throw error;
    }
  }

  // Get user's orders
  async function getUserOrders() {
    try {
      if (!currentUser) return [];
      
      const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(ordersQuery);
      const orders = [];
      
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return orders;
    } catch (error) {
      console.error("Error getting user orders:", error);
      setError(error.message);
      return [];
    }
  }

  // Update order status (admin only)
  async function updateOrderStatus(orderId, status) {
    try {
      // This would typically check if user is admin
      // For demo purposes, we allow any logged in user
      if (!currentUser) throw new Error("User must be logged in");
      
      const orderRef = doc(db, "orders", orderId);
      await setDoc(orderRef, { status }, { merge: true });
      
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      setError(error.message);
      throw error;
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // If user is logged in, get their profile data
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            // Create user profile if it doesn't exist (first login)
            const newUserProfile = {
              email: user.email,
              displayName: user.displayName || '',
              createdAt: new Date().toISOString(),
              role: 'customer',
              wishlist: [],
              addresses: []
            };
            
            await setDoc(docRef, newUserProfile);
            setUserProfile(newUserProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    error,
    signup,
    login,
    logout,
    addOrder,
    getUserOrders,
    updateOrderStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 
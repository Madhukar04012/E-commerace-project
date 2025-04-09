import { db } from "./config";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

// User Profile Functions
export async function getUserProfile(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(userId, profileData) {
  try {
    await setDoc(doc(db, "users", userId), profileData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Order Functions
export async function createOrder(userId, orderData) {
  try {
    const ordersRef = collection(db, "orders");
    const orderDoc = doc(ordersRef);
    const order = {
      ...orderData,
      userId,
      orderId: orderDoc.id,
      createdAt: new Date().toISOString(),
    };
    await setDoc(orderDoc, order);
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function getUserOrders(userId) {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
} 
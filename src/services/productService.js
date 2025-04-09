import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";

// Collection references
const PRODUCTS_COLLECTION = "products";
const CATEGORIES_COLLECTION = "categories";
const REVIEWS_COLLECTION = "reviews";

// Firestore collection references
const productsRef = collection(db, PRODUCTS_COLLECTION);
const categoriesRef = collection(db, CATEGORIES_COLLECTION);
const reviewsRef = collection(db, REVIEWS_COLLECTION);

// Mock data for development until Firestore is populated
import mockProducts from '../data/mockProducts';

/**
 * Get products with optional filtering, sorting, and pagination
 * @param {Object} options - Query options
 * @param {string} options.category - Filter by category
 * @param {number} options.minPrice - Minimum price
 * @param {number} options.maxPrice - Maximum price
 * @param {boolean} options.inStock - Filter by in stock status
 * @param {string} options.sortBy - Sort field
 * @param {string} options.sortDirection - Sort direction ('asc' or 'desc')
 * @param {number} options.limit - Limit results
 * @param {object} options.lastVisible - Last document for pagination
 * @returns {Promise<Object>} Object containing products, lastVisible, and hasMore
 */
export const getProducts = async (options = {}) => {
  // Until we populate Firestore, use mock data
  if (process.env.NODE_ENV === 'development' && mockProducts.length > 0) {
    console.log('Using mock product data');
    
    let filteredProducts = [...mockProducts];
    
    // Apply category filter if provided
    if (options.category) {
      filteredProducts = filteredProducts.filter(
        product => product.category === options.category
      );
    }
    
    // Apply search filter if provided
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply price range filter if provided
    if (options.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        product => product.price >= options.minPrice
      );
    }
    
    if (options.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        product => product.price <= options.maxPrice
      );
    }
    
    // Apply sorting
    if (options.sortBy) {
      const sortField = options.sortBy;
      const sortOrder = options.sortDirection === 'desc' ? -1 : 1;
      
      filteredProducts.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortOrder;
        if (a[sortField] > b[sortField]) return 1 * sortOrder;
        return 0;
      });
    }
    
    // Apply pagination
    let paginatedProducts = filteredProducts;
    if (options.page && options.pageSize) {
      const startIndex = (options.page - 1) * options.pageSize;
      paginatedProducts = filteredProducts.slice(
        startIndex, 
        startIndex + options.pageSize
      );
    }
    
    return {
      products: paginatedProducts,
      lastVisible: null, // Not needed for mock data
      hasMore: paginatedProducts.length < filteredProducts.length
    };
  }
  
  try {
    // Build the query
    let q = productsRef;
    
    // Apply filters
    if (options.category) {
      q = query(q, where('category', '==', options.category));
    }
    
    // Apply price range filters
    if (options.minPrice !== undefined) {
      q = query(q, where('price', '>=', options.minPrice));
    }
    
    if (options.maxPrice !== undefined) {
      q = query(q, where('price', '<=', options.maxPrice));
    }
    
    // Apply sorting
    if (options.sortBy) {
      const direction = options.sortDirection === 'desc' ? 'desc' : 'asc';
      q = query(q, orderBy(options.sortBy, direction));
    } else {
      // Default sort by createdAt
      q = query(q, orderBy('createdAt', 'desc'));
    }
    
    // Apply pagination
    if (options.pageSize) {
      q = query(q, limit(options.pageSize));
    }
    
    // Apply startAfter for pagination
    if (options.lastVisible) {
      q = query(q, startAfter(options.lastVisible));
    }
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    
    // Transform the results
    const products = [];
    querySnapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Get the last visible document for pagination
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    // Determine if there are more results
    let hasMore = false;
    if (options.pageSize && querySnapshot.docs.length === options.pageSize) {
      // Check if there's at least one more document
      const nextQuery = query(
        productsRef, 
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(1)
      );
      const nextSnapshot = await getDocs(nextQuery);
      hasMore = !nextSnapshot.empty;
    }
    
    return { products, lastVisible, hasMore };
    
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

/**
 * Get a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product object
 */
export const getProductById = async (id) => {
  // Use mock data for development
  if (process.env.NODE_ENV === 'development' && mockProducts.length > 0) {
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  }
  
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

/**
 * Add a new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Added product with ID
 */
export const addProduct = async (productData) => {
  try {
    // Add timestamps
    const productWithTimestamps = {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(productsRef, productWithTimestamps);
    
    return {
      id: docRef.id,
      ...productWithTimestamps
    };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<boolean>} Success status
 */
export const updateProduct = async (id, productData) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    
    // Add timestamp for update
    const updates = {
      ...productData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updates);
    
    return {
      id: id,
      ...updates
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Get all categories
 * @returns {Promise<Array>} Array of categories
 */
export const getCategories = async () => {
  // Use mock data for development
  if (process.env.NODE_ENV === 'development') {
    // Extract unique categories from mock products
    const categories = [...new Set(mockProducts.map(p => p.category))];
    return categories.map(name => ({ id: name.toLowerCase(), name }));
  }
  
  try {
    const querySnapshot = await getDocs(categoriesRef);
    
    const categories = [];
    querySnapshot.forEach(doc => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

/**
 * Get product reviews
 * @param {string} productId - Product ID
 * @returns {Promise<Array>} Array of reviews
 */
export const getProductReviews = async (productId) => {
  try {
    const q = query(
      reviewsRef,
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const reviews = [];
    querySnapshot.forEach(doc => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return reviews;
  } catch (error) {
    console.error('Error getting product reviews:', error);
    throw error;
  }
};

/**
 * Add a product review
 * @param {Object} reviewData - Review data
 * @returns {Promise<Object>} Added review with ID
 */
export const addProductReview = async (reviewData) => {
  try {
    // Add server timestamp
    const reviewWithTimestamp = {
      ...reviewData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), reviewWithTimestamp);
    
    return {
      id: docRef.id,
      ...reviewData
    };
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}; 
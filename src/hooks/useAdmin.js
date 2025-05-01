import { useContext } from "react";
import AdminContext from "../context/AdminContext";

/**
 * Custom hook to access admin status information
 * @returns {Object} Admin context information
 */
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default useAdmin; 
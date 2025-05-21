import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

// Admin email - replace this with your actual admin email
const ADMIN_EMAIL = "parularora1703@gmail.com";

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(() => {
    // Initialize from localStorage if available
    const savedAdmin = localStorage.getItem('isAdmin');
    return savedAdmin === 'true';
  });

  useEffect(() => {
    // Check if user is admin based on email
    if (user && user.email === ADMIN_EMAIL) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
    } else if (!user) {
      setIsAdmin(false);
      localStorage.removeItem('isAdmin');
    }
  }, [user]);

  const loginAdmin = () => {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', 'true');
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <AdminContext.Provider value={{ isAdmin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);

export default AdminContext;


















// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useAuth } from './AuthContext';

// const AdminContext = createContext();

// // Admin email - replace this with your actual admin email
// const ADMIN_EMAIL = "parularora1703@gmail.com";

// export const AdminProvider = ({ children }) => {
//   const { user } = useAuth();
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     // Check if user is admin based on email
//     if (user && user.email === ADMIN_EMAIL) {
//       setIsAdmin(true);
//     } else {
//       setIsAdmin(false);
//     }
//   }, [user]);

//   const loginAdmin = () => {
//     setIsAdmin(true);
//   };

//   const logoutAdmin = () => {
//     setIsAdmin(false);
//   };

//   return (
//     <AdminContext.Provider value={{ isAdmin, loginAdmin, logoutAdmin }}>
//       {children}
//     </AdminContext.Provider>
//   );
// };

// export const useAdmin = () => useContext(AdminContext);

// export default AdminContext;
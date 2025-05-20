import { useState, useEffect } from 'react';

const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('adminToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(!!localStorage.getItem('adminToken'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return isAdmin;
};

export default useAdmin;

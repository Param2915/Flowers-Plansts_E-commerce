import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const useProductSearch = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [error, setError] = useState(null);
  
  // For tracking if component is mounted
  const isMounted = useRef(true);
  
  // For debugging API calls
  const lastRequest = useRef({ url: '', timestamp: null });

  // Fetch products based on search and sort
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build the query string with search and sort parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (sortOption) params.append('sort', sortOption);
      
      const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
      
      // Log the request for debugging
      console.log(`[${new Date().toISOString()}] Fetching products from: ${url}`);
      lastRequest.current = { url, timestamp: new Date() };
      
      const { data } = await axios.get(url);
      
      console.log(`[${new Date().toISOString()}] Received ${data.length} products`);
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setProducts(data);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      
      // Log the error details for debugging
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (isMounted.current) {
        setError(err.response?.data?.message || 'Failed to load products');
        setLoading(false);
        toast.error('Failed to load products. Please try again.');
      }
    }
  };
  
  // Effect to fetch products on mount and when search/sort changes
  useEffect(() => {
    isMounted.current = true;
    fetchProducts();
    
    return () => {
      isMounted.current = false;
    };
  }, [searchTerm, sortOption]); // This will re-run when either search or sort changes
  
  // Handle search button click
  const handleSearch = () => {
    fetchProducts();
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle sort changes
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    // The useEffect will automatically trigger fetchProducts
  };

  return {
    products,
    loading,
    error,
    searchTerm,
    setSearchTerm: handleSearchChange,
    sortOption,
    setSortOption: handleSortChange,
    handleSearch,
    refetch: fetchProducts
  };
};

export default useProductSearch;
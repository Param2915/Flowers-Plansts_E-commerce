import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Set up axios instance with the base URL
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // To support cookies (authentication)
});

// API Calls
export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
export const getProducts = () => api.get("/products");
export const addToCart = (data) => api.post("/auth/addproduct", data);
export const getCart = (userId) => api.get(`/auth/getshoppingcart?user_id=${userId}`);
export const addToFavorites = (data) => api.post("/auth/addtofavorites", data);
export const getFavorites = (userId) => api.get(`/auth/getfavorites?user_id=${userId}`);

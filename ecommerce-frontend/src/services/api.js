import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach session token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sessionToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// --- Products ---
export const getProducts = () => api.get('/product/List');
export const getProductById = (id) => api.get(`/product/get/${id}`);
export const addProduct = (product) => api.post('/product/add', product);
export const deleteProduct = (id) => api.delete(`/product/delete/${id}`);

// --- Categories ---
export const getCategories = () => api.get('/category/list');
export const addCategory = (category) => api.post('/category/add', category);
export const deleteCategory = (id) => api.delete(`/category/delete/${id}`);

// --- Suppliers ---
export const getSuppliers = () => api.get('/supplier/list');
export const getSupplierById = (id) => api.get(`/supplier/get/${id}`);
export const addSupplier = (supplier) => api.post('/supplier/add', supplier);
export const updateSupplier = (id, supplier) => api.put(`/supplier/update/${id}`, supplier);
export const deleteSupplier = (id) => api.delete(`/supplier/delete/${id}`);

// --- Orders ---
export const getOrders = () => api.get('/order/list');
export const addOrder = (order) => api.post('/order/add', order);
export const deleteOrder = (id) => api.delete(`/order/delete/${id}`);

// --- Carts ---
export const getCarts = () => api.get('/cart/list');
export const addCart = (cart) => api.post('/cart/add', cart);
export const deleteCart = (id) => api.delete(`/cart/delete/${id}`);

// --- Auth ---
export const authSignup = (email) => api.post('/api/auth/signup', { email });
export const authLogin = (email, password) => api.post('/api/auth/login', { email, password });
export const authLogout = () => api.post('/api/auth/logout');
export const authMe = () => api.get('/api/auth/me');
export const authChangePassword = (currentPassword, newPassword) =>
  api.post('/api/auth/change-password', { currentPassword, newPassword });

// --- Super Admin: User Management ---
export const getAllUsers = () => api.get('/api/auth/users');
export const updateUserRole = (userId, role) => api.put(`/api/auth/users/${userId}/role`, { role });
export const deleteUser = (userId) => api.delete(`/api/auth/users/${userId}`);

export default api;

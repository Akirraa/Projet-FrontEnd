import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = () => api.get('/product/List');
export const getProductById = (id) => api.get(`/product/get/${id}`);
export const addProduct = (product) => api.post('/product/add', product);
export const deleteProduct = (id) => api.delete(`/product/delete/${id}`);

export const getCategories = () => api.get('/category/list');
export const addCategory = (category) => api.post('/category/add', category);
export const deleteCategory = (id) => api.delete(`/category/delete/${id}`);

export const getSuppliers = () => api.get('/supplier/list');
export const getSupplierById = (id) => api.get(`/supplier/get/${id}`);
export const addSupplier = (supplier) => api.post('/supplier/add', supplier);
export const updateSupplier = (id, supplier) => api.put(`/supplier/update/${id}`, supplier);
export const deleteSupplier = (id) => api.delete(`/supplier/delete/${id}`);

export const getOrders = () => api.get('/order/list');
export const addOrder = (order) => api.post('/order/add', order);
export const deleteOrder = (id) => api.delete(`/order/delete/${id}`);

export const getCarts = () => api.get('/cart/list');
export const addCart = (cart) => api.post('/cart/add', cart);
export const deleteCart = (id) => api.delete(`/cart/delete/${id}`);

export default api;

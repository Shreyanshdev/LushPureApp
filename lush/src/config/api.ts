
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000'; // Replace with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Address Routes
export const addAddress = (addressData: any) => api.post('/addresses', addressData);
export const getAddresses = async () => {
  const userId = await AsyncStorage.getItem('userId');
  return api.get('/addresses', {
    params: {
      userId,
    },
  });
};
export const updateAddress = (addressId: string, addressData: any) => api.put(`/addresses/${addressId}`, addressData);
export const deleteAddress = (addressId: string) => api.delete(`/addresses/${addressId}`);

// Auth Routes
export const customerLogin = (credentials: any) => api.post('/customer/login', credentials);
export const deliveryLogin = (credentials: any) => api.post('/delivery/login', credentials);
export const refreshToken = () => api.post('/auth/refresh-token');
export const logout = () => api.post('/auth/logout');
export const fetchUser = () => api.get('/user');
export const updateUser = (userData: any) => api.put('/user/', userData);
export const getProfile = () => api.get('/user/profile');
export const updateProfile = (profileData: any) => api.put('/user/profile', profileData);


// Order Routes
export const createOrder = (orderData: any) => api.post('/order', orderData);
export const getOrders = (customerId?: string) => {
  return api.get('/order', {
    params: {
      constumerId: customerId // Typo in backend, keeping for now
    }
  });
};
export const getOrderById = (orderId: string) => api.get(`/order/${orderId}`);
export const confirmOrder = (orderId: string) => api.post(`/order/${orderId}/confirm`);
export const updateOrderStatus = (orderId: string, statusData: any) => api.patch(`/order/${orderId}/status`, statusData);

// Payment Routes
export const createPaymentOrder = (orderData: any) => api.post('/create-order', orderData);
export const verifyPayment = (paymentData: any) => api.post('/verify-payment', paymentData);

// Product Routes
export const getAllProducts = () => api.get('/products');
export const getProductByCategoryId = (categoryId: string) => api.get(`/products/${categoryId}`);
export const getProductById = (productId: string) => api.get(`/product/${productId}`);
export const getAllCategories = () => api.get('/categories');

// Subscription Routes
export const createSubscription = (subscriptionData: any) => api.post('/subscriptions', subscriptionData);
export const getSubscription = (id: string) => api.get(`/subscriptions/${id}`);
export const updateSubscription = (id: string, subscriptionData: any) => api.put(`/subscriptions/${id}`, subscriptionData);
export const cancelSubscription = (id: string) => api.patch(`/subscriptions/${id}/cancel`);

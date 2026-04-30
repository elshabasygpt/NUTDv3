import axios from 'axios';
import type { Product, Dealer, Order, SearchFilters, ApiResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Products
export const getProducts = async (filters?: SearchFilters): Promise<{ data: Product[], total: number, totalPages: number, currentPage: number }> => {
  const params = new URLSearchParams();
  if (filters?.query) params.set('q', filters.query);
  if (filters?.brand) params.set('brand', filters.brand);
  if (filters?.category) params.set('category', filters.category);
  if (filters?.lang) params.set('lang', filters.lang);
  if (filters?.page) params.set('page', filters.page.toString());
  if (filters?.limit) params.set('limit', filters.limit.toString());
  
  const res = await api.get<ApiResponse<Product[]>>(`/products?${params}`);
  return {
    data: res.data.data,
    total: res.data.total || 0,
    totalPages: res.data.totalPages || 1,
    currentPage: res.data.currentPage || 1
  };
};

export const getProduct = async (id: string, lang?: string): Promise<Product> => {
  const res = await api.get<ApiResponse<Product>>(`/products/${id}?lang=${lang || 'ar'}`);
  return res.data.data;
};

// Dealers
export const getDealers = async (lat?: number, lng?: number): Promise<Dealer[]> => {
  const params = lat && lng ? `?lat=${lat}&lng=${lng}` : '';
  const res = await api.get<ApiResponse<Dealer[]>>(`/dealers${params}`);
  return res.data.data;
};

// Orders
export const createOrder = async (data: Partial<Order>): Promise<Order> => {
  const res = await api.post<ApiResponse<Order>>('/orders', data);
  return res.data.data;
};

export const getDealerOrders = async (userId: string): Promise<Order[]> => {
  const res = await api.get<ApiResponse<Order[]>>(`/orders?userId=${userId}`);
  return res.data.data;
};

export default api;

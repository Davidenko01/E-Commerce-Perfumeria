import type { Brand, Product, ProductFilters, Showroom } from '../types';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

export async function getBrands(): Promise<Brand[]> {
  const response = await api.get('/brands');
  return response.data;
}

export async function getShowroom(): Promise<Showroom> {
  const response = await api.get('/showroom');
  return response.data;
}

export async function getProduct(id: number): Promise<Product> {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const response = await api.get('/products', { params: filters });
  return response.data;
}
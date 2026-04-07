export interface Brand {
  id: number;
  name: string;
  description: string;
  type: string;
  logoUrl: string;
}

export interface ProductFilters {
  search?: string;
  brand?: string;
  gender?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  inStock?: boolean;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  inStock: boolean;
  stockQuantity?: number;
  gender: 'man' | 'woman' | 'unisex';
  type: 'designer' | 'niche' | 'arabic';
  imageUrl?: string;
}

export interface Showroom  {
  name: string,
  address: string,
  city: string,
  phone: string,
  email: string,
  instagram: string,
  schedule: string,
}
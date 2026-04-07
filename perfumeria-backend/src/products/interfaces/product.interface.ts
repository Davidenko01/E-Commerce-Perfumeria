export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  discountPercentage?: number;
  inStock: boolean;
  stockQuantity?: number;
  gender: 'man' | 'woman' | 'unisex';
  type: 'designer' | 'niche' | 'arabic';
  imageUrl?: string;
}
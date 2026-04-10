export interface Product {
  id: number;
  name: string;
  brandId: number;
  description: string;
  price: number;
  discountPercentage?: number;
  isActive: boolean;
  stockQuantity: number;
  volume: number;
  gender: 'man' | 'woman' | 'unisex';
  type: 'designer' | 'niche' | 'arabic';
  concentration?: 'EF' | 'EDC' | 'EDT' | 'EDP' | 'Parfum' | 'Elixir';
  imageUrl?: string;
}

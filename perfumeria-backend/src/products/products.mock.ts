import { Product } from './interfaces/product.interface';

export const PRODUCTS_MOCK: Product[] = [
  {
    id: 1,
    name: 'Bleu de Chanel',
    brandId: 1, // Asumiendo que 1 es Chanel
    description: 'Fragancia fresca y amaderada con notas de cítricos y cedro.',
    price: 85000,
    isActive: true,
    stockQuantity: 15,
    volume: 100,
    gender: 'man',
    type: 'designer',
    concentration: 'EDP'
  },
  {
    id: 2,
    name: 'Black Orchid',
    brandId: 2, // Tom Ford
    description: 'Floral oscuro y lujoso con orquídea negra y especias.',
    price: 140000,
    discountPercentage: 15,
    isActive: true,
    stockQuantity: 8,
    volume: 50,
    gender: 'unisex',
    type: 'niche',
    concentration: 'Parfum'
  },
  {
    id: 3,
    name: "La Nuit de L'Homme",
    brandId: 3, // Yves Saint Laurent
    description: 'Oriental especiado con cardamomo, cedro y almizcle.',
    price: 72000,
    isActive: true, // Sigue activo en el catálogo...
    stockQuantity: 0, // ...pero no tiene stock actualmente
    volume: 100,
    gender: 'man',
    type: 'designer',
    concentration: 'EDT'
  },
  {
    id: 4,
    name: 'Baccarat Rouge 540',
    brandId: 4, // Maison Francis Kurkdjian
    description: 'Amaderado floral con jazmín, azafrán y cedro de Cachemira.',
    price: 320000,
    isActive: true,
    stockQuantity: 3,
    volume: 70,
    gender: 'unisex',
    type: 'niche',
    concentration: 'EDP'
  },
  {
    id: 5,
    name: 'Oud Ispahan',
    brandId: 5, // Dior
    description: 'Oud intenso y amaderado con rosa de Damasco.',
    price: 180000,
    discountPercentage: 10,
    isActive: true,
    stockQuantity: 5,
    volume: 125,
    gender: 'unisex',
    type: 'arabic',
    concentration: 'EDP'
  },
  {
    id: 6,
    name: 'Chance Eau Tendre',
    brandId: 1, // Chanel
    description: 'Floral frutal con pomelo, jazmín y almizcle blanco.',
    price: 88000,
    isActive: true,
    stockQuantity: 12,
    volume: 100,
    gender: 'woman',
    type: 'designer',
    concentration: 'EDT'
  },
  {
    id: 7,
    name: 'Rose Oud',
    brandId: 6, // Lattafa
    description: 'Rosa intensa con oud ahumado, tradicional árabe.',
    price: 45000,
    isActive: false, // Producto pausado/inactivo
    stockQuantity: 0,
    volume: 100,
    gender: 'woman',
    type: 'arabic',
    concentration: 'EDP'
  },
  {
    id: 8,
    name: 'Aventus',
    brandId: 7, // Creed
    description: 'Frutal amaderado con piña, abedul y almizcle.',
    price: 410000,
    isActive: true,
    stockQuantity: 4,
    volume: 100,
    gender: 'man',
    type: 'niche',
    concentration: 'EDP'
  },
  {
    id: 9,
    name: 'Invictus',
    brandId: 8, // Paco Rabanne
    description: 'Frescura vibrante con pomelo, notas marinas y madera de gaiac.',
    price: 82000,
    isActive: true,
    stockQuantity: 20,
    volume: 100,
    gender: 'man',
    type: 'designer',
    concentration: 'EDT'
  },
  {
    id: 10,
    name: '1 Million Lucky',
    brandId: 8, // Paco Rabanne
    description: 'Dulce y amaderado con notas de ciruela, avellana y miel.',
    price: 95000,
    isActive: true,
    stockQuantity: 6,
    volume: 100,
    gender: 'man',
    type: 'designer',
    concentration: 'EDT'
  },
  {
    id: 11,
    name: 'Gentleman Réserve Privée',
    brandId: 9, // Givenchy
    description: 'Elegancia pura con iris, notas de whisky y maderas ambarinas.',
    price: 115000,
    discountPercentage: 5,
    isActive: true,
    stockQuantity: 10,
    volume: 100,
    gender: 'man',
    type: 'designer',
    concentration: 'EDP'
  }
];
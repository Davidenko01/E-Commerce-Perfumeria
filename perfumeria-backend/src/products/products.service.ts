import { Injectable, NotFoundException} from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { PRODUCTS_MOCK } from './products.mock';
import { ProductFilters } from './interfaces/product-filters.interface';


@Injectable()
export class ProductsService {
  //Lista de productos en MOCK para simular una base de datos
  private products: Product[] = PRODUCTS_MOCK;

  //Buscar productos con filtros opcionales
  findAll(filters: ProductFilters): Product[] {

    //Copia de la lista de productos para aplicar los filtros sin modificar el original
    let result = [...this.products];

    //Filtro de búsqueda por texto en nombre, marca o descripción
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      );
    }

    //Filtro por marca exacta
    if (filters.brand) {
    const targetBrand = filters.brand.toLowerCase();
    
    result = result.filter(
        (p) => p.brand.toLowerCase() === targetBrand
    );
    }

    //Filtro por género
    if (filters.gender) {
      result = result.filter((p) => p.gender === filters.gender);
    }
    //Filtro por tipo
    if (filters.type) {
      result = result.filter((p) => p.type === filters.type);
    }

    //Filtro por rango de precio
    if (filters.minPrice) {
      const targetMinPrice = filters.minPrice;
      result = result.filter((p) => p.price >= targetMinPrice);
    }
    //Filtro por precio máximo
    if (filters.maxPrice) {
      const targetMaxPrice = filters.maxPrice;
      result = result.filter((p) => p.price <= targetMaxPrice);
    }
    // filtro por productos en oferta
    if (filters.onSale !== undefined) {
      result = result.filter((p) =>
        filters.onSale ? p.discountPercentage !== undefined : p.discountPercentage === undefined
      );
    }

    // filtro por productos en stock
    if (filters.inStock !== undefined) {
      result = result.filter((p) => p.inStock === filters.inStock);
    }

    return result;
  }

  //Buscar un producto por su ID
  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
}
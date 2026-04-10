import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { PRODUCTS_MOCK } from './products.mock';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  //Lista de productos en MOCK para simular una base de datos
  private products: Product[] = PRODUCTS_MOCK;
  private nextId = PRODUCTS_MOCK.length + 1;

  //Buscar productos con filtros opcionales
  findAll(filters: GetProductsFilterDto) {
    //Copia de la lista de productos para aplicar los filtros sin modificar el original
    let result = [...this.products];

    //Filtro de búsqueda por texto en nombre, marca o descripción
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brandId.toString().toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
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

    if (filters.concentration) {
      const targetConcentration = filters.concentration;
      result = result.filter((p) => p.concentration === targetConcentration);
    }
    // filtro por productos en oferta
    if (filters.onSale !== undefined) {
      result = result.filter((p) =>
        filters.onSale
          ? p.discountPercentage !== undefined
          : p.discountPercentage === undefined,
      );
    }

    // filtro por productos en stock
    if (filters.inStock !== undefined) {
      result = result.filter((p) => p.stockQuantity > 0);
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

  create(product: CreateProductDto): Product {
    const newProduct: Product = {
      id: this.nextId++,
      ...product,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, product: CreateProductDto): Product {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products[index] = { id, ...product };
    return this.products[index];
  }

  partialUpdate(id: number, product: Partial<CreateProductDto>): Product {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products[index] = { ...this.products[index], ...product };
    return this.products[index];
  }

  delete(id: number) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products.splice(index, 1);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from './brand.interface';
import { BRAND_MOCKS } from './brand.mock';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandsService {
  private brands: Brand[] = BRAND_MOCKS;
  private nextId = BRAND_MOCKS.length + 1;

  findAll(): Brand[] {
    return this.brands;
  }

  findOne(id: number): Brand {
    const brand = this.brands.find((brand) => brand.id === id);
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  create(brand: CreateBrandDto): Brand {
        const newBrand: Brand = {
          id: this.nextId++,
          ...brand,
        };
        this.brands.push(newBrand);
        return newBrand;
  }

  update(id: number, brand: CreateBrandDto): Brand {
    const index = this.brands.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    this.brands[index] = { id, ...brand };
    return this.brands[index];
  }

  partialUpdate(id: number, brand: Partial<CreateBrandDto>): Brand {
    const index = this.brands.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    this.brands[index] = { ...this.brands[index], ...brand };
    return this.brands[index];
  }

  delete(id: number) {
    const index = this.brands.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    this.brands.splice(index, 1);
  }
}

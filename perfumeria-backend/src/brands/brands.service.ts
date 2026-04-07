import { Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from './brand.interface';
import { BRAND_MOCKS } from './brand.mock';
@Injectable()
export class BrandsService {

    private brands: Brand[] = BRAND_MOCKS;

    findAll(): Brand[] {
        return this.brands;
    }

    findOne(id: number): Brand {
        const brand = this.brands.find(brand => brand.id === id);
        if (!brand) {
            throw new NotFoundException(`Brand with ID ${id} not found`);
        }
        return brand;
    }
}

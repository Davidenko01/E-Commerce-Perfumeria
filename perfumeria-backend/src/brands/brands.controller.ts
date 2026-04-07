import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BrandsService } from './brands.service';
import type { Brand } from './brand.interface';

@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) {}

    @Get()
    findAll(): Brand[] {
        return this.brandsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Brand {
        return this.brandsService.findOne(id);
    }

}

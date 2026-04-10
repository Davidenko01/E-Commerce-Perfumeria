import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.findOne(id);
  }

  @Post()
    create(@Body() brand: CreateBrandDto) {
      return this.brandsService.create(brand);  
    }

  @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() brand: CreateBrandDto) {
      return this.brandsService.update(id, brand);
    }

  @Patch(':id')
    partialUpdate(@Param('id', ParseIntPipe) id: number, @Body() brand: Partial<CreateBrandDto>) {
      return this.brandsService.partialUpdate(id, brand);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
      return this.brandsService.delete(id);
    }
}

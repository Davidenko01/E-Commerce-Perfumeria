import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import type { Product } from './interfaces/product.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: GetProductsFilterDto): Product[] {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Product {
    return this.productsService.findOne(id);
  }
}
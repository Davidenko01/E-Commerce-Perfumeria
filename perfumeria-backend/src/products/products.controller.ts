import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: GetProductsFilterDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() product: CreateProductDto) {
    return this.productsService.create(product);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() product: CreateProductDto) {
    return this.productsService.update(id, product);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  partialUpdate(@Param('id', ParseIntPipe) id: number, @Body() product: UpdateProductDto) {
    return this.productsService.partialUpdate(id, product); 
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }
}


import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { BrandsModule } from './brands/brands.module';
import { ShowroomModule } from './showroom/showroom.module'

@Module({
  imports: [ProductsModule, BrandsModule, ShowroomModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

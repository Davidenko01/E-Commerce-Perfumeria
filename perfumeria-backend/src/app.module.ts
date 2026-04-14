import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { BrandsModule } from './brands/brands.module';
import { ShowroomModule } from './showroom/showroom.module'
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ProductsModule, BrandsModule, ShowroomModule, UsersModule, PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

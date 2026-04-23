import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { MarcasModule } from './marcas/marcas.module';
import { ShowroomModule } from './showroom/showroom.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ProductsModule,
    MarcasModule,
    ShowroomModule,
    UsersModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

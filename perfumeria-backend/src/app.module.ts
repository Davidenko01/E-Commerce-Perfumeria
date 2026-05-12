import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { MarcasModule } from './marcas/marcas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ShowroomModule } from './showroom/showroom.module';
import { UsuariosModule } from './users/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CarritoModule } from './carrito/carrito.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { VariantesModule } from './variantes/variantes.module';
import { validate } from './config/env.validation';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      envFilePath: '.env',
    }),
    ProductosModule,
    MarcasModule,
    CategoriasModule,
    ShowroomModule,
    UsuariosModule,
    PrismaModule,
    AuthModule,
    CarritoModule,
    PedidosModule,
    VariantesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

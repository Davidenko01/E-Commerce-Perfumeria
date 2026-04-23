import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { MarcasModule } from './marcas/marcas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ShowroomModule } from './showroom/showroom.module';
import { UsuariosModule } from './users/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ProductosModule,
    MarcasModule,
    CategoriasModule,
    ShowroomModule,
    UsuariosModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { AgregarItemCarritoDto } from './dto/agregar-item.dto';
import { ActualizarItemCarritoDto } from './dto/actualizar-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('carrito')
@UseGuards(JwtAuthGuard)
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Get()
  getMiCarrito(@Request() req: any) {
    const usuarioId = req.user.id;
    return this.carritoService.findByUsuario(usuarioId);
  }

  @Post('items')
  agregarItem(@Request() req: any, @Body() dto: AgregarItemCarritoDto) {
    const usuarioId = req.user.id;
    return this.carritoService.agregarItem(usuarioId, dto);
  }

  @Put('items/:varianteId')
  actualizarItem(
    @Request() req: any,
    @Param('varianteId', ParseIntPipe) varianteId: number,
    @Body() dto: ActualizarItemCarritoDto,
  ) {
    const usuarioId = req.user.id;
    return this.carritoService.actualizarItem(usuarioId, varianteId, dto);
  }

  @Delete('items/:varianteId')
  quitarItem(
    @Request() req: any,
    @Param('varianteId', ParseIntPipe) varianteId: number,
  ) {
    const usuarioId = req.user.id;
    return this.carritoService.quitarItem(usuarioId, varianteId);
  }

  @Delete()
  vaciarCarrito(@Request() req: any) {
    const usuarioId = req.user.id;
    return this.carritoService.vaciarCarrito(usuarioId);
  }
}

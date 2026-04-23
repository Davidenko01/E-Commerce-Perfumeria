import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { ActualizarEstadoPedidoDto } from './dto/actualizar-estado-pedido.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { JwtUser } from '../auth/interfaces/jwt-user.interface';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getMisPedidos(@Request() req: { user: JwtUser }) {
    return this.pedidosService.findByUsuario(req.user.id);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAllPedidos() {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getPedido(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: JwtUser },
  ) {
    return this.pedidosService.findOne(id, req.user.id);
  }

  @Get('numero/:nroPedido')
  @UseGuards(JwtAuthGuard)
  getPedidoPorNumero(@Param('nroPedido') nroPedido: string) {
    return this.pedidosService.findByNroPedido(nroPedido);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  crearPedido(@Request() req: { user: JwtUser }, @Body() dto: CrearPedidoDto) {
    return this.pedidosService.create(req.user.id, dto);
  }

  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarEstadoPedidoDto,
  ) {
    return this.pedidosService.updateEstado(id, dto);
  }
}

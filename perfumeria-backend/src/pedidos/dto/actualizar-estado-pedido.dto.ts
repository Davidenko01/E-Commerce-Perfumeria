import { IsEnum, IsOptional } from 'class-validator';

export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
  EN_PREPARACION = 'EN_PREPARACION',
  LISTO_RETIRO = 'LISTO_RETIRO',
  DESPACHADO = 'DESPACHADO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

export class ActualizarEstadoPedidoDto {
  @IsOptional()
  @IsEnum(EstadoPedido)
  estado: EstadoPedido;
}

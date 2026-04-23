import { IsEnum, IsOptional } from 'class-validator';

export class ActualizarEstadoPedidoDto {
  @IsOptional()
  @IsEnum([
    'PENDIENTE',
    'CONFIRMADO',
    'EN_PREPARACION',
    'LISTO_RETIRO',
    'DESPACHADO',
    'ENTREGADO',
    'CANCELADO',
  ])
  estado: string;
}

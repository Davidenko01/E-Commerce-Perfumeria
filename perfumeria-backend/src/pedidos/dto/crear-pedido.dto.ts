import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CrearPedidoDto {
  @IsNotEmpty()
  @IsEnum(['ENVIO', 'RETIRO'])
  tipoEntrega: 'ENVIO' | 'RETIRO';

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  telefonoContacto?: string;

  @IsOptional()
  @IsString()
  direccionEnvio?: string;

  @IsOptional()
  @IsString()
  ciudadEnvio?: string;

  @IsOptional()
  @IsString()
  provinciaEnvio?: string;

  @IsOptional()
  @IsString()
  codigoPostalEnvio?: string;
}

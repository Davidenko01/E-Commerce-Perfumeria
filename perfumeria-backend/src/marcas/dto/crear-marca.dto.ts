import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CrearMarcaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  paisOrigen?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}
